<script lang="ts" setup>
import type { TopScoreValueObj } from "@idn-au/scores-calculator-js";
import type { Registry } from "@vulptech/vt-form";
import { Scores } from "@idn-au/score-component-lib";
import { ScoreCalculator } from "@idn-au/scores-calculator-js";
import { Editor } from "@kurrawongai/kai-ui";
import { Check, ChevronDown, Code, Download, Info, Play, Trash2, Upload } from "@lucide/vue";
import { useDebounceFn } from "@vueuse/core";
import { FormBuilder, schemaCreateEmptyObject, useVtForm } from "@vulptech/vt-form";
import * as jsonld from "jsonld";
import init, * as oxigraph from "oxigraph/web";
import { EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "~/components/ui/empty";

const SAVE_TO_LOCALSTORAGE = true;

const colorMode = useColorMode();

const registry: Registry = {
    iri: REGISTRY.iri,
    concept: REGISTRY.concept,
    agent: REGISTRY.agent,
    customDate: REGISTRY.customDate,
    spatial: REGISTRY.spatial,
};

const { formData: data, steps } = useVtForm(FORM_SCHEMA, { steps: STEP_CONFIG });

const rdfString = ref("");
const showRDF = ref(false);
const fair = ref({} as TopScoreValueObj);
const care = ref({} as TopScoreValueObj);
const isDownloading = ref(false);
const stepIndex = ref(1);

const formRef = useTemplateRef("formRef");

function scrollToForm() {
    if (formRef.value) {
        scrollTo({
            top: formRef.value.offsetTop - 126,
            behavior: "smooth",
        });
    }
}

function clearForm() {
    if (confirm("Are you sure you want to clear the form? You will lose all progress if you have not saved as a file.")) {
        data.value = schemaCreateEmptyObject(FORM_SCHEMA);
        data.value.iri = generateIRI("resource");
    }
}

function downloadFile() {
    isDownloading.value = true;
    const blob = new Blob([rdfString.value || ""], { type: "text/turtle" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const filename = data.value.title || "metadata";
    const extension = "ttl";
    link.download = `${filename}.${extension}`;
    link.click();
    URL.revokeObjectURL(link.href);

    setTimeout(() => {
        isDownloading.value = false;
    }, 1500);
}

const rdfFormats: { [key: string]: Format } = {
    ttl: "text/turtle",
    trig: "application/trig",
    nt: "application/n-triples",
    n3: "text/n3",
    nq: "application/n-quads",
    rdf: "application/rdf+xml",
};

function loadExample(example: Example) {
    if (confirm("Are you sure you want to load an example record? You will lose all progress if you have not saved as a file as this will replace the current data.")) {
        rdfToData(example.data, example.format);
    }
}

async function uploadFile(e: InputEvent) {
    if (confirm("Are you sure you want to load an example record? You will lose all progress if you have not saved as a file as this will replace the current data.")) {
        const files = (e.target as HTMLInputElement).files!;
        const file = files[0];
        const splitFilename = file.name.split(".");
        const fileExtension = splitFilename[splitFilename.length - 1];
        const format = rdfFormats[fileExtension];

        const rdf = await file.text();

        await rdfToData(rdf, format);
    }
}

let initialised = false;

async function rdfToData(rdf: string, format: Format) {
    // TODO: do query to check for valid data

    // data.value = schemaCreateEmptyObject();
    if (!initialised) {
        await init("https://cdn.jsdelivr.net/npm/oxigraph@0.5.9/web_bg.wasm");
        initialised = true;
    }
    const store = new oxigraph.Store();
    store.load(rdf, { format });
    const nquads = store.dump({ format: "application/n-quads", from_graph_name: oxigraph.defaultGraph() });
    const jsonldObj = await jsonld.fromRDF(nquads, { format: "application/n-quads" });
    const framedObj = await jsonld.frame(jsonldObj, { "@context": CONTEXT, "type": "dcat:Resource" });
    data.value = framedObj;
}

const debouncedSerialiseRDF = useDebounceFn(async (newValue: typeof data.value) => {
    // JSON-LD -> N-Quads
    const doc = { "@context": CONTEXT, "type": "dcat:Resource", ...newValue };
    const rdf = await (jsonld.toRDF(doc, { format: "application/n-quads" }) as Promise<string>);

    // N-Quads -> Turtle - Oxigraph JS doesn't serialize prefixes or compact [] bnodes yet
    if (!initialised) {
        await init("https://cdn.jsdelivr.net/npm/oxigraph@0.5.9/web_bg.wasm");
        initialised = true;
    }
    const store = new oxigraph.Store();
    store.load(rdf, { format: "application/n-triples" });
    rdfString.value = store.dump({ format: "text/turtle", from_graph_name: oxigraph.defaultGraph() });
}, 200);

let scoringObj: ScoreCalculator;

function sparqlQuery(store: oxigraph.Store, query: string, ask: boolean = false): SPARQLResultsJSON | boolean {
    const options = { use_default_graph_as_union: true };
    if (!ask) {
        options.results_format = "application/sparql-results+json";
    }
    let result = store.query(query, options);
    if (!ask) {
        result = JSON.parse(result as string) as SPARQLResultsJSON;
    }
    return result;
}

async function doScoring(scoringObj: ScoreCalculator, rdf: string) {
    await init({ module_or_path: "https://cdn.jsdelivr.net/npm/oxigraph@0.5.9/web_bg.wasm" });
    const store = new oxigraph.Store();
    store.load(rdf, { format: "text/turtle" });

    const p = await Promise.all([
        scoringObj.score(data.value.iri, "fair", "json", query => sparqlQuery(store, query, true), query => sparqlQuery(store, query)),
        scoringObj.score(data.value.iri, "care", "json", query => sparqlQuery(store, query, true), query => sparqlQuery(store, query)),
    ]);

    fair.value = p[0] as TopScoreValueObj;
    care.value = p[1] as TopScoreValueObj;
}

watch(data, async (newValue) => {
    await debouncedSerialiseRDF(newValue);
}, { deep: true });

watch(rdfString, async (newValue) => {
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
        }
        else {
            data.value.iri = generateIRI("resource");
        }
    }
    else {
        data.value.iri = generateIRI("resource");
    }
    scoringObj = await ScoreCalculator.init(["fair", "care"]);
    doScoring(scoringObj, rdfString.value);
});
</script>

<template>
    <div ref="formRef" class="flex flex-col gap-4 relative border rounded-xl my-4">
        <div class="flex flex-row max-sm:flex-wrap gap-2 items-start sticky top-[83px] md:top-[92px] bg-background z-48 border-b rounded-t-xl">
            <div class="flex flex-row gap-2 items-center mx-auto max-w-2xl">
                <Scores title="FAIR" :score="fair" compact />
                <div class="w-px bg-border self-stretch" />
                <Scores title="CARE" :score="care" compact />
            </div>
        </div>
        <FormBuilder
            v-model="data"
            v-model:step="stepIndex"
            :schema="FORM_SCHEMA"
            :steps="steps"
            :registry="registry"
            class="md:[&>div>div]:top-[180px] md:[&>div>div]:w-1/5! **:[&.grid]:gap-6 *:[.stepper-buttons]:rounded-b-xl"
        >
            <template #step-1-header>
&nbsp;
            </template>
            <template #step-1-top="{ nextStep }">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Play />
                        </EmptyMedia>
                        <EmptyTitle>Get Started</EmptyTitle>
                        <EmptyDescription>
                            <p>You can optionally load an existing RDF file into this form or load an example.</p>
                            <p>Click "Start" below to begin.</p>
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent class="flex flex-row flex-wrap items-center justify-center">
                        <div class="flex flex-row items-center gap-2">
                            <Button variant="secondary" as-child>
                                <Label for="file">
                                    <span class="max-md:hidden">Import Data</span>
                                    <Upload class="size-4 md:ml-2" />
                                </Label>
                                <Input id="file" type="file" :accept="Object.keys(rdfFormats).map(ext => `.${ext}`).join(',')" hidden @change="uploadFile" />
                            </Button>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger class="max-md:hidden">
                                        <Info class="size-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div>Import an existing RDF file to edit in this form.</div>
                                        <div>Supports {{ Object.keys(rdfFormats).map(ext => `.${ext}`).join(', ') }} files</div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <DropdownMenu>
                            <div class="flex flex-col max-w-min">
                                <DropdownMenuTrigger as-child>
                                    <Button variant="secondary">
                                        <span class="md:hidden">Eg</span>
                                        <span class="max-md:hidden">Load Example</span>
                                        <ChevronDown class="size-4 md:ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                            </div>
                            <DropdownMenuContent class="max-w-80">
                                <DropdownMenuItem v-for="example in exampleData" class="cursor-pointer flex flex-col items-start" @select="loadExample(example)">
                                    <span class="line-clamp-1">{{ example.label }}</span>
                                    <span v-if="example.description" class="text-xs italic text-muted-foreground line-clamp-1">{{ example.description }}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button @click="nextStep">
                            Start <Play />
                        </Button>
                    </EmptyContent>
                </Empty>
            </template>
            <template #step-11-header>
&nbsp;
            </template>
            <template #step-11-top>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Check />
                        </EmptyMedia>
                        <EmptyTitle>You're done!</EmptyTitle>
                        <EmptyDescription>
                            Click "Save File" below to save the metadata you've created to a file
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent class="flex flex-row flex-wrap items-center justify-center">
                        <Button variant="secondary" @click="downloadFile">
                            Save<span class="hidden md:flex">File</span> <Download class="size-4" />
                        </Button>
                        <!--						<Button variant="default" title="Not yet implemented" disabled> -->
                        <!--							Submit <Send class="size-4" /> -->
                        <!--						</Button> -->
                    </EmptyContent>
                </Empty>
            </template>
            <template #left-buttons>
                <Modal>
                    <template #trigger>
                        <Button variant="outline" title="Show RDF">
                            <span class="max-md:hidden">RDF</span>
                            <Code class="size-4" />
                        </Button>
                    </template>
                    <template #title>
                        Metadata RDF
                    </template>
                    <template #description>
                        Preview and copy/download the form's generated metadata in RDF
                    </template>
                    <Editor
                        v-model="rdfString"
                        class="h-[65dvh] w-full rounded-lg"
                        language="turtle"
                        readonly
                        hide-theme
                        hide-language
                        :theme="colorMode.unknown || colorMode.value === 'light' ? 'light' : 'dark'"
                        :download-filename="data.title || 'metadata'"
                    />
                </Modal>
                <Button variant="outline" class="!border-destructive text-destructive hover:!bg-destructive hover:text-destructive-foreground" @click="clearForm">
                    Clear All <Trash2 class="size-4" />
                </Button>
            </template>
        </FormBuilder>
    </div>
</template>

<style>

</style>
