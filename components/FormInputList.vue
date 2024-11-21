<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import { Trash } from "lucide-vue-next";

register(z);

const props = defineProps<{
    // fieldKey: string;
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
    <Card>
        <CardContent class="flex flex-col gap-4 p-6">
            <div v-for="(entry, index) in model" :key="index" class="flex flex-row gap-2">
                <FormInputGroup v-model="model[index]" :field="props.field.element" />
                <div class="w-6 flex">
                    <Button v-if="index > 0" variant="destructive" size="sm" class="my-auto" @click="remove(index)"><Trash class="w-4 h-4" /></Button>
                </div>
            </div>
        </CardContent>
        <CardFooter><Button @click="add">+ Add</Button></CardFooter>
    </Card>
</template>
