<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
    sidenav: Boolean
});
</script>

<template>
    <nav id="main-nav" :class="sidenav ? 'sidenav' : ''">
        <RouterLink to="/" class="nav-item">Home</RouterLink>
        <a class="nav-item" href="https://mspgh.unimelb.edu.au/centres-institutes/centre-for-health-equity/research-group/indigenous-data-network" target="_blank">IDN Home <i class="fa-regular fa-arrow-up-right-from-square"></i></a>
        <a class="nav-item" href="https://idnau.org/" target="_blank">IDN Project Plan <i class="fa-regular fa-arrow-up-right-from-square"></i></a>
    </nav>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

nav#main-nav {
    display: flex;
    flex-direction: row;
    gap: 12px;
    background-color: #eeeeee;
    border-top: 1px solid #dddddd;

    &.sidenav {
        flex-direction: column;
    }
}

a.nav-item {
    text-decoration: none;
    padding: 6px 10px;
    color: $primary;
    text-align: center;
    
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;

    &:hover {
        text-decoration: none;
        color: white;
        background-color: $primary;
    }
}
</style>