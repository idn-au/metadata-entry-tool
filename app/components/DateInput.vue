<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { X } from "lucide-vue-next";
import { cn } from "~/lib/utils";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();

const model = defineModel<{
    type: string;
    value: string;
}>();

const data = ref({
    year: "",
    month: "",
    day: "",
});

const focus = ref(false);

const dayInputRef = ref<HTMLInputElement | null>(null);
const monthInputRef = ref<HTMLInputElement | null>(null);
const yearInputRef = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
    // focus: [];
    blur: [];
    clear: [];
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

function handleFocus(e: FocusEvent) {
    if (!focus.value) {
        focus.value = true;
    }
}

function handleBlur(e: FocusEvent) {
    if (![dayInputRef.value, monthInputRef.value, yearInputRef.value].includes(e.relatedTarget)) {
        focus.value = false;
        emit("blur");
    }
}

watch(model, (newValue) => {
    if (!newValue || newValue.value === "") {
        data.value = {
            year: "",
            month: "",
            day: "",
        };
    } else {
        const matches = newValue.value.match(/^(\d{4})(-\d{2})?(-\d{2})?$/);
        if (matches) {
            const [_, year, month, day] = matches.map(m => m !== undefined ? m.replaceAll("-", "") : undefined);
            if (year !== data.value.year && month !== data.value.month && day !== data.value.day) {
                data.value = {
                    year: year || "",
                    month: month || "",
                    day: day || "",
                };
            }
        }
        emit("input", newValue);
        emit("change", newValue);
        emit("blur");
    }
}, { deep: true });

watch(data, (newValue) => {
    if (!newValue.year && !newValue.month && !newValue.day) {
        model.value = undefined;
    } else {
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
        const dateObj = {
            value: dateString,
            type: ""
        };
        if (newValue.day && newValue.month && newValue.year) {
            dateObj.type = "xsd:date";
        } else if (newValue.month && newValue.year) {
            dateObj.type = "xsd:monthYear";
        } else if (newValue.year) {
            dateObj.type = "xsd:gYear";
        }
        model.value = {...dateObj};
    }
}, { deep: true });
</script>

<template>
    <div :class="cn('relative w-full items-center', focus ? 'border-ring ring-ring/50 ring-[3px] rounded-md' : '', props.class)">
        <div :class="cn(
            'flex flex-row gap-1 rounded-md border border-input px-3 py-2 text-sm bg-background h-10 w-full placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            props.class)">
            <input v-model="data.day" type="text" name="" id="" maxlength="2" placeholder="DD" class="w-6" ref="dayInputRef" @input="nextInput($event, monthInputRef)" @focus="handleFocus" @blur="handleBlur">
            <span class="text-muted-foreground">/</span>
            <input v-model="data.month" type="text" name="" id="" maxlength="2" placeholder="MM" class="w-6" ref="monthInputRef" @input="nextInput($event, yearInputRef)" @focus="handleFocus" @blur="handleBlur">
            <span class="text-muted-foreground">/</span>
            <input v-model="data.year" type="text" name="" id="" maxlength="4" placeholder="YYYY" class="w-10" ref="yearInputRef" @focus="handleFocus" @blur="handleBlur">
        </div>
        <span class="absolute end-0 inset-y-0 flex items-center justify-center">
            <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" @click="emit('clear')"><X class="size-4" /></Button>
        </span>
    </div>
</template>
