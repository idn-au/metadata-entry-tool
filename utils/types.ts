export type Format = "text/turtle"
    | "ttl"
    // | "turtle"
    | "application/trig"
    | "trig"
    | "application/n-triples"
    // | "n-triples"
    // | "ntriples"
    | "nt"
    | "application/n-quads"
    // | "n-quads"
    // | "nquads"
    | "nq"
    | "text/n3"
    | "n3"
    | "application/rdf+xml"
    | "rdf"
// | "xml";

export type ConceptOption = {
    value: string;
    label?: string;
    desc?: string;
};

export type Example = {
    label: string;
    data: string;
    format: Format;
};

export type SPARQLResultsJSON = {
    head: {
        vars?: string[];
        link?: string[];
    },
    results?: {
        bindings: Record<string, {
            type: "uri" | "literal" | "bnode";
            value: string;
            "xml:lang"?: string;
            datatype?: string;
        }>[];
    },
    boolean?: boolean;
};
