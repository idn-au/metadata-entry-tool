import * as z from "zod";
import { formField, type StepConfig, type Registry } from "@vulptech/vt-form";
import { generateIRI, generateAgentIRI, agentSearch, agentGet } from "./helpers";
import AgentInput from "~/components/AgentInput.vue";
import DateInput from "~/components/DateInput.vue";
import SpatialInput from "~/components/SpatialInput.vue";
import IRIInput from "~/components/IRIInput.vue";
import ConceptSelect from "~/components/ConceptSelect.vue";

export const REGISTRY: Registry = {
    iri: {
        component: IRIInput,
        props: {
            generateFn: (def, meta, model) => meta.generateFn,
        },
    },
    concept: {
        component: ConceptSelect,
        props: {
            options: (def, meta, model) => meta.options,
            vocabIRI: (def, meta, model) => meta.vocabIRI,
            placeholder: (def, meta, model) => meta.placeholder,
            multiple: (def, meta, model) => meta.multiple,
        },
    },
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

export const FORM_SCHEMA = z.object({
    iri: formField(z.string().url({ message: "Must be a valid IRI" }), {
        label: "IRI",
        type: "iri",
        generateFn: () => generateIRI("resource"),
        placeholder: "https://example.com",
        description: "Provide an IRI or have an IRI automatically assigned",
        tooltip: "An IRI is a standard identifier in the form of a web address (URL). Good IRIs are part of a managed system.",
        emptyValue: "",
        step: "general",
    }),
    title: formField(z.string(), {
        label: "Title",
        type: "text",
        tooltip: "The name of the data that this metadata is describing.",
        emptyValue: "",
        step: "general",
    }),
    dataIndigeneity: formField(z.string().array().optional(), {
        label: "Indigeneity",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/vocab/indigeneity",
        multiple: true,
        placeholder: "Select indigeneity",
        description: "You can add mulitple indigeneity terms",
        tooltip: "The indigeneity of this dataset.",
        step: "general",
    }),
    description: formField(z.string(), {
        label: "Description",
        type: "textarea",
        description: "Supports new lines and basic formatting",
        tooltip: "A free-text description of the data. This can include how it was created and its intended purpose.",
        emptyValue: "",
        step: "general",
        class: "col-span-full",
    }),
    hasPolicy: formField(z.object({
        type: formField(z.literal("odrl:Policy"), {
            type: "hidden",
            initial: "odrl:Policy",
        }),
        additionalType: formField(z.string().url().optional(), {
            label: "Policy Type",
            type: "concept",
            vocabIRI: "https://data.idnau.org/pid/vocab/policy-types",
            placeholder: "Select a policy type",
        }),
        url: formField(z.string().url().optional(), {
            label: "URL",
            type: "url",
            placeholder: "https://example.com",
            emptyValue: "",
        }),
        sdoDescription: formField(z.string().optional(), {
            label: "Description",
            type: "textarea",
            emptyValue: "",
            class: "col-span-full",
        }),
        duty: formField(z.string().optional(), {
            label: "Archiving included",
            type: "checkbox",
            description: "Is metadata & data archiving included in the policy?",
            trueValue: "http://example.com/duty/archive-data-and-metadata",
            falseValue: "",
            emptyValue: "",
        }),
    }).array().optional(), {
        label: "Indigenous Data Governance Policy",
        type: "add",
        step: "general",
        class: "col-span-full",
    }),
    agentRole: formField(z.object({
        type: formField(z.literal("prov:Attribution"), {
            type: "hidden",
            initial: "prov:Attribution",
        }),
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
            description: "You can search for an agent or create your own",
            tooltip: "The name of the person, community or business that is providing this data.",
            listQuery: agentSearch,
            getQuery: agentGet,
            resultLabel: "name",
            initial: {},
        }),
        role: formField(z.string().array(), {
            label: "Role",
            type: "concept",
            vocabIRI: "https://linked.data.gov.au/def/data-roles",
            multiple: true,
            placeholder: "Choose roles",
            description: "You can select multiple roles",
            tooltip: "What role (e.g. custodian) the named person, community or business has with this data.",
        }),
    }).array().min(1, "Must have an agent and role selected"), {
        label: "Agents",
        type: "add",
        // initial: [
        //     {}
        // ],
        step: "agentInfo",
        class: "col-span-full",
    }),
    created: formField<z.ZodTypeAny, any>(customDate, {
        label: "Created",
        type: "customDate",
        description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        tooltip: "This is the date that this dataset was created (NOT the date the data occurred).",
        step: "dates",
    }),
    modified: formField<z.ZodTypeAny, any>(customDate, {
        label: "Modified",
        type: "customDate",
        description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        tooltip: "The most recent date on which the data was modified. It can be the same as the date it was created.",
        step: "dates",
    }),
    issued: formField<z.ZodTypeAny, any>(customDate.optional(), {
        label: "Issued",
        type: "customDate",
        description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        tooltip: "Issued indicates when, if ever, this dataset was published",
        step: "dates",
    }),
    license: formField(z.string().optional(), {
        label: "License",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/licenses",
        placeholder: "Select a license",
        tooltip: "This is the legal information under which the data is made available.",
        step: "rights",
    }),
    rights: formField(z.string().optional(), {
        label: "Rights",
        type: "text",
        tooltip: "This is a statement that provides required details of who holds the license selected previously. e.g. ©University of Melbourne.",
        emptyValue: "",
        step: "rights",
    }),
    accessRights: formField(z.string().optional(), {
        label: "Access Rights",
        type: "concept",
        vocabIRI: "https://linked.data.gov.au/def/data-access-rights",
        placeholder: "Select an access right",
        tooltip: "Data access rights control how users and systems access a data resource. e.g. Metadata access only. Definitions can be found here.",
        step: "rights",
    }),
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
        description: "Supports an IRI or a WKT/GeoJSON string",
        step: "spatioTemporal",
    }),
    temporal: formField(z.object({
        startedAtTime: formField<z.ZodTypeAny, any>(customDate.optional(), {
            label: "Start Time",
            type: "customDate",
            description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        }),
        endedAtTime: formField<z.ZodTypeAny, any>(customDate.optional(), {
            label: "End Time",
            type: "customDate",
            description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        }),
    }).optional(), {
        label: "Temporal",
        type: "group",
        tooltip: "This is the interval of time which the data covers at the time of publishing. There must be a start and end date.",
        step: "spatioTemporal",
        class: "col-span-full",
    }),
    distribution: formField(z.object({
        type: formField(z.literal("dcat:Distribution"), {
            type: "hidden",
            initial: "dcat:Distribution",
        }),
        title: formField(z.string(), {
            label: "Title",
            type: "text",
            emptyValue: "",
        }),
        accessURL: formField(z.string().url({ message: "Must be a valid URL" }), {
            label: "Access URL",
            type: "url",
            placeholder: "https://example.com",
            description: "A publicly resolvable URL that gives the user access to the data",
            tooltip: "A URL is normally in the format https://… . If you are NOT submitting the metadata to the Indigenous Data Network, you could insert any resolvable URL into the metadata.",
            emptyValue: "",
        }),
        theme: formField(z.string().array(), {
            label: "Theme",
            type: "concept",
            vocabIRI: "https://data.idnau.org/pid/vocab/cat-roles",
            multiple: true,
            placeholder: "Choose themes",
            emptyValue: [],
        }),
        description: formField(z.string(), {
            label: "Description",
            type: "textarea",
            description: "Supports new lines and basic formatting",
            emptyValue: "",
            class: "col-span-full",
        }),
    }).array().optional(), {
        label: "Distribution",
        type: "add",
        step: "distribution",
        class: "grid-cols-1 md:grid-cols-2 gap-2 col-span-full"
    }),
    theme: formField(z.string().array(), {
        label: "Theme",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/vocab/idn-th",
        multiple: true,
        placeholder: "Choose themes",
        description: "You can add more than one Theme term",
        tooltip: "Our vocabulary for the primary classification for indigeneity of data being described can be browsed here. This vocabulary contains historical terms which exist in legacy data but are no longer used today. We welcome suggestions and feedback on this vocabulary.",
        emptyValue: [],
        step: "theme",
    }),
    contact: formField(z.object({
        type: formField(z.literal("prov:Attribution"), {
            type: "hidden",
            initial: "prov:Attribution",
        }),
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
                emptyValue: "",
            }),
            email: formField(z.string().email(), {
                label: "Email",
                type: "email",
                placeholder: "Contact email",
                emptyValue: "",
            }),
            telephone: formField(phoneNumber, {
                label: "Phone",
                type: "tel",
                placeholder: "Contact phone",
                emptyValue: "",
            }),
        }), {
            type: "group",
            class: "col-span-full border-none p-0",
        }),
        role: formField(z.literal("https://linked.data.gov.au/def/data-roles/pointOfContact").array().length(1), {
            type: "hidden",
            initial: ["https://linked.data.gov.au/def/data-roles/pointOfContact"]
        }),
    }).array().length(1), {
        label: "Contact Details",
        type: "add",
        // initial: [
        //     {}
        // ],
        step: "contact",
        class: "col-span-full",
        elementClass: "border-none p-0",
    }),
});

export const STEP_CONFIG: StepConfig = {
    type: "stepper",
    orientation: "vertical",
    steps: [
        {
            id: "general",
            label: "General",
            description: "Basic information about this data.",
            class: "grid grid-cols-2 gap-3",
        },
        {
            id: "agentInfo",
            label: "Agent Information",
            description: "Information about the roles that agents (people and organisations) play with respect to this data. These roles are critical in determining whether this data is managed properly. Each Agent must have a matching Role.",
            class: "grid grid-cols-2 gap-3",
        },
        {
            id: "dates",
            label: "Dates",
            description: "Standard dates for the establishment and update times of this dataset. A dataset about early 20th century data might only have been made last year and the created date is then some time last year. 'Issued' indicates when, if ever, this dataset was published.",
            class: "grid grid-cols-2 gap-3",
        },
        {
            id: "rights",
            label: "Rights",
            description: "Ownership and access information of the data. If a license is selected then the rights holder to that license should also be included.",
            class: "grid grid-cols-2 gap-3",
        },
        {
            id: "spatioTemporal",
            label: "Spatio/Temporal",
            description: "The spatial (geographical) and temporal (time period) extent of the data. Temporal information is different from the dates section as, for example, this dataset may have been created recently but is about someone or something long ago.",
            class: "grid grid-cols-2 gap-3",
        },
        {
            id: "distribution",
            label: "Distribution Info",
            description: "This is optional information in the form of a publicly resolvable URL that gives the user access to the data.",
            class: "grid grid-cols-2 gap-3",
        },
        {
            id: "theme",
            label: "Theme",
            description: "Classification or categorisation of this data. We are mostly concerned with indications of 'indigeneity', i.e. how this data is related to indigenous people, however other classifications may also be added. Our primary indigenous classification vocabulary is online at https://data.idnau.org/v/vocab/vcb:idn-th which may be browsed for classification suggestions.",
            class: "grid grid-cols-2 gap-3",
        },
        {
            id: "contact",
            label: "Contact Details",
            description: "These details are required if you are submitting this metadata to the IDN. These details are also added as the point of contact for this data unless you've specifically indicated an Agent as the Point of Contact above.",
            class: "grid grid-cols-2 gap-3",
        },
    ],
};

export const AGENT_SCHEMA = z.object({
    iri: formField(z.string().url({ message: "Must be a valid IRI" }), {
        label: "IRI",
        type: "iri",
        generateFn: generateAgentIRI,
        placeholder: "https://example.com",
        description: "Provide an IRI or have an IRI automatically assigned",
        tooltip: "An IRI is a standard identifier in the form of a web address (URL). Good IRIs are part of a managed system.",
        emptyValue: "",
    }),
    name: formField(z.string(), {
        label: "Name",
        type: "text",
        tooltip: "The name of the person or organization",
        emptyValue: "",
    }),
    type: formField(z.string(), {
        label: "Type",
        type: "select",
        placeholder: "Select a type",
        options: [
            { label: "Person", value: "https://schema.org/Person" },
            { label: "Organization", value: "https://schema.org/Organization" }
        ],
    }),
    url: formField(z.string().url().optional(), {
        label: "URL",
        type: "url",
        placeholder: "https://example.com",
        tooltip: "A website",
    }),
    sdoDescription: formField(z.string().optional(), {
        label: "Description",
        type: "textarea",
        description: "Supports new lines and basic formatting",
        class: "col-span-full",
    }),
    agentIndigeneity: formField(z.string().optional(), {
        label: "Indigeneity",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/vocab/org-indigeneity",
    }),
    identifier: formField(z.object({
        value: formField(z.string(), {
            label: "Identifier",
            type: "text",
        }),
        type: formField(z.string().url(), {
            label: "Datatype",
            type: "select",
            options: [
                { label: "Australian business number (ABN)", value: "http://id.loc.gov/vocabulary/identifiers/ausbn" },
                { label: "Australian company number (ACN)", value: "http://id.loc.gov/vocabulary/identifiers/auscn" },
                { label: "Australian registered body number (ABRN)", value: "http://id.loc.gov/vocabulary/identifiers/ausrn" },
                { label: "Open researcher and contributor identifier (ORCID)", value: "http://id.loc.gov/vocabulary/identifiers/orcid" },
                { label: "Research Organization Registry (ROR)", value: "http://id.loc.gov/vocabulary/identifiers/ror" },
            ],
        }),
    }).array().optional(), {
        label: "Identifier",
        type: "add",
        class: "col-span-full grid-cols-1 md:grid-cols-2 gap-2"
    }),
    relation: formField(z.object({
        type: formField(z.literal("dcat:Relationship"), {
            type: "hidden",
            initial: "dcat:Relationship",
        }),
        agent: formField(z.string(), {
            label: "Agent",
            type: "search",
            placeholder: "Search for an agent",
            listQuery: agentSearch,
        }),
        relationRole: formField(z.string(), {
            label: "Role",
            type: "concept",
            vocabIRI: "https://data.idnau.org/pid/vocab/aarr",
            placeholder: "Select role",
            tooltip: "The role of the relation to this agent."
        }),
    }).array().optional(), {
        label: "Relations",
        type: "add",
        class: "col-span-full"
    }),
});
