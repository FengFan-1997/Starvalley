<template>
  <div class="carpenter-overlay" @click.self="close">
    <div class="pixel-panel carpenter-content">
      <header class="carpenter-header">
        <h2>罗宾的木匠店</h2>
        <button class="close-btn" @click="close">X</button>
      </header>

      <div class="carpenter-body">
        <div class="building-list">
          <div
            v-for="building in availableBuildings"
            :key="building.id"
            class="building-card"
            :class="{ active: selectedBuilding?.id === building.id }"
            @click="selectBuilding(building)"
          >
            <div class="building-preview">
               <!-- Placeholder for building preview -->
               <div class="preview-box" :style="{ width: building.width * 16 + 'px', height: building.height * 16 + 'px' }">
                   {{ building.name }}
               </div>
            </div>
            <div class="building-info">
              <h3>{{ building.name }}</h3>
              <p>{{ building.description }}</p>
              <div class="costs">
                <span class="cost-gold">💰 {{ building.goldCost }} G</span>
                <span class="cost-res" v-for="(qty, res) in building.resourceCost" :key="res">
                  {{ getResourceIcon(res) }} {{ qty }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="details-panel" v-if="selectedBuilding">
             <h3>建造 {{ selectedBuilding.name }}</h3>
             <p>需要材料:</p>
             <ul>
                 <li>金币: {{ selectedBuilding.goldCost }} (拥有: {{ playerGold }})</li>
                 <li v-for="(qty, res) in selectedBuilding.resourceCost" :key="res">
                     {{ getResourceName(res) }}: {{ qty }} (拥有: {{ getResourceCount(res) }})
                 </li>
             </ul>
             <div class="actions">
                 <button class="pixel-btn" @click="construct" :disabled="!canAfford">建造</button>
             </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game'

// Define available buildings
interface BuildingDefinition {
    id: string
    name: string
    description: string
    width: number
    height: number
    goldCost: number
    resourceCost: Record<string, number>
    type: string // 'barn', 'coop', etc.
}

const availableBuildings: BuildingDefinition[] = [
    {
        id: 'coop',
        name: '鸡舍',
        description: '饲养鸡的地方。',
        width: 6,
        height: 3,
        goldCost: 4000,
        resourceCost: { wood: 300, stone: 100 },
        type: 'coop'
    },
    {
        id: 'barn',
        name: '畜棚',
        description: '饲养牛羊的地方。',
        width: 7,
        height: 4,
        goldCost: 6000,
        resourceCost: { wood: 350, stone: 150 },
        type: 'barn'
    },
    {
        id: 'silo',
        name: '筒仓',
        description: '储存干草。',
        width: 3,
        height: 3,
        goldCost: 100,
        resourceCost: { stone: 100, clay: 10, copper_bar: 5 },
        type: 'silo'
    }
]

const gameStore = useGameStore()
// Remove local isOpen, rely on v-if
const selectedBuilding = ref<BuildingDefinition | null>(null)

const playerGold = computed(() => gameStore.playerGold)

const getResourceCount = (resId: string) => {
    return gameStore.countItem(resId)
}

const getResourceName = (resId: string) => {
    const map: Record<string, string> = { wood: '木头', stone: '石头', clay: '黏土', copper_bar: '铜锭' }
    return map[resId] || resId
}

const getResourceIcon = (resId: string) => {
    const map: Record<string, string> = { wood: '🪵', stone: '🪨', clay: '🧱', copper_bar: '🟧' }
    return map[resId] || '📦'
}

const canAfford = computed(() => {
    if (!selectedBuilding.value) return false
    if (playerGold.value < selectedBuilding.value.goldCost) return false

    for (const [res, qty] of Object.entries(selectedBuilding.value.resourceCost)) {
        if (getResourceCount(res) < qty) return false
    }
    return true
})

const selectBuilding = (building: BuildingDefinition) => {
    selectedBuilding.value = building
}

const open = () => {
    // Open logic handled by v-if in parent
    selectedBuilding.value = availableBuildings[0] || null
}

const close = () => {
    gameStore.closeCarpenterMenu()
}

const construct = () => {
    if (!selectedBuilding.value || !canAfford.value) return

    // Start placement mode
    gameStore.startBuildingPlacement({
        buildingId: selectedBuilding.value.id,
        width: selectedBuilding.value.width,
        height: selectedBuilding.value.height,
        type: selectedBuilding.value.type,
        goldCost: selectedBuilding.value.goldCost,
        resourceCost: selectedBuilding.value.resourceCost
    })

    close()
}

// Expose open method to parent
defineExpose({ open, close })

</script>

<style scoped>
.carpenter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.carpenter-content {
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.carpenter-header {
    padding: 20px;
    border-bottom: 2px solid #8b4513;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.carpenter-body {
    flex: 1;
    display: flex;
    padding: 20px;
    gap: 20px;
}

.building-list {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
}

.building-card {
    display: flex;
    gap: 10px;
    padding: 10px;
    border: 2px solid #d3a068;
    cursor: pointer;
    background: #fff8e1;
}

.building-card.active {
    border-color: #8b4513;
    background: #ffe0b2;
}

.preview-box {
    background: #76b041;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}

.details-panel {
    flex: 1;
    border-left: 2px solid #8b4513;
    padding-left: 20px;
}

.pixel-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: 2px solid #2E7D32;
    font-family: 'VT323', monospace;
    font-size: 20px;
    cursor: pointer;
}

.pixel-btn:disabled {
    background: #ccc;
    border-color: #999;
    cursor: not-allowed;
}

.close-btn {
  background: #ff5252;
  color: white;
  border: 2px solid #d32f2f;
  width: 30px;
  height: 30px;
  font-family: 'VT323', monospace;
  font-size: 20px;
  cursor: pointer;
}
</style>
