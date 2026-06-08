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
        "@id": "sdo:license",
        "@type": "@id"
    },
    "title": "sdo:name",
    "description": "sdo:description",
    "accessRights": {
        "@id": "sdo:usageInfo",
        "@type": "@id"
    },
    "created": {
        "@id": "sdo:dateCreated",
    },
    "issued": {
        "@id": "sdo:dateIssued",
    },
    "modified": {
        "@id": "sdo:dateModified",
    },
    "rights": "sdo:copyrightNotice",
    "theme": {
        "@id": "sdo:keywords",
        "@type": "@id",
        "@container": "@set",
    },
    "agentRole": {
        "@id": "prov:qualifiedAttribution",
        "@container": "@set"
    },
    "role": {
        "@id": "prov:hadRole",
        "@type": "@id",
        "@container": "@set",
    },
    "relationRole": {
        "@id": "prov:hadRole",
        "@type": "@id",
    },
    "agent": {
        "@id": "sdo:agent",
        "@type": "@id"
    },
    "dataIndigeneity": {
        "@id": "sdo:keywords",
        "@type": "@id",
        "@container": "@set",
    },
    "agentIndigeneity": {
        "@id": "sdo:keywords",
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
        "@id": "sdo:spatialCoverage",
        "@type": "@id"
    },
    "temporal": "sdo:temporalCoverage",
    "distribution": {
        "@id": "sdo:distribution",
        "@container": "@set",
    },
    "accessURL": {
        "@id": "sdo:contentUrl",
        "@type": "xsd:anyURI",
    },
    "startedAtTime": "sdo:coverageStartTime",
    "endedAtTime": "sdo:coverageEndTime",
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
        "@id": "sdo:inLanguage",
        "@type": "@id",
    },
};