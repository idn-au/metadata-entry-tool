<script setup>
import MetadataForm from "@/components/MetadataForm.vue";
</script>

<template>
    <h2>Metadata Entry Form</h2>
    <p>
        This is the form for submitting metadata to the IDN. Fill out the form below to generate metadata for your dataset. FAIR and CARE scores will be updated live as the fields are filled out. The generated RDF can optionally be viewed on the right.
    </p>
    <MetadataForm />
</template>

<style lang="scss" scoped>
</style>