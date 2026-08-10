<script lang="ts" setup>
import { CircleQuestionMark, Play } from "@lucide/vue";

const formRef = useTemplateRef("formRef");
const helpRef = useTemplateRef("helpRef");

function scrollToForm() {
    if (formRef.value) {
        scrollTo({
            top: formRef.value.$el.offsetTop - 126,
            behavior: "smooth",
        });
    }
}

function scrollToHelp() {
    if (formRef.value) {
        scrollTo({
            top: helpRef.value.offsetTop - 126,
            behavior: "smooth",
        });
    }
}
</script>

<template>
    <div class="mx-auto max-w-4xl w-full p-12 flex flex-col items-center gap-4">
        <div class="flex flex-col gap-3 text-center">
            <div class="text-xl font-semibold">
                Use the form below to record, score and submit metadata about Indigenous data to the Indigenous Data Network
            </div>
        </div>
        <div class="flex flex-row items-center gap-4">
            <Button @click="scrollToForm">
                Get Started <Play />
            </Button>
            <Button variant="secondary" @click="scrollToHelp">
                Help <CircleQuestionMark />
            </Button>
        </div>
    </div>
    <p>
        To complete a compliant metadata record for your data, you need to <span class="font-bold">fill out the form below</span>. You have the option of completing the minimum required information (indicated by a <span class="text-destructive">red asterix *</span>) we encourage you to include as much information as possible. The metadata is recorded in what is known as <a href="https://en.wikipedia.org/wiki/Resource_Description_Framework" class="font-bold">RDF</a> language. You can click on the RDF button below to view the information you have entered in RDF format.
    </p>
    <p>
        The more information you provide, the higher the  <a href="https://force11.org/info/the-fair-data-principles" target="_blank" rel="noopener noreferrer">FAIR</a> and <a href="https://www.gida-global.org/care" target="_blank" rel="noopener noreferrer">CARE</a> scores for your metadata.
        Your progress is saved between reloads. After completing the form you can submit it to the IDN for inclusion in the catalogue
        More information about the metadata profile can be found <a href="https://data.idnau.org/pid/cp/guide" target="_blank" rel="noopener noreferrer">here</a>.
    </p>
    <METForm ref="formRef" />
    <h2 ref="helpRef" class="font-semibold text-2xl mb-4">
        Help
    </h2>
    <p>
        The IDN has created a tutorial to help you when using the metadata entry tool to create catalogue records for the Indigenous Data Network.
    </p>
    <h3 class="text-xl font-semibold">
        Watch the IDN Metadata Entry Tool Tutorial
    </h3>
    <div class="max-w-2xl mx-auto">
        <iframe class="rounded-xl overflow-hiddenborder aspect-video h-auto w-full" src="https://www.youtube.com/embed/6UXqMmZgRvk" width="560" height="315" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" allowfullscreen />
    </div>
</template>

<style>
p:not([class]) {
    margin-bottom: 0.5rem;
}
</style>
