<template>
  <button 
    class="pixel-btn" 
    :class="[variant, { active: active, disabled: disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'danger' | 'success' | 'warning'
  active?: boolean
  disabled?: boolean
}>()

defineEmits(['click'])
</script>

<style scoped>
.pixel-btn {
  font-family: 'VT323', monospace;
  background-color: var(--sdv-btn-default-bg);
  color: var(--sdv-text-dark);
  border: 3px solid var(--sdv-btn-default-border);
  padding: 8px 16px;
  font-size: 24px;
  transition: transform 0.1s, filter 0.1s;
  box-shadow: inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.2), 0 4px 0 rgba(0,0,0,0.2);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.pixel-btn:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.2), 0 6px 0 rgba(0,0,0,0.2);
}

.pixel-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: inset 2px 2px 0 rgba(0,0,0,0.2), 0 2px 0 rgba(0,0,0,0.2);
}

.pixel-btn.active {
  background-color: var(--sdv-highlight);
  border-color: var(--sdv-health);
  transform: translateY(2px);
  box-shadow: inset 2px 2px 0 rgba(0,0,0,0.2);
}

.pixel-btn.primary { 
  background-color: var(--sdv-primary); 
  color: var(--sdv-text-light);
  text-shadow: 2px 2px 0 var(--sdv-text-shadow);
}
.pixel-btn.danger { 
  background-color: var(--sdv-health); 
  color: var(--sdv-text-light);
  text-shadow: 2px 2px 0 var(--sdv-text-shadow);
}
.pixel-btn.warning { 
  background-color: var(--sdv-energy); 
  color: var(--sdv-text-dark);
  text-shadow: none;
}

.pixel-btn:disabled {
  filter: grayscale(1);
  cursor: not-allowed;
  opacity: 0.7;
}
</style>