
import type { Config } from "~/types";

const careRules: Config = {
    c: {
        title: "Collective Benefit",
        description: "asdfdsfsdfdsf",
        scores: {
            c1: {
                title: "C1",
                description: "sdfsdfgdsg",
                requirements: [
                    {
                        value: 1,
                        description: "Has a title",
                        query: "ASK { #iri# dcterms:title ?title }",
                    },
                    {
                        value: 1,
                        description: "Has a description",
                        query: "ASK { #iri# dcterms:description ?description }",
                    },
                ],
            },
            c2: {
                title: "C2",
                description: "sdfsdfgdsg",
                requirements: [
                    {
                        value: 1,
                        description: "Has a license",
                        query: "ASK { #iri# dcterms:license ?license }",
                    },
                ],
            },
        },
    },
};

export default careRules;