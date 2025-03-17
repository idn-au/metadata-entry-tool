<script lang="ts" setup>
import { ConfigProvider } from "radix-vue";

// import { navigationMenuTriggerStyle } from "~/components/ui/navigation-menu";

const useIdFunction = () => useId();

const items = [
    {
        label: "Home",
        to: "/"
    },
    {
        label: "Help",
        to: "/help"
    },
];

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
    <ConfigProvider :use-id="useIdFunction">
        <header class="bg-background p-4 flex justify-between items-center">
            <div class="flex flex-row gap-3">
                <a href="https://idnau.org/" target="_blank" rel="noopener noreferrer">
                    <img src="/img/idn-logo-250.png" alt="IDN Logo" class="h-[80px]">
                </a>
                <div class="flex flex-col justify-center gap-1">
                    <a href="https://idnau.org/" target="_blank" rel="noopener noreferrer" class="text-2xl">The Indigenous Data Network</a>
                    <div class="flex flex-row">
                        <NuxtLink to="/" class="text-xl">IDN Metadata Entry Tool</NuxtLink>
                    </div>
                </div>
            </div>
            <nav>
                <Button v-for="link in navLinks" variant="ghost" class="rounded-none" as-child>
                    <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
                </Button>
            </nav>
        </header>
        <main class="grow">
            <div class="mx-auto p-3 max-w-[1400px]">
                <nav>
                    <Button v-for="link in items" variant="ghost" class="rounded-none" as-child>
                        <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
                    </Button>
                </nav>
                <NuxtPage />
            </div>
        </main>
        <footer class="bg-secondary mt-6">
            <div class="mx-auto max-w-[1400px] py-12 px-5 text-center">
                <div class="text-sm">The Indigenous Data Network acknowledges the Aboriginal and Torres Strait Islander Traditional Custodians of the lands on which we work and live. We pay respect to their Elders, past and present, and the place of Indigenous Knowledge in the academy and beyond. We acknowledge and respect that Aboriginal and Torres Strait Islander people have always used resources from the land and waters for nourishment, medicine and healing.</div>
                <div>&copy; Indigenous Data Network 2025</div>
            </div>
        </footer>
    </ConfigProvider>
</template>

<style>
#__nuxt {
    height: 100dvh;
    display: flex;
    flex-direction: column;
}
</style>