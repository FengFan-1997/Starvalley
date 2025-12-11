<template>
  <div class="quest-log pixel-panel" v-if="isOpen">
    <div class="modal-header">
      <h2>任务日志</h2>
      <button class="close-btn" @click="close">×</button>
    </div>
    
    <div class="quest-list">
      <div v-if="quests.length === 0" class="no-quests">
        暂无任务
      </div>
      
      <div 
        v-for="quest in quests" 
        :key="quest.id" 
        class="quest-item pixel-panel"
        :class="{ completed: quest.completed }"
      >
        <div class="quest-header">
          <span class="quest-title">{{ quest.title }}</span>
          <span class="quest-status" v-if="quest.completed">✅ 完成</span>
          <span class="quest-status" v-else>进行中</span>
        </div>
        
        <div class="quest-description">
          {{ quest.description }}
        </div>
        
        <div class="quest-progress">
          <div class="progress-text">
            进度: {{ quest.currentCount }} / {{ quest.count }} {{ quest.targetName }}
          </div>
          <div class="progress-bar-track">
            <div 
              class="progress-bar-fill" 
              :style="{ width: Math.min(100, (quest.currentCount / quest.count) * 100) + '%' }"
            ></div>
          </div>
        </div>
        
        <div class="quest-reward">
          奖励: {{ quest.reward }}G
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const isOpen = computed(() => gameStore.isQuestLogOpen)
const quests = computed(() => gameStore.gameState.quests)

const close = () => {
  gameStore.isQuestLogOpen = false
}
</script>

<style scoped>
.quest-log {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 600px;
  background: #fffae3;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 100;
  pointer-events: auto;
  box-shadow: 0 0 0 4px #8b4513, 0 10px 20px rgba(0,0,0,0.5);
  border-radius: 8px;
  font-family: 'Minecraft', sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #d4a373;
  padding-bottom: 10px;
}

.modal-header h2 {
  margin: 0;
  color: #5d4037;
  font-size: 24px;
}

.close-btn {
  background: #ff6b6b;
  border: 2px solid #c0392b;
  color: white;
  width: 32px;
  height: 32px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 0 #c0392b;
}

.close-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.quest-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.no-quests {
  text-align: center;
  color: #8d6e63;
  margin-top: 50px;
  font-size: 18px;
}

.quest-item {
  background: #fff;
  border: 2px solid #d7ccc8;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 2px 2px 0 #d7ccc8;
  transition: transform 0.1s;
}

.quest-item:hover {
  transform: translateY(-2px);
}

.quest-item.completed {
  background: #f0f4c3;
  border-color: #c5e1a5;
  opacity: 0.8;
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.quest-title {
  font-weight: bold;
  color: #3e2723;
  font-size: 18px;
}

.quest-status {
  font-size: 14px;
  font-weight: bold;
  color: #e67e22;
}

.quest-item.completed .quest-status {
  color: #27ae60;
}

.quest-description {
  color: #5d4037;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.4;
}

.quest-progress {
  margin-bottom: 10px;
}

.progress-text {
  font-size: 12px;
  color: #795548;
  margin-bottom: 4px;
}

.progress-bar-track {
  width: 100%;
  height: 10px;
  background: #efebe9;
  border: 1px solid #d7ccc8;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #2ecc71;
  transition: width 0.3s ease;
}

.quest-reward {
  font-size: 14px;
  color: #f39c12;
  font-weight: bold;
  text-align: right;
}

/* Scrollbar */
.quest-list::-webkit-scrollbar {
  width: 8px;
}

.quest-list::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 4px;
}
 
.quest-list::-webkit-scrollbar-thumb {
  background: #d7ccc8; 
  border-radius: 4px;
}

.quest-list::-webkit-scrollbar-thumb:hover {
  background: #a1887f; 
}
</style>
