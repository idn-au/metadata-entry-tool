<script lang="ts" setup>
import { navigationMenuTriggerStyle } from "~/components/ui/navigation-menu";

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
        label: "MET",
        to: "/met"
    },
    {
        label: "SPARQL",
        to: "/sparql"
    },
    {
        label: "Stepper",
        to: "/stepper"
    },
];
</script>

<template>
    <header>
        <NavigationMenu>
            <NavigationMenuItem v-for="item in items">
                <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                    <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
                </NavigationMenuLink>
            </NavigationMenuItem>
        </NavigationMenu>
    </header>
    <main>
        <NuxtPage />
    </main>
</template>

<style lang="scss" scoped>
li {
    list-style: none;
}

main {
    padding: 1rem;
}
</style>