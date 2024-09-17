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
];
</script>

<template>
    <div>
        <NavigationMenu>
            <NavigationMenuItem v-for="item in items">
                <NavigationMenuLink :class="navigationMenuTriggerStyle()" as-child>
                    <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
                </NavigationMenuLink>
            </NavigationMenuItem>
        </NavigationMenu>
        <NuxtPage />
    </div>
</template>

<style lang="scss" scoped>
li {
    list-style: none;
}
</style>