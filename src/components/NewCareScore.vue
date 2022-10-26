<script setup>
import { ref, watchEffect } from "vue";
import ScoreChart from "@/components/ScoreChart.vue";

const props = defineProps({
    subscores: {
        type: Object,
        required: true
    }
});

const title = "CARE";
const rgb = [255, 99, 132];
const definition = "Some def";
const scores = ref([
    {
        title: "Collective benefit",
        description: "",
        abbreviation: "C",
        subscores: [
            {
                description: "For inclusive development and innovation",
                abbreviation: "C1",
                score: props.subscores.c1,
                maxScore: 3
            },
            {
                description: "For improved governance and citizen engagement",
                abbreviation: "C2",
                score: props.subscores.c2,
                maxScore: 3
            },
            {
                description: "For equitable outcomes",
                abbreviation: "C3",
                score: props.subscores.c3,
                maxScore: 3
            }
        ]
    },
    {
        title: "Authority to control",
        description: "",
        abbreviation: "A",
        subscores: [
            {
                description: "Recognising rights and interests",
                abbreviation: "A1",
                score: props.subscores.a1,
                maxScore: 3
            },
            {
                description: "Data for governance",
                abbreviation: "A2",
                score: props.subscores.a2,
                maxScore: 3
            },
            {
                description: "Governance of data",
                abbreviation: "A3",
                score: props.subscores.a3,
                maxScore: 3
            }
        ]
    },
    {
        title: "Responsibility",
        description: "",
        abbreviation: "R",
        subscores: [
            {
                description: "For positive relationships",
                abbreviation: "R1",
                score: props.subscores.r1,
                maxScore: 3
            },
            {
                description: "For expanding capability and capacity",
                abbreviation: "R2",
                score: props.subscores.r2,
                maxScore: 3
            },
            {
                description: "For Indigenous languages and worldviews",
                abbreviation: "R3",
                score: props.subscores.r3,
                maxScore: 3
            }
        ]
    },
    {
        title: "Ethics",
        description: "",
        abbreviation: "E",
        subscores: [
            {
                description: "For minimising harm and maximising benefit",
                abbreviation: "E1",
                score: props.subscores.e1,
                maxScore: 3
            },
            {
                description: "For justice",
                abbreviation: "E2",
                score: props.subscores.e2,
                maxScore: 3
            },
            {
                description: "For future use",
                abbreviation: "E3",
                score: props.subscores.e3,
                maxScore: 3
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