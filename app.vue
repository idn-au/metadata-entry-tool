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
        label: "Form",
        to: "/form"
    },
    {
        label: "Scoring",
        to: "/score"
    },
    {
        label: "JSON-LD",
        to: "/jsonld"
    },
    {
        label: "SPARQL",
        to: "/sparql"
    },
];
</script>

<template>
    <ConfigProvider :use-id="useIdFunction">
        <header class="bg-secondary">
            <!-- <NavigationMenu>
                <NavigationMenuItem v-for="item in items">
                    <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                        <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenu> -->
            <div class="mx-auto p-3 max-w-[1400px]">
                IDN header
            </div>
        </header>
        <main class="grow">
            <div class="mx-auto p-3 max-w-[1400px]">
                <NuxtPage />
            </div>
        </main>
        <footer class="bg-secondary">
            <div class="mx-auto p-3 max-w-[1400px]">
                IDN footer
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