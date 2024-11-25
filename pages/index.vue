<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import * as jsonld from "jsonld";
import { ChevronDown, ChevronUp, Copy, Expand } from "lucide-vue-next";
import { fairScore, careScore } from "@idn-au/scores-calculator-js";
import type { ScoreValueObj } from "~/types";
import { schemaCreateEmptyObject, removeEmptyValues, sparqlSelect, sparqlOptions } from "~/utils/form";

register(z);

const SPARQL_URL = "https://api.idnau.org/sparql";
const DEFAULT_IRI = "https://data.idnau.org/pid/resource/d23405b4-fc04-47e2-9e7a-9c5735ae3780";

const { data: indigeneityOptions } = await useAsyncData("indigeneityOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label
    WHERE {
        BIND(<https://data.idnau.org/pid/vocab/indigeneity> AS ?cs)
        ?cs a skos:ConceptScheme .
        ?value a skos:Concept ;
            skos:inScheme ?cs ;
            skos:prefLabel ?label .
    }`));

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

const { data: licenseOptions } = await useAsyncData("licenseOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label
    WHERE {
        BIND(<https://linked.data.gov.au/def/licenses> AS ?cs)
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
    });
}

const customDate = z.object({
    type: z.string(),
    value: z.string().refine((val) => {
        if (typeof val !== "string") {
            return false;
        }
        const matches = val.match(/^(\d{4})(-\d{2})?(-\d{2})?$/);
        if (!matches) {
            return false;
        }
        const [_, year, month, day] = matches.map(m => m !== undefined ? Number(m.replaceAll("-", "")) : undefined);
        if (day !== undefined && (day < 1 || day > 31)) { // needs to cater per month & leap year
            return false;
        }
        if (month !== undefined && (month < 1 || month > 12)) {
            return false;
        }
        return true;
    }, { message: "Invalid date" })
})
const steps = [
    {
        step: 1,
        title: "General",
        schema: z.object({
            iri: z.string().min(1, "IRI is required").url({ message: "Must be a valid IRI" }).describe("Provide an IRI or have an IRI automatically assigned").meta({
                label: "IRI",
                type: "url",
                placeholder: "https://example.com",
                initial: "",
            }),
            title: z.string().min(1, "Title is required").describe("").meta({
                label: "Title",
                type: "text",
                initial: "",
            }),
            indigeneity: z.string().array().optional().describe("You can add mulitple indigeneity terms").meta({
                label: "Indigeneity",
                type: "select", // string array/select array is multiple
                placeholder: "Select indigeneity",
                initial: [],
                options: indigeneityOptions.value,
            }),
            description: z.string().min(1, "Description is required").describe("Supports new lines and basic formatting").meta({
                label: "Description",
                type: "textarea",
                initial: "",
                class: "col-span-full"
            }),
        }).meta({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 2,
        title: "Agent Information",
        schema: z.object({
            agentRole: z.object({
                agent: z.object({
                    iri: z.string(),
                    name: z.string(),
                    type: z.string(),
                }).describe("").meta({
                    label: "Agent",
                    type: "search",
                    placeholder: "Search for an agent",
                    initial: {},
                    query: agentSearch,
                }),
                role: z.string().array().min(1, "Role is required").describe("").meta({
                    label: "Role",
                    type: "select", // string array/select array is multiple
                    placeholder: "Choose roles",
                    initial: [],
                    options: roleOptions.value,
                }),
                // TODO: IDG
            }).array().min(1, "Must have an agent and role selected").meta({
                label: "Agents",
                type: "add",
                initial: [{ agent: {}, role: [] }],
            }).meta({
                class: "col-span-full"
            }),
        }).meta({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 3,
        title: "Dates",
        schema: z.object({
            created: customDate.describe("").meta({
                label: "Created",
                type: "customDate",
                // placeholder: "",
                initial: {
                    type: "",
                    value: ""
                },
            }),
            modified: customDate.describe("").meta({
                label: "Modified",
                type: "customDate",
                // placeholder: "",
                initial: {
                    type: "",
                    value: ""
                },
            }),
            issued: customDate.optional().describe("Issued indicates when, if ever, this dataset was published").meta({
                label: "Issued",
                type: "customDate",
                // placeholder: "",
                initial: {
                    type: "",
                    value: ""
                },
            }),
        }).meta({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 4,
        title: "Rights",
        schema: z.object({
            license: z.string().optional().describe("").meta({
                label: "License",
                type: "select", // select string is single
                placeholder: "Select a license",
                initial: "",
                options: licenseOptions.value,
            }),
            rights: z.string().optional().describe("").meta({
                label: "Rights",
                type: "text",
                initial: "",
            }),
            accessRights: z.string().optional().describe("").meta({
                label: "Access Rights",
                type: "select", // select string is single
                placeholder: "Select an access right",
                initial: "",
                options: accessRightsOptions.value,
            }),
        }).meta({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    // TODO: spatio/temporal
    {
        step: 5,
        title: "Distribution Info",
        schema: z.object({
            distribution: z.object({
                accessURL: z.string().url({ message: "Must be a valid URL" }).describe("A publicly resolvable URL that gives the user access to the data").meta({
                    label: "Access URL",
                    type: "url",
                    placeholder: "https://example.com",
                    inital: "",
                })
            }).describe("").meta({
                label: "Distribution",
                type: "group",
                // placeholder: "Choose themes",
                initial: { accessURL: "" },
            }).meta({
                class: "col-span-full"
            }),
        }).meta({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 6,
        title: "Theme",
        schema: z.object({
            theme: z.string().array().min(2, "Must have at least two themes selected").describe("You can add more than one Theme term").meta({
                label: "Theme",
                type: "select", // string array/select array is multiple
                placeholder: "Choose themes",
                initial: [],
                options: themeOptions.value,
            }),
        }).meta({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    // TODO: contact details
];

const data = ref(steps.reduce((obj, step) => {
    obj[step.title] = schemaCreateEmptyObject(step.schema);
    return obj;
}, {}));
const rdfString = ref("");
const showRDF = ref(false);
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

const dataFlattened = computed(() => {
    return Object.values(data.value).reduce((obj, curr) => {
        Object.assign(obj, curr);
        return obj;
    }, {});
});

function copyRDF() {
    navigator.clipboard.writeText(rdfString.value);
}

async function dataToRdf(dataObj: any): Promise<string> {
    const initialValuesNested = steps.reduce((obj1, step) => {
        obj1[step.title] = Object.entries(step.schema.shape).reduce((obj2, [k, v]) => {
            obj2[k] = v.getMeta().initial;
            return obj2;
        }, {});
        return obj1;
    }, {});
    const initialValues = Object.values(initialValuesNested).reduce((obj, curr) => {
        Object.assign(obj, curr);
        return obj;
    }, {});

    const nonempty = removeEmptyValues(dataObj, initialValues);
    const doc = { "@context": context, type: "dcat:Resource", ...nonempty };
    const rdf = await (jsonld.toRDF(doc, { format: "application/n-quads" }) as Promise<string>);
    return rdf;
}

watch(dataFlattened, async (newValue) => {
    rdfString.value = await dataToRdf(newValue);

    // serialize into turtle
    // await init();
    // const store = new oxigraph.Store();
    // store.load(rdf, { format: "application/n-triples" });
    // rdfString.value = store.dump({ format: "text/turtle", from_graph_name: oxigraph.defaultGraph() });
}, { deep: true });

watch(rdfString, async (newValue) => {
    fair.value = await fairScore(newValue, dataFlattened.value.iri, "application/n-triples");
    care.value = await careScore(newValue, dataFlattened.value.iri, "application/n-triples");
});

onMounted(async () => {
    const matches = "2024-04-24".match(/^(\d{4})(-\d{2})?(-\d{2})?$/)?.map(m => m.replaceAll("-", ""));

    data.value.General.iri = DEFAULT_IRI;
    rdfString.value = await dataToRdf(dataFlattened.value);
    fair.value = await fairScore(rdfString.value, dataFlattened.value.iri, "application/n-triples");
    care.value = await careScore(rdfString.value, dataFlattened.value.iri, "application/n-triples");
});
</script>

<template>
    <div class="mb-4">
        <h1 class="bold text-3xl mb-4">Metadata Entry Tool</h1>
        <p>This form is to be completed for submitting metadata to the Indigenous Data Network.</p>
        <p>In order to complete a compliant metadata record for your data, you need to fill out the information required in the form below. You have the option of completing only the minimum required information (indicated by a red asterix) but it is recommended that you include as much information as possible in the form.</p>
        <p>The more information you are able to provide, the higher the <a href="https://force11.org/info/the-fair-data-principles" target="_blank" rel="noopener noreferrer">FAIR</a> and <a href="https://www.gida-global.org/care" target="_blank" rel="noopener noreferrer">CARE</a> scores for your metadata. For now, these scores generate placeholder values.</p>
        <p>The metadata in RDF format can optionally be viewed on the right of the form. The RDF and scores are updated as you complete the form. More information about the metadata profile can be found <a href="https://data.idnau.org/pid/cp/guide" target="_blank" rel="noopener noreferrer">here</a>.</p>
        <p>This form uses the IDN's collection of people and organisations, or "agents", that are related to metadata and datasets in the IDN, called the <a href="https://agentsdb.idnau.org" target="_blank" rel="noopener noreferrer">Agents Database</a>. You can refer to this list of agents or create a custom agent if required.</p>
    </div>
    <div class="flex flex-row gap-4">
        <div class="grow-[2]">
            <VerticalStepper :steps="steps" v-slot="{ stepObj, stepIndex }">
                <Card v-show="stepIndex === stepObj.step">
                    <CardContent class="pt-4">
                        <!-- <Button v-if="stepIndex === 1" @click="data.General.iri = DEFAULT_IRI" size="xs">Generate IRI</Button> -->
                        <FormBuilder :schema="stepObj.schema" v-model="data[stepObj.title]" />
                    </CardContent>
                </Card>
            </VerticalStepper>
        </div>
        <div class="flex flex-col grow-[1] gap-4 max-w-[400px] min-w-[200px]">
            <Scores title="FAIR" :scores="fair" />
            <Scores title="CARE" :scores="care" />
            <Collapsible v-model:open="showRDF" class="flex flex-col gap-2 items-start">
                <CollapsibleTrigger as-child>
                    <Button variant="outline">
                        <ChevronUp v-if="showRDF" class="h-4 w-4 mr-2" />
                        <ChevronDown v-else class="h-4 w-4 mr-2" />
                        RDF
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent class="flex flex-col gap-2 items-start">
                    <div class="relative w-full max-w-sm items-center">
                        <pre class="whitespace-pre-wrap text-xs border rounded p-2 overflow-y-auto max-h-[240px]">{{ rdfString }}</pre>
                        <span class="absolute end-0 inset-y-2 flex justify-center px-2">
                            <Modal>
                                <template #trigger>
                                    <Button variant="outline" size="xs" title="Expand"><Expand class="h-4 w-4" /></Button>
                                </template>
                                <template #title>Metadata RDF</template>
                                <pre class="whitespace-pre-wrap text-xs border rounded p-2 overflow-y-auto">{{ rdfString }}</pre>
                                <template #footer>
                                    <Button variant="outline" @click="copyRDF">
                                        <Copy class="h-4 w-4 mr-2" />
                                        Copy
                                    </Button>
                                    <DialogClose as-child>
                                        <Button type="button" variant="secondary">
                                            Close
                                        </Button>
                                    </DialogClose>
                                </template>
                            </Modal>
                        </span>
                    </div>
                    <Button variant="outline" size="sm" @click="copyRDF">
                        <Copy class="h-4 w-4 mr-2" />
                        Copy
                    </Button>
                </CollapsibleContent>
            </Collapsible>
        </div>
    </div>
</template>

<style lang="scss" scoped>
p {
    margin-bottom: 0.5rem;
}

a {
    color: hsl(var(--primary));
}
</style>