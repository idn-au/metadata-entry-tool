import { register } from "zod-metadata";
import * as z from "zod";
import type { Option } from "~/types";


register(z);

export function schemaCreateEmptyObject(schema: z.AnyZodObject): any {
    return Object.entries(schema.shape).reduce((obj, [key, val]) => {
        obj[key] = structuredClone(val.getMeta().initial);
        return obj;
    }, {});
}

export function removeEmptyValues(obj: any, initialValues: any): any {
    return Object.entries(obj).reduce((a, [k, v]) => (JSON.stringify(v) === JSON.stringify(initialValues[k]) ? a : (a[k] = v, a)), {}); // TODO: check for equal to initial value
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
