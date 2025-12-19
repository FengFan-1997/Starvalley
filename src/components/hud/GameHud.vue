<template>
  <div class="game-hud">
    <FishingMinigame />
    <ChestModal />
    <QuestLog />

    <!-- Top Right Status Panel (Date, Weather, Time, Gold) -->
    <div class="hud-top-right">
      <!-- Date/Time Box -->
      <div class="date-time-box pixel-panel">
        <div class="date-section">
          <div class="date-text">{{ gameDay }}</div>
          <div class="weather-icon-box">
             <span class="season-icon">{{ seasonIcon }}</span>
             <img v-if="gameStore.gameState.weather === 'sunny'" :src="getIconUrl('icon_sun')" class="pixel-icon" />
             <img v-else-if="gameStore.gameState.weather === 'rainy'" :src="getIconUrl('icon_rain')" class="pixel-icon" />
             <img v-else-if="gameStore.gameState.weather === 'storm'" :src="getIconUrl('icon_storm')" class="pixel-icon" />
             <img v-else-if="gameStore.gameState.weather === 'snow'" :src="getIconUrl('icon_snow')" class="pixel-icon" />
             <img v-else-if="gameStore.gameState.weather === 'cloudy'" :src="getIconUrl('icon_cloudy')" class="pixel-icon" />
             <span class="weather-icon" v-else-if="gameStore.gameState.weather === 'windy'">🍃</span>
          </div>
        </div>
        <div class="time-section">
          <div class="time-text">{{ gameTime }}</div>
        </div>
      </div>

      <!-- Gold Box -->
      <div class="gold-box pixel-panel">
        <span class="gold-amount">{{ playerGold }}</span>
        <span class="gold-label">G</span>
      </div>

      <!-- Quest Button -->
      <div class="quest-btn-container pixel-panel" @click="gameStore.isQuestLogOpen = !gameStore.isQuestLogOpen" title="任务日志">
        <img :src="getIconUrl('icon_quest')" class="pixel-icon" />
        <span class="quest-alert" v-if="gameStore.gameState.quests.some(q => !q.completed && q.currentCount >= q.count)">!</span>
      </div>

      <!-- Menu Button -->
      <div class="menu-btn-container" @click="$emit('toggle-menu')">
        <div class="menu-hamburger">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <!-- Mine Level Indicator -->
    <div class="mine-level-indicator" v-if="gameStore.gameState.location === 'mine'">
       <div class="mine-panel pixel-panel">
         <span>💀 {{ gameStore.gameState.mineLevel }}</span>
       </div>
    </div>

    <!-- Right Side Status Bars (Energy/Health) -->
    <div class="hud-right-bars">
      <div class="bar-container">
        <div class="bar-track">
          <div class="bar-fill energy" :style="{ height: (playerEnergy / playerMaxEnergy) * 100 + '%' }"></div>
        </div>
        <div class="bar-label">E</div>
      </div>
      <div class="bar-container" v-if="playerHealth < playerMaxHealth || gameStore.gameState.location === 'mine'">
        <div class="bar-track">
          <div class="bar-fill health" :style="{ height: (playerHealth / playerMaxHealth) * 100 + '%' }"></div>
        </div>
        <div class="bar-label">H</div>
      </div>
    </div>

    <!-- Bottom Toolbar (Centered) -->
    <div class="toolbar-wrapper">
      <!-- Tooltip Area -->
      <div class="toolbar-tooltip" v-if="hoveredToolName">
        {{ hoveredToolName }}
      </div>

      <div class="toolbar-bg pixel-panel">
        <div class="tool-slots">
          <button
            v-for="(tool, index) in tools"
            :key="index"
            class="tool-slot"
            :class="{ active: tool && selectedTool === tool.id, empty: !tool }"
            @click="tool && selectTool(tool.id)"
            @mouseenter="tool ? hoveredToolName = tool.name : null"
            @mouseleave="hoveredToolName = ''"
          >
            <span class="slot-number">{{ getSlotKey(index) }}</span>
            <template v-if="tool">
              <span class="tool-icon">{{ tool.icon }}</span>
              <span class="item-quantity" v-if="tool.quantity > 1">{{ tool.quantity }}</span>
              <!-- Capacity/Durability Bar -->
              <div class="tool-bar-container" v-if="tool.data && tool.data.maxWater">
                <div class="tool-bar-fill" :style="{ width: ((tool.data.water ?? 0) / tool.data.maxWater * 100) + '%' }"></div>
              </div>
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useGameStore, type InventoryItem } from '@/stores/game'
import FishingMinigame from '@/components/hud/FishingMinigame.vue'
import ChestModal from '@/components/ChestModal.vue'
import QuestLog from '@/components/hud/QuestLog.vue'
import { TextureManager } from '@/utils/TextureManager'

const gameStore = useGameStore()

const getIconUrl = (key: string) => {
  return TextureManager.getInstance().getDataUrl(key)
}

const gameTime = computed(() => gameStore.gameState.currentTime.split(' ')[1]) // "6:00"
const gameDay = computed(() => gameStore.gameState.currentTime.split(' ')[0]) // "Spring 1"
const seasonIcon = computed(() => {
  switch (gameStore.gameState.currentSeason) {
    case 'spring': return '🌸'
    case 'summer': return '🌻'
    case 'autumn': return '🍂'
    case 'winter': return '☃️'
    default: return '🌱'
  }
})
const playerGold = computed(() => gameStore.playerGold)
const playerEnergy = computed(() => gameStore.playerEnergy)
const playerMaxEnergy = computed(() => gameStore.gameState.player.maxEnergy)
const playerHealth = computed(() => gameStore.gameState.player.health)
const playerMaxHealth = computed(() => gameStore.gameState.player.maxHealth)
const selectedTool = computed(() => gameStore.selectedTool)

const tools = computed(() => {
  const inv = gameStore.gameState.inventory.slice(0, 12)
  // Pad with nulls to ensure 12 slots
  const padded: (InventoryItem | null)[] = [...inv]
  while (padded.length < 12) {
    padded.push(null)
  }
  return padded
})

const hoveredToolName = ref('')

const selectTool = (toolId: string) => {
  gameStore.setSelectedTool(toolId)
}

const getSlotKey = (index: number) => {
  if (index === 9) return '0'
  if (index === 10) return '-'
  if (index === 11) return '='
  return (index + 1).toString()
}

const handleKeydown = (e: KeyboardEvent) => {
  const key = e.key
  let index = -1
  if (key === '0') index = 9
  else if (key === '-') index = 10
  else if (key === '=') index = 11
  else {
    const num = parseInt(key)
    if (!isNaN(num) && num >= 1 && num <= 9) {
      index = num - 1
    }
  }

  if (index >= 0 && index < 12) {
    const tool = tools.value[index]
    if (tool) {
      selectTool(tool.id)
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.game-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let clicks pass through to canvas */
  z-index: 10;
  padding: 10px;
  font-family: 'VT323', monospace;
}

.pixel-panel {
  background-color: var(--sdv-bg-cream, #fffae3);
  border: 4px solid var(--sdv-border-dark, #4a2c16);
  border-image-slice: 4 fill;
  border-image-width: 4px;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.3);
  pointer-events: auto;
}

/* Top Right */
.hud-top-right {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.date-time-box {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  min-width: 160px;
  background: #fffae3;
  gap: 4px;
}

.date-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eac092;
  padding-bottom: 4px;
  margin-bottom: 2px;
}

.date-text {
  font-size: 20px;
  color: #5d4037;
}

.weather-icon-box {
  font-size: 20px;
}

.time-section {
  text-align: right;
}

.time-text {
  font-size: 28px;
  font-weight: bold;
  color: #3e2723;
  letter-spacing: 2px;
  text-shadow: 1px 1px 0 #eac092;
}

.gold-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  padding: 8px 12px;
  background: #ffd54f; /* Gold background */
  border-color: #f57f17;
  min-width: 120px;
}

.gold-amount {
  font-size: 24px;
  font-weight: bold;
  color: #3e2723;
}

.gold-label {
  font-size: 16px;
  font-weight: bold;
  color: #5d4037;
}

.quest-btn-container {
  width: 48px;
  height: 48px;
  background-color: #f1c40f;
  border: 3px solid #f39c12;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
  transition: transform 0.1s;
  position: relative;
}

.quest-btn-container:active {
  transform: scale(0.95);
}

.quest-icon {
  font-size: 24px;
}

.quest-alert {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  border: 2px solid white;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.menu-btn-container {
  width: 48px;
  height: 48px;
  background-color: var(--sdv-bg-wood, #8b4513);
  border: 3px solid var(--sdv-border-light, #b97a57);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
  transition: transform 0.1s;
}

.menu-btn-container:active {
  transform: scale(0.95);
}

.menu-hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.menu-hamburger span {
  display: block;
  width: 24px;
  height: 4px;
  background-color: #fff;
  border-radius: 1px;
}

/* Right Side Bars */
.hud-right-bars {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: row-reverse;
  gap: 12px;
  align-items: flex-end;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bar-track {
  width: 24px;
  height: 160px;
  background-color: rgba(0,0,0,0.6);
  border: 3px solid #3e2723;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 2px 2px 4px rgba(0,0,0,0.5);
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease-out;
}

.bar-fill.energy {
  background: linear-gradient(to right, #f57f17, #ffd54f, #f57f17);
}

.bar-fill.health {
  background: linear-gradient(to right, #c62828, #ef5350, #c62828);
}

.bar-label {
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 0 #000;
  font-size: 16px;
  background-color: #3e2723;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 2px solid #5d4037;
}

/* Bottom Toolbar */
.toolbar-wrapper {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.toolbar-tooltip {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 20px;
  pointer-events: none;
  text-shadow: 1px 1px 0 #000;
}

.toolbar-bg {
  padding: 6px;
  background: linear-gradient(to bottom, #d7ccc8, #a1887f);
  border: 4px solid #5d4037;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.4);
}

.tool-slots {
  display: flex;
  gap: 6px;
}

.tool-slot {
  width: 56px;
  height: 56px;
  background-color: #d7ccc8;
  border: 3px solid #8d6e63;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  box-shadow: inset 3px 3px 0 rgba(255,255,255,0.3), inset -3px -3px 0 rgba(0,0,0,0.2);
  transition: transform 0.1s;
}

.tool-slot:hover {
  transform: scale(1.05);
  background-color: #efebe9;
}

.tool-slot.active {
  border: 4px solid #fdd835; /* Selection Highlight */
  box-shadow: 0 0 12px rgba(253, 216, 53, 0.6);
  transform: scale(1.1);
  z-index: 2;
}

.tool-icon {
  font-size: 32px;
  filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.3));
}

.slot-number {
  position: absolute;
  top: 2px;
  left: 4px;
  font-size: 12px;
  color: #5d4037;
  font-weight: bold;
}

.item-quantity {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
}

.tool-bar-container {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  height: 4px;
  background-color: #555;
  border: 1px solid #000;
}

.tool-bar-fill {
  height: 100%;
  background-color: #00BFFF; /* Water Blue */
  transition: width 0.2s;
}

.tool-slot.empty {
  cursor: default;
  opacity: 0.8;
}
</style>
