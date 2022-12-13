<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
    <nav id="metadata-nav">
        <RouterLink class="nav-link" to="/">Form</RouterLink>
        <RouterLink class="nav-link" to="/help">Help</RouterLink>
        <RouterLink class="nav-link" to="/contact">Contact</RouterLink>
    </nav>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/_mixins.scss";

nav#metadata-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: -20px -20px 0px -20px;
    background-color: $bg1;
    border-bottom: 1px solid #dedede;

    a.nav-link {
        text-decoration: none;
        padding: 8px 12px;
        font-size: 0.9em;
        text-align: center;
        flex: 1;
        max-width: 100px;
        @include transition(color, background-color);

        &:hover {
            background-color: #e9e9e9;
        }

        &.router-link-exact-active {
            color: white;
            background-color: $primary;
        }
    }
}
</style>