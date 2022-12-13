<script setup>
import MetadataForm from "@/components/MetadataForm.vue";
</script>

<template>
    <p>
        This is the form for submitting metadata to the IDN. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Illo commodi hic beatae natus labore doloribus aliquid tempore quaerat doloremque, adipisci sequi et ipsam?
        Dolorem itaque porro exercitationem nam nihil. Dicta? Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Modi, voluptatem dolore quaerat aliquid laboriosam libero ipsa esse, sequi corporis exercitationem laborum
        deleniti molestias adipisci officiis, perferendis quis maiores temporibus enim.
    </p>
    <p>Click the button below to get started.</p>
    <button class="btn lg primary tutorial-btn" disabled>Start the tutorial</button>
    <MetadataForm />
</template>

<style lang="scss" scoped>
button.tutorial-btn {
    align-self: center;
}
</style>