import type { NPC } from '@/data/npcs'
import type { Building } from '@/data/maps'
import type { GameEvent } from '@/data/events'

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
  friendships: Record<string, number>
  giftsGiven: Record<string, { count: number, lastGiftDate: number }>
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
  id: string
  definitionId: string
  x: number
  y: number
  rotation: number
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
      readyAt: number
      input: string
    }
    hasOutput?: boolean
  }
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
    quality?: number
  }
}

export interface DroppedItem {
  id: string
  itemId: string
  quantity: number
  x: number
  y: number
  targetX?: number
  targetY?: number
  isBeingCollected?: boolean
  createdAt: number
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

export interface FishingState {
  state: 'idle' | 'casting' | 'waiting' | 'bite' | 'reeling' | 'caught' | 'lost' | 'biting'
  fishId?: string
  treasure?: boolean
  startTime?: number
  difficulty?: number
  behavior?: 'mixed' | 'smooth' | 'sinker' | 'floater' | 'dart'
  timer?: number
  barPosition: number
  barHeight: number
  barVelocity: number
  fishPosition: number
  fishTargetPosition: number
  fishMoveTimer: number
  progress: number
  isHolding: boolean
  treasurePosition: number
  treasureProgress: number
  treasureCollected: boolean
}

export interface GameState {
  currentDay: number
  currentSeason: 'spring' | 'summer' | 'autumn' | 'winter'
  currentYear: number
  currentTime: string
  gameTime: number
  totalPlayTime: number
  location: string
  mineLevel: number
  mineProgress: number
  selectedTool: string
  player: Player
  plots: Plot[][]
  savedMaps: Record<string, Plot[][]>
  buildings: Record<string, Building[]>
  furniture: Record<string, FurnitureInstance[]>
  inventory: InventoryItem[]
  droppedItems: DroppedItem[]
  npcs: NPC[]
  animals: Animal[]
  monsters: Monster[]
  chestData: Record<string, InventoryItem[]>
  weather: 'sunny' | 'rainy' | 'cloudy' | 'storm' | 'snow' | 'windy'
  visualEffects: VisualEffect[]
  particleEvents: ParticleEvent[]
  npcScheduleIndex: Record<string, number>
  fishingState: FishingState
  events: GameEvent[]
  quests: Quest[]
  activeCutscene?: {
    eventId: string
    stepIndex: number
    timer: number
    waitingForInput: boolean
  }
}
