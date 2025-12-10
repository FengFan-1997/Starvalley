<template>
  <div class="skills-container">
    <div class="skills-grid">
      <!-- Farming -->
      <div class="skill-card pixel-panel">
        <div class="skill-header">
          <span class="skill-icon">🌾</span>
          <div class="skill-info">
            <h3>耕种 (Farming)</h3>
            <span class="skill-level">Lv. {{ skills.farming }}</span>
          </div>
        </div>
        <div class="exp-bar-container">
          <div class="exp-bar-fill" :style="{ width: getExpPercentage(skills.farmingExp, skills.farming) + '%' }"></div>
          <span class="exp-text">{{ skills.farmingExp }} / {{ getNextLevelExp(skills.farming) }} XP</span>
        </div>
      </div>

      <!-- Mining -->
      <div class="skill-card pixel-panel">
        <div class="skill-header">
          <span class="skill-icon">⛏️</span>
          <div class="skill-info">
            <h3>采矿 (Mining)</h3>
            <span class="skill-level">Lv. {{ skills.mining }}</span>
          </div>
        </div>
        <div class="exp-bar-container">
          <div class="exp-bar-fill" :style="{ width: getExpPercentage(skills.miningExp, skills.mining) + '%' }"></div>
          <span class="exp-text">{{ skills.miningExp }} / {{ getNextLevelExp(skills.mining) }} XP</span>
        </div>
      </div>

      <!-- Foraging -->
      <div class="skill-card pixel-panel">
        <div class="skill-header">
          <span class="skill-icon">🌲</span>
          <div class="skill-info">
            <h3>采集 (Foraging)</h3>
            <span class="skill-level">Lv. {{ skills.foraging }}</span>
          </div>
        </div>
        <div class="exp-bar-container">
          <div class="exp-bar-fill" :style="{ width: getExpPercentage(skills.foragingExp, skills.foraging) + '%' }"></div>
          <span class="exp-text">{{ skills.foragingExp }} / {{ getNextLevelExp(skills.foraging) }} XP</span>
        </div>
      </div>

      <!-- Fishing -->
      <div class="skill-card pixel-panel">
        <div class="skill-header">
          <span class="skill-icon">🎣</span>
          <div class="skill-info">
            <h3>钓鱼 (Fishing)</h3>
            <span class="skill-level">Lv. {{ skills.fishing }}</span>
          </div>
        </div>
        <div class="exp-bar-container">
          <div class="exp-bar-fill" :style="{ width: getExpPercentage(skills.fishingExp, skills.fishing) + '%' }"></div>
          <span class="exp-text">{{ skills.fishingExp }} / {{ getNextLevelExp(skills.fishing) }} XP</span>
        </div>
      </div>

      <!-- Combat -->
      <div class="skill-card pixel-panel">
        <div class="skill-header">
          <span class="skill-icon">⚔️</span>
          <div class="skill-info">
            <h3>战斗 (Combat)</h3>
            <span class="skill-level">Lv. {{ skills.combat }}</span>
          </div>
        </div>
        <div class="exp-bar-container">
          <div class="exp-bar-fill" :style="{ width: getExpPercentage(skills.combatExp, skills.combat) + '%' }"></div>
          <span class="exp-text">{{ skills.combatExp }} / {{ getNextLevelExp(skills.combat) }} XP</span>
        </div>
      </div>
    </div>
    
    <div class="player-stats pixel-panel">
       <h3>玩家状态</h3>
       <div class="stats-row">
         <span>总收入: {{ gameStore.gameState.player.gold }} G</span>
         <span>游戏时间: {{ gameStore.gameState.gameTime.toFixed(1) }} 小时</span>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const skills = computed(() => gameStore.gameState.player.skills)

// Simple exponential curve or fixed table
const getNextLevelExp = (level: number) => {
  // Stardew: Level 1=100, 2=380, 3=770...
  // Simplified: 100 * level * level + 100?
  // Let's use simple linear for now: (level + 1) * 100
  return (level + 1) * 100
}

const getExpPercentage = (exp: number, level: number) => {
  const next = getNextLevelExp(level)
  // Simplified percentage for current level progress
  return Math.min(100, (exp / next) * 100)
}
</script>

<style scoped>
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 10px;
  overflow-y: auto;
}

.skill-card {
  padding: 12px;
  background: #fffae3;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-icon {
  font-size: 24px;
  background: rgba(0,0,0,0.05);
  padding: 4px;
  border-radius: 4px;
}

.skill-info h3 {
  margin: 0;
  font-size: 18px;
  color: #5d4037;
}

.skill-level {
  font-weight: bold;
  color: #3e2723;
}

.exp-bar-container {
  height: 12px;
  background: #d7ccc8;
  border: 2px solid #8d6e63;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #66bb6a, #43a047);
  width: 0%;
  transition: width 0.3s;
}

.exp-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 10px;
  line-height: 12px;
  color: #fff;
  text-shadow: 1px 1px 0 #000;
}

.player-stats {
  padding: 15px;
  background: #fff8e1;
}

.player-stats h3 {
  margin-top: 0;
  border-bottom: 2px solid #eac092;
  padding-bottom: 5px;
}

.stats-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #5d4037;
}
</style>
