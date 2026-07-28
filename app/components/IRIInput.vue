<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { Copy, RefreshCw, Eye, EyeOff, Check, Pencil } from "@lucide/vue";
import { CustomInput } from "@vulptech/vt-form";
import { cn } from "~/lib/utils";

const props = defineProps<{
    generateFn: () => string;
    class?: HTMLAttributes["class"];
}>();

var timeout: number | NodeJS.Timeout;
const DURATION = 5000; // ms
const clicked = ref(false);
const show = ref(false);

const model = defineModel<string>();

const emit = defineEmits<{
    focus: [];
    blur: [];
    clear: [];
    input: [value: string];
}>();

function copyToClipboard() {
	navigator.clipboard.writeText(model.value?.trim() || "");
	clearTimeout(timeout);
	clicked.value = true;
	timeout = setTimeout(() => {
		clicked.value = false;
	}, DURATION);
}

watch(model, (newValue) => {
    emit("input", newValue);
});
</script>

<template>
    <div class="flex flex-row gap-2 items-center">
        <CustomInput v-if="show" type="url" v-model="model" :class="cn('font-mono text-xs!', props.class)" @clear="model = ''; emit('clear')" @blur="emit('blur')" />
        <Button v-if="show" size="icon" variant="outline" title="Copy to clipboard" @click="copyToClipboard">
	        <Check v-if="clicked" class="size-4" />
	        <Copy v-else class="size-4" />
        </Button>
	    <Button v-else variant="outline" title="Copy to clipboard" @click="copyToClipboard">
		    <template v-if="clicked">
			    Copied
			    <Check class="size-4" />
		    </template>
		    <template v-else>
			    Copy ID
			    <Copy class="size-4" />
		    </template>
	    </Button>
        <Button v-if="show" size="icon" variant="outline" title="Regenerate IRI" @click="model = props.generateFn()"><RefreshCw class="size-4" /></Button>
	    <Button size="icon" variant="outline" title="Toggle ID" @click="show = !show">
		    <EyeOff v-if="show" />
		    <Eye v-else />
	    </Button>
    </div>
</template>
