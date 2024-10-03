<script lang="ts" setup>
import { fairScore, careScore } from "scores-calculator-js";
import type { ScoreValueObj } from "~/types";
import metExample from "~/data/metExample";

const { store } = useOxiStore();

const fair = ref({} as ScoreValueObj);
const care = ref({} as ScoreValueObj);

function handleAdd() {
    store.value.load(metExample);
}

watch(store, async (newValue) => {
    fair.value = await fairScore(newValue.dump(), "https://example.com/example1");
    care.value = await careScore(newValue.dump(), "https://example.com/example1");
}, { deep: true });
</script>

<template>
    <Button @click="handleAdd">Load Data</Button>
    <div>Size: {{ store.size }}</div>
    <Scores title="FAIR" :scores="fair" />
    <Scores title="CARE" :scores="care" />
    <div>FAIR:
        <pre>{{ JSON.stringify(fair, null, 4) }}</pre>
    </div>
    <div>CARE:
        <pre>{{ JSON.stringify(care, null, 4) }}</pre>
    </div>
</template>
