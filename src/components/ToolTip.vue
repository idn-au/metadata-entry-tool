<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    }
});
</script>

<template>
    <span class="tooltip">
        <slot></slot>
        <span class="tooltip-text">{{ props.text }}</span>
    </span>
</template>

<style lang="scss" scoped>
.tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;

    &:hover {
        cursor: help;
    }

    .tooltip-text {
        $arrow-size: 6px;
        
        position: absolute;
        width: 250px;
        background-color: black;
        color: white;
        text-align: center;
        font-weight: normal;
        font-size: 14px;
        padding: 6px;
        border-radius: 6px;
        z-index: 999;
        visibility: hidden;
        bottom: calc(100% + #{$arrow-size});
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.2s ease-in-out;

        &::after {
            content: " ";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -$arrow-size;
            border-width: $arrow-size;
            border-style: solid;
            border-color: black transparent transparent transparent;
        }
    }

    &:hover .tooltip-text {
        visibility: visible;
        opacity: 0.9;
    }
}
</style>