<template>
  <div class="game-window">
    <!-- Main Game Canvas -->
    <main class="game-canvas-container">
      <GameCanvas ref="gameCanvasRef" />
    </main>

    <!-- Unified Game HUD -->
    <GameHud
      @toggle-menu="toggleMenu"
    />

    <!-- Dialogue Overlay -->
    <DialogueBox
      v-if="gameStore.dialogueState.isOpen"
      :name="gameStore.dialogueState.name"
      :text="gameStore.dialogueState.text"
      :portrait-color="gameStore.dialogueState.portraitColor"
      :choices="gameStore.dialogueState.choices"
      @close="gameStore.closeDialogue()"
    />

    <!-- Unified Menu Modal -->
    <Transition name="modal-fade">
      <div class="modal-overlay" v-if="showMenu" @click.self="showMenu = false">
        <div class="pixel-panel modal-content">
          <header class="modal-header">
            <div class="tab-buttons">
              <button
                v-for="tab in ['inventory', 'crafting', 'map', 'skills', 'settings']"
                :key="tab"
                class="tab-btn"
                :class="{ active: activeTab === tab }"
                @click="activeTab = tab"
              >
                {{ getTabIcon(tab) }} {{ getTabName(tab) }}
              </button>
            </div>
            <button class="close-btn pixel-btn danger" @click="showMenu = false">X</button>
          </header>

          <div class="modal-body">
            <InventoryModal v-if="activeTab === 'inventory'" :embedded="true" />
            <CraftingModal v-if="activeTab === 'crafting'" />
            <MapModal v-if="activeTab === 'map'" :embedded="true" />
            <SkillsModal v-if="activeTab === 'skills'" />
            <div v-if="activeTab === 'settings'" class="settings-panel">
              <h3 class="settings-title">游戏设置</h3>
              <div class="setting-item">
                <label>音效音量</label>
                <input type="range" min="0" max="100" />
              </div>
              <div class="setting-item">
                <label>音乐音量</label>
                <input type="range" min="0" max="100" />
              </div>

              <div class="setting-actions">
                <PixelButton @click="saveGame">保存游戏</PixelButton>
                <PixelButton @click="loadGame">读取存档</PixelButton>
                <PixelButton @click="testShop">商店测试</PixelButton>
                <PixelButton variant="danger" @click="returnToTitle">返回标题</PixelButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <ShopModal />
    <CarpenterMenu ref="carpenterMenuRef" v-if="gameStore.carpenterState.isOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import GameCanvas from './GameCanvas.vue'
import GameHud from '@/components/hud/GameHud.vue'
import InventoryModal from './InventoryModal.vue'
import CraftingModal from './CraftingModal.vue'
import MapModal from './MapModal.vue'
import SkillsModal from './SkillsModal.vue'
import ShopModal from './ShopModal.vue'
import DialogueBox from '@/components/ui/DialogueBox.vue'
import PixelButton from '@/components/ui/PixelButton.vue'
import { useGameStore } from '@/stores/game'

import CarpenterMenu from './CarpenterMenu.vue'

const emit = defineEmits(['return-to-title'])
const gameStore = useGameStore()
const gameCanvasRef = ref(null)
const carpenterMenuRef = ref<InstanceType<typeof CarpenterMenu> | null>(null)

// Watch for Robin shop call from game logic (if triggered via state, but we call via openDialogue currently)
// Actually game logic calls openDialogue.
// We need to bridge the "Construction" option in Robin's dialogue to opening this menu.
// The dialogue action in game.ts calls 'openShop' or 'openDialogue'.
// We should add a specific action for opening carpenter menu.
// For now, let's expose a global event bus or store flag?
// Or better: Add 'carpenterState' to store similar to 'shopState'.

// Let's stick to the current plan: game.ts interacts with Robin.
// We need to update game.ts to support opening Carpenter Menu.
// I will modify game.ts to have carpenterState.

const showMenu = ref(false)
const activeTab = ref('inventory')

watch(showMenu, (val) => {
  gameStore.isMenuOpen = val
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const getTabIcon = (tab: string) => {
  switch (tab) {
    case 'inventory': return '🎒'
    case 'crafting': return '🔨'
    case 'map': return '🗺️'
    case 'skills': return '📊'
    case 'settings': return '⚙️'
    default: return ''
  }
}

const getTabName = (tab: string) => {
  switch (tab) {
    case 'inventory': return '物品'
    case 'crafting': return '制作'
    case 'map': return '地图'
    case 'skills': return '技能'
    case 'settings': return '设置'
    default: return ''
  }
}


const saveGame = () => {
  gameStore.saveGame()
  alert('游戏已保存！')
}

const loadGame = () => {
  if (gameStore.loadGame()) {
    alert('存档已读取！')
  } else {
    alert('没有找到存档！')
  }
}

const testShop = () => {
  gameStore.openShop([
    { id: 'parsnip_seed', price: 20 },
    { id: 'potato_seed', price: 50 },
    { id: 'basic_fertilizer', price: 100 }
  ])
  showMenu.value = false
}

const returnToTitle = () => {
  if (confirm('确定要返回标题画面吗？未保存的进度将会丢失。')) {
    gameStore.stopGameLoop()
    emit('return-to-title')
  }
}
</script>

<style scoped>
.game-window {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #000;
}

.game-canvas-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* Modals & Overlays z-index management */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* High z-index for menus */
  backdrop-filter: blur(2px);
}

.modal-content {
  width: 850px;
  height: 600px;
  display: flex;
  flex-direction: column;
  padding: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0z' fill='%23fffae3' fill-opacity='1'/%3E%3Cpath d='M0 0h1v1H0zM2 2h1v1H2z' fill='%23f0e6c0' fill-opacity='0.4'/%3E%3C/svg%3E");
}

.modal-header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 16px;
  margin-top: -30px; /* Tabs stick out top */
}

.tab-buttons {
  display: flex;
  gap: 8px;
}

.tab-btn {
  background: var(--sdv-bg-tan);
  border: 4px solid var(--sdv-border-dark);
  border-bottom: none;
  padding: 8px 16px 4px;
  font-family: 'VT323', monospace;
  font-size: 24px;
  color: var(--sdv-text-dark);
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transform: translateY(4px);
  transition: transform 0.2s;
}

.tab-btn.active {
  background: var(--sdv-bg-cream);
  transform: translateY(0);
  padding-bottom: 8px;
  z-index: 1;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  padding: 0;
  margin-bottom: -10px;
}

.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  position: relative;
  z-index: 0; /* Below tabs */
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.settings-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 20px;
  border-bottom: 2px dashed var(--sdv-border-medium);
  padding-bottom: 10px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
