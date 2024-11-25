<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import { cn } from "@/lib/utils";

register(z);

const props = defineProps<{
    schema: z.AnyZodObject;
}>();

const model = defineModel<z.infer<typeof props.schema>>({ required: true });

const formMeta = props.schema.getMeta();
</script>

<template>
    <div :class="cn('grid', formMeta?.class)" :style="`${formMeta?.style}`">
        <div v-for="[fieldKey, field] in Object.entries(props.schema.shape)" :key="fieldKey" :class="field.getMeta()?.class"
            :style="field.getMeta()?.style">
            <FormInput :fieldKey="fieldKey" :field="(field as z.ZodTypeAny)" v-model="model[fieldKey]" />
        </div>
    </div>
</template>
