<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import type { Option } from "~/types";

register(z);

// doesn't supported nested objects yet
function schemaCreateEmptyObject(schema: z.AnyZodObject): any {
    return Object.entries(schema.shape).reduce((obj, [key, val]) => {
        obj[key] = val.getMeta().initial;
        return obj;
    }, {});
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
    accessRights: z.string().describe("a description").meta({
        label: "Access Rights",
        type: "select", // select string is single
        placeholder: "Select an access right",
        initial: "",
        options: accessRightsOptions.value,
    }),
    // object array is dynamic adding of a group of inputs
});

const data = ref<z.infer<typeof schema>>(schemaCreateEmptyObject(schema));
</script>

<template>
    <div>
        <FormBuilder :schema="schema" v-model="data" />
        <pre>{{ JSON.stringify(data, null, 4) }}</pre>
    </div>
</template>
