<template>
  <div class="character-creation">
    <!-- Background layers (reused from TitleScreen for consistency) -->
    <div class="sky-layer"></div>
    <div class="mountain-layer"></div>

    <div class="creation-panel pixel-panel">
      <h2 class="panel-title">Character Creation</h2>

      <div class="form-row">
        <div class="form-column">
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
            <input class="pixel-input" type="text" v-model="favoriteThing" placeholder="Stardew" maxlength="12" />
          </div>
        </div>

        <div class="form-column">
          <div class="appearance-selector">
            <h3>Appearance</h3>
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

          <div class="pet-selector">
            <h3>Pet Preference</h3>
            <div class="pet-options">
               <div
                 class="pet-option"
                 :class="{ active: selectedPet === 'cat' }"
                 @click="selectedPet = 'cat'"
               >🐱 Cat</div>
               <div
                 class="pet-option"
                 :class="{ active: selectedPet === 'dog' }"
                 @click="selectedPet = 'dog'"
               >🐶 Dog</div>
            </div>
          </div>
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
const selectedPet = ref<'cat' | 'dog'>('cat')

const skinColors = [
  '#ffccaa', '#f5b599', '#e0ac69', '#bd8e62', '#8d5524', '#563318',
  '#e0e0e0', '#a0a0ff', '#a0ffa0' // Added fantasy colors
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
      skinColor: selectedSkin.value,
      pet: selectedPet.value
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
  font-family: 'Courier New', Courier, monospace;
}

.sky-layer, .mountain-layer {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  pointer-events: none;
}

.creation-panel {
  width: 600px;
  background: #fff; /* Fallback */
  padding: 30px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-title {
  text-align: center;
  color: #5D4037;
  font-size: 2rem;
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 30px;
}

.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label, h3 {
  font-weight: bold;
  color: #5D4037;
  font-size: 1.1rem;
}

.pixel-input {
  font-family: inherit;
  font-size: 1.2rem;
  padding: 8px;
  border: 4px solid #8D6E63;
  background: #FFF3E0;
  color: #3E2723;
  outline: none;
}

.pixel-input:focus {
  border-color: #FFB74D;
}

.input-with-suffix {
  display: flex;
  align-items: center;
  gap: 5px;
}

.suffix {
  font-weight: bold;
  color: #5D4037;
}

.skin-colors {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border: 4px solid #8D6E63;
  cursor: pointer;
}

.color-swatch.active {
  border-color: #FFD700; /* Gold */
  box-shadow: 0 0 10px #FFD700;
}

.pet-options {
  display: flex;
  gap: 10px;
}

.pet-option {
  padding: 10px;
  border: 4px solid #8D6E63;
  background: #FFF3E0;
  cursor: pointer;
  flex: 1;
  text-align: center;
  font-size: 1.2rem;
}

.pet-option.active {
  background: #FFD700;
  color: #fff;
  border-color: #B8860B;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
