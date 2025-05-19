<script lang="ts" setup>
import * as z from "zod";
import * as jsonld from "jsonld";
import { type ContextDefinition } from "jsonld";
import { ChevronDown, ChevronUp, Expand, Upload, Download, Trash2, Send } from "lucide-vue-next";
import { formField, useVtForm, FormBuilder, type Registry, type Option } from "@vulptech/vt-form";
import { Scoring, type TopScoreValueObj } from "@idn-au/scores-calculator-js";
import { Scores } from "@idn-au/score-component-lib";
import { Editor } from "@kurrawongai/kai-ui";
import AgentInput from "~/components/AgentInput.vue";
import DateInput from "~/components/DateInput.vue";
import SpatialInput from "~/components/SpatialInput.vue";

const SAVE_TO_LOCALSTORAGE = false;

const SPARQL_URL = "https://api.idnau.org/sparql";
const DEFAULT_IRI = "https://data.idnau.org/pid/resource/d23405b4-fc04-47e2-9e7a-9c5735ae3780";

const EXAMPLES = [
    {
        label: "Example 1",
    },
    {
        label: "Example 2",
    },
    {
        label: "Example 3",
    },
];

const colorMode = useColorMode();

// const { store } = useOxiStore();

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
        BIND(<https://data.idnau.org/pid/licenses> AS ?cs)
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

const { data: policyTypeOptions } = await useAsyncData("policyTypeOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label
    WHERE {
        BIND(<https://data.idnau.org/pid/vocab/policy-types> AS ?cs)
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
            agentIndigeneity: x.indigeneity?.value,
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
    })
});

const phoneNumber = z.string().transform((val, ctx) => {
    if (typeof val !== "string") {
        return false;
    }
    const parsed = val.replaceAll(" ", "");
    const match = parsed.match(/^(\+[1-9]{1,2})?\d{1,13}$/);
    if (!match) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid phone number",
        });
        return z.NEVER;
    }
    return parsed;
});

const steps = [
    {
        step: 1,
        title: "General",
        description: "Basic information about this data.",
        schema: z.object({
            iri: formField(z.string().min(1, "IRI is required").url({ message: "Must be a valid IRI" }), {
                label: "IRI",
                type: "url",
                placeholder: "https://example.com",
                initial: "",
                description: "Provide an IRI or have an IRI automatically assigned",
                tooltip: "An IRI is a standard identifier in the form of a web address (URL). Good IRIs are part of a managed system.",
            }),
            title: formField(z.string().min(1, "Title is required"), {
                label: "Title",
                type: "text",
                initial: "",
                tooltip: "The name of the data that this metadata is describing.",
            }),
            dataIndigeneity: formField(z.string().array().optional(), {
                label: "Indigeneity",
                type: "select",
                multiple: true,
                placeholder: "Select indigeneity",
                initial: [],
                options: indigeneityOptions.value,
                description: "You can add mulitple indigeneity terms",
                tooltip: "The indigeneity of this dataset."
            }),
            description: formField(z.string().min(1, "Description is required"), {
                label: "Description",
                type: "textarea",
                initial: "",
                description: "Supports new lines and basic formatting",
                tooltip: "A free-text description of the data. This can include how it was created and its intended purpose.",
                class: "col-span-full",
            }),
            hasPolicy: formField(z.object({
                type: formField(z.literal("odrl:Policy").optional(), {
                    type: "hidden",
                    initial: "odrl:Policy",
                }),
                additionalType: formField(z.string().url().optional(), {
                    label: "Policy Type",
                    type: "select",
                    placeholder: "Select a policy type",
                    initial: "",
                    options: policyTypeOptions.value
                }),
                url: formField(z.string().url().optional(), {
                    label: "URL",
                    type: "url",
                    placeholder: "https://example.com",
                    initial: "",
                }),
                sdoDescription: formField(z.string().optional(), {
                    label: "Description",
                    type: "textarea",
                    initial: "",
                    class: "col-span-full",
                }),
                duty: formField(z.string().optional(), {
                    label: "Archiving included",
                    type: "checkbox",
                    initial: "",
                    description: "Is metadata & data archiving included in the policy?",
                    trueValue: "http://example.com/duty/archive-data-and-metadata",
                    falseValue: "",
                }),
            }).optional(), {
                label: "Indigenous Data Governance Policy",
                type: "group",
                initial: {},
                class: "col-span-full",
            }),
        })
    },
    {
        step: 2,
        title: "Agent Information",
        description: "Information about the roles that agents (people and organisations) play with respect to this data. These roles are critical in determining whether this data is managed properly. Each Agent must have a matching Role.",
        schema: z.object({
            agentRole: formField(z.object({
                agent: formField<z.ZodTypeAny, any>(z.object({
                    iri: z.string(),
                    name: z.string(),
                    type: z.string(),
                    url: z.string().optional(),
                    sdoDescription: z.string().optional(),
                    agentIndigeneity: z.string().optional(),
                    identifier: z.object({
                        value: z.string(),
                        type: z.string().url(),
                    }).array().optional(),
                    relation: z.object({
                        agent: z.string().url(),
                        relationRole: z.string().url(),
                    }).array().optional(),
                }), {
                    label: "Agent",
                    type: "agent",
                    placeholder: "Search for an agent",
                    initial: {},
                    description: "You can search for an agent or create your own",
                    tooltip: "The name of the person, community or business that is providing this data.",
                    listQuery: agentSearch,
                    getQuery: agentGet,
                    resultLabel: "name",
                }),
                role: formField(z.string().array().min(1, "Role is required"), {
                    label: "Role",
                    type: "select",
                    multiple: true,
                    placeholder: "Choose roles",
                    initial: [],
                    options: roleOptions.value,
                    description: "You can select multiple roles",
                    tooltip: "What role (e.g. custodian) the named person, community or business has with this data.",
                }),
            }).array().min(1, "Must have an agent and role selected"), {
                label: "Agents",
                type: "add",
                initial: [{ agent: {}, role: [] }],
                element: { agent: {}, role: [] },
                class: "col-span-full"
            })
        })
    },
    {
        step: 3,
        title: "Dates",
        description: "Standard dates for the establishment and update times of this dataset. A dataset about early 20th century data might only have been made last year and the created date is then some time last year. 'Issued' indicates when, if ever, this dataset was published.",
        schema: z.object({
            created: formField<z.ZodTypeAny, any>(customDate, {
                label: "Created",
                type: "customDate",
                initial: {
                    type: "",
                    value: ""
                },
                description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
                tooltip: "This is the date that this dataset was created (NOT the date the data occurred).",
            }),
            modified: formField<z.ZodTypeAny, any>(customDate, {
                label: "Modified",
                type: "customDate",
                initial: {
                    type: "",
                    value: ""
                },
                description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
                tooltip: "The most recent date on which the data was modified. It can be the same as the date it was created.",
            }),
            issued: formField<z.ZodTypeAny, any>(customDate.optional(), {
                label: "Issued",
                type: "customDate",
                initial: {
                    type: "",
                    value: ""
                },
                description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
                tooltip: "Issued indicates when, if ever, this dataset was published",
            }),
        })
    },
    {
        step: 4,
        title: "Rights",
        description: "Ownership and access information of the data. If a license is selected then the rights holder to that license should also be included.",
        schema: z.object({
            license: formField(z.string().optional(), {
                label: "License",
                type: "select", // select string is single
                placeholder: "Select a license",
                initial: "",
                options: licenseOptions.value,
                tooltip: "This is the legal information under which the data is made available.",
            }),
            rights: formField(z.string().optional(), {
                label: "Rights",
                type: "text",
                initial: "",
                tooltip: "This is a statement that provides required details of who holds the license selected previously. e.g. ©University of Melbourne.",
            }),
            accessRights: formField(z.string().optional(), {
                label: "Access Rights",
                type: "select", // select string is single
                placeholder: "Select an access right",
                initial: "",
                options: accessRightsOptions.value,
                tooltip: "Data access rights control how users and systems access a data resource. e.g. Metadata access only. Definitions can be found here.",
            }),
        })
    },
    {
        step: 5,
        title: "Spatio/Temporal",
        description: "The spatial (geographical) and temporal (time period) extent of the data. Temporal information is different from the dates section as, for example, this dataset may have been created recently but is about someone or something long ago.",
        schema: z.object({
            spatial: formField<z.ZodTypeAny, any>(z.union([z.string().url(), z.object({
                type: z.literal("geo:Geometry"),
                asWKT: z.object({
                    type: z.literal("geo:wktLiteral"),
                    value: z.string()
                    // .refine((val) => {
                    //     if (typeof val !== "string") {
                    //         return false;
                    //     }
                    //     const match = val.match(/^(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION)\s?(\(+(\-?\d+(\.\d+)?,?\s?)+\)+,?\s?)+$/);
                    //     if (!match) {
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
                    //     const match = val.match(/^\{.+\}$/);
                    //     if (!match) {
                    //         return false;
                    //     }
                    //     return true;
                    // }, { message: "Invalid GeoJSON" }),
                }).optional(),
            })]).optional(), {
                label: "Spatial",
                type: "spatial",
                initial: "",
                description: "Supports an IRI or a WKT/GeoJSON string",
            }),
            temporal: formField(z.object({
                startedAtTime: formField<z.ZodTypeAny, any>(customDate.optional(), {
                    label: "Start Time",
                    type: "customDate",
                    initial: {
                        type: "",
                        value: ""
                    },
                    description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
                }),
                endedAtTime: formField<z.ZodTypeAny, any>(customDate.optional(), {
                    label: "End Time",
                    type: "customDate",
                    initial: {
                        type: "",
                        value: ""
                    },
                    description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
                }),
            }).optional(), {
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
        })
    },
    {
        step: 6,
        title: "Distribution Info",
        description: "This is optional information in the form of a publicly resolvable URL that gives the user access to the data.",
        schema: z.object({
            distribution: formField(z.object({
                type: formField(z.literal("dcat:Distribution"), {
                    type: "hidden",
                    initial: "dcat:Distribution",
                }),
                title: formField(z.string(), {
                    label: "Title",
                    type: "text",
                    initial: "",
                }),
                accessURL: formField(z.string().url({ message: "Must be a valid URL" }), {
                    label: "Access URL",
                    type: "url",
                    placeholder: "https://example.com",
                    initial: "",
                    description: "A publicly resolvable URL that gives the user access to the data",
                    tooltip: "A URL is normally in the format https://… . If you are NOT submitting the metadata to the Indigenous Data Network, you could insert any resolvable URL into the metadata.",
                }),
                theme: formField(z.string().array(), {
                    label: "Theme",
                    type: "select",
                    multiple: true,
                    placeholder: "Choose themes",
                    initial: [],
                    options: distThemeOptions.value,
                }),
                description: formField(z.string(), {
                    label: "Description",
                    type: "textarea",
                    initial: "",
                    description: "Supports new lines and basic formatting",
                    class: "col-span-full",
                }),
            }).array().optional(), {
                label: "Distribution",
                type: "add",
                initial: [],
                element: {
                    type: "dcat:Distribution",
                    theme: [],
                    title: "",
                    accessURL: ""
                },
                class: "grid-cols-1 md:grid-cols-2 gap-2 col-span-full"
            })
        })
    },
    {
        step: 7,
        title: "Theme",
        description: "Classification or categorisation of this data. We are mostly concerned with indications of 'indigeneity', i.e. how this data is related to indigenous people, however other classifications may also be added. Our primary indigenous classification vocabulary is online at https://data.idnau.org/v/vocab/vcb:idn-th which may be browsed for classification suggestions.",
        schema: z.object({
            theme: formField(z.string().array(), {
                label: "Theme",
                type: "select", // string array/select array is multiple
                placeholder: "Choose themes",
                initial: [],
                options: themeOptions.value,
                description: "You can add more than one Theme term",
                tooltip: "Our vocabulary for the primary classification for indigeneity of data being described can be browsed here. This vocabulary contains historical terms which exist in legacy data but are no longer used today. We welcome suggestions and feedback on this vocabulary."
            }),
        })
    },
    {
        step: 8,
        title: "Contact Details",
        description: "These details are required if you are submitting this metadata to the IDN. These details are also added as the point of contact for this data unless you've specifically indicated an Agent as the Point of Contact above.",
        schema: z.object({
            contact: formField(z.object({
                agent: formField(z.object({
                    iri: formField(z.literal("https://data.idnau.org/pid/person/6cf32191-8d20-4a43-99ba-1a7727615ad9"), {
                        type: "hidden",
                        initial: "https://data.idnau.org/pid/person/6cf32191-8d20-4a43-99ba-1a7727615ad9"
                    }),
                    type: formField(z.literal("sdo:Person"), {
                        type: "hidden",
                        initial: "sdo:Person"
                    }),
                    name: formField(z.string(), {
                        label: "Name",
                        type: "text",
                        placeholder: "Contact name",
                        initial: "",
                    }),
                    email: formField(z.string().email(), {
                        label: "Email",
                        type: "email",
                        placeholder: "Contact email",
                        initial: "",
                    }),
                    telephone: formField(phoneNumber, {
                        label: "Phone",
                        type: "tel",
                        placeholder: "Contact phone",
                        initial: "",
                    }),
                }), {
                    type: "group",
                    initial: {
                        iri: "https://data.idnau.org/pid/person/6cf32191-8d20-4a43-99ba-1a7727615ad9",
                        type: "sdo:Person",
                        name: "",
                        email: "",
                        telephone: ""
                    },
                    class: "col-span-full",
                }),
                role: formField(z.literal("https://linked.data.gov.au/def/data-roles/pointOfContact").array().length(1), {
                    type: "hidden",
                    initial: ["https://linked.data.gov.au/def/data-roles/pointOfContact"]
                }),
            }).array().length(1), {
                label: "Contact Details",
                type: "add",
                initial: [{
                    agent: {
                        iri: "https://data.idnau.org/pid/person/6cf32191-8d20-4a43-99ba-1a7727615ad9",
                        type: "sdo:Person",
                        name: "",
                        email: "",
                        telephone: ""
                    },
                    role: ["https://linked.data.gov.au/def/data-roles/pointOfContact"],
                }],
                element: {
                    agent: {},
                    role: ["https://linked.data.gov.au/def/data-roles/pointOfContact"],
                },
                class: "col-span-full",
            }),
        })
    },
];

const registry: Registry = {
    agent: {
        component: AgentInput,
        props: {
            listQuery: (def, meta, model) => meta.listQuery,
            getQuery: (def, meta, model) => meta.getQuery || undefined,
            resultLabel: (def, meta, model) => meta.resultLabel || undefined,
        },
    },
    customDate: {
        component: DateInput,
        props: {},
    },
    spatial: {
        component: SpatialInput,
        props: {},
    },
};

// const isValid = computed<(boolean | "partial")[]>(() => steps.map(s => {
//     const res = s.schema.safeParse(data.value[s.title]);
//     console.log(res)
//     if (res.success) {
//         return isFormFilled(data.value[s.title], s.schema.shape) || "partial";
//     } else {
//         return false;
//     }
// }));

function createEmptyData() {
    return steps.reduce((obj, step) => {
        const { formData } = useVtForm(step.schema);
        obj[step.title] = formData.value;
        return obj;
    }, {}  as Record<string, any>);
}

function clear() {
    data.value = createEmptyData();
    data.value.General.iri = DEFAULT_IRI;
}

const data = ref(createEmptyData());
const rdfString = ref("");
const showRDF = ref(false);
const fair = ref({} as TopScoreValueObj);
const care = ref({} as TopScoreValueObj);

// const keyMap = (() => {
//     const emptyData = createEmptyData();
//     const kMap: {[key: string]: string} = {};
    
//     Object.keys(emptyData).forEach(key => {
//         Object.keys(emptyData[key]).forEach(k => {
//             kMap[k] = key;
//         });
//     });

//     return kMap;
// })();

const context: ContextDefinition = {
    // "@version": "1.1",
    // prefixes
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcterms": "http://purl.org/dc/terms/",
    "geo": "http://www.opengis.net/ont/geosparql#",
    "odrl": "http://www.w3.org/ns/odrl/2/",
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
        "@type": "@id",
        "@container": "@set",
    },
    "relationRole": {
        "@id": "dcat:hadRole",
        "@type": "@id",
    },
    "agent": {
        "@id": "prov:agent",
        "@type": "@id"
    },
    "dataIndigeneity": {
        "@id": "dcterms:type",
        "@type": "@id",
        "@container": "@set",
    },
    "agentIndigeneity": {
        "@id": "dcterms:type",
        "@type": "@id",
    },
    "identifier": {
        "@id": "sdo:identifier",
        "@container": "@set",
    },
    "name": "sdo:name",
    "sdoDescription": "sdo:description",
    "relation": {
        "@id": "dcat:relation",
        "@container": "@set"
    },
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
    "hasPolicy": {
        "@id": "odrl:hasPolicy",
        "@type": "@id",
    },
    "duty": {
        "@id": "odrl:duty",
        "@type": "@id",
    },
    "contact": "prov:qualifiedAttribution",
    "email": {
        "@id": "sdo:email",
        "@type": "xsd:anyURI",
    },
    "telephone": "sdo:telephone",
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

const rdfFormats: {[key: string]: Format} = {
    "ttl": "text/turtle",
    "trig": "application/trig",
    "nt": "application/n-triples",
    "n3": "text/n3",
    "nq": "application/n-quads",
    "rdf": "application/rdf+xml",
};

// function loadFile(event: InputEvent) {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (!file) {
//         return;
//     }
//     var reader = new FileReader();
//     reader.onload = function(e) {
//         const extension = file.name.split(".")[1];
//         rdfToData(e.target.result, rdfFormats[extension]);
//     };
//     reader.readAsText(file);
// }

// async function rdfToData(rdf: string, format: Format) {
//     data.value = createEmptyData();
//     store.value.update("DROP ALL");
//     store.value.load(rdf, format);
//     // TODO: do query to check for valid data
//     const nquads = store.value.dump("application/n-quads");
//     const jsonldObj = await jsonld.fromRDF(nquads, { format: "application/n-quads" });
//     const framedObj = await jsonld.frame(jsonldObj, { "@context": context, type: "dcat:Resource" });
//     Object.keys(framedObj).forEach(key => {
//         if (Object.keys(keyMap).includes(key)) {
//             data.value[keyMap[key]][key] = framedObj[key];
//         }
//     });
// }

async function dataToRdf(dataObj: any): Promise<string> {
    // console.log(schemaFlattened)
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

let scoringObj: Scoring;

async function doScoring(scoringObj: Scoring, data: string) {
    const p = await Promise.all([
        scoringObj.score(dataFlattened.value.iri, "fair", "json", { value: data, format: "application/n-triples" }) as TopScoreValueObj,
        scoringObj.score(dataFlattened.value.iri, "care", "json", { value: data, format: "application/n-triples" }) as TopScoreValueObj
    ]);
    fair.value = p[0];
    care.value = p[1];
}

watch(rdfString, async (newValue) => {
    // fair.value = await fairScore(newValue, dataFlattened.value.iri, "application/n-triples");
    // care.value = await careScore(newValue, dataFlattened.value.iri, "application/n-triples");
    if (scoringObj) {
        await doScoring(scoringObj, newValue);
    }
});

if (SAVE_TO_LOCALSTORAGE) {
    watch(data, (newValue) => {
        localStorage.setItem("data", JSON.stringify(newValue));
    }, { deep: true });
}

onMounted(async () => {
    if (SAVE_TO_LOCALSTORAGE) {
        const savedData = localStorage.getItem("data");
        if (savedData) {
            data.value = JSON.parse(savedData);
            // const savedDataParsed = JSON.parse(savedData);
            // const stepMap = steps.reduce((obj, step) => {
            //     obj[step.title] = step.schema.shape;
            //     return obj;
            // }, {});
            // Object.entries(data.value).forEach(([key, obj]) => {
            //     data.value[key] = deepmerge(obj, removeEmptyValues(savedDataParsed[key], stepMap[key]));
            // });
        } else {
            data.value.General.iri = DEFAULT_IRI;
        }
    } else {
        data.value.General.iri = DEFAULT_IRI;
    }
    scoringObj = await Scoring.init(["fair", "care"], { value: rdfString.value, format: "application/n-triples" });
    doScoring(scoringObj, rdfString.value);

    // rdfString.value = await dataToRdf(dataFlattened.value);
    // fair.value = await fairScore(rdfString.value, dataFlattened.value.iri, "application/n-triples");
    // care.value = await careScore(rdfString.value, dataFlattened.value.iri, "application/n-triples");
});
</script>

<template>
    <div class="mb-4">
        <h1 class="bold text-3xl mb-4">Metadata Entry Tool</h1>
        <p>This form is to be completed for submitting metadata to the Indigenous Data Network.</p>
        <p>In order to complete a compliant metadata record for your data, you need to fill out the information required
            in the form below. You have the option of completing only the minimum required information (indicated by a
            red asterix) but it is recommended that you include as much information as possible in the form.</p>
        <p>The more information you are able to provide, the higher the <a
                href="https://force11.org/info/the-fair-data-principles" target="_blank"
                rel="noopener noreferrer">FAIR</a> and <a href="https://www.gida-global.org/care" target="_blank"
                rel="noopener noreferrer">CARE</a> scores for your metadata. For now, these scores generate placeholder
            values.</p>
        <p>The metadata in RDF format can optionally be viewed on the right of the form. The RDF and scores are updated
            as you complete the form. More information about the metadata profile can be found <a
                href="https://data.idnau.org/pid/cp/guide" target="_blank" rel="noopener noreferrer">here</a>.</p>
        <p>This form uses the IDN's collection of people and organisations, or "agents", that are related to metadata
            and datasets in the IDN, called the <a href="https://agentsdb.idnau.org" target="_blank"
                rel="noopener noreferrer">Agents Database</a>. You can refer to this list of agents or create a custom
            agent if required.</p>
        <p>This form saves your progress between reloads. If you're experiencing problems or need to clear your data, either select "Clear Form" below or clear your local storage in your browser.</p>
    </div>
    <div class="grid grid-cols-[3fr_1fr] gap-4 relative">
        <div>
            <div class="flex flex-row gap-2 items-start mb-6">
                <Button variant="outline" class="mr-auto" disabled>Tutorial</Button>
                <div class="flex flex-col max-w-min">
                    <Button variant="secondary" disabled>Upload File <Upload class="size-4 ml-2" /></Button>
                    <span class="text-muted-foreground text-xs">Supports .ttl, .trig, .nt, .nq, .n3 & .rdf</span>
                </div>
                <!-- <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="file">Upload File</Label>
                    <Input id="file" type="file" accept=".ttl, .nq, .n3, .nt, .trig, .rdf" @change="loadFile" />
                </div> -->
                <DropdownMenu>
                    <DropdownMenuTrigger as-child disabled>
                        <Button variant="secondary">Load Example <ChevronDown class="size-4 ml-2" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem v-for="example in EXAMPLES" class="cursor-pointer">{{ example.label }}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <VerticalStepper :steps="steps">
                <template #default="{ stepObj, stepIndex }">
                    <Card v-show="stepIndex === stepObj.step">
                        <CardContent>
                            <p>{{ stepObj.description }}</p>
                            <!-- <Button v-if="stepIndex === 1" @click="data.General.iri = DEFAULT_IRI" size="xs">Generate IRI</Button> -->
                            <FormBuilder :schema="stepObj.schema" v-model="data[stepObj.title]" :registry="registry" class="grid grid-cols-2 gap-3" />
                        </CardContent>
                    </Card>
                </template>
                <template #left-buttons>
                    <Button variant="destructive" size="sm" @click="clear">Clear Form <Trash2 class="size-4 ml-2" /></Button>
                </template>
                <template #right-buttons>
                    <Button variant="secondary" size="sm" disabled>Save File <Download class="size-4 ml-2" /></Button>
                </template>
                <template #right-buttons-last>
                    <Button variant="default" size="sm" disabled>Submit <Send class="size-4 ml-2" /></Button>
                </template>
            </VerticalStepper>
        </div>
        <div>
            <div class="flex flex-col gap-4 sticky top-0">
                <Scores title="FAIR" :score="fair" />
                <Scores title="CARE" :score="care" />
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
                            <Editor
                                v-model="rdfString"
                                class="h-[340px] w-full"
                                language="n-triples"
                                readonly
                                hideTheme
                                hideLanguage
                                :theme="colorMode.unknown || colorMode.value === 'light' ? 'light-tm' : 'dark-tm'"
                                :downloadFilename="dataFlattened.title || 'metadata'"
                            />
                            <span class="absolute end-0 bottom-0 inset-y-2 flex justify-center px-2">
                                <Modal>
                                    <template #trigger>
                                        <Button variant="outline" size="sm" title="Expand">
                                            <Expand class="h-4 w-4" />
                                        </Button>
                                    </template>
                                    <template #title>Metadata RDF</template>
                                    <Editor
                                        v-model="rdfString"
                                        class="h-[600px] w-full"
                                        language="n-triples"
                                        readonly
                                        hideTheme
                                        hideLanguage
                                        :theme="colorMode.unknown || colorMode.value === 'light' ? 'light-tm' : 'dark-tm'"
                                        :downloadFilename="dataFlattened.title || 'metadata'"
                                    />
                                </Modal>
                            </span>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    </div>
</template>

<style>
p {
    margin-bottom: 0.5rem;
}
</style>