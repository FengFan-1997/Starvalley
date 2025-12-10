<template>
  <div class="pixel-panel" :class="{ 'inner-panel': inner }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  inner?: boolean
}>()
</script>

<style scoped>
.pixel-panel {
  background-color: var(--sdv-bg-cream);
  border: 4px solid var(--sdv-border-dark);
  box-shadow: 
    inset 4px 4px 0 var(--sdv-highlight-light), 
    inset -4px -4px 0 var(--sdv-shadow-dark), 
    4px 4px 0 rgba(0,0,0,0.3);
  position: relative;
  padding: 10px;
}

.pixel-panel.inner-panel {
  box-shadow: inset 4px 4px 0 rgba(0,0,0,0.2);
  border: 4px solid var(--sdv-bg-wood);
  background-color: var(--sdv-bg-tan);
}
</style>