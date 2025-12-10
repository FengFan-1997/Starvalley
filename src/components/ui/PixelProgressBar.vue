<template>
  <div class="pixel-progress-bar" :class="{ vertical: vertical }">
    <div class="bar-bg">
      <div 
        class="bar-fill" 
        :class="type"
        :style="vertical ? { height: percentage + '%' } : { width: percentage + '%' }"
      ></div>
      <!-- Shine effect -->
      <div class="shine"></div>
    </div>
    <div class="icon-wrapper" v-if="icon">
      <span class="icon">{{ icon }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  max: number
  type?: 'energy' | 'health' | 'exp'
  vertical?: boolean
  icon?: string
}>(), {
  type: 'energy',
  vertical: false
})

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<style scoped>
.pixel-progress-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}

.pixel-progress-bar.vertical {
  flex-direction: column-reverse;
}

.bar-bg {
  background: #333;
  border: 3px solid var(--sdv-border-dark);
  border-radius: 4px; /* Slightly rounded corners for Stardew feel */
  position: relative;
  overflow: hidden;
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5);
}

.pixel-progress-bar:not(.vertical) .bar-bg {
  width: 150px;
  height: 24px;
}

.pixel-progress-bar.vertical .bar-bg {
  width: 24px;
  height: 150px;
}

.bar-fill {
  position: absolute;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pixel-progress-bar:not(.vertical) .bar-fill {
  height: 100%;
  left: 0;
  top: 0;
}

.pixel-progress-bar.vertical .bar-fill {
  width: 100%;
  bottom: 0;
  left: 0;
}

/* Colors */
.bar-fill.energy {
  background: linear-gradient(to top, #e6b00b, #ffce6c);
  border-right: 2px solid #b8860b;
}

.bar-fill.health {
  background: linear-gradient(to top, #e63e3e, #ff7f7f);
  border-right: 2px solid #8b0000;
}

.bar-fill.exp {
  background: linear-gradient(to top, #4169e1, #87cefa);
}

.shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: rgba(255,255,255,0.2);
  pointer-events: none;
}

.icon-wrapper {
  background: var(--sdv-border-dark);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #d3a068;
  z-index: 2;
}

.icon {
  font-size: 18px;
}
</style>