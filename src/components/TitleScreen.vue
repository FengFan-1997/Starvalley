<template>
  <div class="title-screen">
    <!-- Background layers -->
    <div class="sky-layer"></div>
    <div class="mountain-layer">
      <div class="mountain-back"></div>
      <div class="mountain-front"></div>
    </div>
    <div class="forest-layer"></div>

    <div class="title-content">
      <div class="logo-container">
        <h1 class="game-title">Stardew</h1>
        <h2 class="game-subtitle">Vue Valley</h2>
      </div>

      <div class="menu-box pixel-border">
        <div class="wood-texture">
          <PixelButton class="menu-btn" @click="$emit('start-game')">
            <span>新游戏</span> (New Game)
          </PixelButton>
          <PixelButton class="menu-btn" :disabled="!hasSave" @click="$emit('load-game')">
            <span>加载</span> (Load)
          </PixelButton>
          <PixelButton class="menu-btn" disabled>
            <span>退出</span> (Exit)
          </PixelButton>
        </div>
      </div>

      <div class="credits">
        <p>Ver 0.0.1 - Created with Vue 3 & Pixi.js</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PixelButton from '@/components/ui/PixelButton.vue'

defineEmits(['start-game', 'load-game'])
const hasSave = ref(false)

onMounted(() => {
  hasSave.value = !!localStorage.getItem('stardew-game-save')
})
</script>

<style scoped>
.title-screen {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 60%, #fff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', Courier, monospace; /* Fallback pixel-ish font */
}

.sky-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 10px, transparent 11px),
    radial-gradient(circle at 25% 60%, rgba(255,255,255,0.8) 15px, transparent 16px),
    radial-gradient(circle at 80% 40%, rgba(255,255,255,0.8) 20px, transparent 21px);
  opacity: 0.6;
  z-index: 0;
  animation: floatClouds 60s linear infinite;
}

@keyframes floatClouds {
  from { background-position: 0 0; }
  to { background-position: 1000px 0; }
}

.mountain-layer {
  position: absolute;
  bottom: 20%;
  left: 0;
  width: 100%;
  height: 40%;
  z-index: 1;
}

.mountain-back {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80%;
  background: #5D4037;
  clip-path: polygon(0% 100%, 20% 40%, 40% 90%, 60% 30%, 80% 80%, 100% 20%, 100% 100%);
}

.mountain-front {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: #3E2723;
  clip-path: polygon(0% 100%, 15% 50%, 35% 80%, 55% 20%, 75% 70%, 100% 40%, 100% 100%);
}

.forest-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25%;
  background: #2E7D32;
  z-index: 2;
  /* Trees silhouette using gradient */
  background-image: repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 20px,
    #1B5E20 20px,
    #1B5E20 40px
  );
  clip-path: polygon(0 20%, 5% 0, 10% 20%, 15% 0, 20% 20%, 25% 0, 30% 20%, 35% 0, 40% 20%, 45% 0, 50% 20%, 55% 0, 60% 20%, 65% 0, 70% 20%, 75% 0, 80% 20%, 85% 0, 90% 20%, 95% 0, 100% 20%, 100% 100%, 0 100%);
}

.title-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 600px;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
  animation: float 4s ease-in-out infinite;
  text-shadow: 4px 4px 0px #2b170a;
}

.game-title {
  font-size: 5rem;
  color: #ff9800; /* Orange/Gold */
  background: linear-gradient(to bottom, #ffd54f 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* Stroke effect trick */
  text-shadow:
    3px 3px 0px #3E2723,
    -1px -1px 0 #3E2723,
    1px -1px 0 #3E2723,
    -1px 1px 0 #3E2723,
    1px 1px 0 #3E2723;
  margin-bottom: 0;
  line-height: 1;
}

.game-subtitle {
  font-size: 2.5rem;
  color: #8BC34A;
  text-shadow: 2px 2px 0px #1B5E20;
  margin-top: 10px;
}

.menu-box {
  background-color: #D7CCC8;
  padding: 8px; /* Border width */
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  width: 300px;
}

/* Pixel Border Effect */
.pixel-border {
  box-shadow:
    -4px 0 0 0 #3E2723,
    4px 0 0 0 #3E2723,
    0 -4px 0 0 #3E2723,
    0 4px 0 0 #3E2723;
  margin: 4px; /* Space for the shadow border */
}

.wood-texture {
  background-color: #8D6E63;
  border: 2px solid #5D4037;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  /* Wood grain effect */
  background-image:
    repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px);
}

.menu-btn {
  width: 100%;
  font-size: 1.2rem;
  padding: 12px;
}

.credits {
  margin-top: 20px;
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  font-size: 0.8rem;
  background: rgba(0,0,0,0.3);
  padding: 5px 10px;
  border-radius: 4px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
