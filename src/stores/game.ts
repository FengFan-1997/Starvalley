import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ITEMS } from '@/data/items'
import { CROPS } from '@/data/crops'
import { CRAFTING_RECIPES } from '@/data/recipes'
import { MAPS, type Building } from '@/data/maps'
import { NPCS, type NPC } from '@/data/npcs'
import { QUESTS } from '@/data/quests'
import { EVENTS, type GameEvent } from '@/data/events'
import { FURNITURE } from '@/data/furniture'
import { SoundManager } from '@/utils/SoundManager'
import { findPath } from '@/utils/Pathfinding'

export interface Animal {
    id: string
    type: 'chicken' | 'cow' | 'sheep' | 'pig' | 'duck'
    name: string
    age: number // Days
    friendship: number // 0-1000
    mood: number // 0-255
    homeBuildingId: string
    location: string // 'farm' or inside building
    x: number
    y: number
    direction: 'left' | 'right'
    fed: boolean
    produceReady?: boolean
    color: number
    hasPet: boolean
}

// Re-export for components using them
export { ITEMS, type ItemDefinition } from '@/data/items'
export { type NPC } from '@/data/npcs'

export interface Player {
  name: string
  farmName: string
  favoriteThing: string
  gold: number
  energy: number
  maxEnergy: number
  health: number
  maxHealth: number
  level: number
  experience: number
  defense: number
  immunity: number
  x: number
  y: number
  direction: 'up' | 'down' | 'left' | 'right'
  isMoving: boolean
  isUsingTool?: boolean
  toolAnimationTimer?: number
  toolProficiency: {
    hoe: number
    pickaxe: number
    axe: number
    watering: number
    fishing: number
  }
  skills: {
    farming: number
    farmingExp: number
    mining: number
    miningExp: number
    foraging: number
    foragingExp: number
    fishing: number
    fishingExp: number
    combat: number
    combatExp: number
  }
  friendships: Record<string, number> // NPC ID -> Friendship points (0-2500)
  giftsGiven: Record<string, { count: number, lastGiftDate: number }> // NPC ID -> Gift info
}

export interface VisualEffect {
  id: number
  x: number
  y: number
  type: 'text' | 'falling_tree'
  text?: string
  color?: number
  texture?: string
  rotation?: number
  createdAt: number
}

export interface ParticleEvent {
  id: number
  x: number
  y: number
  type: 'leaf' | 'wood' | 'stone' | 'water' | 'note' | 'heart' | 'cursor'
  color?: number
  count?: number
}

export interface Quest {
  id: string
  title: string
  description: string
  type: 'delivery' | 'slay' | 'gather' | 'story' | 'help_wanted'
  targetId?: string // Item ID or Monster ID
  targetName?: string
  recipientId?: string // For delivery quests (NPC ID)
  count: number
  currentCount: number
  reward: number
  completed: boolean
  steps?: { description: string, completed: boolean, targetCount?: number, currentCount?: number }[]
}

export interface Crop {
  id: string
  type: string
  growthStage: number
  maxGrowthStage: number
  regrowAfterHarvest?: number
  plantedAt: number
  isWatered: boolean
  daysSinceLastWater: number
}

export interface FurnitureInstance {
  id: string // Refers to FURNITURE key
  definitionId: string
  x: number
  y: number
  rotation: number // 0, 90, 180, 270
}

export interface Plot {
  x: number
  y: number
  isTilled: boolean
  isWatered?: boolean
  hasCrop: boolean
  crop?: Crop
  terrain?: 'dirt' | 'grass' | 'paved' | 'water' | 'floor' | 'floor_light' | 'sand'
  object?: {
    type: string
    id: string
    hp: number
    growthStage?: number
    treeType?: string
    width?: number
    height?: number
    cropType?: string
    processing?: {
      output: string
      readyAt: number // Timestamp when ready
      input: string
    }
    hasOutput?: boolean
  }
}

export interface Tool {
  id: string
  name: string
  level: number
  efficiency: number
}

export interface InventoryItem {
  id: string
  name: string
  type: string
  quantity: number
  icon: string
  description?: string
  data?: {
    water?: number
    maxWater?: number
    quality?: number // 0: normal, 1: silver, 2: gold, 4: iridium
  }
}

export interface CraftingIngredient {
  itemId: string
  quantity: number
}

export interface CraftingRecipe {
  id: string
  name: string
  description: string
  ingredients: CraftingIngredient[]
  result: {
    itemId: string
    quantity: number
    name: string
    type: string
    icon: string
  }
  icon: string
}


export interface DroppedItem {
  id: string
  itemId: string
  quantity: number
  x: number // World X (pixels) or Grid X? Let's use Grid X but float for smooth movement
  y: number
  targetX?: number
  targetY?: number
  isBeingCollected?: boolean
  createdAt: number
}

export interface DialogueChoice {
  text: string
  action: () => void
}

export interface Monster {
  id: string
  type: 'slime' | 'bat' | 'ghost' | 'grub' | 'fly'
  name: string
  hp: number
  maxHp: number
  damage: number
  x: number
  y: number
  speed: number
  aggroRange: number
  isMoving: boolean
  direction: 'up' | 'down' | 'left' | 'right'
  targetX?: number
  targetY?: number
  cooldown?: number
}

export interface GameState {
  currentDay: number
  currentSeason: 'spring' | 'summer' | 'autumn' | 'winter'
  currentYear: number
  currentTime: string // Deprecated, use getters
  gameTime: number // Minutes from 6:00 AM (0 = 6:00 AM)
  totalPlayTime: number
  worldSeed: number
  location: string
  mineLevel: number
  mineProgress: number
  selectedTool: string
  player: Player
  plots: Plot[][]
  savedMaps: Record<string, Plot[][]>
  buildings: Record<string, Building[]>
  furniture: Record<string, FurnitureInstance[]> // Map ID -> Furniture List
  inventory: InventoryItem[]
  droppedItems: DroppedItem[]
  npcs: NPC[]
  animals: Animal[]
  monsters: Monster[]
  chestData: Record<string, InventoryItem[]>
  weather: 'sunny' | 'rainy' | 'cloudy' | 'storm' | 'snow' | 'windy'
  weatherTomorrow: 'sunny' | 'rainy' | 'cloudy' | 'storm' | 'snow' | 'windy'
  visualEffects: VisualEffect[]
  particleEvents: ParticleEvent[]
  npcScheduleIndex: Record<string, number>
  fishingState: FishingState
  events: GameEvent[]
  quests: Quest[]
  mailbox: Mail[]
  activeCutscene?: {
    eventId: string
    stepIndex: number
    timer: number
    waitingForInput: boolean
  }
}

export interface MailAttachment {
  gold?: number
  items?: { id: string; quantity: number }[]
}

export interface Mail {
  id: string
  from: string
  title: string
  body: string[]
  season: GameState['currentSeason']
  day: number
  year: number
  read: boolean
  claimed: boolean
  attachment?: MailAttachment
}

export interface FishingState {
  state: 'idle' | 'casting' | 'waiting' | 'bite' | 'reeling' | 'caught' | 'lost' | 'biting'
  fishId?: string
  treasure?: boolean
  startTime?: number
  difficulty?: number
  behavior?: 'mixed' | 'smooth' | 'sinker' | 'floater' | 'dart'
  timer?: number
  // Minigame State
  barPosition: number // 0-100
  barHeight: number
  barVelocity: number
  fishPosition: number // 0-100
  fishTargetPosition: number
  fishMoveTimer: number
  progress: number // 0-100
  isHolding: boolean
  treasurePosition: number
  treasureProgress: number
  treasureCollected: boolean
}

export const useGameStore = defineStore('game', () => {
  // Game state
  const hoveredTarget = ref<{
      type: 'npc' | 'object' | 'animal' | 'crop' | 'furniture'
      name: string
      action?: string
  } | null>(null)

  const isQuestLogOpen = ref(false)
  const isCalendarOpen = ref(false)
  const isMailboxOpen = ref(false)

  const placementState = ref({
    isPlacing: false,
    buildingId: '',
    type: '' as Building['type'],
    width: 1,
    height: 1,
    goldCost: 0,
    resourceCost: {} as Record<string, number>
  })

  const carpenterState = ref({ isOpen: false })
  const chestState = ref({ isOpen: false, chestId: '', items: [] as InventoryItem[] })

  const getInitialState = (): GameState => ({
    currentDay: 1,
    currentSeason: 'spring',
    currentYear: 1,
    currentTime: '春1日 上午6:00',
    gameTime: 0, // 0 = 6:00 AM
    totalPlayTime: 0,
    worldSeed: Date.now() % 2147483647,
    location: 'farm',
    mineLevel: 0,
    mineProgress: 0,
    selectedTool: 'hoe',
    player: {
      name: 'Player',
      farmName: 'Vue',
      favoriteThing: 'Code',
      gold: 500,
      energy: 100,
      maxEnergy: 100,
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      defense: 0,
      immunity: 0,
      x: 0,
      y: 0,
      direction: 'down',
      isMoving: false,
      isUsingTool: false,
      toolAnimationTimer: 0,
      toolProficiency: { hoe: 0, pickaxe: 0, axe: 0, watering: 0, fishing: 0 },
      skills: {
        farming: 0, farmingExp: 0,
        mining: 0, miningExp: 0,
        foraging: 0, foragingExp: 0,
        fishing: 0, fishingExp: 0,
        combat: 0, combatExp: 0
      },
      friendships: {},
      giftsGiven: {}
    },
    plots: [],
    savedMaps: {},
    buildings: {},
    furniture: {},
    inventory: [
      { id: 'hoe', name: '锄头', type: 'tool', quantity: 1, icon: '🗡️', description: '用来耕地。' },
      { id: 'watering', name: '喷壶', type: 'tool', quantity: 1, icon: '💧', description: '用来浇水。', data: { water: 40, maxWater: 40 } },
      { id: 'axe', name: '斧头', type: 'tool', quantity: 1, icon: '🪓', description: '用来砍树。' },
      { id: 'pickaxe', name: '镐子', type: 'tool', quantity: 1, icon: '⛏️', description: '用来碎石。' },
      { id: 'scythe', name: '镰刀', type: 'tool', quantity: 1, icon: '🌾', description: '用来割草。' },
      { id: 'fishing_rod', name: '鱼竿', type: 'tool', quantity: 1, icon: '🎣', description: '用来钓鱼。' },
      { id: 'parsnip_seeds', name: '防风草种子', type: 'seed', quantity: 15, icon: '🥔', description: '在春天种植。' },
      { id: 'bread', name: '面包', type: 'food', quantity: 3, icon: '🍞', description: '恢复体力的食物。' }
    ],
    droppedItems: [],
    npcs: JSON.parse(JSON.stringify(Object.values(NPCS))), // Initialize from data
    animals: [],
    monsters: [],
    chestData: {},
    weather: 'sunny',
    weatherTomorrow: 'sunny',
    visualEffects: [],
    particleEvents: [],
    npcScheduleIndex: {},
    fishingState: {
        state: 'idle',
        barPosition: 0,
        barHeight: 20,
        barVelocity: 0,
        fishPosition: 50,
        fishTargetPosition: 50,
        fishMoveTimer: 0,
        progress: 0,
        isHolding: false,
        treasurePosition: 0,
        treasureProgress: 0,
        treasureCollected: false
    },
    events: [],
    quests: [],
    mailbox: []
  })

  const gameState = ref<GameState>(getInitialState())

  // const lastTeleportTime = 0
  // const TELEPORT_COOLDOWN_MS = 500
  // const lastTeleportTile: { map: string, x: number, y: number } | null = null
  let gameLoopIntervalId: number | null = null

  // Crafting Recipes
  const craftingRecipes: CraftingRecipe[] = CRAFTING_RECIPES

  // --- Helper Methods ---

  const addVisualEffect = (x: number, y: number, text: string, color: number) => {
    gameState.value.visualEffects.push({
      id: Date.now(),
      x,
      y,
      type: 'text',
      text,
      color,
      createdAt: Date.now()
    })
  }

  const calculateStaminaCost = (toolId: string): number => {
    if (toolId === 'scythe') return 0
    const p = gameState.value.player.toolProficiency as Record<string, number>
    const prof = Math.max(0, Math.min(10, p[toolId] ?? 0))
    const base = 2
    const cost = base - prof * 0.1
    return Math.max(1, cost)
  }

  const getPlotAt = (x: number, y: number): Plot | null => {
    const row = gameState.value.plots[y]
    if (!row) return null
    const plot = row[x]
    return plot ?? null
  }

  const spendEnergy = (toolId: string): boolean => {
    const cost = calculateStaminaCost(toolId)
    if (gameState.value.player.energy < cost) return false
    gameState.value.player.energy -= cost
    const p = gameState.value.player.toolProficiency as Record<string, number>
    p[toolId] = (p[toolId] ?? 0) + 0.05
    return true
  }

  // --- Animal Management ---

  const addAnimal = (type: Animal['type'], name: string, homeBuildingId: string) => {
    let spawnX = 10
    let spawnY = 10
    const farmBuildings = gameState.value.buildings['farm'] || []
    const home = farmBuildings.find(b => b.id === homeBuildingId)
    if (home) {
        spawnX = home.doorX || home.x
        spawnY = home.doorY || home.y
    }

    gameState.value.animals.push({
        id: `${type}_${Date.now()}`,
        type,
        name,
        age: 0,
        friendship: 0,
        mood: 255,
        homeBuildingId,
        location: 'farm',
        x: spawnX,
        y: spawnY,
        direction: 'left',
        fed: false,
        produceReady: false,
        color: 0xFFFFFF,
        hasPet: false
    } as Animal)
  }

  // --- Inventory Management ---

  const MAX_INVENTORY_SLOTS = 36
  const MAX_STACK_SIZE = 999

  const addToInventory = (newItemInput: Partial<InventoryItem> & { id: string, quantity: number }): boolean => {
    const def = ITEMS[newItemInput.id]
    let quantityToAdd = newItemInput.quantity

    // 1. Try to stack
    const existingItems = gameState.value.inventory.filter(item => item.id === newItemInput.id && item.quantity < MAX_STACK_SIZE)

    for (const item of existingItems) {
      const space = MAX_STACK_SIZE - item.quantity
      if (quantityToAdd <= space) {
        item.quantity += quantityToAdd
        return true
      } else {
        item.quantity = MAX_STACK_SIZE
        quantityToAdd -= space
      }
    }

    if (quantityToAdd <= 0) return true

    // 2. Add to new slot
    if (gameState.value.inventory.length < MAX_INVENTORY_SLOTS) {
      const newItem: InventoryItem = {
        id: newItemInput.id,
        quantity: quantityToAdd,
        name: newItemInput.name || def?.name || newItemInput.id,
        type: newItemInput.type || def?.type || 'item',
        icon: newItemInput.icon || def?.icon || '❓',
        description: newItemInput.description || def?.description || '',
        data: newItemInput.data
      }
      gameState.value.inventory.push(newItem)
      return true
    }
    return false
  }

  const countItem = (itemId: string): number => {
    return gameState.value.inventory
      .filter(i => i.id === itemId)
      .reduce((total, item) => total + item.quantity, 0)
  }

  const removeFromInventory = (itemId: string, quantity: number): boolean => {
    if (countItem(itemId) < quantity) return false
    let remaining = quantity

    for (let i = 0; i < gameState.value.inventory.length; i++) {
      const item = gameState.value.inventory[i]
      if (!item) continue

      if (item.id === itemId) {
        if (item.quantity >= remaining) {
          item.quantity -= remaining
          remaining = 0
        } else {
          remaining -= item.quantity
          item.quantity = 0
        }

        if (item.quantity <= 0) {
          gameState.value.inventory.splice(i, 1)
          i--
        }

        if (remaining <= 0) break
      }
    }
    return true
  }

  const buyItem = (itemId: string, quantity: number, unitPrice?: number): boolean => {
    const def = ITEMS[itemId]
    const price = unitPrice ?? def?.price ?? 0
    const total = price * quantity
    if (gameState.value.player.gold < total) return false
    if (!addToInventory({ id: itemId, quantity })) return false
    gameState.value.player.gold -= total
    return true
  }

  const sellItem = (itemId: string, quantity: number): boolean => {
    const def = ITEMS[itemId]
    const sellPrice = def?.sellPrice ?? 0
    if (sellPrice <= 0) return false
    if (!removeFromInventory(itemId, quantity)) return false
    gameState.value.player.gold += sellPrice * quantity
    return true
  }

  const canCraft = (recipe: CraftingRecipe): boolean => {
    return recipe.ingredients.every(ing => countItem(ing.itemId) >= ing.quantity)
  }

  const craftItem = (recipeId: string): boolean => {
    const recipe = craftingRecipes.find(r => r.id === recipeId)
    if (!recipe) return false
    if (!canCraft(recipe)) return false
    recipe.ingredients.forEach(ing => removeFromInventory(ing.itemId, ing.quantity))
    return addToInventory({ id: recipe.result.itemId, quantity: recipe.result.quantity })
  }

  const openChest = (chestId: string) => {
    if (!gameState.value.chestData[chestId]) gameState.value.chestData[chestId] = []
    chestState.value = {
      isOpen: true,
      chestId,
      items: gameState.value.chestData[chestId]
    }
  }

  const closeChest = () => {
    chestState.value.isOpen = false
  }

  const addToContainer = (container: InventoryItem[], item: InventoryItem) => {
    const existing = container.find(i => i.id === item.id)
    if (existing) {
      existing.quantity += item.quantity
      return
    }
    container.push({ ...item })
  }

  const transferToChest = (inventoryIndex: number) => {
    const item = gameState.value.inventory[inventoryIndex]
    if (!item) return
    const chestId = chestState.value.chestId
    if (!chestId) return
    if (!gameState.value.chestData[chestId]) gameState.value.chestData[chestId] = []
    gameState.value.inventory.splice(inventoryIndex, 1)
    addToContainer(gameState.value.chestData[chestId], item)
  }

  const transferToInventory = (chestIndex: number) => {
    const chestId = chestState.value.chestId
    if (!chestId) return
    const chestItems = gameState.value.chestData[chestId]
    const item = chestItems?.[chestIndex]
    if (!item) return
    chestItems.splice(chestIndex, 1)
    addToInventory({ id: item.id, quantity: item.quantity, name: item.name, type: item.type, icon: item.icon, description: item.description, data: item.data })
  }

  // --- Quest System ---

  const addQuest = (questDefId: string) => {
    const questDef = QUESTS[questDefId]
    if (!questDef) return

    // Check if already active or completed (if non-repeatable)
    if (gameState.value.quests.some(q => q.id === questDefId)) return

    const newQuest: Quest = {
      id: questDef.id,
      title: questDef.title,
      description: questDef.description,
      type: questDef.type as Quest['type'],
      count: questDef.steps[0]?.targetCount || 1,
      currentCount: 0,
      reward: questDef.goldReward,
      completed: false,
      steps: questDef.steps.map(s => ({...s, completed: false, currentCount: 0}))
    }
    gameState.value.quests.push(newQuest)
    addVisualEffect(gameState.value.player.x, gameState.value.player.y, '新任务!', 0xFFFF00)
    SoundManager.getInstance().play('quest')
  }

  const updateQuestProgress = (type: string, targetId: string, amount: number = 1) => {
    gameState.value.quests.forEach(quest => {
      if (!quest.completed) {
         // Check steps
         if (quest.steps) {
             quest.steps.forEach(step => {
                 // Simple matching logic, can be expanded
                 if (!step.completed) {
                     step.currentCount = (step.currentCount || 0) + amount
                     if (step.targetCount && step.currentCount >= step.targetCount) {
                         step.completed = true
                     }
                 }
             })
             // Check if all steps completed
             if (quest.steps.every(s => s.completed)) {
                 completeQuest(quest)
             }
         }
      }
    })
  }

  const completeQuest = (quest: Quest) => {
      quest.completed = true
      gameState.value.player.gold += quest.reward
      addVisualEffect(gameState.value.player.x, gameState.value.player.y, `任务完成! +${quest.reward}G`, 0xFFD700)
      SoundManager.getInstance().play('achievement')
  }

  // --- Event System ---

  const checkEventTriggers = () => {
    // Check all events in EVENTS
    Object.values(EVENTS).forEach(eventDef => {
        // Skip if already seen
        if (gameState.value.events.some(e => e.id === eventDef.id && e.seen)) return

        // Check trigger conditions
        const trigger = eventDef.trigger
        let match = true

        if (trigger.type === 'location' && trigger.location !== gameState.value.location) match = false
        if (trigger.season && trigger.season !== gameState.value.currentSeason) match = false
        if (trigger.day && trigger.day !== gameState.value.currentDay) match = false
        // Time range check
        if (trigger.timeRange) {
             // Convert gameTime to HHMM format roughly? Or just use minutes
             // gameTime 0 = 600. 60 = 700.
             const currentMinutes = gameState.value.gameTime
             const currentHHMM = Math.floor(currentMinutes / 60 + 6) * 100 + (currentMinutes % 60)
             if (currentHHMM < trigger.timeRange[0] || currentHHMM > trigger.timeRange[1]) match = false
        }
        if (trigger.weather) {
            const isRain = gameState.value.weather === 'rainy' || gameState.value.weather === 'storm'
            if (trigger.weather === 'sun' && isRain) match = false
            if (trigger.weather === 'rain' && !isRain) match = false
        }

        if (match) {
            startEvent(eventDef.id)
        }
    })
  }

  const startEvent = (eventId: string) => {
      const eventDef = EVENTS[eventId]
      if (!eventDef) return

      gameState.value.activeCutscene = {
          eventId,
          stepIndex: 0,
          timer: 0,
          waitingForInput: false
      }
      console.log(`Starting event: ${eventId}`)
      // Pause game time?
  }

  // --- Furniture System ---

  const placeFurniture = (itemId: string, x: number, y: number, rotation: number = 0) => {
      const furnDef = FURNITURE[itemId]
      if (!furnDef) return false

      const mapId = gameState.value.location
      if (!gameState.value.furniture[mapId]) gameState.value.furniture[mapId] = []

      // Check collision?
      // For now, just place
      gameState.value.furniture[mapId].push({
          id: `furn_${Date.now()}`,
          definitionId: itemId,
          x,
          y,
          rotation
      })

      return true
  }

  // --- Time System ---

  const updateGameTime = () => {
    // 1 second real time = 1 minute game time
    if (dialogueState.value.isOpen || shopState.value.isOpen || gameState.value.activeCutscene) return

    gameState.value.gameTime += 1

    // Check schedule updates
    if (gameState.value.gameTime % 10 === 0) {
        checkEventTriggers()
        checkSchedules()
    }

    if (gameState.value.gameTime >= 1200) { // 2:00 AM
        startNewDay()
    }
  }

  const checkSchedules = () => {
      const time = gameState.value.gameTime
      const hour = Math.floor(time / 60) + 6
      const minute = time % 60
      const timeString = `${hour}${minute.toString().padStart(2, '0')}` // e.g. 800, 1700

      gameState.value.npcs.forEach(npc => {
          const schedule = npc.schedule?.[timeString]
          if (schedule) {
              console.log(`NPC ${npc.name} schedule: ${timeString} -> ${schedule.map}`)
              npc.destination = { map: schedule.map, x: schedule.x, y: schedule.y }
              npc.isMoving = true
              recalculateNPCPath(npc)
          }
      })
  }

  const recalculateNPCPath = (npc: NPC) => {
      if (!npc.destination) return

      // 1. Same map
      if (npc.location === npc.destination.map) {
          if (npc.location === gameState.value.location) {
              npc.path = findPath(npc.x, npc.y, npc.destination.x, npc.destination.y, gameState.value, npc.location)
          } else {
              npc.targetX = npc.destination.x
              npc.targetY = npc.destination.y
              npc.path = []
          }
      } else {
          // 2. Different map
          const currentMapCfg = MAPS[npc.location]
          if (!currentMapCfg) return

          const teleport = currentMapCfg.teleports.find(t => t.targetMap === npc.destination!.map)

          if (teleport) {
              if (npc.location === gameState.value.location) {
                  npc.path = findPath(npc.x, npc.y, teleport.x, teleport.y, gameState.value, npc.location)
              } else {
                  npc.targetX = teleport.x
                  npc.targetY = teleport.y
                  npc.path = []
              }
          } else {
               // Fallback: Teleport
               npc.location = npc.destination.map
               npc.x = npc.destination.x
               npc.y = npc.destination.y
               npc.isMoving = false
               npc.destination = undefined
          }
      }
  }


  const startNewDay = () => {
      gameState.value.currentDay++
      if (gameState.value.currentDay > 28) {
          gameState.value.currentDay = 1
          const seasons = ['spring', 'summer', 'autumn', 'winter']
          const idx = seasons.indexOf(gameState.value.currentSeason)
          const nextSeason = seasons[(idx + 1) % 4] as GameState['currentSeason']
          gameState.value.currentSeason = nextSeason
          if (nextSeason === 'spring') gameState.value.currentYear++

          // Kill crops that don't grow in the new season
          gameState.value.plots.forEach(row => {
              row.forEach(plot => {
                  if (plot.hasCrop && plot.crop) {
                      const cropDef = CROPS[plot.crop.type]
                      if (cropDef && !cropDef.seasons.includes(nextSeason)) {
                          plot.hasCrop = false
                          plot.crop = undefined
                          plot.isTilled = false // Soil also untils? Maybe just crop dies. Stardew keeps dead crop.
                          // For simplicity, remove crop. Or replace with 'dead_crop' if we had it.
                          // Let's remove it for now to avoid complexity of dead textures.
                      }
                  }
              })
          })
      }

      gameState.value.gameTime = 0 // 6:00 AM
      gameState.value.player.energy = gameState.value.player.maxEnergy
      gameState.value.weather = Math.random() < 0.2 ? 'rainy' : 'sunny' // Simple weather

      // Reset NPC daily flags
      gameState.value.npcs.forEach(npc => {
          npc.talkedToday = false
          npc.giftsThisWeek = 0 // Should probably reset on Sunday, but let's leave it for now or implement week check
      })

      // Grow crops
      growCrops()

      // Save game
      saveGame()

      // Show summary?
      addVisualEffect(gameState.value.player.x, gameState.value.player.y, `Day ${gameState.value.currentDay}`, 0xFFFFFF)
  }

  const growCrops = () => {
      gameState.value.plots.forEach(row => {
          row.forEach(plot => {
              if (plot.crop) {
                  if (plot.isWatered) {
                      plot.crop.growthStage++
                      if (plot.crop.growthStage > plot.crop.maxGrowthStage) {
                          plot.crop.growthStage = plot.crop.maxGrowthStage
                      }
                      plot.isWatered = false // Reset water
                  }
              }
              if (plot.isTilled && !plot.hasCrop) {
                  // Chance to until
                  if (Math.random() < 0.1) plot.isTilled = false
              }
          })
      })
  }

  // --- Dialogue & Shop ---

  const dialogueState = ref({
    isOpen: false,
    name: '',
    text: '',
    portraitColor: '#d3a068',
    choices: [] as DialogueChoice[]
  })

  const shopState = ref({
    isOpen: false,
    items: [] as { id: string; price: number }[]
  })

  const openDialogue = (name: string, text: string, color: string = '#d3a068', choices: DialogueChoice[] = []) => {
    dialogueState.value = { isOpen: true, name, text, portraitColor: color, choices }
  }

  const closeDialogue = () => { dialogueState.value.isOpen = false }

  const openShop = (items: { id: string; price: number }[]) => {
      shopState.value = { isOpen: true, items }
  }

  const closeShop = () => { shopState.value.isOpen = false }

  // --- Persistence ---

  const saveGame = () => {
      localStorage.setItem('stardew_save', JSON.stringify(gameState.value))
      console.log('Game Saved')
  }

  const loadGame = (): boolean => {
      const saved = localStorage.getItem('stardew_save')
      if (saved) {
          try {
              const parsed = JSON.parse(saved)
              // Merge with default state to ensure new fields exist
              // gameState.value = { ...gameState.value, ...parsed } // Shallow merge not enough for nested
              // Ideally, verify version. For now, simple load.
              // We need to re-hook methods or complex objects if any.
              // Since state is mostly JSON serializable, this works for data.
              // But we need to ensure arrays like monsters/animals are typed correctly if they have methods (they don't).
              gameState.value = parsed
              return true
          } catch (e) {
              console.error('Failed to load save', e)
              return false
          }
      }
      return false
  }

  // --- Initialization ---

  const initializeGame = () => {
    console.log('Initializing game...')
    if (!loadGame()) {
      // Load initial buildings from static MAPS
      Object.keys(MAPS).forEach(mapId => {
          const mapConfig = MAPS[mapId]
          if (mapConfig && mapConfig.buildings) {
              gameState.value.buildings[mapId] = [...mapConfig.buildings]
          } else {
              gameState.value.buildings[mapId] = []
          }
      })

      // Initialize Plots for farm
      const mapConfig = MAPS['farm']
      if (mapConfig) {
          gameState.value.plots = mapConfig.generatePlots()
          gameState.value.savedMaps['farm'] = gameState.value.plots
      }

      // Add Intro Quest
      addQuest('introductions')

      // Give initial items
      addToInventory({ id: 'parsnip_seeds', quantity: 15 })
      addToInventory({ id: 'hoe', quantity: 1 })
      addToInventory({ id: 'watering', quantity: 1 })
      addToInventory({ id: 'axe', quantity: 1 })
      addToInventory({ id: 'pickaxe', quantity: 1 })
      addToInventory({ id: 'scythe', quantity: 1 })
    }

    // Ensure NPCs are loaded (if not in save or updated)
    // If we loaded game, NPCs might be stale or missing new ones.
    // Let's merge static NPC data (schedule, etc) with saved dynamic data (position, friendship)
    const savedNPCs = gameState.value.npcs
    const freshNPCs = Object.values(NPCS)

    // We want to keep saved friendship/position, but update schedule/dialogue
    gameState.value.npcs = freshNPCs.map(fresh => {
        const saved = savedNPCs.find(s => s.id === fresh.id)
        if (saved) {
            // Merge: keep fresh static data, keep saved dynamic data
            return {
                ...fresh,
                x: saved.x,
                y: saved.y,
                location: saved.location,
                // If friendship was stored on NPC, keep it.
                // But we decided to store friendship in Player.friendships.
                // So NPC object is mostly for current position/state.
            }
        }
        return fresh
    })

    startGameLoop()
  }

  // --- Loops & Updates (Simplified for brevity in this massive update) ---

  const startGameLoop = () => {
      if (gameLoopIntervalId) return
      let frameCount = 0
      gameLoopIntervalId = window.setInterval(() => {
          frameCount++
          // 60 frames = 1 second real time.
          // 1 second real time = 1 minute game time.
          if (frameCount % 60 === 0) {
              updateGameTime()
          }

          updateNPCMovements()
          // updateAnimals() // (Implement as before)
          // updateMonsters() // (Implement as before)
          // updateFishing() // (Implement as before)

          // Cleanup effects
          const now = Date.now()
          gameState.value.visualEffects = gameState.value.visualEffects.filter(e => now - e.createdAt < 2000)
      }, 1000 / 60)
  }

  const updateNPCMovements = () => {
      const speed = 0.06 // Pixels per frame

      gameState.value.npcs.forEach(npc => {
          if (!npc.isMoving) return

          // Off-screen movement (simplified)
          if (npc.location !== gameState.value.location) {
              if (npc.destination) {
                  // If crossing map boundary
                  if (npc.location !== npc.destination.map) {
                       // Check if reached "teleport" spot (targetX)
                       if (npc.targetX !== undefined && Math.abs(npc.x - npc.targetX) < 1 && Math.abs(npc.y - npc.targetY!) < 1) {
                           // Switch map
                           npc.location = npc.destination.map
                           // Teleport to destination to be safe/simple
                           npc.x = npc.destination.x
                           npc.y = npc.destination.y
                           npc.isMoving = false
                           npc.destination = undefined
                       } else {
                           moveNPCLinear(npc, 0.5) // Fast off-screen
                       }
                  } else {
                      // Same map, move to dest
                      moveNPCLinear(npc, 0.5)
                      if (npc.destination && Math.abs(npc.x - npc.destination.x) < 1 && Math.abs(npc.y - npc.destination.y) < 1) {
                          npc.x = npc.destination.x
                          npc.y = npc.destination.y
                          npc.isMoving = false
                          npc.destination = undefined
                      }
                  }
              }
              return
          }

          // On-screen movement
        if (npc.path && npc.path.length > 0) {
            const nextPoint = npc.path[0]
            if (!nextPoint) return // Should not happen given length check but satisfies TS
            const dx = nextPoint.x - npc.x
              const dy = nextPoint.y - npc.y
              const dist = Math.sqrt(dx*dx + dy*dy)

              if (dist < speed) {
                  npc.x = nextPoint.x
                  npc.y = nextPoint.y
                  npc.path.shift() // Reached node

                  // Update facing
                  if (Math.abs(dx) > Math.abs(dy)) {
                      npc.facing = dx > 0 ? 'right' : 'left'
                  } else {
                      npc.facing = dy > 0 ? 'down' : 'up'
                  }

                  if (npc.path.length === 0) {
                      // Path finished.
                      if (npc.destination && npc.location !== npc.destination.map) {
                          // Switch map!
                           npc.location = npc.destination.map
                           npc.x = npc.destination.x
                           npc.y = npc.destination.y
                           npc.path = []
                           recalculateNPCPath(npc)
                      } else {
                          npc.isMoving = false
                          npc.destination = undefined
                      }
                  }
              } else {
                  npc.x += (dx/dist) * speed
                  npc.y += (dy/dist) * speed
                   // Update facing continuous
                  if (Math.abs(dx) > Math.abs(dy)) {
                      npc.facing = dx > 0 ? 'right' : 'left'
                  } else {
                      npc.facing = dy > 0 ? 'down' : 'up'
                  }
              }
          } else if (npc.destination) {
              recalculateNPCPath(npc)
              if (!npc.path || npc.path.length === 0) {
                   // Teleport if stuck
                   npc.x = npc.destination.x
                   npc.y = npc.destination.y
                   npc.location = npc.destination.map
                   npc.isMoving = false
                   npc.destination = undefined
              }
          }
      })
  }

  const moveNPCLinear = (npc: NPC, spd: number) => {
      if (npc.targetX === undefined) return
      const dx = npc.targetX - npc.x
      const dy = npc.targetY! - npc.y
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist < spd) {
          npc.x = npc.targetX
          npc.y = npc.targetY!
      } else {
          npc.x += (dx/dist) * spd
          npc.y += (dy/dist) * spd
      }
  }

  const interact = () => {
      const target = hoveredTarget.value
      if (target) {
          if (target.type === 'npc') {
              const npc = gameState.value.npcs.find(n => n.name === target.name)
              if (npc) {
                  const text = npc.dialogue.default[Math.floor(Math.random() * npc.dialogue.default.length)] || '...'
                  openDialogue(npc.name, text, npc.portraitColor)
              }
          }
      }
  }

  const confirmPlacement = (x: number, y: number) => {
    if (!placementState.value.isPlacing) return false

    const { width, height, goldCost, resourceCost, type, buildingId } = placementState.value
    const mapId = gameState.value.location
    const plots = gameState.value.plots

    if (y < 0 || x < 0) return false
    if (y + height > plots.length) return false
    if (x + width > (plots[0]?.length || 0)) return false

    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const plot = getPlotAt(x + dx, y + dy)
        if (!plot) return false
        if (plot.terrain === 'water') return false
        if (plot.object) return false
        if (plot.hasCrop) return false
      }
    }

    if (gameState.value.player.gold < goldCost) return false
    for (const [resId, qty] of Object.entries(resourceCost)) {
      if (countItem(resId) < qty) return false
    }

    gameState.value.player.gold -= goldCost
    for (const [resId, qty] of Object.entries(resourceCost)) {
      removeFromInventory(resId, qty)
    }

    const doorX = x + Math.floor(width / 2)
    const doorY = y + height - 1
    const newBuilding: Building = {
      id: `${buildingId}_${Date.now()}`,
      type,
      x,
      y,
      width,
      height,
      doorX,
      doorY
    }

    if (!gameState.value.buildings[mapId]) gameState.value.buildings[mapId] = []
    gameState.value.buildings[mapId].push(newBuilding)

    placementState.value.isPlacing = false
    placementState.value.buildingId = ''
    return true
  }

  const handlePlotInteraction = (x: number, y: number) => {
    const plot = getPlotAt(x, y)
    if (!plot) return

    const selectedId = gameState.value.selectedTool
    const selectedDef = ITEMS[selectedId]

    if (plot.hasCrop && plot.crop && plot.crop.growthStage >= plot.crop.maxGrowthStage) {
      const cropDef = CROPS[plot.crop.type]
      if (!cropDef) return

      const qty = Math.floor(
        (cropDef.minHarvest ?? 1) +
          Math.random() * ((cropDef.maxHarvest ?? 1) - (cropDef.minHarvest ?? 1) + 1)
      )
      addToInventory({ id: cropDef.harvestItemId, quantity: qty })
      addVisualEffect(x, y, `收获 x${qty}`, 0xFFFFFF)

      if (cropDef.regrow && cropDef.regrow > 0) {
        plot.crop.growthStage = Math.max(0, plot.crop.maxGrowthStage - cropDef.regrow)
      } else {
        plot.hasCrop = false
        plot.crop = undefined
      }
      return
    }

    if (selectedDef?.type === 'seed') {
      if (!plot.isTilled || plot.hasCrop || plot.object) return
      const cropType = selectedDef.cropType
      if (!cropType) return
      const cropDef = CROPS[cropType]
      if (!cropDef) return
      if (!cropDef.seasons.includes(gameState.value.currentSeason)) {
        addVisualEffect(x, y, '季节不适合', 0xFF6666)
        return
      }
      if (!removeFromInventory(selectedId, 1)) return

      plot.hasCrop = true
      plot.crop = {
        id: cropDef.harvestItemId,
        type: cropDef.id,
        growthStage: 0,
        maxGrowthStage: cropDef.growthStages,
        regrowAfterHarvest: cropDef.regrow,
        plantedAt: Date.now(),
        isWatered: false,
        daysSinceLastWater: 0
      }
      addVisualEffect(x, y, '播种', 0xAAFFAA)
      return
    }

    if (selectedId === 'hoe') {
      if (plot.terrain === 'water' || plot.terrain === 'floor' || plot.terrain === 'floor_light' || plot.terrain === 'paved') return
      if (plot.object || plot.hasCrop) return
      if (!spendEnergy('hoe')) return
      plot.isTilled = true
      plot.terrain = 'dirt'
      plot.isWatered = false
      return
    }

    if (selectedId === 'watering') {
      if (!plot.isTilled) return
      const can = gameState.value.inventory.find(i => i.id === 'watering')
      if (can?.data) {
        if ((can.data.water ?? 0) <= 0) return
        if (!spendEnergy('watering')) return
        plot.isWatered = true
        can.data.water = (can.data.water ?? 0) - 1
        return
      }
      if (!spendEnergy('watering')) return
      plot.isWatered = true
      return
    }

    if (selectedId === 'axe' || selectedId === 'pickaxe' || selectedId === 'scythe') {
      const obj = plot.object
      if (!obj) return

      if (selectedId === 'axe' && obj.type !== 'wood') return
      if (selectedId === 'pickaxe' && obj.type !== 'stone') return
      if (selectedId === 'scythe' && obj.type !== 'weed') return

      if (!spendEnergy(selectedId)) return
      obj.hp -= 1
      if (obj.hp > 0) return

      plot.object = undefined
      if (obj.type === 'wood') addToInventory({ id: 'wood', quantity: 1 })
      if (obj.type === 'stone') addToInventory({ id: 'stone', quantity: 1 })
      if (obj.type === 'weed') addToInventory({ id: 'fiber', quantity: 1 })
      return
    }
  }

  const updatePlayerPosition = (x: number, y: number, direction: string, isMoving: boolean) => {
      const p = gameState.value.player
      p.x = x
      p.y = y
      p.direction = direction as Player['direction']
      p.isMoving = isMoving
  }

  const openCarpenterMenu = () => {
    carpenterState.value.isOpen = true
  }

  const closeCarpenterMenu = () => {
    carpenterState.value.isOpen = false
  }

  const startBuildingPlacement = (payload: {
    buildingId: string
    type: Building['type']
    width: number
    height: number
    goldCost: number
    resourceCost: Record<string, number>
  }) => {
    placementState.value = {
      isPlacing: true,
      buildingId: payload.buildingId,
      type: payload.type,
      width: payload.width,
      height: payload.height,
      goldCost: payload.goldCost,
      resourceCost: payload.resourceCost
    }
  }

  const switchLocation = (mapId: string, x?: number, y?: number) => {
      gameState.value.location = mapId
      if (x !== undefined && y !== undefined) {
          gameState.value.player.x = x
          gameState.value.player.y = y
      }
  }

  const completeFishing = (success: boolean, treasure: boolean) => {
      gameState.value.fishingState.state = success ? 'caught' : 'lost'
      // Logic to give fish...
      if (success && gameState.value.fishingState.fishId) {
          addToInventory({ id: gameState.value.fishingState.fishId, quantity: 1 })
          if (treasure) {
              addToInventory({ id: 'chest', quantity: 1 }) // Simple treasure
              addVisualEffect(gameState.value.player.x, gameState.value.player.y, '宝箱!', 0xFFFF00)
          }
          addVisualEffect(gameState.value.player.x, gameState.value.player.y, '钓到了!', 0x00FF00)
      }
      setTimeout(() => {
          gameState.value.fishingState.state = 'idle'
      }, 1000)
  }

  const interactWithNPC = (npcId: string) => {
      const npc = gameState.value.npcs.find(n => n.id === npcId)
      if (npc) {
          if (!npc.talkedToday) {
              npc.talkedToday = true
              npc.relationship = (npc.relationship || 0) + 20
              // Sync to player friendships map if we decide to use that as source of truth
              gameState.value.player.friendships[npcId] = npc.relationship
          }
          const text = npc.dialogue.default[Math.floor(Math.random() * npc.dialogue.default.length)] || '...'
          openDialogue(npc.name, text, npc.portraitColor)
      }
  }

  return {
    interact,
    confirmPlacement,
    handlePlotInteraction,
    updatePlayerPosition,
    ITEMS,
    isExhausted: computed(() => gameState.value.player.energy <= 0),
    gameState,
    dialogueState,
    shopState,
    chestState,
    fishingState: computed(() => gameState.value.fishingState),
    selectedTool: computed(() => gameState.value.selectedTool),
    currentTime: computed(() => {
        // Format gameTime (minutes) to String
        const totalMinutes = gameState.value.gameTime
        const hour = Math.floor(totalMinutes / 60) + 6 // Start at 6:00
        const minute = totalMinutes % 60
        const ampm = hour < 12 ? '上午' : '下午'
        const displayHour = hour > 12 ? hour - 12 : hour
        const displayHourStr = displayHour === 0 ? 12 : displayHour
        return `${gameState.value.currentSeason === 'spring' ? '春' : gameState.value.currentSeason === 'summer' ? '夏' : gameState.value.currentSeason === 'autumn' ? '秋' : '冬'}${gameState.value.currentDay}日 ${ampm}${displayHourStr}:${minute.toString().padStart(2, '0')}`
    }),
    playerGold: computed(() => gameState.value.player.gold),
    playerEnergy: computed(() => gameState.value.player.energy),
    isMenuOpen: ref(false), // exposed ref
    hoveredTarget,

    // Actions
    initializeGame,
    saveGame,
    loadGame,
    startGameLoop,
    stopGameLoop: () => {
      if (!gameLoopIntervalId) return
      window.clearInterval(gameLoopIntervalId)
      gameLoopIntervalId = null
    },
    addToInventory,
    removeFromInventory,
    countItem,
    buyItem,
    sellItem,
    canCraft,
    craftItem,
    openChest,
    closeChest,
    transferToChest,
    transferToInventory,
    setSelectedTool: (id: string) => gameState.value.selectedTool = id,
    addVisualEffect,
    openDialogue,
    closeDialogue,
    openShop,
    closeShop,
    openCarpenterMenu,
    closeCarpenterMenu,
    startBuildingPlacement,
    placeFurniture,
    checkEventTriggers,
    interactWithAnimal: (id: string) => { return !!id }, // Placeholder
    playerAttack: () => {}, // Placeholder
    addQuest,
    addAnimal,
    updateQuestProgress,
    calculateStaminaCost,
    isQuestLogOpen,
    isCalendarOpen,
    isMailboxOpen,
    placementState,
    carpenterState,
    craftingRecipes,
    switchLocation,
    completeFishing,
    interactWithNPC,
    processNewDay: startNewDay
  }
})
