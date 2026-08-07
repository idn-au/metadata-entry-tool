<script lang="ts" setup>
import { CircleQuestionMark, HelpCircle, Play } from "@lucide/vue";

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
	<div class="mx-auto max-w-2l w-full p-12 flex flex-col items-center gap-4">
		<div class="flex flex-col gap-3 text-center">
			<div class="text-xl font-semibold">
				A form to create & score metadata of Indigenous Data
			</div>
			<p class="text-muted-foreground">
				This form is to be completed for submitting metadata to the Indigenous Data Network.
			</p>
		</div>
		<div class="flex flex-row items-center gap-4">
			<Button @click="scrollToForm">
				Get Started <Play />
			</Button>
			<Button variant="secondary" @click="scrollToHelp">
				How to use <CircleQuestionMark />
			</Button>
		</div>
	</div>
	<p>
		In order to complete a compliant metadata record for your data, you need to fill out the information required
		in the form below. You have the option of completing only the minimum required information (indicated by a
		red asterix) but it is recommended that you include as much information as possible in the form.
	</p>
	<p>
		The more information you are able to provide, the higher the <a
		href="https://force11.org/info/the-fair-data-principles" target="_blank"
		rel="noopener noreferrer"
	>FAIR</a> and <a
		href="https://www.gida-global.org/care" target="_blank"
		rel="noopener noreferrer"
	>CARE</a> scores for your metadata. For now, these scores generate placeholder
		values.
	</p>
	<p>
		The metadata in RDF format can optionally be viewed on the right of the form. The RDF and scores are updated
		as you complete the form. More information about the metadata profile can be found <a
		href="https://data.idnau.org/pid/cp/guide" target="_blank" rel="noopener noreferrer"
	>here</a>.
	</p>
	<p>
		This form uses the IDN's collection of people and organisations, or "agents", that are related to metadata
		and datasets in the IDN, called the <a
		href="https://agentsdb.idnau.org" target="_blank"
		rel="noopener noreferrer"
	>Agents Database</a>. You can refer to this list of agents or create a custom
		agent if required.
	</p>
	<p>This form saves your progress between reloads. If you're experiencing problems or need to clear your data, either select "Clear Form" below or clear your local storage in your browser.</p>

	<METForm ref="formRef" />

	<h2 ref="helpRef" class="bold text-2xl mb-4">
		Introduction
	</h2>
	<p>To catalogue Indigenous data, the metadata describing the data needs to be collected, described, and stored in a standardised way to be machine readable and consistent for enabling search.</p>
	<p>The metadata for Indigenous Data discovery needs to incorporate specific elements to identify the Indigeneity of the data and we have trialled the following as a starting point:</p>
	<ul class="ml-8 list-disc">
		<li>Data Agents - a person or organisation that has been registered in the IDN Data Agents Database that holds or has created an Indigenous Data Asset</li>
		<li>Themes - Indigenous Demographics, Indigenous Languages, and other terms to be drawn from the IDN Theme vocabulary.</li>
	</ul>
	<h2 class="bold text-2xl my-4">
		The Metadata Entry Tool
	</h2>
	<p>With this tool you can describe your data using the metadata elements described in the <a href="https://data.idnau.org/pid/cp/guide" target="_blank" rel="noopener noreferrer">IDN Catalogue Profile Guidance</a>.</p>
	<p>You can download your completed metadata record in RDF and, if appropriate, submit the metadata record to catalogue your Indigenous Data in the IDN Data Catalogue. <em>Note that this will require pre-registration in the IDN Agents Database before the IDN can accept the metadata record.</em></p>
	<h3 class="bold text-xl my-4">
		Watch the tutorial
	</h3>
	<div class="max-w-2xl mx-auto">
		<iframe class="rounded-xl overflow-hiddenborder aspect-video h-auto w-full" src="https://www.youtube.com/embed/6UXqMmZgRvk" width="560" height="315" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" allowfullscreen />
	</div>
	<h2 class="bold text-2xl my-4">
		Completing a metadata record for your data
	</h2>
	<p>There are eight areas of metadata that need to be completed to fully describe the data asset. You are able to limit your description to the fields that have a red asterisk but it is encouraged to complete as much information as you are able.</p>
	<p><span class="text-muted-foreground inline-block"><HelpCircle class="size-4" /></span> If you hover over this text you will get a brief description of what should be entered in this field.</p>
</template>

<style>
p:not([class]) {
	margin-bottom: 0.5rem;
}
</style>
