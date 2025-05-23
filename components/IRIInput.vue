<script lang="ts" setup>
import { CustomInput } from "@vulptech/vt-form";
import { Copy, RefreshCw } from "lucide-vue-next";

const props = defineProps<{
    generateFn: () => string;
}>();

const model = defineModel<string>({ required: true });

const emit = defineEmits<{
    focus: [];
    blur: [];
    clear: [];
    input: [value: string];
}>();

function copyToClipboard(s: string) {
    navigator.clipboard.writeText(s);
}

watch(model, (newValue) => {
    emit("input", newValue);
});
</script>

<template>
    <div class="flex flex-row gap-1 items-center">
        <CustomInput type="url" v-model="model" @clear="model = ''; emit('clear')" />
        <Button size="icon" variant="outline" title="Regenerate IRI" @click="model = props.generateFn()"><RefreshCw class="size-4" /></Button>
        <Button size="icon" variant="outline" title="Copy to clipboard" @click="copyToClipboard(model)"><Copy class="size-4" /></Button>
    </div>
</template>
