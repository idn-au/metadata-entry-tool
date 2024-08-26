<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import type { ConfigScored } from "~/types";

register(z);

const { store } = useOxiStore();

const schema = z.object({
    iri: z.string().min(1, "IRI is required").url({ message: "Must be a valid IRI" }).describe("a description").meta({
        label: "IRI",
        type: "url",
        placeholder: "https://example.com",
    })
});

const data = ref<z.infer<typeof schema>>({
    iri: ""
});

const fair = ref({} as ConfigScored);
const care = ref({} as ConfigScored);

function handleAdd() {
    store.value.load(`PREFIX dcat: <http://www.w3.org/ns/dcat#>
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX geo: <http://www.opengis.net/ont/geosparql#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX sdo: <https://schema.org/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        <https://example.com/item> a dcat:Resource ;
            dcterms:title "title" ;
            dcterms:description "description" ;
            dcterms:license <http://purl.org/NET/rdflicense/allrightsreserved> ;
        .`);
}

watch(store, (newValue) => {
    fair.value = fairScore(newValue.dump(), "https://example.com/item");
    care.value = careScore(newValue.dump(), "https://example.com/item");
}, { deep: true });
</script>

<template>
    <Button @click="handleAdd">Load Data</Button>
    <div>Size: {{ store.size }}</div>
    <div>FAIR: <pre> {{ JSON.stringify(fair, null, 4) }} </pre></div>
    <div>FAIR: <pre> {{ JSON.stringify(care, null, 4) }} </pre></div>
    <!-- <div>
        <FormBuilder :schema="schema" v-model="data" />
        <pre>{{ JSON.stringify(data, null, 4) }}</pre>
    </div> -->
</template>
