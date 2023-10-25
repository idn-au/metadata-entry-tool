<script setup>
import { ref, nextTick } from "vue";
import { faInfo, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { BaseModal } from "@idn-au/idn-lib";
import CircleProgress from "@/components/scores/CircleProgress.vue";
import ScoreDetails from "@/components/scores/ScoreDetails.vue";

const props = defineProps({
    score: Object,
    title: String
});

const sectionOpen = ref("");
const showModal = ref(false);

function goToSection(key) {
    showModal.value = true;
    toggleSection(key);
    nextTick(() => {
        document.getElementById(`${key}-score`).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

function toggleSection(key) {
    if (sectionOpen.value === key) {
        sectionOpen.value = "";
    } else {
        sectionOpen.value = key;
    }
}

function closeModal() {
    showModal.value = false;
    sectionOpen.value = "";
}
</script>

<template>
    <div class="circle-scores">
        <div class="score-title">
            <h5>{{ props.title }} Score</h5>
            <button class="btn outline primary" @click="showModal = true" title="Show details"><font-awesome-icon :icon="faInfo" /></button>
        </div>
        <div class="circles">
            <div v-for="[key, score] in Object.entries(props.score)" class="circle" @click="goToSection(key)">
                <CircleProgress :value="score.value" :max="score.max" tickWhenComplete />
                <div class="circle-name">{{ key.toUpperCase() }}</div>
            </div>
        </div>
    </div>
    <BaseModal v-if="showModal" @modalClosed="closeModal">
        <template #headerMiddle><h3>{{ props.title }} Scores</h3></template>
        <slot></slot>
        <div class="score-details">
            <div class="score-detail" v-for="[key, score] in Object.entries(props.score)" :id="`${key}-score`">
                <div class="score-detail-header" @click="toggleSection(key)">
                    <CircleProgress :value="score.value" :max="score.max" />
                    <div class="score-detail-title">
                        <h4>{{ key.toUpperCase() }} - {{ score.title }}</h4>
                        <p>{{ score.desc }}</p>
                    </div>
                    <span class="score-detail-chevron">
                        <font-awesome-icon :icon="sectionOpen === key ? faChevronUp : faChevronDown" />
                    </span>
                </div>
                <div :class="`score-detail-desc-wrapper ${sectionOpen === key ? '' : 'collapse'}`">
                    <div class="score-detail-desc">
                        <ScoreDetails v-for="[subKey, subScore] in Object.entries(score.scores)" :score="{key: subKey, ...subScore}" />
                    </div>
                </div>
            </div>
        </div>
    </BaseModal>
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
            cursor: pointer;

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
            cursor: pointer;
            
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
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
        }
    }
}

p {
    margin-top: 0;
    margin-bottom: 6px;
}
</style>