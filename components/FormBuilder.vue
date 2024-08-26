<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { register } from "zod-metadata";
import * as z from "zod";

register(z);

const props = defineProps<{
    schema: z.AnyZodObject;
}>();

const model = defineModel<z.infer<typeof props.schema>>({ required: true });
</script>

<template>
    <Form :validationSchema="toTypedSchema(props.schema)">
        <FormInput
            v-for="[fieldKey, field] in Object.entries(props.schema.shape)"
            :fieldKey="fieldKey"
            :field="(field as z.ZodTypeAny)"
            v-model="model[fieldKey]"
        />
    </Form>
</template>
