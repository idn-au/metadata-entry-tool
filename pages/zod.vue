<script lang="ts" setup>
import { register } from "zod-metadata";
import * as z from "zod";

register(z);

function getField(field: z.ZodTypeAny) {
    let schema = field;
    // optional
    if (schema._def.typeName === "ZodOptional") {
        schema = schema._def.innerType;
    }

    // refine
    if (schema._def.typeName === "ZodEffects") {
        schema = schema._def.schema;
    }

    return schema;
}

const schema = z.object({
    string: z.string().meta({
        label: "string label"
    }),
    stringRefine: z.string().refine((val) => {
        if (typeof val !== "string") {
            return false;
        }
        return true;
    }, { message: "Invalid string" }).meta({
        label: "stringRefine label"
    }),
    stringOptional: z.string().optional().meta({
        label: "stringOptional label"
    }),
    stringRefineOptional: z.string().refine((val) => {
        if (typeof val !== "string") {
            return false;
        }
        return true;
    }, { message: "Invalid string" }).optional().meta({
        label: "stringRefineOptional label"
    }),
    stringArray: z.string().array().meta({
        label: "stringArray label"
    }),
    stringRefineArray: z.string().refine((val) => {
        if (typeof val !== "string") {
            return false;
        }
        return true;
    }, { message: "Invalid string" }).array().meta({
        label: "stringRefineArray label"
    }),
    stringArrayOptional: z.string().array().optional().meta({
        label: "stringArrayOptional label"
    }),
    stringRefineArrayOptional: z.string().refine((val) => {
        if (typeof val !== "string") {
            return false;
        }
        return true;
    }, { message: "Invalid string" }).array().optional().meta({
        label: "stringRefineArrayOptional label"
    }),
    object: z.object({
        key1: z.string(),
        key2: z.string(),
    }).meta({
        label: "object label"
    }),
    objectOptional: z.object({
        key1: z.string(),
        key2: z.string(),
    }).optional().meta({
        label: "objectOptional label"
    }),
});
</script>

<template>
    <div>
        <!-- <div>
            <h2>Top-level schema</h2>
            <pre>{{ schema }}</pre>
        </div> -->
        <div>
            <h2 class="text-2xl font-bold">Top-level schema.shape</h2>
            <pre>{{ schema.shape }}</pre>
            <div>
                <h2 class="text-2xl font-bold">Fields</h2>
                <pre v-for="field in schema.shape">{{ getField(field) }}</pre>
            </div>
            <div>
                <h2 class="text-2xl font-bold">Shapes</h2>
                <pre v-for="field in schema.shape">{{ getField(field).shape }}</pre>
            </div>
        </div>
    </div>
</template>
