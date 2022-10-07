<script setup>
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import idnLogo from "@/assets/idn-logo.png";

const sidenav = false;
</script>

<template>
    <header>
        <div id="page-header">
            <img :src="idnLogo" alt="IDN Logo">
            <h1>Indigenous Data Network</h1>
        </div>
        <h1 id="page-title">Metadata Submission Form</h1>
    </header>
    <main :class="sidenav ? 'sidenav' : ''">
        <NavBar :sidenav="sidenav" />
        <div id="content">
            <RouterView />
        </div>
    </main>
    <footer>
        footer
    </footer>
</template>

<style lang="scss">
@import "@/assets/_variables.scss";

* {
    box-sizing: border-box;
}

body,
html {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    background-color: #eeeeee;
    display: flex;
    flex-direction: column;
    padding: 20px;

    #page-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 20px;
        max-height: 120px;
        margin: 0 auto;

        img {
            height: 100%;
        }

        h1 {}
    }

    h1#page-title {
        text-align: center;
    }
}

main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    &.sidenav {
        flex-direction: row;
    }

    #content {
        flex-grow: 1;
        width: 100%;
        max-width: 1600px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }
}

footer {
    background-color: #eeeeee;
}

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
