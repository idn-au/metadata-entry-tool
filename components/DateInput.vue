<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();
const model = defineModel<{
    type: string;
    value: string;
}>({ required: true });

const data = ref({
    year: "",
    month: "",
    day: "",
});

const dayInputRef = ref<HTMLInputElement | null>(null);
const monthInputRef = ref<HTMLInputElement | null>(null);
const yearInputRef = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
    // focus: [];
    blur: [];
    input: [value: {
        type: string;
        value: string;
    }];
    change: [value: {
        type: string;
        value: string;
    }];
}>();

function nextInput(e: Event, next: HTMLInputElement | null) {
    const target = e.target as HTMLInputElement;
    if (target.value.length === target.maxLength && next) {
        next.focus();
    }
}

watch(model, (newValue) => {
    const matches = newValue.value.match(/^(\d{4})(-\d{2})?(-\d{2})?$/);
    if (matches) {
        const [_, year, month, day] = matches.map(m => m !== undefined ? m.replaceAll("-", "") : undefined);
        data.value = {
            year: year || "",
            month: month || "",
            day: day || "",
        }
    }
    emit("input", newValue);
    emit("change", newValue);
    emit("blur");
}, { deep: true });

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
    model.value.value = dateString;
    if (newValue.day && newValue.month && newValue.year) {
        model.value.type = "xsd:date";
    } else if (newValue.month && newValue.year) {
        model.value.type = "xsd:monthYear";
    } else if (newValue.year) {
        model.value.type = "xsd:gYear";
    } else {
        model.value.type = "";
    }
}, { deep: true });
</script>

<template>
    <div :class="cn(
        'flex flex-row gap-1 rounded-md border border-input px-3 py-2 text-sm bg-background ring-offset-background h-10 w-full placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class)">
        <input v-model="data.day" type="text" name="" id="" maxlength="2" placeholder="DD" class="w-6" ref="dayInputRef" @input="nextInput($event, monthInputRef)">
        <span class="text-muted-foreground">/</span>
        <input v-model="data.month" type="text" name="" id="" maxlength="2" placeholder="MM" class="w-6" ref="monthInputRef" @input="nextInput($event, yearInputRef)">
        <span class="text-muted-foreground">/</span>
        <input v-model="data.year" type="text" name="" id="" maxlength="4" placeholder="YYYY" class="w-10" ref="yearInputRef">
    </div>
</template>

<style lang="scss" scoped></style>