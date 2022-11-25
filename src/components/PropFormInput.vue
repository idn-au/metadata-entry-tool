<script setup>
import { useSlots } from "vue";
import { FormInput } from "@idn-au/idn-lib";
import PropTooltip from "@/components/PropTooltip.vue";

const props = defineProps({
    modelValue: {
        required: true
    },
    label: String,
    placeholder: String,
    description: String,
    type: {
        type: String,
        required: true
    },
    tooltip: String,
    propTooltip: Object,
    options: Array,
    id: String,
    required: Boolean,
    invalidMessage: Array,
    multiple: Boolean,
    clearButton: Boolean,
    disabled: Boolean
});

const slots = useSlots();

const emit = defineEmits(["update:modelValue", "onBlur"]);
</script>

<template>
    <FormInput
        :modelValue="props.modelValue"
        :label="props.label"
        :placeholder="props.placeholder"
        :description="props.description"
        :type="props.type"
        :tooltip="props.tooltip"
        :options="props.options"
        :id="props.id"
        :required="props.required"
        :invalidMessage="props.invalidMessage"
        :multiple="props.multiple"
        :clearButton="props.clearButton"
        :disabled="props.disabled"
        @onBlur="$emit('onBlur')"
        @update:modelValue="e => $emit('update:modelValue', e)"
    >
        <template #before v-if="!!slots.before">
            <slot name="before"></slot>
        </template>
        <template #prepend v-if="!!slots.prepend">
            <slot name="prepend"></slot>
        </template>
        <template #append v-if="!!slots.append">
            <slot name="append"></slot>
        </template>
        <template #after v-if="!!props.propTooltip || !!slots.after">
            <PropTooltip v-if="!!props.propTooltip" v-bind="props.propTooltip" />
            <slot name="after"></slot>
        </template>
    </FormInput>
</template>

<style lang="scss" scoped>

</style>