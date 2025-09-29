<script setup lang="ts">
import { ref, watch, type HTMLAttributes } from "vue";
import { Check, ChevronsUpDown, Search, X, ExternalLink } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{
    vocabIRI: string;
    placeholder?: string;
    multiple?: boolean;
    class?: HTMLAttributes["class"];
}>();

const model = defineModel<string | string[]>();

const open = ref(false);

const { data: conceptOptions } = await useLazyAsyncData(props.vocabIRI, () => sparqlOptions(props.vocabIRI));

const emits = defineEmits<{
    focus: [];
    blur: [];
    clear: [];
    input: [value: string | string[]];
    change: [value: string | string[]];
}>();

watch(open, (newValue) => {
    newValue ? emits("focus") : emits("blur");
});

watch(model, (newValue) => {
    emits("input", newValue);
    emits("change", newValue);
});
</script>

<template>
    <div class="flex flex-row gap-1 items-center w-full relative">
        <Combobox v-model="model" by="label" v-model:open="open" :multiple="props.multiple" class="relative w-full flex items-center">
            <ComboboxAnchor as-child>
                <ComboboxTrigger as-child>
                    <Button variant="outline" role="combobox" :aria-expanded="open" :class="cn(`grow justify-between !pr-10 ${(props.multiple && Array.isArray(model) ? model.length > 0 : model) ? '' : 'text-muted-foreground'}`, props.class)">
                        <span class="overflow-hidden">
                            {{ (props.multiple && Array.isArray(model) ? model.length > 0 : model) && conceptOptions
                            ? (Array.isArray(model)
                                ? model.map(v => conceptOptions.find((option) => option.value === v)?.label).join(", ")
                                : conceptOptions.find((option) => option.value === model)?.label)
                            : props.placeholder || "Select an option" }}
                        </span>
                        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </ComboboxTrigger>
                <span class="absolute end-0 inset-y-0 flex items-center justify-center">
                    <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" @click="emits('clear')"><X class="size-4" /></Button>
                </span>
            </ComboboxAnchor>

            <ComboboxList class="z-[100] w-[var(--reka-popper-anchor-width)]">
                <div class="relative w-full items-center">
                    <ComboboxInput class="focus-visible:ring-0 border-0 border-b rounded-none h-10" placeholder="Search..." />
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                        <Search class="size-4 text-muted-foreground" />
                    </span>
                </div>

                <ComboboxEmpty>
                    No results found.
                </ComboboxEmpty>

                <ComboboxGroup class="max-h-[260px] overflow-y-auto">
                    <ComboboxItem v-for="option in conceptOptions" class="cursor-pointer" :key="option.value.toString()" :value="option.value">
                        <div class="flex flex-col">
                            <span>{{ option.label || option.value }}</span>
                            <span class="text-muted-foreground text-xs italic">{{ option.desc }}</span>
                        </div>
                        <ComboboxItemIndicator>
                            <Check :class="cn('ml-auto h-4 w-4')" />
                        </ComboboxItemIndicator>
                    </ComboboxItem>
                </ComboboxGroup>
            </ComboboxList>
        </Combobox>
        <Button size="icon" variant="outline" title="Vocab page" as-child>
            <a :href="props.vocabURL" target="_blank" rel="noopener noreferrer">
                <ExternalLink class="size-4" />
            </a>
        </Button>
    </div>
</template>