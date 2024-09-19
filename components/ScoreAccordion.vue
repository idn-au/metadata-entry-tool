<script lang="ts" setup>
import type { ScoreValueObj } from "~/types";

const props = defineProps<{
    scoreObj: ScoreValueObj;
}>();
</script>

<template>
    <Accordion type="single" collapsible>
        <AccordionItem v-for="[key, score] in Object.entries(props.scoreObj)" :value="key">
            <AccordionTrigger>
                <div class="flex flex-row gap-4 flex-grow">
                    <CircleProgress :value="score.value" :max="score.max" class="max-w-20" />
                    <div class="flex flex-col gap-2 text-left flex-grow">
                        <h3>{{ score.title }}</h3>
                        <p class="text-sm text-muted-foreground">{{ score.description }}</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card v-if="score.scores">
                    <CardContent>
                        <ScoreAccordion :scoreObj="score.scores" class="ml-4" />
                    </CardContent>
                </Card>
                <div v-else-if="score.requirements">
                    {{ score.requirements }}
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
</template>

<style lang="scss" scoped></style>