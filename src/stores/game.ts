import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ITEMS, type ItemDefinition } from '@/data/items'
import { CRAFTING_RECIPES } from '@/data/recipes'
import { MACHINE_RECIPES } from '@/data/machines'
import { MAPS } from '@/data/maps'
import { NPCS, type NPC } from '@/data/npcs'
import { MONSTERS, type MonsterDefinition } from '@/data/monsters'
import { SoundManager } from '@/utils/SoundManager'
import { findPath } from '@/utils/Pathfinding'

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
  type: 'delivery' | 'slay' | 'gather'
  targetId: string // Item ID or Monster ID
  targetName: string
  recipientId?: string // For delivery quests (NPC ID)
  count: number
  currentCount: number
  reward: number
  completed: boolean
}

export interface Crop {
  id: string
  type: string
  growthStage: number
  maxGrowthStage: number
  regrowAfterHarvest?: number // Added
  plantedAt: number
  isWatered: boolean
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
    name: string // Added for convenience when creating new items
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

export interface GameEvent {
  id: string
  type: 'festival' | 'heart'
  trigger: {
    season?: string
    day?: number
    npcId?: string
    relationship?: number
    location?: string
  }
  action: () => void
  seen: boolean
}

export interface DialogueChoice {
  text: string
  action: () => void
}

export interface Animal {
  id: string
  type: 'chicken' | 'cow' | 'sheep' | 'pig' | 'duck'
  name: string
  age: number // days
  friendship: number // 0-1000
  mood: number // 0-255
  isFed: boolean
  hasPet: boolean
  location: string
  x: number
  y: number
  produceReady?: boolean
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
  gameTime: number
  location: string
  mineLevel: number
  mineProgress: number
  selectedTool: string
  player: Player
  plots: Plot[][]
  savedMaps: Record<string, Plot[][]>
  inventory: InventoryItem[]
  droppedItems: DroppedItem[]
  npcs: NPC[]
  animals: Animal[]
  monsters: Monster[] // Added monsters
  chestData: Record<string, InventoryItem[]> // Added chest storage
  weather: 'sunny' | 'rainy' | 'cloudy' | 'storm' | 'snow'
  visualEffects: VisualEffect[]
  particleEvents: ParticleEvent[]
  npcScheduleIndex: Record<string, number>
  events: GameEvent[]
  quests: Quest[]
}

export const useGameStore = defineStore('game', () => {
  // Game state
  const hoveredTarget = ref<{
      type: 'npc' | 'object' | 'animal' | 'crop'
      name: string
      action?: string
  } | null>(null)

  const gameState = ref<GameState>({
    currentDay: 1,
    currentSeason: 'spring',
    currentYear: 1,
    currentTime: '春1日 上午6:00',
    gameTime: 6,
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
      x: 0,
      y: 0,
      direction: 'down',
      isMoving: false,
      isUsingTool: false,
      toolAnimationTimer: 0,
      toolProficiency: {
        hoe: 0,
        pickaxe: 0,
        axe: 0,
        watering: 0,
        fishing: 0
      },
      skills: {
        farming: 0,
        farmingExp: 0,
        mining: 0,
        miningExp: 0,
        foraging: 0,
        foragingExp: 0,
        fishing: 0,
        fishingExp: 0,
        combat: 0,
        combatExp: 0
      }
    },
    plots: [],
    savedMaps: {},
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
    npcs: JSON.parse(JSON.stringify(NPCS)),
    animals: [
       {
         id: 'chicken_1',
         type: 'chicken',
         name: 'Coco',
         age: 1,
         friendship: 0,
         mood: 150,
         isFed: false,
         hasPet: false,
         location: 'farm',
         x: 5,
         y: 5
       }
    ],
    monsters: [],
    chestData: {},
    weather: 'sunny',
    visualEffects: [],
    particleEvents: [],
    npcScheduleIndex: {},
    events: [
      {
        id: 'egg_festival',
        type: 'festival',
        trigger: { season: 'spring', day: 13 },
        action: () => {
          addVisualEffect(gameState.value.player.x, gameState.value.player.y, '今天是复活节！前往广场参加活动吧！', 0xFF69B4)
          SoundManager.getInstance().play('festival_alert')
        },
        seen: false
      },
      {
        id: 'abigail_2heart',
        type: 'heart',
        trigger: { npcId: 'abigail', relationship: 500, location: 'town' }, // 2 hearts = 500
        action: () => {
           openDialogue('阿比盖尔', '嘿，其实我不想只是待在店里帮忙...', '#9b59b6')
           SoundManager.getInstance().play('cutscene')
        },
        seen: false
      }
    ] as GameEvent[],
    quests: []
  })

  let lastTeleportTime = 0
  const TELEPORT_COOLDOWN_MS = 500
  let lastTeleportTile: { map: string, x: number, y: number } | null = null
  let gameLoopIntervalId: number | null = null

  // Crafting Recipes
  const craftingRecipes: CraftingRecipe[] = CRAFTING_RECIPES


  // Actions
  const MAX_INVENTORY_SLOTS = 36
  const MAX_STACK_SIZE = 999

  const addToInventory = (newItemInput: Partial<InventoryItem> & { id: string, quantity: number }): boolean => {
    const def = ITEMS[newItemInput.id]
    let quantityToAdd = newItemInput.quantity

    // 1. Try to stack with existing items
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

    // 2. Add to new slot if space available
    if (gameState.value.inventory.length < MAX_INVENTORY_SLOTS) {
      const newItem: InventoryItem = {
        id: newItemInput.id,
        quantity: quantityToAdd,
        name: newItemInput.name || def?.name || newItemInput.id,
        type: newItemInput.type || def?.type || 'item',
        icon: newItemInput.icon || def?.icon || '❓',
        description: newItemInput.description || def?.description || ''
      }
      gameState.value.inventory.push(newItem)
      return true
    }

    // Inventory full
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

    // Iterate through inventory backwards to remove from last stack first (optional preference)
    // or forwards. Let's do forwards to be simple.
    // We need to handle index shifting if we splice.
    // Safer to find indices first or iterate carefully.

    // Better: iterate and modify.
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
          // Mark for removal or remove immediately?
          // If we remove immediately, i--
          gameState.value.inventory.splice(i, 1)
          i--
        }

        if (remaining <= 0) break
      }
    }

    return true
  }

  const canCraft = (recipe: CraftingRecipe): boolean => {
    for (const ingredient of recipe.ingredients) {
      if (countItem(ingredient.itemId) < ingredient.quantity) {
        return false
      }
    }
    return true
  }

  const craftItem = (recipeId: string): boolean => {
    const recipe = craftingRecipes.find(r => r.id === recipeId)
    if (!recipe) return false

    if (!canCraft(recipe)) return false

    // Consume ingredients
    for (const ingredient of recipe.ingredients) {
      removeFromInventory(ingredient.itemId, ingredient.quantity)
    }

    // Add result
    addToInventory({
      id: recipe.result.itemId,
      name: recipe.result.name,
      type: recipe.result.type,
      quantity: recipe.result.quantity,
      icon: recipe.result.icon,
      description: recipe.description // Use recipe description as default for now
    })

    return true
  }

  // Quest System
  const addQuest = (quest: Quest) => {
    // Check if already exists
    if (gameState.value.quests.some(q => q.id === quest.id)) return

    gameState.value.quests.push(quest)
    addVisualEffect(gameState.value.player.x, gameState.value.player.y, '接受任务!', 0xFFFF00)
    SoundManager.getInstance().play('quest')
  }

  const updateQuestProgress = (type: 'gather' | 'slay' | 'delivery', targetId: string, amount: number = 1, extra?: { recipientId?: string }) => {
    gameState.value.quests.forEach(quest => {
      if (!quest.completed && quest.type === type && quest.targetId === targetId) {
        // For delivery, check recipient
        if (type === 'delivery' && quest.recipientId && extra?.recipientId && quest.recipientId !== extra.recipientId) {
            return
        }

        quest.currentCount += amount
        if (quest.currentCount >= quest.count) {
          quest.currentCount = quest.count
          quest.completed = true
          // Reward
          gameState.value.player.gold += quest.reward
          addVisualEffect(gameState.value.player.x, gameState.value.player.y, `任务完成! +${quest.reward}G`, 0xFFD700)
          SoundManager.getInstance().play('achievement')
        }
      }
    })
  }

  // Dropped Items Logic
  const dropItem = (x: number, y: number, itemId: string, quantity: number = 1) => {
    // Add some random scatter
    const scatterX = (Math.random() - 0.5) * 0.5
    const scatterY = (Math.random() - 0.5) * 0.5

    gameState.value.droppedItems.push({
      id: Math.random().toString(36).substr(2, 9),
      itemId,
      quantity,
      x: x + 0.5 + scatterX, // Center of tile + scatter
      y: y + 0.5 + scatterY,
      createdAt: Date.now()
    })
  }

  const collectItem = (droppedItem: DroppedItem) => {
    const success = addToInventory({
      id: droppedItem.itemId,
      quantity: droppedItem.quantity
    })

    if (success) {
      // Play sound
      SoundManager.getInstance().play('pickup')

      // Find item def for visual effect
      const itemDef = ITEMS[droppedItem.itemId]
      const itemName = itemDef?.name || droppedItem.itemId
      const itemColor = itemDef?.type === 'resource' ? 0x8D6E63 : 0xFFA500

      addVisualEffect(gameState.value.player.x, gameState.value.player.y, `+${droppedItem.quantity} ${itemName}`, itemColor)

      // Remove from dropped items
      gameState.value.droppedItems = gameState.value.droppedItems.filter(i => i.id !== droppedItem.id)

      // Update quests
      updateQuestProgress('gather', droppedItem.itemId, droppedItem.quantity)

      return true
    }
    return false
  }

  const checkMagneticPickup = () => {
    const player = gameState.value.player
    // Pickup radius (1.5 tiles), Magnetic radius (3 tiles)
    const pickupRadius = 1.5
    const magneticRadius = 3.5 // Increased slightly
    const moveSpeed = 0.2 // Faster pickup

    gameState.value.droppedItems.forEach(item => {
      const dx = player.x + 0.5 - item.x
      const dy = player.y + 0.5 - item.y
      const dist = Math.sqrt(dx*dx + dy*dy)

      if (dist < pickupRadius) {
        collectItem(item)
      } else if (dist < magneticRadius) {
        // Only attract if we have space? Stardew attracts anyway and then bounces if full.
        // For now, let's attract.

        // Move towards player
        item.isBeingCollected = true
        item.x += (dx / dist) * moveSpeed
        item.y += (dy / dist) * moveSpeed
      } else {
        item.isBeingCollected = false
      }
    })
  }


  const setSelectedTool = (toolId: string) => {
    gameState.value.selectedTool = toolId
  }

  // Computed properties
  const currentTime = computed(() => gameState.value.currentTime)
  const playerGold = computed(() => gameState.value.player.gold)
  const playerEnergy = computed(() => gameState.value.player.energy)
  const isExhausted = computed(() => gameState.value.player.energy <= 0)
  const selectedTool = computed(() => gameState.value.selectedTool)

  // Dialogue State
  const dialogueState = ref({
    isOpen: false,
    name: '',
    text: '',
    portraitColor: '#d3a068',
    choices: [] as DialogueChoice[]
  })

  // Shop State
  const shopState = ref({
    isOpen: false,
    items: [] as { id: string; price: number }[]
  })

  const isMenuOpen = ref(false)
  const isQuestLogOpen = ref(false)

  const openShop = (items: { id: string; price: number }[]) => {
    shopState.value = {
      isOpen: true,
      items
    }
  }

  const closeShop = () => {
    shopState.value.isOpen = false
  }

  const openDialogue = (name: string, text: string, color: string = '#d3a068', choices: DialogueChoice[] = []) => {
    dialogueState.value = {
      isOpen: true,
      name,
      text,
      portraitColor: color,
      choices
    }
  }

  const closeDialogue = () => {
    dialogueState.value.isOpen = false
  }

  // Initialize game
  const initializeGame = () => {
    console.log('Initializing game...')
    if (!loadGame()) {
      initializePlots()

      // Add Intro Quest
      addQuest({
        id: 'intro_wood',
        title: '收集木材',
        description: '先收集一些木材吧。',
        type: 'gather',
        targetId: 'wood',
        targetName: '木材',
        count: 5,
        currentCount: 0,
        reward: 50,
        completed: false
      })
    }
    startGameLoop()
  }

  // Generate Mine Level
  const generateMineLevel = (level: number): Plot[][] => {
      const width = 20
      const height = 20
      const plots: Plot[][] = []

      for (let y = 0; y < height; y++) {
          const row: Plot[] = []
          for (let x = 0; x < width; x++) {
              // Walls
              if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                   row.push({ x, y, isTilled: false, hasCrop: false, terrain: 'floor', object: { type: 'stone', id: `wall_${x}_${y}`, hp: 999 } })
                   continue
              }

              const plot: Plot = { x, y, isTilled: false, hasCrop: false, terrain: 'dirt' }

              // Chance for rocks/ores
              if (Math.random() < 0.15) {
                  const r = Math.random()
                  let type = 'stone'
                  let hp = 1

                  // Ore Probabilities based on level
                  if (level >= 1 && level < 40) {
                      if (r < 0.1) type = 'copper_node'
                      else if (r < 0.15) type = 'coal_node'
                  } else if (level >= 40 && level < 80) {
                       if (r < 0.1) type = 'iron_node'
                       else if (r < 0.12) type = 'coal_node'
                       else if (r < 0.13) type = 'copper_node'
                       hp = 2
                  } else if (level >= 80) {
                       if (r < 0.1) type = 'gold_node'
                       else if (r < 0.12) type = 'iron_node'
                       else if (r < 0.13) type = 'coal_node'
                       hp = 3
                  }

                  if (level > 100 && Math.random() < 0.01) {
                      type = 'iridium_node'
                      hp = 5
                  }

                  plot.object = { type, id: `${type}_${x}_${y}_${Date.now()}`, hp }
              }

              row.push(plot)
          }
          plots.push(row)
      }

      // Add Ladder UP (to previous level)
      const entryX = 10
      const entryY = 18
      if (plots[entryY] && plots[entryY][entryX]) {
          plots[entryY][entryX].object = { type: 'ladder_up', id: 'ladder_up', hp: 999 }
      }

      return plots
  }

  // Initialize farm plots
  const initializePlots = (mapId: string = 'farm') => {
    // Mine Special Handling
    if (mapId === 'mine') {
        if (gameState.value.mineLevel === 0) {
             const mapConfig = MAPS['mine']
             if (mapConfig) {
                 gameState.value.plots = mapConfig.generatePlots()
             } else {
                 gameState.value.plots = []
             }
        } else {
             gameState.value.plots = generateMineLevel(gameState.value.mineLevel)
        }
        gameState.value.savedMaps['mine'] = gameState.value.plots
    } else {
        // Check if map is already saved
        if (gameState.value.savedMaps[mapId]) {
          gameState.value.plots = gameState.value.savedMaps[mapId]
        } else {
          // Generate new map
          const mapConfig = MAPS[mapId]
          if (mapConfig) {
            gameState.value.plots = mapConfig.generatePlots()
            gameState.value.savedMaps[mapId] = gameState.value.plots
          } else {
            console.error(`Map definition for ${mapId} not found!`)
            gameState.value.plots = []
          }
        }
    }

    // Spawn Monsters if Mine
    if (mapId === 'mine' && gameState.value.mineLevel > 0) {
        spawnMonsters(gameState.value.mineLevel)
    } else {
        gameState.value.monsters = []
    }
  }

  const spawnDroppedItem = (x: number, y: number, itemId: string, quantity: number = 1) => {
    gameState.value.droppedItems.push({
      id: `drop_${Date.now()}_${Math.random()}`,
      itemId,
      quantity,
      x,
      y,
      createdAt: Date.now()
    })
  }

  const spawnMonsters = (level: number) => {
      const count = 3 + Math.floor(level / 10) + Math.floor(Math.random() * 3)
      const newMonsters: Monster[] = []

      for(let i=0; i<count; i++) {
          let x = 0, y = 0
          let valid = false
          let attempts = 0
          while(!valid && attempts < 50) {
              x = Math.floor(Math.random() * 20)
              y = Math.floor(Math.random() * 20)
              if (gameState.value.plots[y]?.[x]?.terrain !== 'water' && !gameState.value.plots[y]?.[x]?.object) {
                  valid = true
              }
              attempts++
          }
          if (!valid) continue

          let type: Monster['type'] = 'slime'
          if (level >= 40 && level < 80) {
              if (Math.random() < 0.3) type = 'bat'
              else if (Math.random() < 0.1) type = 'ghost'
          } else if (level >= 80) {
             const r = Math.random()
             if (r < 0.3) type = 'bat'
             else if (r < 0.5) type = 'ghost'
             else if (r < 0.7) type = 'grub'
             else if (r < 0.8) type = 'fly'
          }

          const def = MONSTERS[type]
          if (!def) continue

          // Scale stats by level
          const levelScale = 1 + (level * 0.05)

          newMonsters.push({
              id: `monster_${Date.now()}_${i}`,
              type,
              name: def.name,
              hp: Math.floor(def.maxHp * levelScale),
              maxHp: Math.floor(def.maxHp * levelScale),
              damage: Math.floor(def.damage * levelScale),
              x,
              y,
              speed: def.speed,
              aggroRange: def.aggroRange,
              isMoving: false,
              direction: 'down'
          })
      }
      gameState.value.monsters = newMonsters
  }

  const enterMineLevel = (level: number) => {
      gameState.value.mineLevel = level
      gameState.value.location = 'mine'

      initializePlots('mine')

      gameState.value.player.x = 10
      gameState.value.player.y = 18
      gameState.value.player.isMoving = false

      addVisualEffect(gameState.value.player.x, gameState.value.player.y, `Level ${level}`, 0xFFFFFF)
      SoundManager.getInstance().play('stone_crack')
  }

  // Switch location
  const switchLocation = (newLocation: string, targetX: number, targetY: number) => {
    // Save current map state
    gameState.value.savedMaps[gameState.value.location] = gameState.value.plots

    // Update location
    gameState.value.location = newLocation

    // Load new map
    initializePlots(newLocation)

    // Move player
    gameState.value.player.x = targetX
    gameState.value.player.y = targetY
    gameState.value.player.isMoving = false

    lastTeleportTime = Date.now()
    lastTeleportTile = { map: newLocation, x: targetX, y: targetY }

    console.log(`Switched location to ${newLocation} at (${targetX}, ${targetY})`)
  }

  // Update NPC movements
  const updateNPCMovements = () => {
    gameState.value.npcs.forEach(npc => {
      if (npc.isMoving && npc.targetX !== undefined && npc.targetY !== undefined) {
        // Calculate path if needed
        if ((!npc.path || npc.path.length === 0) && (Math.abs(npc.x - npc.targetX) > 0.1 || Math.abs(npc.y - npc.targetY) > 0.1)) {
           const path = findPath(npc.x, npc.y, npc.targetX, npc.targetY, gameState.value)
           if (path.length > 0) {
               npc.path = path
           }
        }

        const speed = 0.05
        let nextX = npc.targetX
        let nextY = npc.targetY

        // If we have a path, follow it
        if (npc.path && npc.path.length > 0) {
            nextX = npc.path[0]!.x
            nextY = npc.path[0]!.y
        }

        const dx = nextX - npc.x
        const dy = nextY - npc.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < speed) {
          // Arrived at intermediate or final target
          npc.x = nextX
          npc.y = nextY

          if (npc.path && npc.path.length > 0) {
              npc.path.shift()
          } else {
              npc.isMoving = false
          }
        } else {
          // Move
          npc.x += (dx / dist) * speed
          npc.y += (dy / dist) * speed

          // Update direction
          if (Math.abs(dx) > Math.abs(dy)) {
            npc.direction = dx > 0 ? 'right' : 'left'
          } else {
            npc.direction = dy > 0 ? 'down' : 'up'
          }
        }
      }
    })
  }

  // Update Monsters
  const updateMonsters = () => {
    if (gameState.value.location !== 'mine') return

    const player = gameState.value.player
    gameState.value.monsters.forEach(monster => {
      // 1. Aggro Check
      const dx = player.x - monster.x
      const dy = player.y - monster.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < monster.aggroRange) {
        // Move towards player
        const speed = monster.speed

        // Simple collision avoidance with player?
        // For now, just move.
        if (dist > 0.5) { // Stop if too close
            monster.x += (dx / dist) * speed
            monster.y += (dy / dist) * speed

            if (Math.abs(dx) > Math.abs(dy)) {
                monster.direction = dx > 0 ? 'right' : 'left'
            } else {
                monster.direction = dy > 0 ? 'down' : 'up'
            }
        } else {
            // Attack Player
            if (!monster.cooldown || monster.cooldown <= 0) {
                // Deal Damage
                // Simple defense calculation
                const defense = 0 // TODO: Add defense stat
                const damage = Math.max(1, monster.damage - defense)
                player.health = Math.max(0, player.health - damage)
                addVisualEffect(player.x, player.y, `-${damage}`, 0xFF0000)
                SoundManager.getInstance().play('take_damage')

                monster.cooldown = 60 // 1 second (60 frames)
            }
        }
      }

      if (monster.cooldown && monster.cooldown > 0) {
          monster.cooldown--
      }
    })

    // Remove dead monsters
    gameState.value.monsters = gameState.value.monsters.filter(m => m.hp > 0)
  }

  const damageMonster = (monsterId: string, damage: number) => {
      const monster = gameState.value.monsters.find(m => m.id === monsterId)
      if (!monster) return

      monster.hp -= damage
      addVisualEffect(monster.x, monster.y, `-${damage}`, 0xFFFFFF)
      SoundManager.getInstance().play('hit_enemy')

      // Knockback
      const player = gameState.value.player
      const dx = monster.x - player.x
      const dy = monster.y - player.y
      const len = Math.sqrt(dx*dx + dy*dy)
      if (len > 0) {
          monster.x += (dx/len) * 2
          monster.y += (dy/len) * 2
      }

      if (monster.hp <= 0) {
          // Die
          // gameState.value.monsters.splice(monsterIndex, 1) // Done in updateMonsters filter
          monster.hp = 0 // Mark as dead
          addVisualEffect(monster.x, monster.y, "DEAD", 0x000000)
          SoundManager.getInstance().play('enemy_die')

          // Drops
          const def = MONSTERS[monster.type]
          if (def && def.drops) {
              def.drops.forEach(drop => {
                  if (Math.random() < 0.5) {
                      spawnDroppedItem(monster.x, monster.y, drop)
                  }
              })
          }

          // Exp
          if (def && def.exp) {
              player.skills.combatExp += def.exp
          }
      }
  }

  const playerAttack = () => {
      const player = gameState.value.player
      const tool = gameState.value.selectedTool

      let hitX = player.x
      let hitY = player.y

      if (player.direction === 'up') hitY -= 1
      if (player.direction === 'down') hitY += 1
      if (player.direction === 'left') hitX -= 1
      if (player.direction === 'right') hitX += 1

      const hitBoxSize = 1.5

      gameState.value.monsters.forEach(monster => {
          const dx = monster.x - hitX
          const dy = monster.y - hitY

          if (Math.abs(dx) < hitBoxSize && Math.abs(dy) < hitBoxSize) {
               let damage = 10 + (player.skills.combat * 2)
               if (tool === 'sword_rusty') damage = 15 + (player.skills.combat * 2)

               damageMonster(monster.id, damage)
          }
      })

      SoundManager.getInstance().play('sword_swing')
  }

  // Game loop
  const startGameLoop = () => {
    if (gameLoopIntervalId !== null) return

    gameLoopIntervalId = window.setInterval(() => {
      updateGameTime()
      updateNPCMovements()
      updateAnimals()
      updateMonsters() // Added monster update

      const now = Date.now()
      gameState.value.visualEffects = gameState.value.visualEffects.filter(effect => now - effect.createdAt < 2000)

      checkMagneticPickup()
    }, 1000 / 60) // Run at 60 FPS for smooth item movement
  }

  const updateAnimals = () => {
    const height = gameState.value.plots.length
    const width = (height > 0 && gameState.value.plots[0]) ? gameState.value.plots[0].length : 0
    gameState.value.animals.forEach(animal => {
        if (gameState.value.location === animal.location) {
            // Random movement (simple wandering)
            if (Math.random() < 0.02) {
                const dx = (Math.random() - 0.5) * 0.1
                const dy = (Math.random() - 0.5) * 0.1
                const newX = animal.x + dx
                const newY = animal.y + dy

                // Bounds check
                if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                    const pX = Math.round(newX)
                    const pY = Math.round(newY)
                    const plot = gameState.value.plots[pY]?.[pX]

                    // Check collision with plots (objects, water, walls)
                    if (plot) {
                        // Avoid water
                        if (plot.terrain === 'water') return

                        // Avoid obstacles (fences, machines, etc.)
                        if (plot.object) return

                        // Avoid buildings (if map config has them)
                        // Simplified: assuming objects cover most building footprints or buildings are outside walkable plots?
                        // Actually buildings in 'farm' are just visual usually, but let's check MAPS
                        const mapConfig = MAPS[gameState.value.location]
                        if (mapConfig && mapConfig.buildings) {
                             const collision = mapConfig.buildings.some(b =>
                                newX >= b.x && newX < b.x + b.width &&
                                newY >= b.y && newY < b.y + b.height
                             )
                             if (collision) return
                        }

                        animal.x = newX
                        animal.y = newY
                    }
                }
            }
        }
    })
  }

  const interactWithAnimal = (animalId: string) => {
      const animal = gameState.value.animals.find(a => a.id === animalId)
      if (!animal) return

      const player = gameState.value.player
      const dist = Math.sqrt((player.x - animal.x) ** 2 + (player.y - animal.y) ** 2)
      if (dist > 2) return

      if (!animal.hasPet) {
          animal.hasPet = true
          animal.friendship = Math.min(1000, animal.friendship + 15)
          animal.mood = Math.min(255, animal.mood + 30)
          addVisualEffect(animal.x, animal.y, '❤', 0xFF0000)
          // SoundManager.getInstance().play('animal_pet')
      } else {
          addVisualEffect(animal.x, animal.y, 'Mood: ' + animal.mood, 0xFFFFFF)
      }
  }

  const stopGameLoop = () => {
    if (gameLoopIntervalId !== null) {
      clearInterval(gameLoopIntervalId)
      gameLoopIntervalId = null
    }
  }

  // Update game time
  const updateGameTime = () => {
    // Pause if any menu/dialogue is open
    if (shopState.value.isOpen || dialogueState.value.isOpen || isMenuOpen.value) {
        return
    }

    // Increment time
    // 1 game hour = 45 real seconds (at 60 FPS)
    // 1 hour = 2700 frames
    // Increment = 1 / 2700 hours per frame
    gameState.value.gameTime += 1 / 2700

    // Check for day end (2:00 AM next day => 26.0)
    if (gameState.value.gameTime >= 26) {
      // Pass out
      gameState.value.player.energy = Math.max(0, gameState.value.player.energy - 50) // Penalty
      gameState.value.player.gold = Math.max(0, gameState.value.player.gold - 1000) // Penalty (Doctor fee)
      addVisualEffect(gameState.value.player.x, gameState.value.player.y, '昏迷! -1000G', 0xFF0000)
      processNewDay()
    } else if (gameState.value.gameTime >= 24 && gameState.value.gameTime < 24.02) {
       // Just passed midnight, maybe show visual cue?
    }

    // Update time display string
    const totalMinutes = Math.floor(gameState.value.gameTime * 60)
    updateNPCSchedules(totalMinutes)
    const hour = Math.floor(totalMinutes / 60) % 24
    const minute = totalMinutes % 60

    // Update Machines (Check every 10 minutes)
    if (minute % 10 === 0) {
         gameState.value.plots.forEach(row => {
            row.forEach(plot => {
                if (plot.object && plot.object.processing && !plot.object.hasOutput) {
                    if (gameState.value.gameTime >= plot.object.processing.readyAt) {
                        plot.object.hasOutput = true
                        addVisualEffect(plot.x, plot.y, '完成!', 0x00FF00)
                    }
                }
            })
        })
    }

    const period = hour < 12 ? '上午' : '下午'
    const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour)

    gameState.value.currentTime = `第${gameState.value.currentYear}年 ${getSeasonName(gameState.value.currentSeason)}${gameState.value.currentDay}日 ${period}${displayHour}:${minute.toString().padStart(2, '0')}`
  }

  const updateNPCSchedules = (totalMinutes: number) => {
    gameState.value.npcs.forEach(npc => {
      if (!npc.schedule || npc.schedule.length === 0) return
      const idx = gameState.value.npcScheduleIndex[npc.id] ?? 0
      const next = npc.schedule[idx]
      if (next && totalMinutes >= next.time) {
        if (npc.location === next.location) {
          // Same location, start moving
          npc.targetX = next.x
          npc.targetY = next.y
          npc.isMoving = true
        } else {
          // Different location, teleport
          npc.location = next.location
          npc.x = next.x
          npc.y = next.y
          npc.isMoving = false
        }
        gameState.value.npcScheduleIndex[npc.id] = idx + 1
      }
    })
  }

  // Spawn daily resources
  const spawnDailyResources = () => {
    // Only spawn on farm for now
    // Logic: check savedMaps['farm'] or current plots if location is farm
    let plots = gameState.value.savedMaps['farm']
    if (gameState.value.location === 'farm') {
        plots = gameState.value.plots
    }

    if (!plots) return

    plots.forEach(row => {
        row.forEach(plot => {
            // 1% chance to spawn debris on empty grass
            if (plot.terrain === 'grass' && !plot.object && !plot.hasCrop && !plot.isTilled) {
                if (Math.random() < 0.01) {
                    const r = Math.random()
                    if (r < 0.5) plot.object = { type: 'weed', id: `weed_${plot.x}_${plot.y}_${Date.now()}`, hp: 1 }
                    else if (r < 0.75) plot.object = { type: 'wood', id: `twig_${plot.x}_${plot.y}_${Date.now()}`, hp: 1 }
                    else plot.object = { type: 'stone', id: `stone_${plot.x}_${plot.y}_${Date.now()}`, hp: 1 }
                }
            }
        })
    })
  }

  // Check for events
  const checkEvents = (triggerType: 'day_start' | 'location_enter' | 'npc_interact', context?: { npcId?: string, location?: string }) => {
    gameState.value.events.forEach(event => {
      if (event.seen && event.type !== 'festival') return // Festivals can repeat yearly? For now assume one-off or reset seen logic elsewhere

      let match = false
      if (event.type === 'festival' && triggerType === 'day_start') {
        if (event.trigger.season === gameState.value.currentSeason && event.trigger.day === gameState.value.currentDay) {
          match = true
        }
      } else if (event.type === 'heart') {
        if (event.trigger.npcId && triggerType === 'npc_interact' && context?.npcId === event.trigger.npcId) {
           const npc = gameState.value.npcs.find(n => n.id === event.trigger.npcId)
           if (npc && npc.relationship >= (event.trigger.relationship || 0)) {
             match = true
           }
        }
        // Location trigger
        if (event.trigger.location && triggerType === 'location_enter' && context?.location === event.trigger.location) {
           // Also check NPC presence or relationship?
           // Simplification: if it has npcId, check relationship
           if (event.trigger.npcId) {
             const npc = gameState.value.npcs.find(n => n.id === event.trigger.npcId)
             if (npc && npc.relationship >= (event.trigger.relationship || 0)) {
               match = true
             }
           } else {
             match = true
           }
        }
      }

      if (match) {
        event.action()
        if (event.type === 'heart') event.seen = true
      }
    })
  }

  // Process new day logic
  // Check if a plot is valid for dropping items/walking (simplified)
  const isValidDropLocation = (x: number, y: number): boolean => {
      // 1. Check bounds
      if (y < 0 || y >= gameState.value.plots.length) return false
      const row = gameState.value.plots[y]
      if (!row || x < 0 || x >= row.length) return false
      const plot = row[x]
      if (!plot) return false

      // 2. Check terrain
      if (plot.terrain === 'water') return false

      // 3. Check objects (stone, wood, fence, etc.)
      if (plot.object) return false // Don't drop inside a stone

      // 4. Check buildings
      const mapConfig = MAPS[gameState.value.location]
      if (mapConfig && mapConfig.buildings) {
          for (const b of mapConfig.buildings) {
               // Check if inside building footprint
               if (x >= b.x && x < b.x + b.width &&
                   y >= b.y && y < b.y + b.height) {
                   return false
               }
          }
      }

      return true
  }

  const processNewDay = () => {
    gameState.value.gameTime = 6 // Wake up at 6:00 AM
    gameState.value.currentDay++

    // Check for season change
    let seasonChanged = false
    if (gameState.value.currentDay > 28) {
      gameState.value.currentDay = 1
      const seasons: ('spring' | 'summer' | 'autumn' | 'winter')[] = ['spring', 'summer', 'autumn', 'winter']
      const currentIndex = seasons.indexOf(gameState.value.currentSeason)
      const nextSeason = seasons[(currentIndex + 1) % 4]

      if (nextSeason === 'spring') {
          gameState.value.currentYear++
          addVisualEffect(gameState.value.player.x, gameState.value.player.y, `第 ${gameState.value.currentYear} 年开始了!`, 0x00FFFF)
      }

      if (nextSeason) {
        gameState.value.currentSeason = nextSeason
        seasonChanged = true
        addVisualEffect(gameState.value.player.x, gameState.value.player.y, `季节变更为 ${getSeasonName(nextSeason)}`, 0x00FFFF)
      }
    }

    // Determine Weather
    const isFestival = gameState.value.events.some(e =>
        e.type === 'festival' &&
        e.trigger.season === gameState.value.currentSeason &&
        e.trigger.day === gameState.value.currentDay
    )

    if (isFestival || gameState.value.currentDay === 1) {
        gameState.value.weather = 'sunny'
    } else {
        const r = Math.random()
        const season = gameState.value.currentSeason

        if (season === 'spring') {
            gameState.value.weather = r < 0.18 ? 'rainy' : 'sunny'
        } else if (season === 'summer') {
            if (r < 0.05) gameState.value.weather = 'storm'
            else if (r < 0.15) gameState.value.weather = 'rainy'
            else gameState.value.weather = 'sunny'
        } else if (season === 'autumn') {
             gameState.value.weather = r < 0.15 ? 'rainy' : 'sunny'
        } else if (season === 'winter') {
             gameState.value.weather = r < 0.2 ? 'snow' : 'sunny'
        }
    }

    // Restore energy
    gameState.value.player.energy = gameState.value.player.maxEnergy

    // Reset NPC schedules and flags
    gameState.value.npcScheduleIndex = {}
    gameState.value.npcs.forEach(npc => {
        npc.talkedToday = false
    })

    // Spawn resources
    spawnDailyResources()

    // Check day start events
    checkEvents('day_start')

    // Update Animals
    gameState.value.animals.forEach(animal => {
        // Reset daily flags
        animal.hasPet = false

        if (animal.isFed) {
            animal.friendship = Math.min(1000, animal.friendship + 5)
            animal.mood = Math.min(255, animal.mood + 10)
        } else {
            animal.friendship = Math.max(0, animal.friendship - 10)
            animal.mood = Math.max(0, animal.mood - 20)
        }

        // Produce
        if (animal.age > 3 && animal.isFed) { // Adult and fed
            animal.produceReady = true
            if (animal.type === 'chicken' || animal.type === 'duck') {
                 const range = 1

                 // Try to find a valid spot around the animal
                 const offsets = []
                 for (let dy = -range; dy <= range; dy++) {
                     for (let dx = -range; dx <= range; dx++) {
                         offsets.push({dx, dy})
                     }
                 }
                 // Simple shuffle to randomize drop location
                 offsets.sort(() => Math.random() - 0.5)

                 for (const offset of offsets) {
                     const tx = Math.round(animal.x) + offset.dx
                     const ty = Math.round(animal.y) + offset.dy

                     if (isValidDropLocation(tx, ty)) {
                         const produceId = animal.type === 'chicken' ? 'egg' : 'duck_egg'
                         dropItem(tx, ty, produceId, 1)
                         break // Only drop one
                     }
                 }
                 animal.produceReady = false // Consumed by dropping (or attempted)
            }
        }

        animal.isFed = false // Reset for next day
        animal.age++
    })

    // Process crops
    gameState.value.plots.forEach(row => {
      row.forEach(plot => {
        // Sprinklers
        if (plot.object && plot.object.type.includes('sprinkler')) {
            let offsets: {dx: number, dy: number}[] = []
            if (plot.object.type === 'sprinkler') {
                offsets = [{dx:0, dy:-1}, {dx:0, dy:1}, {dx:-1, dy:0}, {dx:1, dy:0}]
            } else if (plot.object.type === 'quality_sprinkler') {
                for(let i=-1; i<=1; i++) {
                    for(let j=-1; j<=1; j++) {
                        if (i===0 && j===0) continue
                        offsets.push({dx:i, dy:j})
                    }
                }
            } else if (plot.object.type === 'iridium_sprinkler') {
                for(let i=-2; i<=2; i++) {
                    for(let j=-2; j<=2; j++) {
                        if (i===0 && j===0) continue
                        offsets.push({dx:i, dy:j})
                    }
                }
            }

            offsets.forEach(offset => {
                const targetX = plot.x + offset.dx
                const targetY = plot.y + offset.dy
                const targetPlot = gameState.value.plots[targetY]?.[targetX]
                if (targetPlot && targetPlot.isTilled) {
                    targetPlot.isWatered = true
                    if (targetPlot.crop) targetPlot.crop.isWatered = true
                }
            })
        }

        // Season Change Logic: Wither crops
        if (seasonChanged && plot.hasCrop && plot.crop) {
             const seed = Object.values(ITEMS).find(i => i.type === 'seed' && i.cropType === plot.crop?.type)
             let shouldWither = false

             if (seed && seed.seasons && !seed.seasons.includes(gameState.value.currentSeason)) {
                 shouldWither = true
             } else if (!seed) {
                 // Fallback: Check crop item seasons (for forage/wild seeds)
                 const cropItem = ITEMS[plot.crop.type]
                 if (cropItem && cropItem.seasons && !cropItem.seasons.includes(gameState.value.currentSeason)) {
                     shouldWither = true
                 }
             }

             if (shouldWither) {
                 plot.hasCrop = false
                 plot.crop = undefined
                 // Turn into dead weed/trash
                 plot.object = { type: 'weed', id: `dead_crop_${plot.x}_${plot.y}`, hp: 1 }
             }
        }

        // Grow crops if watered
        if (plot.hasCrop && plot.crop && plot.crop.isWatered) {
          if (plot.crop.growthStage < plot.crop.maxGrowthStage) {
             plot.crop.growthStage++
          }
        }

        // Tree Growth
        if (plot.object && plot.object.type.startsWith('tree_') && plot.object.growthStage !== undefined) {
             // 20% chance to grow each day
             if (plot.object.growthStage < 5 && Math.random() < 0.2) {
                 plot.object.growthStage++
                 // Reconstruct type: tree_{type}_{stage}
                 const treeType = plot.object.treeType || 'oak'
                 plot.object.type = `tree_${treeType}_${plot.object.growthStage}`

                 // Update HP based on stage
                 if (plot.object.growthStage === 5) {
                     plot.object.hp = 10 // Full tree hp
                 } else {
                     plot.object.hp = 1 // Saplings are fragile
                 }
             }
        }

        // Reset water
        plot.isWatered = false
        if (plot.crop) {
            plot.crop.isWatered = false
        }

        // Soil decay (untill)
        if (plot.isTilled && !plot.hasCrop) {
             // 50% chance to revert to normal soil if not watered (or always if dry?)
             // Stardew: Unwatered tilled soil has chance to decay
             if (Math.random() > 0.5) {
                plot.isTilled = false
             }
        }

        // Spawning debris (start of season or daily small chance?)
        // Stardew: Debris spreads. For now, small chance to spawn weed on empty grass
        if (!plot.isTilled && !plot.hasCrop && !plot.object && Math.random() < 0.005) {
            plot.object = { type: 'weed', id: `weed_${plot.x}_${plot.y}`, hp: 1 }
        }
      })
    })

    // Reset NPC daily flags
    gameState.value.npcs.forEach(npc => {
      npc.talkedToday = false
      npc.giftedToday = false
    })

    saveGame() // Auto save on new day
    console.log('New day processed!')
  }

  // Get season name in Chinese
  const getSeasonName = (season: string) => {
    const seasonNames = {
      spring: '春',
      summer: '夏',
      autumn: '秋',
      winter: '冬'
    }
    return seasonNames[season as keyof typeof seasonNames] || '春'
  }

  // Add visual effect
  const addVisualEffect = (x: number, y: number, text: string, color: number) => {
    gameState.value.visualEffects.push({
      id: Date.now() + Math.random(),
      x,
      y,
      text,
      color,
      createdAt: Date.now()
    })
  }

  const addParticle = (x: number, y: number, type: 'leaf' | 'wood' | 'stone' | 'water' | 'note' | 'heart', color?: number, count: number = 5) => {
      gameState.value.particleEvents.push({
          id: Date.now() + Math.random(),
          x,
          y,
          type,
          color,
          count
      })
  }

  // Calculate stamina cost based on tool proficiency
  const calculateStaminaCost = (toolId: string): number => {
    // Base cost
    let cost = 2

    // Check proficiency
    const proficiencyMap: Record<string, keyof typeof gameState.value.player.toolProficiency> = {
        'hoe': 'hoe',
        'pickaxe': 'pickaxe',
        'axe': 'axe',
        'watering': 'watering'
    }

    const profKey = proficiencyMap[toolId]
    if (profKey) {
        const level = gameState.value.player.toolProficiency[profKey]
        // Reduce cost by 0.1 per level
        cost = Math.max(0.1, 2 - (level * 0.1))
    }

    if (toolId === 'scythe') return 0

    return cost
  }

  // Interact with machine
  const interactWithMachine = (x: number, y: number): boolean => {
    const plot = gameState.value.plots[y]?.[x]
    if (!plot || !plot.object) return false

    // 1. Collect Output
    if (plot.object.hasOutput && plot.object.processing) {
        const outputId = plot.object.processing.output
        dropItem(x, y, outputId, 1)
        addVisualEffect(x, y, `+1 ${ITEMS[outputId]?.name || outputId}`, 0xFFFFFF)

        // Reset
        plot.object.hasOutput = false
        plot.object.processing = undefined
        SoundManager.getInstance().play('coin')
        return true
    }

    // 2. Check if busy
    if (plot.object.processing) {
        addVisualEffect(x, y, '工作中...', 0xFFFFFF)
        return true
    }

    // 3. Input Item
    const selectedToolId = gameState.value.selectedTool
    const recipe = MACHINE_RECIPES.find(r =>
        r.machineId === plot.object!.type &&
        r.inputs.some(i => i.itemId === selectedToolId)
    )

    if (recipe) {
        // Check ingredients
        const hasAll = recipe.inputs.every(input => countItem(input.itemId) >= input.quantity)

        if (hasAll) {
            // Consume
            recipe.inputs.forEach(input => removeFromInventory(input.itemId, input.quantity))

            // Start
            plot.object.processing = {
                output: recipe.output.itemId,
                readyAt: gameState.value.gameTime + (recipe.processingTime / 60), // minutes -> hours
                input: selectedToolId
            }

            SoundManager.getInstance().play('furnace')
            addVisualEffect(x, y, '开始工作', 0x00FF00)
            return true
        } else {
             addVisualEffect(x, y, '材料不足', 0xFF0000)
             return true
        }
    }

    return false
  }

  // Fishing State
  const fishingState = ref({
    isFishing: false,
    state: 'idle' as 'idle' | 'casting' | 'waiting' | 'biting' | 'reeling',
    timer: 0,
    // New properties for minigame control
    fishId: '' as string,
    difficulty: 1, // 1-5?
    behavior: 'mixed' as 'mixed' | 'smooth' | 'sinker' | 'floater' | 'dart',
    treasure: false // Is there a treasure chest?
  })

  const stopFishing = () => {
    fishingState.value.isFishing = false
    fishingState.value.state = 'idle'
    gameState.value.player.isUsingTool = false
    fishingState.value.treasure = false
  }

  const catchFish = () => {
    const player = gameState.value.player
    if (fishingState.value.state === 'biting') {
        // Start Minigame
        fishingState.value.state = 'reeling'

        // Determine fish NOW so we can set difficulty
        const fishes = ['sardine', 'smallmouth_bass', 'rainbow_trout', 'pufferfish', 'catfish']
        const index = Math.floor(Math.random() * fishes.length)
        const selectedFish = fishes[index]
        fishingState.value.fishId = selectedFish || 'sardine'

        // Set difficulty based on fish
        if (fishingState.value.fishId === 'pufferfish') {
            fishingState.value.difficulty = 80 // Hard
            fishingState.value.behavior = 'floater'
        } else if (fishingState.value.fishId === 'catfish') {
            fishingState.value.difficulty = 90
            fishingState.value.behavior = 'mixed'
        } else if (fishingState.value.fishId === 'sardine') {
            fishingState.value.difficulty = 30
            fishingState.value.behavior = 'dart'
        } else {
            fishingState.value.difficulty = 40
            fishingState.value.behavior = 'smooth'
        }

        // 15% chance for treasure
        fishingState.value.treasure = Math.random() < 0.15

        addVisualEffect(player.x, player.y, '收杆!', 0xFFFFFF)
        SoundManager.getInstance().play('coin') // Feedback sound
    } else if (fishingState.value.state === 'reeling') {
        // Minigame click handled by component
    } else {
        // Pulled too early or late
        if (fishingState.value.state === 'waiting') {
             addVisualEffect(player.x, player.y, '收杆太早了', 0xFFFFFF)
        }
        stopFishing()
    }
  }

  const completeFishing = (success: boolean, caughtTreasure: boolean = false) => {
    const player = gameState.value.player
    if (success) {
        const caughtId = fishingState.value.fishId
        if (caughtId) {
            const def = ITEMS[caughtId] as ItemDefinition | undefined
            const caughtName = def ? def.name : caughtId

            dropItem(player.x, player.y, caughtId, 1)
            addVisualEffect(player.x, player.y, `钓到了 ${caughtName}!`, 0x00FF00)

            // Treasure
            if (caughtTreasure) {
                // Random loot
                const loots = ['coal', 'iron_ore', 'geode', 'diamond']
                const lootIndex = Math.floor(Math.random() * loots.length)
                const loot = loots[lootIndex] || 'coal'
                dropItem(player.x, player.y, loot, 1)
                addVisualEffect(player.x, player.y, '宝箱!', 0xFFFF00)
            }

            player.experience += 15
            player.toolProficiency.fishing = Math.min(10, player.toolProficiency.fishing + 0.05)
            player.energy -= 8
            SoundManager.getInstance().play('coin')
        }
    } else {
        addVisualEffect(player.x, player.y, '鱼跑了...', 0xCCCCCC)
    }
    stopFishing()
  }

  const startFishing = (x: number, y: number) => {
    // Check if hitting water
    const plot = gameState.value.plots[y]?.[x]
    if (!plot || plot.terrain !== 'water') {
        addVisualEffect(x, y, '只能在水边钓鱼', 0xFFFFFF)
        return
    }

    if (gameState.value.player.energy < 8) {
        addVisualEffect(x, y, '体力不足', 0xFF0000)
        return
    }

    gameState.value.player.isUsingTool = true
    fishingState.value.isFishing = true
    fishingState.value.state = 'casting'
    addVisualEffect(gameState.value.player.x, gameState.value.player.y, '抛竿...', 0xFFFFFF)

    // Casting animation time
    setTimeout(() => {
        if (!fishingState.value.isFishing) return
        fishingState.value.state = 'waiting'
        addVisualEffect(gameState.value.player.x, gameState.value.player.y, '等待...', 0xCCCCCC)

        // Random wait time 2-5 seconds
        const waitTime = 2000 + Math.random() * 3000
        setTimeout(() => {
            if (fishingState.value.isFishing && fishingState.value.state === 'waiting') {
                fishingState.value.state = 'biting'
                addVisualEffect(gameState.value.player.x, gameState.value.player.y, '!', 0xFF0000)
                SoundManager.getInstance().play('splash') // Need splash sound

                // 1 second window to catch
                setTimeout(() => {
                    if (fishingState.value.isFishing && fishingState.value.state === 'biting') {
                        // Missed
                        addVisualEffect(gameState.value.player.x, gameState.value.player.y, '跑掉了...', 0xCCCCCC)
                        stopFishing()
                    }
                }, 1000)
            }
        }, waitTime)
    }, 500)
  }

  // Handle plot interaction
  const handlePlotInteraction = (x: number, y: number) => {
    // Mine Ladders
    const ladderPlot = gameState.value.plots[y]?.[x]
    if (ladderPlot && ladderPlot.object) {
        if (ladderPlot.object.type === 'mine_ladder') {
            enterMineLevel(gameState.value.mineLevel + 1)
            return
        }
        if (ladderPlot.object.type === 'ladder_up') {
            if (gameState.value.mineLevel > 0) {
                 enterMineLevel(gameState.value.mineLevel - 1)
            } else {
                 // Exit mine
                 switchLocation('mountain', 10, 18)
            }
            return
        }
    }

    // 1. Check for NPC interaction
    const npc = gameState.value.npcs.find(n =>
      Math.round(n.x) === x &&
      Math.round(n.y) === y &&
      n.location === gameState.value.location
    )
    if (npc) {
      // Face player
      const player = gameState.value.player
      npc.direction = player.direction === 'up' ? 'down' : player.direction === 'down' ? 'up' : player.direction === 'left' ? 'right' : 'left'
      interactWithNPC(npc.id)
      return
    }

    const attackMonster = (monster: Monster) => {
      const player = gameState.value.player
      const weaponDamage = 2 + player.skills.combat // TODO: Add weapon damage

      monster.hp -= weaponDamage
      addVisualEffect(monster.x, monster.y, `-${weaponDamage}`, 0xFFFFFF)
      SoundManager.getInstance().play('hit')

      // Knockback
      const dx = monster.x - player.x
      const dy = monster.y - player.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 0) {
          monster.x += (dx / dist) * 1.5
          monster.y += (dy / dist) * 1.5
      }
      monster.cooldown = 30 // Stun briefly

      if (monster.hp <= 0) {
          // Loot
          dropItem(monster.x, monster.y, 'slime_gel', 1) // Simplified
          player.experience += 10
          player.skills.combat = Math.min(10, player.skills.combat + 0.1)
          addVisualEffect(monster.x, monster.y, 'Defeated!', 0xFFFF00)

          // Update quests
          updateQuestProgress('slay', monster.type, 1)
      }
  }

  // 1.5 Check for Monster interaction
    if (gameState.value.location === 'mine') {
        const monster = gameState.value.monsters.find(m => Math.round(m.x) === x && Math.round(m.y) === y)
        if (monster) {
            attackMonster(monster)
            return
        }
    }

    // 1.6 Check for Animal interaction
    const animal = gameState.value.animals.find(a =>
      Math.round(a.x) === x &&
      Math.round(a.y) === y &&
      a.location === gameState.value.location
    )
    if (animal) {
        interactWithAnimal(animal.id)
        return
    }

    const plot = gameState.value.plots[y]?.[x]
    if (!plot) return

    // Shipping Bin Interaction
    if (plot.object && plot.object.type === 'shipping_bin') {
        const selectedToolId = gameState.value.selectedTool
        if (selectedToolId && ITEMS[selectedToolId]?.sellPrice) {
             const count = countItem(selectedToolId)
             if (count > 0) {
                 const sellPrice = ITEMS[selectedToolId].sellPrice!
                 // Sell 1 item
                 if (sellItem(selectedToolId, 1)) {
                    addVisualEffect(x, y, `+${sellPrice}G`, 0xFFD700)
                    SoundManager.getInstance().play('coin')
                 }
                 return
             }
        } else {
             addVisualEffect(x, y, '请手持物品出售', 0xFFFFFF)
             return
        }
    }

    // Machine Interaction
    if (plot.object && (plot.object.type.includes('machine') || plot.object.type === 'furnace' || plot.object.type === 'cheese_press' || plot.object.type === 'preserves_jar' || plot.object.type === 'keg' || plot.object.type === 'bee_house' || plot.object.type === 'loom' || plot.object.type === 'oil_maker')) {
        if (interactWithMachine(x, y)) return
    }

    // Chest Interaction
    if (plot.object && plot.object.type === 'chest') {
        if (interactWithChest(x, y)) return
    }

    const tool = gameState.value.selectedTool
    const player = gameState.value.player

    // 2. Check for Harvesting
    if (plot.hasCrop && plot.crop && plot.crop.growthStage >= plot.crop.maxGrowthStage) {
       // Harvest crop logic
       const cropType = plot.crop.type
       const cropName = getCropName(cropType)
       const crop = plot.crop

       // Special Logic: Chance for multiple drops (e.g. blueberries, cranberries, coffee)
       let quantity = 1
       if (cropType === 'blueberry') quantity = 3
       else if (cropType === 'cranberry') quantity = 2
       else if (cropType === 'coffee_bean') quantity = 4
       else if (cropType === 'potato') {
           if (Math.random() < 0.2) quantity = 2 // Chance for extra potato
       }

       dropItem(x, y, cropType, quantity)

       addVisualEffect(x, y, `+${quantity} ${cropName}`, 0xFFA500)
       SoundManager.getInstance().play('harvest') // Assuming harvest sound

       // Regrow Logic
       if (crop.regrowAfterHarvest !== undefined) {
           crop.growthStage = crop.regrowAfterHarvest
           // Keep isWatered? Usually resets water for the day if harvested? Stardew logic: harvest doesn't consume water, but growth happens at night.
           // If I harvest today, it stays watered if I watered it today?
           // Simplest: Don't change isWatered.
       } else {
           // Clear plot
           plot.hasCrop = false
           plot.crop = undefined
       }

       // Grant XP (farming)
       player.experience += 10
       return
    }

    // Set player to using tool
    player.isUsingTool = true
    player.toolAnimationTimer = Date.now()

    // Reset after 300ms
    setTimeout(() => {
      player.isUsingTool = false
    }, 300)

    const staminaCost = calculateStaminaCost(tool)

    switch (tool) {
      case 'hoe':
        // Terrain check
        if (plot.terrain === 'paved' || plot.terrain === 'floor' || plot.terrain === 'water') {
           addVisualEffect(x, y, '无法耕种', 0xFFFFFF)
           return
        }

        SoundManager.getInstance().play('hoe')

        if (plot.object && plot.object.type === 'weed') {
           plot.object = undefined
           addVisualEffect(x, y, '+1 纤维', 0x00FF00)
           dropItem(x, y, 'fiber', 1)
        } else if (!plot.isTilled && !plot.object && player.energy >= staminaCost) {
          plot.isTilled = true
          player.energy -= staminaCost
          // Gain proficiency
          player.toolProficiency.hoe = Math.min(10, player.toolProficiency.hoe + 0.01)
          addParticle(x, y, 'stone', 0x5D4037, 4) // Dirt particles
        }
        break

      case 'pickaxe':
        SoundManager.getInstance().play('pickaxe')
        if (plot.object && (plot.object.type === 'stone' || plot.object.type.endsWith('_node'))) {
          addParticle(x, y, 'stone', 0x888888, 5)
          plot.object.hp -= 1
          if (plot.object.hp <= 0) {
            const objType = plot.object.type
            plot.object = undefined

            // Drop items based on type
            if (objType === 'stone') {
                dropItem(x, y, 'stone', 1)
                addVisualEffect(x, y, '+1 石头', 0xAAAAAA)

                // Chance to find coal
                if (Math.random() < 0.05) {
                    dropItem(x, y, 'coal', 1)
                    addVisualEffect(x, y, '+1 煤炭', 0x333333)
                }
            } else if (objType === 'copper_node') {
                dropItem(x, y, 'copper_ore', Math.floor(Math.random() * 3) + 1)
                dropItem(x, y, 'stone', 1)
                addVisualEffect(x, y, '铜矿石!', 0xB87333)
                player.experience += 5
            } else if (objType === 'iron_node') {
                dropItem(x, y, 'iron_ore', Math.floor(Math.random() * 3) + 1)
                dropItem(x, y, 'stone', 1)
                addVisualEffect(x, y, '铁矿石!', 0xA19D94)
                player.experience += 10
            } else if (objType === 'gold_node') {
                dropItem(x, y, 'gold_ore', Math.floor(Math.random() * 3) + 1)
                dropItem(x, y, 'stone', 1)
                addVisualEffect(x, y, '金矿石!', 0xFFD700)
                player.experience += 15
            } else if (objType === 'iridium_node') {
                dropItem(x, y, 'iridium_ore', Math.floor(Math.random() * 3) + 1)
                dropItem(x, y, 'stone', 1)
                addVisualEffect(x, y, '铱矿石!', 0x9932CC)
                player.experience += 25
            }

            // Mine Ladder Logic
            if (gameState.value.location === 'mine') {
                // 2% chance to spawn ladder
                if (Math.random() < 0.05) { // Increased to 5% for testing
                    plot.object = { type: 'mine_ladder', id: `ladder_${x}_${y}_${Date.now()}`, hp: 999 }
                    SoundManager.getInstance().play('stone_crack') // Or some discovery sound
                    addVisualEffect(x, y, '发现梯子!', 0xFFFFFF)
                }
            }

            // Mining XP
            player.toolProficiency.pickaxe = Math.min(10, player.toolProficiency.pickaxe + 0.02)
          }
          player.energy -= staminaCost
        } else if (plot.isTilled && !plot.hasCrop) {
           plot.isTilled = false
           player.energy -= staminaCost
        }
        break

      case 'axe':
        SoundManager.getInstance().play('axe')
        if (plot.object) {
            const obj = plot.object

            // Handle Trees and Stumps
            if (obj.type.startsWith('tree_')) {
                // If it's a stump
                if (obj.type.endsWith('_stump')) {
                     addParticle(x, y, 'wood', 0xA0522D, 4)
                     obj.hp -= 1
                     if (obj.hp <= 0) {
                         plot.object = undefined
                         dropItem(x, y, 'wood', 4)
                         addVisualEffect(x, y, '+4 木头', 0xA0522D)
                     }
                     player.energy -= staminaCost
                     break
                }

                // Normal Tree Stages
                const stage = obj.growthStage || 5
                addParticle(x, y, 'wood', 0xA0522D, 3)
                if (stage >= 3) addParticle(x, y, 'leaf', 0x228B22, 3)

                obj.hp -= 1

                if (obj.hp <= 0) {
                    if (stage < 5) {
                        // Destroy sapling
                        addParticle(x, y, 'leaf', 0x228B22, 8)
                        plot.object = undefined
                        dropItem(x, y, 'wood', 1)
                        const treeType = obj.treeType || 'oak'
                        const seedId = treeType === 'maple' ? 'maple_seed' : (treeType === 'pine' ? 'pine_cone' : 'acorn')
                        if (Math.random() < 0.5) dropItem(x, y, seedId, 1)
                    } else {
                        // Fell tree -> Convert to stump
                        const treeType = obj.treeType || 'oak'
                        addParticle(x, y, 'leaf', 0x228B22, 20) // Explosion of leaves
                        plot.object = {
                            type: `tree_${treeType}_stump`,
                            id: obj.id,
                            hp: 5,
                            treeType: treeType
                        }
                        dropItem(x, y, 'wood', 12)
                        dropItem(x, y, 'sap', 2)
                        const seedId = treeType === 'maple' ? 'maple_seed' : (treeType === 'pine' ? 'pine_cone' : 'acorn')
                        if (Math.random() < 0.75) dropItem(x, y, seedId, 1)
                        if (Math.random() < 0.75) dropItem(x, y, seedId, 1)

                        addVisualEffect(x, y, '树倒了!', 0xA0522D)
                        player.toolProficiency.axe = Math.min(10, player.toolProficiency.axe + 0.05)
                    }
                }
                player.energy -= staminaCost
                break
            }

            // Other objects
            obj.hp -= 1
            if (obj.hp <= 0) {
                const type = obj.type
                plot.object = undefined
                dropItem(x, y, type, 1)
                addVisualEffect(x, y, `+1 ${ITEMS[type]?.name || type}`, 0xFFFFFF)
                if (type === 'wood') player.toolProficiency.axe = Math.min(10, player.toolProficiency.axe + 0.01)
            }
            player.energy -= staminaCost
        }
        break

      case 'watering':
        // Find tool item to check water level
        const wateringCan = gameState.value.inventory.find(i => i.id === 'watering')
        const currentWater = wateringCan?.data?.water ?? 0
        const maxWater = wateringCan?.data?.maxWater ?? 40

        // Refill if at water source
        if (plot.terrain === 'water') {
            if (wateringCan && wateringCan.data) {
                wateringCan.data.water = maxWater
                SoundManager.getInstance().play('water_refill')
                addVisualEffect(x, y, '已装满水', 0x00BFFF)
                return
            }
        }

        if (currentWater <= 0) {
            addVisualEffect(x, y, '没水了!', 0x888888)
            return
        }

        SoundManager.getInstance().play('water')
        if (plot.isTilled && !plot.isWatered && player.energy >= staminaCost) {
          addParticle(x, y, 'water', 0x00BFFF, 8)
          plot.isWatered = true
          if (plot.hasCrop && plot.crop) {
             plot.crop.isWatered = true
          }
          player.energy -= staminaCost
          player.toolProficiency.watering = Math.min(10, player.toolProficiency.watering + 0.01)

          // Consume water
          if (wateringCan && wateringCan.data && wateringCan.data.water !== undefined) {
              wateringCan.data.water--
          }
        }
        break

      case 'scythe':
        SoundManager.getInstance().play('scythe')
        if (plot.object && plot.object.type === 'weed') {
           plot.object = undefined
           dropItem(x, y, 'fiber', 1)
           addVisualEffect(x, y, '+1 纤维', 0x00FF00)
           player.energy -= staminaCost
        } else if (plot.hasCrop && plot.crop && plot.crop.growthStage >= plot.crop.maxGrowthStage) {
          // Harvest crop (handled above usually, but just in case scythe is needed for some crops like wheat)
          const cropType = plot.crop.type
          const cropName = getCropName(cropType)
          dropItem(x, y, cropType, 1)
          addVisualEffect(x, y, `+1 ${cropName}`, 0xFFA500)
          plot.hasCrop = false
          plot.crop = undefined
        }
        break

      case 'fishing_rod':
        if (fishingState.value.isFishing) {
            catchFish()
        } else {
            startFishing(x, y)
        }
        break

      default:
        // Check if selected tool is a seed
        const itemDef = ITEMS[tool]
        if (itemDef && itemDef.type === 'seed') {
           plantSeed(x, y, tool)
        }
        // Check if it's a placeable item
        else if (ITEMS[tool]?.type === 'misc' || ['chest', 'furnace', 'scarecrow', 'torch'].includes(tool) || tool.includes('fence') || tool.includes('sprinkler') || tool.includes('machine') || tool.includes('press') || tool.includes('jar') || tool.includes('keg') || tool.includes('house')) {
            placeObject(x, y, tool)
        }
        break
    }
  }

  // Chest State
  const chestState = ref({
      isOpen: false,
      items: [] as InventoryItem[], // Items in chest
      chestId: '' // Unique ID of the chest object to save back
  })

  const openChest = (chestId: string, chestItems: InventoryItem[]) => {
      chestState.value = {
          isOpen: true,
          items: chestItems,
          chestId
      }
      isMenuOpen.value = true
  }

  const closeChest = () => {
      // Save items back to plot object
      // We need to find where the chest is.
      // Ideally, the chest object in the plot should hold the items.
      // But our PlotObject interface only has 'hp', 'type', 'id'.
      // We need to extend PlotObject or store chest data in a separate map `chestData`.

      // Let's assume we store it in a new map for now to avoid breaking PlotObject type too much or cast it.
      // Or we can just update the `chestData` map.
      if (chestState.value.chestId) {
          gameState.value.chestData[chestState.value.chestId] = [...chestState.value.items]
      }

      chestState.value.isOpen = false
      isMenuOpen.value = false
  }

  // Interact with chest
  const interactWithChest = (x: number, y: number): boolean => {
      const plot = gameState.value.plots[y]?.[x]
      if (!plot || !plot.object || plot.object.type !== 'chest') return false

      const chestId = plot.object.id

      // Load items
      const items = gameState.value.chestData[chestId] || []
      openChest(chestId, items)

      SoundManager.getInstance().play('door') // Chest open sound
      return true
  }

  // Transfer item
  const transferToChest = (inventoryIndex: number) => {
      if (!chestState.value.isOpen) return

      const item = gameState.value.inventory[inventoryIndex]
      if (!item) return

      // Move to chest
      // Check stack
      const existing = chestState.value.items.find(i => i.id === item.id)
      if (existing) {
          existing.quantity += item.quantity
      } else {
          chestState.value.items.push({ ...item })
      }

      // Remove from inventory
      gameState.value.inventory.splice(inventoryIndex, 1)
      SoundManager.getInstance().play('coin')
  }

  const transferToInventory = (chestIndex: number) => {
      if (!chestState.value.isOpen) return

      const item = chestState.value.items[chestIndex]
      if (!item) return

      // Move to inventory
      // Check stack
      const existing = gameState.value.inventory.find(i => i.id === item.id)
      if (existing) {
          existing.quantity += item.quantity
      } else {
          gameState.value.inventory.push({ ...item })
      }

      // Remove from chest
      chestState.value.items.splice(chestIndex, 1)
      SoundManager.getInstance().play('coin')
  }

  // Plant seed
  const plantSeed = (x: number, y: number, itemId: string) => {
    const plot = gameState.value.plots[y]?.[x]
    if (!plot) return false

    // Tree Seeds Logic
    if (['acorn', 'maple_seed', 'pine_cone'].includes(itemId)) {
        if (plot.object || plot.hasCrop || plot.terrain === 'water') return false
        // Trees can grow on untilled soil

        const seedItem = gameState.value.inventory.find(item => item.id === itemId)
        if (!seedItem || seedItem.quantity <= 0) return false

        let treeType = 'oak'
        if (itemId === 'maple_seed') treeType = 'maple'
        if (itemId === 'pine_cone') treeType = 'pine'

        plot.object = {
            type: `tree_${treeType}_1`,
            id: `tree_${x}_${y}_${Date.now()}`,
            hp: 1,
            growthStage: 1,
            treeType: treeType
        }

        seedItem.quantity -= 1
        if (seedItem.quantity <= 0) {
            const index = gameState.value.inventory.indexOf(seedItem)
            gameState.value.inventory.splice(index, 1)
        }

        console.log(`Planted tree seed ${itemId} at (${x}, ${y})`)
        return true
    }

    // Regular Crops Logic
    if (!plot.isTilled || plot.hasCrop) return false

    const seedItem = gameState.value.inventory.find(item => item.id === itemId)
    if (!seedItem || seedItem.quantity <= 0) return false

    // Look up seed definition
    const seedDef = ITEMS[itemId]
    if (!seedDef || !seedDef.cropType) return false

    // Season Check
    if (seedDef.seasons && !seedDef.seasons.includes(gameState.value.currentSeason)) {
        // Allow greenhouse if we had one, but for now strict check
        addVisualEffect(x, y, '季节不对', 0xFF0000)
        return false
    }

    let cropType = seedDef.cropType || 'parsnip'

    // Handle Mixed Seeds
    if (itemId === 'mixed_seeds') {
        // Pick random crop for current season
        const season = gameState.value.currentSeason
        const possibleCrops = Object.values(ITEMS).filter(i =>
            i.type === 'seed' &&
            i.seasons?.includes(season) &&
            i.id !== 'mixed_seeds' &&
            !i.id.includes('wild') && // Exclude wild seeds
            i.cropType !== 'ancient_fruit' && // Exclude ancient
            i.cropType !== 'sweet_gem_berry' // Exclude rare
        )
        if (possibleCrops.length > 0) {
            const randomSeed = possibleCrops[Math.floor(Math.random() * possibleCrops.length)]
            if (randomSeed) {
                cropType = randomSeed.cropType || 'parsnip'
            }
        } else {
            cropType = 'parsnip' // Fallback
        }
    }
    // Handle Wild Seeds
    else if (itemId === 'winter_seeds') {
        const forage = ['winter_root', 'crystal_fruit', 'snow_yam', 'crocus']
        cropType = forage[Math.floor(Math.random() * forage.length)] || 'winter_root'
    }
    else if (itemId === 'spring_seeds') {
        const forage = ['wild_horseradish', 'daffodil', 'leek', 'dandelion']
        cropType = forage[Math.floor(Math.random() * forage.length)] || 'wild_horseradish'
    }
    else if (itemId === 'summer_seeds') {
        const forage = ['spice_berry', 'grape', 'sweet_pea']
        cropType = forage[Math.floor(Math.random() * forage.length)] || 'spice_berry'
    }
    else if (itemId === 'fall_seeds') {
        const forage = ['common_mushroom', 'wild_plum', 'hazelnut', 'blackberry']
        cropType = forage[Math.floor(Math.random() * forage.length)] || 'common_mushroom'
    }

    // Plant the seed
    plot.hasCrop = true
    plot.crop = {
      id: `${cropType}_${x}_${y}_${Date.now()}`,
      type: cropType,
      growthStage: 0,
      maxGrowthStage: seedDef.growthStages || 4,
      regrowAfterHarvest: seedDef.regrowAfterHarvest, // Copy regrow info
      plantedAt: Date.now(),
      isWatered: false
    }

    // Consume seed
    seedItem.quantity -= 1
    if (seedItem.quantity <= 0) {
      const index = gameState.value.inventory.indexOf(seedItem)
      gameState.value.inventory.splice(index, 1)
    }

    console.log(`Planted ${itemId} (as ${cropType}) at (${x}, ${y})`)
    return true
  }

  // Place object
  const placeObject = (x: number, y: number, itemId: string) => {
    const plot = gameState.value.plots[y]?.[x]
    if (!plot) return false

    // Special Case: Tapper
    if (itemId === 'tapper' && plot.object && plot.object.type.startsWith('tree_') && !plot.object.type.endsWith('_tapped')) {
       // Apply tapper
       const treeType = plot.object.type
       plot.object.type = `${treeType}_tapped`
       removeFromInventory(itemId, 1)
       SoundManager.getInstance().play('axe') // Use axe sound for attachment
       return true
    }

    // Special Case: Crab Pot
    if (itemId === 'crab_pot') {
        if (plot.terrain !== 'water' || plot.object) {
            addVisualEffect(x, y, '只能放在水里', 0xFFFFFF)
            return false
        }
        // Place crab pot
        plot.object = {
            type: 'crab_pot',
            id: `crab_pot_${x}_${y}_${Date.now()}`,
            hp: 5
        }
        removeFromInventory(itemId, 1)
        SoundManager.getInstance().play('splash')
        return true
    }

    // Cannot place on water or existing object/crop
    if (plot.terrain === 'water' || plot.object || plot.hasCrop) {
        return false
    }

    const item = gameState.value.inventory.find(i => i.id === itemId)
    if (!item || item.quantity <= 0) return false

    // Define HP/Properties
    let hp = 1
    if (itemId.includes('fence')) hp = 20
    else if (itemId === 'chest') hp = 10
    else if (itemId === 'scarecrow') hp = 10

    // Place it
    plot.object = {
        type: itemId,
        id: `${itemId}_${x}_${y}_${Date.now()}`,
        hp
    }

    // Consume item
    removeFromInventory(itemId, 1)

    // SoundManager.getInstance().play('thud') // Need to add sound
    return true
  }

  // Get crop name
  const getCropName = (cropType: string) => {
    return ITEMS[cropType]?.name || '作物'
  }

  // Set selected tool
  // const setSelectedTool = (toolId: string) => {
  //   gameState.value.selectedTool = toolId
  // }

  // Set player sprite (for PixiJS)
  const setPlayerSprite = (sprite: unknown) => {
    // Store reference to player sprite for later use
    console.log('Player sprite set:', sprite)
  }

  // Sell item
  const sellItem = (itemId: string, quantity: number) => {
    const item = gameState.value.inventory.find(item => item.id === itemId)
    if (!item || item.quantity < quantity) return false

    const itemDef = ITEMS[itemId]
    const price = itemDef?.sellPrice || 0
    const totalPrice = price * quantity

    gameState.value.player.gold += totalPrice
    item.quantity -= quantity

    if (item.quantity <= 0) {
      const index = gameState.value.inventory.indexOf(item)
      gameState.value.inventory.splice(index, 1)
    }

    console.log(`Sold ${quantity} ${itemId} for ${totalPrice} gold`)
    return true
  }

  // Buy item
  const buyItem = (itemId: string, quantity: number, price: number) => {
    if (gameState.value.player.gold < price * quantity) return false

    const existingItem = gameState.value.inventory.find(item => item.id === itemId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const itemDef = ITEMS[itemId]
      if (itemDef) {
         gameState.value.inventory.push({
           id: itemId,
           name: itemDef.name,
           type: itemDef.type,
           quantity,
           icon: itemDef.icon,
           description: itemDef.description
         })
      } else {
        // Fallback (should not happen if ITEMS is complete)
        gameState.value.inventory.push({
          id: itemId,
          name: 'Unknown Item',
          type: 'item',
          quantity,
          icon: '📦'
        })
      }
    }

    gameState.value.player.gold -= price * quantity
    console.log(`Bought ${quantity} ${itemId} for ${price * quantity} gold`)
    return true
  }

  // Eat food
  const eatFood = (itemId: string) => {
    const item = gameState.value.inventory.find(item => item.id === itemId)
    if (!item || item.quantity <= 0) return false

    const itemDef = ITEMS[itemId]
    if (!itemDef || !itemDef.canEat) return false

    // Consume item
    item.quantity -= 1
    if (item.quantity <= 0) {
      const index = gameState.value.inventory.indexOf(item)
      gameState.value.inventory.splice(index, 1)
    }

    // Restore energy
    const energy = itemDef.energy || 0
    restoreEnergy(energy)
    addVisualEffect(gameState.value.player.x, gameState.value.player.y, `+${energy} 体力`, 0x00FF00)

    // Play sound (visual only for now)
    console.log(`Ate ${itemDef.name}, restored ${energy} energy`)
    return true
  }

  // Restore energy
  const restoreEnergy = (amount: number) => {
    gameState.value.player.energy = Math.min(
      gameState.value.player.energy + amount,
      gameState.value.player.maxEnergy
    )
  }

  // Save game
  const saveGame = () => {
    const saveData = {
      gameState: gameState.value,
      timestamp: Date.now()
    }
    localStorage.setItem('stardew-game-save', JSON.stringify(saveData))
    console.log('Game saved!')
  }

  // Load game
  const loadGame = () => {
    const saveData = localStorage.getItem('stardew-game-save')
    if (saveData) {
      try {
        const parsed = JSON.parse(saveData)
        stopGameLoop()
        gameState.value = parsed.gameState
        lastTeleportTile = null
        startGameLoop()
        console.log('Game loaded!')
        return true
      } catch (error) {
        console.error('Failed to load game:', error)
        return false
      }
    }
    return false
  }

  const updatePlayerPosition = (x: number, y: number, direction: 'up' | 'down' | 'left' | 'right', isMoving: boolean) => {
    gameState.value.player.x = x
    gameState.value.player.y = y
    gameState.value.player.direction = direction
    gameState.value.player.isMoving = isMoving

    // Check teleports
    const mapConfig = MAPS[gameState.value.location]
    if (mapConfig && mapConfig.teleports) {
      // x and y are grid coordinates
      const teleport = mapConfig.teleports.find(t => t.x === x && t.y === y)
      const now = Date.now()
      const stillOnLastTile = lastTeleportTile && lastTeleportTile.map === gameState.value.location && lastTeleportTile.x === x && lastTeleportTile.y === y
      if (teleport && !stillOnLastTile && now - lastTeleportTime > TELEPORT_COOLDOWN_MS) {
        switchLocation(teleport.targetMap, teleport.targetX, teleport.targetY)
      }
      if (lastTeleportTile && (lastTeleportTile.map !== gameState.value.location || lastTeleportTile.x !== x || lastTeleportTile.y !== y)) {
        lastTeleportTile = null
      }
    }
  }

  const processRegularTalk = (npc: NPC) => {
    // Cycle through dialogues
    const text = npc.dialogues[npc.currentDialogueIndex]
    if (!text) return

    npc.currentDialogueIndex = (npc.currentDialogueIndex + 1) % npc.dialogues.length

    // Increase relationship
    if (!npc.talkedToday) {
      npc.talkedToday = true
      npc.relationship += 20 // +20 points for first talk of the day
      addVisualEffect(npc.x, npc.y, '❤', 0xFF0000)
    }

    // Open dialogue box
    openDialogue(npc.name, text, '#' + npc.spriteColor.toString(16))
    SoundManager.getInstance().play('dialogue')

    // Check for heart events triggered by interaction
    checkEvents('npc_interact', { npcId: npc.id })

    console.log(`Interacted with ${npc.name}, relationship: ${npc.relationship}`)
  }

  const talkToNPC = (npc: NPC) => {
    // Shop definitions
    const shops: Record<string, { location: string, items: { id: string, price: number }[] }> = {
        'pierre': {
            location: 'store',
            items: [
                { id: 'parsnip_seed', price: 20 },
                { id: 'bean_starter', price: 60 },
                { id: 'cauliflower_seed', price: 80 },
                { id: 'potato_seed', price: 50 },
                { id: 'tulip_bulb', price: 20 },
                { id: 'kale_seed', price: 70 },
                { id: 'basic_fertilizer', price: 100 },
                { id: 'sugar', price: 100 },
                { id: 'flour', price: 100 },
                { id: 'rice', price: 200 },
                { id: 'oil', price: 200 },
                { id: 'vinegar', price: 200 }
            ]
        },
        'gus': {
            location: 'saloon',
            items: [
                { id: 'beer', price: 400 },
                { id: 'salad', price: 220 },
                { id: 'bread', price: 120 },
                { id: 'spaghetti', price: 240 },
                { id: 'pizza', price: 600 },
                { id: 'coffee', price: 300 }
            ]
        },
        'clint': {
            location: 'blacksmith',
            items: [
                { id: 'copper_ore', price: 75 },
                { id: 'iron_ore', price: 150 },
                { id: 'coal', price: 150 },
                { id: 'gold_ore', price: 400 }
            ]
        },
        'robin': {
            location: 'carpenter',
            items: [
                { id: 'wood', price: 10 },
                { id: 'stone', price: 20 },
                { id: 'furniture', price: 500 } // Placeholder for furniture catalog or specific items
            ]
        },
        'marnie': {
            location: 'ranch',
            items: [
                { id: 'hay', price: 50 }
            ]
        },
        'willy': {
            location: 'fish_shop',
            items: [
                { id: 'fishing_rod', price: 500 },
                { id: 'trout_soup', price: 250 },
                { id: 'bait', price: 5 }
            ]
        }
    }

    const shop = shops[npc.id]
    // Check if NPC is in their shop location
    // Note: npc.location should match shop.location
    if (shop && npc.location === shop.location) {
        openDialogue(npc.name, '有什么需要的吗？', '#' + npc.spriteColor.toString(16), [
            {
                text: '购买补给',
                action: () => {
                    closeDialogue()
                    openShop(shop.items)
                }
            },
            {
                text: '交谈',
                action: () => {
                    closeDialogue()
                    processRegularTalk(npc)
                }
            },
            {
                text: '离开',
                action: () => closeDialogue()
            }
        ])
        return
    }

    processRegularTalk(npc)
  }

  const giveGift = (npc: NPC, itemId: string, itemName: string) => {
     removeFromInventory(itemId, 1)
     npc.giftedToday = true

     // Update quests
     updateQuestProgress('delivery', itemId, 1, { recipientId: npc.id })

     let points = 20
     let sentiment = 'neutral'

     // Check preferences
     if (npc.loves?.includes(itemId)) {
         points = 80
         sentiment = 'love'
     } else if (npc.likes?.includes(itemId)) {
         points = 45
         sentiment = 'like'
     } else if (npc.dislikes?.includes(itemId)) {
         points = -20
         sentiment = 'dislike'
     } else if (npc.hates?.includes(itemId)) {
         points = -40
         sentiment = 'hate'
     } else {
         // Universal Checks (Simplified)
         const universalLoves = ['rabbit_foot', 'prismatic_shard']
         const universalLikes = ['diamond', 'coffee', 'wine', 'beer', 'cheese', 'goat_cheese', 'cloth', 'mayonnaise', 'duck_mayonnaise', 'jelly', 'pickles', 'maple_syrup', 'truffle_oil']
         const universalDislikes = ['clay', 'quartz', 'stone', 'wood', 'fiber', 'sap']
         const universalHates = ['trash', 'broken_glasses', 'soggy_newspaper', 'bat_wing', 'slime', 'bug_meat']

         const flowers = ['tulip', 'blue_jazz', 'poppy', 'summer_spangle', 'fairy_rose', 'sunflower', 'daffodil', 'sweet_pea', 'crocus', 'holly']

         if (universalLoves.includes(itemId)) {
             points = 80
             sentiment = 'love'
         } else if (universalLikes.includes(itemId) || ITEMS[itemId]?.type === 'food' || flowers.includes(itemId)) {
             points = 45
             sentiment = 'like'
         } else if (universalDislikes.includes(itemId) || ITEMS[itemId]?.type === 'resource') {
             points = -20
             sentiment = 'dislike'
         } else if (universalHates.includes(itemId) || ITEMS[itemId]?.type === 'trash') {
             points = -40
             sentiment = 'hate'
         }
     }

     npc.relationship = Math.max(0, Math.min(2500, npc.relationship + points))

     // Feedback
     let dialogueText = ''
     let emoji = ''
     let color = 0xFFFFFF

     switch (sentiment) {
         case 'love':
             dialogueText = `哦！是 ${itemName}！这是我最喜欢的东西！太谢谢你了！`
             emoji = '❤️'
             color = 0xFF0000 // Red
             break
         case 'like':
             dialogueText = `这是送给我的？谢谢！我很喜欢。`
             emoji = '😊'
             color = 0xFF69B4 // Pink
             break
         case 'dislike':
             dialogueText = `额...谢谢...我想。`
             emoji = '😒'
             color = 0xCCCCCC // Grey
             break
         case 'hate':
             dialogueText = `这是什么？太恶心了！我不想要这个。`
             emoji = '😡'
             color = 0x000000 // Black
             SoundManager.getInstance().play('trash') // Assuming trash sound exists or fallback
             break
         default:
             dialogueText = `谢谢你的礼物。`
             emoji = '🙂'
             color = 0xFFFFFF // White
             break
     }

     if (sentiment === 'love' || sentiment === 'like') {
        SoundManager.getInstance().play('achievement') // Happy sound
     }

     addVisualEffect(npc.x, npc.y, emoji, color)
     openDialogue(npc.name, dialogueText, '#' + npc.spriteColor.toString(16))
  }

  const interactWithNPC = (npcId: string) => {
    const npc = gameState.value.npcs.find(n => n.id === npcId)
    if (!npc) return

    // Check for Gifting
    const selectedToolId = gameState.value.selectedTool
    // Tools that cannot be gifted
    const tools = ['hoe', 'pickaxe', 'axe', 'watering_can', 'scythe']

    if (selectedToolId && !tools.includes(selectedToolId)) {
       const itemDef = ITEMS[selectedToolId]
       const invItem = gameState.value.inventory.find(i => i.id === selectedToolId)

       if (itemDef && invItem) {
         if (!npc.giftedToday) {
            // Immediate gift (Stardew style)
            giveGift(npc, selectedToolId, itemDef.name)
            return
         } else {
             openDialogue(npc.name, '你今天已经送过我礼物了。', '#' + npc.spriteColor.toString(16))
             return
         }
       }
    }

    talkToNPC(npc)
  }

  const sleep = () => {
    closeDialogue()
    saveGame()
    processNewDay()
    addVisualEffect(gameState.value.player.x, gameState.value.player.y, 'ZZZ...', 0xFFFFFF)
    // SoundManager.getInstance().play('sleep')
  }

  const eatItem = (itemId: string) => {
    const item = gameState.value.inventory.find(i => i.id === itemId)
    const itemDef = ITEMS[itemId]

    if (item && itemDef && itemDef.canEat && itemDef.energy) {
       // Consume
       removeFromInventory(itemId, 1)

       // Restore energy
       const energyGain = itemDef.energy
       gameState.value.player.energy = Math.min(gameState.value.player.maxEnergy, gameState.value.player.energy + energyGain)

       // Visual
       addVisualEffect(gameState.value.player.x, gameState.value.player.y, `+${energyGain}E`, 0x00FF00)
       SoundManager.getInstance().play('eat') // Assuming 'eat' sound exists or will be ignored

       console.log(`Ate ${itemDef.name}, gained ${energyGain} energy`)
    }
  }

  const interact = () => {
    const { x, y, direction } = gameState.value.player
    let targetX = x
    let targetY = y

    // Determine target tile based on direction
    switch (direction) {
      case 'up': targetY -= 1; break
      case 'down': targetY += 1; break
      case 'left': targetX -= 1; break
      case 'right': targetX += 1; break
    }

    // 1. Check for NPC
    const npc = gameState.value.npcs.find(n =>
      n.location === gameState.value.location &&
      Math.round(n.x) === targetX &&
      Math.round(n.y) === targetY
    )

    if (npc) {
      // Face player
      npc.direction = direction === 'up' ? 'down' : direction === 'down' ? 'up' : direction === 'left' ? 'right' : 'left'
      interactWithNPC(npc.id)
      return
    }

    // 2. Check for Objects in Plots
    if (targetY >= 0 && targetY < gameState.value.plots.length) {
      const row = gameState.value.plots[targetY]
      if (row && targetX >= 0 && targetX < row.length) {
        const plot = row[targetX]
        if (plot && plot.object) {
          if (plot.object.type.startsWith('bed')) {
              openDialogue('系统', '是否要睡觉？', '#000000', [
                { text: '是', action: () => sleep() },
                { text: '否', action: () => closeDialogue() }
              ])
              return
          } else if (plot.object.type === 'mine_ladder' || plot.object.type === 'ladder') {
              // Descend ladder
              if (gameState.value.location === 'mine') {
                  gameState.value.mineLevel += 1
                  addVisualEffect(x, y, `下到第 ${gameState.value.mineLevel} 层`, 0xFFFFFF)

                  // Regenerate mine map
                  // Force regeneration by clearing saved map for 'mine'
                  delete gameState.value.savedMaps['mine']
                  initializePlots('mine')

                  // Move player to entrance (usually safe spot)
                  // For 'mine' map, entrance is (10, 10) but that's where we came from?
                  // Wait, 'mine' map entrance from mountain is defined in teleports.
                  // But we are staying in 'mine' map, just regenerating it.
                  // Let's keep player at current position but ensure it's clear?
                  // Or move to a default start position.
                  // In maps.ts, mine entrance is (10, 10) for exiting, so maybe (10, 10) is a safe start.
                  gameState.value.player.x = 10
                  gameState.value.player.y = 10

                  SoundManager.getInstance().play('stairs')
                  return
              }
          }
        }
      }
    }

    // 3. Check for Eating (if no other interaction)
    const selectedToolId = gameState.value.selectedTool
    if (selectedToolId) {
      const itemDef = ITEMS[selectedToolId]
      if (itemDef && itemDef.canEat) {
         openDialogue('系统', `要吃下 ${itemDef.name} 吗？`, '#000000', [
             { text: '是', action: () => {
                 eatItem(selectedToolId)
                 closeDialogue()
             }},
             { text: '否', action: () => closeDialogue() }
         ])
      }
    }
  }

  return {
    // State
    gameState,
    currentTime,
    playerGold,
    playerEnergy,
    isExhausted,
    selectedTool,

    // Methods
    initializeGame,
    startGameLoop,
    updatePlayerPosition,
    switchLocation,
    handlePlotInteraction,
    interactWithNPC, // Export this
    interact,
    plantSeed,
    setSelectedTool,
    setPlayerSprite,
    // update, // REMOVED
    sellItem,
    buyItem,
    eatFood,
    restoreEnergy,
    saveGame,
    loadGame,
    dialogueState,
    openDialogue,
    closeDialogue,
    isMenuOpen,
    isQuestLogOpen,
    shopState,
    openShop,
    closeShop,
    stopGameLoop,

    // Dropped Items
    dropItem,
    collectItem,
    checkMagneticPickup,

    hoveredTarget,
    ITEMS,

    // Crafting
    craftingRecipes,
    craftItem,
    canCraft,
    addToInventory,
    removeFromInventory,
    countItem,
    calculateStaminaCost,
    processNewDay,
    checkEvents,

    // Fishing
    fishingState,
    stopFishing,
    catchFish,
    completeFishing,

    // Chests
    chestState,
    openChest,
    closeChest,
    transferToChest,
    transferToInventory,

    // Quests
    addQuest,
    updateQuestProgress,

    // Monsters
    spawnMonsters,
    updateMonsters,
    damageMonster,
    playerAttack,
    spawnDroppedItem,
    addParticle
  }
})
