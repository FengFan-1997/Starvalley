<template>
  <div class="dialogue-overlay" @click="advanceDialogue">
    <div class="dialogue-box pixel-panel">
      <div class="portrait-box">
        <div class="portrait-placeholder" :style="{ backgroundColor: portraitColor }">
          {{ portraitChar }}
        </div>
      </div>
      <div class="text-content">
        <h3 class="npc-name">{{ name }}</h3>
        <p class="dialogue-text">{{ displayedText }}</p>
        <span class="cursor-blink" v-if="isFinished && !choices?.length">▼</span>

        <div class="choices-container" v-if="isFinished && choices?.length">
           <button
             v-for="(choice, index) in choices"
             :key="index"
             class="choice-btn"
             @click.stop="choice.action"
           >
             {{ choice.text }}
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface DialogueChoice {
  text: string
  action: () => void
}

const props = defineProps<{
  name: string
  text: string
  portraitColor?: string
  choices?: DialogueChoice[]
}>()

const emit = defineEmits(['close'])

const displayedText = ref('')
const currentIndex = ref(0)
const isFinished = ref(false)
const portraitChar = computed(() => props.name.charAt(0))

const typeText = () => {
  if (currentIndex.value < props.text.length) {
    displayedText.value += props.text.charAt(currentIndex.value)
    currentIndex.value++
    setTimeout(typeText, 30)
  } else {
    isFinished.value = true
  }
}

const advanceDialogue = () => {
  if (isFinished.value) {
    if (props.choices && props.choices.length > 0) return
    emit('close')
  } else {
    // Skip typing
    displayedText.value = props.text
    currentIndex.value = props.text.length
    isFinished.value = true
  }
}

watch(() => props.text, () => {
  displayedText.value = ''
  currentIndex.value = 0
  isFinished.value = false
  typeText()
})

onMounted(() => {
  typeText()
})
</script>

<style scoped>
.dialogue-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  z-index: 100;
  pointer-events: auto;
}

.dialogue-box {
  width: 800px;
  height: 200px;
  background: #fff;
  border: 4px solid #8b4513;
  border-radius: 8px;
  box-shadow: 0 4px 0 rgba(0,0,0,0.2);
  display: flex;
  padding: 16px;
  gap: 20px;
  background-image: url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0z' fill='%23fdf5e6' fill-opacity='1'/%3E%3C/svg%3E");
}

.portrait-box {
  width: 160px;
  height: 160px;
  border: 4px solid #d3a068;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.portrait-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 64px;
  color: white;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
}

.text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.npc-name {
  font-family: 'VT323', monospace;
  font-size: 32px;
  color: #5e361c;
  margin: 0 0 10px 0;
}

.dialogue-text {
  font-family: 'VT323', monospace;
  font-size: 28px;
  color: #3e2723;
  margin: 0;
  line-height: 1.2;
}

.cursor-blink {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 24px;
  color: #8b4513;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.choices-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.choice-btn {
  background: transparent;
  border: none;
  font-family: 'VT323', monospace;
  font-size: 24px;
  color: #3e2723;
  cursor: pointer;
  padding: 5px 10px;
  transition: all 0.2s;
}

.choice-btn:hover {
  color: #8b4513;
  transform: translateX(5px);
}
.choice-btn:before {
  content: '>';
  margin-right: 5px;
  opacity: 0;
}
.choice-btn:hover:before {
  opacity: 1;
}
</style>
