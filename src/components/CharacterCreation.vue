<template>
  <div class="character-creation">
    <!-- Background layers (reused from TitleScreen for consistency) -->
    <div class="sky-layer"></div>
    <div class="mountain-layer"></div>

    <div class="creation-panel">
      <h2 class="panel-title">Character Creation</h2>

      <div class="form-group">
        <label>Name</label>
        <input class="pixel-input" type="text" v-model="name" placeholder="Enter your name" maxlength="12" />
      </div>

      <div class="form-group">
        <label>Farm Name</label>
        <div class="input-with-suffix">
          <input class="pixel-input" type="text" v-model="farmName" placeholder="Enter farm name" maxlength="12" />
          <span class="suffix">Farm</span>
        </div>
      </div>

      <div class="form-group">
        <label>Favorite Thing</label>
        <input class="pixel-input" type="text" v-model="favoriteThing" placeholder="Enter favorite thing" maxlength="12" />
      </div>

      <div class="appearance-selector">
        <h3>Appearance</h3>
        <!-- Simplified appearance selection -->
        <div class="skin-colors">
          <div
            v-for="color in skinColors"
            :key="color"
            class="color-swatch"
            :style="{ backgroundColor: color }"
            :class="{ active: selectedSkin === color }"
            @click="selectedSkin = color"
          ></div>
        </div>
      </div>

      <div class="actions">
        <PixelButton @click="$emit('back')">Back</PixelButton>
        <PixelButton @click="confirmCreation" :disabled="!isValid">OK</PixelButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PixelButton from '@/components/ui/PixelButton.vue'

const emit = defineEmits(['back', 'complete'])

const name = ref('')
const farmName = ref('')
const favoriteThing = ref('')
const selectedSkin = ref('#ffccaa')

const skinColors = [
  '#ffccaa', '#f5b599', '#e0ac69', '#bd8e62', '#8d5524', '#563318'
]

const isValid = computed(() => {
  return name.value.trim().length > 0 &&
         farmName.value.trim().length > 0 &&
         favoriteThing.value.trim().length > 0
})

const confirmCreation = () => {
  if (isValid.value) {
    emit('complete', {
      name: name.value,
      farmName: farmName.value,
      favoriteThing: favoriteThing.value,
      skinColor: selectedSkin.value
    })
  }
}
</script>

<style scoped>
.character-creation {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 60%, #fff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.sky-layer, .mountain-layer {
  position: absolute;
  width: 100%;
  left: 0;
}

.sky-layer {
  top: 0;
  height: 60%;
  background-image:
    radial-gradient(circle at 20% 50%, white 10px, transparent 11px),
    radial-gradient(circle at 25% 60%, white 15px, transparent 16px),
    radial-gradient(circle at 80% 40%, white 20px, transparent 21px);
  opacity: 0.6;
  z-index: 0;
}

.mountain-layer {
  bottom: 0;
  height: 40%;
  background: #2c5530;
  border-top: 4px solid #1a3d1f;
  z-index: 1;
}

.creation-panel {
  position: relative;
  z-index: 10;
  background: var(--sdv-bg-cream);
  border: 4px solid var(--sdv-border-dark);
  padding: 40px;
  width: 500px;
  box-shadow: 10px 10px 0 rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-title {
  font-family: 'VT323', monospace;
  font-size: 40px;
  color: var(--sdv-text-dark);
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--sdv-border-light);
  padding-bottom: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-family: 'VT323', monospace;
  font-size: 24px;
  color: var(--sdv-text-dark);
}

input {
  font-family: 'VT323', monospace;
  font-size: 24px;
  padding: 5px 10px;
  background: #fff;
  border: 3px solid #8b4513;
  color: #333;
  outline: none;
}

input:focus {
  border-color: #e6b00b;
}

.input-with-suffix {
  display: flex;
  align-items: center;
  gap: 10px;
}

.suffix {
  font-family: 'VT323', monospace;
  font-size: 24px;
}

.appearance-selector h3 {
  font-family: 'VT323', monospace;
  font-size: 24px;
  margin-bottom: 10px;
}

.skin-colors {
  display: flex;
  gap: 10px;
}

.color-swatch {
  width: 30px;
  height: 30px;
  border: 2px solid transparent;
  cursor: pointer;
}

.color-swatch.active {
  border: 2px solid #e63e3e;
  transform: scale(1.1);
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
