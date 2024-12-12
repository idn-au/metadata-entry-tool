<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";
import { CircleHelp } from "lucide-vue-next";

register(z);

const props = defineProps<{
    fieldKey: string;
    field: z.ZodTypeAny;
}>();

const model = defineModel<z.infer<typeof props.field>>({ required: true });
const { value, errorMessage, meta, validate, resetField } = useField(props.fieldKey, toTypedSchema(props.field), { syncVModel: true });

const fieldDef = getZodSchema(props.field)._def;

const fieldMeta: InputMeta = props.field.getMeta() as InputMeta;

const inputType = computed(() => {
    if (fieldMeta && fieldMeta.type) {
        return fieldMeta.type;
    }

    switch (fieldDef.typeName) {
        case "ZodString":
            if ((props.field as z.ZodString).isURL) {
                return "url";
            } else {
                return "text";
            }
        case "ZodArray":
            if (fieldDef.type._def.typeName === "ZodString") {
                return "select";
            } else if (fieldDef.type._def.typeName === "ZodObject") {
                return "add";
            }
        // case "ZodEffects": // custom schema
        case "ZodObject":
            return "group";
        default:
            return "text";
    }
});

const inputComponent = computed(() => {
    switch (inputType.value) {
        case "text":
        case "url":
        case "tel":
        case "email":
            return resolveComponent("CustomInput");
        case "textarea":
            return resolveComponent("Textarea");
        case "checkbox":
            return resolveComponent("Checkbox")
        case "switch":
            return resolveComponent("Switch")
        case "select":
            return resolveComponent("ComboSelect");
        case "add":
            return resolveComponent("FormInputList");
        case "search":
            return resolveComponent("SearchInput");
        case "agent":
            return resolveComponent("AgentInput");
        case "customDate":
            return resolveComponent("DateInput");
        case "group":
            return resolveComponent("FormInputGroup");
        case "spatial":
            return resolveComponent("SpatialInput");
        default:
            return resolveComponent("CustomInput");
    }
});

const multiple = computed(() => {
    if (fieldDef.typeName === "ZodArray") {
        if (fieldDef.type._def.typeName === "ZodString") {
            return true;
        }
    }
    return false;
});
</script>

<template>
    <div v-if="fieldMeta.type !== 'hidden'" class="form-input flex flex-col gap-1">
        <div :class="`flex gap-1 ${['checkbox', 'switch', 'radio'].includes(fieldMeta.type) ? 'flex-row-reverse items-center justify-end' : 'flex-col'}`">
            <div class="flex flex-row gap-1 items-center">
                <Label v-if="fieldMeta.label" :for="props.fieldKey">{{ fieldMeta.label }}<span v-if="meta.required" class="text-destructive"> *</span></Label>
                <CustomTooltip v-if="fieldMeta.tooltip">
                    <template #trigger><CircleHelp class="size-4" /></template>
                    {{ fieldMeta.tooltip }}
                </CustomTooltip>
            </div>
            <component :is="inputComponent"
                :id="props.fieldKey"
                :type="['text', 'url', 'tel', 'email'].includes(inputType) ? inputType : undefined"
                :placeholder="fieldMeta.placeholder"
                v-model="value"
                :class="errorMessage ? 'border-destructive' : ''"
                :options="fieldMeta.options"
                :multiple="multiple"
                :fieldKey="['add', 'group'].includes(inputType) ? props.fieldKey : undefined"
                :field="['add', 'group'].includes(inputType) ? props.field : undefined"
                :listQuery="fieldMeta.listQuery || undefined"
                :getQuery="fieldMeta.getQuery || undefined"
                :resultLabel="fieldMeta.resultLabel"
                :checked="value === fieldMeta.trueValue"
                @update:checked="checked => value = checked ? fieldMeta.trueValue : fieldMeta.falseValue"
                @blur="validate"
                @clear="resetField({ value: fieldMeta.initial })"
            />
            <Label v-if="fieldMeta.type === 'switch' && fieldMeta.falseLabel">{{ fieldMeta.falseLabel }}</Label>
        </div>
        <p v-if="props.field.description" :id="`${props.fieldKey}-desc`" class="text-sm text-muted-foreground">{{ props.field.description }}</p>
        <div v-if="errorMessage" :name="props.fieldKey" class="text-destructive">{{ errorMessage }}</div>
    </div>
</template>
