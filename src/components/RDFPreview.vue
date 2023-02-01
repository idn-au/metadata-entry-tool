<script setup>
import { useBtnTimeout } from "@/composables/btnTimeout";
import { FormInput } from "@idn-au/idn-lib";

const props = defineProps({
    data: {
        type: String,
        required: true
    }
});

const { clicked: copied, startTimeout } = useBtnTimeout();

function copyRDF() {
    navigator.clipboard.writeText(props.data.trim());
    startTimeout();
}

// turtle syntax highlighting
</script>

<template>
    <FormInput
        type="textarea"
        v-model="props.data"
        disabled
        id="rdf"
    />
    <div class="buttons">
        <button class="btn secondary outline copy-btn" @click="copyRDF">
            <template v-if="copied">
                Copied!
            </template>
            <template v-else>
                Copy <i class="fa-regular fa-copy"></i>
            </template>
        </button>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.form-input, :deep(.input-row), :deep(.form-input-content), :deep(.input-item), :deep(.input-component) {
    flex-grow: 1;
}

.buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    button.copy-btn {
        margin-left: auto;
    }
}

:deep(.input-row) {
    flex-direction: column !important;
}

:deep(.input-component) {
    resize: none !important;
    font-family: consolas, monospace !important;
    font-size: 13px;
    padding: 10px !important;
    background-color: white !important;
}
</style>