<script setup>
import { computed } from "vue";
import { Radar } from "vue-chartjs";
import { useRadar } from "@/composables/radar";

const props = defineProps({
    score: {
        type: Object,
        required: true
    }
});

const scoreTotal = computed(() => {
    let total = 0;
    Object.values(props.score).forEach(score => total += score);
    return total;
});

const maxTotal = 16;

const title = computed(() => {
    return `FAIR Score: ${scoreTotal.value}/${maxTotal}`;
});
const rgb = "99, 132, 255";
const labels = ["F", "A", "I", "R"];

const { options, data, styles } = useRadar(props, title, rgb, labels);
</script>
    
<template>
    <div class="chart-wrapper">
        <Radar :chart-options="options" :chart-data="data" :styles="styles" />
    </div>
</template>
    
<style lang="scss" scoped>

</style>