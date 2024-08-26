import * as z from "zod";

function schemaToObj(schema: z.AnyZodObject) {
    return schema.parse({});
}

export function useSchema(schema: z.AnyZodObject) {
    const data = ref<z.infer<typeof schema>>(schemaToObj(schema));

    return data;
}