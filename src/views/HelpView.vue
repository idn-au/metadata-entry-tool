<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { faCircle as faCircleRegular, faCircleXmark, faCircleCheck, faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import helpImage from "@/assets/images/MetadataCreatorPage-HELP-Image.png";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const headingAnchors = [
    "introduction",
    "metadatacreationtool",
    "completingmetadatarecord"
];
const accordionAnchors = [
    "general",
    "agentinformation",
    "dates",
    "rights",
    "spatiotemporal",
    "distribution",
    "theme",
    "contactdetails"
];

const route = useRoute();

const accordionActive = ref("");

function scrollToAnchor(hash) {
    if (hash) {
        const hashString = hash.substring(1);
        if ([...headingAnchors, ...accordionAnchors].includes(hashString)) {
            if (accordionAnchors.includes(hashString)) {
                accordionActive.value = hashString;
            }
            nextTick(() => {
                document.getElementById(hashString).scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }
    } else {
        // accordionActive.value = "";
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

watch(() => route.hash, (newValue, oldValue) => {
    scrollToAnchor(newValue);
});

onMounted(() => {
    scrollToAnchor(route.hash);
});
</script>

<template>
    <h2>Help Page</h2>
    <div class="top-row">
        <div class="table-of-contents" :style="{flexGrow: '1'}">
            <h5>Contents</h5>
            <ul>
                <li><RouterLink to="/help#introduction">Introduction</RouterLink></li>
                <li><RouterLink to="/help#metadatacreationtool">The Metadata Creation Tool</RouterLink></li>
                <li>
                    <RouterLink to="/help#completingmetadatarecord">Completing a metadata record for your data</RouterLink>
                    <ul>
                        <li><RouterLink to="/help#general">General</RouterLink></li>
                        <li><RouterLink to="/help#agentinformation">Agent Information</RouterLink></li>
                        <li><RouterLink to="/help#dates">Dates</RouterLink></li>
                        <li><RouterLink to="/help#rights">Rights for accessing this dataset</RouterLink></li>
                        <li><RouterLink to="/help#spatiotemporal">Spatio/Temporal (Where and When)</RouterLink></li>
                        <li><RouterLink to="/help#distribution">Distribution Information</RouterLink></li>
                        <li><RouterLink to="/help#theme">Theme</RouterLink></li>
                        <li><RouterLink to="/help#contactdetails">Contact Details</RouterLink></li>
                    </ul>
                </li>
            </ul>
        </div>
        <div>
            <h3 id="introduction">Introduction</h3>
            <p>To catalogue Indigenous data, the metadata describing the data needs to be collected, described, and stored in a standardised way to be machine readable and consistent for enabling search.</p>
            <p>The metadata for Indigenous Data discovery needs to incorporate specific elements to identify the Indigeneity of the data and we have trialled the following as a starting point:</p>
            <ul>
                <li>Data Agents - a person or organisation that has been registered in the IDN Data Agents Database that holds or has created an Indigenous Data Asset</li>
                <li>Themes - Indigenous Demographics, Indigenous Languages, and other terms to be drawn from the IDN Theme vocabulary.</li>
            </ul>
        </div>
    </div>
    <h3 id="metadatacreationtool">The Metadata Creation Tool</h3>
    <p>With this tool you can describe your data using the metadata elements described in the <a href="https://data.idnau.org/pid/cp/guide" target="_blank" rel="noopener noreferrer">IDN Catalogue Profile Guidance</a>.</p>
    <p>You can download your completed metadata record in RDF and, if appropriate, submit the metadata record to catalogue your Indigenous Data in the IDN Data Catalogue. <em>Note that this will require pre-registration in the IDN Agents Database before the IDN can accept the metadata record.</em></p>
    <div class="section-split">
        <div class="subsection">
            <img :src="helpImage" alt="Screenshot of the Metadata Entry tool with step numbers">
        </div>
        <div class="subsection fill">
            <div class="grid-list">
                <span class="grid-list-number">
                    <font-awesome-layers fixed-width>
                        <font-awesome-icon :icon="faCircleRegular" />
                        <font-awesome-layers-text value="1" transform="shrink-6" />
                    </font-awesome-layers>
                </span>
                <div>If this is the first time you have attempted to use the Metadata Creation Tool, please run through the tutorial first to get a feel for the sections on the MCT page. This will highlight the different sections of the page that you may be completing or interacting with.</div>
                <span class="grid-list-number">
                    <font-awesome-layers fixed-width>
                        <font-awesome-icon :icon="faCircleRegular" />
                        <font-awesome-layers-text value="2" transform="shrink-6" />
                    </font-awesome-layers>
                </span>
                <div>
                    <div class="icon-grid">
                        <div><font-awesome-icon :icon="faCircleXmark" :style="{color: 'red'}" /></div><div>means this tab must be completed and is not valid</div>
                        <div><font-awesome-icon :icon="faCircleCheck" :style="{color: 'grey'}" /></div><div>means that this tab should be completed but is not mandatory for a valid record.</div>
                        <div><font-awesome-icon :icon="faCircleCheck" :style="{color: 'green'}" /></div><div>means this tab has been completed successfully</div>
                    </div>
                </div>
                <span class="grid-list-number">
                    <font-awesome-layers fixed-width>
                        <font-awesome-icon :icon="faCircleRegular" />
                        <font-awesome-layers-text value="3" transform="shrink-6" />
                    </font-awesome-layers>
                    +
                    <font-awesome-layers fixed-width>
                        <font-awesome-icon :icon="faCircleRegular" />
                        <font-awesome-layers-text value="4" transform="shrink-6" />
                    </font-awesome-layers>
                </span>
                <div>As you describe your data, the <a href="https://idnau.org/resources/faircare" target="_blank" rel="noopener noreferrer">FAIR and CARE data score</a> is indicated in the circular scores.</div>
                <span class="grid-list-number">
                    <font-awesome-layers fixed-width>
                        <font-awesome-icon :icon="faCircleRegular" />
                        <font-awesome-layers-text value="5" transform="shrink-6" />
                    </font-awesome-layers>
                </span>
                <div>Save a draft copy of your metadata record to your browser to continue later. This will stay in your browser until cleared.</div>
                <span class="grid-list-number">
                    <font-awesome-layers fixed-width>
                        <font-awesome-icon :icon="faCircleRegular" />
                        <font-awesome-layers-text value="6" transform="shrink-6" />
                    </font-awesome-layers>
                </span>
                <div>Once your record has no <font-awesome-icon :icon="faCircleXmark" :style="{color: 'red'}" /> against a tab it is valid for this profile and can be downloaded to your computer.</div>
                <span class="grid-list-number">
                    <font-awesome-layers fixed-width>
                        <font-awesome-icon :icon="faCircleRegular" />
                        <font-awesome-layers-text value="7" transform="shrink-6" />
                    </font-awesome-layers>
                </span>
                <div>Before you begin a new record (unless you want to clone the record) clear the data.</div>
            </div>
        </div>
    </div>
    <h3 id="completingmetadatarecord">Completing a metadata record for your data</h3>
    <p>There are eight areas of metadata that need to be completed to fully describe the data asset. You are able to limit your description to the fields that have a red asterixis but it is encouraged to complete as much information as you are able.</p>
    <p><font-awesome-icon :icon="faCircleQuestion" /> If you hover over this text you will get a brief description of what should be entered in this field.</p>
    <div class="accordion">
        <div class="section" id="general">
            <div class="section-header" @click="accordionActive === 'general' ? accordionActive = '' : accordionActive = 'general'">
                <h4>General</h4>
                <font-awesome-icon :icon="accordionActive === 'general' ? faChevronUp : faChevronDown" />
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'general' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Basic information about the data.</p>
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                                <th>Data type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>IRI</td>
                                <td>If you already have a persistent (URL) identifier for the data, you can de-select the “Assign IRI” to enter your IRI.</td>
                                <td>URL</td>
                            </tr>
                            <tr>
                                <td>Title</td>
                                <td>This will be how the data is titled and listed in the catalogue. There should be no acronyms in the title.</td>
                                <td>Text</td>
                            </tr>
                            <tr>
                                <td>Indigeneity</td>
                                <td>If the indigeneity of the data is known, use this vocabulary to identify the indigeneity of the data.</td>
                                <td>Pick List</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>This information should fully describe the dataset, how it was created and its intended purpose.</td>
                                <td>Text</td>
                            </tr>
                            <tr>
                                <td colspan="3"><em>Multiple Indigeneity terms can be selected using the tick boxes.</em></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="agentinformation">
            <div class="section-header" @click="accordionActive === 'agentinformation' ? accordionActive = '' : accordionActive = 'agentinformation'">
                <h4>Agent Information</h4>
                <font-awesome-icon :icon="accordionActive === 'agentinformation' ? faChevronUp : faChevronDown" />
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'agentinformation' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Information about the roles that agents (people and organisations) play with respect to this data. These roles are critical in determining whether this data is managed properly. Each Agent <b>must</b> have a matching Role.</p>
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                                <th>Data type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Agent</td>
                                <td>This is the name of the People and/or Organisation that have a role for this data.</td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td>Use Custom Agent</td>
                                <td>If your Agent is not in the pick list, use the “+” button next to the Custom Agent field to open the web form to create a new Agent.</td>
                                <td>Toggle button opens a web form</td>
                            </tr>
                            <tr>
                                <td>Role</td>
                                <td>This is the role that the Agent has in relation to the data.</td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td colspan="3"><em>There can be multiple Agents with Roles, or Agents that have multiple Roles but each Agent must each have a separate line. Select <b>+Add Agent</b> to add another Agent/Role.
If you want to add an Agent that is not in the IDN Agents Database, select “Use Custom Agent” and complete the web form to add a new Agent.</em></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="dates">
            <div class="section-header" @click="accordionActive === 'dates' ? accordionActive = '' : accordionActive = 'dates'">
                <h4>Dates</h4>
                <font-awesome-icon :icon="accordionActive === 'dates' ? faChevronUp : faChevronDown" />
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'dates' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Standard dates for the establishment and update times of this dataset. A dataset about early 20th century data might only have been made last year and the created date is then some time last year. "Issued" indicates when, if ever, this dataset was published.</p>
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                                <th>Data type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Created</td>
                                <td>Date that this dataset was created/started.</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                            <tr>
                                <td>Modified</td>
                                <td>Date that the dataset was updated.</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                            <tr>
                                <td>Issued</td>
                                <td>Date that the dataset was published or distributed.</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="rights">
            <div class="section-header" @click="accordionActive === 'rights' ? accordionActive = '' : accordionActive = 'rights'">
                <h4>Rights for accessing this dataset</h4>
                <font-awesome-icon :icon="accordionActive === 'rights' ? faChevronUp : faChevronDown" />
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'rights' ? 'open' : ''}`">
                <div class="section-body">
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                                <th>Data type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>License</td>
                                <td>This is the legal information for the data. </td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td>License IRI</td>
                                <td>If an online link to the legal notice exists, it should be included here.</td>
                                <td>URL</td>
                            </tr>
                            <tr>
                                <td>Rights</td>
                                <td>This is the Person or Organisation that holds the legal rights to the data.</td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td>Access Rights</td>
                                <td>This is the general description of the access available to the data.</td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td colspan="3"><em>e.g., License=Creative Commons 4, License IRI= https://creativecommons.org/licenses/by/4.0/, Rights = ©University of Melbourne, Access Rights= Metadata Only Access </em></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="spatiotemporal">
            <div class="section-header" @click="accordionActive === 'spatiotemporal' ? accordionActive = '' : accordionActive = 'spatiotemporal'">
                <h4>Spatio/Temporal (Where and When)</h4>
                <font-awesome-icon :icon="accordionActive === 'spatiotemporal' ? faChevronUp : faChevronDown" />
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'spatiotemporal' ? 'open' : ''}`">
                <div class="section-body">
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                                <th>Data type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowspan="2">Spatial Geometry</td>
                                <td>A WKT string is the ASCII representation of a spatial object (coordinate reference) provided in Well Known Text (WKT) </td>
                                <td>WKT string</td>
                            </tr>
                            <tr>
                                <td>A spatial IRI is the standard identifier (URL) link to the location connected to the data.</td>
                                <td>Spatial IRI</td>
                            </tr>
                            <tr>
                                <td rowspan="2">Temporal</td>
                                <td>This is the date the data begins in the dataset (NOT the published date)</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                            <tr>
                                <td>This is the data of the last data in the dataset</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                            <tr>
                                <td colspan="3"><em>e.g., Geographic bounding box enveloping Australia<br/>
WKT:  POLYGON ((96 -45, 96 -9, 168 -9, 168 -45, 96 -45))<br/>
IRI:  https://linked.data.gov.au/dataset/asgsed3/AUS/AUS</em></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="distribution">
            <div class="section-header" @click="accordionActive === 'distribution' ? accordionActive = '' : accordionActive = 'distribution'">
                <h4>Distribution Information</h4>
                <font-awesome-icon :icon="accordionActive === 'distribution' ? faChevronUp : faChevronDown" />
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'distribution' ? 'open' : ''}`">
                <div class="section-body">
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                                <th>Data type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Access URL</td>
                                <td>This is optional information in the form of a publicly resolvable URL that gives the user access to the data.</td>
                                <td>URL</td>
                            </tr>
                            <tr>
                                <td colspan="3"><em>E.g., http://pid.geoscience.gov.au/dataset/ga/130329 gives access to multibeam sonar backscatter data for Beagle Marine Park (Bass Strait).</em></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="theme">
            <div class="section-header" @click="accordionActive === 'theme' ? accordionActive = '' : accordionActive = 'theme'">
                <h4>Theme</h4>
                <font-awesome-icon :icon="accordionActive === 'theme' ? faChevronUp : faChevronDown" />
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'theme' ? 'open' : ''}`">
                <div class="section-body">
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                                <th>Data type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Theme</td>
                                <td>Indigenous Demographics, Indigenous Languages, etc</td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td colspan="3"><em>You can add more than one theme. Select all the themes check-boxes that apply - they will appear in the field separated by a comma.</em></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="contactdetails">
            <div class="section-header" @click="accordionActive === 'contactdetails' ? accordionActive = '' : accordionActive = 'contactdetails'">
                <h4>Contact Details</h4>
                <font-awesome-icon :icon="accordionActive === 'contactdetails' ? faChevronUp : faChevronDown" />
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'contactdetails' ? 'open' : ''}`">
                <div class="section-body">
                    <p>These details are required if you are submitting data to the IDN but are also useful for any metadata record to create a 'point of contact' for the data. This could be a specified subject matter expert if the Agent has also been made a point of contact.</p>
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                                <th>Data type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>First-name_Last-name</td>
                                <td>Text</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>The best email to receive questions about the data and metadata</td>
                                <td>Text@txt.txt etc</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>The best contact phone number</td>
                                <td>Telephone</td>
                            </tr>
                            <tr>
                                <td colspan="3"><em>E.g., Alf Smith, Alfsmith@egsomewhere.com, 1234 567 890</em></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.top-row {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.table-of-contents {
    background-color: $bg1;
    padding: 16px;
    border-radius: $borderRadius;
    flex-shrink: 0;

    h5 {
        margin-top: 0;
    }

    ul {
        margin: 0;
        line-height: 1.4;
        list-style: none;
    }

    & > ul {
        padding-left: 0;
    }

    li > ul {
        padding-left: 32px;
    }
}

.section-split {
    display: flex;
    flex-direction: row;

    .subsection {
        width: 50%;
        padding: 12px;
        display: flex;

        p {
            margin-top: 0;
        }

        &.fill {
            background-color: $bg1;
        }

        img {
            width: 100%;
            margin: auto 0;
        }

        .grid-list {
            display: grid;
            // grid-template-columns: min-content 1fr;
            grid-template-columns: 64px 1fr;
            gap: 8px;
            align-self: baseline;

            .grid-list-number {
                color: #3591e2;
                font-size: 1.2em;
                // text-align: right;
                display: flex;
                justify-content: end;
            }
        }
    }
}

.icon-grid {
    display: grid;
    grid-template-columns: 16px 1fr;
    gap: 6px;
}

.accordion {
    display: flex;
    flex-direction: column;

    .section {
        display: flex;
        flex-direction: column;

        .section-header {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 12px;
            background-color: #f2f2f2;

            h4 {
                margin: 0;
                font-size: 1.1rem;
            }
        }

        .section-body-wrapper {
            height: 0;
            overflow-y: hidden;
            // transition: height 0.2s ease-in-out;

            &.open {
                height: auto;
            }

            .section-body {
                background-color: #fbfbfb;
                padding: 12px;

                table.accordion-table {
                    width: 100%;

                    th, td {
                        padding: 4px;
                    }
                }
            }
        }
    }
}
</style>