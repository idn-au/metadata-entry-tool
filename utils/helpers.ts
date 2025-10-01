import { v4 as uuidv4 } from "uuid";
import { type Option } from "@vulptech/vt-form";
import type { SPARQLResultsJSON } from "./types";

export async function sparqlSelect(query: string): Promise<NonNullable<SPARQLResultsJSON["results"]>["bindings"]> {
    const runtimeConfig = useRuntimeConfig();
    const r = await $fetch<SPARQLResultsJSON>(`${runtimeConfig.public.apiURL}/sparql`, {
        params: {
            query: query
        }
    });
    return r.results?.bindings || [];
}

export async function sparqlOptions(vocabIRI: string): Promise<ConceptOption[]> {
    const results = await sparqlSelect(`
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?value ?label ?desc
        WHERE {
            BIND(<${vocabIRI}> AS ?cs)
            ?cs a skos:ConceptScheme .
            ?value a skos:Concept ;
                skos:inScheme ?cs ;
                skos:prefLabel ?label ;
                skos:definition ?desc .
        }`);
    const options: ConceptOption[] = results.map(result => {
        return {
            value: result.value.value,
            label: result.label.value,
            desc: result.desc.value,
        };
    });
    options.sort((a, b) => a.label.localeCompare(b.label));
    return options;
}

export async function agentSearch(term: string): Promise<Option[]> {
    const r = await sparqlSelect(`PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX sdo: <https://schema.org/>
        SELECT DISTINCT ?iri ?name
        WHERE {
            GRAPH <https://data.idnau.org/pid/agentsdb> {
                VALUES ?type { sdo:Person sdo:Organization }
                ?iri a ?type ;
                    sdo:name ?name .
                FILTER regex(?name, "${term}", "i")
            }
        } LIMIT 20`);
    return r.map(x => {
        return {
            value: x.iri.value,
            label: x.name.value,
        }
    });
}

export async function agentGet(iri: string) {
    const query = `PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX sdo: <https://schema.org/>
        SELECT DISTINCT ?iri ?name ?type ?url ?desc ?indigeneity ?identifier
        WHERE {
            GRAPH <https://data.idnau.org/pid/agentsdb> {
                VALUES ?type { sdo:Person sdo:Organization }
                BIND (<${iri}> AS ?iri)
                ?iri a ?type ;
                    sdo:name ?name .
                OPTIONAL {
                    ?iri sdo:url ?url .
                }
                OPTIONAL {
                    ?iri sdo:description ?desc .
                }
                OPTIONAL {
                    ?iri dcterms:type ?indigeneity .
                }
                OPTIONAL {
                    ?iri sdo:identifier ?identifier .
                }
            }
        } LIMIT 1`;
    const r = await $fetch(`/api/agent?query=${encodeURIComponent(query)}`);
    return r.results?.bindings.map(x => {
        return {
            iri: x.iri.value,
            name: x.name.value,
            type: x.type.value,
            url: x.url?.value,
            sdoDescription: x.desc?.value,
            agentIndigeneity: x.indigeneity?.value,
            identifier: x.identifier?.value,
        }
    })[0] || null;
}

export function generateIRI(suffix: string): string {
    return `https://data.idnau.org/pid/${suffix}/${uuidv4()}`;
}

export function generateAgentIRI(isPerson: boolean): string {
    if (isPerson) {
        return generateIRI("person");
    } else {
        return generateIRI("organization");
    }
}
