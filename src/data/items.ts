export interface ItemDefinition {
  id: string
  name: string
  type: 'crop' | 'seed' | 'tool' | 'resource' | 'food' | 'misc' | 'weapon' | 'fish' | 'mineral' | 'artifact' | 'trash' | 'furniture' | 'ring' | 'boots' | 'hat' | 'artisan'
  price: number
  sellPrice?: number
  description: string
  icon: string
  canEat?: boolean
  seasons?: string[]
  // For seeds
  cropType?: string
  growthStages?: number
  regrowAfterHarvest?: number // Stage to revert to after harvest (if regrowable)
  // For food
  energy?: number
  health?: number
  // For fish
  locations?: string[]
  weather?: string[] // 'sun', 'rain', 'wind'
  time?: string[] // 'day', 'night'
  difficulty?: number
}

export const ITEMS: Record<string, ItemDefinition> = {
  // --- Tools ---
  pickaxe: { id: 'pickaxe', name: '镐子', type: 'tool', icon: '⛏️', description: '用来碎石。', price: 0, sellPrice: 0 },
  axe: { id: 'axe', name: '斧头', type: 'tool', icon: '🪓', description: '用来砍树。', price: 0, sellPrice: 0 },
  watering: { id: 'watering', name: '喷壶', type: 'tool', icon: '💧', description: '用来浇水。', price: 0, sellPrice: 0 },
  hoe: { id: 'hoe', name: '锄头', type: 'tool', icon: '🗡️', description: '用来耕地。', price: 0, sellPrice: 0 },
  scythe: { id: 'scythe', name: '镰刀', type: 'tool', icon: '🌾', description: '用来割草。', price: 0, sellPrice: 0 },
  fishing_rod: { id: 'fishing_rod', name: '鱼竿', type: 'tool', icon: '🎣', description: '用来钓鱼。', price: 500, sellPrice: 0 },
  milk_pail: { id: 'milk_pail', name: '挤奶桶', type: 'tool', icon: '🥛', description: '用来收集牛奶。', price: 1000, sellPrice: 0 },
  shears: { id: 'shears', name: '大剪刀', type: 'tool', icon: '✂️', description: '用来收集羊毛。', price: 1000, sellPrice: 0 },
  pan: { id: 'pan', name: '铜锅', type: 'tool', icon: '🥘', description: '用来从水中淘取矿石。', price: 2500, sellPrice: 0 },
  wand: { id: 'wand', name: '回程魔杖', type: 'tool', icon: '🪄', description: '瞬间回到家门口。', price: 2000000, sellPrice: 0 },

  copper_pickaxe: { id: 'copper_pickaxe', name: '铜镐', type: 'tool', icon: '⛏️', description: '可以击碎大石头。', price: 2000, sellPrice: 0 },
  steel_pickaxe: { id: 'steel_pickaxe', name: '铁镐', type: 'tool', icon: '⛏️', description: '可以击碎陨石。', price: 5000, sellPrice: 0 },
  gold_pickaxe: { id: 'gold_pickaxe', name: '金镐', type: 'tool', icon: '⛏️', description: '强力镐子。', price: 10000, sellPrice: 0 },
  iridium_pickaxe: { id: 'iridium_pickaxe', name: '铱镐', type: 'tool', icon: '⛏️', description: '最强的镐子。', price: 25000, sellPrice: 0 },

  copper_axe: { id: 'copper_axe', name: '铜斧', type: 'tool', icon: '🪓', description: '可以砍大树桩。', price: 2000, sellPrice: 0 },
  steel_axe: { id: 'steel_axe', name: '铁斧', type: 'tool', icon: '🪓', description: '可以砍原木。', price: 5000, sellPrice: 0 },
  gold_axe: { id: 'gold_axe', name: '金斧', type: 'tool', icon: '🪓', description: '强力斧头。', price: 10000, sellPrice: 0 },
  iridium_axe: { id: 'iridium_axe', name: '铱斧', type: 'tool', icon: '🪓', description: '最强的斧头。', price: 25000, sellPrice: 0 },

  // --- Weapons ---
  rusty_sword: { id: 'rusty_sword', name: '生锈的剑', type: 'weapon', icon: '🗡️', description: '一把古老的剑。', price: 0, sellPrice: 50 },
  wooden_blade: { id: 'wooden_blade', name: '木剑', type: 'weapon', icon: '🗡️', description: '练习用的剑。', price: 250, sellPrice: 100 },
  iron_edge: { id: 'iron_edge', name: '铁剑', type: 'weapon', icon: '🗡️', description: '普通的铁剑。', price: 500, sellPrice: 200 },
  silver_saber: { id: 'silver_saber', name: '银军刀', type: 'weapon', icon: '🗡️', description: '闪闪发光。', price: 750, sellPrice: 300 },
  obsidian_edge: { id: 'obsidian_edge', name: '黑曜石剑', type: 'weapon', icon: '🗡️', description: '极其锋利。', price: 0, sellPrice: 500 },
  lava_katana: { id: 'lava_katana', name: '熔岩武士刀', type: 'weapon', icon: '🗡️', description: '在岩浆中锻造。', price: 25000, sellPrice: 1000 },
  galaxy_sword: { id: 'galaxy_sword', name: '银河剑', type: 'weapon', icon: '⚔️', description: '它是独一无二的。', price: 0, sellPrice: 2000 },

  // --- Resources ---
  wood: { id: 'wood', name: '木材', type: 'resource', icon: '🪵', description: '坚固而柔韧的植物材料，用途广泛。', price: 10, sellPrice: 2 },
  stone: { id: 'stone', name: '石头', type: 'resource', icon: '🪨', description: '一种常见的材料，用途广泛。', price: 20, sellPrice: 2 },
  fiber: { id: 'fiber', name: '纤维', type: 'resource', icon: '🧶', description: '源于植物的原材料。', price: 0, sellPrice: 1 },
  clay: { id: 'clay', name: '黏土', type: 'resource', icon: '🧱', description: '用于制作工艺和建筑。', price: 0, sellPrice: 20 },
  coal: { id: 'coal', name: '煤炭', type: 'resource', icon: '⚫', description: '一种可燃的岩石，非常有用的制作材料。', price: 150, sellPrice: 15 },
  sap: { id: 'sap', name: '树液', type: 'resource', icon: '💧', description: '树里取出来的液体。', price: 0, sellPrice: 2, canEat: true, energy: -2 },
  hardwood: { id: 'hardwood', name: '硬木', type: 'resource', icon: '🪵', description: '一种特殊的木材，具有超强的强度和美感。', price: 0, sellPrice: 15 },
  battery_pack: { id: 'battery_pack', name: '电池组', type: 'resource', icon: '🔋', description: '充满了能量。', price: 0, sellPrice: 500 },

  // --- Ores & Bars ---
  copper_ore: { id: 'copper_ore', name: '铜矿石', type: 'resource', icon: '🟤', description: '一种常见的矿石，可以熔炼成铜锭。', price: 75, sellPrice: 5 },
  iron_ore: { id: 'iron_ore', name: '铁矿石', type: 'resource', icon: '⚪', description: '一种常见的矿石，可以熔炼成铁锭。', price: 150, sellPrice: 10 },
  gold_ore: { id: 'gold_ore', name: '金矿石', type: 'resource', icon: '🟡', description: '一种珍贵的矿石，可以熔炼成金锭。', price: 400, sellPrice: 25 },
  iridium_ore: { id: 'iridium_ore', name: '铱矿石', type: 'resource', icon: '🟣', description: '一种具有许多奇特特性的稀有矿石。', price: 0, sellPrice: 100 },
  quartz: { id: 'quartz', name: '石英', type: 'mineral', icon: '💎', description: '一种透明的晶体。', price: 0, sellPrice: 25 },
  earth_crystal: { id: 'earth_crystal', name: '地晶', type: 'mineral', icon: '💎', description: '在接近地表的地方发现。', price: 0, sellPrice: 50 },
  frozen_tear: { id: 'frozen_tear', name: '冰封眼泪', type: 'mineral', icon: '💎', description: '据说它是雪怪的眼泪。', price: 0, sellPrice: 75 },
  fire_quartz: { id: 'fire_quartz', name: '火水晶', type: 'mineral', icon: '💎', description: '散发着微热。', price: 0, sellPrice: 100 },
  prismatic_shard: { id: 'prismatic_shard', name: '五彩碎片', type: 'mineral', icon: '🌈', description: '极其稀有和强大的物质。', price: 0, sellPrice: 2000 },

  copper_bar: { id: 'copper_bar', name: '铜锭', type: 'resource', icon: '🧱', description: '一锭纯铜。', price: 0, sellPrice: 60 },
  iron_bar: { id: 'iron_bar', name: '铁锭', type: 'resource', icon: '🧱', description: '一锭纯铁。', price: 0, sellPrice: 120 },
  gold_bar: { id: 'gold_bar', name: '金锭', type: 'resource', icon: '🧱', description: '一锭纯金。', price: 0, sellPrice: 250 },
  iridium_bar: { id: 'iridium_bar', name: '铱锭', type: 'resource', icon: '🧱', description: '一锭纯铱。', price: 0, sellPrice: 1000 },
  refined_quartz: { id: 'refined_quartz', name: '精炼石英', type: 'resource', icon: '💎', description: '更纯净的石英。', price: 0, sellPrice: 50 },

  // --- Animal Products ---
  egg: { id: 'egg', name: '鸡蛋', type: 'resource', icon: '🥚', description: '普通的白鸡蛋。', price: 0, sellPrice: 50, canEat: true, energy: 25 },
  large_egg: { id: 'large_egg', name: '大鸡蛋', type: 'resource', icon: '🥚', description: '这是一个非常大的白鸡蛋！', price: 0, sellPrice: 95, canEat: true, energy: 38 },
  brown_egg: { id: 'brown_egg', name: '棕色鸡蛋', type: 'resource', icon: '🥚', description: '普通的棕色鸡蛋。', price: 0, sellPrice: 50, canEat: true, energy: 25 },
  large_brown_egg: { id: 'large_brown_egg', name: '大棕色鸡蛋', type: 'resource', icon: '🥚', description: '这是一个非常大的棕色鸡蛋！', price: 0, sellPrice: 95, canEat: true, energy: 38 },
  duck_egg: { id: 'duck_egg', name: '鸭蛋', type: 'resource', icon: '🥚', description: '还热着呢。', price: 0, sellPrice: 95, canEat: true, energy: 38 },
  void_egg: { id: 'void_egg', name: '虚空蛋', type: 'resource', icon: '🌑', description: '散发着黑暗能量的漆黑的蛋。', price: 0, sellPrice: 65, canEat: true, energy: 38 },
  milk: { id: 'milk', name: '牛奶', type: 'resource', icon: '🥛', description: '营养丰富。', price: 0, sellPrice: 125, canEat: true, energy: 38 },
  large_milk: { id: 'large_milk', name: '大壶牛奶', type: 'resource', icon: '🥛', description: '一大壶牛奶。', price: 0, sellPrice: 190, canEat: true, energy: 50 },
  goat_milk: { id: 'goat_milk', name: '羊奶', type: 'resource', icon: '🥛', description: '山羊产的奶。', price: 0, sellPrice: 225, canEat: true, energy: 63 },
  large_goat_milk: { id: 'large_goat_milk', name: '大壶羊奶', type: 'resource', icon: '🥛', description: '一大壶山羊奶。', price: 0, sellPrice: 345, canEat: true, energy: 88 },
  wool: { id: 'wool', name: '羊毛', type: 'resource', icon: '🧶', description: '柔软的毛。', price: 0, sellPrice: 340 },
  duck_feather: { id: 'duck_feather', name: '鸭毛', type: 'resource', icon: '🪶', description: '它是如此的五彩斑斓。', price: 0, sellPrice: 250 },
  rabbits_foot: { id: 'rabbits_foot', name: '兔子的脚', type: 'resource', icon: '🐾', description: '据说这会给你带来好运。', price: 0, sellPrice: 565 },
  truffle: { id: 'truffle', name: '松露', type: 'resource', icon: '🍄', description: '一种名贵的菌类。', price: 0, sellPrice: 625, canEat: true, energy: 13 },
  
  // --- Artisan Goods ---
  mayonnaise: { id: 'mayonnaise', name: '蛋黄酱', type: 'artisan', icon: '🏺', description: '看起来很适合抹在面包上。', price: 0, sellPrice: 190, canEat: true, energy: 50 },
  duck_mayonnaise: { id: 'duck_mayonnaise', name: '鸭蛋黄酱', type: 'artisan', icon: '🏺', description: '浓郁的黄色酱。', price: 0, sellPrice: 375, canEat: true, energy: 50 },
  void_mayonnaise: { id: 'void_mayonnaise', name: '虚空蛋黄酱', type: 'artisan', icon: '🏺', description: '粘稠的黑色酱，闻起来像是烧焦的头发。', price: 0, sellPrice: 275, canEat: true, energy: -50 },
  cheese: { id: 'cheese', name: '奶酪', type: 'artisan', icon: '🧀', description: '普通的奶酪。', price: 0, sellPrice: 230, canEat: true, energy: 125 },
  goat_cheese: { id: 'goat_cheese', name: '山羊奶酪', type: 'artisan', icon: '🧀', description: '用羊奶制成的软奶酪。', price: 0, sellPrice: 400, canEat: true, energy: 125 },
  cloth: { id: 'cloth', name: '布料', type: 'artisan', icon: '🧶', description: '一卷精细的羊毛布。', price: 0, sellPrice: 470 },
  truffle_oil: { id: 'truffle_oil', name: '松露油', type: 'artisan', icon: '🍾', description: '美食家必备的烹饪配料。', price: 0, sellPrice: 1065, canEat: true, energy: 38 },
  wine: { id: 'wine', name: '果酒', type: 'artisan', icon: '🍷', description: '随时间流逝而愈发珍贵。', price: 0, sellPrice: 400, canEat: true, energy: 50 },
  juice: { id: 'juice', name: '果汁', type: 'artisan', icon: '🧃', description: '纯净的果汁。', price: 0, sellPrice: 200, canEat: true, energy: 75 },
  jelly: { id: 'jelly', name: '果酱', type: 'artisan', icon: '🍯', description: '粘稠可口。', price: 0, sellPrice: 160, canEat: true, energy: 50 },
  pickles: { id: 'pickles', name: '腌菜', type: 'artisan', icon: '🥒', description: '一罐自家腌制的泡菜。', price: 0, sellPrice: 100, canEat: true, energy: 25 },
  honey: { id: 'honey', name: '蜂蜜', type: 'artisan', icon: '🍯', description: '这是蜜蜂辛勤工作的结晶。', price: 0, sellPrice: 100, canEat: true, energy: 0 },

  // --- Spring Crops & Seeds ---
  parsnip_seeds: { id: 'parsnip_seeds', name: '防风草种子', type: 'seed', icon: '🥔', description: '在春天种植。', price: 20, sellPrice: 10, cropType: 'parsnip' },
  parsnip: { id: 'parsnip', name: '防风草', type: 'crop', icon: '🥔', description: '一种和胡萝卜很像的春季块茎植物。', price: 0, sellPrice: 35, canEat: true, energy: 25 },
  
  bean_starter: { id: 'bean_starter', name: '青豆种子', type: 'seed', icon: '🫘', description: '在春天种植。', price: 60, sellPrice: 30, cropType: 'bean' },
  green_bean: { id: 'green_bean', name: '青豆', type: 'crop', icon: '🫘', description: '口感爽脆的小豆子。', price: 0, sellPrice: 40, canEat: true, energy: 25 },
  
  cauliflower_seeds: { id: 'cauliflower_seeds', name: '花椰菜种子', type: 'seed', icon: '🥦', description: '在春天种植。', price: 80, sellPrice: 40, cropType: 'cauliflower' },
  cauliflower: { id: 'cauliflower', name: '花椰菜', type: 'crop', icon: '🥦', description: '非常有价值，但是生长缓慢。', price: 0, sellPrice: 175, canEat: true, energy: 75 },
  
  potato_seeds: { id: 'potato_seeds', name: '土豆种子', type: 'seed', icon: '🥔', description: '在春天种植。', price: 50, sellPrice: 25, cropType: 'potato' },
  potato: { id: 'potato', name: '土豆', type: 'crop', icon: '🥔', description: '栽种范围很广的块茎植物。', price: 0, sellPrice: 80, canEat: true, energy: 25 },
  
  garlic_seeds: { id: 'garlic_seeds', name: '大蒜种子', type: 'seed', icon: '🧄', description: '在春天种植。', price: 40, sellPrice: 20, cropType: 'garlic' },
  garlic: { id: 'garlic', name: '大蒜', type: 'crop', icon: '🧄', description: '为菜肴增添风味。', price: 0, sellPrice: 60, canEat: true, energy: 20 },
  
  kale_seeds: { id: 'kale_seeds', name: '甘蓝种子', type: 'seed', icon: '🥬', description: '在春天种植。', price: 70, sellPrice: 35, cropType: 'kale' },
  kale: { id: 'kale', name: '甘蓝', type: 'crop', icon: '🥬', description: '叶子可以用来炒菜或做汤。', price: 0, sellPrice: 110, canEat: true, energy: 50 },
  
  strawberry_seeds: { id: 'strawberry_seeds', name: '草莓种子', type: 'seed', icon: '🍓', description: '在春天种植。', price: 100, sellPrice: 0, cropType: 'strawberry' },
  strawberry: { id: 'strawberry', name: '草莓', type: 'crop', icon: '🍓', description: '味道鲜美，颜色鲜艳。', price: 0, sellPrice: 120, canEat: true, energy: 50 },

  tulip_bulb: { id: 'tulip_bulb', name: '郁金香球茎', type: 'seed', icon: '🌷', description: '在春天种植。', price: 20, sellPrice: 10, cropType: 'tulip' },
  tulip: { id: 'tulip', name: '郁金香', type: 'crop', icon: '🌷', description: '最受欢迎的春天花朵。', price: 0, sellPrice: 30, canEat: true, energy: 45 },

  // --- Summer Crops & Seeds ---
  melon_seeds: { id: 'melon_seeds', name: '甜瓜种子', type: 'seed', icon: '🍈', description: '在夏天种植。', price: 80, sellPrice: 40, cropType: 'melon' },
  melon: { id: 'melon', name: '甜瓜', type: 'crop', icon: '🍈', description: '凉爽、香甜的夏日食品。', price: 0, sellPrice: 250, canEat: true, energy: 113 },
  
  tomato_seeds: { id: 'tomato_seeds', name: '番茄种子', type: 'seed', icon: '🍅', description: '在夏天种植。', price: 50, sellPrice: 25, cropType: 'tomato' },
  tomato: { id: 'tomato', name: '番茄', type: 'crop', icon: '🍅', description: '口感浓郁，微酸。', price: 0, sellPrice: 60, canEat: true, energy: 20 },
  
  blueberry_seeds: { id: 'blueberry_seeds', name: '蓝莓种子', type: 'seed', icon: '🫐', description: '在夏天种植。', price: 80, sellPrice: 40, cropType: 'blueberry' },
  blueberry: { id: 'blueberry', name: '蓝莓', type: 'crop', icon: '🫐', description: '一种据说有多种健康益处的浆果。', price: 0, sellPrice: 50, canEat: true, energy: 25 },
  
  hot_pepper_seeds: { id: 'hot_pepper_seeds', name: '辣椒种子', type: 'seed', icon: '🌶️', description: '在夏天种植。', price: 40, sellPrice: 20, cropType: 'hot_pepper' },
  hot_pepper: { id: 'hot_pepper', name: '辣椒', type: 'crop', icon: '🌶️', description: '火辣辣的。', price: 0, sellPrice: 40, canEat: true, energy: 13 },
  
  wheat_seeds: { id: 'wheat_seeds', name: '小麦种子', type: 'seed', icon: '🌾', description: '在夏秋两季种植。', price: 10, sellPrice: 5, cropType: 'wheat' },
  wheat: { id: 'wheat', name: '小麦', type: 'crop', icon: '🌾', description: '被广泛种植的谷物。', price: 0, sellPrice: 25, canEat: false },
  
  corn_seeds: { id: 'corn_seeds', name: '玉米种子', type: 'seed', icon: '🌽', description: '在夏秋两季种植。', price: 150, sellPrice: 75, cropType: 'corn' },
  corn: { id: 'corn', name: '玉米', type: 'crop', icon: '🌽', description: '一种最常见的庄稼。', price: 0, sellPrice: 50, canEat: true, energy: 25 },

  // --- Fall Crops & Seeds ---
  pumpkin_seeds: { id: 'pumpkin_seeds', name: '南瓜种子', type: 'seed', icon: '🎃', description: '在秋天种植。', price: 100, sellPrice: 50, cropType: 'pumpkin' },
  pumpkin: { id: 'pumpkin', name: '南瓜', type: 'crop', icon: '🎃', description: '秋天的最爱。', price: 0, sellPrice: 320, canEat: true, energy: 0 },
  
  eggplant_seeds: { id: 'eggplant_seeds', name: '茄子种子', type: 'seed', icon: '🍆', description: '在秋天种植。', price: 20, sellPrice: 10, cropType: 'eggplant' },
  eggplant: { id: 'eggplant', name: '茄子', type: 'crop', icon: '🍆', description: '浓郁而有益健康的美味。', price: 0, sellPrice: 60, canEat: true, energy: 20 },
  
  yam_seeds: { id: 'yam_seeds', name: '山药种子', type: 'seed', icon: '🍠', description: '在秋天种植。', price: 60, sellPrice: 30, cropType: 'yam' },
  yam: { id: 'yam', name: '山药', type: 'crop', icon: '🍠', description: '含淀粉的块茎植物。', price: 0, sellPrice: 160, canEat: true, energy: 45 },
  
  cranberry_seeds: { id: 'cranberry_seeds', name: '蔓越莓种子', type: 'seed', icon: '🍒', description: '在秋天种植。', price: 240, sellPrice: 120, cropType: 'cranberry' },
  cranberry: { id: 'cranberry', name: '蔓越莓', type: 'crop', icon: '🍒', description: '酸酸甜甜的红色浆果。', price: 0, sellPrice: 75, canEat: true, energy: 38 },
  
  grape_starter: { id: 'grape_starter', name: '葡萄种子', type: 'seed', icon: '🍇', description: '在秋天种植。', price: 60, sellPrice: 30, cropType: 'grape' },
  grape: { id: 'grape', name: '葡萄', type: 'crop', icon: '🍇', description: '一串串甜美的水果。', price: 0, sellPrice: 80, canEat: true, energy: 38 },

  // --- Forage ---
  dandelion: { id: 'dandelion', name: '蒲公英', type: 'resource', icon: '🌼', description: '虽然并不漂亮，但是叶子可以做沙拉。', price: 0, sellPrice: 40, canEat: true, energy: 25 },
  daffodil: { id: 'daffodil', name: '黄水仙', type: 'resource', icon: '🌼', description: '传统的春天花朵。', price: 0, sellPrice: 30, canEat: false, energy: 0 },
  leek: { id: 'leek', name: '韭葱', type: 'resource', icon: '🧅', description: '洋葱的美味近亲。', price: 0, sellPrice: 60, canEat: true, energy: 40 },
  wild_horseradish: { id: 'wild_horseradish', name: '野山葵', type: 'resource', icon: '🌿', description: '一种辛辣的根茎植物。', price: 0, sellPrice: 50, canEat: true, energy: 13 },
  
  sweet_pea: { id: 'sweet_pea', name: '香豌豆', type: 'resource', icon: '🌸', description: '芬芳的夏日花朵。', price: 0, sellPrice: 50, canEat: false },
  spice_berry: { id: 'spice_berry', name: '香料浆果', type: 'resource', icon: '🫐', description: '让空气中充满了辛辣的香味。', price: 0, sellPrice: 80, canEat: true, energy: 25 },
  grape_forage: { id: 'grape_forage', name: '葡萄', type: 'resource', icon: '🍇', description: '一串串甜美的水果。', price: 0, sellPrice: 80, canEat: true, energy: 38 },

  common_mushroom: { id: 'common_mushroom', name: '普通蘑菇', type: 'resource', icon: '🍄', description: '稍有坚果味，口感不错。', price: 0, sellPrice: 40, canEat: true, energy: 38 },
  wild_plum: { id: 'wild_plum', name: '野李子', type: 'resource', icon: '🫐', description: '酸甜多汁。', price: 0, sellPrice: 80, canEat: true, energy: 25 },
  hazelnut: { id: 'hazelnut', name: '榛子', type: 'resource', icon: '🌰', description: '好大一颗榛子！', price: 0, sellPrice: 90, canEat: true, energy: 30 },
  blackberry: { id: 'blackberry', name: '黑莓', type: 'resource', icon: '🫐', description: '早秋的美味。', price: 0, sellPrice: 20, canEat: true, energy: 25 },
  
  winter_root: { id: 'winter_root', name: '冬根', type: 'resource', icon: '🍠', description: '一种含淀粉的块茎。', price: 0, sellPrice: 70, canEat: true, energy: 25 },
  crystal_fruit: { id: 'crystal_fruit', name: '水晶果', type: 'resource', icon: '❄️', description: '一种只有在寒冷季节才生长的精致水果。', price: 0, sellPrice: 150, canEat: true, energy: 63 },
  snow_yam: { id: 'snow_yam', name: '雪山药', type: 'resource', icon: '🍠', description: '一种可以隐藏在雪下的美味。', price: 0, sellPrice: 100, canEat: true, energy: 30 },
  crocus: { id: 'crocus', name: '番红花', type: 'resource', icon: '🌷', description: '一种可以在冬天开花的植物。', price: 0, sellPrice: 60, canEat: false },
  holly: { id: 'holly', name: '冬青', type: 'resource', icon: '🌿', description: '叶子和鲜红的浆果让它成为极受欢迎的冬季装饰品。', price: 0, sellPrice: 80, canEat: false },

  // --- Fish ---
  pufferfish: { id: 'pufferfish', name: '河豚', type: 'fish', icon: '🐡', description: '受惊时会涨大。', price: 0, sellPrice: 200, canEat: true, energy: -100 },
  anchovy: { id: 'anchovy', name: '鳀鱼', type: 'fish', icon: '🐟', description: '海里的小鱼。', price: 0, sellPrice: 30, canEat: true, energy: 13 },
  tuna: { id: 'tuna', name: '金枪鱼', type: 'fish', icon: '🐟', description: '一种生活在海里的大鱼。', price: 0, sellPrice: 100, canEat: true, energy: 38 },
  sardine: { id: 'sardine', name: '沙丁鱼', type: 'fish', icon: '🐟', description: '一种常见的海鱼。', price: 0, sellPrice: 40, canEat: true, energy: 13 },
  bream: { id: 'bream', name: '比目鱼', type: 'fish', icon: '🐟', description: '一种常见的河鱼。', price: 0, sellPrice: 45, canEat: true, energy: 13 },
  largemouth_bass: { id: 'largemouth_bass', name: '大嘴鲈鱼', type: 'fish', icon: '🐟', description: '一种生活在湖里的淡水鱼。', price: 0, sellPrice: 100, canEat: true, energy: 38 },
  smallmouth_bass: { id: 'smallmouth_bass', name: '小嘴鲈鱼', type: 'fish', icon: '🐟', description: '一种生活在河里的淡水鱼。', price: 0, sellPrice: 50, canEat: true, energy: 25 },
  rainbow_trout: { id: 'rainbow_trout', name: '虹鳟鱼', type: 'fish', icon: '🐟', description: '一种生活在河里的淡水鱼。', price: 0, sellPrice: 65, canEat: true, energy: 25 },
  salmon: { id: 'salmon', name: '鲑鱼', type: 'fish', icon: '🐟', description: '在产卵期会游回上游。', price: 0, sellPrice: 75, canEat: true, energy: 38 },
  walleye: { id: 'walleye', name: '大眼鱼', type: 'fish', icon: '🐟', description: '一种夜行性淡水鱼。', price: 0, sellPrice: 105, canEat: true, energy: 30 },
  perch: { id: 'perch', name: '河鲈', type: 'fish', icon: '🐟', description: '一种生活在湖里的淡水鱼。', price: 0, sellPrice: 55, canEat: true, energy: 25 },
  carp: { id: 'carp', name: '鲤鱼', type: 'fish', icon: '🐟', description: '一种常见的池塘鱼。', price: 0, sellPrice: 30, canEat: true, energy: 13 },
  catfish: { id: 'catfish', name: '鲶鱼', type: 'fish', icon: '🐟', description: '一种不常见的鱼，喜欢在雨天出没。', price: 0, sellPrice: 200, canEat: true, energy: 50 },
  pike: { id: 'pike', name: '狗鱼', type: 'fish', icon: '🐟', description: '一种凶猛的淡水鱼。', price: 0, sellPrice: 100, canEat: true, energy: 38 },
  sunfish: { id: 'sunfish', name: '太阳鱼', type: 'fish', icon: '🐟', description: '一种常见的河鱼。', price: 0, sellPrice: 30, canEat: true, energy: 13 },
  red_mullet: { id: 'red_mullet', name: '红鲻鱼', type: 'fish', icon: '🐟', description: '一种生活在海里的鱼。', price: 0, sellPrice: 75, canEat: true, energy: 25 },
  herring: { id: 'herring', name: '鲱鱼', type: 'fish', icon: '🐟', description: '一种常见的海鱼。', price: 0, sellPrice: 30, canEat: true, energy: 13 },
  eel: { id: 'eel', name: '鳗鱼', type: 'fish', icon: '🐟', description: '长得像蛇一样的鱼。', price: 0, sellPrice: 85, canEat: true, energy: 30 },
  octopus: { id: 'octopus', name: '章鱼', type: 'fish', icon: '🐙', description: '一种神秘而聪明的生物。', price: 0, sellPrice: 150, canEat: true, energy: 0 },
  red_snapper: { id: 'red_snapper', name: '红鲷鱼', type: 'fish', icon: '🐟', description: '一种颜色鲜艳的海鱼。', price: 0, sellPrice: 60, canEat: true, energy: 25 },
  squid: { id: 'squid', name: '鱿鱼', type: 'fish', icon: '🦑', description: '一种深海生物。', price: 0, sellPrice: 80, canEat: true, energy: 25 },
  sea_cucumber: { id: 'sea_cucumber', name: '海参', type: 'fish', icon: '🥒', description: '一种粘糊糊的生物。', price: 0, sellPrice: 75, canEat: true, energy: 0 },
  super_cucumber: { id: 'super_cucumber', name: '超级海参', type: 'fish', icon: '🥒', description: '一种稀有的紫色海参。', price: 0, sellPrice: 250, canEat: true, energy: 125 },

  // --- Food ---
  bread: { id: 'bread', name: '面包', type: 'food', icon: '🍞', description: '恢复体力的食物。', price: 120, sellPrice: 60, canEat: true, energy: 50 },
  fried_egg: { id: 'fried_egg', name: '煎蛋', type: 'food', icon: '🍳', description: '简单的早餐。', price: 0, sellPrice: 35, canEat: true, energy: 50 },
  omelet: { id: 'omelet', name: '煎蛋卷', type: 'food', icon: '🍳', description: '美味的早餐。', price: 0, sellPrice: 125, canEat: true, energy: 100 },
  salad: { id: 'salad', name: '沙拉', type: 'food', icon: '🥗', description: '健康的午餐。', price: 220, sellPrice: 110, canEat: true, energy: 113 },
  cheese_cauliflower: { id: 'cheese_cauliflower', name: '奶酪花椰菜', type: 'food', icon: '🍲', description: '味道好极了！', price: 0, sellPrice: 300, canEat: true, energy: 138 },
  parsnip_soup: { id: 'parsnip_soup', name: '防风草汤', type: 'food', icon: '🍲', description: '新鲜又丰盛。', price: 0, sellPrice: 120, canEat: true, energy: 85 },
  vegetable_medley: { id: 'vegetable_medley', name: '蔬菜什锦', type: 'food', icon: '🍲', description: '非常有营养。', price: 0, sellPrice: 120, canEat: true, energy: 165 },
  complete_breakfast: { id: 'complete_breakfast', name: '完美早餐', type: 'food', icon: '🥞', description: '让你精力充沛一整天。', price: 0, sellPrice: 350, canEat: true, energy: 200 },
  fried_calamari: { id: 'fried_calamari', name: '炸鱿鱼', type: 'food', icon: '🍤', description: '非常有嚼劲。', price: 0, sellPrice: 150, canEat: true, energy: 80 },
  lucky_lunch: { id: 'lucky_lunch', name: '幸运午餐', type: 'food', icon: '🍱', description: '特别的一餐。', price: 0, sellPrice: 250, canEat: true, energy: 100 },
  pizza: { id: 'pizza', name: '披萨', type: 'food', icon: '🍕', description: '大家都爱吃。', price: 600, sellPrice: 300, canEat: true, energy: 150 },
  sashimi: { id: 'sashimi', name: '生鱼片', type: 'food', icon: '🍣', description: '切成薄片的生鱼。', price: 0, sellPrice: 75, canEat: true, energy: 75 },
  maki_roll: { id: 'maki_roll', name: '寿司卷', type: 'food', icon: '🍣', description: '米饭和鱼被海苔包裹。', price: 0, sellPrice: 220, canEat: true, energy: 100 },
  tortilla: { id: 'tortilla', name: '玉米饼', type: 'food', icon: '🌮', description: '可以用作其他食物的容器，也可以直接吃。', price: 0, sellPrice: 50, canEat: true, energy: 50 },

  // --- Crafting Items ---
  chest: { id: 'chest', name: '箱子', type: 'furniture', icon: '📦', description: '用来储存物品。', price: 0, sellPrice: 0 },
  furnace: { id: 'furnace', name: '熔炉', type: 'furniture', icon: '🔥', description: '把矿石熔炼成锭。', price: 0, sellPrice: 0 },
  scarecrow: { id: 'scarecrow', name: '稻草人', type: 'furniture', icon: '☃️', description: '防止乌鸦吃掉作物。', price: 0, sellPrice: 0 },
  seed_maker: { id: 'seed_maker', name: '种子生产器', type: 'furniture', icon: '🌱', description: '把庄稼变成种子。', price: 0, sellPrice: 0 },
  recycling_machine: { id: 'recycling_machine', name: '回收机', type: 'furniture', icon: '♻️', description: '把垃圾变成有用的物品。', price: 0, sellPrice: 0 },
  mayonnaise_machine: { id: 'mayonnaise_machine', name: '蛋黄酱机', type: 'furniture', icon: '🥛', description: '把鸡蛋加工成蛋黄酱。', price: 0, sellPrice: 0 },
  cheese_press: { id: 'cheese_press', name: '奶酪机', type: 'furniture', icon: '🧀', description: '把牛奶加工成奶酪。', price: 0, sellPrice: 0 },
  preserves_jar: { id: 'preserves_jar', name: '腌菜桶', type: 'furniture', icon: '🏺', description: '把蔬菜变成腌菜，把水果变成果酱。', price: 0, sellPrice: 0 },
  keg: { id: 'keg', name: '小桶', type: 'furniture', icon: '🍺', description: '把蔬菜变成汁，把水果变成酒。', price: 0, sellPrice: 0 },
  loom: { id: 'loom', name: '织布机', type: 'furniture', icon: '🧶', description: '把羊毛织成精细的布。', price: 0, sellPrice: 0 },
  oil_maker: { id: 'oil_maker', name: '榨油机', type: 'furniture', icon: '🛢️', description: '把松露榨成美味的油。', price: 0, sellPrice: 0 },

  wood_fence: { id: 'wood_fence', name: '木围栏', type: 'furniture', icon: '🚧', description: '阻挡动物和怪物。', price: 0, sellPrice: 0 },
  stone_fence: { id: 'stone_fence', name: '石围栏', type: 'furniture', icon: '🪨', description: '坚固的围栏。', price: 0, sellPrice: 0 },
  iron_fence: { id: 'iron_fence', name: '铁围栏', type: 'furniture', icon: '⛓️', description: '非常耐用的围栏。', price: 0, sellPrice: 0 },
  gate: { id: 'gate', name: '大门', type: 'furniture', icon: '🚪', description: '允许通过围栏。', price: 0, sellPrice: 0 },
  
  torch: { id: 'torch', name: '火把', type: 'furniture', icon: '🔥', description: '提供照明。', price: 0, sellPrice: 0 },
  campfire: { id: 'campfire', name: '营火', type: 'furniture', icon: '🔥', description: '提供温暖和照明。', price: 0, sellPrice: 0 },
  
  basic_fertilizer: { id: 'basic_fertilizer', name: '基础肥料', type: 'misc', icon: '💩', description: '提高土壤质量。', price: 100, sellPrice: 2 },
  quality_fertilizer: { id: 'quality_fertilizer', name: '优质肥料', type: 'misc', icon: '💩', description: '大大提高土壤质量。', price: 150, sellPrice: 10 },
  speed_gro: { id: 'speed_gro', name: '生长激素', type: 'misc', icon: '⚡', description: '促进作物生长。', price: 100, sellPrice: 20 },
  
  sprinkler: { id: 'sprinkler', name: '洒水器', type: 'furniture', icon: '🚿', description: '每天早上给邻近的4个地块浇水。', price: 0, sellPrice: 0 },
  quality_sprinkler: { id: 'quality_sprinkler', name: '优质洒水器', type: 'furniture', icon: '🚿', description: '每天早上给邻近的8个地块浇水。', price: 0, sellPrice: 0 },
  iridium_sprinkler: { id: 'iridium_sprinkler', name: '铱洒水器', type: 'furniture', icon: '🚿', description: '每天早上给邻近的24个地块浇水。', price: 0, sellPrice: 0 },

  // --- Trash ---
  trash: { id: 'trash', name: '垃圾', type: 'trash', icon: '🗑️', description: '没用的垃圾。', price: 0, sellPrice: 0 },
  driftwood: { id: 'driftwood', name: '漂流木', type: 'trash', icon: '🪵', description: '从海里漂来的木头。', price: 0, sellPrice: 0 },
  broken_glasses: { id: 'broken_glasses', name: '破碎的眼镜', type: 'trash', icon: '👓', description: '看起来像是被人丢弃的。', price: 0, sellPrice: 0 },
  broken_cd: { id: 'broken_cd', name: '破碎的光盘', type: 'trash', icon: '💿', description: '这已经是以前的技术了。', price: 0, sellPrice: 0 },
  soggy_newspaper: { id: 'soggy_newspaper', name: '湿报纸', type: 'trash', icon: '📰', description: '字迹已经模糊不清了。', price: 0, sellPrice: 0 },
}
