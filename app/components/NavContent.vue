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

const extLinks: { label: string; url: string }[] = [
    {
        label: "About Us",
        url: "https://idnau.org/about",
    },
    {
        label: "Resources",
        url: "https://idnau.org/resources",
    },
    {
        label: "Contact Us",
        url: "https://idnau.org/contact",
    },
];
</script>

<template>
    <nav :class="cn('flex flex-row items-center', props.class)">
        <Button
            v-for="link in links"
            variant="ghost"
            class="flex-1 justify-center rounded-none border-b-2 text-xs md:text-sm px-1 md:px-3"
            :class="route.path === link.to ? 'border-b-isu-red' : 'border-b-transparent'"
            as-child
        >
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
        </Button>
        <!-- <span class="mx-4 hidden md:flex border-r-1 border-r-foreground h-6"></span>
        <hr class="md:hidden border-b-1 border-b-foreground w-3/4 my-4" />
        <Button v-for="link in extLinks" variant="ghost" class="rounded-none" as-child>
            <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
        </Button> -->
    </nav>
</template>
