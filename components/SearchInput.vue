<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { Search } from "lucide-vue-next";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps<{
    placeholder?: string;
    query: (term: string) => Promise<any>[];
    resultLabel?: string;
    class?: HTMLAttributes["class"];
}>();

const model = defineModel<any>({ required: true });

const open = ref(false);
const searchTerm = ref("");
const results = ref([]);
const loading = ref(false);

const emits = defineEmits<{
    focus: [];
    blur: [];
    input: [value: string | string[]];
    change: [value: string | string[]];
}>();

const debouncedRequest = useDebounceFn(async () => {
    return await props.query(searchTerm.value);
}, 200);

async function runQuery() {
    if (searchTerm.value !== "") {
        loading.value = true;
        results.value = await debouncedRequest();
        loading.value = false;
    } else {
        results.value = [];
    }
}

function handleSelect(result: any) {
    model.value = result;
    open.value = false;
    searchTerm.value = "";
    results.value = [];
}

function displayResult(result: any): string {
    return result[props.resultLabel || "name"] || result;
}

watch(open, (newValue) => {
    newValue ? emits("focus") : emits("blur");
    if (!newValue) {
        searchTerm.value = "";
        results.value = [];
    }
});

watch(model, (newValue) => {
    emits("input", newValue);
    emits("change", newValue);
});
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <Button variant="outline" :class="props.class">
                <Search class="size-6 text-muted-foreground -ml-2 pr-1" />
                <span v-if="Object.keys(model).length > 0">{{ displayResult(model) }}</span>
                <span v-else class="text-muted-foreground">{{ placeholder || "Search" }}</span>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>Search</DialogHeader>
            <div>
                <Input type="search" placeholder="Search..." v-model="searchTerm" @input="runQuery" autofocus />
            </div>
            <div v-if="searchTerm !== ''" class="results flex flex-col gap-1">
                <span v-if="loading">Loading...</span>
                <template v-else>
                    <div v-for="result in results" class="result cursor-pointer p-2 rounded"
                        @click="handleSelect(result)">
                        {{ displayResult(result) }}
                    </div>
                    <span v-if="results.length === 0">No results found</span>
                </template>
            </div>
        </DialogContent>
    </Dialog>
</template>

<style lang="scss" scoped>
.result {
    transition: background-color ease-in-out 0.2s;

    &:hover {
        background-color: #eeeeee;
    }
}
</style>