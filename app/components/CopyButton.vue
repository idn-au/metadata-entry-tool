<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import type { ButtonVariants } from "~/components/ui/button";
import { Check, Copy } from "@lucide/vue";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const props = defineProps<{
    value: string;
    iconOnly?: boolean;
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
}>();

let timeout: number | NodeJS.Timeout;
const DURATION = 5000; // ms
const clicked = ref(false);

function onClick() {
    navigator.clipboard.writeText(props.value.trim());
    clearTimeout(timeout);
    clicked.value = true;
    timeout = setTimeout(() => {
        clicked.value = false;
    }, DURATION);
}
</script>

<template>
    <Button
        :variant="props.variant"
        :size="props.size"
        :class="cn('copy-btn', props.class)"
        title="Copy to clipboard"
        aria-label="Copy"
        @click="onClick"
    >
        <Check v-if="clicked" class="size-4" />
        <Copy v-else class="size-4" />
        <template v-if="!props.iconOnly">
            {{ clicked ? 'Copied!' : 'Copy' }}
        </template>
    </Button>
</template>
