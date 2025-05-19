<script lang="ts" setup>
import { Sun, Moon, SunMoon } from "lucide-vue-next";

const colorMode = useColorMode();

const navLinks: { label: string; url: string }[] = [
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
    <header class="bg-background p-4 flex justify-between items-center">
        <div class="flex flex-row gap-3">
            <a href="https://idnau.org/" target="_blank" rel="noopener noreferrer">
                <img v-show="colorMode.unknown || colorMode.value === 'light'" src="/img/idn-logo-250.png" alt="IDN Logo" class="h-[80px]">
                <img v-show="!colorMode.unknown && colorMode.value === 'dark'" src="/img/idn-logo-250.png" alt="IDN Logo" class="h-[80px]">
            </a>
            <div class="flex flex-col justify-center gap-1">
                <a href="https://idnau.org/" target="_blank" rel="noopener noreferrer" class="text-2xl">The Indigenous Data Network</a>
                <div class="flex flex-row">
                    <NuxtLink to="/" class="text-xl">IDN Metadata Entry Tool</NuxtLink>
                </div>
            </div>
        </div>
        <nav class="flex flex-row items-center">
            <Button v-for="link in navLinks" variant="ghost" class="rounded-none" as-child>
                <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
            </Button>
            <Button variant="ghost" size="icon" @click="!colorMode.unknown ? colorMode.value === 'dark' ? colorMode.preference = 'light' : colorMode.preference = 'dark' : undefined">
                <SunMoon v-show="colorMode.unknown" />
                <Sun v-show="colorMode.value === 'dark'" class="w-4 h-4" />
                <Moon v-show="colorMode.value === 'light'" class="w-4 h-4" />
            </Button>
        </nav>
    </header>
</template>
