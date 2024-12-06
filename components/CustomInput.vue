<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { X } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{
    type?: string;
    id?: string;
    placeholder?: string;
    class?: HTMLAttributes["class"];
}>();

const model = defineModel<string>({ required: true });

const emit = defineEmits<{
    clear: [];
    focus: [];
    blur: [];
    input: [string];
}>();
</script>

<template>
    <div :class="cn('relative w-full items-center', props.class)">
        <Input :id="props.id" :type="props.type" v-model="model" :placeholder="placeholder" class="pr-10" @focus="emit('focus')" @blur="emit('blur')" />
        <span class="absolute end-0 inset-y-0 flex items-center justify-center">
            <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" @click="emit('clear')"><X class="size-4" /></Button>
        </span>
    </div>
</template>
