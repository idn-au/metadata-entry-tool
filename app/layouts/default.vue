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
	<div class="min-h-dvh flex flex-col">
		<div class="w-full bg-yellow-300 text-black text-center py-1 px-4 text-sm font-medium">
			We are pleased to inform you that this site is under construction and will be updated as soon as possible
		</div>
		<MainNav />
		<TopHeader />
		<main class="grow">
			<div class="mx-auto p-3 max-w-[1400px]">
				<slot />
			</div>
		</main>
		<footer class="bg-secondary mt-6">
			<div class="mx-auto max-w-[1400px] py-12 px-5 text-center flex flex-col gap-4">
				<div class="text-sm">The Indigenous Data Network acknowledges the Aboriginal and Torres Strait Islander Traditional Custodians of the lands on which we work and live. We pay respect to their Elders, past and present, and the place of Indigenous Knowledge in the academy and beyond. We acknowledge and respect that Aboriginal and Torres Strait Islander people have always used resources from the land and waters for nourishment, medicine and healing.</div>
				<hr class="w-3/4 mx-auto" />
				<div class="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-8 mx-auto">
					<img src="/img/idn-logo-250.png" alt="IDN Logo" class="h-[80px]" />
					<img src="/img/logo-um.svg" alt="UoM Logo" class="w-[80px]">
					<img src="/img/ARDC-logo.png" alt="ARDC Logo" class="w-[200px] lg:hidden">
					<img src="/img/NCRIS-PROVIDER.png" alt="NCRIS Logo" class="h-[100px] lg:hidden">
					<img src="/img/ARDC-AUS-NCRIS-logo.png" alt="ARDC, Australian Government and NCRIS Logos" class="h-[100px] hidden lg:flex">
				</div>
				<div class="text-sm">
					Improving Indigenous Research Capabilities is a co-investment partnership with the Australian Research Data Commons (ARDC) through the HASS and Indigenous Research Data Commons (DOI: <a href="https://doi.org/10.3565/pr3g-s109" target="_blank">10.3565/pr3g-s109</a>). The ARDC is enabled by the Australian Government’s National Collaborative Research Infrastructure Strategy (NCRIS).
				</div>
				<div>&copy; Indigenous Data Network 2025</div>
			</div>
		</footer>
	</div>
</template>
