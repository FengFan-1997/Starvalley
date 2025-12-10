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

const gameContainer = ref<HTMLDivElement>()
const gameStore = useGameStore()

let app: PIXI.Application | null = null
let gameScene: PIXI.Container | null = null
let selectionGraphics: PIXI.Graphics | null = null
let tooltipContainer: PIXI.Container | null = null
let tooltipBg: PIXI.Graphics | null = null
let tooltipText: PIXI.Text | null = null

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

  // Day/Night Overlay
  const overlay = new PIXI.Graphics()
  overlay.beginFill(0xFFFFFF) // White base for tinting
  overlay.drawRect(0, 0, app.screen.width, app.screen.height)
  overlay.endFill()
  overlay.alpha = 0
  overlay.tint = 0x000000
  overlay.zIndex = 10000
  app.stage.addChild(overlay)

  // Tooltip
  tooltipContainer = new PIXI.Container()
  tooltipContainer.zIndex = 20000
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
  watch(() => gameStore.gameState.gameTime, (time) => {
    // Dawn: 6-8 (Orange/Pink -> Clear)
    if (time >= 6 && time < 8) {
       overlay.tint = 0xFFD700 // Gold/Orange
       overlay.alpha = 0.3 * (1 - (time - 6) / 2)
    }
    // Day: 8-17 (Clear)
    else if (time >= 8 && time < 17) {
       overlay.alpha = 0
    }
    // Dusk: 17-20 (Clear -> Orange/Purple)
    else if (time >= 17 && time < 20) {
       overlay.tint = 0xFF4500 // OrangeRed
       overlay.alpha = 0.3 * ((time - 17) / 3)
    }
    // Night: 20-24 (Dark Blue)
    else if (time >= 20) {
       overlay.tint = 0x000033 // Dark Blue
       // Gradual darkening
       const nightProgress = Math.min(1, (time - 20) / 2)
       overlay.alpha = 0.3 + (nightProgress * 0.4) // 0.3 -> 0.7
    }
    // Late Night / Early Morning: 0-6
    else {
       overlay.tint = 0x000033
       overlay.alpha = 0.7
    }
  }, { immediate: true })

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

  // Get current map config
  const mapConfig = MAPS[gameStore.gameState.location]

  // Render Buildings
  if (mapConfig && mapConfig.buildings) {
    mapConfig.buildings.forEach(building => {
      const c = new PIXI.Container() as BuildingContainer
      c.buildingId = building.id
      c.x = building.x * TILE_SIZE
      c.y = building.y * TILE_SIZE
      renderBuilding(c, building)
      gameScene!.addChild(c)
    })
  }

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
   updateCharacterSprite(c, s, 'char', npc.direction || 'down', npc.isMoving || false)

   s.tint = npc.spriteColor || 0xFFFFFF

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
            // Random variations based on position
            const seed = (plot.x * 37 + plot.y * 13) % 100
            if (seed < 5) ground.texture = tm.getTexture('flower_red')
            else if (seed < 10) ground.texture = tm.getTexture('flower_yellow')
            else ground.texture = tm.getTexture('grass');
            break;
      }
  }

  // Object (Stone, Wood, Weed)
  let obj = c.getChildByName('object') as PIXI.Sprite
  if (plot.object) {
      if (!obj) {
          obj = new PIXI.Sprite()
          obj.name = 'object'
          obj.width = TILE_SIZE
          obj.height = TILE_SIZE
          c.addChild(obj)
      }
      obj.visible = true
      obj.texture = tm.getTexture(plot.object.type)

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

  } else {
      if (obj) {
          obj.visible = false
          obj.x = 0
          obj.tint = 0xFFFFFF
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
      const cropId = plot.crop.id
      const stage = plot.crop.growthStage
      const maxStage = plot.crop.maxGrowthStage

      // Try specific textures
      if (cropId === 'parsnip') {
          if (stage >= maxStage) cropTexName = 'parsnip_ready'
          else if (stage >= maxStage / 2) cropTexName = 'parsnip_stage_2'
          else cropTexName = 'parsnip_stage_1'
      } else if (cropId === 'potato') {
          if (stage >= maxStage) cropTexName = 'potato_ready'
          else if (stage >= maxStage / 2) cropTexName = 'potato_stage_2'
          else cropTexName = 'potato_stage_1'
      } else {
          // Generic fallback
          if (stage >= maxStage) cropTexName = 'crop_ready'
          else if (stage > maxStage / 2) cropTexName = 'crop_growing'
          else cropTexName = 'crop_sprout'
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
      if (idx >= 0 && idx < tools.length) {
          gameStore.setSelectedTool(tools[idx].id)
      }
  } else if (e.code === 'Digit0') {
      const tools = gameStore.gameState.inventory.slice(0, 12)
      if (tools.length >= 10) gameStore.setSelectedTool(tools[9].id)
  } else if (e.code === 'Minus') {
      const tools = gameStore.gameState.inventory.slice(0, 12)
      if (tools.length >= 11) gameStore.setSelectedTool(tools[10].id)
  } else if (e.code === 'Equal') {
      const tools = gameStore.gameState.inventory.slice(0, 12)
      if (tools.length >= 12) gameStore.setSelectedTool(tools[11].id)
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

    // Default Selection Style
    selectionGraphics.tint = 0xFFFFFF
    selectionGraphics.alpha = 1

    // Hover Detection
    type TargetType = { type: 'npc' | 'object' | 'animal' | 'crop', name: string, action?: string }
    let target: TargetType | null = null

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

    // Update store
    gameStore.hoveredTarget = target

    if (target) {
        selectionGraphics.tint = 0x00FF00
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
  if (selectedPlotCoords) {
    // Visual Feedback
    spawnParticles(
        selectedPlotCoords.x * TILE_SIZE + TILE_SIZE/2,
        selectedPlotCoords.y * TILE_SIZE + TILE_SIZE/2,
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
}
const particles: Particle[] = []

const spawnParticles = (x: number, y: number, color: number, count: number = 5) => {
  if (!gameScene) return
  for (let i = 0; i < count; i++) {
    const s = new PIXI.Sprite(PIXI.Texture.WHITE)
    s.width = 4
    s.height = 4
    s.tint = color
    s.x = x
    s.y = y
    s.zIndex = 20000 // Top
    gameScene.addChild(s)

    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 2 + 1
    particles.push({
      sprite: s,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0
    })
  }
}

const updateParticles = () => {
   for (let i = particles.length - 1; i >= 0; i--) {
     const p = particles[i]
     p.sprite.x += p.vx
     p.sprite.y += p.vy
     p.life -= 0.05
     p.sprite.alpha = p.life

     if (p.life <= 0) {
       gameScene?.removeChild(p.sprite)
       particles.splice(i, 1)
     }
   }
}

const gameLoop = () => {
  if (!gameScene || !app) return

  frameTick.value++

  updateParticles()

  renderDroppedItems()

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
