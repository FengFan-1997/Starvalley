<template>
  <div class="crafting-container">
    <!-- Category Tabs -->
    <div class="tabs">
        <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-btn"
            :class="{ active: currentTab === tab.key }"
            @click="currentTab = tab.key"
        >
            {{ tab.label }}
        </button>
    </div>

    <!-- Recipes Grid -->
    <div class="recipes-grid">
      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="recipe-slot"
        :class="{
          'can-craft': canCraft(recipe),
          'cannot-craft': !canCraft(recipe),
          selected: selectedRecipe?.id === recipe.id
        }"
        @click="selectRecipe(recipe)"
      >
        <span class="recipe-icon">{{ recipe.icon }}</span>
      </div>
    </div>

    <!-- Recipe Details -->
    <div class="recipe-details pixel-panel" v-if="selectedRecipe">
      <div class="detail-header">
        <span class="detail-icon">{{ selectedRecipe.icon }}</span>
        <div class="detail-info">
          <h3>{{ selectedRecipe.name }}</h3>
          <p class="description">{{ selectedRecipe.description }}</p>
        </div>
      </div>

      <div class="ingredients-list">
        <h4>所需材料:</h4>
        <div
          v-for="ing in selectedRecipe.ingredients"
          :key="ing.itemId"
          class="ingredient-item"
          :class="{ 'has-enough': hasEnough(ing) }"
        >
          <span class="ing-icon">{{ getIcon(ing.itemId) }}</span>
          <span class="ing-name">{{ getName(ing.itemId) }}</span>
          <span class="ing-qty">{{ getQty(ing.itemId) }} / {{ ing.quantity }}</span>
        </div>
      </div>

      <div class="craft-actions">
        <PixelButton
          :disabled="!canCraft(selectedRecipe)"
          @click="craft(selectedRecipe)"
        >
          制作
        </PixelButton>
      </div>
    </div>

    <div class="recipe-details pixel-panel empty-details" v-else>
      <p>选择一个配方开始制作</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore, ITEMS, type CraftingRecipe, type CraftingIngredient } from '@/stores/game'
import PixelButton from '@/components/ui/PixelButton.vue'

const gameStore = useGameStore()
const recipes = computed(() => gameStore.craftingRecipes)
const inventory = computed(() => gameStore.gameState.inventory)
const selectedRecipe = ref<CraftingRecipe | null>(null)

const tabs = [
    { key: 'all', label: '全部' },
    { key: 'equipment', label: '设备' },
    { key: 'decor', label: '装饰' },
    { key: 'consumable', label: '消耗' },
    { key: 'misc', label: '杂项' }
]
const currentTab = ref('all')

const filteredRecipes = computed(() => {
    if (currentTab.value === 'all') return recipes.value

    return recipes.value.filter(r => {
        const id = r.id.toLowerCase()
        if (currentTab.value === 'equipment') {
            return id.includes('chest') || id.includes('furnace') || id.includes('maker') ||
                   id.includes('sprinkler') || id.includes('scarecrow') || id.includes('kiln') ||
                   id.includes('hive') || id.includes('tapper') || id.includes('press') || id.includes('loom')
        }
        if (currentTab.value === 'decor') {
            return id.includes('fence') || id.includes('floor') || id.includes('path') ||
                   id.includes('gate') || id.includes('sign') || id.includes('lamp') || id.includes('brazier') || id.includes('torch')
        }
        if (currentTab.value === 'consumable') {
            return id.includes('fertilizer') || id.includes('speed') || id.includes('snack') ||
                   id.includes('warp') || id.includes('totem') || id.includes('bomb') || id.includes('bait')
        }
        if (currentTab.value === 'misc') {
            // Seeds and others
            return id.includes('seeds') || (!id.includes('chest') && !id.includes('furnace') && !id.includes('maker') &&
                   !id.includes('sprinkler') && !id.includes('scarecrow') && !id.includes('fence') && !id.includes('floor') &&
                   !id.includes('fertilizer') && !id.includes('path') && !id.includes('gate') && !id.includes('sign'))
        }
        return true
    })
})

const selectRecipe = (recipe: CraftingRecipe) => {
  selectedRecipe.value = recipe
}

const canCraft = (recipe: CraftingRecipe) => {
  return gameStore.canCraft(recipe)
}

const hasEnough = (ing: CraftingIngredient) => {
  return gameStore.countItem(ing.itemId) >= ing.quantity
}

const getIcon = (itemId: string) => {
  return ITEMS[itemId]?.icon || '❓'
}

const getName = (itemId: string) => {
  return ITEMS[itemId]?.name || itemId
}

const getQty = (itemId: string) => {
  return gameStore.countItem(itemId)
}

const craft = (recipe: CraftingRecipe) => {
  if (gameStore.craftItem(recipe.id)) {
    // Play sound?
    // Refresh check is automatic due to reactivity
  }
}
</script>

<style scoped>
.crafting-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.tabs {
    display: flex;
    gap: 8px;
    padding: 0 10px;
    margin-bottom: 5px;
}

.tab-btn {
    padding: 6px 12px;
    background: #dcdcdc;
    border: 3px solid #888;
    border-bottom: none;
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px 4px 0 0;
    color: #555;
    transition: all 0.1s;
}

.tab-btn.active {
    background: #fff;
    border-color: #d3a068;
    color: #333;
    transform: translateY(2px);
    padding-bottom: 8px;
    z-index: 10;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  padding: 10px;
  overflow-y: auto;
  flex: 1;
}

.recipe-slot {
  aspect-ratio: 1;
  background: #dcdcdc;
  border: 4px solid var(--sdv-border-medium);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-shadow: inset 4px 4px 0 rgba(255,255,255,0.5), inset -4px -4px 0 rgba(0,0,0,0.2);
  transition: transform 0.1s;
}

.recipe-slot:hover {
  transform: scale(1.05);
}

.recipe-slot.can-craft {
  background: #fff;
}

.recipe-slot.cannot-craft {
  background: #a0a0a0;
  opacity: 0.7;
  filter: grayscale(1);
}

.recipe-slot.selected {
  border-color: var(--sdv-highlight);
  background: var(--sdv-slot-active-bg);
  box-shadow: 0 0 0 4px var(--sdv-highlight);
  z-index: 1;
  transform: scale(1.1);
}

.recipe-icon {
  font-size: 32px;
  filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.3));
}

.recipe-details {
  height: 220px;
  padding: 20px;
  background: var(--sdv-bg-cream);
  display: flex;
  flex-direction: column;
  border-top: 4px solid var(--sdv-border-light);
}

.detail-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  border-bottom: 2px solid var(--sdv-border-light);
  padding-bottom: 10px;
}

.detail-icon {
  font-size: 48px;
  background: rgba(0,0,0,0.05);
  padding: 5px;
  border-radius: 4px;
}

.detail-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.description {
  color: #666;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

.ingredients-list {
  flex: 1;
  margin-bottom: 10px;
  overflow-y: auto;
}

.ingredients-list h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #555;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  color: #d32f2f; /* Red if not enough */
}

.ingredient-item.has-enough {
  color: #388e3c; /* Green if enough */
}

.ing-icon {
  font-size: 20px;
}

.ing-name {
  flex: 1;
}

.craft-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-details {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}
</style>
