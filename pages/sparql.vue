<script lang="ts" setup>
import * as oxigraph from "oxigraph/web";
import metExample from "~/data/metExample";

const { store } = useOxiStore();

const results = ref<Map<string, any>[] | oxigraph.Quad[] | boolean | string>("");
const data = ref("");
const sparql = ref("");
const prefixes = ref(`PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sdo: <https://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`);
const loading = ref(false);

function loadExample() {
    data.value = metExample;
}

function query() {
    loading.value = true;
    store.value.load(data.value);
    results.value = store.value.query(prefixes.value + sparql.value);
    loading.value = false;
}
</script>

<template>
    <Button @click="loadExample">Load MET data</Button>
    <div class="flex flex-row gap-4">
        <div class="data flex-1 flex flex-col">
            <h2>Data</h2>
            <Textarea v-model="data" class="flex-grow" />
        </div>
        <div class="query flex-1">
            <h2>Query</h2>
            <div class="flex flex-col gap-2">
                <Textarea v-model="prefixes" class="h-48" disabled />
                <Textarea v-model="sparql" class="flex-grow h-96" />
            </div>
            
        </div>
    </div>
    <Button @click="query" :disabled="!data || !sparql">Query</Button>
    <div v-if="results" class="results">
        <h2>Results</h2>
        <span v-if="loading">Loading...</span>
        <pre v-else>{{ results }}</pre>
    </div>
</template>

<style lang="scss" scoped>
textarea {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>