import { SPARQLResultsJSON } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const { fusekiURL, fusekiUsername, fusekiPassword } = useRuntimeConfig(event);
    const { query } = getQuery(event);
    const result = await $fetch<SPARQLResultsJSON>(`${fusekiURL}/agents/query`, {
        params: {
            query: query
        },
        headers: {
            "Accept": "application/sparql-results+json",
            "Authorization": `Basic ${btoa(`${fusekiUsername}:${fusekiPassword}`)}`,
        },
    })
    return result;
});
