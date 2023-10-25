<script setup>
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import CircleProgress from "@/components/scores/CircleProgress.vue";

const props = defineProps({
    score: Object
});
</script>

<template>
    <div class="score-detail">
        <div class="score-detail-header">
            <CircleProgress :value="props.score.value" :max="props.score.max" />
            <div class="score-detail-title">
                <h4>{{ props.score.key.toUpperCase() }}{{ props.score.title !== "" ? " - " + props.score.title : "" }}</h4>
                <p>{{ props.score.desc }}</p>
            </div>
        </div>
        <div v-if="props.score.scores" class="score-details">
            <ScoreDetails v-for="[subKey, subScore] in Object.entries(props.score.scores)" :score="{key: subKey, ...subScore}" />
        </div>
        <div v-else-if="props.score.requirements" class="requirements">
            <div v-for="requirement in props.score.requirements" class="requirement">
                <span><font-awesome-icon :icon="requirement.enabled ? faSquareCheck : faSquare" /></span>
                <span>{{ requirement.desc }}</span>
                <span>[+{{ requirement.value }}]</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.circle-scores {
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
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;

        .circle {
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: center;
            // cursor: pointer;

            .circle-name {

            }

            :deep(.circle-overlay) {
                background-color: $formBg;
            }
        }
    }
}

.score-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-inline-start: 12px;
    border-left: 1px solid grey;

    .score-detail {
        background-color: $formBg;
        border-radius: 4px;
        overflow: hidden;

        $padding: 8px;

        .score-detail-header {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
            // justify-content: space-between;
            // margin-bottom: 8px;
            // cursor: pointer;
            
            padding: $padding;

            .score-detail-title {
                display: flex;
                flex-direction: column;
                gap: 4px;

                h4 {
                    font-size: 1.1em;
                    margin: 0;
                    // margin-top: 8px;
                }

                p {
                    font-size: 0.9rem;
                    color: grey;
                    margin: 0;
                }
            }

            .score-detail-chevron {
                margin-left: auto;
                padding: 6px;
            }
            
            .circle-progress {
                $size: 56px;
                height: $size;
                width: $size;

                :deep(.circle-overlay) {
                    background-color: $formBg;

                    .circle-value {
                        font-size: 0.85em;
                    }
                }
            }
        }

        .score-detail-desc-wrapper {
            overflow-y: hidden;

            &.collapse {
                height: 0;
            }

            .score-detail-desc {
                border-top: 1px solid #9d9d9d;
                padding: $padding;
            }
        }
    }
}

p {
    margin-top: 0;
    margin-bottom: 6px;
}

.requirements {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-inline-start: 1.8rem;
    
    .requirement {
        display: flex;
        flex-direction: row;
        gap: 6px;
    }
}
</style>