<script setup>
import MetadataForm from "@/components/MetadataForm.vue";
</script>

<template>
    <h2>Metadata Entry Form</h2>
    <p>
        This form is to be completed for submitting metadata to the Indigenous Data Network.
    </p>
    <p>In order to complete a compliant metadata record for your data, you need to fill out the information required in the form below. You have the option of completing only the minimum required information (indicated by a red asterix) but it is recommended that you include as much information as possible in the form.</p>
    <p>The more information you are able to provide, the higher the <a href="https://force11.org/info/the-fair-data-principles" target="_blank" rel="noopener noreferrer">FAIR</a> and <a href="https://www.gida-global.org/care" target="_blank" rel="noopener noreferrer">CARE</a> scores for your metadata. For now, these scores generate placeholder values.</p>
    <p>The metadata in RDF format can optionally be viewed on the right of the form. The RDF and scores are updated as you complete the form. More information about the metadata profile can be found <a href="https://w3id.org/idn/def/cp/guide" target="_blank" rel="noopener noreferrer">here</a>.</p>
    <MetadataForm />
</template>

<style lang="scss" scoped>

</style>