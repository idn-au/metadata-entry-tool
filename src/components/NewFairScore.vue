<script setup>
import { ref, watchEffect } from "vue";
import ScoreChart from "@/components/ScoreChart.vue";

const props = defineProps({
    subscores: {
        type: Object,
        required: true
    }
});

const title = "FAIR";
const rgb = [99, 132, 255];
const definition = "Some def";
const scores = ref([
    {
        title: "Findable",
        description: "",
        abbreviation: "F",
        subscores: [
            {
                description: "(Meta)data are assigned a globally unique and persistent identifier",
                abbreviation: "F1",
                score: props.subscores.f1,
                maxScore: 4
            },
            {
                description: "Data are described with rich metadata (defined by R1 below)",
                abbreviation: "F2",
                score: props.subscores.f2,
                maxScore: 4
            },
            {
                description: "Metadata clearly and explicitly include the identifier of the data they describe",
                abbreviation: "F3",
                score: props.subscores.f3,
                maxScore: 4
            },
            {
                description: "(Meta)data are registered or indexed in a searchable resource",
                abbreviation: "F4",
                score: props.subscores.f4,
                maxScore: 4
            }
        ]
    },
    {
        title: "Accessible",
        description: "",
        abbreviation: "A",
        subscores: [
            {
                description: "(Meta)data are retrievable by their identifier using a standardised communications protocol",
                abbreviation: "A1",
                score: props.subscores.a1,
                maxScore: 4
            },
            {
                description: "Metadata are accessible, even when the data are no longer available",
                abbreviation: "A2",
                score: props.subscores.a2,
                maxScore: 4
            }
        ]
    },
    {
        title: "Interoperable",
        description: "",
        abbreviation: "I",
        subscores: [
            {
                description: "(Meta)data use a formal, accessible, shared, and broadly applicable language for knowledge representation.",
                abbreviation: "I1",
                score: props.subscores.i1,
                maxScore: 4
            },
            {
                description: "(Meta)data use vocabularies that follow FAIR principles",
                abbreviation: "I2",
                score: props.subscores.i2,
                maxScore: 4
            },
            {
                description: "(Meta)data include qualified references to other (meta)data",
                abbreviation: "I3",
                score: props.subscores.i3,
                maxScore: 4
            }
        ]
    },
    {
        title: "Reusable",
        description: "",
        abbreviation: "R",
        subscores: [
            {
                description: "(Meta)data are richly described with a plurality of accurate and relevant attributes",
                abbreviation: "R1",
                score: props.subscores.r1,
                maxScore: 4
            }
        ]
    }
]);

watchEffect(() => {
    Object.keys(props.subscores).forEach(scoreProp => {
        scores.value.forEach(score => {
            score.subscores.forEach(sub => {
                if (sub.abbreviation.toLowerCase() === scoreProp) {
                    sub.score = props.subscores[scoreProp];
                }
            });
        });
    });
});
</script>

<template>
    <ScoreChart :title="title" :rgb="rgb" :definition="definition" :scores="scores" />
</template>

<style lang="scss" scoped>

</style>