<template>
  <div class="inventory-container">
    <!-- Main Inventory Grid -->
    <div class="inventory-grid">
      <div
        v-for="item in inventory"
        :key="item.id"
        class="inventory-slot"
        :class="{ empty: !item, selected: selectedItem?.id === item?.id }"
        @click="item && handleItemClick(item)"
      >
        <template v-if="item">
          <span class="item-icon">{{ item.icon }}</span>
          <span class="item-qty" v-if="item.quantity > 1">{{ item.quantity }}</span>
        </template>
      </div>
      <!-- Fill remaining slots up to 36 (3 rows of 12) -->
      <div v-for="i in Math.max(0, 36 - inventory.length)" :key="'empty-'+i" class="inventory-slot empty"></div>
    </div>

    <!-- Description / Details Panel -->
    <div class="item-details pixel-panel" v-if="selectedItem">
      <div class="detail-header">
        <span class="detail-icon">{{ selectedItem.icon }}</span>
        <div class="detail-name-qty">
          <h3>{{ selectedItem.name }}</h3>
          <!-- <span class="detail-type">Resource</span> -->
        </div>
        <button class="trash-btn" @click="trashSelectedItem" title="Delete Item">🗑️</button>
      </div>
      <p class="detail-desc">{{ selectedItem.description }}</p>
    </div>
    <div class="item-details pixel-panel empty-details" v-else>
      <p>选择一个物品查看详情</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore, type InventoryItem } from '@/stores/game'

const gameStore = useGameStore()
const inventory = computed(() => gameStore.gameState.inventory)
const selectedItem = ref<InventoryItem | null>(null)

const handleItemClick = (item: InventoryItem) => {
  selectedItem.value = item
}

const trashSelectedItem = () => {
  if (selectedItem.value) {
    if (confirm(`确定要丢弃 ${selectedItem.value.name} 吗?`)) {
      gameStore.removeFromInventory(selectedItem.value.id, selectedItem.value.quantity)
      selectedItem.value = null
    }
  }
}
</script>

<style scoped>
/* Inventory Styles */
.inventory-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
}

.inventory-slot {
  aspect-ratio: 1;
  background: #e0e0e0;
  border: 4px solid var(--sdv-border-medium);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-shadow: inset 4px 4px 0 rgba(255,255,255,0.5), inset -4px -4px 0 rgba(0,0,0,0.2);
}

.inventory-slot.empty {
  background: rgba(0,0,0,0.1);
  box-shadow: inset 4px 4px 0 rgba(0,0,0,0.2);
}

.inventory-slot.selected {
  border-color: var(--sdv-highlight);
  background: var(--sdv-slot-active-bg);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 206, 108, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(255, 206, 108, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 206, 108, 0); }
}

.item-icon {
  font-size: 32px;
  filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.3));
}

.item-qty {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-family: 'VT323', monospace;
  font-size: 20px;
  color: white;
  text-shadow: 2px 2px 0 #000;
}

.item-details {
  height: 120px;
  padding: 15px;
  background: #fff8e1;
}

.detail-header {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  align-items: center;
}

.detail-name-qty {
  flex: 1;
}

.trash-btn {
  background: #d32f2f;
  border: 2px solid #b71c1c;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.trash-btn:hover {
  background: #ff5252;
}

.detail-icon {
  font-size: 32px;
  background: rgba(0,0,0,0.1);
  padding: 5px;
  border-radius: 4px;
}

.detail-name-qty h3 {
  margin: 0;
  color: #333;
}

.detail-desc {
  color: #555;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.empty-details {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}
</style>
