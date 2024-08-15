<script setup>
import { computed } from "vue";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
    value: Number,
    max: Number,
    percentage: Number,
    label: String,
    tickWhenComplete: Boolean,
});

const percent = computed(() => {
    if (props.value !== undefined && props.max !== undefined) {
        return props.value / props.max * 100;
    } else if (props.percentage !== undefined) {
        return props.percentage;
    } else {
        return 0;
    }
});

const percentColour = computed(() => {
    if (percent.value < 34) {
        return "230, 0, 0"; // red
    } else if (percent.value <= 80) {
        return "255, 165, 0"; // orange
    } else if (percent.value < 100) {
        return "175, 230, 0"; // light yellowish-green
    } else if (percent.value == 100) {
        return "0, 230, 38"; // green
    } else {
        return "128, 128, 128"; // grey, invalid
    }
});

const percentGradient = computed(() => {
    const minHue = 0;
    const maxHue = 130;
    return `hsl(${percent.value / 100 * (maxHue - minHue)}, 100%, 48%)`;
});
</script>

<template>
    <div :class="`circle-progress`" :style="{ background: `conic-gradient(${percentGradient} ${percent}%, 0, rgba(80, 80, 80, 0.2) ${100 - percent}%)` }">
        <div class="circle-overlay">
            <span class="circle-value">
                <template v-if="props.label">{{ props.label }}</template>
                <template v-else-if="props.tickWhenComplete && percent === 100"><font-awesome-icon :icon="faCheck" /></template>
                <template v-else-if="props.value !== undefined && props.max !== undefined">{{ props.value }}/{{ props.max }}</template>
                <template v-else-if="props.percentage !== undefined">{{ props.percentage }}%</template>
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.circle-progress {
    border-radius: 50%;
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    flex-shrink: 0;

    .circle-overlay {
        border-radius: 50%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        inset: 0.5rem;

        .circle-value {
            font-size: 0.9em;
        }
    }
}
</style>