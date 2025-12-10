<template>
  <div class="game-container">
    <TitleScreen
      v-if="currentView === 'title'"
      @start-game="goToCreation"
      @load-game="loadGame"
    />
    <CharacterCreation
      v-else-if="currentView === 'creation'"
      @back="currentView = 'title'"
      @complete="startGame"
    />
    <GameWindow
      v-else-if="currentView === 'game'"
      @return-to-title="currentView = 'title'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import GameWindow from './components/GameWindow.vue'
import TitleScreen from './components/TitleScreen.vue'
import CharacterCreation from './components/CharacterCreation.vue'

type ViewState = 'title' | 'creation' | 'game'
interface CharacterData {
  name: string
  farmName: string
  favoriteThing: string
  skinColor: string
}

const currentView = ref<ViewState>('title')
const gameStore = useGameStore()

const goToCreation = () => {
  currentView.value = 'creation'
}

const startGame = (characterData: CharacterData) => {
  // Update store with character data
  gameStore.gameState.player.name = characterData.name
  gameStore.gameState.player.farmName = characterData.farmName
  gameStore.gameState.player.favoriteThing = characterData.favoriteThing

  // Initialize game world
  gameStore.initializeGame()

  // Transition to game
  currentView.value = 'game'
}

const loadGame = () => {
  if (gameStore.loadGame()) {
    gameStore.startGameLoop()
    gameStore.switchLocation(
      gameStore.gameState.location,
      gameStore.gameState.player.x,
      gameStore.gameState.player.y
    )
    currentView.value = 'game'
  }
}
</script>

<style>
/* Global styles are handled in assets/base.css and assets/main.css */
.game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c5530; /* Fallback */
  background-image:
    repeating-linear-gradient(45deg, #2c5530 25%, transparent 25%, transparent 75%, #2c5530 75%, #2c5530),
    repeating-linear-gradient(45deg, #2c5530 25%, #1a3d1f 25%, #1a3d1f 75%, #2c5530 75%, #2c5530);
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
}
</style>
