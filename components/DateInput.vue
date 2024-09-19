<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();
const model = defineModel<string>({ required: true });

const data = ref({
    year: "",
    month: "",
    day: "",
});

watch(model, (newValue) => {
    const matches = newValue.match(/^(\d{4})(-\d{2})?(-\d{2})?$/);
    if (matches) {
        const [_, year, month, day] = matches.map(m => m !== undefined ? m.replaceAll("-", "") : undefined);
        data.value = {
            year: year || "",
            month: month || "",
            day: day || "",
        }
    }
});

watch(data, (newValue) => {
    var dateString = "";
    if (newValue.year) {
        dateString += newValue.year;
    }
    if (newValue.month) {
        dateString += "-" + newValue.month;
    }
    if (newValue.day) {
        dateString += "-" + newValue.day;
    }
    model.value = dateString;
}, { deep: true });
</script>

<template>
    <div :class="cn(
        'flex flex-row gap-1 rounded-md border border-input px-3 py-2 text-sm bg-background ring-offset-background h-10 w-full placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class)"
    >
        <input v-model="data.day" type="text" name="" id="" maxlength="2" placeholder="DD" class="w-6">
        <span class="text-muted-foreground">/</span>
        <input v-model="data.month" type="text" name="" id="" maxlength="2" placeholder="MM" class="w-6">
        <span class="text-muted-foreground">/</span>
        <input v-model="data.year" type="text" name="" id="" maxlength="4" placeholder="YYYY" class="w-10">
    </div>
</template>

<style lang="scss" scoped></style>