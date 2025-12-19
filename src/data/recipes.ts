import { ITEMS } from './items'

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

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  // Basics
  {
    id: 'chest',
    name: '箱子',
    description: '用来储存物品。',
    ingredients: [{ itemId: 'wood', quantity: 50 }],
    result: { itemId: 'chest', quantity: 1, name: '箱子', type: 'placeable', icon: ITEMS['chest']?.icon || '📦' },
    icon: ITEMS['chest']?.icon || '📦'
  },
  {
    id: 'torch',
    name: '火把',
    description: '提供照明。',
    ingredients: [{ itemId: 'wood', quantity: 1 }, { itemId: 'sap', quantity: 2 }],
    result: { itemId: 'torch', quantity: 3, name: '火把', type: 'placeable', icon: ITEMS['torch']?.icon || '🔥' },
    icon: ITEMS['torch']?.icon || '🔥'
  },
  {
    id: 'campfire',
    name: '营火',
    description: '提供温暖和照明。',
    ingredients: [{ itemId: 'wood', quantity: 10 }, { itemId: 'stone', quantity: 10 }, { itemId: 'fiber', quantity: 10 }],
    result: { itemId: 'campfire', quantity: 1, name: '营火', type: 'placeable', icon: ITEMS['campfire']?.icon || '🔥' },
    icon: ITEMS['campfire']?.icon || '🔥'
  },
  {
    id: 'scarecrow',
    name: '稻草人',
    description: '防止乌鸦吃掉作物。',
    ingredients: [{ itemId: 'wood', quantity: 50 }, { itemId: 'coal', quantity: 1 }, { itemId: 'fiber', quantity: 20 }],
    result: { itemId: 'scarecrow', quantity: 1, name: '稻草人', type: 'placeable', icon: ITEMS['scarecrow']?.icon || '☃️' },
    icon: ITEMS['scarecrow']?.icon || '☃️'
  },
  {
    id: 'fertilizer',
    name: '基础肥料',
    description: '提高土壤质量。',
    ingredients: [{ itemId: 'sap', quantity: 2 }],
    result: { itemId: 'basic_fertilizer', quantity: 1, name: '基础肥料', type: 'consumable', icon: ITEMS['basic_fertilizer']?.icon || '💩' },
    icon: ITEMS['basic_fertilizer']?.icon || '💩'
  },
  {
    id: 'quality_fertilizer',
    name: '优质肥料',
    description: '大大提高土壤质量。',
    ingredients: [{ itemId: 'sap', quantity: 2 }, { itemId: 'fish', quantity: 1 }], // Simplified fish requirement
    result: { itemId: 'quality_fertilizer', quantity: 1, name: '优质肥料', type: 'consumable', icon: ITEMS['quality_fertilizer']?.icon || '💩' },
    icon: ITEMS['quality_fertilizer']?.icon || '💩'
  },

  // Fences
  {
    id: 'wood_fence',
    name: '木围栏',
    description: '阻挡动物和怪物。',
    ingredients: [{ itemId: 'wood', quantity: 2 }],
    result: { itemId: 'wood_fence', quantity: 1, name: '木围栏', type: 'placeable', icon: ITEMS['wood_fence']?.icon || '🚧' },
    icon: ITEMS['wood_fence']?.icon || '🚧'
  },
  {
    id: 'stone_fence',
    name: '石围栏',
    description: '坚固的围栏。',
    ingredients: [{ itemId: 'stone', quantity: 2 }],
    result: { itemId: 'stone_fence', quantity: 1, name: '石围栏', type: 'placeable', icon: ITEMS['stone_fence']?.icon || '🪨' },
    icon: ITEMS['stone_fence']?.icon || '🪨'
  },
  {
    id: 'iron_fence',
    name: '铁围栏',
    description: '非常耐用的围栏。',
    ingredients: [{ itemId: 'iron_bar', quantity: 1 }],
    result: { itemId: 'iron_fence', quantity: 10, name: '铁围栏', type: 'placeable', icon: ITEMS['iron_fence']?.icon || '⛓️' },
    icon: ITEMS['iron_fence']?.icon || '⛓️'
  },
  {
    id: 'gate',
    name: '大门',
    description: '允许通过围栏。',
    ingredients: [{ itemId: 'wood', quantity: 10 }],
    result: { itemId: 'gate', quantity: 1, name: '大门', type: 'placeable', icon: ITEMS['gate']?.icon || '🚪' },
    icon: ITEMS['gate']?.icon || '🚪'
  },

  // Sprinklers
  {
    id: 'sprinkler',
    name: '洒水器',
    description: '每天早上给邻近的4个地块浇水。',
    ingredients: [{ itemId: 'copper_bar', quantity: 1 }, { itemId: 'iron_bar', quantity: 1 }],
    result: { itemId: 'sprinkler', quantity: 1, name: '洒水器', type: 'placeable', icon: ITEMS['sprinkler']?.icon || '🚿' },
    icon: ITEMS['sprinkler']?.icon || '🚿'
  },
  {
    id: 'quality_sprinkler',
    name: '优质洒水器',
    description: '每天早上给邻近的8个地块浇水。',
    ingredients: [{ itemId: 'iron_bar', quantity: 1 }, { itemId: 'gold_bar', quantity: 1 }, { itemId: 'refined_quartz', quantity: 1 }],
    result: { itemId: 'quality_sprinkler', quantity: 1, name: '优质洒水器', type: 'placeable', icon: ITEMS['quality_sprinkler']?.icon || '🚿' },
    icon: ITEMS['quality_sprinkler']?.icon || '🚿'
  },
  {
    id: 'iridium_sprinkler',
    name: '铱洒水器',
    description: '每天早上给邻近的24个地块浇水。',
    ingredients: [{ itemId: 'gold_bar', quantity: 1 }, { itemId: 'iridium_bar', quantity: 1 }, { itemId: 'battery_pack', quantity: 1 }],
    result: { itemId: 'iridium_sprinkler', quantity: 1, name: '铱洒水器', type: 'placeable', icon: ITEMS['iridium_sprinkler']?.icon || '🚿' },
    icon: ITEMS['iridium_sprinkler']?.icon || '🚿'
  },

  // Artisan Equipment
  {
    id: 'furnace',
    name: '熔炉',
    description: '把矿石熔炼成锭。',
    ingredients: [{ itemId: 'stone', quantity: 20 }, { itemId: 'copper_ore', quantity: 25 }],
    result: { itemId: 'furnace', quantity: 1, name: '熔炉', type: 'placeable', icon: ITEMS['furnace']?.icon || '🔥' },
    icon: ITEMS['furnace']?.icon || '🔥'
  },
  {
    id: 'mayonnaise_machine',
    name: '蛋黄酱机',
    description: '把鸡蛋加工成蛋黄酱。',
    ingredients: [{ itemId: 'wood', quantity: 15 }, { itemId: 'stone', quantity: 15 }, { itemId: 'earth_crystal', quantity: 1 }, { itemId: 'copper_bar', quantity: 1 }],
    result: { itemId: 'mayonnaise_machine', quantity: 1, name: '蛋黄酱机', type: 'placeable', icon: ITEMS['mayonnaise_machine']?.icon || '🥛' },
    icon: ITEMS['mayonnaise_machine']?.icon || '🥛'
  },
  {
    id: 'cheese_press',
    name: '奶酪机',
    description: '把牛奶加工成奶酪。',
    ingredients: [{ itemId: 'wood', quantity: 45 }, { itemId: 'stone', quantity: 45 }, { itemId: 'hardwood', quantity: 10 }, { itemId: 'copper_bar', quantity: 1 }],
    result: { itemId: 'cheese_press', quantity: 1, name: '奶酪机', type: 'placeable', icon: ITEMS['cheese_press']?.icon || '🧀' },
    icon: ITEMS['cheese_press']?.icon || '🧀'
  },
  {
    id: 'preserves_jar',
    name: '腌菜桶',
    description: '把蔬菜变成腌菜，把水果变成果酱。',
    ingredients: [{ itemId: 'wood', quantity: 50 }, { itemId: 'stone', quantity: 40 }, { itemId: 'coal', quantity: 8 }],
    result: { itemId: 'preserves_jar', quantity: 1, name: '腌菜桶', type: 'placeable', icon: ITEMS['preserves_jar']?.icon || '🏺' },
    icon: ITEMS['preserves_jar']?.icon || '🏺'
  },
  {
    id: 'keg',
    name: '小桶',
    description: '把蔬菜变成汁，把水果变成酒。',
    ingredients: [{ itemId: 'wood', quantity: 30 }, { itemId: 'copper_bar', quantity: 1 }, { itemId: 'iron_bar', quantity: 1 }, { itemId: 'oak_resin', quantity: 1 }],
    result: { itemId: 'keg', quantity: 1, name: '小桶', type: 'placeable', icon: ITEMS['keg']?.icon || '🍺' },
    icon: ITEMS['keg']?.icon || '🍺'
  },
  {
    id: 'recycling_machine',
    name: '回收机',
    description: '把垃圾变成有用的物品。',
    ingredients: [{ itemId: 'wood', quantity: 25 }, { itemId: 'stone', quantity: 25 }, { itemId: 'iron_bar', quantity: 1 }],
    result: { itemId: 'recycling_machine', quantity: 1, name: '回收机', type: 'placeable', icon: ITEMS['recycling_machine']?.icon || '♻️' },
    icon: ITEMS['recycling_machine']?.icon || '♻️'
  }
]
