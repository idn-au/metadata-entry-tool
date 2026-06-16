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

export const navigation = [
    {
        "title": "NIDC",
        "path": "https://data.idnau.org",
        "stem": "2.nidc",
        "description": ""
    },
    {
        "title": "About",
        "path": "https://indigenousdatacommons.org/about",
        "stem": "3.about/1.index",
        "children": [
            {
                "title": "About",
                "path": "https://indigenousdatacommons.org/about",
                "stem": "3.about/1.index",
                "description": ""
            },
            {
                "title": "About the Indigenous Data Commons",
                "path": "https://indigenousdatacommons.org/about/about-the-commons",
                "stem": "3.about/2.about-the-commons",
                "description": "The Indigenous Data Commons establishes the ethical approach to governing Indigenous data in Australia. It is grounded in recognition of Aboriginal and Torres Strait Islander peoples’ rights, interests and authority in relation to data that concern them, and in the responsibilities that come with collecting, managing and using such data."
            },
            {
                "title": "FAQ",
                "path": "https://indigenousdatacommons.org/about/faq",
                "stem": "3.about/3.faq",
                "description": "Find answers to common questions about the Indigenous Data Commons, including how it works, who can participate, and how data is governed and accessed."
            }
        ],
        "description": ""
    },
    {
        "title": "Empowerment",
        "path": "https://indigenousdatacommons.org/empowerment",
        "stem": "4.empowerment/1.index",
        "children": [
            {
                "title": "Empowerment",
                "path": "https://indigenousdatacommons.org/empowerment",
                "stem": "4.empowerment/1.index",
                "description": ""
            },
            {
                "title": "Key Principles",
                "path": "https://indigenousdatacommons.org/empowerment/key-principles",
                "stem": "4.empowerment/2.key-principles",
                "description": "Understand the foundational principles guiding the Indigenous Data Network, including Indigenous Data Sovereignty and responsible data governance practices."
            },
            {
                "title": "Publications",
                "path": "https://indigenousdatacommons.org/empowerment/publications",
                "stem": "4.empowerment/3.publications",
                "description": "Access research papers, reports, and other publications related to Indigenous data governance, infrastructure development, and community-led data initiatives."
            },
            {
                "title": "Glossary",
                "path": "https://indigenousdatacommons.org/empowerment/glossary",
                "stem": "4.empowerment/4.glossary",
                "description": "Find definitions of key terms and concepts used across the Indigenous Data Network and broader Indigenous data governance landscape."
            },
            {
                "title": "How-to Guides",
                "path": "https://indigenousdatacommons.org/empowerment/how-to-guides",
                "stem": "4.empowerment/5.how-to-guides",
                "description": "Browse practical guides and step-by-step instructions to support metadata creation, catalogue use, and engagement with IDN tools and services."
            },
            {
                "title": "Case Studies",
                "path": "https://indigenousdatacommons.org/empowerment/case-studies",
                "stem": "4.empowerment/6.case-studies",
                "description": "Explore real-world examples of Indigenous data governance in action, showcasing successful initiatives, challenges overcome, and lessons learned from Indigenous-led data projects across Australia."
            },
            {
                "title": "Training and Courses",
                "path": "https://indigenousdatacommons.org/empowerment/training-and-courses",
                "stem": "4.empowerment/7.training-and-courses",
                "description": "Discover training opportunities, workshops, and online courses designed to build capacity in Indigenous data governance, stewardship, and ethical data management practices."
            },
            {
                "title": "Our Data Talks",
                "path": "https://indigenousdatacommons.org/empowerment/our-data-talks",
                "stem": "4.empowerment/8.our-data-talks",
                "description": "Listen to conversations with Indigenous data leaders, researchers, and community members about their experiences, insights, and perspectives on Indigenous data governance and the work of the Indigenous Data Network."
            },
            {
                "title": "Submissions",
                "path": "https://indigenousdatacommons.org/empowerment/submissions",
                "stem": "4.empowerment/9.submissions",
                "description": "Find out about the Indigenous Data Network's submissions to government inquiries, policy consultations, and other public processes related to Indigenous data governance and digital infrastructure."
            }
        ],
        "description": ""
    },
    {
        "title": "Tools",
        "path": "https://indigenousdatacommons.org/tools",
        "stem": "5.tools/1.index",
        "active": true,
        "children": [
            {
                "title": "Tools",
                "path": "https://indigenousdatacommons.org/tools",
                "stem": "5.tools/1.index",
                "description": ""
            },
            {
                "title": "IDN Catalogue Profile",
                "path": "https://data.idnau.org/pid/cp",
                "stem": "5.tools/2.idn-catalogue-profile",
                "description": "Learn about the structure and standards underpinning the IDN Catalogue Profile, including how records are organised, described, and made discoverable within the Indigenous Data Network."
            },
            {
                "title": "Agent Database",
                "path": "https://agentsdb.idnau.org",
                "stem": "5.tools/3.agent-database",
                "description": "Access and contribute to a directory of organisations, communities, and researchers involved in Indigenous data initiatives and collaborations."
            },
            {
                "title": "Metadata Entry Tool",
                "path": "https://metadata.idnau.org/",
                "stem": "5.tools/4.metadata-entry-tool",
                "active": true,
                "description": "Create metadata records to support the discoverability, governance, and reuse of Indigenous data in line with Indigenous Data Commons principles."
            },
            {
                "title": "Search portal",
                "path": "https://data.idnau.org/search",
                "stem": "5.tools/5.search-portal",
                "description": "Explore datasets and records spatially through an interactive map interface."
            }
        ],
        "description": ""
    },
    {
        "title": "News",
        "path": "https://indigenousdatacommons.org/news",
        "stem": "6.news/1.index",
        "children": [
            {
                "title": "News",
                "path": "https://indigenousdatacommons.org/news",
                "stem": "6.news/1.index",
                "description": ""
            },
            {
                "title": "IDC Newsletter",
                "path": "https://indigenousdatacommons.org/news/newsletter",
                "stem": "6.news/2.newsletter",
                "description": ""
            },
            {
                "title": "Events",
                "path": "https://indigenousdatacommons.org/news/events",
                "stem": "6.news/3.events",
                "description": "Stay tuned to our upcoming events"
            }
        ],
        "description": ""
    }
];
