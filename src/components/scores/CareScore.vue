<script setup>
import CircleScores from "@/components/scores/CircleScores.vue";

const props = defineProps({
    score: Object
});
</script>

<template>
    <CircleScores :score="props.score" title="CARE">
        <p>The CARE principles, developed by the <a href="https://www.gida-global.org/care" target="_blank" rel="noopener noreferrer">Global Indigenous Data Alliance (GIDA)</a>, reflect the crucial role of data in advancing Indigenous innovation and self-determination. They ensure that data movements like the open data movement, whatever they're advocating and pursuing, respect the people and purpose behind the data.</p>
    </CircleScores>
</template>

<style lang="scss" scoped>

</style>