<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const route = useRoute();

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();

const links = [
    {
        label: "Metadata Entry Tool",
        to: "/"
    },
    {
        label: "Help",
        to: "/help"
    },
];
</script>

<template>
    <nav :class="cn('flex flex-row items-center bg-background', props.class)">
        <Button
            v-for="link in links"
            variant="ghost"
            class="flex-1 justify-center rounded-none border-b-2 text-xs md:text-sm px-1 md:px-3"
            :class="route.path === link.to ? 'border-b-isu-red' : 'border-b-transparent'"
            as-child
        >
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
        </Button>
    </nav>
</template>
