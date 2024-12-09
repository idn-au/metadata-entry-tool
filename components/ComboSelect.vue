<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { Check, ChevronsUpDown, X } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { Option } from "~/types";

const props = defineProps<{
    options: Option[];
    placeholder?: string;
    class?: HTMLAttributes["class"];
    multiple?: boolean;
    modelValue?: string | string[];
}>();

const model = defineModel<string | string[]>({ required: true });

const open = ref(false);

// doesn't work
function filterFunction(list: Option[], searchTerm: string): Option[] {
    return list.filter((option) => {
        return option.label.toLowerCase().includes(searchTerm.toLowerCase());
    });
}

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
    <Popover v-model:open="open">
        <div :class="cn('relative w-full items-center', props.class)">
            <PopoverTrigger as-child>
                <Button variant="outline" role="combobox" :aria-expanded="open"
                    :class="cn(`w-full justify-between pr-10 ${(props.multiple ? model.length > 0 : model) ? '' : 'text-muted-foreground'}`, props.class)">
                    <span class="overflow-x-hidden">{{ (props.multiple ? model.length > 0 : model)
                        ? (props.multiple
                            ? model.map(v => props.options.find((option) => option.value === v)?.label).join(", ")
                            : props.options.find((option) => option.value === model)?.label)
                        : props.placeholder }}</span>
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <span class="absolute end-0 inset-y-0 flex items-center justify-center">
                <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" @click="emits('clear')"><X class="size-4" /></Button>
            </span>
        </div>
        <PopoverContent class="w-full max-w-[300px] p-0">
            <Command>
                <CommandInput class="h-9" placeholder="Search..." />
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandList>
                    <CommandGroup>
                        <CommandItem v-for="option in props.options" :key="option.value" :value="option.value" @select="(ev) => {
                            if (typeof ev.detail.value === 'string') {
                                if (props.multiple) {
                                    if (model.includes(ev.detail.value)) {
                                        (model as string[]).splice(model.indexOf(ev.detail.value), 1);
                                    } else {
                                        (model as string[]).push(ev.detail.value);
                                    }

                                } else {
                                    model = ev.detail.value;
                                    open = false;
                                }
                            }
                        }">
                            {{ option.label }}
                            <Check :class="cn(
                                'ml-auto h-4 w-4',
                                (props.multiple ? model.includes(option.value) : model === option.value) ? 'opacity-100' : 'opacity-0',
                            )" />
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>

<style lang="scss" scoped></style>