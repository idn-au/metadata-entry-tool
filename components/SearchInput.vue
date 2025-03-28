<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { Search, X } from "lucide-vue-next";
import { useDebounceFn } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
    placeholder?: string;
    listQuery: (term: string) => Promise<Option>[];
    getQuery?: (value: string) => Promise<any>;
    resultLabel?: string;
    class?: HTMLAttributes["class"];
}>();

const model = defineModel<any>({ required: true });

const open = ref(false);
const searchTerm = ref("");
const results = ref<Option[]>([]);
const loading = ref(false);
const selectedItem = ref<any | null>(null);

const emits = defineEmits<{
    focus: [];
    blur: [];
    clear: [];
    input: [value: string | string[]];
    change: [value: string | string[]];
}>();

const debouncedRequest = useDebounceFn(async (term: string) => {
    const result = await props.listQuery(term);
    loading.value = false;
    return result;
}, 200);

async function runListQuery(e: InputEvent) {
    const term = (e.target as HTMLInputElement).value;
    if (term !== "") {
        loading.value = true;
        // @ts-ignore - nested Promise?
        results.value = await debouncedRequest(term);
    } else {
        results.value = [];
    }
}

async function handleSelect(result: Option) {
    if (!!props.getQuery) {
        const item = await props.getQuery(result.value);
        model.value = item;
        selectedItem.value = item;
    } else {
        model.value = result.value;
        selectedItem.value = result;
    }
    open.value = false;
    searchTerm.value = "";
    results.value = [];
}

function displayResult(result: Option | any): string {
    if (props.resultLabel) {
        return result[props.resultLabel] || result.label || result.value;
    } else {
        return result.label || result.value;
    }
}

function handleClear() {
    selectedItem.value = null;
    emits("clear");
}

watch(open, (newValue) => {
    newValue ? emits("focus") : emits("blur");
    if (!newValue) {
        searchTerm.value = "";
        results.value = [];
    }
});

watch(model, (newValue) => {
    if (!!props.getQuery) {
        selectedItem.value = newValue;
    }
    emits("input", newValue);
    emits("change", newValue);
});
</script>

<template>
    <Dialog v-model:open="open">
        <div :class="cn('relative w-full items-center', props.class)">
            <DialogTrigger as-child>
                <Button variant="outline" :class="cn('justify-start w-full pr-10', props.class)">
                    <Search class="size-4 text-muted-foreground mr-2" />
                    <span :class="`overflow-x-hidden ${selectedItem === null ? 'text-muted-foreground' : ''}`">
                        <template v-if="selectedItem !== null">{{ displayResult(selectedItem) }}</template>
                        <template v-else>{{ placeholder || "Search" }}</template>
                    </span>
                </Button>
            </DialogTrigger>
            <span class="absolute end-0 inset-y-0 flex items-center justify-center">
                <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" @click="handleClear"><X class="size-4" /></Button>
            </span>
        </div>
        <DialogContent>
            <DialogHeader>Search</DialogHeader>
            <div>
                <Input type="search" placeholder="Search..." v-model="searchTerm" @input="runListQuery" autofocus />
            </div>
            <div v-if="searchTerm !== ''" class="flex flex-col gap-1">
                <span v-if="loading">Loading...</span>
                <template v-else-if="results">
                    <div v-for="result in results" class="hover:bg-muted cursor-pointer p-2 rounded"
                        @click="handleSelect(result)">
                        {{ displayResult(result) }}
                    </div>
                    <span v-if="results.length === 0">No results found</span>
                </template>
            </div>
        </DialogContent>
    </Dialog>
</template>
