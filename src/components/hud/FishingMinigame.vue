<template>
  <div class="fishing-minigame" v-if="isActive" @mousedown.prevent="handleMouseDown" @mouseup.prevent="handleMouseUp" @touchstart.prevent="handleMouseDown" @touchend.prevent="handleMouseUp">
    <div class="bar-container">
      <div class="bar-bg">
        <!-- Treasure Chest -->
        <div v-if="hasTreasure && !treasureCollected" class="treasure-chest" :style="{ top: treasurePosition + '%' }">
            <div class="treasure-progress" :style="{ width: treasureProgress + '%' }"></div>
            🎁
        </div>

        <!-- Fish -->
        <div class="fish" :style="{ top: fishPosition + '%' }">
            {{ getFishIcon() }}
        </div>

        <!-- Green Bar -->
        <div class="green-bar" :style="{ top: barPosition + '%', height: barHeight + '%' }"></div>
      </div>

      <!-- Progress -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ height: progress + '%', backgroundColor: progressColor }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const isActive = computed(() => gameStore.fishingState.state === 'reeling')
const barPosition = ref(80) // 0-100
const barHeight = ref(25) // Percentage (Stardew bar is about 1/4 or 1/5)
const fishPosition = ref(80)
const progress = ref(20) // 0-100
const velocity = ref(0)
const gravity = 0.4
const lift = -1.2

const isHolding = ref(false)
let gameLoop: number | null = null

// Fish AI
let fishTarget = 50
let fishTimer = 0
let fishSpeed = 0

// Treasure
const hasTreasure = computed(() => gameStore.fishingState.treasure)
const treasurePosition = ref(20)
const treasureProgress = ref(0)
const treasureCollected = ref(false)

const progressColor = computed(() => {
    if (progress.value > 80) return '#00ff00'
    if (progress.value > 40) return '#ffff00'
    return '#ff0000'
})

const getFishIcon = () => {
    const id = gameStore.fishingState.fishId
    if (id === 'pufferfish') return '🐡'
    if (id === 'catfish') return '🐟' // Need better icon?
    if (id === 'sardine') return '🐟'
    return '🐟'
}

const handleMouseDown = () => {
    isHolding.value = true
}

const handleMouseUp = () => {
    isHolding.value = false
}

const update = () => {
    if (!isActive.value) return

    // --- Bar Physics ---
    if (isHolding.value) {
        velocity.value += lift
    }
    velocity.value += gravity

    barPosition.value += velocity.value

    // Bounce/Bounds
    if (barPosition.value < 0) {
        barPosition.value = 0
        velocity.value = 0 // Stardew hits top hard
    }
    if (barPosition.value > 100 - barHeight.value) {
        barPosition.value = 100 - barHeight.value
        // Bounce logic: if hitting hard, bounce.
        if (velocity.value > 1) {
            velocity.value = -velocity.value * 0.4
        } else {
            velocity.value = 0
        }
    }

    // --- Fish AI ---
    fishTimer++
    const difficulty = gameStore.fishingState.difficulty || 40
    const behavior = gameStore.fishingState.behavior || 'mixed'

    // Update target based on behavior
    if (behavior === 'smooth') {
        if (fishTimer > 20) {
             fishTimer = 0
             // Smooth random walk
             fishTarget = Math.max(0, Math.min(100, fishPosition.value + (Math.random() - 0.5) * 30))
        }
    } else if (behavior === 'dart') {
        if (fishTimer > (Math.random() * 50 + 20)) {
            fishTimer = 0
            // Jump
            fishTarget = Math.random() * 90
        }
    } else if (behavior === 'floater') {
        // Tends to float up
        if (fishTimer > 10) {
            fishTimer = 0
            fishTarget -= Math.random() * 5
            if (Math.random() < 0.1) fishTarget += 20 // Occasional drop
            fishTarget = Math.max(0, Math.min(100, fishTarget))
        }
    } else {
        // Mixed
        if (fishTimer > 30) {
            fishTimer = 0
            fishTarget = Math.random() * 90
        }
    }

    // Move fish
    const diff = fishTarget - fishPosition.value
    // Speed depends on difficulty
    const maxSpeed = difficulty / 20 // 1 to 5
    const acceleration = 0.2

    if (Math.abs(diff) < 1) {
        fishSpeed = 0
    } else {
        if (diff > 0) fishSpeed = Math.min(fishSpeed + acceleration, maxSpeed)
        else fishSpeed = Math.max(fishSpeed - acceleration, -maxSpeed)
    }

    fishPosition.value += fishSpeed
    // Clamp fish
    if (fishPosition.value < 0) fishPosition.value = 0
    if (fishPosition.value > 95) fishPosition.value = 95 // 5% padding for icon size

    // --- Collision Detection ---
    const barTop = barPosition.value
    const barBottom = barPosition.value + barHeight.value
    // Fish is about 5% height? Center point
    const fishCenter = fishPosition.value + 2.5

    const isCatching = fishCenter >= barTop && fishCenter <= barBottom

    if (isCatching) {
        progress.value = Math.min(100, progress.value + 0.3)
    } else {
        progress.value = Math.max(0, progress.value - 0.4) // Lose faster than gain usually
    }

    // --- Treasure Logic ---
    if (hasTreasure.value && !treasureCollected.value) {
        // Treasure box size approx 8%
        const tTop = treasurePosition.value
        const tBottom = treasurePosition.value + 8

        // Bar must cover treasure
        // Bar covers treasure if barTop <= tTop && barBottom >= tBottom
        // (Simplified: check overlap)
        const isCoveringTreasure = (barTop <= tTop + 4) && (barBottom >= tBottom - 4)

        if (isCoveringTreasure) {
            // Must also be catching fish? No, Stardew allows getting treasure while losing fish progress (risky)
            treasureProgress.value += 1.5
            if (treasureProgress.value >= 100) {
                treasureCollected.value = true
                treasureProgress.value = 100
                // Play sound
            }
        } else {
            treasureProgress.value = Math.max(0, treasureProgress.value - 1)
        }
    }

    // --- Win/Lose ---
    if (progress.value >= 100) {
        gameStore.completeFishing(true, treasureCollected.value)
    } else if (progress.value <= 0) {
        gameStore.completeFishing(false, false)
    }

    if (isActive.value) {
        gameLoop = requestAnimationFrame(update)
    }
}

watch(isActive, (val) => {
    if (val) {
        // Reset
        barPosition.value = 80
        progress.value = 20
        velocity.value = 0
        fishPosition.value = 80
        isHolding.value = false

        // Treasure Setup
        treasureCollected.value = false
        treasureProgress.value = 0
        if (hasTreasure.value) {
            // Random pos between 10 and 90
            treasurePosition.value = 10 + Math.random() * 70
        }

        if (!gameLoop) update()
    } else {
        if (gameLoop) cancelAnimationFrame(gameLoop)
        gameLoop = null
    }
})

// Add key listeners for spacebar
const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && isActive.value) {
        isHolding.value = true
    }
}
const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space' && isActive.value) {
        isHolding.value = false
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    if (gameLoop) cancelAnimationFrame(gameLoop)
})

</script>

<style scoped>
.fishing-minigame {
    position: absolute;
    top: 50%;
    left: 70%; /* Offset to right like Stardew */
    transform: translate(-50%, -50%);
    width: 60px;
    height: 300px;
    background: #2a2a2a;
    border: 4px solid #d3a068;
    border-radius: 4px;
    display: flex;
    padding: 4px;
    z-index: 2000;
    pointer-events: auto; /* Catch clicks */
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.bar-container {
    flex: 1;
    background: #0066cc; /* Water bg */
    position: relative;
    border: 2px solid #000;
    margin-right: 4px;
    overflow: hidden;
    background: linear-gradient(to bottom, #2980b9, #2c3e50);
}

.progress-container {
    width: 10px;
    background: #333;
    display: flex;
    flex-direction: column-reverse; /* Bottom up */
    border: 1px solid #000;
}

.progress-bar {
    width: 100%;
    transition: height 0.1s;
}

.green-bar {
    position: absolute;
    left: 0;
    right: 0;
    background: rgba(100, 255, 100, 0.6);
    border-top: 2px solid #aaffaa;
    border-bottom: 2px solid #00aa00;
    box-sizing: border-box;
}

.fish {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    line-height: 1;
    z-index: 10;
}

.treasure-chest {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 20px;
    line-height: 1;
    z-index: 5;
}

.treasure-progress {
    position: absolute;
    top: -5px;
    left: 0;
    height: 4px;
    background: #ffd700;
    border: 1px solid #fff;
}
</style>
