<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";

register(z);

const props = defineProps<{
    // fieldKey: string;
    field: z.AnyZodObject;
}>();

const model = defineModel<z.infer<typeof props.field>>({ required: true });

const shape = props.field.isOptional() ? props.field._def.innerType.shape : props.field.shape;

// const fieldMeta = computed(() => props.field.getMeta() as z.ZodMeta);
</script>

<template>
    <Card class="grow">
        <CardContent class="p-6">
            <div class="grid grid-cols-2 flex-grow gap-2">
                <FormInput
                    v-for="(f, k) in shape"
                    :key="k"
                    :fieldKey="k"
                    :field="(f as z.ZodTypeAny)"
                    v-model="model[k]"
                />
            </div>
        </CardContent>
    </Card>
</template>
