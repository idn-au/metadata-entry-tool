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

export type Requirement = {
    value: number;
    description: string;
    query: string; // must be an ASK query
};

export type RequirementScored = Omit<Requirement, "query"> & {
    enabled: boolean;
};

export type Prerequisites = {
    key: string[]; // array of keys to traverse to score fully
    description: string;
};

export type PrerequisitesScored = Prerequisites & {
    enabled: boolean;
};

export type Config = {
    [key: string]: {
        title: string;
        description: string;
        scores?: Config;
        prerequisites?: Prerequisites;
        requirements?: Requirement[];
    };
};

export type ConfigScored = Config & {
    value: number;
    max: number;
    scores?: ConfigScored;
    prerequisites?: PrerequisitesScored;
    requirements?: RequirementScored[];
};
