<template>
  <div class="map-container pixel-panel inner-panel">
    <div class="map-content">
      <canvas ref="mapCanvas" class="mini-map"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { MAPS } from '@/data/maps'

const gameStore = useGameStore()
const mapCanvas = ref<HTMLCanvasElement>()

const drawMap = () => {
  const plots = gameStore.gameState.plots
  const h = plots.length
  const w = plots[0]?.length || 0
  const canvas = mapCanvas.value
  if (!canvas || h === 0 || w === 0) return
  const maxSize = 320
  const tile = Math.max(2, Math.floor(maxSize / Math.max(w, h)))
  canvas.width = w * tile
  canvas.height = h * tile
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  for (let y = 0; y < h; y++) {
    const row = plots[y] || []
    for (let x = 0; x < w; x++) {
      const p = row[x]
      if (!p) continue
      let c = '#7cb342'
      if (p.terrain === 'water') c = '#42a5f5'
      else if (p.terrain === 'paved') c = '#9e9e9e'
      else if (p.terrain === 'floor') c = '#ffe0b2'
      else if (p.terrain === 'floor_light') c = '#fff3e0'
      else if (p.terrain === 'dirt') c = '#8d6e63'
      ctx.fillStyle = c
      ctx.fillRect(x * tile, y * tile, tile, tile)
    }
  }
  const cfg = MAPS[gameStore.gameState.location]
  if (cfg && cfg.buildings) {
    ctx.fillStyle = 'rgba(121,85,72,0.8)'
    cfg.buildings.forEach(b => {
      ctx.fillRect(b.x * tile, b.y * tile, b.width * tile, b.height * tile)
      if (b.doorX !== undefined && b.doorY !== undefined) {
        ctx.fillStyle = '#ffeb3b'
        ctx.fillRect(b.doorX * tile, b.doorY * tile, tile, tile)
        ctx.fillStyle = 'rgba(121,85,72,0.8)'
      }
    })
  }
  const px = gameStore.gameState.player.x
  const py = gameStore.gameState.player.y
  ctx.fillStyle = '#e53935'
  const r = Math.max(2, Math.floor(tile / 2))
  ctx.beginPath()
  ctx.arc(px * tile + tile / 2, py * tile + tile / 2, r, 0, Math.PI * 2)
  ctx.fill()
}

onMounted(drawMap)
watch(() => gameStore.gameState.location, drawMap)
watch(() => gameStore.gameState.plots, drawMap, { deep: true })
watch(() => [gameStore.gameState.player.x, gameStore.gameState.player.y], drawMap)
</script>

<style scoped>

.map-container {
  flex: 1;
  background: #e6d6ad;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.inner-panel {
  box-shadow: inset 4px 4px 0 rgba(0,0,0,0.2);
  border: 4px solid var(--sdv-border-dark);
}

.map-content {
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #8b4513;
}

.mini-map {
  width: 100%;
  height: auto;
  image-rendering: pixelated;
  border: 4px solid var(--sdv-border-medium);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.3);
}
</style>
