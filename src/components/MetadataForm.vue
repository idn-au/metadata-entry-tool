<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { DataFactory } from "n3";
import { v4 as uuid4 } from "uuid";
import { FormInput, FormField, BaseModal } from "@idn-au/idn-lib";
import PropTooltip from "@/components/PropTooltip.vue";
import FormSection from "@/components/FormSection.vue";
import FairScore from "@/components/FairScore.vue";
import CareScore from "@/components/CareScore.vue";
import RDFPreview from "@/components/RDFPreview.vue";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { useBtnTimeout } from "@/composables/btnTimeout";
import propDetails from "@/util/props.json";
import exampleData from "@/util/exampleData";
import formOptions from "@/util/formOptions";
import config from "@/config";

const { namedNode, literal } = DataFactory;

const defaultIri = `https://pid.idnau.org/resource/${uuid4()}`;

const rdfFormats = {
    "ttl": "text/turtle",
    "trig": "application/trig",
    "nt": "application/n-triples",
    "n3": "text/n3",
};

const { store, qname, serialize } = useRdfStore();

const { data: agentData, loading: agentLoading, error: agentError, doSparqlGetQuery: agentDoSparqlGetQuery, doSparqlPostQuery: agentDoSparqlPostQuery } = useGetRequest();
const { data: roleData, loading: roleLoading, error: roleError, doSparqlGetQuery: roleDoSparqlGetQuery, doSparqlPostQuery: roleDoSparqlPostQuery } = useGetRequest();
const { data: licenseData, loading: licenseLoading, error: licenseError, doSparqlGetQuery: licenseDoSparqlGetQuery, doSparqlPostQuery: licenseDoSparqlPostQuery } = useGetRequest();
const { data: accessRightsData, loading: accessRightsLoading, error: accessRightsError, doSparqlGetQuery: accessRightsDoSparqlGetQuery, doSparqlPostQuery: accessRightsDoSparqlPostQuery } = useGetRequest();
const { data: themeData, loading: themeLoading, error: themeError, doSparqlGetQuery: themeDoSparqlGetQuery, doSparqlPostQuery: themeDoSparqlPostQuery } = useGetRequest();

const agentOptionsRequested = ref([]);
const roleOptionsRequested = ref([]);
const licenseOptionsRequested = ref([]);
const accessRightsOptionsRequested = ref([]);
const themeOptionsRequested = ref([]);

const { clicked: savedDraft, startTimeout: startSavedDraftTimeout } = useBtnTimeout();
const { clicked: deletedDraft, startTimeout: startDeletedDraftTimeout } = useBtnTimeout();
const { clicked: clearedData, startTimeout: startClearedDataTimeout } = useBtnTimeout();

const spatialBnode = store.value.createBlankNode(); // _:b0
const temporalBnode = store.value.createBlankNode(); // _:b1
const distributionBnode = store.value.createBlankNode(); // _:b2

const showRDF = ref(false);
const loading = ref({
    accessUrl: false
});
// const urlProtocol = ref("");
const data = ref({
    iri: "",
    assignIri: true,
    title: "",
    description: "",
    created: "",
    modified: "",
    issued: "",
    license: "",
    useCustomLicense: false,
    customLicense: "",
    rights: "",
    accessRights: "",
    spatialGeom: "",
    useSpatialIri: false,
    spatialIri: "",
    temporalStart: "",
    temporalEnd: "",
    accessUrl: "",
    agentRoles: [
        {
            agent: "",
            role: []
        }
    ],
    themes: [],
    contactName: "",
    contactEmail: "",
    contactPhone: ""
});

const declarationTicked = ref(false);

const activeExample = ref("");

const sectionRefs = ref({
    general: null,
    agent: null,
    dates: null,
    rights: null,
    spatial: null,
    distribution: null,
    theme: null,
    contact: null
});

const sectionCollapsed = ref({
    general: false,
    agent: true,
    dates: true,
    rights: true,
    spatial: true,
    distribution: true,
    theme: true,
    contact: true
});

const validation = ref({}); // { key: isValid, ... }

const isValid = computed(() => {
    return Object.values(validation.value).every(Boolean);
});

const allOpen = computed(() => {
    return Object.values(sectionCollapsed.value).every(val => val !== true);
});

function handleValidate(key, isValid) {
    validation.value[key] = isValid;
}

const serializedData = ref("");
const modal = ref(null);
const hasSavedDraft = ref(false);

const calcIri = computed(() => {
    return data.value.assignIri ? defaultIri : data.value.iri;
});

const calcGeometry = computed(() => {
    return data.value.useSpatialIri ? data.value.spatialIri : data.value.spatialGeom;
});

const calcLicense = computed(() => {
    return data.value.useCustomLicense ? data.value.customLicense : data.value.license;
});

const empty = computed(() => {
    return Object.values(data.value).filter(item => typeof(item) !== "boolean" && item.length > 0).length === 0;
});

const fairScore = computed(() => {
    let score = {
        f1: 0,
        f2: 0,
        f3: 0,
        f4: 0,
        a1: 0,
        a2: 0,
        i1: 0,
        i2: 0,
        i3: 0,
        r1: 0
    }

    if (data.value.iri !== "") {
        score.f1 = 2;
        score.i1 = 1;
    }

    if (data.value.title !== "") {
        score.a1 = 3;
    }

    if (data.value.description !== "") {
        score.r1 = 2;
    }

    return score;
});

const careScore = computed(() => {
    let score = {
        c1: 0,
        c2: 0,
        c3: 0,
        a1: 0,
        a2: 0,
        a3: 0,
        r1: 0,
        r2: 0,
        r3: 0,
        e1: 0,
        e2: 0,
        e3: 0
    }

    if (data.value.created !== "") {
        score.c1 = 3;
        
    }

    if (data.value.modified !== "") {
        score.a1 = 2;
    }

    if (data.value.issued !== "") {
        score.r1 = 4;
        score.e1 = 1;
    }

    return score;
});

watch(serializedData, (newValue, oldValue) => {
    if (activeExample.value) {
        if (newValue !== oldValue) {
            if (newValue !== exampleData[activeExample.value]) {
                activeExample.value = "";
            }
        }
    }
});

watch(calcIri, (newValue, oldValue) => {
    const quads = store.value.getQuads(namedNode(oldValue), null, null);
    store.value.removeQuads(quads);
    quads.forEach(q => {
        store.value.addQuad(namedNode(newValue), q.predicate, q.object);
    });
    serializedData.value = serialize();
});

watch(() => data.value.title, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:title", literal(newValue, namedNode(qname("xsd:string"))));
});

watch(() => data.value.description, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:description", literal(newValue, namedNode(qname("xsd:string"))));
});

watch(() => data.value.created, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:created", literal(newValue, namedNode(qname("xsd:date"))));
});

watch(() => data.value.modified, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:modified", literal(newValue, namedNode(qname("xsd:date"))));
});

watch(() => data.value.issued, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:issued", literal(newValue, namedNode(qname("xsd:date"))));
});

watch(calcLicense, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:license", namedNode(newValue));
});

watch(() => data.value.rights, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:rights", literal(newValue, namedNode(qname("xsd:string"))));
});

watch(() => data.value.accessRights, (newValue, oldValue) => {
    updateTriple(newValue, "dcat:accessRights", namedNode(newValue));
});

watch(calcGeometry, (newValue, oldValue) => {
    const spatialQuads = store.value.getQuads(namedNode(calcIri.value), namedNode(qname("dcterms:spatial")), null);
    if (spatialQuads.length > 0 && spatialQuads[0].object.termType === "BlankNode") {
        const bnodeQuads = store.value.getQuads(spatialQuads[0].object, null, null);
        store.value.removeQuads(bnodeQuads);
    }
    store.value.removeQuads(spatialQuads);

    if (data.value.useSpatialIri) {
        updateTriple(newValue, "dcterms:spatial", namedNode(newValue));
    } else {
        if (newValue !== "") {
            store.value.addQuad(namedNode(calcIri.value), namedNode(qname("dcterms:spatial")), spatialBnode);
            store.value.addQuad(spatialBnode, namedNode(qname("a")), namedNode(qname("geo:Geometry")));
            store.value.addQuad(spatialBnode, namedNode(qname("geo:asWKT")), literal(newValue, namedNode(qname("geo:wktLiteral"))));
        }

        serializedData.value = serialize();
    }
});

watch(() => data.value.temporalStart, (newValue, oldValue) => {
    const temporalQuads = store.value.getQuads(namedNode(calcIri.value), namedNode(qname("dcterms:temporal")), null);
    if (temporalQuads.length > 0 && temporalQuads[0].object.termType === "BlankNode") {
        const bnodeQuads1 = store.value.getQuads(temporalQuads[0].object, namedNode(qname("prov:startedAtTime")), null);
        store.value.removeQuads(bnodeQuads1);
        const bnodeQuads2 = store.value.getQuads(temporalQuads[0].object, null, null);
        if (bnodeQuads2.length === 0) {
            store.value.removeQuads(temporalQuads);
        }
    }

    if (newValue !== "") {
        // date datatype
        let datatype = "";
        const valueSplit = newValue.split("-")
        if (valueSplit.length === 1) {
            datatype = "xsd:gYear";
        } else if (valueSplit.length === 2) {
            datatype = "xsd:monthYear";
        } else {
            datatype = "xsd:date";
        }

        store.value.addQuad(namedNode(calcIri.value), namedNode(qname("dcterms:temporal")), temporalBnode);
        store.value.addQuad(temporalBnode, namedNode(qname("prov:startedAtTime")), literal(newValue, namedNode(qname(datatype))));
    }
    serializedData.value = serialize();
});

watch(() => data.value.temporalEnd, (newValue, oldValue) => {
    const temporalQuads = store.value.getQuads(namedNode(calcIri.value), namedNode(qname("dcterms:temporal")), null);
    if (temporalQuads.length > 0 && temporalQuads[0].object.termType === "BlankNode") {
        const bnodeQuads = store.value.getQuads(temporalQuads[0].object, namedNode(qname("prov:endedAtTime")), null);
        store.value.removeQuads(bnodeQuads);
        const bnodeQuads2 = store.value.getQuads(temporalQuads[0].object, null, null);
        if (bnodeQuads2.length === 0) {
            store.value.removeQuads(temporalQuads);
        }
    }

    if (newValue !== "") {
        // date datatype
        let datatype = "";
        const valueSplit = newValue.split("-")
        if (valueSplit.length === 1) {
            datatype = "xsd:gYear";
        } else if (valueSplit.length === 2) {
            datatype = "xsd:monthYear";
        } else {
            datatype = "xsd:date";
        }

        store.value.addQuad(namedNode(calcIri.value), namedNode(qname("dcterms:temporal")), temporalBnode);
        store.value.addQuad(temporalBnode, namedNode(qname("prov:endedAtTime")), literal(newValue, namedNode(qname(datatype))));
    }
    serializedData.value = serialize();
});

watch(() => data.value.accessUrl, (newValue, oldValue) => {
    const distQuads = store.value.getQuads(namedNode(calcIri.value), namedNode(qname("dcat:distribution")), null);
    if (distQuads.length > 0 && distQuads[0].object.termType === "BlankNode") {
        const bnodeQuads = store.value.getQuads(distQuads[0].object, null, null);
        store.value.removeQuads(bnodeQuads);
    }
    store.value.removeQuads(distQuads);

    if (newValue !== "") {
        store.value.addQuad(namedNode(calcIri.value), namedNode(qname("dcat:distribution")), distributionBnode);
        store.value.addQuad(distributionBnode, namedNode(qname("dcat:accessURL")), literal(newValue, namedNode(qname("xsd:anyURI"))));
    }

    serializedData.value = serialize();
});

watch(() => data.value.themes, (newValue, oldValue) => {
    const themeQuads = store.value.getQuads(namedNode(calcIri.value), namedNode(qname("dcat:theme")), null);
    store.value.removeQuads(themeQuads);
    if (newValue.length > 0) {
        newValue.forEach(theme => store.value.addQuad(namedNode(calcIri.value), namedNode(qname("dcat:theme")), namedNode(theme)));
    }
    serializedData.value = serialize();
});

watch(() => data.value.agentRoles, (newValue, oldValue) => {
    const qualifiedQuads = store.value.getQuads(namedNode(calcIri.value), namedNode(qname("prov:qualifiedAttribution")), null);
    if (qualifiedQuads.length > 0) {
        qualifiedQuads.forEach(q => {
            if (q.object.termType === "BlankNode") {
                const bnodeQuads2 = store.value.getQuads(q.object, null, null);
                store.value.removeQuads(bnodeQuads2);
            }
        });
        store.value.removeQuads(qualifiedQuads);
    }

    if (newValue && newValue.length > 0) {
        newValue.forEach((agentRole) => {
            if (agentRole.agent !== "" || agentRole.role.length > 0) {
                const newBnode = store.value.createBlankNode();
                store.value.addQuad(namedNode(calcIri.value), namedNode(qname("prov:qualifiedAttribution")), newBnode);
                if (agentRole.agent !== "") {
                    store.value.addQuad(newBnode, namedNode(qname("prov:agent")), namedNode(agentRole.agent));
                }
                if (agentRole.role.length > 0) {
                    agentRole.role.forEach(role => {
                        store.value.addQuad(newBnode, namedNode(qname("dcat:hadRole")), namedNode(role));
                    });
                }
            }
        });
    }
    serializedData.value = serialize();
}, { deep: true });

// watch(
//     () => data.value.accessUrl,
//     (newValue, oldValue) => {
//         let protocol = newValue.split("://")[0];
//         if (!newValue.match(/\w+?:\/\//) && urlProtocol.value === "") {
//             urlProtocol.value = "http";
//         } else if (urlProtocolOptions.map(option => option.value).includes(newValue.split("://")[0])) {
//             urlProtocol.value = protocol;
//         }
//     }
// );

function updateTriple(value, predQname, object) {
    const quads = store.value.getQuads(namedNode(calcIri.value), namedNode(qname(predQname)), null);
    store.value.removeQuads(quads);
    if (value !== "") {
        store.value.addQuad(namedNode(calcIri.value), namedNode(qname(predQname)), object);
    }
    serializedData.value = serialize();
}

function validateMatchRegex(s, exp, invalidMessage) {
    if (s.match(exp)) {
        return [true, ""];
    } else {
        return [false, invalidMessage];
    }
}

function validateIri(s) {
    return validateMatchRegex(s, /^https?:\/\/.+/, "Invalid IRI");
}

function validateWktString(s) {
    return validateMatchRegex(s, /^\w+\s?\(.+\)$/, "Invalid WKT geometry");
}

function validateReachableUrl(s) {
    if (s !== "") {
        loading.value.accessUrl = true;

        fetch(s, {
            method: "HEAD",
            mode: "no-cors"
        })
        .catch(e => {
            return [false, "URL is unreachable"]
        });

        loading.value.accessUrl = false;
    }
}

function setFile(e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        const extension = file.name.split(".")[1];
        loadRDF({ format: rdfFormats[extension], value: e.target.result })
    };
    reader.readAsText(file);
}

function loadRDF(e) {
    const { format, value } = e;
    const { store: loadedStore, qname: loadedQname, parseIntoStore: loadedParseIntoStore, serialize: loadedSerialize } = useRdfStore();
    clearData();
    loadedParseIntoStore(value, format);
    const subject = loadedStore.value.getSubjects(namedNode(qname("a")), namedNode(loadedQname("dcat:Resource")))[0];
    data.value.iri = subject.id;
    data.value.assignIri = false;
    loadedStore.value.forEach(q => { // get preds & objs
        if (q.predicate.value === loadedQname("dcterms:title")) {
            data.value.title = q.object.value;
        } else if (q.predicate.value === loadedQname("dcterms:description")) {
            data.value.description = q.object.value;
        } else if (q.predicate.value === loadedQname("dcterms:created")) {
            data.value.created = q.object.value;
        } else if (q.predicate.value === loadedQname("dcterms:modified")) {
            data.value.modified = q.object.value;
        } else if (q.predicate.value === loadedQname("dcterms:issued")) {
            data.value.issued = q.object.value;
        } else if (q.predicate.value === loadedQname("dcterms:license")) {
            data.value.license = q.object.value;
        } else if (q.predicate.value === loadedQname("dcterms:rights")) {
            data.value.rights = q.object.value;
        } else if (q.predicate.value === loadedQname("dcat:accessRights")) {
            data.value.accessRights = q.object.value;
        } else if (q.predicate.value === loadedQname("dcterms:spatial")) {
            if (q.object.termType === "NamedNode") {
                data.value.spatialIri = q.object.value;
            } else if (q.object.termType === "BlankNode") {
                const bnodes = loadedStore.value.getQuads(q.object, namedNode(loadedQname("geo:asWKT")), null);
                data.value.spatialGeom = bnodes[0].object.value;
            }
        } else if (q.predicate.value === loadedQname("dcterms:temporal")) {
            if (q.object.termType === "BlankNode") {
                loadedStore.value.forEach(q1 => {
                    if (q1.predicate.value === loadedQname("prov:startedAtTime")) {
                        data.value.temporalStart = q1.object.value;
                    } else if (q1.predicate.value === loadedQname("prov:endedAtTime")) {
                        data.value.temporalEnd = q1.object.value;
                    }
                }, q.object, null, null);
            }
        } else if (q.predicate.value === loadedQname("dcat:distribution")) {
            if (q.object.termType === "BlankNode") {
                const bnodes = loadedStore.value.getQuads(q.object, namedNode(loadedQname("dcat:accessURL")), null);
                data.value.accessUrl = bnodes[0].object.value;
            }
        } else if (q.predicate.value === loadedQname("dcat:theme")) {
            data.value.themes.push(q.object.value);
        } else if (q.predicate.value === loadedQname("prov:qualifiedAttribution")) {
            if (q.object.termType === "BlankNode") {
                let agentRole = {
                    agent: "",
                    role: []
                };
                loadedStore.value.forEach(q1 => {
                    if (q1.predicate.value === loadedQname("prov:agent")) {
                        agentRole.agent = q1.object.value;
                    } else if (q1.predicate.value === loadedQname("dcat:hadRole")) {
                        agentRole.role.push(q1.object.value);
                    }
                }, q.object, null, null);
                if (data.value.agentRoles[0].agent === "") { // first blank agent-role pair, replace
                    data.value.agentRoles[0] = agentRole;
                } else {
                    data.value.agentRoles.push(agentRole);
                }
            }
        }
    }, subject, null, null);
}

function clearData(clicked = false) {
    data.value = {
        iri: "",
        assignIri: true,
        title: "",
        description: "",
        created: "",
        modified: "",
        issued: "",
        license: "",
        useCustomLicense: false,
        customLicense: "",
        rights: "",
        accessRights: "",
        spatialGeom: "",
        useSpatialIri: false,
        spatialIri: "",
        temporalStart: "",
        temporalEnd: "",
        accessUrl: "",
        agentRoles: [
            {
                agent: "",
                role: []
            }
        ],
        themes: [],
        contactName: "",
        contactEmail: "",
        contactPhone: ""
    };
    validation.value = {};
    if (clicked) {
        startClearedDataTimeout();
    }
}

function saveDraft() {
    localStorage.setItem("data", JSON.stringify(data.value));
    hasSavedDraft.value = true;
    startSavedDraftTimeout();
}

function deleteDraft() {
    localStorage.removeItem("data");
    hasSavedDraft.value = false;
    startDeletedDraftTimeout();
}

function loadExample(key) {
    loadRDF({ format: "turtle", value: exampleData[key] });
    nextTick(() => {
        activeExample.value = key;
    })
}

function titleCase(s) {
    return s.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function filteredAgentOptions(agentRole, index) {
    const selectedAgents = data.value.agentRoles.map(agentRole => agentRole.agent);
    if (agentRole.agent !== "") { // currently selected agent should still show in it's own dropdown
        selectedAgents.splice(index, 1);
    }
    return agentOptionsRequested.value.filter(agent => !selectedAgents.includes(agent.value));
}

function collapseAllSections() {
    if (allOpen.value) {
        // collapse all
        Object.values(sectionRefs.value).forEach(section => {
            section.collapse();
        });
    } else {
        // expand all
        Object.values(sectionRefs.value).forEach(section => {
            section.expand();
        });
    }
}

onMounted(() => {
    const savedData = localStorage.getItem("data");
    if (savedData) {
        data.value = JSON.parse(savedData);
        hasSavedDraft.value = true;
    } else {
        store.value.addQuad(namedNode(defaultIri), namedNode(qname("a")), namedNode(qname("dcat:Resource")));
        serializedData.value = serialize();
    }

    if (config.useRemoteOptions) {
        // query triplestore for form options
        agentDoSparqlPostQuery(config.agentTriplestoreUrl, `PREFIX sdo: <https://schema.org/>
            SELECT DISTINCT ?agent ?name
            WHERE {
                GRAPH <${config.agentNamedGraph}> {
                    VALUES ?agentType { sdo:Person sdo:Organization sdo:Organisation }
                    ?agent a ?agentType ;
                        sdo:name ?name .
                }
            }`,() => {
            agentData.value.forEach(result => {
                agentOptionsRequested.value.push({
                    value: result.agent.value,
                    label: result.name.value
                });
            });
            agentOptionsRequested.value.sort((a, b) => a.label.localeCompare(b.label));
        });

        roleDoSparqlPostQuery(config.vocabTriplestoreUrl, `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            SELECT DISTINCT ?role ?name ?desc
            WHERE {
                BIND(<https://w3id.org/idn/vocab/idn-role-codes> AS ?cs)
                ?cs a skos:ConceptScheme .
                ?role a skos:Concept ;
                    skos:inScheme ?cs ;
                    skos:prefLabel ?name ;
                    skos:definition ?desc .
            }`,() => {
            roleData.value.forEach(result => {
                roleOptionsRequested.value.push({
                    value: result.role.value,
                    label: titleCase(result.name.value),
                    desc: result.desc.value,
                });
            });
            roleOptionsRequested.value.sort((a, b) => a.label.localeCompare(b.label));
        });

        licenseDoSparqlPostQuery(config.vocabTriplestoreUrl, `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            SELECT DISTINCT ?license ?name
            WHERE {
                BIND(<https://w3id.org/idn/vocab/idn-licenses> AS ?cs)
                ?cs a skos:ConceptScheme .
                ?license a skos:Concept ;
                    skos:inScheme ?cs ;
                    skos:prefLabel ?name .
            }`,() => {
            licenseData.value.forEach(result => {
                licenseOptionsRequested.value.push({
                    value: result.license.value,
                    label: result.name.value
                });
            });
            licenseOptionsRequested.value.sort((a, b) => a.label.localeCompare(b.label));
        });
        
        accessRightsDoSparqlPostQuery(config.vocabTriplestoreUrl, `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            SELECT DISTINCT ?accessRight ?name
            WHERE {
                BIND(<https://linked.data.gov.au/def/data-access-rights> AS ?cs)
                ?cs a skos:ConceptScheme .
                ?accessRight a skos:Concept ;
                    skos:inScheme ?cs ;
                    skos:prefLabel ?name .
            }`,() => {
            accessRightsData.value.forEach(result => {
                accessRightsOptionsRequested.value.push({
                    value: result.accessRight.value,
                    label: titleCase(result.name.value)
                });
            });
            accessRightsOptionsRequested.value.sort((a, b) => a.label.localeCompare(b.label));
        });

        themeDoSparqlPostQuery(config.vocabTriplestoreUrl, `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            SELECT DISTINCT ?theme ?name
            WHERE {
                BIND(<https://w3id.org/idn/vocab/idn-th> AS ?cs)
                ?cs a skos:ConceptScheme .
                ?theme a skos:Concept ;
                    skos:inScheme ?cs ;
                    skos:prefLabel ?name .
            }`,() => {
            themeData.value.forEach(result => {
                themeOptionsRequested.value.push({
                    value: result.theme.value,
                    label: result.name.value
                });
            });
            themeOptionsRequested.value.sort((a, b) => a.label.localeCompare(b.label));
        });
    } else {
        // use hard-coded options
        agentOptionsRequested.value = formOptions.agentOptions;
        roleOptionsRequested.value = formOptions.roleOptions;
        licenseOptionsRequested.value = formOptions.licenseOptions;
        accessRightsOptionsRequested.value = formOptions.accessRightsOptions;
        themeOptionsRequested.value = formOptions.themeOptions;
    }
});
</script>

<template>
    <div id="metadata-container">
        <div id="metadata-header">
            <div id="top-buttons">
                <div class="btn-group">
                    <button class="btn secondary outline tutorial-btn" title="Coming soon" disabled>Start Tutorial</button>
                </div>
                <div class="btn-group">
                    <button class="btn primary outline" @click="collapseAllSections">
                        <template v-if="allOpen">Collapse all <i class="fa-regular fa-chevron-up"></i></template>
                        <template v-else>Expand all <i class="fa-regular fa-chevron-down"></i></template>
                    </button>
                </div>
                <div class="btn-group">
                    <div class="btn-with-desc">
                        <input type="file" name="rdfFile" id="rdfFile" :accept="Object.keys(rdfFormats).map(ext => `.${ext}`).join(',')" @change="setFile" hidden>
                        <label for="rdfFile" class="btn secondary outline import-btn" title="Import RDF file">Import <i class="fa-regular fa-file-import"></i></label>
                        <span class="btn-desc">.ttl, .n3, .nt, .trig</span>
                    </div>
                </div>
                <div class="btn-group">
                    <div class="examples-container">
                        <span>Load examples: </span>
                        <div class="examples">
                            <button
                                v-for="example in Object.keys(exampleData)"
                                :class="`btn example sm ${activeExample === example ? 'active' : ''}`"
                                @click="loadExample(example)"
                            >
                                {{ example }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <button id="toggle-rdf-btn" class="btn primary outline" @click="showRDF = !showRDF">
                        <span><template v-if="showRDF">Hide</template><template v-else>Show</template> RDF</span>
                        <i :class="`fa-regular fa-chevron-${showRDF ? 'right' : 'left'}`"></i>
                    </button>
                </div>
            </div>
        </div>
        <div id="metadata-body" :class="`${showRDF ? 'show-rdf' : ''}`">
            <div class="metadata-col" id="metadata-form">
                <div class="col-body" id="form-items">
                    <FormSection defaultOpen title="General" :ref="el => sectionRefs.general = el" @collapse="sectionCollapsed.general = $event">
                        <template #description>
                            Basic information about this data.
                        </template>
                        <FormField description="Provide an IRI or choose to have an IRI automatically assigned">
                            <FormInput
                                label="IRI"
                                type="url"
                                id="iri"
                                tooltip="An IRI is an identifier in the form of a web address (URL). Good IRIs are part of a managed system."
                                placeholder="e.g. http://example.com/1234"
                                required
                                @validate="handleValidate('iri', $event)"
                                :validationFns="[validateIri]"
                                v-model="data.iri"
                                clearButton
                                :disabled="data.assignIri"
                            />
                            <FormInput
                                label="Assign IRI"
                                type="checkbox"
                                id="assignIRI"
                                v-model="data.assignIri"
                                switch
                            />
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Title"
                                type="text"
                                id="title"
                                required
                                v-model="data.title"
                                clearButton
                                @validate="handleValidate('title', $event)"
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.title" />
                                </template>
                            </FormInput>
                        </FormField>
                        <FormField :span="2">
                            <FormInput
                                label="Description"
                                type="textarea"
                                id="description"
                                v-model="data.description"
                                description="Supports new lines and basic formatting"
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.description" />
                                </template>
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Agent Info" :ref="el => sectionRefs.agent = el" @collapse="sectionCollapsed.agent = $event">
                        <template #description>
                            Information about the roles that agents (people and organisations) play with respect to this data. These roles are critical in determining whether this data is managed properly.
                        </template>
                        <FormField v-for="(agentRole, index) in data.agentRoles" direction="row" :span="2">
                            <FormInput
                                label="Agent"
                                type="select"
                                id="agent"
                                v-model="agentRole.agent"
                                clearButton
                                :options="filteredAgentOptions(agentRole, index)"
                                searchable
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.agent" />
                                </template>
                            </FormInput>
                            <FormInput
                                label="Role"
                                type="select"
                                id="role"
                                v-model="agentRole.role"
                                clearButton
                                :options="roleOptionsRequested"
                                searchable
                                multiple
                            >
                                <template #append>
                                    <button class="modal-btn" @click="modal = 'agentRole'" title="Role info">
                                        <i class="fa-regular fa-circle-info"></i>
                                    </button>
                                    <BaseModal v-if="modal === 'agentRole'" @modalClosed="modal = null">
                                        <template #headerMiddle>
                                            <h3>Agent Roles</h3>
                                        </template>
                                        <p>Below is a list for reference of roles and their brief definitions.</p>
                                        <div class="modal-items">
                                            <div v-for="role in roleOptionsRequested" class="modal-item">
                                                <a :href="role.value" target="_blank" rel="noopener noreferrer">{{ role.label }}</a>
                                                <p>{{ role.desc }}</p>
                                            </div>
                                        </div>
                                        
                                    </BaseModal>
                                </template>
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.role" />
                                </template>
                            </FormInput>
                            <button v-if="index > 0" class="btn outline danger delete-agent-btn" title="Delete agent-role pair" @click="data.agentRoles.splice(index, 1);"><i class="fa-regular fa-xmark"></i></button>
                        </FormField>
                        <button class="btn secondary outline add-agent-btn" @click="data.agentRoles.push({agent: '', role: []})"><i class="fa-regular fa-plus"></i> Add Agent</button>
                    </FormSection>
                    <FormSection title="Dates" :ref="el => sectionRefs.dates = el" @collapse="sectionCollapsed.dates = $event">
                        <template #description>
                            Standard dates for the establishment and update times of this dataset. A dataset about early 20th century data might only have been made last year and the created date is then some time last year. "Issued" indicates when, if ever, this dataset was published.
                        </template>
                        <FormField>
                            <FormInput
                                label="Created"
                                type="date"
                                id="created"
                                required
                                @validate="handleValidate('created', $event)"
                                v-model="data.created"
                                clearButton
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.created" />
                                </template>
                            </FormInput>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Modified"
                                type="date"
                                id="modified"
                                required
                                @validate="handleValidate('modified', $event)"
                                v-model="data.modified"
                                clearButton
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.modified" />
                                </template>
                            </FormInput>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Issued"
                                type="date"
                                id="issued"
                                v-model="data.issued"
                                clearButton
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.issued" />
                                </template>
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Rights" :ref="el => sectionRefs.rights = el" @collapse="sectionCollapsed.rights = $event">
                        <template #description>
                            Ownership and access information.
                        </template>
                        <FormField>
                            <FormInput
                                v-show="!data.useCustomLicense"
                                label="License"
                                type="select"
                                id="license"
                                v-model="data.license"
                                clearButton
                                :options="licenseOptionsRequested"
                                searchable
                            >
                                <template #append>
                                    <button class="modal-btn" @click="modal = 'license'" title="License info">
                                        <i class="fa-regular fa-circle-info"></i>
                                    </button>
                                    <BaseModal v-if="modal === 'license'" @modalClosed="modal = null">
                                        <template #headerMiddle>
                                            <h3>Licenses</h3>
                                        </template>
                                        <div v-for="license in licenseOptionsRequested">
                                            <a :href="license.value" target="_blank" rel="noopener noreferrer">{{ license.label }}</a> - {{ license.desc }}
                                        </div>
                                    </BaseModal>
                                </template>
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.license" />
                                </template>
                            </FormInput>
                            <FormInput
                                v-show="data.useCustomLicense"
                                label="License IRI"
                                placeholder="e.g. http://example.com/1234"
                                type="text"
                                v-model="data.customLicense"
                                @validate="handleValidate('customLicense', $event)"
                                :validationFns="[validateIri]"
                                clearButton
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.license" />
                                </template>
                            </FormInput>
                            <FormInput
                                label="Provide License IRI"
                                id="custom-license"
                                type="checkbox"
                                v-model="data.useCustomLicense"
                                switch
                            />
                            <!-- <template #bottom>
                                <FormInput
                                    v-if="data.license === 'new'"
                                    label="Enter a new license"
                                    type="text"
                                    v-model="data.customLicense"
                                    :clearButton="true"
                                />
                            </template> -->
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Rights"
                                type="text"
                                id="rights"
                                v-model="data.rights"
                                clearButton
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.rights" />
                                </template>
                            </FormInput>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Access Rights"
                                type="select"
                                id="accessRights"
                                v-model="data.accessRights"
                                clearButton
                                :options="accessRightsOptionsRequested"
                                searchable
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.accessRights" />
                                </template>
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Spatio/Temporal" :ref="el => sectionRefs.spatial = el" @collapse="sectionCollapsed.spatial = $event">
                        <template #description>
                            The spatial and temporal extent <em>of the data</em>. This information is different from the dates section as this dataset may have been created recently but it's about someone or something long ago.
                        </template>
                        <FormField label="Spatial geometry">
                            <FormInput
                                v-show="!data.useSpatialIri"
                                label="Geometry"
                                type="text"
                                v-model="data.spatialGeom"
                                clearButton
                                placeholder="e.g. POLYGON ((1234 1234, 1235 1245))"
                                :disabled="data.useSpatialIri"
                                description="Must be WKT format"
                                @validate="handleValidate('spatialGeom', $event)"
                                :validationFns="[validateWktString]"
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.spatialGeometry" />
                                </template>
                            </FormInput>
                            <FormInput
                                v-show="data.useSpatialIri"
                                label="Spatial IRI"
                                type="url"
                                v-model="data.spatialIri"
                                clearButton
                                placeholder="e.g. http://example.com/1234"
                                :disabled="!data.useSpatialIri"
                                description="Must be a valid IRI"
                                @validate="handleValidate('spatialIri', $event)"
                                :validationFns="[validateIri]"
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.spatialIri" />
                                </template>
                            </FormInput>
                            <FormInput
                                label="Use Spatial IRI"
                                leftLabel="WKT String"
                                rightLabel="Spatial IRI"
                                type="checkbox"
                                id="use-spatial-iri"
                                v-model="data.useSpatialIri"
                                switch
                            />
                        </FormField>
                        <FormField label="Temporal" description="Start & end date">
                            <FormInput
                                label="Start"
                                type="date-optional"
                                v-model="data.temporalStart"
                                clearButton
                            >
                            </FormInput>
                            <FormInput
                                label="End"
                                type="date-optional"
                                v-model="data.temporalEnd"
                                clearButton
                            >
                            </FormInput>
                            <template #tooltip>
                                <PropTooltip v-bind="propDetails.startDate" />
                            </template>
                        </FormField>
                    </FormSection>
                    <FormSection title="Distribution Info" :ref="el => sectionRefs.distribution = el" @collapse="sectionCollapsed.distribution = $event">
                        <template #description>
                            Information about how to gain access to the data
                        </template>
                        <FormField :span="2">
                            <FormInput
                                label="Access URL"
                                type="url"
                                id="accessUrl"
                                description="Must be a reachable URL"
                                placeholder="e.g. http://example.com/1234"
                                :validationFns="[validateIri]"
                                @validate="handleValidate('accessUrl', $event)"
                                v-model="data.accessUrl"
                                clearButton
                            >
                                <!-- <template #prepend>
                                    <FormInput
                                        type="select"
                                        id="protocol"
                                        v-model="urlProtocol"
                                        :options="urlProtocolOptions"
                                    />
                                </template> -->
                                <template #append v-if="loading.accessUrl">
                                    <span><i class="fa-regular fa-spinner-third"></i></span>
                                </template>
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.accessUrl" />
                                </template>
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Theme" :ref="el => sectionRefs.theme = el" @collapse="sectionCollapsed.theme = $event">
                        <template #description>
                            Classification or categorisation of this data. We are mostly concerned with indications of "indigeneity", i.e. how this data is related to indigenous people, however other classifications may also be added. Our primary indigenous classification vocabulary is online at <a href="https://w3id.org/idn/vocab/idn-th" target="_blank" rel="noopener noreferrer">https://w3id.org/idn/vocab/idn-th</a> which may be browsed for classification suggestions.
                        </template>
                        <FormField :span="2">
                            <FormInput
                                label="Theme"
                                type="select"
                                id="theme"
                                v-model="data.themes"
                                clearButton
                                :options="themeOptionsRequested"
                                multiple
                                searchable
                                allowAdd
                                description="You can add additional themes from the search field"
                            >
                                <template #tooltip>
                                    <PropTooltip v-bind="propDetails.theme" />
                                </template>
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Contact Details" :ref="el => sectionRefs.contact = el" @collapse="sectionCollapsed.contact = $event">
                        <template #description>
                            Required if you are submitting this metadata to the IDN.
                            <br/><br/>
                            These details are also added as the point of contact for this data unless you've specifically indicated an Agent as the Point of Contact above.
                        </template>
                        <FormField>
                            <FormInput
                                label="Name"
                                type="text"
                                id="contactName"
                                v-model="data.contactName"
                                clearButton
                            />
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Email"
                                type="email"
                                id="contactEmail"
                                v-model="data.contactEmail"
                                clearButton
                            />
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Phone"
                                type="tel"
                                id="contactPhone"
                                v-model="data.contactPhone"
                                clearButton
                            />
                        </FormField>
                    </FormSection>
                </div>
            </div>
            <div class="metadata-col" id="metadata-scores">
                <div class="col-body">
                    <FairScore :subscores="fairScore" />
                    <CareScore :subscores="careScore" />
                </div>
            </div>
            <div class="metadata-col" id="metadata-rdf">
                <div class="col-body">
                    <RDFPreview :data="serializedData" />
                </div>
            </div>
        </div>
        <div id="metadata-footer">
            <p>
                Form declaration
            </p>
            <FormInput
                label="I agree"
                type="checkbox"
                id="declaration-check"
                v-model="declarationTicked"
            />
            <div id="bottom-buttons">
                <div class="btn-group">
                    <button class="btn secondary outline" @click="saveDraft" :disabled="empty">
                        <template v-if="savedDraft">
                            Draft saved!
                        </template>
                        <template v-else>
                            Save Draft <i class="fa-regular fa-floppy-disk"></i>
                        </template>
                    </button>
                </div>
                <div class="btn-group">
                    <a
                        class="btn secondary outline export-btn"
                        :href="!empty ? `data:text/turtle;charset=utf-8,${encodeURIComponent(serializedData)}` : null"
                        :download="!empty ? `${data.title || 'metadata'}.ttl` : null"
                        :disabled="empty"
                        title="Export as RDF file (.ttl)"
                    >
                        Export <i class="fa-regular fa-file-export"></i>
                    </a>
                </div>
                <div class="btn-group">
                    <button class="btn outline danger" @click="deleteDraft" :disabled="!hasSavedDraft">
                        <template v-if="deletedDraft">
                            Draft deleted!
                        </template>
                        <template v-else>
                            Delete Draft <i class="fa-regular fa-trash"></i>
                        </template>
                    </button>
                    <button class="btn danger outline" @click="clearData(true)" :disabled="empty">
                        <template v-if="clearedData">
                            Cleared data!
                        </template>
                        <template v-else>
                            Clear Data <i class="fa-regular fa-delete-left"></i>
                        </template>
                    </button>
                </div>
                <div class="btn-group">
                    <button class="btn success lg submit-btn" title="Coming soon" :disabled="true || (empty || !isValid)">Submit for review</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/_mixins.scss";

$gap: 16px;
$padding: 12px;

#metadata-container {
    display: flex;
    flex-direction: column;
    // gap: $gap;
    background-color: $formBg;
    border-radius: $borderRadius;
    margin-top: 12px;

    #metadata-header {
        display: flex;
        flex-direction: column;
        padding: $padding;

        #metadata-title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 12px;

            h2 {
                text-align: center;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
            }

            
        }

        #metadata-desc {
            display: flex;
            flex-direction: column;
        }
    }

    #metadata-body {
        display: flex;
        flex-direction: row;
        flex-grow: 1;

        &.show-rdf {
            #metadata-form {
                width: 50%;
            }

            #metadata-scores {
                width: 20%;
            }

            #metadata-rdf {
                width: 30%;
                margin-left: $gap;
            }
        }

        &:not(.show-rdf) {
            #metadata-form {
                width: 75%;
            }

            #metadata-scores {
                width: 25%;
            }

            #metadata-rdf {
                width: 0%;
                padding-left: 0;
                padding-right: 0;
                margin-left: 0;
            }
        }

        .metadata-col {
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: 100%;
            gap: $padding;
            padding: $padding;
            @include transition(width, margin, padding);

            & > * {
                max-width: 100%;
            }

            .col-header {
                display: flex;
                justify-content: center;
                align-items: center;

                h3 {
                    text-align: center;
                    margin: 0;
                }
            }

            .col-body {
                display: flex;
                flex-direction: column;
                gap: $padding;
            }

            &#metadata-form {

                #form-items {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
            }

            &#metadata-scores {
                margin-left: $gap;
            }

            &#metadata-rdf {
                overflow-x: hidden;

                #rdf-data {
                    flex-grow: 1;
                }
            }
        }
    }

    #metadata-footer {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: $padding;

        #form-buttons {
            display: flex;
            flex-direction: row;
            gap: 12px;
            
            
        }
    }
}

.examples-container {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    margin-right: auto;

    span {
        font-size: 0.9em;
    }

    .examples {
        display: flex;
        flex-direction: row;
        gap: 6px;
        align-items: center;

        .example {
            &.active {
                background-color: #b3b3b3;
            }
        }
    }
}

#top-buttons {
    align-items: flex-start;
}

#bottom-buttons {
    align-items: flex-end;
}

#top-buttons, #bottom-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    
    .btn-group {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;

        .btn-with-desc {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .btn {
                align-self: baseline;
            }

            .btn-desc {
                font-size: 0.7rem;
                color: grey;
            }
        }
    }
}

button#toggle-rdf-btn {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
}

button.submit-btn {
    margin-left: auto;

    &:disabled {
        background-color: grey;
    }
}

a.export-btn, label.import-btn {
    text-decoration: none;
    font-weight: normal;
    font-size: 0.833em;
}

button.modal-btn {
    cursor: pointer;
}

button.add-agent-btn {
    justify-self: baseline;
}

button.delete-agent-btn {
    align-self: center;
}

:deep(.modal-items) {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .modal-item {
        background-color: $bg1;
        padding: 6px;
        border-radius: $borderRadius;
        display: flex;
        flex-direction: column;
        gap: 8px;

        p {
            margin: 0;
            font-size: 0.9em;
            font-style: italic;
        }
    }
}
</style>