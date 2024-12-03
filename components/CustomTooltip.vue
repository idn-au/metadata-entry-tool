<script lang="ts" setup>
const open = ref(false);
</script>

<template>
    <TooltipProvider>
        <Tooltip v-model:open="open">
            <TooltipTrigger as-child>
                <Button variant="link" size="xs" class="text-muted-foreground cursor-help" @click="open = true">
                    <slot name="trigger"></slot>
                </Button>
            </TooltipTrigger>
            <TooltipContent class="max-w-[300px] text-center">
                <slot />
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>
