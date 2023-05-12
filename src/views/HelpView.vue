<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

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
    <div class="table-of-contents">
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
    <h3 id="introduction">Introduction</h3>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, dolorem laboriosam praesentium pariatur ullam incidunt officiis voluptatibus temporibus aliquam earum quaerat, ad assumenda. Quas distinctio ab quis nostrum totam eum.</p>
    <h3 id="metadatacreationtool">The Metadata Creation Tool</h3>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis eligendi cumque placeat. Iste fugit ipsum quis iusto sed similique aut atque quibusdam sapiente, qui quo voluptatibus et accusantium laborum dolorem.</p>
    <div class="section-split">
        <div class="subsection">
            image of tutorial
        </div>
        <div class="subsection fill">
            <div class="grid-list">
                <span class="grid-list-number"><i class="fa-regular fa-circle-1"></i></span>
                <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur, natus pariatur nobis aliquid impedit architecto quam iste, maiores odio quos itaque incidunt labore ad eius reprehenderit. Excepturi impedit quae quisquam?</div>
                <span class="grid-list-number"><i class="fa-regular fa-circle-2"></i></span>
                <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur, natus pariatur nobis aliquid impedit architecto quam iste, maiores odio quos itaque incidunt labore ad eius reprehenderit. Excepturi impedit quae quisquam?</div>
                <span class="grid-list-number"><i class="fa-regular fa-circle-3"></i> + <i class="fa-regular fa-circle-4"></i></span>
                <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur, natus pariatur nobis aliquid impedit architecto quam iste, maiores odio quos itaque incidunt labore ad eius reprehenderit. Excepturi impedit quae quisquam?</div>
                <span class="grid-list-number"><i class="fa-regular fa-circle-5"></i></span>
                <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur, natus pariatur nobis aliquid impedit architecto quam iste, maiores odio quos itaque incidunt labore ad eius reprehenderit. Excepturi impedit quae quisquam?</div>
                <span class="grid-list-number"><i class="fa-regular fa-circle-6"></i></span>
                <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur, natus pariatur nobis aliquid impedit architecto quam iste, maiores odio quos itaque incidunt labore ad eius reprehenderit. Excepturi impedit quae quisquam?</div>
                <span class="grid-list-number"><i class="fa-regular fa-circle-7"></i></span>
                <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur, natus pariatur nobis aliquid impedit architecto quam iste, maiores odio quos itaque incidunt labore ad eius reprehenderit. Excepturi impedit quae quisquam?</div>
            </div>
        </div>
    </div>
    <h3 id="completingmetadatarecord">Completing a metadata record for your data</h3>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore quam quae quod id hic soluta veniam eius quibusdam vero perferendis nisi, quo, molestias earum adipisci distinctio exercitationem reiciendis nam neque?</p>
    <div class="accordion">
        <div class="section" id="general">
            <div class="section-header" @click="accordionActive === 'general' ? accordionActive = '' : accordionActive = 'general'">
                <h4>General</h4>
                <i :class="`fa-regular fa-chevron-${accordionActive === 'general' ? 'up' : 'down'}`"></i>
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'general' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, quo, tempore nobis saepe modi vel deleniti sunt repellendus mollitia recusandae libero provident totam magnam sequi deserunt officiis enim vero quod!</p>
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
                                <td>...</td>
                                <td>URL</td>
                            </tr>
                            <tr>
                                <td>Title</td>
                                <td>...</td>
                                <td>Text</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>...</td>
                                <td>Text</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="agentinformation">
            <div class="section-header" @click="accordionActive === 'agentinformation' ? accordionActive = '' : accordionActive = 'agentinformation'">
                <h4>Agent Information</h4>
                <i :class="`fa-regular fa-chevron-${accordionActive === 'agentinformation' ? 'up' : 'down'}`"></i>
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'agentinformation' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quis consectetur corrupti saepe adipisci! Magni porro corporis soluta placeat distinctio, minus totam ullam veritatis ratione consequatur dolores repudiandae assumenda ad.</p>
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
                                <td>...</td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td>Role</td>
                                <td>...</td>
                                <td>Pick list</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="dates">
            <div class="section-header" @click="accordionActive === 'dates' ? accordionActive = '' : accordionActive = 'dates'">
                <h4>Dates</h4>
                <i :class="`fa-regular fa-chevron-${accordionActive === 'dates' ? 'up' : 'down'}`"></i>
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'dates' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur fugiat molestias voluptatibus veritatis, beatae enim perspiciatis velit aliquam corporis modi molestiae adipisci ea, culpa delectus itaque ipsam necessitatibus. Eum, unde.</p>
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
                                <td>...</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                            <tr>
                                <td>Modified</td>
                                <td>...</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                            <tr>
                                <td>Issued</td>
                                <td>...</td>
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
                <i :class="`fa-regular fa-chevron-${accordionActive === 'rights' ? 'up' : 'down'}`"></i>
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'rights' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam cum eos quaerat sed sit qui voluptatum dignissimos nobis alias quas magni est itaque aspernatur veritatis suscipit, quia, laboriosam consequatur. Libero.</p>
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
                                <td>...</td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td>License IRI</td>
                                <td>...</td>
                                <td>URL</td>
                            </tr>
                            <tr>
                                <td>Rights</td>
                                <td>...</td>
                                <td>Pick list</td>
                            </tr>
                            <tr>
                                <td>Access Rights</td>
                                <td>...</td>
                                <td>Pick list</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="spatiotemporal">
            <div class="section-header" @click="accordionActive === 'spatiotemporal' ? accordionActive = '' : accordionActive = 'spatiotemporal'">
                <h4>Spatio/Temporal (Where and When)</h4>
                <i :class="`fa-regular fa-chevron-${accordionActive === 'spatiotemporal' ? 'up' : 'down'}`"></i>
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'spatiotemporal' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora perferendis suscipit, obcaecati minus nihil ipsa! Et voluptas doloribus amet repellendus itaque vel natus ad? Eius tenetur blanditiis aliquid doloribus optio.</p>
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
                                <td>...</td>
                                <td>WKT string</td>
                            </tr>
                            <tr>
                                <td>...</td>
                                <td>Spatial IRI</td>
                            </tr>
                            <tr>
                                <td rowspan="2">Temporal</td>
                                <td>...</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                            <tr>
                                <td>...</td>
                                <td>dd/mm/yyyy</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="distribution">
            <div class="section-header" @click="accordionActive === 'distribution' ? accordionActive = '' : accordionActive = 'distribution'">
                <h4>Distribution Information</h4>
                <i :class="`fa-regular fa-chevron-${accordionActive === 'distribution' ? 'up' : 'down'}`"></i>
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'distribution' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam similique velit consequatur? Aut vero consequatur, dignissimos quis praesentium earum eos accusantium alias ratione hic non deleniti inventore, magni consectetur suscipit?</p>
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
                                <td>...</td>
                                <td>URL</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="theme">
            <div class="section-header" @click="accordionActive === 'theme' ? accordionActive = '' : accordionActive = 'theme'">
                <h4>Theme</h4>
                <i :class="`fa-regular fa-chevron-${accordionActive === 'theme' ? 'up' : 'down'}`"></i>
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'theme' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos laudantium fugiat repellendus, minima unde iure excepturi mollitia maiores. Illum, soluta impedit voluptate similique suscipit porro. Error, iusto? Nisi, aut culpa.</p>
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
                                <td>...</td>
                                <td>Pick list</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="section" id="contactdetails">
            <div class="section-header" @click="accordionActive === 'contactdetails' ? accordionActive = '' : accordionActive = 'contactdetails'">
                <h4>Contact Details</h4>
                <i :class="`fa-regular fa-chevron-${accordionActive === 'contactdetails' ? 'up' : 'down'}`"></i>
            </div>
            <div :class="`section-body-wrapper ${accordionActive === 'contactdetails' ? 'open' : ''}`">
                <div class="section-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi perspiciatis facere culpa cum ipsa tenetur quia quas et exercitationem optio nemo eligendi possimus, nihil unde iste maxime beatae deleniti pariatur?</p>
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
                                <td>...</td>
                                <td>Text</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>...</td>
                                <td>Email</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>...</td>
                                <td>Telephone</td>
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

.table-of-contents {
    background-color: $bg1;
    padding: 16px;
    border-radius: $borderRadius;
    align-self: baseline;

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

        p {
            margin-top: 0;
        }

        &.fill {
            background-color: $bg1;
        }

        .grid-list {
            display: grid;
            // grid-template-columns: min-content 1fr;
            grid-template-columns: 64px 1fr;
            gap: 8px;

            .grid-list-number {
                color: #3591e2;
                font-size: 1.2em;
                text-align: right;
            }
        }
    }
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

                }
            }
        }
    }
}
</style>