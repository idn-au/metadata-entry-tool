export default [
    {
        "@id": "https://example.com/contactagent",
        "@type": [
            "https://schema.org/Person"
        ],
        "http://purl.org/dc/terms/type": [
            {
                "@id": "https://data.idnau.org/pid/vocab/org-indigeneity/indigeneity-unknown"
            }
        ],
        "https://schema.org/description": [
            {
                "@value": "Contact agent description"
            }
        ],
        "https://schema.org/identifier": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#token",
                "@value": "id2"
            }
        ],
        "https://schema.org/name": [
            {
                "@value": "Contact Agent"
            }
        ]
    },
    {
        "@id": "https://example.com/custodianagent",
        "@type": [
            "https://schema.org/Organization"
        ],
        "http://purl.org/dc/terms/type": [
            {
                "@id": "https://data.idnau.org/pid/vocab/org-indigeneity/indigenous-persons-organisation"
            }
        ],
        "http://www.w3.org/ns/prov#contributed": [
            {
                "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b6"
            }
        ],
        "https://schema.org/description": [
            {
                "@value": "Custodian agent description"
            }
        ],
        "https://schema.org/identifier": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#token",
                "@value": "id1"
            }
        ],
        "https://schema.org/name": [
            {
                "@value": "Custodian Agent"
            }
        ]
    },
    {
        "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b6",
        "@type": [
            "https://schema.org/DigitalDocument"
        ],
        "https://schema.org/additionalType": [
            {
                "@id": "https://data.idnau.org/pid/vocab/policy-types/indigenous-data-governance"
            }
        ],
        "https://schema.org/url": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#anyURI",
                "@value": "https://example.com/idg-framework"
            }
        ]
    },
    {
        "@id": "https://example.com/example1",
        "@type": [
            "http://www.w3.org/ns/dcat#Resource"
        ],
        "http://purl.org/dc/terms/accessRights": [
            {
                "@id": "https://linked.data.gov.au/def/data-access-rights/open"
            }
        ],
        "http://purl.org/dc/terms/created": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#date",
                "@value": "2024-08-12"
            }
        ],
        "http://purl.org/dc/terms/description": [
            {
                "@value": "This is a description for example 1"
            }
        ],
        "http://purl.org/dc/terms/issued": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#date",
                "@value": "2024-08-12"
            }
        ],
        "http://purl.org/dc/terms/license": [
            {
                "@id": "http://purl.org/NET/rdflicense/allrightsreserved"
            }
        ],
        "http://purl.org/dc/terms/modified": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#date",
                "@value": "2024-08-12"
            }
        ],
        "http://purl.org/dc/terms/rights": [
            {
                "@value": "rights"
            }
        ],
        "http://purl.org/dc/terms/spatial": [
            {
                "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b1"
            }
        ],
        "http://purl.org/dc/terms/temporal": [
            {
                "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b2"
            }
        ],
        "http://purl.org/dc/terms/title": [
            {
                "@value": "Example 1"
            }
        ],
        "http://purl.org/dc/terms/type": [
            {
                "@id": "https://data.idnau.org/pid/vocab/indigeneity/by-indigenous-people"
            }
        ],
        "http://www.w3.org/ns/dcat#distribution": [
            {
                "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b3"
            }
        ],
        "http://www.w3.org/ns/dcat#theme": [
            {
                "@id": "https://vocabularyserver.com/apais/xml.php?skosTema=181"
            },
            {
                "@id": "https://vocabularyserver.com/apais/xml.php?skosTema=147"
            }
        ],
        "http://www.w3.org/ns/prov#qualifiedAttribution": [
            {
                "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b4"
            },
            {
                "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b5"
            }
        ],
        "http://www.w3.org/ns/prov#wasInfluencedBy": [
            {
                "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b6"
            },
            {
                "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b7"
            }
        ]
    },
    {
        "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b1",
        "@type": [
            "http://www.opengis.net/ont/geosparql#Geometry"
        ],
        "http://www.opengis.net/ont/geosparql#asWKT": [
            {
                "@type": "http://www.opengis.net/ont/geosparql#wktLiteral",
                "@value": "POLYGON ((0 1 2 3 4))"
            }
        ]
    },
    {
        "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b2",
        "http://www.w3.org/ns/prov#endedAtTime": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#monthYear",
                "@value": "2024-07"
            }
        ],
        "http://www.w3.org/ns/prov#startedAtTime": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#gYear",
                "@value": "2023"
            }
        ]
    },
    {
        "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b3",
        "http://www.w3.org/ns/dcat#accessURL": [
            {
                "@type": "http://www.w3.org/2001/XMLSchema#anyURI",
                "@value": "https://example.com/distribution"
            }
        ]
    },
    {
        "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b4",
        "http://www.w3.org/ns/dcat#hadRole": [
            {
                "@id": "https://linked.data.gov.au/def/data-roles/custodian"
            }
        ],
        "http://www.w3.org/ns/prov#agent": [
            {
                "@id": "https://example.com/custodianagent"
            }
        ]
    },
    {
        "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b5",
        "http://www.w3.org/ns/dcat#hadRole": [
            {
                "@id": "https://linked.data.gov.au/def/data-roles/pointOfContact"
            }
        ],
        "http://www.w3.org/ns/prov#agent": [
            {
                "@id": "https://example.com/contactagent"
            }
        ]
    },
    {
        "@id": "_:nf6e67658a62b40ddb02e0349d35340b0b7",
        "@type": [
            "https://schema.org/DigitalDocument"
        ],
        "https://schema.org/additionalType": [
            {
                "@id": "https://data.idnau.org/pid/vocab/policy-types/data-policy"
            }
        ],
        "https://schema.org/description": [
            {
                "@value": "Description of the archive policy"
            }
        ]
    }
];