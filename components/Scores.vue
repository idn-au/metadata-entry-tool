<script lang="ts" setup>
import type { ScoreValueObj } from "~/types";

const props = defineProps<{
    title: string;
    scores: ScoreValueObj;
}>();
</script>

<template>
    <Modal>
        <template #trigger>
            <div class="scores">
                <div class="score-title">
                    <h5>{{ props.title }} Score</h5>
                </div>
                <div class="circles" :style="{gridTemplateColumns: `repeat(${Object.keys(props.scores).length}, 1fr)`}">
                    <div v-for="[key, score] in Object.entries(props.scores)" class="circle">
                        <CircleProgress :value="score.value" :max="score.max" tickWhenComplete />
                        <div class="circle-name">{{ key.toUpperCase() }}</div>
                    </div>
                </div>
            </div>
        </template>
        <template #title>{{ props.title }} Score</template>
        <ScoreAccordion :scoreObj="scores" />
    </Modal>
</template>

<style lang="scss" scoped>
.scores {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .score-title {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        
        h5 {
            margin: 0;
            font-size: 1rem;
        }
    }

    .circles {
        display: grid;
        gap: 8px;
        max-width: 360px;

        .circle {
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: center;
            cursor: pointer;

            .circle-name {

            }
        }
    }
}
</style>