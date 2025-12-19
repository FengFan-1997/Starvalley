<script setup lang="ts">
import GameWindow from '../components/GameWindow.vue'
import TitleScreen from '../components/TitleScreen.vue'
import { ref } from 'vue'

const gameStarted = ref(false)

const startGame = () => {
  gameStarted.value = true
}
</script>

<template>
  <main>
    <TitleScreen v-if="!gameStarted" @start-game="startGame" />
    <GameWindow v-else @return-to-title="gameStarted = false" />
  </main>
</template>

<style>
main {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
}
</style>
