<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import * as jsonld from "jsonld";
// import init, * as oxigraph from "oxigraph/web";
import type { Option, ScoreValueObj } from "~/types";
import { schemaCreateEmptyObject, removeEmptyValues, sparqlSelect, sparqlOptions } from "~/utils/form";

register(z);

const SPARQL_URL = "https://api.idnau.org/sparql";
const DEFAULT_IRI = "https://data.idnau.org/pid/resource/d23405b4-fc04-47e2-9e7a-9c5735ae3780";

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

async function agentSearch(term: string) {
    const r = await sparqlSelect(SPARQL_URL, `PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX sdo: <https://schema.org/>
        SELECT DISTINCT ?iri ?name ?type
        WHERE {
            GRAPH <https://data.idnau.org/pid/agentsdb> {
                VALUES ?type { sdo:Person sdo:Organization }
                ?iri a ?type ;
                    sdo:name ?name .
                FILTER regex(?name, "${term}", "i")
            }
        } LIMIT 20`);
    return r.map(x => {
        return {
            iri: x.iri.value,
            name: x.name.value,
            type: x.type.value,
        }
    })
}

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
        agent: z.object({
            iri: z.string(),
            name: z.string(),
            type: z.string(),
        }).describe("a description").meta({
            label: "Agent",
            type: "search",
            placeholder: "Search for an agent",
            initial: {},
            query: agentSearch,
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
        initial: [{agent: {}, role: []}],
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
    const initialValues = Object.entries(schema.shape).reduce((obj, [k, v]) => {
        obj[k] = v.getMeta().initial;
        return obj;
    }, {});
    const nonempty = removeEmptyValues(newValue, initialValues);
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
    fair.value = await fairScore(newValue, data.value.iri, "application/n-triples");
    care.value = await careScore(newValue, data.value.iri, "application/n-triples");
});
</script>

<template>
    <div class="flex flex-row gap-4 w-full">
        <div class="flex-grow max-w-[860px]">
            <Button @click="data.iri = DEFAULT_IRI">Generate IRI</Button>
            <FormBuilder :schema="schema" v-model="data" />
        </div>
        <div class="flex-grow">
            <Scores title="FAIR" :scores="fair" />
            <Scores title="CARE" :scores="care" />
        </div>
    </div>
    <div>
        <h2>RDF</h2>
        <pre>{{ rdfString }}</pre>
    </div>
</template>

<style lang="scss" scoped>
pre {
    white-space: pre-wrap;
}
</style>