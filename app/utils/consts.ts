import { type ContextDefinition } from "jsonld";

export const CONTEXT: ContextDefinition = {
    // "@version": "1.1",
    // prefixes
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcterms": "http://purl.org/dc/terms/",
    "geo": "http://www.opengis.net/ont/geosparql#",
    "odrl": "http://www.w3.org/ns/odrl/2/",
    "prov": "http://www.w3.org/ns/prov#",
    "sdo": "https://schema.org/",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    // alias JSON-LD stuff
    "iri": "@id",
    "type": "@type",
    "value": "@value",
    // properties
    "license": {
        "@id": "dcterms:license",
        "@type": "@id"
    },
    "title": "dcterms:title",
    "description": "dcterms:description",
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
        "@type": "@id",
        "@container": "@set",
    },
    "relationRole": {
        "@id": "dcat:hadRole",
        "@type": "@id",
    },
    "agent": {
        "@id": "sdo:agent",
        "@type": "@id"
    },
    "dataIndigeneity": {
        "@id": "dcterms:type",
        "@type": "@id",
        "@container": "@set",
    },
    "agentIndigeneity": {
        "@id": "dcterms:type",
        "@type": "@id",
    },
    "identifier": {
        "@id": "sdo:identifier",
        "@container": "@set",
    },
    "name": "sdo:name",
    "sdoDescription": "sdo:description",
    "relation": {
        "@id": "dcat:qualifiedRelation",
        "@container": "@set"
    },
    "spatial": {
        "@id": "dcterms:spatial",
        "@type": "@id"
    },
    "temporal": "dcterms:temporal",
    "distribution": {
        "@id": "dcat:distribution",
        "@container": "@set",
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
    "asWKT": "geo:asWKT",
    "asGeoJSON": "geo:asGeoJSON",
    "hasPolicy": {
        "@id": "odrl:hasPolicy",
        "@type": "@id",
        "@container": "@set",
    },
    "duty": {
        "@id": "odrl:duty",
        "@type": "@id",
    },
    "contact": "prov:qualifiedAttribution", // extra alias for agentRole to avoid form conflicts
    "email": {
        "@id": "sdo:email",
        "@type": "xsd:anyURI",
    },
    "telephone": "sdo:telephone",
    "language": {
        "@id": "dcterms:language",
        "@type": "@id",
    },
};