<template>
  <div class="shop-overlay" v-if="isOpen" @click.self="close">
    <div class="pixel-panel shop-content">
      <header class="shop-header">
        <div class="tabs">
          <button 
            class="tab-btn" 
            :class="{ active: mode === 'buy' }"
            @click="mode = 'buy'"
          >
            购买
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: mode === 'sell' }"
            @click="mode = 'sell'"
          >
            出售
          </button>
        </div>
        <button class="close-btn" @click="close">X</button>
      </header>
      
      <div class="shop-body">
        <!-- Buy Mode -->
        <div class="shop-items" v-if="mode === 'buy'">
          <div 
            v-for="item in items" 
            :key="item.id" 
            class="shop-item"
            @click="buy(item)"
          >
            <span class="item-icon">{{ getIcon(item.id) }}</span>
            <div class="item-info">
              <span class="item-name">{{ getName(item.id) }}</span>
              <span class="item-price">{{ item.price }} G</span>
            </div>
          </div>
        </div>

        <!-- Sell Mode -->
        <div class="shop-items" v-else>
           <div 
            v-for="item in sellableInventory" 
            :key="item.id" 
            class="shop-item"
            @click="sell(item)"
          >
            <span class="item-icon">{{ item.icon }}</span>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
              <span class="item-price">{{ getSellPrice(item.id) }} G</span>
            </div>
          </div>
          <div v-if="sellableInventory.length === 0" class="empty-message">
            没有可出售的物品
          </div>
        </div>
        
        <div class="player-gold">
          💰 {{ playerGold }} G
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore, ITEMS, type InventoryItem } from '@/stores/game'

const gameStore = useGameStore()
const isOpen = computed(() => gameStore.shopState.isOpen)
const items = computed(() => gameStore.shopState.items)
const playerGold = computed(() => gameStore.playerGold)
const inventory = computed(() => gameStore.gameState.inventory)

const mode = ref<'buy' | 'sell'>('buy')

const sellableInventory = computed(() => {
  return inventory.value.filter(item => {
    const def = ITEMS[item.id]
    return def && def.sellPrice && def.sellPrice > 0
  })
})

const close = () => {
  gameStore.closeShop()
  mode.value = 'buy' // Reset mode
}

const buy = (item: { id: string, price: number }) => {
  if (gameStore.buyItem(item.id, 1, item.price)) {
    // Maybe play sound
  } else {
    // Show error (not enough gold)
    alert('金币不足！')
  }
}

const sell = (item: InventoryItem) => {
  if (gameStore.sellItem(item.id, 1)) {
    // Sold 1 unit
  }
}

const getIcon = (id: string) => {
  return ITEMS[id]?.icon || '📦'
}

const getName = (id: string) => {
  return ITEMS[id]?.name || id
}

const getSellPrice = (id: string) => {
  return ITEMS[id]?.sellPrice || 0
}
</script>

<style scoped>
.shop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.shop-content {
  width: 600px;
  height: 400px;
  background: #fff8e1;
  display: flex;
  flex-direction: column;
  border: 4px solid #8b4513;
  box-shadow: 10px 10px 0 rgba(0,0,0,0.2);
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 4px solid #8b4513;
  background: #ffcc80;
}

.tabs {
  display: flex;
  gap: 10px;
}

.tab-btn {
  background: #e0e0e0;
  border: 2px solid #8b4513;
  border-bottom: none;
  padding: 5px 15px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  color: #5d4037;
}

.tab-btn.active {
  background: #fff8e1;
  padding-top: 8px; /* Lift up */
  margin-top: -3px;
}

.shop-body {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff8e1;
}

.shop-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  overflow-y: auto;
  max-height: 250px;
  flex: 1;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 2px solid #8b4513;
  cursor: pointer;
  background: #fff;
  transition: transform 0.1s;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
}

.shop-item:hover {
  transform: scale(1.02);
  background: #f0f0f0;
}

.item-icon {
  font-size: 32px;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: bold;
  font-size: 18px;
  color: #3e2723;
}

.item-price {
  color: #8b4513;
  font-family: 'Courier New', monospace;
}

.item-qty {
    font-size: 14px;
    color: #555;
}

.player-gold {
  font-size: 24px;
  font-weight: bold;
  text-align: right;
  color: #ffca28;
  text-shadow: 2px 2px 0 #000;
  background: rgba(0,0,0,0.5);
  padding: 10px;
  border-radius: 4px;
  align-self: flex-end;
}

.close-btn {
  background: #d32f2f;
  color: white;
  border: 2px solid #b71c1c;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
}

.empty-message {
    grid-column: span 2;
    text-align: center;
    color: #999;
    margin-top: 50px;
}
</style>
