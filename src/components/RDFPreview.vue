<script setup>
import FormInput from "@/components/FormInput.vue";

const props = defineProps({
    data: {
        type: String,
        required: true
    }
});

// turtle syntax highlighting
</script>

<template>
    <FormInput
        type="textarea"
        v-model="props.data"
        :disabled="true"
    />
</template>

<style lang="scss" scoped>
.form-input, :deep(.form-input-row), :deep(.form-input-content), :deep(.input-item), :deep(.input) {
    flex-grow: 1;
}

:deep(.form-input-row) {
    flex-direction: column !important;
}

:deep(.input) {
    resize: none !important;
    font-family: consolas !important;
    font-size: 14px;
}
</style>