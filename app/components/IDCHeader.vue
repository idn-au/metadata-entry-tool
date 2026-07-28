<script lang="ts" setup>
import { Sun, Moon, SunMoon } from "@lucide/vue";
import {useWindowScroll, useWindowSize} from "@vueuse/core";

const router = useRouter();
const colorMode = useColorMode();
const { y } = useWindowScroll();
const { width: windowWidth } = useWindowSize();

const showSidenav = ref(false);

const logoWidth = computed(() => {
	const breakpoint = 768; // md
	const isMobile = windowWidth.value < breakpoint;
	const maxWidth = isMobile ? 200 : 248;
	const minWidth = isMobile ? 136 : 160;
	return Math.max(maxWidth - y.value / 2, minWidth);
});

router.beforeEach((from, to) => {
	showSidenav.value = false;
});
</script>

<template>
	<header class="top-nav sticky top-0 flex flex-row items-center p-4 gap-2 z-49 transition-colors flex-wrap bg-background">
		<a href="https://indigenousdatacommons.org" class="mr-auto">
			<NuxtImg src="/img/idc-logo.png" class="max-w-50 min-w-34 md:max-w-62 md:min-w-40 h-auto" :style="{width: `${logoWidth}px`}" />
		</a>
		<MainNav />
        <Button variant="ghost" size="icon" @click="!colorMode.unknown ? colorMode.value === 'dark' ? colorMode.preference = 'light' : colorMode.preference = 'dark' : undefined">
	        <SunMoon v-show="colorMode.unknown" />
	        <Sun v-show="colorMode.value === 'dark'" class="size-4" />
	        <Moon v-show="colorMode.value === 'light'" class="size-4" />
        </Button>
	</header>
</template>
