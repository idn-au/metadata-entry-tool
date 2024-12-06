import { register } from "zod-metadata";
import * as z from "zod";

register(z);

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

export type DagItem = {
    depends: string[];
    completed: boolean;
};

export type Dag = {
    [key: string]: DagItem;
};

export type Condition = {
    title: string;
    key: string;
    value: number | "max";
};

export type Requirement = {
    value: number;
    description: string;
    query?: string;
    conditions?: Condition[];
};

export type RequirementScored = Omit<Requirement, "query" | "conditions"> & {
    enabled: boolean;
};

export type Prerequisite = {
    conditions: Condition[];
};

export type PrerequisiteScored = Prerequisite & {
    enabled: boolean;
};

export type ScoreDef = {
    title: string;
    description: string;
    prerequisites?: Prerequisite;
    scores?: ScoreDefObj;
    requirements?: Requirement[];
};

export type ScoreValue = Omit<ScoreDef, "scores" | "prerequisites" | "requirements"> & {
    value: number;
    max: number;
    scores?: ScoreValueObj;
    prerequisites?: PrerequisiteScored;
    requirements?: RequirementScored[];
};

export type ScoreDefObj = {
    [key: string]: ScoreDef;
};

export type ScoreValueObj = {
    [key: string]: ScoreValue;
};

export const optionSchema = z.object({
    label: z.string().min(1),
    value: z.string().min(1),
});
export interface Option extends z.infer<typeof optionSchema> { };
export const inputMetaSchema = z.object({
    type: z.string(),
    label: z.string().optional(),
    placeholder: z.string().optional(),
    options: z.union([optionSchema.array(), z.null()]).optional(),
    query: z.function().args(z.string()).returns(z.any()).optional(),
    initial: z.any().optional(),
    required: z.boolean().optional(),
    style: z.string().optional(),
    class: z.string().optional(),
    tooltip: z.string().optional(),
});
export interface InputMeta extends z.infer<typeof inputMetaSchema> { };
export const sectionMetaSchema = z.object({
    class: z.string().optional(),
    style: z.string().optional(),
});
export interface SectionMeta extends z.infer<typeof sectionMetaSchema> { };

