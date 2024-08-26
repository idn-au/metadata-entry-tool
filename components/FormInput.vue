<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";

register(z);

const props = defineProps<{
    fieldKey: string;
    field: z.ZodTypeAny;
}>();

const model = defineModel<string>({ required: true });

const inputType = computed(() => {
    const meta = (props.field.getMeta() as z.ZodMeta) || undefined;
    if (meta && meta.type) {
        return meta.type as string;
    } else if (props.field._def.typeName === "ZodString") {
        if ((props.field as z.ZodString).isURL) {
            return "url";
        } else {
            return "text";
        }
    }
});

const label = computed(() => {
    return (props.field.getMeta() as z.ZodMeta).label as string || props.fieldKey;
});

const placeholder = computed(() => {
    return (props.field.getMeta() as z.ZodMeta).placeholder as string || undefined;
});
</script>

<template>
    <div class="form-input">
        <Field
            :name="props.fieldKey"
            v-model="model"
            v-slot="{ componentField, errors, meta }"
            validateOnInput
        >
            <Label :for="props.fieldKey">{{ label }}<span v-if="meta.required" class="text-destructive"> *</span></Label>
            <Input
                :type="inputType"
                :placeholder="placeholder"
                v-bind="componentField"
                :class="errors.length > 0 ? 'border-destructive' : ''"
            />
            <p v-if="props.field.description" :id="`${props.fieldKey}-desc`" class="text-sm text-muted-foreground">{{ props.field.description }}</p>
            <ErrorMessage :name="props.fieldKey" class="text-destructive" />
        </Field>
    </div>
</template>
