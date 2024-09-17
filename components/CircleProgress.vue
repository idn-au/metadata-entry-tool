<script lang="ts" setup>
const props = defineProps<{
    value?: number;
    max?: number;
    percentage?: number;
    label?: string;
    tickWhenComplete?: boolean;
}>();

const percent = computed(() => {
    if (props.value != undefined && props.max != undefined) {
        return props.value / props.max * 100;
    } else if (props.percentage != undefined) {
        return props.percentage;
    } else {
        return 0;
    }
});

const percentGradient = computed(() => {
    const minHue = 0; // red
    const maxHue = 130; // green
    return `hsl(${percent.value / 100 * (maxHue - minHue)}, 100%, 48%)`;
});
</script>

<template>
    <div class="circle-progress" :style="{ background: `conic-gradient(${percentGradient} ${percent}%, 0, rgba(80, 80, 80, 0.2) ${100 - percent}%)` }">
        <div class="circle-overlay">
            <span class="circle-value">
                <template v-if="props.label">{{ props.label }}</template>
                <template v-else-if="props.tickWhenComplete && percent === 100">
                    <span class="material-symbols-sharp">check</span>
                </template>
                <template v-else-if="props.value != undefined && props.max != undefined">{{ props.value }}/{{ props.max }}</template>
                <template v-else>{{ percent }}%</template>
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