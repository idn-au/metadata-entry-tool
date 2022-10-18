<script setup>
import ToolTip from "@/components/ToolTip.vue";

const props = defineProps({
    label: String,
    span: {
        type: Number,
        default: 1
    },
    required: Boolean,
    tooltip: String,
    description: String
});
</script>

<template>
    <div :class="`form-field span-${props.span}`">
        <div class="label-container">
            <label for="" v-if="props.label">{{ props.label }} <span v-if="props.required === true">*</span></label>
        </div>
        <div class="main-input-container">
            <div class="main-input">
                <slot></slot>
            </div>
            <ToolTip v-if="props.tooltip" :text="props.tooltip"><i class="fa-regular fa-circle-question"></i></ToolTip>
        </div>
        <div class="bottom-container">
            <div class="bottom-inputs">
                <slot name="bottom"></slot>
            </div>
            <div class="field-description" v-if="props.description">{{ props.description }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.form-field {
    display: flex;
    flex-direction: column;
    // display: grid;
    // grid-template-rows: 28px auto auto;
    gap: 6px;

    @for $i from 1 through 3 {
        &.span-#{$i} {
            grid-column: span #{$i};
        }
    }

    .label-container {
        label {
            font-weight: bold;
        }
    }

    .main-input-container {

    }

    .bottom-container {
        
    }
}
</style>