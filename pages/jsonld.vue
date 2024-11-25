<script lang="ts" setup>
import * as jsonld from "jsonld";
import data from "~/data/metExampleJsonLD";

// const simpleInput = `<https://example.com/item> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/dcat#Resource> .
// <https://example.com/item> <http://purl.org/dc/terms/title> "title" .
// <https://example.com/item> <http://purl.org/dc/terms/license> <http://purl.org/NET/rdflicense/allrightsreserved> .
// <https://example.com/item> <http://purl.org/dc/terms/description> "description" .`;

// const fullInput = `<https://example.com/example1> <http://purl.org/dc/terms/temporal> _:n478654f20a054ce5b7b8c485f19f6d73b2 .
// <https://example.com/example1> <http://purl.org/dc/terms/spatial> _:n478654f20a054ce5b7b8c485f19f6d73b1 .
// <https://example.com/customagent> <http://purl.org/dc/terms/type> <https://data.idnau.org/pid/vocab/org-indigeneity/indigeneity-unknown> .
// _:n478654f20a054ce5b7b8c485f19f6d73b1 <http://www.opengis.net/ont/geosparql#asWKT> "POLYGON ((0 1 2 3 4))"^^<http://www.opengis.net/ont/geosparql#wktLiteral> .
// <https://example.com/example1> <http://purl.org/dc/terms/issued> "2024-08-12"^^<http://www.w3.org/2001/XMLSchema#date> .
// _:n478654f20a054ce5b7b8c485f19f6d73b2 <http://www.w3.org/ns/prov#startedAtTime> "2023"^^<http://www.w3.org/2001/XMLSchema#gYear> .
// _:n478654f20a054ce5b7b8c485f19f6d73b4 <http://www.w3.org/ns/dcat#hadRole> <https://linked.data.gov.au/def/data-roles/custodian> .
// _:n478654f20a054ce5b7b8c485f19f6d73b2 <http://www.w3.org/ns/prov#endedAtTime> "2024-07"^^<http://www.w3.org/2001/XMLSchema#monthYear> .
// <https://example.com/example1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/dcat#Resource> .
// <https://example.com/example1> <http://www.w3.org/ns/dcat#distribution> _:n478654f20a054ce5b7b8c485f19f6d73b3 .
// <https://example.com/example1> <http://purl.org/dc/terms/created> "2024-08-12"^^<http://www.w3.org/2001/XMLSchema#date> .
// <https://example.com/example1> <http://purl.org/dc/terms/license> <http://purl.org/NET/rdflicense/allrightsreserved> .
// <https://example.com/example1> <http://purl.org/dc/terms/description> "This is a description for example 1" .
// <https://example.com/example1> <http://www.w3.org/ns/dcat#theme> <https://vocabularyserver.com/apais/xml.php?skosTema=181> .
// _:n478654f20a054ce5b7b8c485f19f6d73b3 <http://www.w3.org/ns/dcat#accessURL> "https://example.com/distribution"^^<http://www.w3.org/2001/XMLSchema#anyURI> .
// <https://example.com/example1> <http://purl.org/dc/terms/accessRights> <https://linked.data.gov.au/def/data-access-rights/open> .
// <https://example.com/example1> <http://www.w3.org/ns/prov#qualifiedAttribution> _:n478654f20a054ce5b7b8c485f19f6d73b4 .
// <https://example.com/example1> <http://purl.org/dc/terms/rights> "rights" .
// <https://example.com/example1> <http://purl.org/dc/terms/modified> "2024-08-12"^^<http://www.w3.org/2001/XMLSchema#date> .
// _:n478654f20a054ce5b7b8c485f19f6d73b4 <http://www.w3.org/ns/prov#agent> <https://example.com/customagent> .
// <https://example.com/customagent> <https://schema.org/description> "Custom agent description" .
// <https://example.com/customagent> <https://schema.org/name> "Custom Agent" .
// <https://example.com/customagent> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://schema.org/Person> .
// <https://example.com/customagent> <https://schema.org/identifier> "id1"^^<http://www.w3.org/2001/XMLSchema#token> .
// <https://example.com/example1> <http://purl.org/dc/terms/title> "Example 1" .
// _:n478654f20a054ce5b7b8c485f19f6d73b1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.opengis.net/ont/geosparql#Geometry> .
// `;

// const input = await jsonld.fromRDF(fullInput); // nquads only

const frame = {
    "@context": {
        "@version": 1.1,
        // prefixes
        "dcat": "http://www.w3.org/ns/dcat#",
        "dcterms": "http://purl.org/dc/terms/",
        "geo": "http://www.opengis.net/ont/geosparql#",
        "prov": "http://www.w3.org/ns/prov#",
        "sdo": "https://schema.org/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        // props
        "license": {
            "@id": "dcterms:license",
            "@type": "@id"
        },
        "title": "dcterms:title",
        "description": "dcterms:description",
        "iri": "@id",
        "type": "@type",
        "value": "@value",
        "accessRights": {
            "@id": "dcterms:accessRights",
            "@type": "@id"
        },
        "created": {
            "@id": "dcterms:created",
        },
        "issued": {
            "@id": "dcterms:issued",
        },
        "modified": {
            "@id": "dcterms:modified",
        },
        "rights": "dcterms:rights",
        "theme": {
            "@id": "dcat:theme",
            "@type": "@id",
            "@container": "@set",
        },
        "agentRole": {
            "@id": "prov:qualifiedAttribution",
            "@container": "@set"
        },
        "role": {
            "@id": "dcat:hadRole",
            "@type": "@id"
        },
        "agent": {
            "@id": "prov:agent",
            "@type": "@id"
        },
        "indigeneity": {
            "@id": "dcterms:type",
            "@type": "@id"
        },
        "identifier": {
            "@id": "sdo:identifier",
        },
        "name": "sdo:name",
        "sdoDescription": "sdo:description",
        "spatial": {
            "@id": "dcterms:spatial",
            "@type": "@id",
        },
        "temporal": "dcterms:temporal",
        "distribution": {
            "@id": "dcat:distribution",
        },
        "accessURL": {
            "@id": "dcat:accessURL",
            "@type": "xsd:anyURI",
        },
        "startedAtTime": "prov:startedAtTime",
        "endedAtTime": "prov:endedAtTime",
        "additionalType": {
            "@id": "sdo:additionalType",
            "@type": "@id"
        },
        "wasInfluencedBy": {
            "@id": "prov:wasInfluencedBy",
            "@container": "@set"
        },
        "contributed": {
            "@id": "prov:contributed",
            "@type": "@id"
        },
        "url": {
            "@id": "sdo:url",
            "@type": "xsd:anyURI",
        },
    },
    // frame
    "@type": "dcat:Resource",
};

const framed = await jsonld.frame(data, frame);

delete framed["@context"];

// const schema = z.object({
//     iri: z.string().min(1, "IRI is required").url({ message: "Must be a valid IRI" }).describe("a description").meta({
//         label: "IRI",
//         type: "url",
//         placeholder: "https://example.com",
//     })
// });

// const data = ref<z.infer<typeof schema>>({
//     iri: ""
// });
</script>

<template>
    <div class="jsonld">
        <div class="input">
            <div class="frame">
                <h3>Frame</h3>
                <pre>{{ JSON.stringify(frame, null, 4) }}</pre>
            </div>
            <div class="data">
                <h3>Input</h3>
                <pre>{{ JSON.stringify(data, null, 4) }}</pre>
            </div>
        </div>
        <div class="output">
            <h3>Framed JSON-LD</h3>
            <pre>{{ JSON.stringify(framed, null, 4) }}</pre>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.jsonld {
    display: flex;
    flex-direction: row;
    gap: 20px;

    & > div {
        flex: 1;
    }

    .input {
        display: flex;
        flex-direction: column;

        & > div {
            flex: 1;
        }
    }

    h3 {
        font-size: 1.2em;
        font-weight: bold;
    }

    pre {
        white-space: pre-wrap;
    }
}
</style>