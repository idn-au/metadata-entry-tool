<script setup>
import { ref, computed, watch } from "vue";
import FormSection from "@/components/FormSection.vue";
import FormField from "@/components/FormField.vue";
import FormInput from "@/components/FormInput.vue";
import FairScore from "@/components/FairScore.vue";
import CareScore from "@/components/CareScore.vue";
import RDFPreview from "@/components/RDFPreview.vue";

const urlProtocolOptions = [
    {
        value: "http",
        label: "http"
    },
    {
        value: "https",
        label: "https"
    },
    {
        value: "ftp",
        label: "ftp"
    },
    {
        value: "sftp",
        label: "sftp"
    },
    {
        value: "ftps",
        label: "ftps"
    },
    {
        value: "ssh",
        label: "ssh"
    },
];

const agentOptions = [
    {
        value: "1",
        label: "1"
    },
    {
        value: "2",
        label: "2"
    },
    {
        value: "3",
        label: "3"
    },
    {
        value: "new",
        label: "+ Enter a new agent"
    },
];

const roleOptions = [
    {
        value: "1",
        label: "1"
    },
    {
        value: "2",
        label: "2"
    },
    {
        value: "3",
        label: "3"
    },
];

const themeOptions = [
    {
        value: "1",
        label: "1"
    },
    {
        value: "2",
        label: "2"
    },
    {
        value: "3",
        label: "3"
    },
];

const licenseOptions = [
    {
        value: "creativeCommons",
        label: "Creative Commons"
    },
    {
        value: "new",
        label: "+ Enter a new license"
    },
];

const accessRightsOptions = [
    {
        value: "metadataOnly",
        label: "Metadata only"
    },
];

const showRDF = ref(false);
const loading = ref({
    accessUrl: false
});
const urlProtocol = ref("");

const data = ref({
    iri: "",
    assignIri: false,
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

const btnRef = ref(null);

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

const empty = computed(() => {
    return Object.values(data.value).find(item => item !== "" && item !== [] && item !== false) === undefined;
});

const genIri = computed(() => {
    if (data.value.iri === "") {
        return "\n\n<http://example.com/exampleiri> a dcat:Resource ;";
    } else {
        return `\n\n<${data.value.iri}> a dcat:Resource ;`;
    }
});

const rdfData = computed(() => {
    let g = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

    let node = "";

    if (!empty.value) {
        node += genIri.value;
    }

    if (data.value.title !== "") {
        node += `\n\tdcterms:title "${data.value.title}" ;`;
    }

    if (data.value.description !== "") {
        node += `\n\tdcterms:description """${data.value.description}""" ;`;
    }

    if (data.value.created !== "") {
        node += `\n\tdcterms:created "${data.value.created}"^^xsd:date ;`;
    }

    if (data.value.modified !== "") {
        node += `\n\tdcterms:modified "${data.value.modified}"^^xsd:date ;`;
    }

    if (data.value.issued !== "") {
        node += `\n\tdcterms:issued "${data.value.issued}"^^xsd:date ;`;
    }

    if (node !== "") {
        node += `\n.`;
    }
    
    g += node;
    
    return g;
});

const fairScore = computed(() => {
    let score = {
        f: 0,
        a: 0,
        i: 0,
        r: 0
    }

    if (data.value.iri !== "") {
        score.f = 2;
        score.i = 1;
    }

    if (data.value.title !== "") {
        score.a = 3;
    }

    if (data.value.description !== "") {
        score.r = 2;
    }

    return score;
});

const careScore = computed(() => {
    let score = {
        c: 0,
        a: 0,
        r: 0,
        e: 0
    }

    if (data.value.created !== "") {
        score.c = 3;
        
    }

    if (data.value.modified !== "") {
        score.a = 2;
    }

    if (data.value.issued !== "") {
        score.r = 4;
        score.e = 1;
    }

    return score;
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

const isValid = computed(() => {
    return Object.values(validationMessages.value).find(item => item.length === 0) === undefined;
});

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

function toggleRDF() {
    showRDF.value = !showRDF.value;

    // for Font Awesome SVG icons (can't dynamically change icons on class)
    const svg = btnRef.value.lastElementChild;
    svg.setAttribute("data-icon", showRDF.value ? "chevron-right" : "chevron-left");
}
</script>

<template>
    <div id="metadata-container">
        <div id="metadata-header">
            <div id="metadata-title">
                <h2>Metadata Submission Form</h2>
                <button id="toggle-rdf-btn" class="btn outline" ref="btnRef" @click="toggleRDF">
                    <span><template v-if="showRDF">Hide</template><template v-else>Show</template> RDF</span>
                    <i :class="`fa-regular fa-chevron-${showRDF ? 'right' : 'left'}`"></i>
                </button>
            </div>
            <div id="metadata-desc">
                <p>
                    Fill out the form below to submit to the IDN. FAIR and CARE scores will be updated live as the fields are filled out. The generated RDF can optionally be viewed on the right.
                </p>
            </div>
        </div>
        <div id="metadata-body" :class="`${showRDF ? 'show-rdf' : ''}`">
            <div class="metadata-col" id="metadata-form">
                <div class="col-header">
                    <h3>Form</h3>
                </div>
                <div class="col-body" id="form-items">
                    <FormSection :defaultOpen="true">
                        <FormField>
                            <FormInput
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
                                <FormInput
                                    label="Assign IRI"
                                    type="checkbox"
                                    id="assignIRI"
                                    v-model="data.assignIri"
                                    @onBlur="clearValidate('iri')"
                                />
                            </template>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Title"
                                type="text"
                                id="title"
                                :required="true"
                                @onBlur="clearValidate('title'); validateIsEmpty('title', 'Title must not be empty')"
                                v-model="data.title"
                                :invalidMessage="validationMessages.title"
                                :clearButton="true"
                            >
                            </FormInput>
                        </FormField>
                        <FormField :span="2">
                            <FormInput
                                label="Description"
                                type="textarea"
                                id="description"
                                v-model="data.description"
                            >
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Dates">
                        <FormField>
                            <FormInput
                                label="Created"
                                type="date"
                                id="created"
                                :required="true"
                                @onBlur="clearValidate('created'); validateIsEmpty('created', 'Created date must not be empty')"
                                v-model="data.created"
                                :invalidMessage="validationMessages.created"
                                :clearButton="true"
                            >
                            </FormInput>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Modified"
                                type="date"
                                id="modified"
                                :required="true"
                                @onBlur="clearValidate('modified'); validateIsEmpty('modified', 'Modified date must not be empty')"
                                v-model="data.modified"
                                :invalidMessage="validationMessages.modified"
                                :clearButton="true"
                            >
                            </FormInput>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Issued"
                                type="date"
                                id="issued"
                                v-model="data.issued"
                                :clearButton="true"
                            >
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Rights">
                        <FormField>
                            <FormInput
                                label="License"
                                type="select"
                                id="license"
                                v-model="data.license"
                                :clearButton="true"
                                :options="licenseOptions"
                            >
                            </FormInput>
                            <template #bottom>
                                <FormInput
                                    v-if="data.license === 'new'"
                                    label="Enter a new license"
                                    type="text"
                                    v-model="data.customLicense"
                                    :clearButton="true"
                                />
                            </template>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Rights"
                                type="text"
                                id="rights"
                                v-model="data.rights"
                                :clearButton="true"
                            >
                            </FormInput>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Access Rights"
                                type="select"
                                id="accessRights"
                                v-model="data.accessRights"
                                :clearButton="true"
                                :options="accessRightsOptions"
                                placeholder="placeholder"
                            >
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Spatio/Temporal">
                        <FormField label="Spatial geometry">
                            <FormInput
                                label="Geometry"
                                type="text"
                                v-model="data.spatialGeom"
                                :clearButton="true"
                                placeholder="e.g. POLYGON ((1234 1234, 1235 1245))"
                                :disabled="data.useSpatialIri"
                                description="Must be WKT format"
                                @onBlur="clearValidate('spatialGeom'); validateMatchRegex('spatialGeom', /^\w+\s?\(.+\)$/, 'Invalid WKT')"
                                :invalidMessage="validationMessages.spatialGeom"
                            >
                            </FormInput>
                            <template #bottom>
                                <FormInput
                                    label="Use spatial IRI"
                                    type="checkbox"
                                    v-model="data.useSpatialIri"
                                >
                                </FormInput>
                                <FormInput
                                    label="Spatial IRI"
                                    type="url"
                                    v-model="data.spatialIri"
                                    :clearButton="true"
                                    placeholder="e.g. http://example.com/1234"
                                    :disabled="!data.useSpatialIri"
                                    description="Must be a valid IRI"
                                    @onBlur="clearValidate('spatialIri'); validateMatchRegex('spatialIri', /https?:\/\/.+/, 'Invalid IRI')"
                                    :invalidMessage="validationMessages.spatialIri"
                                >
                                </FormInput>
                            </template>
                        </FormField>
                        <FormField label="Temporal">
                            <FormInput
                                label="Start"
                                type="date"
                                v-model="data.temporalStart"
                                :clearButton="true"
                            >
                            </FormInput>
                            <template #bottom>
                                <FormInput
                                    label="End"
                                    type="date"
                                    v-model="data.temporalEnd"
                                    :clearButton="true"
                                >
                                </FormInput>
                            </template>
                        </FormField>
                    </FormSection>
                    <FormSection title="Distribution Info">
                        <FormField>
                            <FormInput
                                label="Access URL"
                                type="url"
                                id="accessUrl"
                                description="Must be a reachable URL"
                                placeholder="e.g. http://example.com/1234"
                                @onBlur="clearValidate('accessUrl'); validateStatus200('accessUrl', 'accessUrl', 'Access URL is unreachable')"
                                v-model="data.accessUrl"
                                :invalidMessage="validationMessages.accessUrl"
                                :clearButton="true"
                            >
                                <template #prepend>
                                    <FormInput
                                        type="select"
                                        id="protocol"
                                        v-model="urlProtocol"
                                        :options="urlProtocolOptions"
                                    />
                                </template>
                                <template #append v-if="loading.accessUrl">
                                    <span><i class="fa-regular fa-spinner-third"></i></span>
                                </template>
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Agent Info">
                        <FormField>
                            <FormInput
                                label="Agent"
                                type="select"
                                id="agent"
                                v-model="data.agent"
                                :clearButton="true"
                                :options="agentOptions"
                            >
                            </FormInput>
                            <template #bottom v-if="data.agent === 'new'">
                                <FormInput
                                    label="Enter a new agent"
                                    type="text"
                                    v-model="data.customAgent"
                                    :clearButton="true"
                                />
                            </template>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Role"
                                type="select"
                                id="role"
                                v-model="data.role"
                                :clearButton="true"
                                :options="roleOptions"
                            >
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Theme">
                        <FormField>
                            <FormInput
                                label="Theme"
                                type="select"
                                id="theme"
                                v-model="data.themes"
                                :clearButton="true"
                                :options="themeOptions"
                                :multiple="true"
                            >
                            </FormInput>
                        </FormField>
                    </FormSection>
                    <FormSection title="Contact Details">
                        <FormField>
                            <FormInput
                                label="Name"
                                type="text"
                                id="contactName"
                                v-model="data.contactName"
                                :clearButton="true"
                            >
                            </FormInput>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Email"
                                type="email"
                                id="contactEmail"
                                v-model="data.contactEmail"
                                :clearButton="true"
                            >
                            </FormInput>
                        </FormField>
                        <FormField>
                            <FormInput
                                label="Phone"
                                type="tel"
                                id="contactPhone"
                                v-model="data.contactPhone"
                                :clearButton="true"
                            >
                            </FormInput>
                        </FormField>
                    </FormSection>
                </div>
            </div>
            <div class="metadata-col" id="metadata-scores">
                <div class="col-header">
                    <h3>Scores</h3>
                </div>
                <div class="col-body">
                    <FairScore :score="fairScore" />
                    <CareScore :score="careScore" />
                </div>
            </div>
            <div class="metadata-col" id="metadata-rdf">
                <div class="col-header">
                    <h3>RDF</h3>
                </div>
                <div class="col-body">
                    <RDFPreview :data="rdfData" />
                </div>
            </div>
        </div>
        <div id="metadata-footer">
            <div>
                declaration
            </div>
            <button class="btn primary">Submit</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
$gap: 16px;
$padding: 12px;

#metadata-container {
    display: flex;
    flex-direction: column;
    gap: $gap;
    background-color: #e7e7e7;
    border-radius: 6px;

    #metadata-header {
        display: flex;
        flex-direction: column;
        padding: $padding;

        #metadata-title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

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
            grid-template-rows: 40px 1fr;
            grid-template-columns: 100%;
            gap: $padding;
            padding: $padding;
            transition: width 0.2s ease-in-out, margin 0.2s ease-in-out, padding 0.2s ease-in-out;

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
        flex-direction: row;
        justify-content: space-between;
        padding: $padding;
    }
}
</style>