<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import * as jsonld from "jsonld";
import { ChevronDown, ChevronUp, Copy, Expand } from "lucide-vue-next";
import { fairScore, careScore } from "@idn-au/scores-calculator-js";
import { schemaCreateEmptyObject, removeEmptyValues, sparqlSelect, sparqlOptions, type SectionMeta } from "~/utils/form";

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

const { data: distThemeOptions } = await useAsyncData("distThemeOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label
    WHERE {
        BIND(<https://data.idnau.org/pid/vocab/cat-roles> AS ?cs)
        ?cs a skos:ConceptScheme .
        ?value a skos:Concept ;
            skos:inScheme ?cs ;
            skos:prefLabel ?label .
    }`));

async function agentSearch(term: string): Promise<Option[]> {
    const r = await sparqlSelect(SPARQL_URL, `PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX sdo: <https://schema.org/>
        SELECT DISTINCT ?iri ?name
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
            value: x.iri.value,
            label: x.name.value,
        }
    });
}

async function agentGet(iri: string) {
    const r = await sparqlSelect(SPARQL_URL, `PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX sdo: <https://schema.org/>
        SELECT DISTINCT ?iri ?name ?type ?url ?desc ?indigeneity ?identifier
        WHERE {
            GRAPH <https://data.idnau.org/pid/agentsdb> {
                VALUES ?type { sdo:Person sdo:Organization }
                BIND (<${iri}> AS ?iri)
                ?iri a ?type ;
                    sdo:name ?name .
                OPTIONAL {
                    ?iri sdo:url ?url .
                }
                OPTIONAL {
                    ?iri sdo:description ?desc .
                }
                OPTIONAL {
                    ?iri dcterms:type ?indigeneity .
                }
                OPTIONAL {
                    ?iri sdo:identifier ?identifier .
                }
            }
        } LIMIT 1`);
    return r.map(x => {
        return {
            iri: x.iri.value,
            name: x.name.value,
            type: x.type.value,
            url: x.url?.value,
            sdoDescription: x.desc?.value,
            indigeneity: x.indigeneity?.value,
            identifier: x.identifier?.value,
        }
    })[0] || null;
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
});

const steps = [
    {
        step: 1,
        title: "General",
        description: "Basic information about this data.",
        schema: z.object({
            iri: z.string().min(1, "IRI is required").url({ message: "Must be a valid IRI" }).describe("Provide an IRI or have an IRI automatically assigned").meta<InputMeta>({
                label: "IRI",
                type: "url",
                placeholder: "https://example.com",
                initial: "",
                tooltip: "An IRI is a standard identifier in the form of a web address (URL). Good IRIs are part of a managed system.",
            }),
            title: z.string().min(1, "Title is required").describe("").meta<InputMeta>({
                label: "Title",
                type: "text",
                initial: "",
                tooltip: "The name of the data that this metadata is describing.",
            }),
            indigeneity: z.string().array().optional().describe("You can add mulitple indigeneity terms").meta<InputMeta>({
                label: "Indigeneity",
                type: "select", // string array/select array is multiple
                placeholder: "Select indigeneity",
                initial: [],
                options: indigeneityOptions.value,
                tooltip: "The indigeneity of this dataset."
            }),
            description: z.string().min(1, "Description is required").describe("Supports new lines and basic formatting").meta<InputMeta>({
                label: "Description",
                type: "textarea",
                initial: "",
                class: "col-span-full",
                tooltip: "A free-text description of the data. This can include how it was created and its intended purpose.",
            }),
        }).meta<SectionMeta>({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 2,
        title: "Agent Information",
        description: "Information about the roles that agents (people and organisations) play with respect to this data. These roles are critical in determining whether this data is managed properly. Each Agent must have a matching Role.",
        schema: z.object({
            agentRole: z.object({
                agent: z.object({
                    iri: z.string(),
                    name: z.string(),
                    type: z.string(),
                    url: z.string().optional(),
                    sdoDescription: z.string().optional(),
                    indigeneity: z.string().optional(),
                    identifier: z.object({
                        value: z.string(),
                        type: z.string().url(),
                    }).array().optional(),
                }).describe("You can search for an agent or create your own").meta<InputMeta>({
                    label: "Agent",
                    type: "agent",
                    placeholder: "Search for an agent",
                    initial: {},
                    tooltip: "The name of the person, community or business that is providing this data.",
                    listQuery: agentSearch,
                    getQuery: agentGet,
                    resultLabel: "name",
                }),
                role: z.string().array().min(1, "Role is required").describe("You can select multiple roles").meta<InputMeta>({
                    label: "Role",
                    type: "select", // string array/select array is multiple
                    placeholder: "Choose roles",
                    initial: [],
                    options: roleOptions.value,
                    tooltip: "What role (e.g. custodian) the named person, community or business has with this data.",
                }),
                // TODO: IDG
            }).array().min(1, "Must have an agent and role selected").meta<InputMeta>({
                label: "Agents",
                type: "add",
                initial: [{ agent: {}, role: [] }],
                element: { agent: {}, role: [] },
                class: "col-span-full"
            })
        }).meta<SectionMeta>({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 3,
        title: "Dates",
        description: "Standard dates for the establishment and update times of this dataset. A dataset about early 20th century data might only have been made last year and the created date is then some time last year. 'Issued' indicates when, if ever, this dataset was published.",
        schema: z.object({
            created: customDate.describe("").meta<InputMeta>({
                label: "Created",
                type: "customDate",
                // placeholder: "",
                initial: {
                    type: "",
                    value: ""
                },
                tooltip: "This is the date that this dataset was created (NOT the date the data occurred).",
            }),
            modified: customDate.describe("").meta<InputMeta>({
                label: "Modified",
                type: "customDate",
                // placeholder: "",
                initial: {
                    type: "",
                    value: ""
                },
                tooltip: "The most recent date on which the data was modified. It can be the same as the date it was created.",
            }),
            issued: customDate.optional().describe("Issued indicates when, if ever, this dataset was published").meta<InputMeta>({
                label: "Issued",
                type: "customDate",
                // placeholder: "",
                initial: {
                    type: "",
                    value: ""
                },
                tooltip: "This is the date that this dataset was published or distributed.",
            }),
        }).meta<SectionMeta>({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 4,
        title: "Rights",
        description: "Ownership and access information of the data. If a license is selected then the rights holder to that license should also be included.",
        schema: z.object({
            license: z.string().optional().describe("").meta<InputMeta>({
                label: "License",
                type: "select", // select string is single
                placeholder: "Select a license",
                initial: "",
                options: licenseOptions.value,
                tooltip: "This is the legal information under which the data is made available.",
            }),
            rights: z.string().optional().describe("").meta<InputMeta>({
                label: "Rights",
                type: "text",
                initial: "",
                tooltip: "This is a statement that provides required details of who holds the license selected previously. e.g. ©University of Melbourne.",
            }),
            accessRights: z.string().optional().describe("").meta<InputMeta>({
                label: "Access Rights",
                type: "select", // select string is single
                placeholder: "Select an access right",
                initial: "",
                options: accessRightsOptions.value,
                tooltip: "Data access rights control how users and systems access a data resource. e.g. Metadata access only. Definitions can be found here.",
            }),
        }).meta<SectionMeta>({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 5,
        title: "Spatio/Temporal",
        description: "The spatial (geographical) and temporal (time period) extent of the data. Temporal information is different from the dates section as, for example, this dataset may have been created recently but is about someone or something long ago.",
        schema: z.object({
            spatial: z.union([z.string().url(), z.object({
                type: z.literal("geo:Geometry"),
                asWKT: z.object({
                    type: z.literal("geo:wktLiteral"),
                    value: z.string()
                    // .refine((val) => {
                    //     if (typeof val !== "string") {
                    //         return false;
                    //     }
                    //     const matches = val.match(/^(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION)\s?(\(+(\-?\d+(\.\d+)?,?\s?)+\)+,?\s?)+$/);
                    //     if (!matches) {
                    //         return false;
                    //     }
                    //     return true;
                    // }, { message: "Invalid WKT string" }),
                }).optional(),
                asGeoJSON: z.object({
                    type: z.literal("geo:geoJSONLiteral"),
                    value: z.string()
                    // .refine((val) => {
                    //     if (typeof val !== "string") {
                    //         return false;
                    //     }
                    //     const matches = val.match(/^\{.+\}$/);
                    //     if (!matches) {
                    //         return false;
                    //     }
                    //     return true;
                    // }, { message: "Invalid GeoJSON" }),
                }).optional(),
            })]).optional().describe("Supports an IRI or a WKT/GeoJSON string").meta<InputMeta>({
                label: "Spatial",
                type: "spatial",
                initial: "",
                // tooltip: "Spatial tooltip"
            }),
            temporal: z.object({
                startedAtTime: customDate.optional().describe("").meta<InputMeta>({
                    label: "Start Time",
                    type: "customDate",
                    // placeholder: "",
                    initial: {
                        type: "",
                        value: ""
                    },
                }),
                endedAtTime: customDate.optional().describe("").meta<InputMeta>({
                    label: "End Time",
                    type: "customDate",
                    // placeholder: "",
                    initial: {
                        type: "",
                        value: ""
                    },
                }),
            }).optional().meta<InputMeta>({
                label: "Temporal",
                type: "group",
                initial: {
                    startedAtTime: {
                        type: "",
                        value: ""
                    },
                    endedAtTime: {
                        type: "",
                        value: ""
                    },
                },
                class: "col-span-full",
                tooltip: "This is the interval of time which the data covers at the time of publishing. There must be a start and end date.",
            })
        }).meta<SectionMeta>({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 6,
        title: "Distribution Info",
        description: "This is optional information in the form of a publicly resolvable URL that gives the user access to the data.",
        schema: z.object({
            distribution: z.object({
                type: z.literal("dcat:Distribution").meta<InputMeta>({
                    type: "hidden",
                    initial: "dcat:Distribution",
                }),
                title: z.string().describe("").meta<InputMeta>({
                    label: "Title",
                    type: "text",
                    initial: "",
                    // tooltip: "",
                }),
                accessURL: z.string().url({ message: "Must be a valid URL" }).describe("A publicly resolvable URL that gives the user access to the data").meta<InputMeta>({
                    label: "Access URL",
                    type: "url",
                    placeholder: "https://example.com",
                    initial: "",
                    tooltip: "A URL is normally in the format https://… . If you are NOT submitting the metadata to the Indigenous Data Network, you could insert any resolvable URL into the metadata.",
                }),
                theme: z.string().array().describe("").meta<InputMeta>({
                    label: "Theme",
                    type: "select", // string array/select array is multiple
                    placeholder: "Choose themes",
                    initial: [],
                    options: distThemeOptions.value,
                    // tooltip: ""
                }),
                description: z.string().describe("Supports new lines and basic formatting").meta<InputMeta>({
                    label: "Description",
                    type: "textarea",
                    initial: "",
                    class: "col-span-full",
                    // tooltip: "",
                }),
            }).array().optional().describe("").meta<InputMeta>({
                label: "Distribution",
                type: "add",
                initial: [],
                element: {
                    type: "dcat:Distribution",
                    theme: [],
                    title: "",
                    description: "",
                    accessURL: ""
                },
                class: "grid-cols-1 md:grid-cols-2 gap-2 col-span-full"
            })
        }).meta<SectionMeta>({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    {
        step: 7,
        title: "Theme",
        description: "Classification or categorisation of this data. We are mostly concerned with indications of 'indigeneity', i.e. how this data is related to indigenous people, however other classifications may also be added. Our primary indigenous classification vocabulary is online at https://data.idnau.org/v/vocab/vcb:idn-th which may be browsed for classification suggestions.",
        schema: z.object({
            theme: z.string().array().describe("You can add more than one Theme term").meta<InputMeta>({
                label: "Theme",
                type: "select", // string array/select array is multiple
                placeholder: "Choose themes",
                initial: [],
                options: themeOptions.value,
                tooltip: "Our vocabulary for the primary classification for indigeneity of data being described can be browsed here. This vocabulary contains historical terms which exist in legacy data but are no longer used today. We welcome suggestions and feedback on this vocabulary."
            }),
        }).meta<SectionMeta>({
            class: "grid-cols-1 md:grid-cols-2 gap-2"
        })
    },
    // {
    //     step: 8,
    //     title: "Contact Details",
    //     description: "These details are required if you are submitting this metadata to the IDN. These details are also added as the point of contact for this data unless you've specifically indicated an Agent as the Point of Contact above.",
    //     schema: z.object({
    //         name: z.string().describe("").meta<InputMeta>({
    //             label: "Name",
    //             type: "text",
    //             placeholder: "Contact name",
    //             initial: "",
    //             // tooltip: ""
    //         }),
    //         email: z.string().email().describe("").meta<InputMeta>({
    //             label: "Email",
    //             type: "email",
    //             placeholder: "Contact email",
    //             initial: "",
    //             // tooltip: ""
    //         }),
    //         phone: z.string().describe("").meta<InputMeta>({
    //             label: "phone",
    //             type: "text",
    //             placeholder: "Contact phone",
    //             initial: "",
    //             // tooltip: ""
    //         }),
    //     }).meta<SectionMeta>({
    //         class: "grid-cols-1 md:grid-cols-2 gap-2"
    //     })
    // },
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
    "spatial": {
        "@id": "dcterms:spatial",
        "@type": "@id"
    },
    "temporal": "dcterms:temporal",
    "distribution": {
        "@id": "dcat:distribution",
        "@container": "@set",
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
    "asWKT": "geo:asWKT",
    "asGeoJSON": "geo:asGeoJSON",
};

const dataFlattened = computed(() => {
    return Object.values(data.value).reduce((obj, curr) => {
        Object.assign(obj, curr);
        return obj;
    }, {});
});

const schemaFlattened = steps.reduce((obj, curr) => {
    Object.assign(obj, curr.schema.shape);
    return obj;
}, {});

function copyRDF() {
    navigator.clipboard.writeText(rdfString.value);
}

async function dataToRdf(dataObj: any): Promise<string> {
    const nonempty = removeEmptyValues(dataObj, schemaFlattened);
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
                        <p>{{ stepObj.description }}</p>
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