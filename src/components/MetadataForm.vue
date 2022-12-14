<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { DataFactory } from "n3";
import { FormField, BaseModal } from "@idn-au/idn-lib";
import PropFormInput from "@/components/PropFormInput.vue";
import FormSection from "@/components/FormSection.vue";
import FairScore from "@/components/FairScore.vue";
import CareScore from "@/components/CareScore.vue";
import RDFPreview from "@/components/RDFPreview.vue";
import { useRdfStore } from "@/composables/rdfStore";
import propDetails from "@/util/props.json";
import { urlProtocolOptions, agentOptions, roleOptions, themeOptions, licenseOptions, accessRightsOptions } from "@/util/formOptions";
import exampleData from "@/util/exampleData.json";

const { namedNode, literal } = DataFactory;

const defaultIri = "https://example.com/someIRI";

const { store, qname, serialize } = useRdfStore();

const spatialBnode = store.value.createBlankNode();
const temporalBnode = store.value.createBlankNode();
const distributionBnode = store.value.createBlankNode();
const qualifiedBnode = store.value.createBlankNode();

const showRDF = ref(false);
const loading = ref({
    accessUrl: false
});
const urlProtocol = ref("");
const data = ref({
    iri: "",
    assignIri: true,
    title: "",
    description: "",
    created: "",
    modified: "",
    issued: "",
    license: "",
    customLicense: "",
    rights: "",
    accessRights: "",
    spatialGeom: "",
    useSpatialIri: false,
    spatialIri: "",
    temporalStart: "",
    temporalEnd: "",
    accessUrl: "",
    agent: "",
    customAgent: "",
    role: "",
    themes: [],
    contactName: "",
    contactEmail: "",
    contactPhone: ""
});
const validationMessages = ref({
    iri: [],
    title: [],
    created: [],
    modified: [],
    spatialGeom: [],
    spatialIri: [],
    accessUrl: []
});
const serializedData = ref("");
const modal = ref(null);
const hasSavedDraft = ref(false);

const calcIri = computed(() => {
    return data.value.assignIri ? defaultIri : data.value.iri;
});

const calcGeometry = computed(() => {
    return data.value.useSpatialIri ? data.value.spatialIri : data.value.spatialGeom;
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

const isValid = computed(() => {
    return Object.values(validationMessages.value).find(item => item.length === 0) === undefined;
});

watch(() => calcIri.value, (newValue, oldValue) => {
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

watch(() => data.value.license, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:license", namedNode(newValue));
});

watch(() => data.value.rights, (newValue, oldValue) => {
    updateTriple(newValue, "dcterms:rights", literal(newValue, namedNode(qname("xsd:string"))));
});

watch(() => data.value.accessRights, (newValue, oldValue) => {
    updateTriple(newValue, "dcat:accessRights", namedNode(newValue));
});

watch(() => calcGeometry.value, (newValue, oldValue) => {
    const dataset = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
    const spatialQuads = store.value.getQuads(dataset, namedNode(qname("dcterms:spatial")), null);
    if (spatialQuads.length > 0 && spatialQuads[0].object.termType === "BlankNode") {
        const bnodeQuads = store.value.getQuads(spatialQuads[0].object, null, null);
        store.value.removeQuads(bnodeQuads);
    }
    store.value.removeQuads(spatialQuads);

    if (data.value.useSpatialIri) {
        updateTriple(newValue, "dcterms:spatial", namedNode(newValue));
    } else {
        if (newValue !== "") {
            store.value.addQuad(dataset, namedNode(qname("dcterms:spatial")), spatialBnode);
            store.value.addQuad(spatialBnode, namedNode(qname("a")), namedNode(qname("geo:Geometry")));
            store.value.addQuad(spatialBnode, namedNode(qname("geo:asWKT")), literal(newValue, namedNode(qname("geo:wktLiteral"))));
        }

        serializedData.value = serialize();
    }
});

watch(() => data.value.temporalStart, (newValue, oldValue) => {
    const dataset = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
    const temporalQuads = store.value.getQuads(dataset, namedNode(qname("dcterms:temporal")), null);
    if (temporalQuads.length > 0 && temporalQuads[0].object.termType === "BlankNode") {
        const bnodeQuads1 = store.value.getQuads(temporalQuads[0].object, namedNode(qname("prov:startedAtTime")), null);
        store.value.removeQuads(bnodeQuads1);
        const bnodeQuads2 = store.value.getQuads(temporalQuads[0].object, null, null);
        if (bnodeQuads2.length === 0) {
            store.value.removeQuads(temporalQuads);
        }
    }

    if (newValue !== "") {
        store.value.addQuad(dataset, namedNode(qname("dcterms:temporal")), temporalBnode);
        store.value.addQuad(temporalBnode, namedNode(qname("prov:startedAtTime")), literal(newValue, namedNode(qname("xsd:date"))));
    }
    serializedData.value = serialize();
});

watch(() => data.value.temporalEnd, (newValue, oldValue) => {
    const dataset = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
    const temporalQuads = store.value.getQuads(dataset, namedNode(qname("dcterms:temporal")), null);
    if (temporalQuads.length > 0 && temporalQuads[0].object.termType === "BlankNode") {
        const bnodeQuads = store.value.getQuads(temporalQuads[0].object, namedNode(qname("prov:endedAtTime")), null);
        store.value.removeQuads(bnodeQuads);
        const bnodeQuads2 = store.value.getQuads(temporalQuads[0].object, null, null);
        if (bnodeQuads2.length === 0) {
            store.value.removeQuads(temporalQuads);
        }
    }

    if (newValue !== "") {
        store.value.addQuad(dataset, namedNode(qname("dcterms:temporal")), temporalBnode);
        store.value.addQuad(temporalBnode, namedNode(qname("prov:endedAtTime")), literal(newValue, namedNode(qname("xsd:date"))));
    }
    serializedData.value = serialize();
});

watch(() => data.value.accessUrl, (newValue, oldValue) => {
    const dataset = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
    const distQuads = store.value.getQuads(dataset, namedNode(qname("dcat:distribution")), null);
    if (distQuads.length > 0 && distQuads[0].object.termType === "BlankNode") {
        const bnodeQuads = store.value.getQuads(distQuads[0].object, null, null);
        store.value.removeQuads(bnodeQuads);
    }
    store.value.removeQuads(distQuads);

    if (newValue !== "") {
        store.value.addQuad(dataset, namedNode(qname("dcat:distribution")), distributionBnode);
        store.value.addQuad(distributionBnode, namedNode(qname("dcat:accessURL")), literal(newValue, namedNode(qname("xsd:anyURI"))));
    }

    serializedData.value = serialize();
});

watch(() => data.value.themes, (newValue, oldValue) => {
    const dataset = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
    const themeQuads = store.value.getQuads(dataset, namedNode(qname("dcat:theme")), null);
    store.value.removeQuads(themeQuads);
    if (newValue.length > 0) {
        newValue.forEach(theme => store.value.addQuad(dataset, namedNode(qname("dcat:theme")), namedNode(theme)));
    }
    serializedData.value = serialize();
});

watch(() => data.value.agent, (newValue, oldValue) => {
    const dataset = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
    const qualifiedQuads = store.value.getQuads(dataset, namedNode(qname("prov:qualifiedAttribution")), null);
    if (qualifiedQuads.length > 0 && qualifiedQuads[0].object.termType === "BlankNode") {
        const bnodeQuads1 = store.value.getQuads(qualifiedQuads[0].object, namedNode(qname("prov:agent")), null);
        store.value.removeQuads(bnodeQuads1);
        const bnodeQuads2 = store.value.getQuads(qualifiedQuads[0].object, null, null);
        if (bnodeQuads2.length === 0) {
            store.value.removeQuads(qualifiedQuads);
        }
    }

    if (newValue !== "") {
        store.value.addQuad(dataset, namedNode(qname("prov:qualifiedAttribution")), qualifiedBnode);
        store.value.addQuad(qualifiedBnode, namedNode(qname("prov:agent")), namedNode(newValue));
    }
    serializedData.value = serialize();
});

watch(() => data.value.role, (newValue, oldValue) => {
    const dataset = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
    const qualifiedQuads = store.value.getQuads(dataset, namedNode(qname("prov:qualifiedAttribution")), null);
    if (qualifiedQuads.length > 0 && qualifiedQuads[0].object.termType === "BlankNode") {
        const bnodeQuads = store.value.getQuads(qualifiedQuads[0].object, namedNode(qname("dcat:hadRole")), null);
        store.value.removeQuads(bnodeQuads);
        const bnodeQuads2 = store.value.getQuads(qualifiedQuads[0].object, null, null);
        if (bnodeQuads2.length === 0) {
            store.value.removeQuads(qualifiedQuads);
        }
    }

    if (newValue !== "") {
        store.value.addQuad(dataset, namedNode(qname("prov:qualifiedAttribution")), qualifiedBnode);
        store.value.addQuad(qualifiedBnode, namedNode(qname("dcat:hadRole")), namedNode(newValue));
    }
    serializedData.value = serialize();
});

watch(
    () => data.value.accessUrl,
    (newValue, oldValue) => {
        let protocol = newValue.split("://")[0];
        if (!newValue.match(/\w+?:\/\//) && urlProtocol.value === "") {
            urlProtocol.value = "http";
        } else if (urlProtocolOptions.map(option => option.value).includes(newValue.split("://")[0])) {
            urlProtocol.value = protocol;
        }
    }
);

function updateTriple(value, predQname, object) {
    const dataset = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("dcat:Dataset")))[0];
    const quads = store.value.getQuads(dataset, namedNode(qname(predQname)), null);
    store.value.removeQuads(quads);
    if (value !== "") {
        store.value.addQuad(dataset, namedNode(qname(predQname)), object);
    }
    serializedData.value = serialize();
}

function clearValidate(key) {
    validationMessages.value[key] = [];
}

function validateIsEmpty(key, message) {
    if (data.value[key] === "" || data.value[key] === [] || data.value[key] === false) {
        validationMessages.value[key].push(message);
    }
};

function validateMatchRegex(key, exp, message) {
    if (!data.value[key].match(exp)) {
        validationMessages.value[key].push(message);
    }
}

function validateStatus200(key, loadingKey, message) {
    if (data.value[key] !== "") {
        loading.value[loadingKey] = true;

        // if (!data.value[key].match(/\w+?:\/\//)){
        //     data.value[key] = "http://" + data.value[key];
        // }

        fetch(data.value[key], {
            method: "HEAD",
            mode: "no-cors"
        })
        .catch(e => {
            validationMessages.value[key].push(message);
        });

        loading.value[loadingKey] = false;
    }
}

function loadRDF(e) {
    const { format, value } = e;
    const { store: loadedStore, qname: loadedQname, parseIntoStore: loadedParseIntoStore, serialize: loadedSerialize } = useRdfStore();
    clearData();
    loadedParseIntoStore(value, format);
    const subject = loadedStore.value.getSubjects(namedNode(qname("a")), namedNode(loadedQname("dcat:Dataset")))[0];
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
            } else {
                const bnodes = loadedStore.value.getQuads(q.object, namedNode(loadedQname("geo:asWKT")), null);
                data.value.spatialGeom = bnodes[0].object.value;
            }
        } else if (q.predicate.value === loadedQname("dcterms:temporal")) {
            loadedStore.value.forEach(q1 => {
                if (q1.predicate.value === loadedQname("prov:startedAtTime")) {
                    data.value.temporalStart = q1.object.value;
                } else if (q1.predicate.value === loadedQname("prov:endedAtTime")) {
                    data.value.temporalEnd = q1.object.value;
                }
            }, q.object, null, null);
        } else if (q.predicate.value === loadedQname("dcat:distribution")) {
            const bnodes = loadedStore.value.getQuads(q.object, namedNode(loadedQname("dcat:accessURL")), null);
            data.value.accessUrl = bnodes[0].object.value;
        } else if (q.predicate.value === loadedQname("dcat:theme")) {
            data.value.themes.push(q.object.value);
        }
    }, subject, null, null);
}

function clearData() {
    data.value = {
        iri: "",
        assignIri: true,
        title: "",
        description: "",
        created: "",
        modified: "",
        issued: "",
        license: "",
        customLicense: "",
        rights: "",
        accessRights: "",
        spatialGeom: "",
        useSpatialIri: false,
        spatialIri: "",
        temporalStart: "",
        temporalEnd: "",
        accessUrl: "",
        agent: "",
        customAgent: "",
        role: "",
        themes: [],
        contactName: "",
        contactEmail: "",
        contactPhone: ""
    };
    validationMessages.value = {
        iri: [],
        title: [],
        created: [],
        modified: [],
        spatialGeom: [],
        spatialIri: [],
        accessUrl: []
    };
}

function saveDraft() {
    localStorage.setItem("data", JSON.stringify(data.value));
    hasSavedDraft.value = true;
}

function deleteDraft() {
    localStorage.removeItem("data");
    hasSavedDraft.value = false;
}

function loadExample(key) {
    data.value = exampleData[key];
}

onMounted(() => {
    const savedData = localStorage.getItem("data");
    if (savedData) {
        data.value = JSON.parse(savedData);
        hasSavedDraft.value = true;
    } else {
        store.value.addQuad(namedNode(defaultIri), namedNode(qname("a")), namedNode(qname("dcat:Dataset")));
        serializedData.value = serialize();
    }
});
</script>

<template>
    <div id="metadata-container">
        <div id="metadata-header">
            <div id="metadata-title">
                <button class="btn primary outline tutorial-btn" title="Coming soon" disabled>Start Tutorial</button>
                <div class="examples-container">
                    <span>Load examples: </span>
                    <div class="examples">
                        <button class="btn example sm" v-for="example in Object.keys(exampleData)" @click="loadExample(example)">{{ example }}</button>
                    </div>
                </div>
                <button id="toggle-rdf-btn" class="btn outline" @click="showRDF = !showRDF">
                    <span><template v-if="showRDF">Hide</template><template v-else>Show</template> RDF</span>
                    <i :class="`fa-regular fa-chevron-${showRDF ? 'right' : 'left'}`"></i>
                </button>
            </div>
        </div>
        <div id="metadata-body" :class="`${showRDF ? 'show-rdf' : ''}`">
            <div class="metadata-col" id="metadata-form">
                <div class="col-body" id="form-items">
                    <FormSection :defaultOpen="true" title="General">
                        <FormField>
                            <PropFormInput
                                label="IRI"
                                type="url"
                                id="iri"
                                tooltip="An IRI is like an identifier for this resource"
                                description="Provide an IRI or choose to have an IRI automatically assigned"
                                placeholder="e.g. http://example.com/1234"
                                :required="true"
                                @onBlur="clearValidate('iri'); validateIsEmpty('iri', 'IRI must not be empty'); validateMatchRegex('iri', /https?:\/\/.+/, 'Invalid IRI')"
                                v-model="data.iri"
                                :invalidMessage="validationMessages.iri"
                                :clearButton="true"
                                :disabled="data.assignIri"
                            />
                            <template #bottom>
                                <PropFormInput
                                    label="Assign IRI"
                                    type="checkbox"
                                    id="assignIRI"
                                    v-model="data.assignIri"
                                    @onBlur="clearValidate('iri')"
                                />
                            </template>
                        </FormField>
                        <FormField>
                            <PropFormInput
                                label="Title"
                                type="text"
                                id="title"
                                :propTooltip="propDetails.title"
                                :required="true"
                                @onBlur="clearValidate('title'); validateIsEmpty('title', 'Title must not be empty')"
                                v-model="data.title"
                                :invalidMessage="validationMessages.title"
                                :clearButton="true"
                            >
                            </PropFormInput>
                        </FormField>
                        <FormField :span="2">
                            <PropFormInput
                                label="Description"
                                type="textarea"
                                id="description"
                                :propTooltip="propDetails.description"
                                v-model="data.description"
                                description="Supports new lines and basic formatting"
                            >
                            </PropFormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Agent Info" description="This is a desc">
                        <FormField>
                            <PropFormInput
                                label="Agent"
                                type="select"
                                id="agent"
                                :propTooltip="propDetails.agent"
                                v-model="data.agent"
                                :clearButton="true"
                                :options="agentOptions"
                            >
                            </PropFormInput>
                            <template #bottom v-if="data.agent === 'new'">
                                <PropFormInput
                                    label="Enter a new agent"
                                    type="text"
                                    v-model="data.customAgent"
                                    :clearButton="true"
                                />
                            </template>
                        </FormField>
                        <FormField>
                            <PropFormInput
                                label="Role"
                                type="select"
                                id="role"
                                :propTooltip="propDetails.role"
                                v-model="data.role"
                                :clearButton="true"
                                :options="roleOptions"
                            >
                                <template #append>
                                    <button class="modal-btn" @click="modal = 'agentRole'" title="Role info">
                                        <i class="fa-regular fa-circle-info"></i>
                                    </button>
                                    <BaseModal v-if="modal === 'agentRole'" @modalClosed="modal = null">
                                        <template #headerMiddle>
                                            <h3>Agent Roles</h3>
                                        </template>
                                        <p>Role info</p>
                                    </BaseModal>
                                </template>
                            </PropFormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Dates">
                        <FormField>
                            <PropFormInput
                                label="Created"
                                type="date"
                                id="created"
                                :required="true"
                                :propTooltip="propDetails.created"
                                @onBlur="clearValidate('created'); validateIsEmpty('created', 'Created date must not be empty')"
                                v-model="data.created"
                                :invalidMessage="validationMessages.created"
                                :clearButton="true"
                            >
                            </PropFormInput>
                        </FormField>
                        <FormField>
                            <PropFormInput
                                label="Modified"
                                type="date"
                                id="modified"
                                :required="true"
                                :propTooltip="propDetails.modified"
                                @onBlur="clearValidate('modified'); validateIsEmpty('modified', 'Modified date must not be empty')"
                                v-model="data.modified"
                                :invalidMessage="validationMessages.modified"
                                :clearButton="true"
                            >
                            </PropFormInput>
                        </FormField>
                        <FormField>
                            <PropFormInput
                                label="Issued"
                                type="date"
                                id="issued"
                                :propTooltip="propDetails.issued"
                                v-model="data.issued"
                                :clearButton="true"
                            >
                            </PropFormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Rights">
                        <FormField>
                            <PropFormInput
                                label="License"
                                type="select"
                                id="license"
                                :propTooltip="propDetails.license"
                                v-model="data.license"
                                :clearButton="true"
                                :options="licenseOptions"
                            >
                                <template #append>
                                    <button class="modal-btn" @click="modal = 'license'" title="License info">
                                        <i class="fa-regular fa-circle-info"></i>
                                    </button>
                                    <BaseModal v-if="modal === 'license'" @modalClosed="modal = null">
                                        <template #headerMiddle>
                                            <h3>Licenses</h3>
                                        </template>
                                        <p>License info</p>
                                    </BaseModal>
                                </template>
                            </PropFormInput>
                            <!-- <template #bottom>
                                <PropFormInput
                                    v-if="data.license === 'new'"
                                    label="Enter a new license"
                                    type="text"
                                    v-model="data.customLicense"
                                    :clearButton="true"
                                />
                            </template> -->
                        </FormField>
                        <FormField>
                            <PropFormInput
                                label="Rights"
                                type="text"
                                id="rights"
                                :propTooltip="propDetails.rights"
                                v-model="data.rights"
                                :clearButton="true"
                            >
                            </PropFormInput>
                        </FormField>
                        <FormField>
                            <PropFormInput
                                label="Access Rights"
                                type="select"
                                id="accessRights"
                                v-model="data.accessRights"
                                :propTooltip="propDetails.accessRights"
                                :clearButton="true"
                                :options="accessRightsOptions"
                            >
                            </PropFormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Spatio/Temporal">
                        <FormField label="Spatial geometry">
                            <PropFormInput
                                label="Geometry"
                                type="text"
                                v-model="data.spatialGeom"
                                :propTooltip="propDetails.spatialGeometry"
                                :clearButton="true"
                                placeholder="e.g. POLYGON ((1234 1234, 1235 1245))"
                                :disabled="data.useSpatialIri"
                                description="Must be WKT format"
                                @onBlur="clearValidate('spatialGeom'); validateMatchRegex('spatialGeom', /^\w+\s?\(.+\)$/, 'Invalid WKT')"
                                :invalidMessage="validationMessages.spatialGeom"
                            >
                            </PropFormInput>
                            <template #bottom>
                                <PropFormInput
                                    label="Use spatial IRI"
                                    type="checkbox"
                                    id="use-spatial-iri"
                                    v-model="data.useSpatialIri"
                                >
                                </PropFormInput>
                                <PropFormInput
                                    label="Spatial IRI"
                                    type="url"
                                    v-model="data.spatialIri"
                                    :propTooltip="propDetails.spatialIri"
                                    :clearButton="true"
                                    placeholder="e.g. http://example.com/1234"
                                    :disabled="!data.useSpatialIri"
                                    description="Must be a valid IRI"
                                    @onBlur="clearValidate('spatialIri'); validateMatchRegex('spatialIri', /https?:\/\/.+/, 'Invalid IRI')"
                                    :invalidMessage="validationMessages.spatialIri"
                                >
                                </PropFormInput>
                            </template>
                        </FormField>
                        <FormField label="Temporal">
                            <PropFormInput
                                label="Start"
                                type="date"
                                v-model="data.temporalStart"
                                :propTooltip="propDetails.startDate"
                                :clearButton="true"
                            >
                            </PropFormInput>
                            <template #bottom>
                                <PropFormInput
                                    label="End"
                                    type="date"
                                    v-model="data.temporalEnd"
                                    :propTooltip="propDetails.endDate"
                                    :clearButton="true"
                                >
                                </PropFormInput>
                            </template>
                        </FormField>
                    </FormSection>
                    <FormSection title="Distribution Info" description="Providing an access URL is optional, but it must be a publicly resolvable URL if provided.">
                        <FormField>
                            <PropFormInput
                                label="Access URL"
                                type="url"
                                id="accessUrl"
                                :propTooltip="propDetails.accessUrl"
                                description="Must be a reachable URL"
                                placeholder="e.g. http://example.com/1234"
                                @onBlur="clearValidate('accessUrl'); validateStatus200('accessUrl', 'accessUrl', 'Access URL is unreachable')"
                                v-model="data.accessUrl"
                                :invalidMessage="validationMessages.accessUrl"
                                :clearButton="true"
                            >
                                <template #prepend>
                                    <PropFormInput
                                        type="select"
                                        id="protocol"
                                        v-model="urlProtocol"
                                        :options="urlProtocolOptions"
                                    />
                                </template>
                                <template #append v-if="loading.accessUrl">
                                    <span><i class="fa-regular fa-spinner-third"></i></span>
                                </template>
                            </PropFormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Theme">
                        <FormField>
                            <PropFormInput
                                label="Theme"
                                type="select"
                                id="theme"
                                v-model="data.themes"
                                :propTooltip="propDetails.theme"
                                :clearButton="true"
                                :options="themeOptions"
                                :multiple="true"
                            >
                            </PropFormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Contact Details" description="The contact person provided here will be the point of contact for this dataset.">
                        <FormField>
                            <PropFormInput
                                label="Name"
                                type="text"
                                id="contactName"
                                v-model="data.contactName"
                                :clearButton="true"
                            >
                            </PropFormInput>
                        </FormField>
                        <FormField>
                            <PropFormInput
                                label="Email"
                                type="email"
                                id="contactEmail"
                                v-model="data.contactEmail"
                                :clearButton="true"
                            >
                            </PropFormInput>
                        </FormField>
                        <FormField>
                            <PropFormInput
                                label="Phone"
                                type="tel"
                                id="contactPhone"
                                v-model="data.contactPhone"
                                :clearButton="true"
                            >
                            </PropFormInput>
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
                    <RDFPreview :data="serializedData" @import="loadRDF" />
                </div>
            </div>
        </div>
        <div id="metadata-footer">
            <p>
                Form declaration.
            </p>
            <div id="form-buttons">
                <div class="left-buttons">
                    <button class="btn outline" @click="saveDraft" :disabled="empty">Save Draft <i class="fa-regular fa-floppy-disk"></i></button>
                    <button class="btn outline danger" @click="deleteDraft" :disabled="!hasSavedDraft">Delete Draft <i class="fa-regular fa-trash"></i></button>
                    <button class="btn danger" @click="clearData" :disabled="empty">Clear Data <i class="fa-regular fa-delete-left"></i></button>
                    <a
                        class="btn outline export-btn"
                        :href="!empty ? `data:text/turtle;charset=utf-8,${encodeURIComponent(serializedData)}` : null"
                        :download="!empty ? `${data.title || 'metadata'}.ttl` : null"
                        :disabled="empty"
                    >
                        Export <i class="fa-regular fa-file-export"></i>
                    </a>
                </div>
                <button class="btn success lg submit-btn" title="Coming soon" :disabled="true || empty">Submit for review</button>
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

            button#toggle-rdf-btn {
                display: flex;
                flex-direction: row;
                gap: 8px;
                align-items: center;
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
            
            button.submit-btn {
                margin-left: auto;
            }
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

        }
    }
}



.left-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    
    a.export-btn {
        text-decoration: none;
        font-weight: normal;
        font-size: 0.833em;
    }
}

button.modal-btn {
    cursor: pointer;
}
</style>