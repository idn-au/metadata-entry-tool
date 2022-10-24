<script setup>
import { ref } from "vue";

const props = defineProps({
    title: String,
    defaultOpen: {
        type: Boolean,
        default: false
    }
});

const collapse = ref(!props.defaultOpen);
const btnRef = ref(null);

function clickCollapse() {
    collapse.value = !collapse.value;

    // for Font Awesome SVG icons (can't dynamically change icons on class)
    const svg = btnRef.value.firstElementChild;
    svg.setAttribute("data-icon", collapse.value ? "chevron-down" : "chevron-up");
}
</script>

<template>
    <div class="form-section">
        <div class="section-header" @click="clickCollapse">
            <div class="title-container">
                <h3 v-if="props.title">{{ props.title }}</h3>
            </div>
            <button class="section-collapse" ref="btnRef">
                <i :class="`fa-regular fa-chevron-${collapse ? 'down' : 'up'}`"></i>
            </button>
        </div>
        <div :class="`section-body-container ${collapse ? 'collapse' : ''}`">
           <div class="section-body">
                <slot></slot>
           </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.form-section {
    display: flex;
    flex-direction: column;
    background-color: #efefef;
    border-radius: 6px;

    .section-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        cursor: pointer;

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
        overflow-y: hidden;
        height: 100%;
        transition: height 0.2s ease-in-out;

        &.collapse {
            height: 0px;
        }
        .section-body {
            margin-top: 12px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 12px;
        }
    }
}
</style>