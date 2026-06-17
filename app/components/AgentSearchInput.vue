<script lang="ts" setup>
import { type HTMLAttributes } from "vue";
import { Search, X } from "@lucide/vue";
import { useDebounceFn } from "@vueuse/core";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";

type SearchOption = {
	label?: string;
	value: string;
	[key: string]: any;
};

const props = defineProps<{
	placeholder?: string;
	listQuery: (term: string) => Promise<SearchOption[]>;
	getQuery?: (value: string) => Promise<any>;
	resultLabel?: string;
	class?: HTMLAttributes["class"];
}>();

const model = defineModel<any>();

const open = ref(false);
const searchTerm = ref("");
const results = ref<SearchOption[]>([]);
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

async function handleSelect(result: SearchOption) {
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

function displayResult(result: SearchOption): string {
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
	<div :class="cn('relative w-full items-center', props.class)">
		<Dialog v-model:open="open">
			<DialogTrigger as-child>
				<Button variant="outline" :class="cn('justify-start w-full pr-10', props.class)">
					<Search class="size-4 text-muted-foreground mr-2" />
					<span :class="`overflow-x-hidden ${model === undefined || Object.keys(model).length === 0 ? 'text-muted-foreground' : ''}`">
                        <template v-if="selectedItem !== null">{{ displayResult(selectedItem) }}</template>
                        <template v-else>{{ placeholder || "Search..." }}</template>
                    </span>
				</Button>
			</DialogTrigger>
			<DialogContent class="max-h-[90dvh]">
				<DialogHeader>
					<DialogTitle>Search Agents</DialogTitle>
					<DialogDescription>Search for agents within the IDN's Agents Database</DialogDescription>
				</DialogHeader>
				<div class="relative w-full items-center">
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center">
                        <Search class="size-4 text-muted-foreground ml-2" />
                    </span>
					<Input type="search" placeholder="Search..." class="px-10" v-model="searchTerm" @input="runListQuery" autofocus />
					<span class="absolute end-0 inset-y-0 flex items-center justify-center">
                        <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" @click="searchTerm = ''"><X class="size-4" /></Button>
                    </span>
				</div>
				<div v-if="searchTerm !== ''" class="flex flex-col gap-1 overflow-y-auto max-h-[70dvh]">
					<div v-if="loading" class="flex flex-col gap-2">
						<Skeleton class="h-4 w-[250px]" />
						<Skeleton class="h-4 w-[250px]" />
						<Skeleton class="h-4 w-[250px]" />
					</div>
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
		<span class="absolute end-0 inset-y-0 flex items-center justify-center">
            <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" @click="handleClear"><X class="size-4" /></Button>
        </span>
	</div>
</template>
