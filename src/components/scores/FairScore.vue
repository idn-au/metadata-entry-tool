<script setup>
import CircleScores from "@/components/scores/CircleScores.vue";

const props = defineProps({
    score: Object
});
</script>

<template>
    <CircleScores :score="props.score" title="FAIR">
        <p>In 2016, the <a href="https://doi.org/10.1038/sdata.2016.18" target="_blank" rel="noopener noreferrer">'FAIR Guiding Principles for scientific data management and stewardship'</a> were published in the open-access journal, Scientific Data. The authors intended to provide guidelines to improve the Findability, Accessibility, Interoperability, and Reuse of digital assets.</p>
        <p>The principles are set out in full on the <a href="https://www.go-fair.org/fair-principles/" target="_blank" rel="noopener noreferrer">GO FAIR website</a>. ARDC also offers comprehensive <a href="https://ardc.edu.au/resource/fair-data/" target="_blank" rel="noopener noreferrer">information and training</a>. The FAIR Principles refer to three types of entities: data, metadata and infrastructure. </p>
    </CircleScores>
</template>

<style lang="scss" scoped>

</style>