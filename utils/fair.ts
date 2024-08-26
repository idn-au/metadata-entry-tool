
import type { Config } from "~/types";

const fairRules: Config = {
    f: {
        title: "Findable",
        description: "asdfdsfsdfdsf",
        scores: {
            f1: {
                title: "F1",
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
            f2: {
                title: "F2",
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

export default fairRules;