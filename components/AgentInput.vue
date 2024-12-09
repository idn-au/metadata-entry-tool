<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { Pencil } from "lucide-vue-next";
import { register } from "zod-metadata";
import * as z from "zod";
import { cn } from "@/lib/utils";

register(z);

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
    SELECT DISTINCT ?value ?label
    WHERE {
        BIND(<https://data.idnau.org/pid/vocab/org-indigeneity> AS ?cs)
        ?cs a skos:ConceptScheme .
        ?value a skos:Concept ;
            skos:inScheme ?cs ;
            skos:prefLabel ?label .
    }`));

const schema = z.object({
    iri: z.string().url({ message: "Must be a valid IRI" }).describe("Provide an IRI or have an IRI automatically assigned").meta<InputMeta>({
        label: "IRI",
        type: "url",
        placeholder: "https://example.com",
        initial: "",
        tooltip: "An IRI is a standard identifier in the form of a web address (URL). Good IRIs are part of a managed system.",
    }),
    name: z.string().describe("").meta<InputMeta>({
        label: "Name",
        type: "text",
        // placeholder: "",
        initial: "",
        tooltip: "The name of the person or organization",
    }),
    type: z.string().describe("").meta<InputMeta>({
        label: "Type",
        type: "select",
        placeholder: "Select a type",
        initial: "",
        // tooltip: "The name of the person or organization",
        options: [{label: "Person", value: "https://schema.org/Person"}, {label: "Organization", value: "https://schema.org/Organization"}]
    }),
    url: z.string().url().optional().describe("").meta<InputMeta>({
        label: "URL",
        type: "url",
        placeholder: "https://example.com",
        initial: "",
        tooltip: "A website",
    }),
    sdoDescription: z.string().optional().describe("Supports new lines and basic formatting").meta<InputMeta>({
        label: "Description",
        type: "textarea",
        initial: "",
        class: "col-span-full",
        // tooltip: "A free-text description of the data. This can include how it was created and its intended purpose.",
    }),
    indigeneity: z.string().optional().describe("").meta<InputMeta>({
        label: "Indigeneity",
        type: "select",
        // placeholder: "Select a type",
        initial: "",
        // tooltip: "The name of the person or organization",
        options: indigeneityOptions.value,
    }),
    identifier: z.object({
        value: z.string().describe("").meta<InputMeta>({
            label: "Identifier",
            type: "text",
            initial: "",
        }),
        type: z.string().url().describe("Must be an IRI").meta<InputMeta>({
            label: "Datatype",
            type: "url",
            initial: "",
        }),
    }).array().optional().describe("").meta<InputMeta>({
        label: "Identifier",
        type: "add",
        // placeholder: "",
        initial: [{
            value: "",
            type: "",
        }],
        // tooltip: "The name of the person or organization",
        element: {
            value: "",
            type: "",
        },
        class: "col-span-full grid-cols-1 md:grid-cols-2 gap-2"
    }),
}).meta<SectionMeta>({
    class: "grid-cols-1 md:grid-cols-2 gap-2"
});

const model = defineModel<z.infer<typeof schema>>({ required: true });

const data = ref(schemaCreateEmptyObject(schema));

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
            data.value.iri = "https://data.idnau.org/pid/organization/18d04115-4633-4aed-b164-ac3c209b4307";
        } else {
            data.value = model.value;
        }
    } else {
        data.value = {};
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
            @clear="emits('clear')"
        />
        <Dialog v-model:open="open">
            <DialogTrigger as-child>
                <Button variant="outline" title="Create a custom agent"><Pencil class="size-4" /></Button>
            </DialogTrigger>
            <DialogContent class="max-w-[800px] w-[90dvw] max-h-[90dvh] rounded">
                <DialogHeader>
                    <DialogTitle>Custom Agent</DialogTitle>
                    <DialogDescription>
                        You can create your own agent here if it doesn't exist in the IDN's agents database
                    </DialogDescription>
                </DialogHeader>
                <div class="overflow-y-auto max-h-[70dvh]">
                    <FormBuilder :schema="schema" v-model="data" />
                </div>
                <DialogFooter class="">
                    <Button variant="secondary" class="mr-auto" @click="open = false;">Cancel</Button>
                    <div class="flex flex-row gap-2 items-center">
                        <Button variant="destructive" @click="data = {}">Clear</Button>
                        <Button @click="handleSave">Save</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
