<script lang="ts" setup>
import { HelpCircle } from "lucide-vue-next";
</script>

<template>
    <h1 class="bold text-3xl mb-4">Metadata Entry Tool Help</h1>
    <h2 class="bold text-2xl mb-4">Introduction</h2>
    <p>To catalogue Indigenous data, the metadata describing the data needs to be collected, described, and stored in a standardised way to be machine readable and consistent for enabling search.</p>
    <p>The metadata for Indigenous Data discovery needs to incorporate specific elements to identify the Indigeneity of the data and we have trialled the following as a starting point:</p>
    <ul class="ml-8 list-disc">
        <li>Data Agents - a person or organisation that has been registered in the IDN Data Agents Database that holds or has created an Indigenous Data Asset</li>
        <li>Themes - Indigenous Demographics, Indigenous Languages, and other terms to be drawn from the IDN Theme vocabulary.</li>
    </ul>
    <h2 class="bold text-2xl my-4">The Metadata Entry Tool</h2>
    <p>With this tool you can describe your data using the metadata elements described in the <a href="https://data.idnau.org/pid/cp/guide" target="_blank" rel="noopener noreferrer">IDN Catalogue Profile Guidance</a>.</p>
    <p>You can download your completed metadata record in RDF and, if appropriate, submit the metadata record to catalogue your Indigenous Data in the IDN Data Catalogue. <em>Note that this will require pre-registration in the IDN Agents Database before the IDN can accept the metadata record.</em></p>
    <h2 class="bold text-2xl my-4">Completing a metadata record for your data</h2>
    <p>There are eight areas of metadata that need to be completed to fully describe the data asset. You are able to limit your description to the fields that have a red asterisk but it is encouraged to complete as much information as you are able.</p>
    <p><span class="text-muted-foreground inline-block"><HelpCircle class="size-4" /></span> If you hover over this text you will get a brief description of what should be entered in this field.</p>

</template>
