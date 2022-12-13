<script setup>
import { ref, computed } from "vue";
import { FormInput } from "@idn-au/idn-lib";

const topicOptions = [
    {
        label: "Question",
        value: "question"
    },
    {
        label: "Website feedback",
        value: "website"
    },
    {
        label: "Other",
        value: "other"
    },
];

const data = ref({
    name: "",
    email: "",
    message: "",
    topic: ""
});

const isEmpty = computed(() => {
    return Object.values(data.value).find(item => item !== "") === undefined;
});

const isFull = computed(() => {
    return Object.values(data.value).find(item => item === "") === undefined;
});

const validationMessages = ref({
    name: [],
    email: [],
    message: [],
    topic: []
});

const isValid = computed(() => {
    return Object.values(validationMessages.value).find(item => item.length > 0) === undefined;
});

function clearValidate(key) {
    validationMessages.value[key] = [];
};

function validateIsEmpty(key, message) {
    if (data.value[key] === "" || data.value[key] === [] || data.value[key] === false) {
        validationMessages.value[key].push(message);
    }
};

function validateEmail(key) {
    if (!data.value[key].match(/.+@.+\..+/)) {
        validationMessages.value[key].push("Invalid email address");
    }
}

</script>

<template>
    <h1>Contact Us</h1>
    <p>For more information please email the Indigenous Data Network at data-indigneous@unimelb.edu.au</p>
    <p>Find out more about our work at the <a href="https://mspgh.unimelb.edu.au/centres-institutes/centre-for-health-equity/research-group/indigenous-studies/research/indigenous-data-network" target="_blank" rel="noopener noreferrer">Indigenous Studies Unit website</a>.</p>
    <div id="contact-form-wrapper">
        <form action="">
            <div id="contact-form">
                <FormInput
                    type="text"
                    name="name"
                    id="name"
                    label="Name"
                    placeholder="Please enter your name"
                    :required="true"
                    @onBlur="clearValidate('name'); validateIsEmpty('name', 'Name must not be empty')"
                    v-model="data.name"
                    :invalidMessage="validationMessages.name"
                />
                <FormInput
                    type="email"
                    name="email"
                    id="email"
                    label="Email"
                    placeholder="Please enter your email"
                    :required="true"
                    @onBlur="clearValidate('email'); validateIsEmpty('email', 'Email must not be empty'); validateEmail('email')"
                    v-model="data.email"
                    :invalidMessage="validationMessages.email"
                />
                <FormInput
                    type="select"
                    name="topic"
                    id="topic"
                    label="Topic"
                    :options="topicOptions"
                    :required="true"
                    @onBlur="clearValidate('topic'); validateIsEmpty('topic', 'Topic must not be empty')"
                    v-model="data.topic"
                    :invalidMessage="validationMessages.topic"
                />
                <FormInput
                    type="textarea"
                    name="message"
                    id="message"
                    label="Message"
                    placeholder="Type your message here..."
                    :required="true"
                    @onBlur="clearValidate('message'); validateIsEmpty('message', 'Message must not be empty')"
                    v-model="data.message"
                    :invalidMessage="validationMessages.message"
                    :style="{ gridColumn: 'span 3' }"
                />
            </div>
            <button type="submit" :disabled="!isFull || !isValid">Submit</button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

#contact-form-wrapper {
    border-radius: 6px;
    // background-color: #f7f7f7;
    border: 2px solid  #ececec;
    padding: 20px;

    #contact-form {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        
        margin-bottom: 16px;

        :deep(textarea) {
            font-size: 0.833em;
        }
    }

    button {
        border-radius: 6px;
        border: none;
        padding: 6px 8px;
        background-color: $primary;
        color: white;
        cursor: pointer;

        &:disabled {
            cursor: default;
            opacity: 0.8;
        }
    }
}
</style>