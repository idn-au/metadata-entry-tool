import * as oxigraph from "oxigraph/web";
import type { Config, ConfigScored, Format, RequirementScored } from "~/types";
import fairRules from "./fair";
import careRules from "./care";

const PREFIXES = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX sdo: <https://schema.org/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

function doScoring(data: string, config: Config, iri: string, format: Format = "text/turtle", output: "json" | "turtle" = "json"): ConfigScored {
    const store = new oxigraph.Store();
    store.load(data, { format: "text/turtle" });

    return score(config, store, iri);
}

function score(config: Config, store: oxigraph.Store, iri: string): ConfigScored {
    const s = {} as ConfigScored;

    Object.entries(config).forEach(([key, c]) => {
        const scored = {
            title: c.title,
            description: c.description,
            value: 0,
            max: 0,
        };

        if (c.scores) {
            scored.scores = score(c.scores, store, iri);
            scored.value = Object.values(scored.scores).reduce((acc, curr) => acc + curr.value, 0);
            scored.max = Object.values(scored.scores).reduce((acc, curr) => acc + curr.max, 0);
        } else if (c.requirements) {
            scored.requirements = c.requirements.map(r => {
                scored.max += r.value;
                const req: RequirementScored = {
                    value: r.value,
                    description: r.description,
                    enabled: false,
                };
                const result = store.query(PREFIXES + "\n" + r.query.replace("#iri#", `<${iri}>`)) as boolean;
                req.enabled = result;
                if (result) {
                    scored.value += r.value;
                }

                return req;
            });
        }

        // TODO: implement prerequisites

        s[key] = scored;
    });

    return s;
}

export function fairScore(data: string, iri: string, format: Format = "text/turtle"): ConfigScored {
    return doScoring(data, fairRules, iri);
}

export function careScore(data: string, iri: string, format: Format = "text/turtle"): ConfigScored {
    return doScoring(data, careRules, iri);
}
