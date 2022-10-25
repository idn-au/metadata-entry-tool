<script setup>
import { ref, computed } from "vue";
import { Radar } from "vue-chartjs";

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    rgb: Array,
    definition: String,
    scores: {
        type: Object,
        required: true
    }
});

// watch window size - collapse into a badge (or something) on smaller screens

// have expandable details for each score section
const collapse = ref(props.scores.reduce((obj, score) => ({ ...obj, [score.abbreviation]: true}), {top: true}));

const scores = computed(() => {
    let s = {};
    props.scores.forEach(score => {
        let total = 0;
        score.subscores.forEach(subscore => total += subscore.score);
        s[score.abbreviation] = total;
    });
    return s;
});

const maxScores = computed(() => {
    let s = {};
    props.scores.forEach(score => {
        let total = 0;
        score.subscores.forEach(subscore => total += subscore.maxScore);
        s[score.abbreviation] = total;
    });
    return s;
})

const scoreTotal = computed(() => {
    let total = 0;
    Object.values(scores.value).forEach(score => total += score);
    return total;
});

const maxScoreTotal = computed(() => {
    let total = 0;
    Object.values(maxScores.value).forEach(score => total += score);
    return total;
});

const title = computed(() => {
    return `${props.title} Score: ${scoreTotal.value}/${maxScoreTotal.value}`;
});

const rgb = computed(() => {
    return props.rgb.join(", ");
});

const labels = computed(() => {
    return props.scores.map(score => score.abbreviation);
});

const options = ref({
    // responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: title,
        },
    },
    scales: {
        r: {
            grid: {
                circular: true
            },
            min: 0,
            max: Math.max(...Object.values(maxScores.value)),
            // beginAtZero: true
        }
    }
});

const styles = {
    // position: "relative"
};

const data = computed(() => ({
    labels: labels.value,
    datasets: [
        {
            data: Object.values(scores.value),
            borderColor: `rgb(${rgb.value})`,
            backgroundColor: `rgba(${rgb.value}, 0.2)`,
            pointBackgroundColor: `rgb(${rgb.value})`,
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: `rgb(${rgb.value})`
        },
    ],
}));

function toggleCollapseAll() {
    collapse.value.top = !collapse.value.top;

    if (collapse.value.top) {
        Object.keys(collapse.value).forEach(key => collapse.value[key] = true);
    }
}

function progressGradient(percentage) {
    if (percentage < 33) {
        return "low";
    } else if (percentage >= 33 && percentage < 66) {
        return "medium";
    } else {
        return "high"
    }
}
</script>
    
<template>
    <div class="score-chart">
        <div class="chart-wrapper">
            <Radar :chart-options="options" :chart-data="data" :styles="styles" />
        </div>
        <div class="collapse-btns">
            <button @click="toggleCollapseAll" class="scores-collapse-btn btn outline" :title="`${props.title} score details`">
                <i class="fa-regular fa-circle-info"></i>
                <i :class="`fa-regular fa-chevron-${collapse.top ? 'down' : 'up'}`"></i>
            </button>
        </div>
        <div :class="`score-details ${collapse.top ? 'collapse' : ''}`">
            <div class="score" v-for="score in props.scores">
                <div class="score-header" @click="collapse[score.abbreviation] = !collapse[score.abbreviation]">
                    <span class="header-left">{{ score.abbreviation }} - {{ score.title }}</span>
                    <span class="header-right">
                        <span class="score-value">{{ scores[score.abbreviation] }}/{{ maxScores[score.abbreviation] }}</span>
                        <button class="subscore-collapse-btn" :title="`${score.abbreviation} subscore details`">
                            <i :class="`fa-regular fa-chevron-${collapse[score.abbreviation] ? 'down' : 'up'}`"></i>
                        </button>
                    </span>
                </div>
                <div class="progress-container">
                    <div :class="`progress ${progressGradient(scores[score.abbreviation]/maxScores[score.abbreviation] * 100)}`" :style="{width: (scores[score.abbreviation]/maxScores[score.abbreviation] * 100) + '%'}"></div>
                </div>
                <div class="score-desc">
                    <p>{{ score.description }}</p>
                </div>
                <div :class="`subscores-container ${collapse[score.abbreviation] ? 'collapse' : ''}`">
                    <div class="subscores">
                        <div class="score" v-for="subscore in score.subscores">
                            <div class="score-header">
                                <span class="header-left">{{ subscore.abbreviation }} - {{ subscore.title }}</span>
                                <span class="header-right">
                                    <span class="score-value">{{ subscore.score }}/{{ subscore.maxScore }}</span>
                                </span>
                            </div>
                            <div class="progress-container">
                                <div :class="`progress ${progressGradient(scores[score.abbreviation]/maxScores[score.abbreviation] * 100)}`" :style="{width: (scores[score.abbreviation]/maxScores[score.abbreviation] * 100) + '%'}"></div>
                            </div>
                            <div class="score-desc">
                                <p>{{ subscore.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<style lang="scss" scoped>
@import "@/assets/_variables.scss";

%collapsible {
    overflow-y: hidden;
    height: 100%;
    transition: height 0.2s ease-in-out;

    &.collapse {
        height: 0px;
    }
}

.score-chart {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .chart-wrapper {

    }
    .collapse-btns {
        display: flex;
        flex-direction: row;
        align-items: center;

        button.scores-collapse-btn {
            margin-left: auto;
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
        }
    }
    .score-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
        @extend %collapsible;

        .score {
            display: flex;
            flex-direction: column;
            border-radius: $borderRadius;
            background-color: $sectionBg;

            .score-header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                gap: 8px;
                align-items: center;
                background-color: $sectionHeaderBg;
                padding: 8px;
                border-top-right-radius: $borderRadius;
                border-top-left-radius: $borderRadius;

                .header-left {

                }

                .header-right {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    align-items: center;

                    .score-value {

                    }

                    button.subscore-collapse-btn {
                        cursor: pointer;
                        background-color: unset;
                        border: none;
                        padding: 4px;
                    }
                }
            }

            .progress-container {
                height: 2px;
                background-color: white;

                .progress {
                    height: 100%;

                    &.low {
                        background-color: $progressLow;
                    }
                    &.medium {
                        background-color: $progressMedium;
                    }
                    &.high {
                        background-color: $progressHigh;
                    }
                }
            }

            .score-desc {
                padding: 8px;
                margin-top: 8px;

                p {
                    margin: 0;
                    font-style: italic;
                    font-size: 0.9rem;
                }
            }

            .subscores-container {
                @extend %collapsible;

                .subscores {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 12px;

                    .score {
                        $darkenAmount: 5;

                        background-color: darken($color: $sectionBg, $amount: $darkenAmount);

                        .score-header {
                            background-color: darken($color: $sectionHeaderBg, $amount: $darkenAmount);
                        }
                    }
                }
            }
        }

        & > .score > .score-header {
            cursor: pointer;
        }
    }
}
</style>