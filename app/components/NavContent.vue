<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const route = useRoute();

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();

const links = [
    {
        label: "Home",
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
    <nav :class="cn('flex flex-col md:flex-row items-center', props.class)">
        <Button
            v-for="link in links"
            variant="ghost"
            :class="`rounded-none border-l-2 md:border-l-0 md:border-b-2 w-full md:w-auto ${route.path === link.to ? 'border-l-isu-red md:border-b-isu-red' : 'border-l-transparent md:border-b-transparent'}`"
            as-child
        >
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
        </Button>
        <span class="mx-4 hidden md:flex border-r-1 border-r-foreground h-6"></span>
        <hr class="md:hidden border-b-1 border-b-foreground w-3/4 my-4" />
        <Button v-for="link in extLinks" variant="ghost" class="rounded-none" as-child>
            <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
        </Button>
    </nav>
</template>
