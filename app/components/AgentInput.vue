<script lang="ts" setup>
import type { Registry } from "@vulptech/vt-form";
import type { HTMLAttributes } from "vue";
import type * as z from "zod";
import { Pencil } from "@lucide/vue";
import { FormBuilder, useVtForm } from "@vulptech/vt-form";
import { cn } from "~/lib/utils";

const props = defineProps<{
    placeholder?: string;
    class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
    focus: [];
    blur: [];
    clear: [];
    input: [value: string | string[]];
    change: [value: string | string[]];
}>();

const model = defineModel<z.infer<typeof AGENT_SCHEMA>>();

const registry: Registry = {
    iri: REGISTRY.iri,
    concept: REGISTRY.concept,
    indigeneitySelect: REGISTRY.indigeneitySelect,
    agentSearch: REGISTRY.agentSearch,
};

const { formData: data, isValid, resetForm } = useVtForm(AGENT_SCHEMA);

const open = ref(false);

function handleSave() {
    model.value = { ...data.value };
    open.value = false;
}

watch(open, (newValue) => {
    if (newValue) {
        if (!model.value) {
            data.value.iri = generateAgentIRI(false);
        }
        else {
            data.value = { ...model.value };
        }
    }
    else {
        resetForm();
    }
});

watch(() => data.value?.type, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        data.value.iri = model.value ? model.value.iri : generateAgentIRI(newValue === "https://schema.org/Person");
    }
});
</script>

<template>
    <div :class="cn('w-full flex flex-row gap-2 items-center', props.class)">
        <AgentSearchInput
            v-model="model"
            :listQuery="agentSearch"
            :getQuery="agentGet"
            resultLabel="name"
            :placeholder="props.placeholder"
            :class="props.class"
            @clear="resetForm(); emits('clear')"
            @blur="emits('blur')"
        />
        <Modal v-model:open="open" class="sm:max-w-[800px]" @update:open="!$event && emits('blur')">
            <template #trigger>
                <Button variant="outline" size="icon" title="Create a custom agent">
                    <Pencil class="size-4" />
                </Button>
            </template>
            <template #title>
                Custom Agent
            </template>
            <template #description>
                You can create your own agent here if it doesn't exist in the IDN's Agents Database
            </template>
            <FormBuilder v-model="data" :schema="AGENT_SCHEMA" :registry="registry" class="grid grid-cols-2 gap-3" />
            <template #footer>
                <Button variant="secondary" class="mr-auto" @click="open = false;">
                    Cancel
                </Button>
                <div class="flex flex-row gap-2 items-center">
                    <Button variant="destructive" @click="resetForm">
                        Clear
                    </Button>
                    <Button :disabled="!isValid" @click="handleSave">
                        Save
                    </Button>
                </div>
            </template>
        </Modal>
    </div>
</template>
