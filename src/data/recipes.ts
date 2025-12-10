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
    ingredients: [{ itemId: 'iron_bar', quantity: 1 }, { itemId: 'gold_bar', quantity: 1 }],
    result: { itemId: 'quality_sprinkler', quantity: 1, name: '优质洒水器', type: 'placeable', icon: ITEMS['quality_sprinkler']?.icon || '🚿' },
    icon: ITEMS['quality_sprinkler']?.icon || '🚿'
  },
  {
    id: 'iridium_sprinkler',
    name: '铱制洒水器',
    description: '每天早上给邻近的24个地块浇水。',
    ingredients: [{ itemId: 'iridium_bar', quantity: 1 }, { itemId: 'gold_bar', quantity: 1 }, { itemId: 'battery_pack', quantity: 1 }],
    result: { itemId: 'iridium_sprinkler', quantity: 1, name: '铱制洒水器', type: 'placeable', icon: ITEMS['iridium_sprinkler']?.icon || '🚿' },
    icon: ITEMS['iridium_sprinkler']?.icon || '🚿'
  },

  // --- New Recipes ---
  {
    id: 'tapper',
    name: '树液采集器',
    description: '放置在枫树、橡树或松树上。',
    ingredients: [{ itemId: 'wood', quantity: 40 }, { itemId: 'copper_bar', quantity: 2 }],
    result: { itemId: 'tapper', quantity: 1, name: '树液采集器', type: 'placeable', icon: ITEMS['tapper']?.icon || '🏺' },
    icon: ITEMS['tapper']?.icon || '🏺'
  },
  {
    id: 'charcoal_kiln',
    name: '木炭窑',
    description: '把木头烧成木炭。',
    ingredients: [{ itemId: 'wood', quantity: 20 }, { itemId: 'gold_bar', quantity: 1 }],
    result: { itemId: 'charcoal_kiln', quantity: 1, name: '木炭窑', type: 'placeable', icon: ITEMS['charcoal_kiln']?.icon || '🔥' },
    icon: ITEMS['charcoal_kiln']?.icon || '🔥'
  },
  {
    id: 'crab_pot',
    name: '蟹笼',
    description: '把它放在水里，装上诱饵。',
    ingredients: [{ itemId: 'wood', quantity: 40 }, { itemId: 'iron_bar', quantity: 3 }],
    result: { itemId: 'crab_pot', quantity: 1, name: '蟹笼', type: 'placeable', icon: ITEMS['crab_pot']?.icon || '🦀' },
    icon: ITEMS['crab_pot']?.icon || '🦀'
  },
  {
    id: 'staircase',
    name: '楼梯',
    description: '用来快速下矿。',
    ingredients: [{ itemId: 'stone', quantity: 99 }],
    result: { itemId: 'staircase', quantity: 1, name: '楼梯', type: 'placeable', icon: ITEMS['staircase']?.icon || '🪜' },
    icon: ITEMS['staircase']?.icon || '🪜'
  },
  {
    id: 'field_snack',
    name: '田野小吃',
    description: '一种快速补充能量的小吃。',
    ingredients: [{ itemId: 'acorn', quantity: 1 }, { itemId: 'maple_seed', quantity: 1 }, { itemId: 'pine_cone', quantity: 1 }],
    result: { itemId: 'field_snack', quantity: 1, name: '田野小吃', type: 'consumable', icon: ITEMS['field_snack']?.icon || '🍪' },
    icon: ITEMS['field_snack']?.icon || '🍪'
  },
  {
    id: 'quality_fertilizer',
    name: '优质肥料',
    description: '提高土壤质量，增加种植出优质作物的概率。',
    ingredients: [{ itemId: 'sap', quantity: 2 }, { itemId: 'carp', quantity: 1 }],
    result: { itemId: 'quality_fertilizer', quantity: 1, name: '优质肥料', type: 'consumable', icon: ITEMS['quality_fertilizer']?.icon || '💩' },
    icon: ITEMS['quality_fertilizer']?.icon || '💩'
  },
  {
    id: 'speed_gro',
    name: '加速肥料',
    description: '促进叶子生长。',
    ingredients: [{ itemId: 'pine_tar', quantity: 1 }, { itemId: 'clam', quantity: 1 }],
    result: { itemId: 'speed_gro', quantity: 1, name: '加速肥料', type: 'consumable', icon: ITEMS['speed_gro']?.icon || '⚡' },
    icon: ITEMS['speed_gro']?.icon || '⚡'
  },
  {
    id: 'deluxe_speed_gro',
    name: '高级加速肥料',
    description: '促进叶子生长。',
    ingredients: [{ itemId: 'oak_resin', quantity: 1 }, { itemId: 'coral', quantity: 1 }],
    result: { itemId: 'deluxe_speed_gro', quantity: 1, name: '高级加速肥料', type: 'consumable', icon: ITEMS['deluxe_speed_gro']?.icon || '⚡' },
    icon: ITEMS['deluxe_speed_gro']?.icon || '⚡'
  },
  {
    id: 'tree_fertilizer',
    name: '树肥',
    description: '撒在野生树木上。',
    ingredients: [{ itemId: 'fiber', quantity: 5 }, { itemId: 'stone', quantity: 5 }],
    result: { itemId: 'tree_fertilizer', quantity: 1, name: '树肥', type: 'consumable', icon: ITEMS['tree_fertilizer']?.icon || '🌳' },
    icon: ITEMS['tree_fertilizer']?.icon || '🌳'
  },
  {
    id: 'glowstone_ring',
    name: '辉石戒指',
    description: '发出恒定的光，并增加收集物品的磁力半径。',
    ingredients: [{ itemId: 'solar_essence', quantity: 5 }, { itemId: 'iron_bar', quantity: 5 }],
    result: { itemId: 'glowstone_ring', quantity: 1, name: '辉石戒指', type: 'equipment', icon: ITEMS['glowstone_ring']?.icon || '💍' },
    icon: ITEMS['glowstone_ring']?.icon || '💍'
  },
  {
    id: 'iridium_band',
    name: '铱环',
    description: '发光，吸引物品，并增加10%的攻击伤害。',
    ingredients: [{ itemId: 'iridium_bar', quantity: 5 }, { itemId: 'solar_essence', quantity: 50 }, { itemId: 'void_essence', quantity: 50 }],
    result: { itemId: 'iridium_band', quantity: 1, name: '铱环', type: 'equipment', icon: ITEMS['iridium_band']?.icon || '💍' },
    icon: ITEMS['iridium_band']?.icon || '💍'
  },

  // Machines
  {
    id: 'furnace',
    name: '熔炉',
    description: '将矿石冶炼成锭。',
    ingredients: [{ itemId: 'stone', quantity: 25 }, { itemId: 'copper_ore', quantity: 20 }],
    result: { itemId: 'furnace', quantity: 1, name: '熔炉', type: 'placeable', icon: ITEMS['furnace']?.icon || '🔥' },
    icon: ITEMS['furnace']?.icon || '🔥'
  },
  {
    id: 'mayonnaise_machine',
    name: '蛋黄酱机',
    description: '把鸡蛋加工成蛋黄酱。',
    ingredients: [{ itemId: 'wood', quantity: 50 }, { itemId: 'stone', quantity: 15 }, { itemId: 'copper_bar', quantity: 1 }], // Simplified
    result: { itemId: 'mayonnaise_machine', quantity: 1, name: '蛋黄酱机', type: 'placeable', icon: ITEMS['mayonnaise_machine']?.icon || '🥚' },
    icon: ITEMS['mayonnaise_machine']?.icon || '🥚'
  },
  {
    id: 'cheese_press',
    name: '压酪机',
    description: '把牛奶加工成奶酪。',
    ingredients: [{ itemId: 'wood', quantity: 45 }, { itemId: 'stone', quantity: 45 }, { itemId: 'copper_bar', quantity: 1 }], // Simplified
    result: { itemId: 'cheese_press', quantity: 1, name: '压酪机', type: 'placeable', icon: ITEMS['cheese_press']?.icon || '🧀' },
    icon: ITEMS['cheese_press']?.icon || '🧀'
  },
  {
    id: 'preserves_jar',
    name: '罐头瓶',
    description: '把蔬菜变成泡菜，把水果变成果酱。',
    ingredients: [{ itemId: 'wood', quantity: 50 }, { itemId: 'stone', quantity: 40 }, { itemId: 'coal', quantity: 8 }],
    result: { itemId: 'preserves_jar', quantity: 1, name: '罐头瓶', type: 'placeable', icon: ITEMS['preserves_jar']?.icon || '🥫' },
    icon: ITEMS['preserves_jar']?.icon || '🥫'
  },
  {
    id: 'keg',
    name: '小桶',
    description: '酿造饮料。',
    ingredients: [{ itemId: 'wood', quantity: 30 }, { itemId: 'copper_bar', quantity: 1 }, { itemId: 'iron_bar', quantity: 1 }], // Simplified
    result: { itemId: 'keg', quantity: 1, name: '小桶', type: 'placeable', icon: ITEMS['keg']?.icon || '🍺' },
    icon: ITEMS['keg']?.icon || '🍺'
  },
  {
    id: 'bee_house',
    name: '蜂房',
    description: '利用花朵生产蜂蜜。',
    ingredients: [{ itemId: 'wood', quantity: 40 }, { itemId: 'coal', quantity: 8 }, { itemId: 'iron_bar', quantity: 1 }], // Simplified
    result: { itemId: 'bee_house', quantity: 1, name: '蜂房', type: 'placeable', icon: ITEMS['bee_house']?.icon || '🐝' },
    icon: ITEMS['bee_house']?.icon || '🐝'
  },
  {
    id: 'loom',
    name: '织布机',
    description: '将原毛加工成精细的布料。',
    ingredients: [{ itemId: 'wood', quantity: 60 }, { itemId: 'sap', quantity: 10 }], // Simplified (removed Fiber/Pine Tar)
    result: { itemId: 'loom', quantity: 1, name: '织布机', type: 'placeable', icon: ITEMS['loom']?.icon || '🧶' },
    icon: ITEMS['loom']?.icon || '🧶'
  },
  {
    id: 'oil_maker',
    name: '榨油机',
    description: '用松露制作松露油。',
    ingredients: [{ itemId: 'wood', quantity: 50 }, { itemId: 'gold_bar', quantity: 1 }, { itemId: 'stone', quantity: 20 }], // Simplified (removed Slime/Hardwood)
    result: { itemId: 'oil_maker', quantity: 1, name: '榨油机', type: 'placeable', icon: ITEMS['oil_maker']?.icon || '🧴' },
    icon: ITEMS['oil_maker']?.icon || '🧴'
  },
  {
    id: 'recycling_machine',
    name: '回收机',
    description: '把垃圾变成有用的东西。',
    ingredients: [{ itemId: 'wood', quantity: 25 }, { itemId: 'stone', quantity: 25 }, { itemId: 'iron_bar', quantity: 1 }],
    result: { itemId: 'recycling_machine', quantity: 1, name: '回收机', type: 'placeable', icon: ITEMS['recycling_machine']?.icon || '♻️' },
    icon: ITEMS['recycling_machine']?.icon || '♻️'
  },
  {
    id: 'lightning_rod',
    name: '避雷针',
    description: '从雷暴中收集能量。',
    ingredients: [{ itemId: 'iron_bar', quantity: 1 }, { itemId: 'copper_bar', quantity: 1 }],
    result: { itemId: 'lightning_rod', quantity: 1, name: '避雷针', type: 'placeable', icon: ITEMS['lightning_rod']?.icon || '⚡' },
    icon: ITEMS['lightning_rod']?.icon || '⚡'
  },
  {
    id: 'worm_bin',
    name: '虫饵盒',
    description: '定期生产鱼饵。',
    ingredients: [{ itemId: 'hardwood', quantity: 25 }, { itemId: 'gold_bar', quantity: 1 }, { itemId: 'iron_bar', quantity: 1 }, { itemId: 'fiber', quantity: 50 }],
    result: { itemId: 'worm_bin', quantity: 1, name: '虫饵盒', type: 'placeable', icon: ITEMS['worm_bin']?.icon || '🪱' },
    icon: ITEMS['worm_bin']?.icon || '🪱'
  },
  {
    id: 'seed_maker',
    name: '种子生产器',
    description: '从收获的作物中提取种子。',
    ingredients: [{ itemId: 'wood', quantity: 25 }, { itemId: 'gold_bar', quantity: 1 }, { itemId: 'coal', quantity: 10 }],
    result: { itemId: 'seed_maker', quantity: 1, name: '种子生产器', type: 'placeable', icon: ITEMS['seed_maker']?.icon || '🌱' },
    icon: ITEMS['seed_maker']?.icon || '🌱'
  },
  {
    id: 'crystalarium',
    name: '宝石复制机',
    description: '放入宝石，它会无限复制。',
    ingredients: [{ itemId: 'stone', quantity: 99 }, { itemId: 'gold_bar', quantity: 5 }, { itemId: 'iridium_bar', quantity: 2 }, { itemId: 'battery_pack', quantity: 1 }],
    result: { itemId: 'crystalarium', quantity: 1, name: '宝石复制机', type: 'placeable', icon: ITEMS['crystalarium']?.icon || '💎' },
    icon: ITEMS['crystalarium']?.icon || '💎'
  },
  {
    id: 'mini_jukebox',
    name: '迷你点唱机',
    description: '播放你喜欢的曲子。',
    ingredients: [{ itemId: 'iron_bar', quantity: 2 }, { itemId: 'battery_pack', quantity: 1 }],
    result: { itemId: 'mini_jukebox', quantity: 1, name: '迷你点唱机', type: 'placeable', icon: ITEMS['mini_jukebox']?.icon || '🎵' },
    icon: ITEMS['mini_jukebox']?.icon || '🎵'
  },

  // --- Bombs ---
  {
    id: 'cherry_bomb',
    name: '樱桃炸弹',
    description: '产生一个小爆炸。',
    ingredients: [{ itemId: 'copper_ore', quantity: 4 }, { itemId: 'coal', quantity: 1 }],
    result: { itemId: 'cherry_bomb', quantity: 1, name: '樱桃炸弹', type: 'misc', icon: ITEMS['cherry_bomb']?.icon || '💣' },
    icon: ITEMS['cherry_bomb']?.icon || '💣'
  },
  {
    id: 'bomb',
    name: '炸弹',
    description: '产生爆炸。小心！',
    ingredients: [{ itemId: 'iron_ore', quantity: 4 }, { itemId: 'coal', quantity: 1 }],
    result: { itemId: 'bomb', quantity: 1, name: '炸弹', type: 'misc', icon: ITEMS['bomb']?.icon || '💣' },
    icon: ITEMS['bomb']?.icon || '💣'
  },
  {
    id: 'mega_bomb',
    name: '超级炸弹',
    description: '产生巨大的爆炸。极度危险！',
    ingredients: [{ itemId: 'gold_ore', quantity: 4 }, { itemId: 'solar_essence', quantity: 1 }, { itemId: 'void_essence', quantity: 1 }],
    result: { itemId: 'mega_bomb', quantity: 1, name: '超级炸弹', type: 'misc', icon: ITEMS['mega_bomb']?.icon || '💣' },
    icon: ITEMS['mega_bomb']?.icon || '💣'
  },

  // --- Totems ---
  {
    id: 'warp_totem_farm',
    name: '传送图腾：农场',
    description: '直接将你传送到农场。消耗品。',
    ingredients: [{ itemId: 'hardwood', quantity: 1 }, { itemId: 'honey', quantity: 1 }, { itemId: 'fiber', quantity: 20 }],
    result: { itemId: 'warp_totem_farm', quantity: 1, name: '传送图腾：农场', type: 'consumable', icon: ITEMS['warp_totem_farm']?.icon || '🗿' },
    icon: ITEMS['warp_totem_farm']?.icon || '🗿'
  },
  {
    id: 'warp_totem_mountain',
    name: '传送图腾：山岭',
    description: '直接将你传送到山岭。消耗品。',
    ingredients: [{ itemId: 'hardwood', quantity: 1 }, { itemId: 'iron_bar', quantity: 1 }, { itemId: 'stone', quantity: 25 }],
    result: { itemId: 'warp_totem_mountain', quantity: 1, name: '传送图腾：山岭', type: 'consumable', icon: ITEMS['warp_totem_mountain']?.icon || '🗿' },
    icon: ITEMS['warp_totem_mountain']?.icon || '🗿'
  },
  {
    id: 'warp_totem_beach',
    name: '传送图腾：海滩',
    description: '直接将你传送到海滩。消耗品。',
    ingredients: [{ itemId: 'hardwood', quantity: 1 }, { itemId: 'coral', quantity: 2 }, { itemId: 'fiber', quantity: 10 }],
    result: { itemId: 'warp_totem_beach', quantity: 1, name: '传送图腾：海滩', type: 'consumable', icon: ITEMS['warp_totem_beach']?.icon || '🗿' },
    icon: ITEMS['warp_totem_beach']?.icon || '🗿'
  },
  {
    id: 'rain_totem',
    name: '求雨图腾',
    description: '激活后，明天下雨的概率大大增加。消耗品。',
    ingredients: [{ itemId: 'hardwood', quantity: 1 }, { itemId: 'truffle_oil', quantity: 1 }, { itemId: 'pine_tar', quantity: 5 }],
    result: { itemId: 'rain_totem', quantity: 1, name: '求雨图腾', type: 'consumable', icon: ITEMS['rain_totem']?.icon || '🌧️' },
    icon: ITEMS['rain_totem']?.icon || '🌧️'
  },

  // --- Seeds ---
  {
    id: 'wild_seeds_sp',
    name: '春季种子',
    description: '各种春季野生种子的集合。',
    ingredients: [{ itemId: 'wild_horseradish', quantity: 1 }, { itemId: 'daffodil', quantity: 1 }, { itemId: 'leek', quantity: 1 }, { itemId: 'dandelion', quantity: 1 }],
    result: { itemId: 'spring_seeds', quantity: 10, name: '春季种子', type: 'seed', icon: ITEMS['spring_seeds']?.icon || '🌱' },
    icon: ITEMS['spring_seeds']?.icon || '🌱'
  },
  {
    id: 'wild_seeds_su',
    name: '夏季种子',
    description: '各种夏季野生种子的集合。',
    ingredients: [{ itemId: 'spice_berry', quantity: 1 }, { itemId: 'grape', quantity: 1 }, { itemId: 'sweet_pea', quantity: 1 }],
    result: { itemId: 'summer_seeds', quantity: 10, name: '夏季种子', type: 'seed', icon: ITEMS['summer_seeds']?.icon || '🌱' },
    icon: ITEMS['summer_seeds']?.icon || '🌱'
  },
  {
    id: 'wild_seeds_fa',
    name: '秋季种子',
    description: '各种秋季野生种子的集合。',
    ingredients: [{ itemId: 'common_mushroom', quantity: 1 }, { itemId: 'wild_plum', quantity: 1 }, { itemId: 'hazelnut', quantity: 1 }, { itemId: 'blackberry', quantity: 1 }],
    result: { itemId: 'fall_seeds', quantity: 10, name: '秋季种子', type: 'seed', icon: ITEMS['fall_seeds']?.icon || '🌱' },
    icon: ITEMS['fall_seeds']?.icon || '🌱'
  },
  {
    id: 'wild_seeds_wi',
    name: '冬季种子',
    description: '各种冬季野生种子的集合。',
    ingredients: [{ itemId: 'winter_root', quantity: 1 }, { itemId: 'crystal_fruit', quantity: 1 }, { itemId: 'snow_yam', quantity: 1 }, { itemId: 'crocus', quantity: 1 }],
    result: { itemId: 'winter_seeds', quantity: 10, name: '冬季种子', type: 'seed', icon: ITEMS['winter_seeds']?.icon || '🌱' },
    icon: ITEMS['winter_seeds']?.icon || '🌱'
  },
  {
    id: 'ancient_seeds_craft',
    name: '上古种子',
    description: '可以通过种植长出古老的果实。',
    ingredients: [{ itemId: 'ancient_seed_artifact', quantity: 1 }],
    result: { itemId: 'ancient_seeds', quantity: 1, name: '上古种子', type: 'seed', icon: ITEMS['ancient_seeds']?.icon || '🏺' },
    icon: ITEMS['ancient_seeds']?.icon || '🏺'
  },
  {
    id: 'tea_sapling',
    name: '茶苗',
    description: '需要20天才能长成茶树。',
    ingredients: [{ itemId: 'wild_seeds_any', quantity: 2 }, { itemId: 'fiber', quantity: 5 }, { itemId: 'wood', quantity: 5 }], // Note: logic for 'wild_seeds_any' might need special handling or just pick one
    result: { itemId: 'tea_sapling', quantity: 1, name: '茶苗', type: 'seed', icon: ITEMS['tea_sapling']?.icon || '🍵' },
    icon: ITEMS['tea_sapling']?.icon || '🍵'
  },
  {
    id: 'fiber_seeds',
    name: '纤维种子',
    description: '在所有季节种植。不需要浇水。',
    ingredients: [{ itemId: 'mixed_seeds', quantity: 1 }, { itemId: 'sap', quantity: 5 }, { itemId: 'clay', quantity: 1 }],
    result: { itemId: 'fiber_seeds', quantity: 4, name: '纤维种子', type: 'seed', icon: ITEMS['fiber_seeds']?.icon || '🌱' },
    icon: ITEMS['fiber_seeds']?.icon || '🌱'
  },

  // --- Special Machines ---
  {
    id: 'slime_egg_press',
    name: '史莱姆蛋压制机',
    description: '将史莱姆压缩成史莱姆蛋。',
    ingredients: [{ itemId: 'coal', quantity: 25 }, { itemId: 'battery_pack', quantity: 1 }, { itemId: 'diamond', quantity: 1 }],
    result: { itemId: 'slime_egg_press', quantity: 1, name: '史莱姆蛋压制机', type: 'placeable', icon: ITEMS['slime_egg_press']?.icon || '🟢' },
    icon: ITEMS['slime_egg_press']?.icon || '🟢'
  },

  // --- Paths & Floors ---
  {
    id: 'wood_floor',
    name: '木地板',
    description: '放置在地板上以创建路径或装饰地板。',
    ingredients: [{ itemId: 'wood', quantity: 1 }],
    result: { itemId: 'wood_floor', quantity: 1, name: '木地板', type: 'placeable', icon: ITEMS['wood_floor']?.icon || '🪵' },
    icon: ITEMS['wood_floor']?.icon || '🪵'
  },
  {
    id: 'stone_floor',
    name: '石地板',
    description: '放置在地板上以创建路径或装饰地板。',
    ingredients: [{ itemId: 'stone', quantity: 1 }],
    result: { itemId: 'stone_floor', quantity: 1, name: '石地板', type: 'placeable', icon: ITEMS['stone_floor']?.icon || '🪨' },
    icon: ITEMS['stone_floor']?.icon || '🪨'
  },
  {
    id: 'cobblestone_path',
    name: '鹅卵石路',
    description: '放置在地板上以创建路径。',
    ingredients: [{ itemId: 'stone', quantity: 1 }],
    result: { itemId: 'cobblestone_path', quantity: 1, name: '鹅卵石路', type: 'placeable', icon: ITEMS['cobblestone_path']?.icon || '🪨' },
    icon: ITEMS['cobblestone_path']?.icon || '🪨'
  },
  {
    id: 'gravel_path',
    name: '砾石路',
    description: '放置在地板上以创建路径。',
    ingredients: [{ itemId: 'stone', quantity: 1 }],
    result: { itemId: 'gravel_path', quantity: 1, name: '砾石路', type: 'placeable', icon: ITEMS['gravel_path']?.icon || '🪨' },
    icon: ITEMS['gravel_path']?.icon || '🪨'
  },
  {
    id: 'crystal_path',
    name: '水晶路',
    description: '放置在地板上以创建路径。',
    ingredients: [{ itemId: 'refined_quartz', quantity: 1 }],
    result: { itemId: 'crystal_path', quantity: 5, name: '水晶路', type: 'placeable', icon: ITEMS['crystal_path']?.icon || '💎' },
    icon: ITEMS['crystal_path']?.icon || '💎'
  },

  // --- Lighting ---
  {
    id: 'campfire',
    name: '篝火',
    description: '提供少量的光。',
    ingredients: [{ itemId: 'wood', quantity: 10 }, { itemId: 'stone', quantity: 10 }, { itemId: 'fiber', quantity: 10 }],
    result: { itemId: 'campfire', quantity: 1, name: '篝火', type: 'placeable', icon: ITEMS['campfire']?.icon || '🔥' },
    icon: ITEMS['campfire']?.icon || '🔥'
  },
  {
    id: 'wooden_brazier',
    name: '木制火盆',
    description: '适量的光。',
    ingredients: [{ itemId: 'wood', quantity: 10 }, { itemId: 'coal', quantity: 1 }, { itemId: 'fiber', quantity: 5 }],
    result: { itemId: 'wooden_brazier', quantity: 1, name: '木制火盆', type: 'placeable', icon: ITEMS['wooden_brazier']?.icon || '🔥' },
    icon: ITEMS['wooden_brazier']?.icon || '🔥'
  },
  {
    id: 'stone_brazier',
    name: '石制火盆',
    description: '适量的光。',
    ingredients: [{ itemId: 'stone', quantity: 10 }, { itemId: 'coal', quantity: 1 }, { itemId: 'fiber', quantity: 5 }],
    result: { itemId: 'stone_brazier', quantity: 1, name: '石制火盆', type: 'placeable', icon: ITEMS['stone_brazier']?.icon || '🔥' },
    icon: ITEMS['stone_brazier']?.icon || '🔥'
  },
  {
    id: 'gold_brazier',
    name: '黄金火盆',
    description: '大量的光。',
    ingredients: [{ itemId: 'gold_bar', quantity: 1 }, { itemId: 'coal', quantity: 1 }, { itemId: 'fiber', quantity: 5 }],
    result: { itemId: 'gold_brazier', quantity: 1, name: '黄金火盆', type: 'placeable', icon: ITEMS['gold_brazier']?.icon || '🔥' },
    icon: ITEMS['gold_brazier']?.icon || '🔥'
  },
  {
    id: 'carved_brazier',
    name: '雕刻火盆',
    description: '大量的光。',
    ingredients: [{ itemId: 'hardwood', quantity: 10 }, { itemId: 'coal', quantity: 1 }],
    result: { itemId: 'carved_brazier', quantity: 1, name: '雕刻火盆', type: 'placeable', icon: ITEMS['carved_brazier']?.icon || '🔥' },
    icon: ITEMS['carved_brazier']?.icon || '🔥'
  },
  {
    id: 'stump_brazier',
    name: '树桩火盆',
    description: '适量的光。',
    ingredients: [{ itemId: 'hardwood', quantity: 5 }, { itemId: 'coal', quantity: 1 }],
    result: { itemId: 'stump_brazier', quantity: 1, name: '树桩火盆', type: 'placeable', icon: ITEMS['stump_brazier']?.icon || '🔥' },
    icon: ITEMS['stump_brazier']?.icon || '🔥'
  },
  {
    id: 'barrel_brazier',
    name: '木桶火盆',
    description: '适量的光。',
    ingredients: [{ itemId: 'wood', quantity: 50 }, { itemId: 'solar_essence', quantity: 1 }, { itemId: 'coal', quantity: 1 }],
    result: { itemId: 'barrel_brazier', quantity: 1, name: '木桶火盆', type: 'placeable', icon: ITEMS['barrel_brazier']?.icon || '🔥' },
    icon: ITEMS['barrel_brazier']?.icon || '🔥'
  },
  {
    id: 'skull_brazier',
    name: '骷髅火盆',
    description: '适量的光。',
    ingredients: [{ itemId: 'hardwood', quantity: 10 }, { itemId: 'solar_essence', quantity: 1 }, { itemId: 'coal', quantity: 1 }],
    result: { itemId: 'skull_brazier', quantity: 1, name: '骷髅火盆', type: 'placeable', icon: ITEMS['skull_brazier']?.icon || '🔥' },
    icon: ITEMS['skull_brazier']?.icon || '🔥'
  },

  // --- Fishing Tackle ---
  {
    id: 'spinner',
    name: '旋式鱼饵',
    description: '增加上钩率。',
    ingredients: [{ itemId: 'iron_bar', quantity: 2 }],
    result: { itemId: 'spinner', quantity: 1, name: '旋式鱼饵', type: 'equipment', icon: ITEMS['spinner']?.icon || '🎣' },
    icon: ITEMS['spinner']?.icon || '🎣'
  },
  {
    id: 'trap_bobber',
    name: '陷阱浮标',
    description: '鱼上钩后逃跑的速度减慢。',
    ingredients: [{ itemId: 'copper_bar', quantity: 1 }, { itemId: 'sap', quantity: 10 }],
    result: { itemId: 'trap_bobber', quantity: 1, name: '陷阱浮标', type: 'equipment', icon: ITEMS['trap_bobber']?.icon || '🎣' },
    icon: ITEMS['trap_bobber']?.icon || '🎣'
  },
  {
    id: 'cork_bobber',
    name: '软木塞浮标',
    description: '稍微增加钓鱼条的大小。',
    ingredients: [{ itemId: 'wood', quantity: 10 }, { itemId: 'hardwood', quantity: 5 }, { itemId: 'slime', quantity: 10 }],
    result: { itemId: 'cork_bobber', quantity: 1, name: '软木塞浮标', type: 'equipment', icon: ITEMS['cork_bobber']?.icon || '🎣' },
    icon: ITEMS['cork_bobber']?.icon || '🎣'
  },
  {
    id: 'treasure_hunter',
    name: '寻宝者',
    description: '鱼咬钩时不会失去宝箱进度。',
    ingredients: [{ itemId: 'gold_bar', quantity: 2 }],
    result: { itemId: 'treasure_hunter', quantity: 1, name: '寻宝者', type: 'equipment', icon: ITEMS['treasure_hunter']?.icon || '🎣' },
    icon: ITEMS['treasure_hunter']?.icon || '🎣'
  },
  {
    id: 'dressed_spinner',
    name: '精装旋式鱼饵',
    description: '大大增加上钩率。',
    ingredients: [{ itemId: 'iron_bar', quantity: 2 }, { itemId: 'cloth', quantity: 1 }],
    result: { itemId: 'dressed_spinner', quantity: 1, name: '精装旋式鱼饵', type: 'equipment', icon: ITEMS['dressed_spinner']?.icon || '🎣' },
    icon: ITEMS['dressed_spinner']?.icon || '🎣'
  },
  {
    id: 'barbed_hook',
    name: '倒刺钩',
    description: '让钓鱼条自动紧贴着鱼。',
    ingredients: [{ itemId: 'copper_bar', quantity: 1 }, { itemId: 'iron_bar', quantity: 1 }, { itemId: 'gold_bar', quantity: 1 }],
    result: { itemId: 'barbed_hook', quantity: 1, name: '倒刺钩', type: 'equipment', icon: ITEMS['barbed_hook']?.icon || '🎣' },
    icon: ITEMS['barbed_hook']?.icon || '🎣'
  },

  // --- Rings ---
  {
    id: 'sturdy_ring',
    name: '坚固戒指',
    description: '减少负面状态的持续时间。',
    ingredients: [{ itemId: 'copper_bar', quantity: 2 }, { itemId: 'bug_meat', quantity: 25 }, { itemId: 'slime', quantity: 25 }],
    result: { itemId: 'sturdy_ring', quantity: 1, name: '坚固戒指', type: 'equipment', icon: ITEMS['sturdy_ring']?.icon || '💍' },
    icon: ITEMS['sturdy_ring']?.icon || '💍'
  },
  {
    id: 'warrior_ring',
    name: '战士戒指',
    description: '杀死怪物后偶尔会注入“战士能量”。',
    ingredients: [{ itemId: 'iron_bar', quantity: 10 }, { itemId: 'coal', quantity: 25 }, { itemId: 'frozen_tear', quantity: 10 }],
    result: { itemId: 'warrior_ring', quantity: 1, name: '战士戒指', type: 'equipment', icon: ITEMS['warrior_ring']?.icon || '💍' },
    icon: ITEMS['warrior_ring']?.icon || '💍'
  },
  {
    id: 'vampire_ring',
    name: '吸血鬼戒指',
    description: '每次杀死怪物都会回复一点生命值。',
    ingredients: [{ itemId: 'iron_bar', quantity: 10 }, { itemId: 'frozen_tear', quantity: 10 }, { itemId: 'bat_wing', quantity: 10 }],
    result: { itemId: 'vampire_ring', quantity: 1, name: '吸血鬼戒指', type: 'equipment', icon: ITEMS['vampire_ring']?.icon || '💍' },
    icon: ITEMS['vampire_ring']?.icon || '💍'
  },
  {
    id: 'magnet_ring',
    name: '磁铁戒指',
    description: '增加收集物品的磁力半径。',
    ingredients: [{ itemId: 'iron_bar', quantity: 1 }, { itemId: 'gold_bar', quantity: 1 }],
    result: { itemId: 'magnet_ring', quantity: 1, name: '磁铁戒指', type: 'equipment', icon: ITEMS['magnet_ring']?.icon || '💍' },
    icon: ITEMS['magnet_ring']?.icon || '💍'
  },

  // --- Misc ---
  {
    id: 'wood_sign',
    name: '木牌',
    description: '可在上面显示任何物品的图像。',
    ingredients: [{ itemId: 'wood', quantity: 25 }],
    result: { itemId: 'wood_sign', quantity: 1, name: '木牌', type: 'placeable', icon: ITEMS['wood_sign']?.icon || '🪧' },
    icon: ITEMS['wood_sign']?.icon || '🪧'
  },
  {
    id: 'stone_sign',
    name: '石牌',
    description: '可在上面显示任何物品的图像。',
    ingredients: [{ itemId: 'stone', quantity: 25 }],
    result: { itemId: 'stone_sign', quantity: 1, name: '石牌', type: 'placeable', icon: ITEMS['stone_sign']?.icon || '🪧' },
    icon: ITEMS['stone_sign']?.icon || '🪧'
  },
  {
    id: 'stone_chest',
    name: '石箱',
    description: '用来储存物品。',
    ingredients: [{ itemId: 'stone', quantity: 50 }],
    result: { itemId: 'stone_chest', quantity: 1, name: '石箱', type: 'placeable', icon: ITEMS['stone_chest']?.icon || '📦' },
    icon: ITEMS['stone_chest']?.icon || '📦'
  }
]
