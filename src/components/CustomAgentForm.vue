<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { v4 as uuid4 } from "uuid";
import { faCheck, faCopy, faPlus, faTrash, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FormInput, FormField } from "@idn-au/idn-lib";
import { useBtnTimeout } from "@/composables/btnTimeout";

const DEFAULT_DATATYPES = [
    {
        label: "xsd:token",
        value: "http://www.w3.org/2001/XMLSchema#token"
    }
];

const defaultData = {
    iri: "",
    isPerson: false,
    name: "",
    description: "",
    url: "",
    identifiers: [
        {
            value: "",
            datatype: ""
        }
    ],
    indigeneity: "",
    review: false
};

const uuid = uuid4();

const { clicked: iriCopied, startTimeout } = useBtnTimeout();

const props = defineProps({
    indigeneityOptions: Array,
    customAgent: Object
});

const emit = defineEmits(["save", "delete", "modalClosed"]);

// agent relations?
const customAgent = ref({...props.customAgent});

const validation = ref({}); // { key: isValid, ... }

const isValid = computed(() => {
    if (customAgent.value.iri === "" || customAgent.value.name === ""){
        return false
    }
    return Object.values(validation.value).every(Boolean);
});

const empty = computed(() => {
    return customAgent.value === defaultData;
});

function handleValidate(key, isValid) {
    validation.value[key] = isValid;
}

function saveAgent() {
    emit("save", customAgent.value);
}

function deleteAgent() {
    if (confirm("This will delete your custom Agent. Do you wish to continue?")) {
        emit("delete");
    }
}

function copyIRI() {
    navigator.clipboard.writeText(customAgent.value.iri);
    startTimeout();
}

watch(() => customAgent.value.isPerson, (newValue) => {
    customAgent.value.iri = `https://data.idnau.org/pid/${newValue ? "person" : "organization"}/${uuid}`;
});

// watch(customAgent, (newValue, oldValue) => {
//     emit("change", newValue);
// }, { deep: true });

onMounted(() => {
    customAgent.value.iri = `https://data.idnau.org/pid/${customAgent.value.isPerson ? "person" : "organization"}/${uuid}`;
});
</script>

<template>
    <div class="custom-agent-form">
        <FormInput
            v-model="customAgent.iri"
            label="IRI"
            type="url"
            clearButton
            required
        >
            <template #append>
                <button
                    class="btn secondary"
                    @click="copyIRI"
                    :style="{ cursor: 'pointer' }"
                    title="Copy IRI"
                >
                    <font-awesome-icon :icon="iriCopied ? faCheck : faCopy" />
                </button>
            </template>
        </FormInput>
        <FormInput
            v-model="customAgent.isPerson"
            leftLabel="Group"
            rightLabel="Individual"
            type="checkbox"
            switch
            :style="{ alignSelf: 'center' }"
        />
        <FormInput
            v-model="customAgent.name"
            label="Name"
            type="text"
            clearButton
            required
        />
        <FormInput
            v-model="customAgent.url"
            label="URL"
            type="url"
            clearButton
        />
        <FormField :span="2">
            <FormInput
                v-model="customAgent.description"
                label="Description"
                type="textarea"
            />
        </FormField>
        <FormInput
            v-model="customAgent.indigeneity"
            label="Indigeneity"
            type="select"
            :options="props.indigeneityOptions"
            clearButton
            searchable
        />
        <FormField v-for="(identifier, index) in customAgent.identifiers" direction="row" :span="2" :label="index === 0 ? 'Identifiers' : null">
            <FormInput
                v-model="identifier.value"
                label="Identifier"
                type="text"
                clearButton
            />
            <FormInput
                v-model="identifier.datatype"
                label="Datatype"
                type="select"
                :options="DEFAULT_DATATYPES"
                clearButton
                searchable
                allowAdd
            />
            <button
                v-if="index > 0"
                class="btn danger outline"
                title="Remove identifier"
                @click="customAgent.identifiers.splice(index, 1)"
            >
                <font-awesome-icon :icon="faTrash" />
            </button>
        </FormField>
        <div><button
            class="btn primary outline"
            @click="customAgent.identifiers.push({ value: '', datatype: '' })"
        >
            <font-awesome-icon :icon="faPlus" /> Add ID
        </button></div>
    </div>
    <div :style="{padding: '12px'}">
        <FormInput
            type="checkbox"
            id="review"
            label="I would like to request this Agent to be reviewed for submission into the IDN."
            v-model="customAgent.review"
        />
    </div>
    <div class="bottom-buttons">
        <button class="btn danger outline" @click="deleteAgent">Delete <font-awesome-icon :icon="faTrash" /></button>
        <div class="right-buttons">
            <button class="btn secondary outline" @click="emit('modalClosed')">Cancel</button>
            <button class="btn success save-btn" :disabled="empty || !isValid" @click="saveAgent">Save <font-awesome-icon :icon="faFloppyDisk" /></button>
        </div>
    </div>
    
</template>

<style lang="scss" scoped>
.custom-agent-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 12px;
}

.bottom-buttons {
    display: flex;
    flex-direction: row;
    gap: 12px;
    justify-content: space-between;
    padding: 12px;

    .right-buttons {
        display: flex;
        flex-direction: row;
        gap: 20px;
    }
}

:deep(input#review) {
    width: unset;
}

:deep(.form-input input) {
    width: 100%; // fixes input min width issue
}
</style>