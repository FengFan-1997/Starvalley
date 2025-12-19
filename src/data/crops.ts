export interface CropDefinition {
  id: string
  name: string
  seedId: string
  harvestItemId: string
  seasons: ('spring' | 'summer' | 'autumn' | 'winter')[]
  growthStages: number // Total days to mature
  regrow?: number // Days to regrow after harvest. 0 or undefined means single harvest.
  extraYieldChance?: number // Chance to get extra items
  minHarvest?: number
  maxHarvest?: number
  scythe?: boolean // Requires scythe to harvest?
  trellis?: boolean // Cannot walk through?
}

export const CROPS: Record<string, CropDefinition> = {
  // --- Spring Crops ---
  parsnip: {
    id: 'parsnip',
    name: '防风草',
    seedId: 'parsnip_seeds',
    harvestItemId: 'parsnip',
    seasons: ['spring'],
    growthStages: 4,
    minHarvest: 1,
    maxHarvest: 1
  },
  garlic: {
    id: 'garlic',
    name: '大蒜',
    seedId: 'garlic_seeds',
    harvestItemId: 'garlic',
    seasons: ['spring'],
    growthStages: 4,
    minHarvest: 1,
    maxHarvest: 1
  },
  bean: {
    id: 'bean',
    name: '青豆',
    seedId: 'bean_starter',
    harvestItemId: 'green_bean',
    seasons: ['spring'],
    growthStages: 10,
    regrow: 3,
    trellis: true,
    minHarvest: 1,
    maxHarvest: 1
  },
  cauliflower: {
    id: 'cauliflower',
    name: '花椰菜',
    seedId: 'cauliflower_seeds',
    harvestItemId: 'cauliflower',
    seasons: ['spring'],
    growthStages: 12,
    minHarvest: 1,
    maxHarvest: 1
  },
  potato: {
    id: 'potato',
    name: '土豆',
    seedId: 'potato_seeds',
    harvestItemId: 'potato',
    seasons: ['spring'],
    growthStages: 6,
    extraYieldChance: 0.2,
    minHarvest: 1,
    maxHarvest: 1
  },
  kale: {
    id: 'kale',
    name: '甘蓝',
    seedId: 'kale_seeds',
    harvestItemId: 'kale',
    seasons: ['spring'],
    growthStages: 6,
    scythe: true,
    minHarvest: 1,
    maxHarvest: 1
  },
  strawberry: {
    id: 'strawberry',
    name: '草莓',
    seedId: 'strawberry_seeds',
    harvestItemId: 'strawberry',
    seasons: ['spring'],
    growthStages: 8,
    regrow: 4,
    extraYieldChance: 0.02,
    minHarvest: 1,
    maxHarvest: 1
  },
  tulip: {
    id: 'tulip',
    name: '郁金香',
    seedId: 'tulip_bulb',
    harvestItemId: 'tulip',
    seasons: ['spring'],
    growthStages: 6,
    minHarvest: 1,
    maxHarvest: 1
  },

  // --- Summer Crops ---
  melon: {
    id: 'melon',
    name: '甜瓜',
    seedId: 'melon_seeds',
    harvestItemId: 'melon',
    seasons: ['summer'],
    growthStages: 12,
    minHarvest: 1,
    maxHarvest: 1
  },
  tomato: {
    id: 'tomato',
    name: '番茄',
    seedId: 'tomato_seeds',
    harvestItemId: 'tomato',
    seasons: ['summer'],
    growthStages: 11,
    regrow: 4,
    minHarvest: 1,
    maxHarvest: 1
  },
  blueberry: {
    id: 'blueberry',
    name: '蓝莓',
    seedId: 'blueberry_seeds',
    harvestItemId: 'blueberry',
    seasons: ['summer'],
    growthStages: 13,
    regrow: 4,
    minHarvest: 3,
    maxHarvest: 3
  },
  hot_pepper: {
    id: 'hot_pepper',
    name: '辣椒',
    seedId: 'hot_pepper_seeds',
    harvestItemId: 'hot_pepper',
    seasons: ['summer'],
    growthStages: 5,
    regrow: 3,
    minHarvest: 1,
    maxHarvest: 1
  },
  wheat: {
    id: 'wheat',
    name: '小麦',
    seedId: 'wheat_seeds',
    harvestItemId: 'wheat',
    seasons: ['summer', 'autumn'],
    growthStages: 4,
    scythe: true,
    minHarvest: 1,
    maxHarvest: 1
  },
  corn: {
    id: 'corn',
    name: '玉米',
    seedId: 'corn_seeds',
    harvestItemId: 'corn',
    seasons: ['summer', 'autumn'],
    growthStages: 14,
    regrow: 4,
    minHarvest: 1,
    maxHarvest: 1
  },

  // --- Fall Crops ---
  pumpkin: {
    id: 'pumpkin',
    name: '南瓜',
    seedId: 'pumpkin_seeds',
    harvestItemId: 'pumpkin',
    seasons: ['autumn'],
    growthStages: 13,
    minHarvest: 1,
    maxHarvest: 1
  },
  eggplant: {
    id: 'eggplant',
    name: '茄子',
    seedId: 'eggplant_seeds',
    harvestItemId: 'eggplant',
    seasons: ['autumn'],
    growthStages: 5,
    regrow: 5,
    minHarvest: 1,
    maxHarvest: 1
  },
  yam: {
    id: 'yam',
    name: '山药',
    seedId: 'yam_seeds',
    harvestItemId: 'yam',
    seasons: ['autumn'],
    growthStages: 10,
    minHarvest: 1,
    maxHarvest: 1
  },
  cranberry: {
    id: 'cranberry',
    name: '蔓越莓',
    seedId: 'cranberry_seeds',
    harvestItemId: 'cranberry',
    seasons: ['autumn'],
    growthStages: 7,
    regrow: 5,
    minHarvest: 2,
    maxHarvest: 2
  },
  grape: {
    id: 'grape',
    name: '葡萄',
    seedId: 'grape_starter',
    harvestItemId: 'grape',
    seasons: ['autumn'],
    growthStages: 10,
    regrow: 3,
    trellis: true,
    minHarvest: 1,
    maxHarvest: 1
  }
}
