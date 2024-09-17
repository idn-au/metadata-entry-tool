<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";

register(z);

const props = defineProps<{
    fieldKey: string;
    field: z.ZodArray<z.AnyZodObject>;
}>();

const model = defineModel<z.infer<typeof props.field>>({ required: true });

const fieldMeta = computed(() => props.field.getMeta() as z.ZodMeta);

function add() {
    model.value.push(structuredClone(fieldMeta.value.initial[0]));
}

function remove(index: number) {
    model.value.splice(index, 1);
}
</script>

<template>
    <div>
        <div v-for="(entry, index) in model" :key="index">
            <FormInput
                v-for="[k, f] in Object.entries(props.field.element.shape)"
                :key="index + k"
                :fieldKey="k + index"
                :field="(f as z.ZodTypeAny)"
                v-model="entry[k]"
            />
            <Button v-if="index > 0" @click="remove(index)">Remove</Button>
        </div>
        <Button @click="add">+ Add</Button>
    </div>
</template>
