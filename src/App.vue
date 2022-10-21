<script setup>
import { RouterView } from "vue-router";
import { HeaderComponent, MainComponent, FooterComponent } from "@idn-au/idn-lib";
</script>

<template>
    <HeaderComponent title="IDN Metadata Form" :dev="true" />
    <MainComponent>
        <RouterView />
    </MainComponent>
    <FooterComponent />
</template>

<style lang="scss">
@import "@/assets/_variables.scss";

.btn {
    padding: 6px 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;

    &.primary {
        background-color: $primary;
        color: white;

        &:hover {
            background-color: darken($color: $primary, $amount: 10);
        }
    }

    &.outline {
        background-color: white;
        border-color: $primary;
        color: $primary;

        &:hover {
            background-color: $primary;
            color: white;
        }
    }
}
</style>
