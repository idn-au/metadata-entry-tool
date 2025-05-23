<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();

const model = defineModel<boolean>("open");
</script>

<template>
    <Dialog v-model:open="model">
        <DialogTrigger as-child>
            <slot name="trigger" />
        </DialogTrigger>
        <DialogContent :class="cn('w-[90dvw] sm:max-w-[1200px] max-h-[90dvh] p-0', props.class)">
            <DialogHeader class="p-6 pb-0">
                <DialogTitle v-if="$slots.title">
                    <slot name="title" />
                </DialogTitle>
                <DialogDescription v-if="$slots.description">
                    <slot name="description" />
                </DialogDescription>
            </DialogHeader>
            <div class="modal-content py-4 px-6 max-h-[70dvh] overflow-y-auto">
                <slot />
            </div>
            <DialogFooter v-if="$slots.footer" class="p-6 pt-0 sm:justify-between">
                <slot name="footer" />
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>