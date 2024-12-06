<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import { cn } from "@/lib/utils";

register(z);

const props = defineProps<{
    schema: z.AnyZodObject;
}>();

const model = defineModel<z.infer<typeof props.schema>>({ required: true });

const formMeta = props.schema.getMeta() as SectionMeta;

// function getFieldMeta(field): InputMeta {
//     return field._def.typeName === "ZodEffects" ? field._def.schema.getMeta() as InputMeta : field.getMeta() as InputMeta;
// }
</script>

<template>
    <div :class="cn('grid', formMeta?.class)" :style="`${formMeta?.style}`">
        <template v-for="(field, fieldKey) in props.schema.shape" :key="fieldKey">
            <div
                v-if="getZodSchemaMeta(field).type !== 'hidden'"
                :class="getZodSchemaMeta(field)?.class"
                :style="getZodSchemaMeta(field)?.style"
            >
                <FormInput :fieldKey="fieldKey" :field="(field as z.ZodTypeAny)" v-model="model[fieldKey]" />
            </div>
        </template>
    </div>
</template>
