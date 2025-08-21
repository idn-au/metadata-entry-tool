<script lang="ts" setup>
import * as jsonld from "jsonld";
import { ChevronDown, ChevronsUpDown, Expand, Upload, Download, Trash2, Send } from "lucide-vue-next";
import { useVtForm, FormBuilder, type Registry, schemaCreateEmptyObject } from "@vulptech/vt-form";
import { Scoring, type TopScoreValueObj } from "@idn-au/scores-calculator-js";
import { Scores } from "@idn-au/score-component-lib";
import { Editor } from "@kurrawongai/kai-ui";
import init, * as oxigraph from "oxigraph/web";
import { useDebounceFn } from "@vueuse/core";

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

const rdfFormats: {[key: string]: Format} = {
    "ttl": "text/turtle",
    "trig": "application/trig",
    "nt": "application/n-triples",
    "n3": "text/n3",
    "nq": "application/n-quads",
    "rdf": "application/rdf+xml",
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
        const splitFilename = file.name.split(".")
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
        await init("https://cdn.jsdelivr.net/npm/oxigraph@0.4.11/web_bg.wasm");
        initialised = true;
    }
    const store = new oxigraph.Store();
    store.load(rdf, {format});
    const nquads = store.dump({format: "application/n-quads", from_graph_name: oxigraph.defaultGraph()});
    const jsonldObj = await jsonld.fromRDF(nquads, { format: "application/n-quads" });
    const framedObj = await jsonld.frame(jsonldObj, { "@context": CONTEXT, type: "dcat:Resource" });
    data.value = framedObj;
}

const debouncedSerialiseRDF = useDebounceFn(async (newValue: typeof data.value) => {
    // JSON-LD -> N-Quads
    const doc = { "@context": CONTEXT, type: "dcat:Resource", ...newValue };
    const rdf = await (jsonld.toRDF(doc, { format: "application/n-quads" }) as Promise<string>);

    // N-Quads -> Turtle - Oxigraph JS doesn't serialize prefixes or compact [] bnodes yet
    if (!initialised) {
        await init("https://cdn.jsdelivr.net/npm/oxigraph@0.4.11/web_bg.wasm");
        initialised = true;
    }
    const store = new oxigraph.Store();
    store.load(rdf, { format: "application/n-triples" });
    rdfString.value = store.dump({ format: "text/turtle", from_graph_name: oxigraph.defaultGraph() });
}, 200);

let scoringObj: Scoring;

async function doScoring(scoringObj: Scoring, rdf: string) {
    const p = await Promise.all([
        scoringObj.score(data.value.iri, "fair", "json", { value: rdf, format: "text/turtle" }) as Promise<TopScoreValueObj>,
        scoringObj.score(data.value.iri, "care", "json", { value: rdf, format: "text/turtle" }) as Promise<TopScoreValueObj>
    ]);
    fair.value = p[0];
    care.value = p[1];
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
        } else {
            data.value.iri = generateIRI("resource");
        }
    } else {
        data.value.iri = generateIRI("resource");
    }
    scoringObj = await Scoring.init(["fair", "care"], { value: rdfString.value, format: "text/turtle" });
    doScoring(scoringObj, rdfString.value);
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
    <div class="flex flex-col-reverse md:grid md:grid-cols-[3fr_1fr] gap-4 relative">
        <div>
            <div class="flex flex-row gap-2 items-start mb-6">
                <div class="flex flex-col max-w-min mr-auto">
                    <Button variant="outline" class="mr-auto" disabled>Tutorial</Button>
                    <span class="text-muted-foreground text-xs">Not yet implemented</span>
                </div>
                <div class="flex flex-col max-w-min">
                    <Button variant="secondary" as-child>
                        <Label for="file">Upload<span class="hidden md:flex"> File</span> <Upload class="size-4 ml-2" /></Label>
                        <Input id="file" type="file" :accept="Object.keys(rdfFormats).map(ext => `.${ext}`).join(',')" @change="uploadFile" hidden />
                    </Button>
                    <span class="text-muted-foreground text-xs">Supports {{ Object.keys(rdfFormats).map(ext => `.${ext}`).join(', ') }}</span>
                </div>
                <DropdownMenu>
                    <div class="flex flex-col max-w-min">
                        <DropdownMenuTrigger as-child>
                            <Button variant="secondary">Load Example <ChevronDown class="size-4 ml-2" /></Button>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent>
                        <DropdownMenuItem v-for="example in exampleData" class="cursor-pointer" @select="loadExample(example)">{{ example.label }}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <FormBuilder :schema="FORM_SCHEMA" v-model="data" :steps="steps" :registry="registry" v-model:step="stepIndex" class="">
                <template #left-buttons>
                    <Button variant="destructive" size="sm" @click="clearForm">Clear<span class="hidden md:flex"> Form</span> <Trash2 class="size-4 ml-2" /></Button>
                </template>
                <template #right-buttons>
                    <div class="flex flex-col max-w-min">
                        <Button variant="secondary" size="sm" @click="downloadFile">Save<span class="hidden md:flex"> File</span> <Download class="size-4 ml-2" /></Button>
                    </div>
                </template>
                <template #right-buttons-last>
                    <div class="flex flex-col max-w-min">
                        <Button variant="default" size="sm" disabled>Submit <Send class="size-4 ml-2" /></Button>
                        <span class="text-muted-foreground text-xs">Not yet implemented</span>
                    </div>
                </template>
            </FormBuilder>
        </div>
        <div class="bg-background sticky top-[72px] md:position-[unset] md:top-[unset] z-40 md:z-[unset]">
            <div class="flex flex-row items-center md:items-stretch md:flex-col md:min-w-[200px] gap-4 md:sticky md:top-0">
                <Scores title="FAIR" :score="fair" />
                <Scores title="CARE" :score="care" />
                <Modal>
                    <template #trigger>
                        <Button variant="outline" size="sm" title="Show RDF" class="flex md:hidden ml-auto">
                            RDF <Expand class="h-4 w-4" />
                        </Button>
                    </template>
                    <template #title>Metadata RDF</template>
                    <Editor
                        v-model="rdfString"
                        class="h-[600px] w-full"
                        language="turtle"
                        readonly
                        hideTheme
                        hideLanguage
                        :theme="colorMode.unknown || colorMode.value === 'light' ? 'light' : 'dark'"
                        :downloadFilename="data.title || 'metadata'"
                    />
                </Modal>
                <Collapsible v-model:open="showRDF" class="hidden md:flex flex-col gap-2 items-start">
                    <CollapsibleTrigger as-child>
                        <Button variant="outline">RDF <ChevronsUpDown class="size-4" /></Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent class="flex flex-col gap-2 items-start w-full max-w-sm">
                        <div class="w-full">
                            <Editor
                                v-model="rdfString"
                                class="h-[340px] w-full"
                                language="turtle"
                                readonly
                                hideTheme
                                hideLanguage
                                :theme="colorMode.unknown || colorMode.value === 'light' ? 'light' : 'dark'"
                                :downloadFilename="data.title || 'metadata'"
                                :options="{lineNumbers: 'off', fontSize: 11, lineDecorationsWidth: 0}"
                            >
                                <template #toolbar-top-right>
                                    <Modal>
                                        <template #trigger>
                                            <Button variant="outline" size="sm" class="size-8" title="Expand">
                                                <Expand class="h-4 w-4" />
                                            </Button>
                                        </template>
                                        <template #title>Metadata RDF</template>
                                        <Editor
                                            v-model="rdfString"
                                            class="h-[600px] w-full"
                                            language="turtle"
                                            readonly
                                            hideTheme
                                            hideLanguage
                                            :theme="colorMode.unknown || colorMode.value === 'light' ? 'light' : 'dark'"
                                            :downloadFilename="data.title || 'metadata'"
                                        />
                                    </Modal>
                                </template>
                            </Editor>
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