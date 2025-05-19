<script lang="ts" setup>
const route = useRoute();

const items = [
    {
        label: "Home",
        to: "/"
    },
    {
        label: "Help",
        to: "/help"
    },
];
</script>

<template>
    <MainNav />
    <main class="grow">
        <div class="mx-auto p-3 max-w-[1400px]">
            <nav>
                <Button v-for="link in items" :variant="route.path === link.to ? 'secondary' : 'ghost'" class="rounded-none" as-child>
                    <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
                </Button>
            </nav>
            <slot />
        </div>
    </main>
    <footer class="bg-secondary mt-6">
        <div class="mx-auto max-w-[1400px] py-12 px-5 text-center">
            <div class="text-sm">The Indigenous Data Network acknowledges the Aboriginal and Torres Strait Islander Traditional Custodians of the lands on which we work and live. We pay respect to their Elders, past and present, and the place of Indigenous Knowledge in the academy and beyond. We acknowledge and respect that Aboriginal and Torres Strait Islander people have always used resources from the land and waters for nourishment, medicine and healing.</div>
            <div>&copy; Indigenous Data Network 2025</div>
        </div>
    </footer>
</template>
