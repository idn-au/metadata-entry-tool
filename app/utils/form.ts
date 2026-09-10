import type { Registry, StepConfig } from "@vulptech/vt-form";
import { formField } from "@vulptech/vt-form";
import * as z from "zod";
import AgentInput from "~/components/AgentInput.vue";
import AgentSearchInput from "~/components/AgentSearchInput.vue";
import ConceptSelect from "~/components/ConceptSelect.vue";
import DateInput from "~/components/DateInput.vue";
import IndigeneitySelect from "~/components/IndigeneitySelect.vue";
import IRIInput from "~/components/IRIInput.vue";
import SpatialInput from "~/components/SpatialInput.vue";
import { agentGet, agentSearch, generateAgentIRI, generateIRI } from "./helpers";

export const REGISTRY: Registry = {
    iri: {
        component: IRIInput,
        props: {
            generateFn: ({ meta }) => meta.generateFn,
        },
    },
    concept: {
        component: ConceptSelect,
        props: {
            options: ({ meta }) => meta.options,
            vocabIRI: ({ meta }) => meta.vocabIRI,
            placeholder: ({ meta }) => meta.placeholder,
            multiple: ({ meta }) => meta.multiple,
        },
    },
    agent: {
        component: AgentInput,
        props: {
            listQuery: ({ meta }) => meta.listQuery,
            getQuery: ({ meta }) => meta.getQuery || undefined,
            resultLabel: ({ meta }) => meta.resultLabel || undefined,
        },
    },
    agentSearch: {
        component: AgentSearchInput,
        props: {
            listQuery: ({ meta }) => meta.listQuery,
            getQuery: ({ meta }) => meta.getQuery || undefined,
            resultLabel: ({ meta }) => meta.resultLabel || undefined,
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
    indigeneitySelect: {
        component: IndigeneitySelect,
        props: {
            orgVocabIRI: ({ meta }) => meta.orgVocabIRI,
            personVocabIRI: ({ meta }) => meta.personVocabIRI,
            isPerson: ({ model }) => model?.value.type === "https://schema.org/Person",
            placeholder: ({ meta }) => meta.placeholder,
            multiple: ({ meta }) => meta.multiple,
        },
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
    }),
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
    title: formField(z.string(), {
        label: "Title",
        type: "text",
        description: "This is the name by which this dataset will be known.",
        tooltip: "The name of the data that this metadata is describing.",
        emptyValue: "",
        step: "general",
    }),
    iri: formField(z.string().url({ message: "Must be a valid IRI" }), {
        label: "ID",
        type: "iri",
        generateFn: () => generateIRI("resource"),
        placeholder: "https://example.com",
        description: "An IRI is automatically assigned, please change this if the dataset already has an identifier.",
        tooltip: "An IRI (a web-address-style identifier) uniquely identifying this resource.",
        emptyValue: "",
        step: "general",
    }),
    dataIndigeneity: formField(z.string().array().optional(), {
        label: "Indigenous Status",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/vocab/indigeneity",
        multiple: true,
        placeholder: "Select Indigenous statuses",
        description: "A dataset may reflect multiple understandings and expressions of Indigeneity.",
        tooltip: "The nature and extent of this dataset's connection to Indigenous peoples, communities, or knowledge.",
        step: "general",
    }),
    language: formField(z.string().array().optional(), {
        label: "Language",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/austlang",
        multiple: true,
        placeholder: "Select language(s)",
        description: "A dataset may relate to one or multiple Indigenous languages.",
        tooltip: "The Indigenous language(s) the dataset relates to, coded using the AUSTLANG classification.",
        step: "general",
    }),
    addType: formField(z.string().optional(), {
        label: "Resource Type",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/vocab/cat-obj-types",
        description: "Multiple types can be selected.",
        tooltip: "The kind of resource being catalogued e.g. dataset, website, book, map, archival collection etc.",
        placeholder: "Choose type",
        step: "general",
    }),
    catRoles: formField(z.string().array().optional(), {
        label: "Catalogue Roles",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/vocab/cat-roles",
        multiple: true,
        placeholder: "Choose roles",
        description: "The connection between this catalogue and the dataset being described. Multiple roles can be selected.",
        tooltip: "The relationship between this catalogue, the metadata description, and the original dataset.",
        emptyValue: [],
        step: "general",
    }),
    description: formField(z.string(), {
        label: "Description",
        type: "textarea",
        description: "Supports new lines and basic formatting.",
        tooltip: "A free-text description of the data, including how it was created and its intended purpose.",
        emptyValue: "",
        step: "general",
        class: "col-span-full",
    }),
    hasPolicy: formField(z.object({
        type: formField(z.literal("odrl:Policy"), {
            type: "hidden",
            initial: "odrl:Policy",
        }),
        title: formField(z.string(), {
            label: "Title",
            type: "text",
            tooltip: "The name of the policy.",
            emptyValue: "",
        }),
        additionalType: formField(z.string().url().optional(), {
            label: "Policy Type",
            type: "concept",
            vocabIRI: "https://data.idnau.org/pid/vocab/policy-types",
            placeholder: "Select a policy type",
            tooltip: "Whether the policy is Indigenous-specific or a generic institutional policy.",
        }),
        url: formField(z.string().url().optional(), {
            label: "URL",
            type: "url",
            placeholder: "https://example.com",
            tooltip: "A URL to the policy document.",
            emptyValue: "",
        }),
        sdoDescription: formField(z.string().optional(), {
            label: "Description",
            type: "textarea",
            description: "Supports new lines and basic formatting.",
            tooltip: "A brief description of what the policy covers.",
            emptyValue: "",
            class: "col-span-full",
        }),
        duty: formField(z.string().optional(), {
            label: "Archiving included",
            type: "checkbox",
            description: "Is metadata & data archiving included in the policy?",
            tooltip: "Whether this policy covers archiving requirements.",
            trueValue: "http://example.com/duty/archive-data-and-metadata",
            falseValue: "",
            emptyValue: "",
            class: "col-span-full",
        }),
    }).array().optional(), {
        label: "Policy",
        type: "add",
        step: "policies",
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
            description: "Search for an existing agent, or add an agent if they're not yet in the Agents database.",
            tooltip: "The person or organisation associated with this data.",
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
            description: "An agent can have multiple roles in relation to the data.",
            tooltip: "The role that the person or organisation has in relation to the data.",
        }),
    }).array().min(1, "Must have an agent and role selected"), {
        label: "Agents",
        type: "add",
        // initial: [
        //     {}
        // ],
        description: "You can add more than one.",
        step: "agentInfo",
        class: "col-span-full",
    }),
    created: formField<z.ZodTypeAny, any>(customDate, {
        label: "Collected",
        type: "customDate",
        // description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        tooltip: "The date that this dataset was created.",
        step: "dates",
    }),
    modified: formField<z.ZodTypeAny, any>(customDate, {
        label: "Updated",
        type: "customDate",
        // description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        tooltip: "The most recent date on which the data was modified. It can be the same as the date it was created.",
        step: "dates",
    }),
    issued: formField<z.ZodTypeAny, any>(customDate.optional(), {
        label: "Published",
        type: "customDate",
        // description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        tooltip: "The data, if any, on which this dataset was published.",
        step: "dates",
    }),
    temporal: formField(z.object({
        type: formField(z.literal("dcterms:PeriodOfTime"), {
            type: "hidden",
            initial: "dcterms:PeriodOfTime",
        }),
        startedAtTime: formField<z.ZodTypeAny, any>(customDate.optional(), {
            label: "Start Time",
            type: "customDate",
            // description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        }),
        endedAtTime: formField<z.ZodTypeAny, any>(customDate.optional(), {
            label: "End Time",
            type: "customDate",
            // description: "Either of YYYY, MM/YYYY or DD/MM/YYYY are supported",
        }),
    }).optional(), {
        label: "Start & End Dates",
        type: "group",
        tooltip: "The time period the data's content covers.",
        step: "dates",
        class: "col-span-full",
    }),
    license: formField(z.string().optional(), {
        label: "License",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/licenses",
        placeholder: "Select a license",
        tooltip: "The legal terms under which the data is made available.",
        step: "rights",
    }),
    accessRights: formField(z.string().optional(), {
        label: "Access Rights",
        type: "concept",
        vocabIRI: "https://linked.data.gov.au/def/data-access-rights",
        placeholder: "Select an access right",
        tooltip: "Controls how users and systems can access the resource e.g. fully accessible, protected, or restricted.",
        step: "rights",
    }),
    rights: formField(z.string().max(300).optional(), {
        label: "Rights",
        type: "textarea",
        tooltip: "Free-form rights information, for use when no formal license or access rights classification applies.",
        description: "Max 300 characters. Supports new lines and basic formatting.",
        emptyValue: "",
        step: "rights",
        class: "col-span-full",
    }),
    spatial: formField<z.ZodTypeAny, any>(z.union([z.string().url(), z.object({
        type: formField(z.literal("geo:Geometry"), {
            type: "hidden",
            initial: "geo:Geometry",
        }),
        asWKT: z.object({
            type: z.literal("geo:wktLiteral"),
            value: z.string(),
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
            value: z.string(),
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
        tooltip: "The spatial area the data covers",
        step: "spatial",
    }),
    distribution: formField(z.object({
        type: formField(z.literal("sdo:DataDownload"), {
            type: "hidden",
            initial: "sdo:DataDownload",
        }),
        title: formField(z.string().optional(), {
            label: "Title",
            type: "text",
            tooltip: "The name of this distribution, if it needs to be distinguished from others.",
            emptyValue: "",
        }),
        accessURL: formField(z.string().url({ message: "Must be a valid URL" }).optional(), {
            label: "Access URL",
            type: "url",
            placeholder: "https://example.com",
            description: "Must be a publicly available web address.",
            tooltip: "A weblink to where the data can be accessed.",
            emptyValue: "",
        }),
        description: formField(z.string().optional(), {
            label: "Description",
            type: "textarea",
            description: "Supports new lines and basic formatting.",
            tooltip: "A brief description of this distribution.",
            emptyValue: "",
            class: "col-span-full",
        }),
    }).array().optional(), {
        label: "Distribution",
        type: "add",
        step: "distribution",
        class: "grid-cols-1 md:grid-cols-2 gap-2 col-span-full",
    }),
    theme: formField(z.string().array(), {
        label: "Theme",
        type: "concept",
        vocabIRI: "https://data.idnau.org/pid/vocab/idn-th",
        multiple: true,
        placeholder: "Select themes",
        description: "Multiple themes can be selected.",
        tooltip: "A term (or terms) describing this dataset's subject matter, selected from IDN's Theme vocabulary. Includes some legacy terms retained for historical data but no longer used for new entries.",
        emptyValue: [],
        step: "theme",
    }),
    contact: formField(z.object({
        type: formField(z.literal("prov:Attribution"), {
            type: "hidden",
            initial: "prov:Attribution",
        }),
        agent: formField(z.object({
            // iri: formField(z.literal("https://data.idnau.org/pid/person/6cf32191-8d20-4a43-99ba-1a7727615ad9"), {
            //     type: "hidden",
            //     initial: "https://data.idnau.org/pid/person/6cf32191-8d20-4a43-99ba-1a7727615ad9",
            // }),
            type: formField(z.literal("sdo:Person"), {
                type: "hidden",
                initial: "sdo:Person",
            }),
            name: formField(z.string(), {
                label: "Name",
                type: "text",
                placeholder: "Contact name",
                tooltip: "The name of the person to contact regarding this resource.",
                emptyValue: "",
            }),
            email: formField(z.string().email().optional(), {
                label: "Email",
                type: "email",
                placeholder: "Contact email",
                tooltip: "The contact email for this resource.",
                emptyValue: "",
            }),
            telephone: formField(phoneNumber.optional(), {
                label: "Phone",
                type: "tel",
                placeholder: "Contact phone",
                tooltip: "The contact phone number for this resource.",
                emptyValue: "",
            }),
        }), {
            type: "group",
            class: "col-span-full border-none p-0",
        }),
        role: formField(z.literal("https://linked.data.gov.au/def/data-roles/pointOfContact").array().length(1), {
            type: "hidden",
            initial: ["https://linked.data.gov.au/def/data-roles/pointOfContact"],
        }),
    }).array().length(1), {
        label: "Contact Details",
        type: "add",
        initial: [
            {},
        ],
        step: "contact",
        class: "col-span-full",
        elementClass: "border-none p-0",
    }),
});

export const STEP_CONFIG: StepConfig = {
    type: "stepper",
    orientation: "vertical",
    numbered: true,
    steps: [
        {
            id: "start",
            label: "Start",
            description: "Click \"start\" below to begin a new metadata entry. If you already have an existing RDF or draft Metadata Entry you can load this file into the form by clicking \"import data\". If you would like to see an example before starting click \"load example\"",
            info: "Some users familiar with information presented in RDF can save time and populate the form by uploading an existing RDF file.",
        },
        {
            id: "general",
            label: "General",
            description: "General information about the data you're cataloguing: its name, location identifier, type, and a description.",
            info: "This information provides the essential details needed to identify, describe, discover, and manage the dataset over time.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "theme",
            label: "Theme",
            description: "A subject, topic, or theme that describes your data, particularly how it relates to Indigenous people. Our primary Indigenous classification vocabulary is online at https://data.idnau.org/pid/vocab/idn-th and may be browsed for suggestions. Other classifications can also be added.",
            info: "Themes describe what the dataset is about, making it easier to find, interpret, and use appropriately.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "agentInfo",
            label: "People & Orgs",
            description: "The people and organisations - the \"Agents\" - who play a role with respect to the data, such as owner, publisher, or creator. A \"Role\" must be assigned to the Agent.",
            info: "Documenting agents and their roles helps users understand the dataset’s provenance, stewardship, and governance.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "dates",
            label: "Dates",
            description: "The dates the dataset was created, modified, and/or published, plus the period of time the data's content covers. Either of YYYY, MM/YYYY or DD/MM/YYYY are supported.",
            info: "Date information provides important information about context, helping users understand when the data was created, published, updated, and what period it represents.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "spatial",
            label: "Spatial",
            description: "The geographic area the data covers.",
            info: "Recording geographic information improves dataset discovery and helps users identify the places and regions represented in the data.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "rights",
            label: "Rights",
            description: "Ownership and access information regarding the data. If a licence is selected, its rights holder should also be recorded.",
            info: "Rights information clarifies who owns the data and how it can be accessed, shared, and reused.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "policies",
            label: "Policies",
            description: "Any policies, Indigenous-specific or generic institutional, that govern this data.",
            info: "Documenting relevant policies supports transparency, compliance, and responsible data stewardship.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "distribution",
            label: "Distribution Info",
            description: "Where and how the data can be accessed.",
            info: "Distribution information helps users discover, access, and understand where and how the data can be obtained.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "contact",
            label: "Contact Details",
            description: "A point of contact, person or organisation, for this dataset.",
            info: "A contact is required when submitting this form to the IDN, and becomes the point of contact for the dataset.",
            class: "grid grid-cols-1 md:grid-cols-2 gap-6",
        },
        {
            id: "finish",
            label: "Finish",
        },
    ],
};

export const AGENT_SCHEMA = z.object({
    name: formField(z.string(), {
        label: "Name",
        type: "text",
        tooltip: "The name of the person or organization",
        emptyValue: "",
    }),
    iri: formField(z.string().url({ message: "Must be a valid IRI" }), {
        label: "IRI",
        type: "iri",
        generateFn: generateAgentIRI,
        placeholder: "https://example.com",
        description: "Provide an IRI or have an IRI automatically assigned",
        tooltip: "An IRI is a standard identifier in the form of a web address (URL). Good IRIs are part of a managed system.",
        emptyValue: "",
    }),
    type: formField(z.string(), {
        label: "Type",
        type: "select",
        description: "Is this agent a person or an organisation?",
        tooltip: "The type of the agent",
        placeholder: "Select a type",
        options: [
            { label: "Person", value: "https://schema.org/Person" },
            { label: "Organization", value: "https://schema.org/Organization" },
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
        label: "Indigenous Status",
        type: "indigeneitySelect",
        placeholder: "Select a status",
        orgVocabIRI: "https://data.idnau.org/pid/vocab/org-indigeneity",
        personVocabIRI: "https://data.idnau.org/pid/vocab/persons-indigenous-status",
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
        description: "You can add multiple identifiers",
        tooltip: "Other identifiers this agent may have from other systems, e.g. ABN, ORCID",
        class: "col-span-full grid-cols-1 md:grid-cols-2 gap-2",
    }),
    relation: formField(z.object({
        type: formField(z.literal("dcat:Relationship"), {
            type: "hidden",
            initial: "dcat:Relationship",
        }),
        agent: formField(z.string(), {
            label: "Agent",
            type: "agentSearch",
            placeholder: "Search for an agent",
            listQuery: agentSearch,
        }),
        relationRole: formField(z.string(), {
            label: "Role",
            type: "concept",
            vocabIRI: "https://data.idnau.org/pid/vocab/aarr",
            placeholder: "Select role",
            tooltip: "The role of the relation to this agent.",
        }),
    }).array().optional(), {
        label: "Relations",
        type: "add",
        description: "You can add multiple relations",
        tooltip: "The relationships this agent has with other existing agents",
        class: "col-span-full",
    }),
});
