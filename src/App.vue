<script setup>
import { RouterView } from "vue-router";
import { HeaderComponent, MainComponent, FooterComponent } from "@idn-au/idn-lib";
import MetadataNav from "@/components/MetadataNav.vue";

const banners = [
    {
        "type": "dev",
        "message": "This website is currently under development"
    }
];
</script>

<template>
    <HeaderComponent title="IDN Metadata Form" :banners="banners" />
    <MainComponent>
        <MetadataNav />
        <RouterView />
    </MainComponent>
    <FooterComponent />
</template>

<style lang="scss">
@import "@/assets/_variables.scss";
@import "@/assets/_mixins.scss";

#main-content {
    gap: unset !important;
}

body {
    line-height: 1.2;
}

h2 {
    margin: 0.8em 0 0.5em 0;
}

.btn {
    padding: 6px 8px;
    border: 1px solid transparent;
    cursor: pointer;
    @include transition(color, background-color);
    border-radius: 6px;

    background-color: $defaultBtnBg;

    &:not(:disabled):not([disabled="true"]):hover {
        background-color: darken($color: $defaultBtnBg, $amount: 10);
    }

    &.outline {
        background-color: transparent;
        border-color: $defaultBtnBg;
        color: $defaultBtnBg;

        &:not(:disabled):not([disabled="true"]):hover {
            background-color: $defaultBtnBg;
            color: white;
        }
    }

    &.primary {
        background-color: $primary;
        color: white;

        &:not(:disabled):not([disabled="true"]):hover {
            background-color: darken($color: $primary, $amount: 10);
        }

        &.outline {
            background-color: transparent;
            border-color: $primary;
            color: $primary;

            &:not(:disabled):not([disabled="true"]):hover {
                background-color: $primary;
                color: white;
            }
        }
    }

    &.secondary {
        background-color: $secondary;
        color: white;

        &:not(:disabled):not([disabled="true"]):hover {
            background-color: darken($color: $secondary, $amount: 10);
        }

        &.outline {
            background-color: transparent;
            border-color: $secondary;
            color: $secondary;

            &:not(:disabled):not([disabled="true"]):hover {
                background-color: $secondary;
                color: white;
            }
        }
    }

    &.success {
        background-color: $success;
        color: white;

        &:not(:disabled):not([disabled="true"]):hover {
            background-color: darken($color: $success, $amount: 7);
        }

        &.outline {
            background-color: transparent;
            border-color: $success;
            color: $success;

            &:not(:disabled):not([disabled="true"]):hover {
                background-color: $success;
                color: white;
            }
        }
    }

    &.danger {
        background-color: $danger;
        color: white;

        &:not(:disabled):not([disabled="true"]):hover {
            background-color: darken($color: $danger, $amount: 7);
        }

        &.outline {
            background-color: transparent;
            border-color: $danger;
            color: $danger;

            &:not(:disabled):not([disabled="true"]):hover {
                background-color: $danger;
                color: white;
            }
        }
    }

    &.lg {
        font-size: 1.1rem;
        padding: 8px 10px;
    }

    &.sm {
        font-size: 0.75em;
        padding: 4px 6px;
    }

    &:disabled, &[disabled="true"] {
        opacity: 0.7;
        cursor: default;
    }
}
</style>
