<script lang="ts" setup>
import { ConfigProvider } from "reka-ui";

const useIdFunction = () => useId();
</script>

<template>
    <ConfigProvider :use-id="useIdFunction">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </ConfigProvider>
</template>

<style>
#__nuxt {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
}
</style>