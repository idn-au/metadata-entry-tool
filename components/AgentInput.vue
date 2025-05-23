<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { Pencil } from "lucide-vue-next";
import * as z from "zod";
import { formField, useVtForm, FormBuilder, type Option, schemaCreateEmptyObject, type Registry, SearchInput } from "@vulptech/vt-form";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import IRIInput from "~/components/IRIInput.vue";
import ConceptSelect from "~/components/ConceptSelect.vue";

// TODO: going from searched agent to custom agent breaks

const SPARQL_URL = "https://api.idnau.org/sparql";

const props = defineProps<{
    placeholder?: string;
    listQuery: (term: string) => Promise<Option>[];
    getQuery?: (value: string) => Promise<any>;
    resultLabel?: string;
    class?: HTMLAttributes["class"];
}>();

const { data: indigeneityOptions } = await useAsyncData("agentIndigeneityOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label ?desc
    WHERE {
        BIND(<https://data.idnau.org/pid/vocab/org-indigeneity> AS ?cs)
        ?cs a skos:ConceptScheme .
        ?value a skos:Concept ;
            skos:inScheme ?cs ;
            skos:prefLabel ?label ;
            skos:definition ?desc .
    }`));

const { data: aaRoleOptions } = await useAsyncData("aaRoleOptions", () => sparqlOptions(SPARQL_URL, `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT DISTINCT ?value ?label ?desc
    WHERE {
        BIND(<https://data.idnau.org/pid/vocab/aarr> AS ?cs)
        ?cs a skos:ConceptScheme .
        ?value a skos:Concept ;
            skos:inScheme ?cs ;
            skos:prefLabel ?label ;
            skos:definition ?desc .
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

function generateAgentIRI(): string {
    if (data.value && data.value.type && data.value.type === "https://schema.org/Person") {
        return `https://data.idnau.org/pid/person/${uuidv4()}`;
    } else {
        return `https://data.idnau.org/pid/organization/${uuidv4()}`;
    }
}

const schema = z.object({
    iri: formField(z.string().url({ message: "Must be a valid IRI" }), {
        label: "IRI",
        type: "iri",
        generateFn: generateAgentIRI,
        placeholder: "https://example.com",
        initial: "",
        description: "Provide an IRI or have an IRI automatically assigned",
        tooltip: "An IRI is a standard identifier in the form of a web address (URL). Good IRIs are part of a managed system.",
    }),
    name: formField(z.string(), {
        label: "Name",
        type: "text",
        initial: "",
        tooltip: "The name of the person or organization",
    }),
    type: formField(z.string(), {
        label: "Type",
        type: "select",
        placeholder: "Select a type",
        initial: "",
        options: [{label: "Person", value: "https://schema.org/Person"}, {label: "Organization", value: "https://schema.org/Organization"}]
    }),
    url: formField(z.string().url().optional(), {
        label: "URL",
        type: "url",
        placeholder: "https://example.com",
        initial: "",
        tooltip: "A website",
    }),
    sdoDescription: formField(z.string().optional(), {
        label: "Description",
        type: "textarea",
        initial: "",
        description: "Supports new lines and basic formatting",
        class: "col-span-full",
    }),
    agentIndigeneity: formField(z.string().optional(), {
        label: "Indigeneity",
        type: "concept",
        vocabURL: "https://data.idnau.org/pid/vocab/org-indigeneity",
        initial: "",
        options: indigeneityOptions.value,
    }),
    identifier: formField(z.object({
        value: formField(z.string(), {
            label: "Identifier",
            type: "text",
            initial: "",
        }),
        type: formField(z.string().url(), {
            label: "Datatype",
            type: "url",
            initial: "",
            description: "Must be an IRI",
        }),
    }).array().optional(), {
        label: "Identifier",
        type: "add",
        initial: [{
            value: "",
            type: "",
        }],
        element: {
            value: "",
            type: "",
        },
        class: "col-span-full grid-cols-1 md:grid-cols-2 gap-2"
    }),
    relation: formField(z.object({
        agent: formField(z.string(), {
            label: "Agent",
            type: "search",
            placeholder: "Search for an agent",
            initial: "",
            listQuery: agentSearch,
        }),
        relationRole: formField(z.string(), {
            label: "Role",
            type: "concept",
            vocabURL: "https://data.idnau.org/pid/vocab/aarr",
            placeholder: "Select role",
            initial: "",
            options: aaRoleOptions.value,
            tooltip: "The role of the relation to this agent."
        }),
    }).array().optional(), {
        label: "Relations",
        type: "add",
        initial: [{ agent: "", relationRole: "" }],
        element: { agent: "", relationRole: "" },
        class: "col-span-full"
    }),
});

const model = defineModel<z.infer<typeof schema>>({ required: true });

const registry: Registry = {
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
            vocabURL: (def, meta, model) => meta.vocabURL,
            placeholder: (def, meta, model) => meta.placeholder,
            multiple: (def, meta, model) => meta.multiple,
        },
    },
};

const { formData: data, resetValues } = useVtForm(schema);

const open = ref(false);

const emits = defineEmits<{
    focus: [];
    blur: [];
    clear: [];
    input: [value: string | string[]];
    change: [value: string | string[]];
}>();

function handleSave() {
    model.value = removeEmptyValues(data.value, schema.shape);
    open.value = false;
}

watch(open, (newValue) => {
    if (newValue) {
        if (Object.keys(model.value).length === 0) {
            data.value.iri = `https://data.idnau.org/pid/organization/${uuidv4()}`;
        } else {
            // data.value = model.value;
            data.value = {...data.value, ...removeEmptyValues(model.value, schema.shape)}
        }
    } else {
        // data.value = {};
        resetValues();
    }
});

watch(() => data.value?.type, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        data.value.iri = generateAgentIRI();
    }
});
</script>

<template>
    <div :class="cn('w-full flex flex-row gap-2 items-center', props.class)">
        <SearchInput
            v-model="model"
            :listQuery="props.listQuery"
            :getQuery="props.getQuery"
            :resultLabel="props.resultLabel"
            :placeholder="props.placeholder"
            @clear="resetValues(); emits('clear')"
        />
        <Modal v-model:open="open" class="sm:max-w-[800px]">
            <template #trigger>
                <Button variant="outline" title="Create a custom agent"><Pencil class="size-4" /></Button>
            </template>
            <template #title>Custom Agent</template>
            <template #description>You can create your own agent here if it doesn't exist in the IDN's agents database</template>
            <FormBuilder :schema="schema" :registry="registry" v-model="data" class="grid grid-cols-2 gap-3" />
            <template #footer>
                <Button variant="secondary" class="mr-auto" @click="open = false;">Cancel</Button>
                <div class="flex flex-row gap-2 items-center">
                    <Button variant="destructive" @click="resetValues">Clear</Button>
                    <Button @click="handleSave">Save</Button>
                </div>
            </template>
        </Modal>
    </div>
</template>
