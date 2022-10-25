<script setup>
import ScoreChart from "@/components/ScoreChart.vue";

const title = "FAIR";
const rgb = [99, 132, 255];
const definition = "Some def";
const scores = [
    {
        title: "Findable",
        description: "F desc",
        abbreviation: "F",
        subscores: [
            {
                title: "F1",
                description: "F1 desc",
                abbreviation: "F1",
                score: 1,
                maxScore: 4
            }
        ]
    },
    {
        title: "Accessible",
        description: "A desc",
        abbreviation: "A",
        subscores: [
            {
                title: "A1",
                description: "A1 desc",
                abbreviation: "A1",
                score: 2,
                maxScore: 4
            }
        ]
    },
    {
        title: "Interoperable",
        description: "I desc",
        abbreviation: "I",
        subscores: [
            {
                title: "I1",
                description: "I1 desc",
                abbreviation: "I1",
                score: 3,
                maxScore: 4
            }
        ]
    },
    {
        title: "Reusable",
        description: "R desc",
        abbreviation: "R",
        subscores: [
            {
                title: "R1",
                description: "R1 desc",
                abbreviation: "R1",
                score: 4,
                maxScore: 4
            }
        ]
    }
];
const maxScore = 4;
</script>

<template>
    <ScoreChart :title="title" :rgb="rgb" :definition="definition" :scores="scores" :maxScore="maxScore" />
</template>

<style lang="scss" scoped>

</style>