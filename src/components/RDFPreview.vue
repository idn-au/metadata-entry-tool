<script setup>
import FormInput from "@/components/FormInput.vue";

const props = defineProps({
    data: {
        type: String,
        required: true
    }
});

function copyRDF() {
    navigator.clipboard.writeText(props.data.trim())
}

// turtle syntax highlighting
</script>

<template>
    <FormInput
        type="textarea"
        v-model="props.data"
        :disabled="true"
    />
    <div>
        <button class="btn outline" @click="copyRDF">Copy <i class="fa-regular fa-copy"></i></button>
    </div>
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
    font-family: consolas, monospace !important;
    font-size: 13px;
    padding: 10px !important;
}
</style>