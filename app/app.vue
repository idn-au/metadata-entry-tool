<script lang="ts" setup>
import { ConfigProvider } from "reka-ui";

const useIdFunction = () => useId();
</script>

<template>
    <ConfigProvider :useId="useIdFunction">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </ConfigProvider>
</template>
