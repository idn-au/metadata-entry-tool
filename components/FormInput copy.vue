<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import type { Option } from "~/types";

register(z);

const props = defineProps<{
    fieldKey: string;
    field: z.ZodTypeAny;
}>();

const model = defineModel<z.infer<typeof props.field>>({ required: true });

const fieldMeta = computed(() => props.field.getMeta() as z.ZodMeta);

const fieldDef = computed(() => props.field.isOptional() ? props.field._def.innerType._def : props.field._def); // unwrap optionals

const inputType = computed(() => {
    if (fieldMeta.value && fieldMeta.value.type) {
        return fieldMeta.value.type as string;
    }

    switch (fieldDef.value.typeName) {
        case "ZodString":
            if ((props.field as z.ZodString).isURL) {
                return "url";
            } else {
                return "text";
            }
        case "ZodArray":
            if (fieldDef.value.type._def.typeName === "ZodString") {
                return "select";
            } else if (fieldDef.value.type._def.typeName === "ZodObject") {
                return "add";
            }
        default:
            return "text";
    }
});

const inputComponent = computed(() => {
    switch (inputType.value) {
        case "text":
        case "url":
            return resolveComponent("Input");
        case "textarea":
            return resolveComponent("Textarea");
        case "select":
            return resolveComponent("ComboSelect");
        case "add":
            return resolveComponent("FormInputList");
        default:
            return resolveComponent("Input");
    }
});

const label = computed(() => {
    return fieldMeta.value.label as string || props.fieldKey;
});

const placeholder = computed(() => {
    return fieldMeta.value.placeholder as string || undefined;
});

const options = computed(() => {
    return fieldMeta.value.options as Option[] || undefined;
});

const multiple = computed(() => {
    if (fieldDef.value.typeName === "ZodArray") {
        if (fieldDef.value.type._def.typeName === "ZodString") {
            return true;
        }
    }
    return false;
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
            <component :is="inputComponent"
                :type="inputType"
                :placeholder="placeholder"
                v-bind="componentField"
                :class="errors.length > 0 ? 'border-destructive' : ''"
                :options="options"
                :multiple="multiple"
                :fieldKey="props.fieldKey"
                :field="props.field"
            />
            <p v-if="props.field.description" :id="`${props.fieldKey}-desc`" class="text-sm text-muted-foreground">{{ props.field.description }}</p>
            <ErrorMessage :name="props.fieldKey" class="text-destructive" />
        </Field>
    </div>
</template>
