<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import * as jsonld from "jsonld";
// import init, * as oxigraph from "oxigraph/web";
import type { Option, ScoreValueObj } from "~/types";

register(z);

// doesn't supported nested objects yet
function schemaCreateEmptyObject(schema: z.AnyZodObject): any {
    return Object.entries(schema.shape).reduce((obj, [key, val]) => {
        obj[key] = structuredClone(val.getMeta().initial);
        return obj;
    }, {});
}

function removeEmptyValues(obj: any): any {
    return Object.entries(obj).reduce((a, [k, v]) => (v === "" ? a : (a[k] = v, a)), {}); // TODO: check for equal to initial value
}

const SPARQL_URL = "https://api.idnau.org/sparql";

async function sparqlOptions(url: string, query: string): Promise<Option[]> {
    const r = await fetch(`${url}?query=${encodeURIComponent(query)}`);
    const results = await r.json();
    const options: Option[] = results.results.bindings.map(result => {
        return {
            value: result.value.value,
            label: result.label.value
        };
    });
    options.sort((a, b) => a.label.localeCompare(b.label));
    return options;
}

const { data: themeOptions } = await useAsyncData("themeOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label
    WHERE {
        BIND(<https://data.idnau.org/pid/vocab/idn-th> AS ?cs)
        ?cs a skos:ConceptScheme .
        ?value a skos:Concept ;
            skos:inScheme ?cs ;
            skos:prefLabel ?label .
    }`));

const { data: accessRightsOptions } = await useAsyncData("accessRightsOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label
    WHERE {
        BIND(<https://linked.data.gov.au/def/data-access-rights> AS ?cs)
        ?cs a skos:ConceptScheme .
        ?value a skos:Concept ;
            skos:inScheme ?cs ;
            skos:prefLabel ?label .
    }`));

const { data: roleOptions } = await useAsyncData("roleOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label
    WHERE {
        BIND(<https://linked.data.gov.au/def/data-roles> AS ?cs)
        ?cs a skos:ConceptScheme .
        ?value a skos:Concept ;
            skos:inScheme ?cs ;
            skos:prefLabel ?label .
    }`));

const schema = z.object({
    iri: z.string().min(1, "IRI is required").url({ message: "Must be a valid IRI" }).describe("a description").meta({
        label: "IRI",
        type: "url",
        placeholder: "https://example.com",
        initial: "",
    }),
    title: z.string().min(1, "Title is required").describe("a description").meta({
        label: "Title",
        type: "text",
        initial: "",
    }),
    description: z.string().min(1, "Description is required").describe("a description").meta({
        label: "Description",
        type: "textarea",
        initial: "",
    }),
    rights: z.string().optional().describe("a description").meta({
        label: "Rights",
        type: "text",
        initial: "",
    }),
    theme: z.string().array().min(2, "Must have at least two themes selected").describe("a description").meta({
        label: "Theme",
        type: "select", // string array/select array is multiple
        placeholder: "Choose themes",
        initial: [],
        options: themeOptions.value,
    }),
    accessRights: z.string().optional().describe("a description").meta({
        label: "Access Rights",
        type: "select", // select string is single
        placeholder: "Select an access right",
        initial: "",
        options: accessRightsOptions.value,
    }),
    // object array is dynamic adding of a group of inputs
    agentRole: z.object({
        agent: z.string().min(1, "Agent is required").describe("a description").meta({
            label: "Agent",
            type: "select", // select string is single
            placeholder: "Choose an agent",
            initial: "",
            options: [
                { label: "agent 1", value: "https://example.com/agent/1" },
                { label: "agent 2", value: "https://example.com/agent/2" },
                { label: "agent 3", value: "https://example.com/agent/3" },
            ],
        }),
        role: z.string().array().min(1, "Role is required").describe("a description").meta({
            label: "Role",
            type: "select", // string array/select array is multiple
            placeholder: "Choose roles",
            initial: [],
            options: roleOptions.value,
        }),
    }).array().min(1, "Must have an agent and role selected").meta({
        label: "Agents",
        type: "add",
        initial: [{agent: "", role: []}],
    }),
});

const data = ref<z.infer<typeof schema>>(schemaCreateEmptyObject(schema));

const fair = ref({} as ScoreValueObj);
const care = ref({} as ScoreValueObj);

const context = {
    "@version": 1.1,
    // prefixes
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcterms": "http://purl.org/dc/terms/",
    "geo": "http://www.opengis.net/ont/geosparql#",
    "prov": "http://www.w3.org/ns/prov#",
    "sdo": "https://schema.org/",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    // props
    "license": {
        "@id": "dcterms:license",
        "@type": "@id"
    },
    "title": "dcterms:title",
    "description": "dcterms:description",
    "iri": "@id",
    "type": "@type",
    "value": "@value",
    "accessRights": {
        "@id": "dcterms:accessRights",
        "@type": "@id"
    },
    "created": {
        "@id": "dcterms:created",
    },
    "issued": {
        "@id": "dcterms:issued",
    },
    "modified": {
        "@id": "dcterms:modified",
    },
    "rights": "dcterms:rights",
    "theme": {
        "@id": "dcat:theme",
        "@type": "@id",
        "@container": "@set",
    },
    "agentRole": {
        "@id": "prov:qualifiedAttribution",
        "@container": "@set"
    },
    "role": {
        "@id": "dcat:hadRole",
        "@type": "@id"
    },
    "agent": {
        "@id": "prov:agent",
        "@type": "@id"
    },
    "indigeneity": {
        "@id": "dcterms:type",
        "@type": "@id"
    },
    "identifier": {
        "@id": "sdo:identifier",
    },
    "name": "sdo:name",
    "sdoDescription": "sdo:description",
    "spatial": "dcterms:spatial",
    "temporal": "dcterms:temporal",
    "distribution": {
        "@id": "dcat:distribution",
    },
    "accessURL": {
        "@id": "dcat:accessURL",
        "@type": "xsd:anyURI",
    },
    "startedAtTime": "prov:startedAtTime",
    "endedAtTime": "prov:endedAtTime",
    "additionalType": {
        "@id": "sdo:additionalType",
        "@type": "@id"
    },
    "wasInfluencedBy": {
        "@id": "prov:wasInfluencedBy",
        "@container": "@set"
    },
    "contributed": {
        "@id": "prov:contributed",
        "@type": "@id"
    },
    "url": {
        "@id": "sdo:url",
        "@type": "xsd:anyURI",
    },
};

const rdfString = ref("");

watch(data, async (newValue) => {
    const nonempty = removeEmptyValues(newValue);
    const doc = { "@context": context, type: "dcat:Resource", ...nonempty };
    const rdf = await (jsonld.toRDF(doc, { format: "application/n-quads" }) as Promise<string>);
    rdfString.value = rdf;

    // serialize into turtle
    // await init();
    // const store = new oxigraph.Store();
    // store.load(rdf, { format: "application/n-triples" });
    // rdfString.value = store.dump({ format: "text/turtle", from_graph_name: oxigraph.defaultGraph() });
}, { deep: true });

watch(rdfString, async (newValue) => {
    if (data.value.iri) {
        fair.value = await fairScore(newValue, data.value.iri, "application/n-triples");
        care.value = await careScore(newValue, data.value.iri, "application/n-triples");
    }
});
</script>

<template>
    <div>
        <Card class="form">
            <CardContent>
                <FormBuilder :schema="schema" v-model="data" />
            </CardContent>
        </Card>
        <Card class="scores">
            <CardContent>
                <Scores title="FAIR" :scores="fair" />
                <Scores title="CARE" :scores="care" />
            </CardContent>
        </Card>
        <Card class="rdf">
            <CardContent>
                <pre>{{ rdfString }}</pre>
            </CardContent>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
</style>