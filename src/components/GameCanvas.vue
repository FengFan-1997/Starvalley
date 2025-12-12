<template>
  <div ref="gameContainer" class="game-canvas"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as PIXI from 'pixi.js'
import { useGameStore, type Plot, type NPC, type Animal } from '@/stores/game'
import { MAPS, type Building } from '@/data/maps'
import { TextureManager } from '@/utils/TextureManager'

// Types
interface PlayerContainer extends PIXI.Container {
  isPlayer?: boolean
}

interface PlotContainer extends PIXI.Container {
  gridX: number
  gridY: number
}

interface BuildingContainer extends PIXI.Container {
  buildingId: string
}

interface NPCContainer extends PIXI.Container {
  npcId: string
}

interface AnimalContainer extends PIXI.Container {
  animalId: string
}

interface DroppedItemContainer extends PIXI.Container {
  itemId: string
  droppedId: string
}

interface WeatherParticle {
  sprite: PIXI.Graphics
  vx: number
  vy: number
  life: number
  type: 'rain' | 'snow' | 'cloud' | 'petal' | 'leaf_ambient'
}

const gameContainer = ref<HTMLDivElement>()
const gameStore = useGameStore()

let app: PIXI.Application | null = null
let gameScene: PIXI.Container | null = null
let weatherContainer: PIXI.Container | null = null
let lightingContainer: PIXI.Container | null = null
let darknessGraphics: PIXI.Graphics | null = null
let selectionGraphics: PIXI.Graphics | null = null
let tooltipContainer: PIXI.Container | null = null
let tooltipBg: PIXI.Graphics | null = null
let tooltipText: PIXI.Text | null = null

const weatherParticles: WeatherParticle[] = []
let lightningTimer = 0
let cloudTimer = 0

const keysPressed: { [key: string]: boolean } = {}
const speed = computed(() => gameStore.isExhausted ? 1.5 : 3)
const TILE_SIZE = 32

let selectedPlotCoords: { x: number, y: number } | null = null
const plotContainers: PlotContainer[][] = []
const frameTick = ref(0)

const updateCharacterSprite = (c: PIXI.Container, s: PIXI.Sprite, base: string, direction: string, isMoving: boolean, isUsingTool: boolean = false) => {
  let animDir = direction
  let scaleX = 1

  if (direction === 'left') {
    animDir = 'side'
    scaleX = -1
  } else if (direction === 'right') {
    animDir = 'side'
    scaleX = 1
  }

  // Use center anchor for flipping
  s.anchor.set(0.5, 0)
  s.x = TILE_SIZE / 2
  s.scale.x = scaleX

  let state = isMoving ? 'walk' : 'idle'
  if (isUsingTool) state = 'action'

  let key = `${base}_${state}_${animDir}`

  if (isMoving && !isUsingTool) {
    const frame = Math.floor(frameTick.value / 10) % 2 + 1
    key += `_${frame}`
  }

  const tm = TextureManager.getInstance()
  let tex = tm.getTexture(key)
  // Fallback to idle if walk missing
  if (tex === PIXI.Texture.WHITE && state === 'walk') {
     tex = tm.getTexture(`${base}_idle_${animDir}`)
  }
  // Fallback to idle if action missing
  if (tex === PIXI.Texture.WHITE && state === 'action') {
     tex = tm.getTexture(`${base}_idle_${animDir}`)
  }
  // Fallback to down if direction missing
  if (tex === PIXI.Texture.WHITE) {
     tex = tm.getTexture(`${base}_idle_down`)
  }

  s.texture = tex

  // Tool Overlay
  let toolSprite = c.getChildByName('tool') as PIXI.Sprite
  if (!toolSprite) {
      toolSprite = new PIXI.Sprite()
      toolSprite.name = 'tool'
      toolSprite.anchor.set(0.5, 0.5) // Center pivot for rotation
      toolSprite.x = TILE_SIZE / 2
      toolSprite.y = TILE_SIZE / 2
      c.addChild(toolSprite)
  }

  if (isUsingTool) {
      const toolId = gameStore.gameState.selectedTool
      let toolTexKey = ''
      if (toolId === 'hoe') toolTexKey = 'tool_hoe'
      else if (toolId === 'pickaxe') toolTexKey = 'tool_pickaxe'
      else if (toolId === 'axe') toolTexKey = 'tool_axe'
      else if (toolId === 'watering') toolTexKey = 'tool_watering_can'
      else if (toolId === 'scythe') toolTexKey = 'tool_scythe'

      if (toolTexKey) {
          toolSprite.visible = true
          toolSprite.texture = tm.getTexture(toolTexKey)

          // Animate tool
          // Simple bob/rotate
          const progress = (gameStore.gameState.player.toolAnimationTimer || 0) / 20 // approximate duration

          // Position offset based on direction
          let offX = 0
          let offY = 0
          if (direction === 'down') { offY = 10; toolSprite.angle = -45 + (progress * 90) }
          else if (direction === 'up') { offY = -10; toolSprite.angle = -45 + (progress * 90); toolSprite.zIndex = -1 } // Behind? Hard with container
          else if (direction === 'left') { offX = -10; toolSprite.angle = -90 + (progress * 90); toolSprite.scale.x = -1 }
          else if (direction === 'right') { offX = 10; toolSprite.angle = 0 + (progress * 90) }

          toolSprite.x = (TILE_SIZE / 2) + offX
          toolSprite.y = (TILE_SIZE / 2) + offY
      } else {
          toolSprite.visible = false
      }
  } else {
      toolSprite.visible = false
  }
}

const isWalkable = (gridX: number, gridY: number) => {
  const plots = gameStore.gameState.plots
  if (gridY < 0 || gridY >= plots.length) return false
  const row = plots[gridY]
  if (!row || gridX < 0 || gridX >= row.length) return false
  const plot = row[gridX]
  if (!plot) return false
  if (plot.terrain === 'water') return false
  if (plot.object) {
    const t = plot.object.type
    if (t === 'stone' || t === 'wood' || t === 'weed' || t === 'fence' || t === 'bed_head' || t === 'bed_foot' || t === 'table') return false
  }
  const cfg = MAPS[gameStore.gameState.location]
  if (cfg && cfg.buildings) {
    for (const b of cfg.buildings) {
      const inX = gridX >= b.x && gridX < b.x + b.width
      const inY = gridY >= b.y && gridY < b.y + b.height
      if (inX && inY) {
        if (b.doorX !== undefined && b.doorY !== undefined && gridX === b.doorX && gridY === b.doorY) continue
        return false
      }
    }
  }
  return true
}

const initPixi = async () => {
  if (!gameContainer.value) return

  // Create PIXI Application
  app = new PIXI.Application()
  await app.init({
    width: gameContainer.value.clientWidth,
    height: gameContainer.value.clientHeight,
    backgroundColor: 0x76b041,
    antialias: false,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  })

  gameContainer.value.appendChild(app.canvas)

  // Main Scene
  gameScene = new PIXI.Container()
  app.stage.addChild(gameScene)

  // Selection Highlight
  selectionGraphics = new PIXI.Graphics()
  selectionGraphics.lineStyle(2, 0xFFFFFF, 0.8)
  selectionGraphics.drawRect(0, 0, TILE_SIZE, TILE_SIZE)
  selectionGraphics.visible = false
  selectionGraphics.zIndex = 9999
  gameScene.addChild(selectionGraphics)

  // Weather Container
  weatherContainer = new PIXI.Container()
  weatherContainer.zIndex = 25000 // Below Darkness, above Game
  // Note: Darkness is 30000. UI Tooltip is 20000 (Wait, tooltip is 20000, Darkness is 30000).
  // Let's adjust Z-Indices.
  // GameScene: Default
  // Darkness: 30000
  // Weather: 25000 (Above Tooltip? No, Tooltip should be highest)
  // Let's make Tooltip 40000.

  // Current Z:
  // Game objects: Y-sort
  // Selection: 9999
  // Overlay (Day/Night): 10000 (Wait, line 224 says 10000)
  // Darkness Overlay (line 208): 30000
  // Tooltip: 20000

  // Revised Z:
  // Game Objects: 0-10000
  // Overlay: 15000
  // Weather: 20000
  // Darkness: 25000
  // Flash: 26000
  // Tooltip: 30000

  weatherContainer.zIndex = 20000
  app.stage.addChild(weatherContainer)

  // Lighting Container (Lights on top of darkness)
  lightingContainer = new PIXI.Container()
  lightingContainer.zIndex = 25001
  app.stage.addChild(lightingContainer)

  // Darkness Overlay (Day/Night Cycle)
  darknessGraphics = new PIXI.Graphics()
  darknessGraphics.name = 'darkness'
  darknessGraphics.beginFill(0xFFFFFF) // White base for tinting
  darknessGraphics.drawRect(0, 0, 10000, 10000) // Huge to cover map
  darknessGraphics.endFill()
  darknessGraphics.alpha = 0
  darknessGraphics.tint = 0x000000
  darknessGraphics.zIndex = 25000
  app.stage.addChild(darknessGraphics)

  // Flash Overlay (Lightning)
  const flashOverlay = new PIXI.Graphics()
  flashOverlay.name = 'flash'
  flashOverlay.beginFill(0xFFFFFF)
  flashOverlay.drawRect(0, 0, 10000, 10000)
  flashOverlay.endFill()
  flashOverlay.alpha = 0
  flashOverlay.zIndex = 26000
  app.stage.addChild(flashOverlay)

  // Tooltip
  tooltipContainer = new PIXI.Container()
  tooltipContainer.zIndex = 30000
  tooltipContainer.visible = false

  tooltipBg = new PIXI.Graphics()
  tooltipContainer.addChild(tooltipBg)

  tooltipText = new PIXI.Text({ text: '', style: {
    fontFamily: 'VT323, monospace',
    fontSize: 16,
    fill: 0xFFFFFF,
    dropShadow: {
      color: 0x000000,
      blur: 2,
      angle: Math.PI / 4,
      distance: 2,
    }
  }})
  tooltipText.x = 8
  tooltipText.y = 4
  tooltipContainer.addChild(tooltipText)

  app.stage.addChild(tooltipContainer)

  // Watchers
  watch(() => gameStore.gameState.location, () => {
    initializeGameWorld()
  })

  // Initialize
  await initializeGameWorld()

  // Loop
  app.ticker.add(() => gameLoop())

  // Events
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  // Mouse Events
  app.canvas.addEventListener('mousemove', handleMouseMove)
  app.canvas.addEventListener('mousedown', handleMouseDown)
}

const initializeGameWorld = async () => {
  if (!gameScene || !app) return

  // Clear Scene
  // Keep selectionGraphics, remove others
  const childrenToRemove = gameScene.children.filter(c => c !== selectionGraphics)
  childrenToRemove.forEach(c => gameScene!.removeChild(c))

  plotContainers.length = 0

  // Render Plots
  gameStore.gameState.plots.forEach(row => {
    const rowContainers: PlotContainer[] = []
    row.forEach(plot => {
      const c = new PIXI.Container() as PlotContainer
      c.gridX = plot.x
      c.gridY = plot.y
      c.x = plot.x * TILE_SIZE
      c.y = plot.y * TILE_SIZE

      renderPlot(c, plot)
      gameScene!.addChild(c)
      rowContainers.push(c)
    })
    plotContainers.push(rowContainers)
  })

  // Render Buildings
  // Use dynamic buildings from GameState instead of static MAPS config
  const currentBuildings = gameStore.gameState.buildings[gameStore.gameState.location] || []

  if (currentBuildings) {
    currentBuildings.forEach(building => {
      const c = new PIXI.Container() as BuildingContainer
      c.buildingId = building.id
      c.x = building.x * TILE_SIZE
      c.y = building.y * TILE_SIZE
      renderBuilding(c, building)
      gameScene!.addChild(c)
    })
  }

  // Render Animals
  // Animals are stored in a flat array, need to filter by location
  const animals = gameStore.gameState.animals.filter(a => a.location === gameStore.gameState.location)
  animals.forEach(animal => {
      const c = new PIXI.Container()
      // Basic animal representation
      const sprite = new PIXI.Text({ text: animal.type === 'chicken' ? '🐔' : (animal.type === 'cow' ? '🐮' : '🐷'), style: { fontSize: 24 } })
      sprite.anchor.set(0.5)

      // Shadow
      const shadow = new PIXI.Graphics()
      shadow.beginFill(0x000000, 0.3)
      shadow.drawEllipse(0, 10, 8, 4)
      shadow.endFill()

      c.addChild(shadow)
      c.addChild(sprite)

      c.x = animal.x * TILE_SIZE + TILE_SIZE/2
      c.y = animal.y * TILE_SIZE + TILE_SIZE/2

      // Store ref to update position in game loop
      // For now, static render or full re-render?
      // Optimization: Update transforms in gameLoop instead of re-creating
      // But initializeGameWorld is called on map load.
      // We need to manage animal sprites in gameLoop or separate container.

      // Let's create an 'animalContainer' or list to update them
      c.label = 'animal_' + animal.id // Tag it
      gameScene!.addChild(c)
  })

  // Render NPCs
  gameStore.gameState.npcs.forEach(npc => {
    let c = gameScene?.getChildByName(`npc_${npc.id}`) as NPCContainer
    if (!c) {
      c = new PIXI.Container() as NPCContainer
      c.name = `npc_${npc.id}`
      c.npcId = npc.id
      c.zIndex = 100 // Base Z
      gameScene?.addChild(c)
    }
    renderNPC(c, npc)
  })

  // Animals
  gameStore.gameState.animals.forEach(animal => {
    let c = gameScene?.getChildByName(`animal_${animal.id}`) as AnimalContainer
    if (!c) {
        c = new PIXI.Container() as AnimalContainer
        c.name = `animal_${animal.id}`
        c.animalId = animal.id
        gameScene?.addChild(c)
    }
    renderAnimal(c, animal)
  })

  // Create Player
  createPlayer()

  gameScene.sortableChildren = true
}

const renderBuilding = (c: BuildingContainer, building: Building) => {
  const tm = TextureManager.getInstance()
  const w = building.width * TILE_SIZE
  const h = building.height * TILE_SIZE

  // Check if we already have the sprite structure
  let buildingRoot = c.getChildByName('root') as PIXI.Container
  if (!buildingRoot) {
    buildingRoot = new PIXI.Container()
    buildingRoot.name = 'root'
    c.addChild(buildingRoot)
  }

  // Clear previous if any (simplified: just remove all children of root)
  // Optimization: Could diff, but rebuilding for few buildings is fine
  buildingRoot.removeChildren()

  // Decide textures based on building type
  let wallTexture = tm.getTexture('wall_wood')
  let roofTexture = tm.getTexture('roof_red')

  if (building.type === 'shop') {
     wallTexture = tm.getTexture('wall_brick')
     roofTexture = tm.getTexture('roof_brown')
  } else if (building.type === 'barn') {
     wallTexture = tm.getTexture('wall_wood')
     roofTexture = tm.getTexture('roof_brown')
  }

  // Roof Height
  const roofHeightTiles = building.height > 2 ? 1.5 : 1
  const roofH = roofHeightTiles * TILE_SIZE
  const wallH = h - roofH

  // Wall (TilingSprite)
  // PIXI.TilingSprite needs a texture that is a valid resource.
  // Our generated textures are from canvas, which works.
  const wall = new PIXI.TilingSprite({
    texture: wallTexture,
    width: w,
    height: wallH
  })
  wall.y = roofH
  buildingRoot.addChild(wall)

  // Roof (TilingSprite)
  const roof = new PIXI.TilingSprite({
    texture: roofTexture,
    width: w + 8, // Slight overhang
    height: roofH
  })
  roof.x = -4
  buildingRoot.addChild(roof)

  // Door
  if (building.doorX !== undefined && building.doorY !== undefined) {
      const doorLocalX = (building.doorX - building.x) * TILE_SIZE
      const doorLocalY = (building.doorY - building.y) * TILE_SIZE

      const door = new PIXI.Sprite(tm.getTexture('door'))
      door.width = TILE_SIZE
      door.height = TILE_SIZE
      door.x = doorLocalX
      door.y = doorLocalY
      buildingRoot.addChild(door)
  }

  // Windows
  // Simple logic: add windows if wide enough
  if (building.width >= 3) {
      const winY = roofH + (wallH - TILE_SIZE)/2 - 5 // Centered on wall vertically-ish

      const win1 = new PIXI.Sprite(tm.getTexture('window'))
      win1.width = TILE_SIZE
      win1.height = TILE_SIZE
      win1.x = TILE_SIZE * 0.5
      win1.y = winY
      buildingRoot.addChild(win1)

      const win2 = new PIXI.Sprite(tm.getTexture('window'))
      win2.width = TILE_SIZE
      win2.height = TILE_SIZE
      win2.x = w - TILE_SIZE * 1.5
      win2.y = winY
      buildingRoot.addChild(win2)
  }

  // Z-Index based on Y position (bottom of building)
  c.zIndex = (building.y + building.height - 1) * TILE_SIZE
}

const addShadow = (c: PIXI.Container) => {
    let shadow = c.getChildByName('shadow') as PIXI.Graphics
    if (!shadow) {
        shadow = new PIXI.Graphics()
        shadow.name = 'shadow'
        shadow.beginFill(0x000000, 0.3)
        shadow.drawEllipse(0, 0, 10, 5)
        shadow.endFill()
        shadow.x = TILE_SIZE / 2
        shadow.y = TILE_SIZE - 2
        // We want shadow at the bottom of the container stack usually,
        // but for y-sorting, the container Z is used.
        // Inside the container, 0 is fine if sprite is added after, or we use setChildIndex.
        c.addChildAt(shadow, 0)
    }
}

const renderNPC = (c: NPCContainer, npc: NPC) => {
   let s = c.getChildByName('sprite') as PIXI.Sprite
   if (!s) {
       s = new PIXI.Sprite()
       s.name = 'sprite'
       s.width = TILE_SIZE
       s.height = TILE_SIZE
       c.addChild(s)
       addShadow(c)
   }

   // Update texture with animation support
   const tm = TextureManager.getInstance()
   const baseKey = npc.id
   const testKey = `${baseKey}_idle_down`
   let useBase = baseKey

   // Fallback to generic char if custom sprite missing
   if (tm.getTexture(testKey) === PIXI.Texture.WHITE) {
       useBase = 'char'
   }

   updateCharacterSprite(c, s, useBase, npc.direction || 'down', npc.isMoving || false)

   if (useBase === 'char') {
       s.tint = npc.spriteColor || 0xFFFFFF
   } else {
       s.tint = 0xFFFFFF
   }

   c.x = npc.x * TILE_SIZE
   c.y = npc.y * TILE_SIZE
   c.zIndex = c.y + TILE_SIZE

   // Interaction Bubble
   let bubble = c.getChildByName('bubble') as PIXI.Sprite
   const player = gameStore.gameState.player
   const dist = Math.abs(npc.x - player.x) + Math.abs(npc.y - player.y)

   // Show bubble if close and not talking
   if (dist <= 1.5 && npc.currentDialogueIndex < npc.dialogues.length) {
       if (!bubble) {
           bubble = new PIXI.Sprite(TextureManager.getInstance().getTexture('emote_question'))
           bubble.name = 'bubble'
           bubble.width = 16
           bubble.height = 16
           bubble.anchor.set(0.5)
           bubble.x = TILE_SIZE / 2
           bubble.y = -8
           c.addChild(bubble)
       }
       bubble.visible = true
       // Float animation
       bubble.y = -8 + Math.sin(frameTick.value / 5) * 2
   } else {
       if (bubble) bubble.visible = false
   }
}

const renderAnimal = (c: AnimalContainer, animal: Animal) => {
   let s = c.getChildByName('sprite') as PIXI.Sprite
   if (!s) {
       s = new PIXI.Sprite()
       s.name = 'sprite'
       s.width = TILE_SIZE
       s.height = TILE_SIZE
       c.addChild(s)
       addShadow(c)
   }

   // Texture based on type
   let textureKey = 'chicken' // Default
   if (animal.type === 'cow') textureKey = 'cow'
   else if (animal.type === 'sheep') textureKey = 'sheep'
   else if (animal.type === 'pig') textureKey = 'pig'
   else if (animal.type === 'duck') textureKey = 'duck'

   // Simple animation frame toggle if needed, or use static for now
   // Maybe toggle frame if moving?
   // For now assume single texture
   s.texture = TextureManager.getInstance().getTexture(textureKey)

   // Direction flip?
   // Animals usually face left/right
   // If we track direction, we can flip
   // s.scale.x = animal.direction === 'left' ? 1 : -1

   c.x = animal.x * TILE_SIZE
   c.y = animal.y * TILE_SIZE
   c.zIndex = c.y + TILE_SIZE

   // Emote bubble (heart/mood)
   let bubble = c.getChildByName('bubble') as PIXI.Sprite
   if (animal.hasPet) {
        if (!bubble) {
           bubble = new PIXI.Sprite(TextureManager.getInstance().getTexture('emote_heart'))
           bubble.name = 'bubble'
           bubble.width = 16
           bubble.height = 16
           bubble.anchor.set(0.5)
           bubble.x = TILE_SIZE / 2
           bubble.y = -8
           c.addChild(bubble)
        }
        bubble.visible = true
        bubble.y = -8 + Math.sin(frameTick.value / 5) * 2
        bubble.alpha -= 0.01 // Fade out effect maybe?
        if (bubble.alpha <= 0) {
            bubble.visible = false
            bubble.alpha = 1
            // animal.hasPet = false // Don't reset here, handled by day change
        }
   } else {
       if (bubble) bubble.visible = false
   }
}

const renderPlot = (c: PlotContainer, plot: Plot) => {
  const tm = TextureManager.getInstance()

  // Ground
  let ground = c.getChildByName('ground') as PIXI.Sprite
  if (!ground) {
    ground = new PIXI.Sprite()
    ground.name = 'ground'
    ground.width = TILE_SIZE
    ground.height = TILE_SIZE
    c.addChildAt(ground, 0)
  }

  if (plot.isTilled) {
      ground.texture = tm.getTexture(plot.isWatered ? 'tilled_wet' : 'tilled')
  } else {
      switch (plot.terrain) {
        case 'water': ground.texture = tm.getTexture('water'); break;
        case 'paved': ground.texture = tm.getTexture('floor_stone'); break;
        case 'floor': ground.texture = tm.getTexture('floor_wood'); break;
        case 'floor_light': ground.texture = tm.getTexture('floor_light'); break;
        case 'grass':
        default:
            const season = gameStore.gameState.currentSeason
            // Random variations based on position
            const seed = (plot.x * 37 + plot.y * 13) % 100

            if (season === 'winter') {
                 ground.texture = tm.getTexture('snow')
            } else if (season === 'autumn') {
                 ground.texture = tm.getTexture('grass_autumn')
            } else {
                 if (seed < 5) ground.texture = tm.getTexture('flower_red')
                 else if (seed < 10) ground.texture = tm.getTexture('flower_yellow')
                 else ground.texture = tm.getTexture('grass')
            }
            break;
      }
  }

  // Object (Stone, Wood, Weed, Giant Crop)
  let obj = c.getChildByName('object') as PIXI.Sprite
  const giantId = `giant_${plot.x}_${plot.y}`
  let giantSprite = gameScene?.getChildByName(giantId) as PIXI.Sprite

  if (plot.object) {
      const isGiant = (plot.object.width && plot.object.width > 1) || (plot.object.height && plot.object.height > 1)

      if (isGiant) {
          // Handle Giant Object (Render to Scene, not PlotContainer)
          if (!giantSprite) {
              giantSprite = new PIXI.Sprite()
              giantSprite.name = giantId
              gameScene?.addChild(giantSprite)
          }

          // Texture
          // Try specific giant texture first
           let texName = plot.object.type
           // Custom property
           if (plot.object.cropType) {
              // Custom property
              texName = `giant_${plot.object.cropType}`
           }

           let tex = tm.getTexture(texName)
          if (tex === PIXI.Texture.WHITE) {
              // Fallback to type
              tex = tm.getTexture(plot.object.type)
          }

          giantSprite.texture = tex
          giantSprite.width = (plot.object.width || 1) * TILE_SIZE
          giantSprite.height = (plot.object.height || 1) * TILE_SIZE
          giantSprite.x = plot.x * TILE_SIZE
          giantSprite.y = plot.y * TILE_SIZE
          // Z-Index based on bottom of object
          giantSprite.zIndex = (plot.y + (plot.object.height || 1)) * TILE_SIZE
          giantSprite.visible = true

          // Hide local object sprite if it exists
          if (obj) obj.visible = false

      } else {
          // Normal Object
          // Cleanup giant sprite if it exists (e.g. if it shrunk?)
          if (giantSprite) {
              giantSprite.visible = false
              gameScene?.removeChild(giantSprite)
          }

          if (!obj) {
              obj = new PIXI.Sprite()
              obj.name = 'object'
              obj.width = TILE_SIZE
              obj.height = TILE_SIZE
              c.addChild(obj)
          }
          obj.visible = true
          obj.texture = tm.getTexture(plot.object.type)
          obj.width = TILE_SIZE
          obj.height = TILE_SIZE

          // Working Animation
          if (plot.object.processing && !plot.object.hasOutput) {
              if (plot.object.type === 'furnace') {
                 // Glow red
                 obj.tint = 0xFFCCCC
              } else {
                 // Shake
                 obj.x = (Math.floor(frameTick.value / 5) % 2 === 0) ? 1 : -1
              }
          } else {
              obj.x = 0
              obj.tint = 0xFFFFFF
          }
      }

  } else {
      if (obj) {
          obj.visible = false
          obj.x = 0
          obj.tint = 0xFFFFFF
      }
      if (giantSprite) {
          giantSprite.visible = false
          gameScene?.removeChild(giantSprite)
      }
  }

  // Machine Output Indicator
  let indicator = c.getChildByName('indicator') as PIXI.Sprite
  if (plot.object && plot.object.hasOutput) {
      if (!indicator) {
          indicator = new PIXI.Sprite(tm.getTexture('emote_exclamation'))
          indicator.name = 'indicator'
          indicator.width = 16
          indicator.height = 16
          indicator.anchor.set(0.5)
          indicator.x = TILE_SIZE / 2
          indicator.y = -12
          c.addChild(indicator)
      }
      indicator.visible = true
      indicator.y = -12 + Math.sin(frameTick.value / 10) * 3

      // Show output item icon
      if (plot.object.processing?.output) {
          const outTex = tm.getTexture(plot.object.processing.output)
          if (outTex) indicator.texture = outTex
      }
  } else {
      if (indicator) indicator.visible = false
  }

  // Crop
  let crop = c.getChildByName('crop') as PIXI.Sprite
  if (plot.hasCrop && plot.crop) {
      if (!crop) {
          crop = new PIXI.Sprite()
          crop.name = 'crop'
          crop.width = TILE_SIZE
          crop.height = TILE_SIZE
          c.addChild(crop)
      }
      crop.visible = true
      // Use generic 'weed' texture for crop for now, tinted
      let cropTexName = 'crop_sprout'
      const cropType = plot.crop.type
      const stage = plot.crop.growthStage
      const maxStage = plot.crop.maxGrowthStage

      // Improved logic for crop stages
      const hasStage3 = tm.getTexture(`${cropType}_stage_3`) !== PIXI.Texture.WHITE
      const hasSeeds = tm.getTexture(`${cropType}_seeds`) !== PIXI.Texture.WHITE

      if (stage >= maxStage) {
          cropTexName = `${cropType}_ready`
      } else if (stage === 0 && hasSeeds) {
          cropTexName = `${cropType}_seeds`
      } else {
          const progress = stage / maxStage

          if (hasStage3) {
             // 3 Stages
             if (progress < 0.33) cropTexName = `${cropType}_stage_1`
             else if (progress < 0.66) cropTexName = `${cropType}_stage_2`
             else cropTexName = `${cropType}_stage_3`
          } else {
             // 2 Stages (e.g. parsnip)
             if (progress < 0.5) cropTexName = `${cropType}_stage_1`
             else cropTexName = `${cropType}_stage_2`
          }
      }

      let tex = tm.getTexture(cropTexName)

      // Fallback if specific missing
      if (tex === PIXI.Texture.WHITE && !cropTexName.startsWith('crop_')) {
           if (stage >= maxStage) tex = tm.getTexture('crop_ready')
           else if (stage > maxStage / 2) tex = tm.getTexture('crop_growing')
           else tex = tm.getTexture('crop_sprout')
      }
      crop.texture = tex
      crop.tint = 0xFFFFFF

      // Scale based on growth?
      // PIXI Sprites are better scaled by property
      // Reset scale for pixel art precision
      crop.scale.set(1)
      crop.anchor.set(0.5)
      crop.x = TILE_SIZE / 2
      crop.y = TILE_SIZE / 2

  } else {
      if (crop) crop.visible = false
  }

  // Highlight watered soil (overlay)
  let watered = c.getChildByName('watered') as PIXI.Graphics
  if (plot.isTilled && plot.isWatered) {
      if (!watered) {
          watered = new PIXI.Graphics()
          watered.name = 'watered'
          watered.beginFill(0x000000, 0.3)
          watered.drawRect(0, 0, TILE_SIZE, TILE_SIZE)
          watered.endFill()
          c.addChild(watered)
      }
      watered.visible = true
  } else {
      if (watered) watered.visible = false
  }
}

const createPlayer = () => {
  const p = new PIXI.Container() as PlayerContainer
  p.isPlayer = true

  const s = new PIXI.Sprite()
  s.name = 'sprite'
  s.width = TILE_SIZE
  s.height = TILE_SIZE

  // Initial visual update
  const player = gameStore.gameState.player
  updateCharacterSprite(p, s, 'char', player.direction, false)

  p.addChild(s)
  addShadow(p)

  p.x = (player.x || 0) * TILE_SIZE
  p.y = (player.y || 0) * TILE_SIZE
  p.zIndex = 1000

  gameScene?.addChild(p)
}

interface MonsterContainer extends PIXI.Container {
  monsterId: string
}

const renderMonsters = () => {
    if (!gameScene) return
    const monsters = gameStore.gameState.monsters

    // 1. Remove
    const childrenToRemove: MonsterContainer[] = []
    gameScene.children.forEach(child => {
        const c = child as MonsterContainer
        if (c.monsterId) {
            const exists = monsters.find(m => m.id === c.monsterId)
            if (!exists) childrenToRemove.push(c)
        }
    })
    childrenToRemove.forEach(c => gameScene!.removeChild(c))

    // 2. Add/Update
    monsters.forEach(monster => {
        let c = gameScene!.children.find(child => (child as MonsterContainer).monsterId === monster.id) as MonsterContainer

        if (!c) {
            c = new PIXI.Container() as MonsterContainer
            c.monsterId = monster.id

            const s = new PIXI.Sprite()
            s.name = 'sprite'
            s.width = TILE_SIZE
            s.height = TILE_SIZE
            // Center anchor for rotation/flip if needed, but TILE_SIZE usually 0,0 top-left in this engine?
            // Player sprite uses TILE_SIZE width/height but anchor default (0,0).

            c.addChild(s)
            addShadow(c)
            gameScene!.addChild(c)
        }

        const s = c.getChildByName('sprite') as PIXI.Sprite
        if (s) {
            // Texture
            let texName: string = monster.type
            if (monster.type === 'slime') {
                texName = 'slime_down' // Default
                // Animation frame?
                if (Math.floor(frameTick.value / 10) % 2 === 0) texName = 'slime_down_2'
            }

            const tex = TextureManager.getInstance().getTexture(texName)
            // Fallback to simple colored square if no texture
            if (tex === PIXI.Texture.WHITE) {
                s.texture = PIXI.Texture.WHITE
                s.tint = 0x00FF00 // Slime Green
            } else {
                s.texture = tex
                s.tint = 0xFFFFFF
            }

            // Damage flash
            if (monster.cooldown && monster.cooldown > 50) {
                 s.tint = 0xFF0000
            }
        }

        c.x = monster.x * TILE_SIZE
        c.y = monster.y * TILE_SIZE
        c.zIndex = c.y // Y-sort
    })
}

const handleKeyDown = (e: KeyboardEvent) => {
  keysPressed[e.code] = true

  // Interaction
  if (e.code === 'KeyE' || e.code === 'Enter') {
    gameStore.interact()
  }

  // Tool Selection Shortcuts
  if (e.code.startsWith('Digit') && e.code !== 'Digit0') {
      const idx = parseInt(e.code.replace('Digit', '')) - 1
      const tools = gameStore.gameState.inventory.slice(0, 12)
      if (idx >= 0 && idx < tools.length && tools[idx]) {
          gameStore.setSelectedTool(tools[idx].id)
      }
  } else if (e.code === 'Digit0') {
      const tools = gameStore.gameState.inventory.slice(0, 12)
      if (tools.length >= 10 && tools[9]) gameStore.setSelectedTool(tools[9].id)
  } else if (e.code === 'Minus') {
      const tools = gameStore.gameState.inventory.slice(0, 12)
      if (tools.length >= 11 && tools[10]) gameStore.setSelectedTool(tools[10].id)
  } else if (e.code === 'Equal') {
      const tools = gameStore.gameState.inventory.slice(0, 12)
      if (tools.length >= 12 && tools[11]) gameStore.setSelectedTool(tools[11].id)
  }
}

const handleKeyUp = (e: KeyboardEvent) => {
  keysPressed[e.code] = false
}

const handleMouseMove = (e: MouseEvent) => {
  if (!gameScene || !selectionGraphics || !app) return

  const rect = app.canvas.getBoundingClientRect()
  const scaleX = app.canvas.width / rect.width
  const scaleY = app.canvas.height / rect.height

  const mouseX = (e.clientX - rect.left) * scaleX
  const mouseY = (e.clientY - rect.top) * scaleY

  const worldX = (mouseX - gameScene.position.x) / gameScene.scale.x + gameScene.pivot.x
  const worldY = (mouseY - gameScene.position.y) / gameScene.scale.y + gameScene.pivot.y

  const gridX = Math.floor(worldX / TILE_SIZE)
  const gridY = Math.floor(worldY / TILE_SIZE)

  if (gridY >= 0 && gridY < gameStore.gameState.plots.length &&
      gridX >= 0 && gridX < (gameStore.gameState.plots[0]?.length || 0)) {

    selectionGraphics.visible = true
    selectionGraphics.x = gridX * TILE_SIZE
    selectionGraphics.y = gridY * TILE_SIZE
    selectedPlotCoords = { x: gridX, y: gridY }

    // Placement Mode Visualization
    if (gameStore.placementState.isPlacing) {
        const { width, height } = gameStore.placementState

        selectionGraphics.clear()

        // Draw footprint
        let valid = true
        // Check simple validity (can refine later with store logic duplication or helper)
        if (gridX + width > (gameStore.gameState.plots[0]?.length || 0) || gridY + height > gameStore.gameState.plots.length) {
            valid = false
        }

        const color = valid ? 0x00FF00 : 0xFF0000
        selectionGraphics.lineStyle(2, color, 1)
        selectionGraphics.beginFill(color, 0.3)
        selectionGraphics.drawRect(0, 0, width * TILE_SIZE, height * TILE_SIZE)
        selectionGraphics.endFill()

        selectionGraphics.x = gridX * TILE_SIZE
        selectionGraphics.y = gridY * TILE_SIZE
        selectionGraphics.visible = true
        selectedPlotCoords = { x: gridX, y: gridY }

        return // Skip normal hover
    }

    // Default Selection Style
    selectionGraphics.tint = 0xFFFFFF
    selectionGraphics.alpha = 1

    // Hover Detection
    type TargetType = { type: 'npc' | 'object' | 'animal' | 'crop', name: string, action?: string }
    let target: TargetType | null = null

    // Distance Check
    const player = gameStore.gameState.player
    // Use center of player tile (player.x + 0.5) to center of target tile (gridX + 0.5)
    const dx = (gridX + 0.5) - (player.x + 0.5)
    const dy = (gridY + 0.5) - (player.y + 0.5)
    const dist = Math.sqrt(dx * dx + dy * dy)

    let maxRange = 1.5
    if (gameStore.gameState.selectedTool === 'fishing_rod') {
        maxRange = 5.0
    }

    const inRange = dist <= maxRange

    // 1. NPC
    const hoveredNPC = gameStore.gameState.npcs.find(npc =>
        Math.round(npc.x) === gridX && Math.round(npc.y) === gridY &&
        npc.location === gameStore.gameState.location
    )
    if (hoveredNPC) {
        target = { type: 'npc', name: hoveredNPC.name, action: '交谈' }
    }

    // 2. Animal
    if (!target) {
        const hoveredAnimal = gameStore.gameState.animals.find(a =>
            Math.round(a.x) === gridX && Math.round(a.y) === gridY &&
            a.location === gameStore.gameState.location
        )
        if (hoveredAnimal) {
            target = { type: 'animal', name: hoveredAnimal.name, action: '爱抚' }
        }
    }

    // 3. Object / Crop
    if (!target) {
        const plot = gameStore.gameState.plots[gridY]?.[gridX]
        if (plot) {
            if (plot.object) {
                 const def = gameStore.ITEMS[plot.object.id] || { name: plot.object.type }
                 // Special names for common objects
                 let name = def.name
                 if (plot.object.type === 'wood') name = '木头'
                 if (plot.object.type === 'stone') name = '石头'
                 if (plot.object.type === 'weed') name = '杂草'

                 target = { type: 'object', name, action: '查看' }
            } else if (plot.hasCrop && plot.crop) {
                 const cropDef = gameStore.ITEMS[plot.crop.id]
                 const name = cropDef ? cropDef.name : '作物'
                 const stage = plot.crop.growthStage >= plot.crop.maxGrowthStage ? '(成熟)' : '(生长中)'
                 target = { type: 'crop', name: name + ' ' + stage, action: '查看' }
            }
        }
    }

    // 4. Monster
    if (!target) {
        const hoveredMonster = gameStore.gameState.monsters.find(m =>
            Math.round(m.x) === gridX && Math.round(m.y) === gridY &&
            gameStore.gameState.location === 'mine'
        )
        if (hoveredMonster) {
            target = { type: 'npc', name: hoveredMonster.name, action: '攻击' }
        }
    }

    // Update store
    // Only show interaction target if in range?
    // Stardew: You can see info but cursor changes.
    // For now, let's keep hoveredTarget but handle click check.
    gameStore.hoveredTarget = target

    if (!inRange) {
        selectionGraphics.tint = 0xFF0000 // Red
        selectionGraphics.alpha = 0.5
    } else if (target) {
        selectionGraphics.tint = 0x00FF00
        selectionGraphics.alpha = 1
    } else {
        selectionGraphics.tint = 0xFFFFFF
        selectionGraphics.alpha = 1
    }

    // Tooltip Update
    if (target && tooltipContainer && tooltipBg && tooltipText) {
       tooltipContainer.visible = true
       tooltipContainer.x = mouseX + 15
       tooltipContainer.y = mouseY + 15

       // Ensure tooltip stays within bounds
       if (tooltipContainer.x + tooltipContainer.width > app.screen.width) {
         tooltipContainer.x = mouseX - tooltipContainer.width - 5
       }
       if (tooltipContainer.y + tooltipContainer.height > app.screen.height) {
         tooltipContainer.y = mouseY - tooltipContainer.height - 5
       }

       const text = `${target.name}\n${target.action}`
       if (tooltipText.text !== text) {
           tooltipText.text = text

           // Update BG
           tooltipBg.clear()
           tooltipBg.beginFill(0x000000, 0.7)
           tooltipBg.lineStyle(2, 0xFFFFFF, 1)
           tooltipBg.drawRoundedRect(0, 0, tooltipText.width + 16, tooltipText.height + 8, 4)
           tooltipBg.endFill()
       }
       // Ensure on top
       app.stage.setChildIndex(tooltipContainer, app.stage.children.length - 1)
    } else if (tooltipContainer) {
       tooltipContainer.visible = false
    }

  } else {
    selectionGraphics.visible = false
    selectedPlotCoords = null
    gameStore.hoveredTarget = null
    if (tooltipContainer) tooltipContainer.visible = false
  }
}

const handleMouseDown = () => {
  if (gameStore.placementState.isPlacing && selectedPlotCoords) {
      if (gameStore.confirmPlacement(selectedPlotCoords.x, selectedPlotCoords.y)) {
          // Re-render world to show new building
          initializeGameWorld()
      }
  } else {
      if (selectedPlotCoords) {
        // Range Check
        const player = gameStore.gameState.player
        const dx = (selectedPlotCoords.x + 0.5) - (player.x + 0.5)
        const dy = (selectedPlotCoords.y + 0.5) - (player.y + 0.5)
        const dist = Math.sqrt(dx * dx + dy * dy)

        let maxRange = 1.5
        if (gameStore.gameState.selectedTool === 'fishing_rod') {
            maxRange = 5.0
        }

        if (dist > maxRange) {
            return
        }

        // Visual Feedback
        spawnParticles(
            selectedPlotCoords.x * TILE_SIZE + TILE_SIZE/2,
            selectedPlotCoords.y * TILE_SIZE + TILE_SIZE/2,
            'cursor',
            0xFFFFFF,
            8
        )

        gameStore.handlePlotInteraction(selectedPlotCoords.x, selectedPlotCoords.y)

        const row = plotContainers[selectedPlotCoords.y]
        if (row) {
          const plotContainer = row[selectedPlotCoords.x]
          const plotData = gameStore.gameState.plots[selectedPlotCoords.y]?.[selectedPlotCoords.x]
          if (plotContainer && plotData) {
            renderPlot(plotContainer, plotData)
          }
        }
      }
  }
}

const renderDroppedItems = () => {
  if (!gameScene) return

  const droppedItems = gameStore.gameState.droppedItems

  // 1. Remove sprites for items that no longer exist
  const childrenToRemove: DroppedItemContainer[] = []
  gameScene.children.forEach(child => {
    const c = child as DroppedItemContainer
    if (c.droppedId) {
       const exists = droppedItems.find(i => i.id === c.droppedId)
       if (!exists) {
         childrenToRemove.push(c)
       }
    }
  })
  childrenToRemove.forEach(c => gameScene!.removeChild(c))

  // 2. Add/Update items
  droppedItems.forEach(item => {
    let c = gameScene!.children.find(child => (child as DroppedItemContainer).droppedId === item.id) as DroppedItemContainer

    if (!c) {
      c = new PIXI.Container() as DroppedItemContainer
      c.droppedId = item.id
      c.itemId = item.itemId

      const tm = TextureManager.getInstance()
      // Use generic texture if specific not found
      // Note: We assume TextureManager handles missing textures gracefully or we have 'unknown'
      const texture = tm.getTexture(item.itemId)

      // Special case for seeds/crops if texture missing?

      const s = new PIXI.Sprite(texture)
      s.width = TILE_SIZE * 0.6
      s.height = TILE_SIZE * 0.6
      s.anchor.set(0.5)
      c.addChild(s)

      gameScene!.addChild(c)
    }

    // Update position
    c.x = item.x * TILE_SIZE
    // Floating effect
    const bob = Math.sin(Date.now() / 200) * 5
    c.y = item.y * TILE_SIZE + bob

    c.zIndex = Math.floor(c.y)
  })
}

// --- Particles ---
interface Particle {
  sprite: PIXI.Sprite
  vx: number
  vy: number
  life: number
  gravity: number
  lifeDecay: number
}
const particles: Particle[] = []

const spawnParticles = (x: number, y: number, type: string, color: number, count: number = 5) => {
  if (!gameScene) return
  for (let i = 0; i < count; i++) {
    const s = new PIXI.Sprite(PIXI.Texture.WHITE)
    s.width = 4
    s.height = 4

    let gravity = 0.2
    let lifeDecay = 0.05
    let speed = Math.random() * 2 + 1
    let vyOffset = 0

    if (type === 'leaf') {
        s.width = 6
        s.height = 4
        gravity = 0.05
        lifeDecay = 0.02
        speed = Math.random() * 1 + 0.5
    } else if (type === 'wood') {
        s.width = 6
        s.height = 3
        gravity = 0.3
        vyOffset = -3
    } else if (type === 'stone') {
        s.width = 4
        s.height = 4
        gravity = 0.3
        vyOffset = -3
    } else if (type === 'water') {
        s.width = 3
        s.height = 3
        gravity = 0.3
        vyOffset = -2
    }

    s.tint = color
    s.x = x
    s.y = y
    s.anchor.set(0.5)
    s.zIndex = 20000 // Top
    gameScene.addChild(s)

    const angle = Math.random() * Math.PI * 2

    particles.push({
      sprite: s,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + vyOffset,
      life: 1.0,
      gravity,
      lifeDecay
    })
  }
}

const updateParticles = () => {
   for (let i = particles.length - 1; i >= 0; i--) {
     const p = particles[i]
     if (!p) continue

     p.vy += p.gravity
     p.vx *= 0.95 // Friction

     p.sprite.x += p.vx
     p.sprite.y += p.vy
     p.sprite.rotation += p.vx * 0.2

     p.life -= p.lifeDecay
     p.sprite.alpha = p.life

     // Ground collision (approximate)
     // if (p.sprite.y > ... ) // Hard to know ground level here without context, assume purely visual decay

     if (p.life <= 0) {
       gameScene?.removeChild(p.sprite)
       particles.splice(i, 1)
     }
   }
}

// --- Floating Text ---
interface FloatingText {
  text: PIXI.Text
  vx: number
  vy: number
  life: number
}
const floatingTexts: FloatingText[] = []

const spawnFloatingText = (x: number, y: number, content: string, color: number) => {
    if (!gameScene) return

    const t = new PIXI.Text(content, {
        fontFamily: 'VT323, monospace',
        fontSize: 16,
        fill: color,
        stroke: 0x000000,
        strokeThickness: 2,
        dropShadow: true,
        dropShadowColor: 0x000000,
        dropShadowBlur: 2,
        dropShadowAngle: Math.PI / 4,
        dropShadowDistance: 2,
    } as unknown as PIXI.TextStyle)
    t.anchor.set(0.5)
    t.x = x
    t.y = y - 16
    t.zIndex = 40000 // Very top
    gameScene.addChild(t)

    floatingTexts.push({
        text: t,
        vx: 0,
        vy: -0.5, // Float up
        life: 1.0
    })
}

const updateFloatingTexts = () => {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i]
        if (!ft) continue

        ft.text.y += ft.vy
        ft.life -= 0.01
        ft.text.alpha = ft.life

        if (ft.life <= 0) {
            gameScene?.removeChild(ft.text)
            floatingTexts.splice(i, 1)
        }
    }
}

// Watch for visual effects (floating text)
watch(() => gameStore.gameState.visualEffects, (effects) => {
    if (effects.length > 0) {
        effects.forEach(e => {
            if (e.type === 'text' && e.text) {
                spawnFloatingText(
                    e.x * TILE_SIZE + TILE_SIZE/2,
                    e.y * TILE_SIZE, // Top of tile
                    e.text,
                    e.color || 0xFFFFFF
                )
            }
        })
        gameStore.gameState.visualEffects.length = 0
    }
}, { deep: true })

// Watch for particle events
watch(() => gameStore.gameState.particleEvents, (events) => {
    if (events.length > 0) {
        events.forEach(e => {
            spawnParticles(
                e.x * TILE_SIZE + TILE_SIZE/2,
                e.y * TILE_SIZE + TILE_SIZE/2,
                e.type,
                e.color || 0xFFFFFF,
                e.count || 5
            )
        })
        // Clear events
        gameStore.gameState.particleEvents.length = 0
    }
}, { deep: true })


const lightTexture = computed(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return PIXI.Texture.WHITE

    const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    grd.addColorStop(0, 'rgba(255, 200, 100, 0.6)') // Warm light center
    grd.addColorStop(0.5, 'rgba(255, 200, 100, 0.2)')
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 256, 256)

    return PIXI.Texture.from(canvas)
})

const updateLighting = () => {
    if (!darknessGraphics || !lightingContainer || !app) return

    const time = gameStore.gameState.gameTime
    const location = gameStore.gameState.location
    const isIndoors = !['farm', 'town', 'forest', 'mountain', 'beach'].includes(location)
    const isMine = location.startsWith('mine')

    let targetAlpha = 0
    let targetTint = 0x000033

    if (isMine) {
        targetAlpha = 0.5 + (gameStore.gameState.mineLevel * 0.005)
        if (targetAlpha > 0.95) targetAlpha = 0.95
        targetTint = 0x000000
    } else if (isIndoors) {
        targetAlpha = 0.1 // Slight ambiance
    } else {
        // Outdoors
        if (time >= 6 && time < 8) { // Sunrise
            const p = (time - 6) / 2
            targetTint = 0xFFD700
            targetAlpha = 0.3 * (1 - p)
        } else if (time >= 8 && time < 17) { // Day
            targetAlpha = 0
        } else if (time >= 17 && time < 20) { // Sunset
            const p = (time - 17) / 3
            targetTint = 0xFF4500
            targetAlpha = 0.4 * p
        } else if (time >= 20) { // Night
            const p = Math.min(1, (time - 20) / 2)
            targetAlpha = 0.4 + (p * 0.4) // Max 0.8
        } else { // Late night
             targetAlpha = 0.8
        }
    }

    // Apply Darkness
    darknessGraphics.alpha = targetAlpha
    darknessGraphics.tint = targetTint
    darknessGraphics.width = 10000 // Ensure coverage
    darknessGraphics.height = 10000
    // Keep darkness static relative to screen?
    // Actually if it's huge and at 0,0 of stage (which is not moved), it works.
    // But stage moves? No, gameScene moves. app.stage doesn't move.
    // Darkness is added to app.stage. So it stays fixed to screen.

    // Lights
    lightingContainer.removeChildren()
    if (targetAlpha > 0.2) {
        // Add lights for player
        const player = gameStore.gameState.player

        const addLight = (wx: number, wy: number, scale: number = 1) => {
             const sX = (wx * TILE_SIZE + TILE_SIZE/2) * gameScene!.scale.x + gameScene!.position.x - (gameScene!.pivot.x * gameScene!.scale.x)
             const sY = (wy * TILE_SIZE + TILE_SIZE/2) * gameScene!.scale.y + gameScene!.position.y - (gameScene!.pivot.y * gameScene!.scale.y)

             // Culling
             if (sX < -200 || sX > app!.screen.width + 200 || sY < -200 || sY > app!.screen.height + 200) return

             const light = new PIXI.Sprite(lightTexture.value)
             light.anchor.set(0.5)
             light.x = sX
             light.y = sY
             light.scale.set(scale)
             light.blendMode = 'add'
             lightingContainer!.addChild(light)
        }

        // Player Light
        addLight(player.x, player.y, 1.5)

        // Other lights (lamps, windows)
        // Iterate visible buildings/objects
        // This is expensive to do every frame if many objects.
        // Optimization: Cache light sources or iterate only on-screen plots.

        // For now, iterate dynamic buildings
        const currentBuildings = gameStore.gameState.buildings[gameStore.gameState.location] || []

        if (currentBuildings) {
            currentBuildings.forEach(b => {
                 // Windows
                 if (b.width >= 3) {
                      addLight(b.x + 1, b.y + 2, 0.8) // Window 1 approx
                      addLight(b.x + b.width - 2, b.y + 2, 0.8) // Window 2
                 }
            })
        }

        // Street Lamps, Torches, and Glowing Crops
        const glowingCrops = ['starfruit', 'ancient_fruit', 'fairy_rose', 'gem_berry']

        // Optimize: Iterate visible plots only if possible, but for now iterate all plots
        // (Since map size is fixed and relatively small 50x50 or so)
        gameStore.gameState.plots.forEach(row => {
            row.forEach(plot => {
                 if (plot.object) {
                     if (plot.object.type === 'lamp') {
                          addLight(plot.x, plot.y, 1.0)
                     } else if (plot.object.type === 'torch' || plot.object.type === 'campfire') {
                          // Torches flicker slightly
                          const flicker = 0.9 + Math.random() * 0.2
                          addLight(plot.x, plot.y, 0.8 * flicker)
                     } else if (plot.object.processing) {
                          // Processing machines emit faint light
                          addLight(plot.x, plot.y, 0.5)
                     }
                 }

                 if (plot.hasCrop && plot.crop) {
                     // Check for glowing crops
                     if (glowingCrops.includes(plot.crop.type) && plot.crop.growthStage >= plot.crop.maxGrowthStage) {
                         // Magical glow
                         addLight(plot.x, plot.y, 0.7)
                     }
                 }
            })
        })
    }
}

const updateWeather = () => {
   if (!weatherContainer || !app) return

   const weather = gameStore.gameState.weather as string
   const season = gameStore.gameState.currentSeason
   const width = app.screen.width
   const height = app.screen.height

   // Seasonal ambient particles (Sunny/Cloudy/Windy)
   if ((weather === 'sunny' || weather === 'cloudy' || weather === 'windy')) {
       if (season === 'spring') {
           // Petals
           if (weatherParticles.length < 50 && Math.random() < 0.05) {
               const g = new PIXI.Graphics()
               g.beginFill(0xFFC0CB) // Pink
               g.drawCircle(0, 0, 2)
               g.endFill()
               g.x = Math.random() * width + 100 // Spawn off screen right/top
               g.y = -10
               g.alpha = 0.8
               weatherContainer.addChild(g)
               weatherParticles.push({
                   sprite: g,
                   vx: -1 + Math.random() * -2, // Blow left
                   vy: 1 + Math.random(),
                   life: 1,
                   type: 'petal'
               })
           }
       } else if (season === 'autumn') {
           // Falling Leaves
           if (weatherParticles.length < 50 && Math.random() < 0.05) {
               const colors = [0xD35400, 0xE67E22, 0xF1C40F, 0x8E44AD]
               const color = colors[Math.floor(Math.random() * colors.length)] || 0xD35400
               const g = new PIXI.Graphics()
               g.beginFill(color)
               g.drawEllipse(0, 0, 4, 2)
               g.endFill()
               g.rotation = Math.random() * Math.PI
               g.x = Math.random() * width + 100
               g.y = -10
               g.alpha = 0.9
               weatherContainer.addChild(g)
               weatherParticles.push({
                   sprite: g,
                   vx: -2 + Math.random() * -2, // Stronger wind
                   vy: 1.5 + Math.random(),
                   life: 1,
                   type: 'leaf_ambient'
               })
           }
       }
   }

   // Spawn Particles
   if (weather === 'rainy' || weather === 'storm') {
       // Rain
       if (weatherParticles.length < 500) { // Limit count
           const spawnCount = 5
           for(let i=0; i<spawnCount; i++) {
               const g = new PIXI.Graphics()
               g.beginFill(0x8888FF)
               g.drawRect(0,0, 2, 10)
               g.endFill()
               g.x = Math.random() * width + Math.random() * 400 - 200 // Spread wide for wind
               g.y = -20
               g.alpha = 0.6
               weatherContainer.addChild(g)
               weatherParticles.push({
                   sprite: g,
                   vx: -2 + Math.random(), // Slight wind left
                   vy: 10 + Math.random() * 5, // Fast fall
                   life: 1,
                   type: 'rain'
               })
           }
       }
   } else if (weather === 'snow') {
       // Snow
       if (weatherParticles.length < 300) {
           const spawnCount = 2
           for(let i=0; i<spawnCount; i++) {
               const g = new PIXI.Graphics()
               g.beginFill(0xFFFFFF)
               g.drawCircle(0,0, 3)
               g.endFill()
               g.x = Math.random() * width
               g.y = -10
               g.alpha = 0.8
               weatherContainer.addChild(g)
               weatherParticles.push({
                   sprite: g,
                   vx: Math.random() * 2 - 1, // Drift
                   vy: 2 + Math.random() * 2, // Slow fall
                   life: 1,
                   type: 'snow'
               })
           }
       }
   } else if (weather === 'cloudy') {
       // Cloud Shadows
       if (cloudTimer > 0) {
           cloudTimer--
       } else {
           cloudTimer = 300 // Spawn every ~5 seconds

           const g = new PIXI.Graphics()
           g.beginFill(0x000000)
           // Draw a blob (multiple ellipses)
           g.drawEllipse(0, 0, 120, 60)
           g.drawEllipse(60, 20, 100, 50)
           g.drawEllipse(-60, 20, 100, 50)
           g.endFill()

           g.x = -250
           g.y = Math.random() * height
           g.alpha = 0.15 // Faint shadow
           // Random scale
           const scale = 0.5 + Math.random() * 1.5
           g.scale.set(scale)

           weatherContainer.addChild(g)
           weatherParticles.push({
               sprite: g,
               vx: 0.5 + Math.random() * 0.5, // Slow wind right
               vy: 0,
               life: 1,
               type: 'cloud'
           })
       }
   }

   // Lightning (Storm only)
   if (weather === 'storm') {
       if (lightningTimer > 0) {
           lightningTimer--
           // Flash effect
           const flash = app.stage.getChildByName('flash') as PIXI.Graphics
           if (flash) {
               flash.alpha = lightningTimer / 10 // Fade out
           }
       } else if (Math.random() < 0.005) { // 0.5% chance per frame
           lightningTimer = 20 // 20 frames flash
       }
   }

   // Update Existing Particles
    for (let i = weatherParticles.length - 1; i >= 0; i--) {
        const p = weatherParticles[i]
        if (!p) continue

        p.sprite.x += p.vx
        p.sprite.y += p.vy

        if (p.type === 'snow') {
            p.sprite.x += Math.sin(frameTick.value / 20) * 0.5 // Wave drift
        }

        // Remove if out of bounds
        // Clouds need wider bounds
        const boundBuffer = p.type === 'cloud' ? 400 : 200

        if (p.sprite.y > height + boundBuffer || p.sprite.x < -boundBuffer || p.sprite.x > width + boundBuffer) {
            weatherContainer.removeChild(p.sprite)
            weatherParticles.splice(i, 1)
        }
    }

   // Clean up if weather changes
   if (weather === 'sunny') {
       if (weatherParticles.length > 0) {
            weatherParticles.forEach(p => weatherContainer?.removeChild(p.sprite))
            weatherParticles.length = 0
       }
   } else if (weather === 'cloudy') {
        // Remove rain/snow immediately
        for (let i = weatherParticles.length - 1; i >= 0; i--) {
            const p = weatherParticles[i]
            if (!p) continue
            if (p.type !== 'cloud') {
                weatherContainer.removeChild(p.sprite)
                weatherParticles.splice(i, 1)
            }
        }
    } else {
        // Remove clouds immediately if raining/snowing?
        // Let's keep them mixed or remove them.
        // Usually rain comes from clouds, but these are shadows.
        // Let's remove cloud shadows during rain/storm/snow to avoid clutter
        for (let i = weatherParticles.length - 1; i >= 0; i--) {
            const p = weatherParticles[i]
            if (!p) continue
            if (p.type === 'cloud') {
                weatherContainer.removeChild(p.sprite)
                weatherParticles.splice(i, 1)
            }
        }
    }
}

const gameLoop = () => {
  if (!gameScene || !app) return

  frameTick.value++

  updateParticles()
  updateWeather()
  updateLighting()
  updateFloatingTexts()

  renderDroppedItems()
  renderMonsters()

  const player = gameScene.children.find(c => (c as PlayerContainer).isPlayer) as PlayerContainer
  if (!player) return

  // Update Player Visuals
  const playerSprite = player.getChildByName('sprite') as PIXI.Sprite
  if (playerSprite) {
      updateCharacterSprite(
          player,
          playerSprite,
          'char',
          gameStore.gameState.player.direction,
          gameStore.gameState.player.isMoving,
          gameStore.gameState.player.isUsingTool
      )
  }

  let dx = 0
  let dy = 0

  if (keysPressed['KeyW'] || keysPressed['ArrowUp']) dy -= 1
  if (keysPressed['KeyS'] || keysPressed['ArrowDown']) dy += 1
  if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) dx -= 1
  if (keysPressed['KeyD'] || keysPressed['ArrowRight']) dx += 1

  if (dx !== 0 || dy !== 0) {
    const len = Math.sqrt(dx*dx + dy*dy)
    dx = (dx / len) * speed.value
    dy = (dy / len) * speed.value

    const currGridY = Math.floor((player.y + TILE_SIZE/2) / TILE_SIZE)

    let nextX = player.x
    let nextY = player.y

    if (dx !== 0) {
      const tryX = player.x + dx
      const gridX = Math.floor((tryX + TILE_SIZE/2) / TILE_SIZE)
      if (isWalkable(gridX, currGridY)) nextX = tryX
    }

    if (dy !== 0) {
      const tryY = player.y + dy
      const gridXAfterX = Math.floor((nextX + TILE_SIZE/2) / TILE_SIZE)
      const gridY = Math.floor((tryY + TILE_SIZE/2) / TILE_SIZE)
      if (isWalkable(gridXAfterX, gridY)) nextY = tryY
    }

    player.x = nextX
    player.y = nextY

    const gridX = Math.floor((player.x + TILE_SIZE/2) / TILE_SIZE)
    const gridY = Math.floor((player.y + TILE_SIZE/2) / TILE_SIZE)

    gameStore.updatePlayerPosition(
      gridX,
      gridY,
      dy > 0 ? 'down' : dy < 0 ? 'up' : dx > 0 ? 'right' : 'left',
      true
    )
  } else {
    gameStore.gameState.player.isMoving = false
  }

  // Smooth Camera Follow
  const targetX = player.x
  const targetY = player.y

  // Smoothness (0.1 is very smooth, 1.0 is instant)
  const lerp = 0.1

  // Current Pivot
  const currentX = gameScene.pivot.x
  const currentY = gameScene.pivot.y

  let newX = currentX + (targetX - currentX) * lerp
  let newY = currentY + (targetY - currentY) * lerp

  // Clamp to Map Bounds
  const mapConfig = MAPS[gameStore.gameState.location]
  if (mapConfig) {
      const halfScreenW = app.screen.width / 2 / gameScene.scale.x
      const halfScreenH = app.screen.height / 2 / gameScene.scale.y
      const mapW = mapConfig.width * TILE_SIZE
      const mapH = mapConfig.height * TILE_SIZE

      // Only clamp if map is larger than screen
      if (mapW > halfScreenW * 2) {
          newX = Math.max(halfScreenW, Math.min(newX, mapW - halfScreenW))
      } else {
          newX = mapW / 2 // Center if smaller
      }

      if (mapH > halfScreenH * 2) {
          newY = Math.max(halfScreenH, Math.min(newY, mapH - halfScreenH))
      } else {
          newY = mapH / 2
      }
  }

  gameScene.pivot.x = newX
  gameScene.pivot.y = newY
  gameScene.position.x = app.screen.width / 2
  gameScene.position.y = app.screen.height / 2

  // Sync NPC positions with store (for schedules/movement)
  gameScene.children.forEach(child => {
    const npcC = child as NPCContainer
    if ('npcId' in npcC) {
      const npc = gameStore.gameState.npcs.find(n => n.id === npcC.npcId && n.location === gameStore.gameState.location)
      if (npc) {
        npcC.visible = true
        // Update visuals and position
        renderNPC(npcC, npc)
      } else {
        // If NPC moved to another map, hide it
        npcC.visible = false
      }
    } else if ('animalId' in child) {
      const animalC = child as AnimalContainer
      const animal = gameStore.gameState.animals.find(a => a.id === animalC.animalId && a.location === gameStore.gameState.location)
      if (animal) {
          animalC.visible = true
          renderAnimal(animalC, animal)
      } else {
          animalC.visible = false
      }
    }
  })

  // Sort Z Index (y-sort)
  gameScene.children.sort((a, b) => {
    if (a === selectionGraphics) return 1
    if (b === selectionGraphics) return 1
    return a.y - b.y
  })

  updateCulling()

  // Update Darkness
  if (app) {
      const darkness = app.stage.getChildByName('darkness') as PIXI.Graphics
      if (darkness) {
          // Time: 6:00 (6.0) to 2:00 (26.0)
          // Sunset starts at 18:00 (18.0) -> alpha 0 to 0.5 at 20:00 -> 0.7 at 24:00
          const time = gameStore.gameState.gameTime
          let alpha = 0
          if (time >= 18) {
              // 18.0 -> 0
              // 20.0 -> 0.4
              // 24.0 -> 0.6
              alpha = Math.min(0.7, (time - 18) * 0.1)
          } else if (time < 6) {
              // Early morning (should ideally stay dark until 6)
              // But game starts at 6.
              // If we allow staying up past 24:00, time goes to 26.0
              // 26.0 (2AM) -> 0.8
              alpha = Math.min(0.8, (time - 18) * 0.1)
          }

          // Mine is always dark-ish?
          if (gameStore.gameState.location === 'mine') {
              alpha = Math.max(alpha, 0.6)
          }

          darkness.alpha = alpha
          // Ensure it covers screen
          darkness.width = app.screen.width
          darkness.height = app.screen.height
      }
  }
}

const updateCulling = () => {
  if (!gameScene || !app) return

  // Viewport bounds in world coordinates
  // pivot is the center of the screen in world coords
  const halfWidth = (app.screen.width / 2) / gameScene.scale.x
  const halfHeight = (app.screen.height / 2) / gameScene.scale.y

  const minX = gameScene.pivot.x - halfWidth - TILE_SIZE * 2
  const maxX = gameScene.pivot.x + halfWidth + TILE_SIZE * 2
  const minY = gameScene.pivot.y - halfHeight - TILE_SIZE * 2
  const maxY = gameScene.pivot.y + halfHeight + TILE_SIZE * 2

  // Cull Plots
  plotContainers.forEach(row => {
    row.forEach(c => {
       if (c.x >= minX && c.x <= maxX && c.y >= minY && c.y <= maxY) {
         c.visible = true
         // Only animate visible plots
         // We could add logic here to stop animations for off-screen plots
       } else {
         c.visible = false
       }
    })
  })
}

const handleResize = () => {
  if (!app || !gameContainer.value) return
  app.renderer.resize(gameContainer.value.clientWidth, gameContainer.value.clientHeight)
}

const handleWheel = (e: WheelEvent) => {
    if (!gameScene) return
    // Prevent default scroll
    e.preventDefault()

    const zoomSpeed = 0.1
    const currentScale = gameScene.scale.x
    let newScale = currentScale - (e.deltaY > 0 ? zoomSpeed : -zoomSpeed)

    // Clamp zoom
    newScale = Math.max(0.5, Math.min(newScale, 4.0))

    // Zoom towards mouse pointer would be better, but center zoom is easier for now
    gameScene.scale.set(newScale)
}

onMounted(() => {
  initPixi()
  window.addEventListener('resize', handleResize)
  if (gameContainer.value) {
      gameContainer.value.addEventListener('wheel', handleWheel)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('resize', handleResize)
  if (gameContainer.value) {
      gameContainer.value.removeEventListener('wheel', handleWheel)
  }
  if (app && app.canvas) {
    app.canvas.removeEventListener('mousemove', handleMouseMove)
    app.canvas.removeEventListener('mousedown', handleMouseDown)
  }
  if (app) {
    app.destroy(true, { children: true })
  }
})
</script>

<style scoped>
.game-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
