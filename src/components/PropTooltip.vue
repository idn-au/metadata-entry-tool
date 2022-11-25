<script setup>
import { ToolTip } from "@idn-au/idn-lib";

const props = defineProps({
    qname: String,
    uri: String,
    description: String
});
</script>

<template>
    <ToolTip>
        <i class="fa-regular fa-circle-question"></i>
        <template #text>
            <a :href="uri" target="_blank" v-if="!!props.qname || !!props.uri">
                <template v-if="!!props.qname">
                    {{ props.qname }}
                </template>
                <template>
                    {{ props.uri }}
                </template>
            </a>
            <p v-if="!!props.description">{{ props.description }}</p>
        </template>
    </ToolTip>
</template>

<style lang="scss" scoped>
@import "@/assets/_mixins.scss";

a {
    color: coral;
    @include transition(color, background-color);

    &:hover {
        color: darken($color: coral, $amount: 15)
    }
}

p {
    margin: 0;
}
</style>