<script setup>
import { ref } from "vue";

const props = defineProps({
    title: String,
    defaultOpen: {
        type: Boolean,
        default: false
    },
    description: String
});

const collapse = ref(!props.defaultOpen);
</script>

<template>
    <div :class="`form-section ${collapse ? 'collapse' : ''}`">
        <div class="section-header" @click="collapse = !collapse">
            <div class="title-container">
                <h3 v-if="props.title">{{ props.title }}</h3>
            </div>
            <button class="section-collapse">
                <i :class="`fa-regular fa-chevron-${collapse ? 'down' : 'up'}`"></i>
            </button>
        </div>
        <div class="section-body-container">
            <div class="section-desc" v-if="props.description">
                <p>{{ props.description }}</p>
            </div>
           <div class="section-body">
                <slot></slot>
           </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/_mixins.scss";

.form-section {
    display: flex;
    flex-direction: column;
    background-color: $sectionBg;
    border-radius: $borderRadius;

    .section-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        cursor: pointer;
        background-color: $sectionHeaderBg;
        border-top-right-radius: $borderRadius;
        border-top-left-radius: $borderRadius;

        .title-container {
            flex-grow: 1;
            padding: 12px;

            h3 {
                margin: 0;
            }
        }

        button.section-collapse {
            background-color: unset;
            border: none;
            cursor: pointer;
            padding: 12px;
        }

    }

    .section-body-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        @include transition(height);

        .section-desc {
            padding: 12px;

            p {
                margin: 0;
            }
        }

        .section-body {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 12px;
        }
    }

    &.collapse {
        .section-header {
            border-bottom-right-radius: $borderRadius;
            border-bottom-left-radius: $borderRadius;
        }

        .section-body-container {
            height: 0px;
            overflow: hidden;
        }
    }
}
</style>