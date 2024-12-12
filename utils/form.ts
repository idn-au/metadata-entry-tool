import { register } from "zod-metadata";
import * as z from "zod";
import type { InputMeta } from "./types";

register(z);

export function schemaCreateEmptyObject(schema: z.AnyZodObject): any {
    return Object.entries(schema.shape).reduce((obj, [key, val]) => {
        obj[key] = structuredClone((val.getMeta() as InputMeta).initial);
        return obj;
    }, {});
}

export function removeEmptyValues(obj: { [key: string]: any }, schema: { [key: string]: z.AnyZodObject }): { [key: string]: any } {
    const newObj: { [key: string]: any } = {};
    Object.entries(obj).forEach(([key, value]) => {
        const field = getZodSchema(schema[key]);
        const meta = getZodSchemaMeta(schema[key]);
        if (meta) {
            if (meta.type === "group") {
                const subObj = removeEmptyValues(value, field.shape);
                if (Object.keys(subObj).length > 0) {
                    newObj[key] = subObj;
                }
            } else if (meta.type === "add") {
                const initialObj = meta.initial.length === 1 ? meta.initial[0] : {};
                const newShape = z.object({...field._def.type.shape}).meta<InputMeta>({
                    label: `temp-${meta.label}`,
                    type: "group",
                    initial: initialObj,
                });
                const valueArray = value.map(v => removeEmptyValues(v, newShape.shape)).filter(o => Object.keys(o).length > 0);
                if (valueArray.length > 0) {
                    newObj[key] = valueArray;
                }
            } else if ((JSON.stringify(value) !== JSON.stringify(meta.initial)) || meta.type === "hidden") {
                newObj[key] = value;
            }
        }
    });
    return newObj;
}

export function isFormFilled(obj: { [key: string]: any }, schema: { [key: string]: z.AnyZodObject }): boolean {
    let isFilled = true;
    Object.entries(obj).forEach(([key, value]) => {
        const field = getZodSchema(schema[key]);
        const meta = getZodSchemaMeta(schema[key]);
        if (meta) {
            if (meta.type === "group") {
                isFilled = isFormFilled(value, field.shape);
            } else if (meta.type === "add") {
                const initialObj = meta.initial.length === 1 ? meta.initial[0] : {};
                const newShape = z.object({...field._def.type.shape}).meta<InputMeta>({
                    label: `temp-${meta.label}`,
                    type: "group",
                    initial: initialObj,
                });
                isFilled = value.map(v => isFormFilled(v, newShape.shape)).every(x => x)
            } else if ((JSON.stringify(value) === JSON.stringify(meta.initial))) {
                isFilled = false;
            }
        }
    });
    return isFilled;
}

export async function sparqlSelect(url: string, query: string): Promise<any[]> {
    const r = await fetch(`${url}?query=${encodeURIComponent(query)}`);
    const json = await r.json();
    return json.results.bindings;
}

export async function sparqlOptions(url: string, query: string): Promise<Option[]> {
    const results = await sparqlSelect(url, query);
    const options: Option[] = results.map(result => {
        return {
            value: result.value.value,
            label: result.label.value
        };
    });
    options.sort((a, b) => a.label.localeCompare(b.label));
    return options;
}

/**
 * Unwraps a zod schema to get the inner definition
 * 
 * @param field 
 * @returns 
 */
export function getZodSchema(field: z.ZodTypeAny) {
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

/**
 * Gets the meta object for an input field
 * 
 * @param field 
 * @returns 
 */
export function getZodSchemaMeta(field: z.ZodTypeAny): InputMeta {
    return field.getMeta() as InputMeta;
}
