<script lang="ts" setup>
import { Sun, Moon, SunMoon, Menu } from "lucide-vue-next";

const colorMode = useColorMode();
const router = useRouter();

const showSidenav = ref(false);

router.beforeEach((from, to) => {
    showSidenav.value = false;
});
</script>

<template>
    <header class="bg-background sticky top-0 z-50 md:z-[unset] md:position-[unset] md:top-[unset] p-4 flex flex-row justify-between items-center">
        <!-- mobile nav -->
        <Sheet v-model:open="showSidenav">
            <SheetTrigger as-child>
                <Button variant="ghost" size="icon" class="md:hidden">
                    <Menu class="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" class="p-2" hideClose>
                <SheetHeader class="flex flex-row justify-between items-center p-2">
                    <SheetClose as-child>
                        <Button variant="ghost" size="icon">
                            <Menu class="size-4" />
                        </Button>
                    </SheetClose>
                    <div class="flex flex-row gap-2 items-center justify-center">
                        <img v-show="colorMode.unknown || colorMode.value === 'light'" src="/img/idn-logo-250.png" alt="IDN Logo" class="h-[40px] md:h-[80px]">
                        <img v-show="!colorMode.unknown && colorMode.value === 'dark'" src="/img/idn-logo-250.png" alt="IDN Logo" class="h-[40px] md:h-[80px]">
                        <span class="text-xl">IDN MET v2</span>
                    </div>
                    <div></div>
                </SheetHeader>
                <NavContent class="md:hidden" />
            </SheetContent>
        </Sheet>
        <!-- header -->
        <div class="flex flex-row gap-3 mr-8 md:mr-auto">
            <a href="https://idnau.org/" target="_blank" rel="noopener noreferrer">
                <img v-show="colorMode.unknown || colorMode.value === 'light'" src="/img/idn-logo-250.png" alt="IDN Logo" class="h-[40px] md:h-[80px]">
                <img v-show="!colorMode.unknown && colorMode.value === 'dark'" src="/img/idn-logo-250.png" alt="IDN Logo" class="h-[40px] md:h-[80px]">
            </a>
            <div class="flex flex-col justify-center gap-1">
                <a href="https://idnau.org/" target="_blank" rel="noopener noreferrer" class="text-2xl hidden md:flex">The Indigenous Data Network</a>
                <NuxtLink to="/" class="text-xl flex md:hidden">IDN MET v2</NuxtLink>
                <NuxtLink to="/" class="text-xl hidden md:flex">IDN Metadata Entry Tool</NuxtLink>
            </div>
        </div>
        <!-- desktop nav -->
        <NavContent class="hidden md:flex" />
        <Button variant="ghost" size="icon" @click="!colorMode.unknown ? colorMode.value === 'dark' ? colorMode.preference = 'light' : colorMode.preference = 'dark' : undefined">
            <SunMoon v-show="colorMode.unknown" />
            <Sun v-show="colorMode.value === 'dark'" class="w-4 h-4" />
            <Moon v-show="colorMode.value === 'light'" class="w-4 h-4" />
        </Button>
    </header>
</template>
