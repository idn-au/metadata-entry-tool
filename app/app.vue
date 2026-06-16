<script lang="ts" setup>
import { ConfigProvider } from "reka-ui";

const useIdFunction = () => useId();
</script>

<template>
    <ConfigProvider :use-id="useIdFunction">
<!--        <NuxtLayout>-->
<!--            -->
<!--        </NuxtLayout>-->
	    <NuxtPage />
    </ConfigProvider>
</template>
