<script lang="ts" setup>
import { Check, Circle, Dot, ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
    steps: {
        step: number;
        title: string;
        [key: string]: any;
    }[];
}>();

const stepIndex = ref(1);
</script>

<template>
    <Stepper :linear="false" v-model="stepIndex" orientation="vertical" class="flex w-full flex-col justify-start gap-10"
        v-slot="{ nextStep, prevStep, isFirstStep, isLastStep }">
        <StepperItem v-for="step in props.steps" :key="step.step" v-slot="{ state }"
            class="relative flex w-full items-start gap-6" :step="step.step">
            <StepperSeparator v-if="step.step !== props.steps[props.steps.length - 1].step"
                class="absolute left-[18px] top-[38px] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

            <StepperTrigger as-child>
                <Button :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'" size="icon"
                    class="z-10 rounded-full shrink-0"
                    :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']">
                    <Check v-if="state === 'completed'" class="size-5" />
                    <Circle v-if="state === 'active'" />
                    <Dot v-if="state === 'inactive'" />
                </Button>
            </StepperTrigger>

            <div class="flex flex-col gap-1 flex-grow">
                <StepperTitle :class="[state === 'active' && 'text-primary']"
                    class="text-sm font-semibold transition lg:text-base">
                    {{ step.title }}
                </StepperTitle>
                <slot :stepObj="step" :stepIndex="stepIndex" />
            </div>

        </StepperItem>
        <div class="flex items-center justify-between mt-4 sticky bottom-0 bg-background p-2 z-50 border-t">
            <div class="flex flex-row gap-2 items-center">
                <Button variant="outline" size="sm" @click="prevStep()" :disabled="isFirstStep">
                    <ChevronLeft class="size-4 mr-2" /> Prev
                </Button>
                <slot v-if="isFirstStep" name="left-buttons-first" />
                <slot name="left-buttons" />
            </div>
            <div class="flex flex-row gap-2 items-center">
                <slot name="right-buttons" />
                <template v-if="isLastStep">
                    <slot name="right-buttons-last" />
                </template>
                <Button v-else variant="outline" size="sm" @click="nextStep()">
                    Next <ChevronRight class="size-4 ml-2" />
                </Button>
            </div>
        </div>
    </Stepper>
</template>
