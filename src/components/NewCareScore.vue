<script setup>
import ScoreChart from "@/components/ScoreChart.vue";

const title = "CARE";
const rgb = [255, 99, 132];
const definition = "Some def";
const scores = [
    {
        title: "Collective benefit",
        description: "C desc",
        abbreviation: "C",
        subscores: [
            {
                title: "C1",
                description: "C1 desc",
                abbreviation: "C1",
                score: 4,
                maxScore: 4
            }
        ]
    },
    {
        title: "Authority to control",
        description: "A desc",
        abbreviation: "A",
        subscores: [
            {
                title: "A1",
                description: "A1 desc",
                abbreviation: "A1",
                score: 4,
                maxScore: 4
            }
        ]
    },
    {
        title: "Responsibility",
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
    },
    {
        title: "Ethics",
        description: "E desc",
        abbreviation: "E",
        subscores: [
            {
                title: "E1",
                description: "E1 desc",
                abbreviation: "E1",
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