<script lang="ts" setup>
import { Acknowledgement, ARDCFooter, IDCFooter, IDCHeader, IDCPageHeader, ScrollToTopButton } from "@idn-au/idn-lib";
</script>

<template>
    <div class="min-h-dvh flex flex-col">
        <IDCHeader baseUrl="https://metadata.idnau.org" />
        <main class="grow mb-12">
            <IDCPageHeader>
                <template #title>
                    Metadata Entry Tool
                </template>
                <template #description>
                    Create metadata records to support the discoverability, governance, and reuse of Indigenous data in line with Indigenous Data Commons principles.
                </template>
            </IDCPageHeader>
            <div class="mx-auto px-2 max-w-[1400px]">
                <slot />
            </div>
        </main>
        <Acknowledgement />
        <ARDCFooter />
        <IDCFooter />
    </div>
    <ScrollToTopButton />
</template>

<style scoped>

</style>
