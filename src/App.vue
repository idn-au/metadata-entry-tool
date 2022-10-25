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
    border-radius: 6px;

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

    &.success {
        background-color: $success;
        color: white;

        &:hover {
            background-color: darken($color: $success, $amount: 7);
        }
    }

    &.lg {
        font-size: 1.1rem;
        padding: 8px 10px;
    }
}
</style>
