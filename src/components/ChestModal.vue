<template>
  <div class="chest-modal pixel-panel" v-if="isOpen">
    <div class="modal-header">
      <h2>箱子</h2>
      <button class="close-btn" @click="close">×</button>
    </div>
    
    <div class="chest-content">
      <!-- Player Inventory -->
      <div class="inventory-section">
        <h3>背包</h3>
        <div class="inventory-grid">
           <div 
             v-for="(item, index) in inventory" 
             :key="'inv-' + index" 
             class="item-slot"
             :class="{ 'has-item': item }"
             @click="moveToChest(index)"
           >
              <div v-if="item" class="item-inner">
                  <span class="item-icon">{{ item.icon }}</span>
                  <span class="item-qty" v-if="item.quantity > 1">{{ item.quantity }}</span>
                  <div class="tooltip">{{ item.name }}</div>
              </div>
           </div>
           <!-- Empty slots filler if needed -->
        </div>
      </div>

      <!-- Arrow Divider -->
      <div class="divider">
          <span>⇄</span>
      </div>

      <!-- Chest Inventory -->
      <div class="chest-section">
        <h3>箱子</h3>
        <div class="inventory-grid">
           <div 
             v-for="(item, index) in chestItems" 
             :key="'chest-' + index" 
             class="item-slot"
             :class="{ 'has-item': item }"
             @click="moveToInventory(index)"
           >
              <div v-if="item" class="item-inner">
                  <span class="item-icon">{{ item.icon }}</span>
                  <span class="item-qty" v-if="item.quantity > 1">{{ item.quantity }}</span>
                  <div class="tooltip">{{ item.name }}</div>
              </div>
           </div>
           <!-- Fill up to capacity (e.g. 20 slots) -->
           <div 
             v-for="i in Math.max(0, 20 - chestItems.length)" 
             :key="'empty-' + i" 
             class="item-slot empty"
           ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const isOpen = computed(() => gameStore.chestState.isOpen)
const inventory = computed(() => gameStore.gameState.inventory)
const chestItems = computed(() => gameStore.chestState.items)

const close = () => {
  gameStore.closeChest()
}

const moveToChest = (index: number) => {
    gameStore.transferToChest(index)
}

const moveToInventory = (index: number) => {
    gameStore.transferToInventory(index)
}
</script>

<style scoped>
.chest-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background: #fffae3;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 100;
  pointer-events: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 2px solid #eac092;
  padding-bottom: 5px;
}

.modal-header h2 {
  margin: 0;
  color: #5d4037;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #5d4037;
}

.chest-content {
    display: flex;
    flex: 1;
    gap: 10px;
    overflow: hidden;
}

.inventory-section, .chest-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.inventory-section h3, .chest-section h3 {
    margin: 0 0 10px 0;
    color: #8d6e63;
    font-size: 16px;
}

.inventory-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: 50px;
    gap: 5px;
    overflow-y: auto;
    padding: 2px;
}

.divider {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #8d6e63;
    width: 30px;
}

.item-slot {
  background: rgba(0,0,0,0.05);
  border: 2px solid #d7ccc8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: all 0.1s;
}

.item-slot:hover {
    background: rgba(0,0,0,0.1);
    border-color: #a1887f;
}

.item-slot.has-item {
    background: #fff;
    border-color: #8d6e63;
}

.item-inner {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.item-icon {
    font-size: 24px;
}

.item-qty {
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 12px;
    color: #3e2723;
    font-weight: bold;
}

.tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
}

.item-slot:hover .tooltip {
    opacity: 1;
}
</style>
