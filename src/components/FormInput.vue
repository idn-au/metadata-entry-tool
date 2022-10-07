<script setup>
import { computed, ref, useSlots } from "vue";
import ToolTip from "@/components/ToolTip.vue";

const inFocus = ref(false);
const inputRef = ref(null);

const slots = useSlots();

const props = defineProps({
    modelValue: {
        required: true
    },
    label: String,
    placeholder: String,
    description: String,
    type: {
        type: String,
        required: true
    },
    tooltip: String,
    options: Array,
    id: String,
    required: Boolean,
    invalidMessage: Array,
    multiple: Boolean,
    clearButton: Boolean,
    disabled: Boolean
});

const emit = defineEmits(["update:modelValue", "onBlur"]);

function updateValue(e) {
    if (props.type === "select" && props.multiple === true) {
        let selected = Array.from(e.target.selectedOptions).map(option => option.value);
        emit("update:modelValue", selected);
    } else if (props.type === "checkbox") {
        if (props.multiple === true) {
            let value = [...props.modelValue];
            let index = value.indexOf(e.target.value);
            if (e.target.checked) { // add
                if (index === -1) {
                    value.push(e.target.value);
                }
            } else { // remove
                if (index > -1) {
                    value.splice(index, 1);
                }
            }
            emit("update:modelValue", value);
        } else {
            emit("update:modelValue", e.target.checked);
        }
    } else {
        emit("update:modelValue", e.target.value);
    }
}

const isInvalid = computed(() => {
    if (props.invalidMessage === undefined) { // not provided
        return false;
    } else {
        if (props.invalidMessage.length > 0) {
            return true;
        } else {
            return false;
        }
    }
});

const labelIsFloating = computed(() => {
    if (props.modelValue !== "") {
        return true;
    } else if (props.type === "date") {
        return true;
    } else if (props.type === "select") {
        if (!!props.placeholder) {
            return true;
        } else {
            return false;
        }
    } else if (inFocus.value) {
        return true;
    } else {
        return false;
    }
});
</script>
    
<template>
    <div class="form-input">
        <div class="form-input-row">
            <div :class="`form-input-content ${(props.type === 'checkbox' || props.type === 'radio') ? 'check-radio' : 'text-like'} ${(props.type === 'select' || props.type === 'date') ? 'no-cursor' : ''} ${inFocus ? 'focus' : ''} ${isInvalid ? 'invalid' : ''} ${props.disabled === true ? 'disabled' : ''}`">
                <div class="input-prepend" v-if="!!slots.prepend">
                    <slot name="prepend"></slot>
                </div>
                <div :class="`input-item ${!!slots.prepend ? '' : 'radius-left'} ${!!slots.append ? '' : 'radius-right'}`" @click="inputRef && inputRef.focus()">
                    <label
                        v-if="props.label && !(props.type === 'checkbox' && props.multiple === false)"
                        :class="`input-label ${labelIsFloating ? 'float' : ''}`"
                        :for="props.id"
                    >
                        {{ props.label }} <span v-if="props.required === true" class="required">*</span>
                    </label>
                    <template v-if="props.type === 'checkbox'">
                        <div v-if="props.multiple === true" class="checkbox-list">
                            <div v-for="option in props.options" class="checkbox-item">
                                <input
                                    type="checkbox"
                                    :value="option.value"
                                    :checked="modelValue.includes(option.value)"
                                    @change="updateValue($event); $emit('onBlur')"
                                    :name="option.value"
                                    :id="option.value"
                                />
                                <label :for="option.value">{{ option.label }}</label>
                            </div>
                        </div>
                        <div v-else class="checkbox-item">
                            <input
                                type="checkbox"
                                :checked="modelValue"
                                @change="updateValue($event); $emit('onBlur')"
                                :name="props.id"
                                :id="props.id"
                            />
                            <label :for="props.id">{{ props.label }}</label>
                        </div>
                    </template>
                    <select
                        v-else-if="type === 'select'"
                        class="input"
                        ref="inputRef"
                        @focus="inFocus = true"
                        @blur="inFocus = false; $emit('onBlur')"
                        :value="modelValue"
                        @change="updateValue"
                        :name="props.id"
                        :id="props.id"
                        :disabled="props.disabled === true"
                        :multiple="props.multiple === true"
                    >
                        <option v-if="props.placeholder" value="" selected disabled hidden>{{ props.placeholder }}</option>
                        <option v-for="option in props.options" :value="option.value">{{ option.label }}</option>
                    </select>
                    <textarea
                        v-else-if="type === 'textarea'"
                        class="input"
                        :name="props.id"
                        :id="props.id"
                        rows="3"
                        @focus="inFocus = true"
                        @blur="inFocus = false; $emit('onBlur')"
                        :value="modelValue"
                        @input="updateValue"
                        :placeholder="(props.placeholder && inFocus && modelValue === '') ? props.placeholder : undefined"
                        :disabled="props.disabled === true"
                    ></textarea>
                    <input
                        v-else
                        class="input"
                        ref="inputRef"
                        :type="props.type"
                        @focus="inFocus = true"
                        @blur="inFocus = false; $emit('onBlur')"
                        :value="modelValue"
                        @input="updateValue"
                        :name="props.id"
                        :id="props.id"
                        :placeholder="(props.placeholder && inFocus && modelValue === '') ? props.placeholder : undefined"
                        :disabled="props.disabled === true"
                    />
                </div>
                <button
                    class="input-clear-btn"
                    v-if="props.clearButton === true"
                    @click="$emit('update:modelValue', '')"
                    title="Clear field"
                    :disabled="props.disabled === true"
                >
                    <i class="fa-regular fa-xmark"></i>
                </button>
                <div class="input-append"  v-if="!!slots.append">
                    <slot name="append"></slot>
                </div>
            </div>
            <ToolTip v-if="props.tooltip" :text="props.tooltip"><i class="fa-regular fa-circle-question"></i></ToolTip>
        </div>
        <div class="form-input-desc" v-if="props.description">{{ props.description }}</div>
        <div class="form-input-invalid" v-if="isInvalid">{{ props.invalidMessage[0] }}</div>
    </div>
</template>
    
<style lang="scss" scoped>
$borderRadius: 6px;
$pendMinWidth: 36px;
$borderColor: grey;
$invalidColor: red;
$disabledColor: #dfdfdf;
$placeholderColor: #5c5c5c;

.form-input {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .form-input-row {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        gap: 8px;

        .form-input-content {
            display: flex;
            flex-direction: row;
            width: 100%;

            .input-prepend {
                display: flex;
                flex-direction: row;
                align-items: stretch;

                & > :deep(*) {
                    min-width: $pendMinWidth;
                    border: none;
                    // border-right: 1px solid grey;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            .input-item {
                flex-grow: 1;
                display: flex;
                position: relative;
                cursor: text;

                label.input-label {

                    .required {
                        color: red;
                    }
                }

                .input {
                    border: none;
                    flex-grow: 1;
                    outline: none;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
            }

            button.input-clear-btn {
                background-color: transparent;
                border: none;
                cursor: pointer;
                padding: 6px 12px;
                color: grey;
                transition: color 0.2s ease-in-out;

                &:hover {
                    color: black;
                }
            }

            .input-append {
                display: flex;
                flex-direction: row;
                align-items: stretch;

                & > :deep(*) {
                    min-width: $pendMinWidth;
                    border: none;
                    // border-left: 1px solid grey;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }

        :deep(.tooltip) {
            margin: 0 12px;
        }
    }

    .form-input-desc {
        font-size: small;
        color: grey;
    }
    
    .form-input-invalid {
        font-size: small;
        color: $invalidColor;
    }
}

.form-input-content {
    // text, textarea, select, etc.
    &.text-like {
        align-items: stretch;
        border: 1px solid $borderColor;
        border-radius: $borderRadius;
        background-color: white;
        transition: box-shadow 0.2s ease-in-out;

        &.focus {
            box-shadow: 0px 0px 6px 2px rgba($color: #3780ee, $alpha: 0.4);
        }

        &.invalid {
            border-color: $invalidColor;
        }

        .input-prepend {
            & > :deep(*:first-child) {
                border-top-left-radius: $borderRadius;
                border-bottom-left-radius: $borderRadius;
            }
        }

        .input-item {
            // padding: 0 8px;

            &.radius-left {
                &, label.input-label, .input {
                    border-top-left-radius: $borderRadius;
                    border-bottom-left-radius: $borderRadius;
                }
            }

            &.radius-right {
                &, label.input-label, .input {
                    border-top-right-radius: $borderRadius;
                    border-bottom-right-radius: $borderRadius;
                }
            }

            label.input-label {
                padding-left: 8px;
                position: absolute;
                transform-origin: top left;
                transform: translate(0, 11px) scale(1);
                transition: all .1s ease-in-out;

                &.float {
                    color: $placeholderColor;
                    transform: translate(0, 2px) scale(.75);
                }
            }

            .input {
                padding: 18px 18px 8px 8px;
                background-color: white;
            }
        }

        &:not(.no-cursor) label.input-label {
            cursor: text;
        }

        .input-append {
            & > :deep(*:last-child) {
                border-top-right-radius: $borderRadius;
                border-bottom-right-radius: $borderRadius;
            }
        }

        &.disabled {
            background-color: $disabledColor;

            :deep(button) {
                cursor: default !important;
            }

            .input-item {
                cursor: default;

                label.input-label {
                    cursor: default;
                }

                .input {
                    background-color: $disabledColor;
                }
            }
        }
    }

    // checkbox & radio
    &.check-radio {
        .input-prepend, .input-append {
            height: 44px;
        }

        .input-item {
            cursor: unset !important;
            flex-direction: column;

            label.input-label {
                padding: 12px 0;
            }

            .checkbox-list {
                display: flex;
                flex-direction: column;
                gap: 6px;

                .checkbox-item {
                    display: flex;
                    flex-direction: row;
                    gap: 6px;
                }
            }
        }
    }

    &.disabled {
        // buttons
    }
}

textarea.input {
    resize: vertical;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

select.input {
    &[multiple] {
        resize: none;
    }
}

// input[type="date"]:
</style>