import * as z from "zod";
import { getZodSchema, formField, type Option } from "@vulptech/vt-form";

export function removeEmptyValues(obj: { [key: string]: any }, schema: { [key: string]: z.AnyZodObject }): { [key: string]: any } {
    const newObj: { [key: string]: any } = {};
    Object.entries(obj).forEach(([key, value]) => {
        const field = getZodSchema(schema[key]);
        const meta = schema[key].metadata;
        if (meta) {
            if (meta.type === "group") {
                const subObj = removeEmptyValues(value, field.shape);
                if (Object.keys(subObj).length > 0) {
                    newObj[key] = subObj;
                }
            } else if (meta.type === "add") {
                const initialObj = meta.initial.length === 1 ? meta.initial[0] : {};
                const newShape = formField(z.object({...field._def.type.shape}), {
                    label: `temp-${meta.label}`,
                    type: "group",
                    initial: initialObj,
                });
                const valueArray = value.map(v => removeEmptyValues(v, newShape.unwrap().shape)).filter(o => Object.keys(o).length > 0);
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
