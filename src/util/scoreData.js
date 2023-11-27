export const fair = {
    f: {
        title: "Findable",
        value: 0,
        max: 0,
        desc: "Metadata and data should be easy to find for both humans and computers.",
        scores: {
            f1: {
                title: "",
                value: 0,
                max: 0,
                desc: "(Meta) data are assigned globally unique and persistent identifiers",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Has an identifier",
                    },
                    {
                        value: 2,
                        enabled: false,
                        desc: "Identifier is a URL",
                    },
                    {
                        value: 5,
                        enabled: false,
                        desc: "Identifier is globally unique, citeable and persistent",
                    }
                ]
            },
            f2: {
                title: "",
                value: 0,
                max: 0,
                desc: "Data are described with rich metadata",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Title & description included",
                    },
                    {
                        value: 2,
                        enabled: false,
                        desc: "Additional descriptive properties are present",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "All recommended descriptive properties are present",
                    }
                ]
            },
            f3: {
                title: "",
                value: 0,
                max: 0,
                desc: "Metadata clearly and explicitly include the identifier of the data they describe",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Identifier included in all metadata records/files describing the data",
                    }
                ]
            },
            f4: {
                title: "",
                value: 0,
                max: 0,
                desc: "(Meta)data are registered or indexed in a searchable resource",
                requirements: [
                    {
                        value: 2,
                        enabled: false,
                        desc: "Data is described in a repository",
                    },
                    {
                        value: 2,
                        enabled: false,
                        desc: "Data is discoverable through several registries",
                    }
                ]
            },
        }
    },
    a: {
        title: "Accessible",
        value: 0,
        max: 0,
        desc: "Once data is found, access information needs to be clearly indicated on the metadata.",
        scores: {
            a1: {
                title: "",
                value: 0,
                max: 0,
                desc: "(Meta)data are retrievable by their identifier using a standardised communication protocol",
                // scores: {
                //     "a1.1": {
                //         title: "",
                //         value: 10,
                //         max: 10,
                //         desc: "The protocol is open, free and universally implementable",
                //         requirements: [
                //             {
                //                 value: 2,
                //                 enabled: false,
                //                 desc: "Access to metadata",
                //             },
                //             {
                //                 value: 2,
                //                 enabled: false,
                //                 desc: "Conditional access",
                //             },
                //             {
                //                 value: 2,
                //                 enabled: false,
                //                 desc: "Embargoed access",
                //             },
                //             {
                //                 value: 4,
                //                 enabled: false,
                //                 desc: "Open access",
                //             }
                //         ]
                //     },
                //     "a1.2": { // left out of calcuator
                //         title: "",
                //         value: 0,
                //         max: 0,
                //         desc: "The protocol allows for an authentication and authorisation procedure where necessary",
                //         // requirements: [
                //         //     {
                //         //         value: 0,
                //         //         enabled: false,
                //         //         desc: "is a reachable URL",
                //         //     }
                //         // ]
                //     }
                // }
                requirements: [
                    {
                        value: 2,
                        enabled: false,
                        desc: "Access to metadata",
                    },
                    {
                        value: 2,
                        enabled: false,
                        desc: "Conditional access",
                    },
                    {
                        value: 2,
                        enabled: false,
                        desc: "Embargoed access",
                    },
                    {
                        value: 4,
                        enabled: false,
                        desc: "Open access",
                    }
                ]
            },
            a2: { // left out of calcuator
                title: "",
                value: 0,
                max: 0,
                desc: "Metadata should be accessible even when the data is no longer available",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Record will be available if the data is no longer available",
                    }
                ]
            },
        }
    },
    i: {
        title: "Interoperable",
        value: 0,
        max: 0,
        desc: "The data should be able to be integrated with other data.",
        scores: {
            i1: {
                title: "",
                value: 0,
                max: 0,
                desc: "(Meta)data use a formal, accessible, shared, and broadly applicable language for knowledge representation",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Structured, open standard",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Machine-readable",
                    }
                ]
            },
            i2: {
                title: "",
                value: 0,
                max: 0,
                desc: "(Meta)data use vocabularies that follow the FAIR principles",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Data has been described",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Reference vocabs",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Vocab references use global identifiers",
                    }
                ]
            },
            i3: {
                title: "",
                value: 0,
                max: 0,
                desc: "(Meta)data include qualified references to other (meta)data",
                requirements: [
                    {
                        value: 2,
                        enabled: false,
                        desc: "Links to other metadata",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Machine-readable",
                    }
                ]
            },
        }
    },
    r: {
        title: "Reusable",
        value: 0,
        max: 0,
        desc: "Metadata and data should be well-described so that they can be replicated and/or combined in different settings.",
        scores: {
            r1: {
                title: "",
                value: 0,
                max: 0,
                desc: "(Meta)data are richly described with a plurality of accurate and relevant attributes",
                scores: {
                    "r1.1": {
                        title: "",
                        value: 0,
                        max: 0,
                        desc: "(Meta)data are released with a clear and accessible data usage license",
                        requirements: [
                            {
                                value: 2,
                                enabled: false,
                                desc: "Has a license",
                            }
                        ]
                    },
                    "r1.2": {
                        title: "",
                        value: 0,
                        max: 0,
                        desc: "(Meta)data are associated with detailed provenance",
                        requirements: [
                            {
                                value: 3,
                                enabled: false,
                                desc: "Has provenance",
                            }
                        ]
                    },
                    "r1.3": {
                        title: "",
                        value: 0,
                        max: 0,
                        desc: "(Meta)data meet domain-relevant community standards",
                        requirements: [
                            {
                                value: 1,
                                enabled: false,
                                desc: "Has a data source",
                            },
                            {
                                value: 1,
                                enabled: false,
                                desc: "Data source has provenance",
                            }
                        ]
                    },
                }
            },
        }
    }
};

export const care = {
    c: {
        title: "Collective Benefit",
        value: 0,
        max: 0,
        desc: "Data ecosystems shall be designed and function in ways that enable Indigenous Peoples to derive benefit from the data.",
        scores: {
            c1: {
                title: "",
                value: 0,
                max: 0,
                desc: "For inclusive development and innovation",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Metadata is persistently identified (i.e. is assigned an IRI)",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "The data has been assigned one or more Indigeneity terms",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Data has Access Rights selected",
                    }
                ],
            },
            c2: {
                title: "",
                value: 0,
                max: 0,
                desc: "For improved governance and citizen engagement",
                prerequisite: {
                    enabled: false,
                    desc: "If C1 has scored fully then the following scores can be assigned:",
                },
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Metadata is discoverable via the internet (i.e. IRI resolves)",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Data title exists",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Data description exists",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Custodian (Role) Agent information in database has indigeneity = “Indigenous Persons Organisation” OR “Owned By Indigenous Persons” OR “Run By Indigenous Persons”",
                    }
                ],
            },
            c3: {
                title: "",
                value: 0,
                max: 0,
                desc: "For equitable outcomes",
                prerequisite: {
                    enabled: false,
                    desc: "If C2 has scored fully then the following scores can be assigned:",
                },
                requirements: [
                    {
                        value: 2,
                        enabled: false,
                        desc: "Licence and Rights have been identified AND Agent with role “Rights Holder” has been identified",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Data distribution information exists",
                    },
                    // {
                    //     value: 1,
                    //     enabled: false,
                    //     desc: "Equitable outcomes from data are discoverable",
                    // }
                ],
            },
        }
    },
    a: {
        title: "Authority to Control",
        value: 0,
        max: 0,
        desc: "Indigenous Peoples' rights and interests in Indigenous data must be recognised and their authority to control such data be empowered. Indigenous data governance enables Indigenous Peoples and governing bodies to determine how Indigenous Peoples, as well as Indigenous lands, territories, resources, knowledges and geographical indicators, are represented and identified within data.",
        scores: {
            a1: {
                title: "",
                value: 0,
                max: 0,
                desc: "Recognizing rights and interests",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Custodian (Role) Agent information in database has Indigeneity = “Indigenous Persons Organisation” OR “Owned By Indigenous Persons” OR “Run By Indigenous Persons”",
                    },
                    {
                        value: 2,
                        enabled: false,
                        desc: "License and Rights have been fully described AND Agent with role “Rights Holder” has been identified",
                    },
                ],
            },
            a2: {
                title: "",
                value: 0,
                max: 0,
                desc: "Recognizing rights and interests",
                prerequisite: {
                    enabled: false,
                    desc: "If A1 has scored fully then the following scores can be assigned:",
                },
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "The URL link to, OR text description of, an Indigenous Data Governance Framework or Indigenous Data Committee is identified in the metadata record",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Agent which has indicated the Indigenous Data Governance Framework has Role = Custodian",
                    }
                ],
            },
            a3: {
                title: "",
                value: 0,
                max: 0,
                desc: "Governance of data",
                prerequisite: {
                    enabled: false,
                    desc: "If A2 has scored fully then the following scores can be assigned:",
                },
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Indigeneity = By Indigenous People",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "URL link to an Indigenous Data Governance Framework or Indigenous Data Committee is identified in the metadata record",
                    },
                ],
            },
        }
    },
    r: {
        title: "Responsibility",
        value: 0,
        max: 0,
        desc: "Those working with Indigenous data have a responsibility to share how those data are used to support Indigenous Peoples’ self-determination and collective benefit. Accountability requires meaningful and openly available evidence of these efforts and the benefits accruing to Indigenous Peoples.",
        scores: {
            r1: {
                title: "",
                value: 0,
                max: 0,
                desc: "For positive relationships",
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "Indigeneity = By Indigenous People",
                    },
                    {
                        value: 2,
                        enabled: false,
                        desc: "Custodian (Role) Agent information in database has Indigeneity = “Indigenous Persons Organisation” OR “Owned By Indigenous Persons” OR “Run By Indigenous Persons”",
                    },
                ],
            },
            r2: {
                title: "",
                value: 0,
                max: 0,
                desc: "For expanding capability and capacity",
                prerequisite: {
                    enabled: false,
                    desc: "If R1 has scored fully then the following scores can be assigned:",
                },
                requirements: [
                    {
                        value: 2,
                        enabled: false,
                        desc: "Custodian (Role) Agent has identified a resolvable URL link to, OR text description of, an Indigenous Data Governance Framework or Indigenous Data Committee in the metadata record",
                    },
                ],
            },
            r3: {
                title: "",
                value: 0,
                max: 0,
                desc: "For Indigenous languages and worldviews",
                prerequisite: {
                    enabled: false,
                    desc: "If R1 has scored fully then the following scores can be assigned:",
                },
                requirements: [
                    {
                        value: 2,
                        enabled: false,
                        desc: "C3 has scored fully",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Custodian (Role) Agent has identified a resolvable URL link to an Indigenous Data Governance Framework or Indigenous Data Committee in the metadata record",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Spatial geometry has been identified",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "At least two themes have been selected ",
                    },
                ],
            },
        }
    },
    e: {
        title: "Ethics",
        value: 0,
        max: 0,
        desc: "Indigenous Peoples’ rights and wellbeing should be the primary concern at all stages of the data life cycle and across the data ecosystem",
        scores: {
            e1: {
                title: "",
                value: 0,
                max: 0,
                desc: "For minimizing harm and maximizing benefit",
                requirements: [
                    {
                        value: 2,
                        enabled: false,
                        desc: "C3 has scored fully",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "A1 has scored fully",
                    },
                ],
            },
            e2: {
                title: "",
                value: 0,
                max: 0,
                desc: "For justice",
                prerequisite: {
                    enabled: false,
                    desc: "If E1 has scored fully then the following scores can be assigned:",
                },
                requirements: [
                    {
                        value: 2,
                        enabled: false,
                        desc: "A3 has scored fully",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Custodian (Role) Agent’s information in database has ONLY Indigeneity = “Indigenous Persons Organisation”",
                    },
                ],
            },
            e3: {
                title: "",
                value: 0,
                max: 0,
                desc: "For future use",
                prerequisite: {
                    enabled: false,
                    desc: "If E1 and R3 has scored fully then the following scores can be assigned:",
                },
                requirements: [
                    {
                        value: 1,
                        enabled: false,
                        desc: "The date that the data was created and modified are identified",
                    },
                    {
                        value: 1,
                        enabled: false,
                        desc: "Name AND point of contact (Email OR Phone) is identified",
                    },
                ],
            },
        }
    }
};
