export interface NPC {
  id: string
  name: string
  location: string
  x: number // Grid X
  y: number // Grid Y
  direction?: 'up' | 'down' | 'left' | 'right'
  spriteColor: number
  dialogues: string[]
  currentDialogueIndex: number
  relationship: number // 0-2500 (250 per heart)
  talkedToday?: boolean
  giftedToday?: boolean
  schedule?: { time: number; location: string; x: number; y: number }[]
  isMoving?: boolean
  targetX?: number
  targetY?: number
  path?: { x: number; y: number }[]
  // Gift Preferences
  loves?: string[]
  likes?: string[]
  dislikes?: string[]
  hates?: string[]
}

export const NPCS: NPC[] = [
  {
    id: 'abigail',
    name: '阿比盖尔',
    location: 'town',
    x: 10,
    y: 8,
    spriteColor: 0x9b59b6, // Purple hair
    dialogues: [
      '嘿，你好啊！',
      '今天天气真不错。',
      '你见过我的猫吗？'
    ],
    currentDialogueIndex: 0,
    relationship: 0,
    talkedToday: false,
    loves: ['amethyst', 'pumpkin', 'pufferfish', 'purple_mushroom', 'spicy_eel', 'blackberry_cobbler', 'chocolate_cake'],
    likes: ['quartz', 'saffron_bun'],
    dislikes: ['sugar', 'wild_horseradish'],
    hates: ['clay', 'holly'],
    schedule: [
      { time: 9 * 60, location: 'town', x: 15, y: 15 },
      { time: 13 * 60, location: 'town', x: 20, y: 12 },
      { time: 18 * 60, location: 'town', x: 8, y: 10 }
    ]
  },
  {
    id: 'mayor',
    name: '刘易斯',
    location: 'town',
    x: 15,
    y: 12,
    spriteColor: 0xe67e22, // Brown hat
    dialogues: [
      '欢迎来到星露谷！',
      '我是这里的镇长。',
      '如果有困难可以找我。'
    ],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['hot_pepper', 'green_tea', 'vegetable_medley', 'glazed_yams'],
    likes: ['blueberry', 'cactus_fruit', 'coconut'],
    dislikes: ['wild_horseradish', 'clay'],
    hates: ['quartz', 'holly']
  },
  {
    id: 'pierre',
    name: '皮埃尔',
    location: 'store',
    x: 7,
    y: 5,
    spriteColor: 0x8B4513, // Brown hair/shirt
    dialogues: [
      '欢迎光临皮埃尔杂货店！',
      '需要买点种子吗？',
      '通过点击柜台来交易。'
    ],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['fried_calamari'],
    likes: ['daffodil', 'dandelion', 'egg', 'milk'],
    dislikes: ['corn', 'garlic', 'parsnip', 'potato', 'tortilla'],
    hates: ['apple'],
    schedule: [
      { time: 9 * 60, location: 'store', x: 7, y: 5 },
      { time: 17 * 60, location: 'store', x: 7, y: 8 }
    ]
  },
  {
    id: 'robin',
    name: '罗宾',
    location: 'carpenter',
    x: 7,
    y: 5,
    spriteColor: 0xd35400, // Orange hair
    dialogues: ['你好！我是木匠。', '需要升级房子吗？', '这山里的空气真好。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['goat_cheese', 'peach', 'spaghetti'],
    likes: ['hardwood', 'wood', 'stone', 'milk'],
    dislikes: ['wild_horseradish'],
    hates: ['holly'],
    schedule: [
      { time: 8 * 60, location: 'carpenter', x: 7, y: 5 },
      { time: 17 * 60, location: 'mountain', x: 20, y: 15 } // Walk around
    ]
  },
  {
    id: 'linus',
    name: '莱纳斯',
    location: 'mountain',
    x: 25,
    y: 11, // Near tent
    spriteColor: 0xecf0f1, // White hair
    dialogues: ['别介意我。', '我只是在大自然中生活。', '你是个好人。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['blueberry_tart', 'cactus_fruit', 'coconut', 'dish_o_the_sea', 'yam'],
    likes: ['chanterelle', 'common_mushroom', 'daffodil', 'dandelion', 'hazelnut', 'holly', 'leek', 'morel', 'purple_mushroom', 'snow_yam', 'spring_onion', 'wild_horseradish', 'winter_root'],
    dislikes: ['quartz', 'field_snack'],
    hates: ['carp', 'green_algae', 'white_algae'],
    schedule: [
      { time: 6 * 60, location: 'mountain', x: 25, y: 11 },
      { time: 14 * 60, location: 'mountain', x: 15, y: 15 } // Near lake
    ]
  },
  {
    id: 'willy',
    name: '威利',
    location: 'fish_shop',
    x: 6,
    y: 5,
    spriteColor: 0x34495e, // Dark cap
    dialogues: ['大海的味道...', '想学钓鱼吗？', '今天的鱼咬钩很勤。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['catfish', 'diamond', 'iridium_bar', 'octopus', 'pumpkin', 'sea_cucumber', 'sturgeon'],
    likes: ['gold_bar', 'quartz', 'lingcod', 'tiger_trout'],
    dislikes: ['chanterelle', 'common_mushroom', 'daffodil', 'dandelion', 'hazelnut', 'holly', 'leek', 'morel', 'purple_mushroom', 'snow_yam', 'spring_onion', 'wild_horseradish', 'winter_root'],
    hates: ['sashimi', 'maki_roll'],
    schedule: [
      { time: 9 * 60, location: 'fish_shop', x: 6, y: 5 },
      { time: 17 * 60, location: 'beach', x: 20, y: 15 } // Fishing on pier
    ]
  },
  {
    id: 'marnie',
    name: '玛妮',
    location: 'ranch',
    x: 7,
    y: 5,
    spriteColor: 0xe74c3c, // Reddish
    dialogues: ['动物们都很可爱。', '你需要干草吗？', '镇长...哦，没什么。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['diamond', 'farmer_lunch', 'pink_cake', 'pumpkin_pie'],
    likes: ['egg', 'milk', 'large_egg', 'large_milk', 'quartz'],
    dislikes: ['clay', 'wild_horseradish'],
    hates: ['holly'],
    schedule: [
      { time: 9 * 60, location: 'ranch', x: 7, y: 5 },
      { time: 16 * 60, location: 'town', x: 15, y: 12 } // Visit Lewis
    ]
  },
  {
    id: 'wizard',
    name: '法师',
    location: 'wizard_tower',
    x: 4,
    y: 4,
    spriteColor: 0x8e44ad, // Purple hat
    dialogues: ['我预感到会有大事发生。', '你身上有森林的气息。', '滚开，我在冥想。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['purple_mushroom', 'solar_essence', 'super_cucumber', 'void_essence'],
    likes: ['quartz', 'geode'],
    dislikes: ['slime', 'bat_wing', 'bug_meat', 'milk', 'egg'],
    hates: ['holly', 'clay'],
    schedule: [
      { time: 20 * 60, location: 'wizard_tower', x: 4, y: 4 } // Stays home mostly
    ]
  },
  {
    id: 'penny',
    name: '潘妮',
    location: 'town',
    x: 22,
    y: 20, // Near trailer/river
    spriteColor: 0xf1c40f, // Blonde
    dialogues: ['我在教文森特和贾斯。', '这里的生活很平静。', '我想读更多的书。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['diamond', 'emerald', 'melon', 'poppy', 'poppyseed_muffin', 'red_plate', 'roots_platter', 'sandfish', 'tom_kha_soup'],
    likes: ['dandelion', 'leek', 'milk'],
    dislikes: ['duck_feather', 'purple_mushroom', 'red_mushroom', 'quartz', 'wool'],
    hates: ['beer', 'wine', 'pale_ale', 'mead', 'hops', 'grape', 'rabbit_foot'],
  },
  {
    id: 'haley',
    name: '海莉',
    location: 'town',
    x: 8,
    y: 20,
    spriteColor: 0xf39c12, // Blonde
    dialogues: ['额...你的衣服有点脏。', '我想去商场。', '这里的阳光不错。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['coconut', 'fruit_salad', 'pink_cake', 'sunflower'],
    likes: ['daffodil'],
    dislikes: ['milk', 'egg', 'vegetable', 'fruit'],
    hates: ['prismatic_shard', 'clay', 'wild_horseradish']
  },
  {
    id: 'alex',
    name: '亚历克斯',
    location: 'town',
    x: 18,
    y: 18,
    spriteColor: 0x2ecc71,
    dialogues: ['我想成为职业gridball球员。', '你看见我的球了吗？', '如果在沙滩上玩耍一定很有趣。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['complete_breakfast', 'salmon_dinner'],
    likes: ['egg'],
    dislikes: ['wild_horseradish'],
    hates: ['quartz', 'holly'],
    schedule: [
      { time: 8 * 60, location: 'town', x: 18, y: 18 },
      { time: 13 * 60, location: 'town', x: 15, y: 15 },
      { time: 18 * 60, location: 'town', x: 18, y: 18 }
    ]
  },
  {
    id: 'elliott',
    name: '艾利欧特',
    location: 'beach',
    x: 25,
    y: 15,
    spriteColor: 0xe74c3c,
    dialogues: ['这片海洋给了我灵感。', '我在写一部小说。', '你的到来像一阵清新的海风。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['crab_cakes', 'duck_feather', 'lobster', 'pomegranate', 'tom_kha_soup'],
    likes: ['octopus', 'squid'],
    dislikes: ['pizza', 'quartz'],
    hates: ['amaranth', 'sea_cucumber'],
    schedule: [
      { time: 10 * 60, location: 'beach', x: 25, y: 15 },
      { time: 12 * 60, location: 'beach', x: 15, y: 15 },
      { time: 18 * 60, location: 'beach', x: 25, y: 15 }
    ]
  },
  {
    id: 'harvey',
    name: '哈维',
    location: 'harvey_clinic',
    x: 4,
    y: 4,
    spriteColor: 0x27ae60,
    dialogues: ['请注意身体健康。', '我是这里的医生。', '多吃蔬菜对你有好处。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['coffee', 'pickles', 'super_meal', 'truffle_oil', 'wine'],
    likes: ['chanterelle', 'common_mushroom', 'daffodil', 'dandelion', 'duck_egg', 'duck_feather', 'goat_milk', 'hazelnut', 'holly', 'large_goat_milk', 'morel', 'purple_mushroom', 'quartz', 'snow_yam', 'spring_onion', 'wild_horseradish', 'winter_root'],
    dislikes: ['bread', 'cheese', 'goat_cheese', 'pizza'],
    hates: ['coral', 'nautilus_shell', 'rainbow_shell', 'salmonberry', 'spice_berry'],
    schedule: [
      { time: 8 * 60, location: 'harvey_clinic', x: 4, y: 4 },
      { time: 17 * 60, location: 'town', x: 10, y: 12 }
    ]
  },
  {
    id: 'sam',
    name: '山姆',
    location: 'town',
    x: 12,
    y: 18,
    spriteColor: 0xf1c40f,
    dialogues: ['我在练吉他。', '滑板是我的最爱。', '塞巴斯蒂安是我最好的朋友。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['cactus_fruit', 'maple_bar', 'pizza', 'tigerseye'],
    likes: ['joja_cola', 'egg'],
    dislikes: ['coal', 'copper_bar', 'duck_mayonnaise', 'gold_bar', 'gold_ore', 'iridium_bar', 'iridium_ore', 'iron_bar', 'mayonnaise', 'pickles', 'refined_quartz'],
    hates: ['bone_flute', 'clay', 'holly'],
    schedule: [
      { time: 10 * 60, location: 'town', x: 12, y: 18 },
      { time: 14 * 60, location: 'town', x: 15, y: 15 },
      { time: 19 * 60, location: 'town', x: 12, y: 18 }
    ]
  },
  {
    id: 'sebastian',
    name: '塞巴斯蒂安',
    location: 'mountain',
    x: 28,
    y: 6,
    spriteColor: 0x2c3e50,
    dialogues: ['我还是更喜欢待在地下室。', '我不喜欢人多的地方。', '有人在看着我吗？'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['frozen_tear', 'obsidian', 'pumpkin_soup', 'sashimi', 'void_egg'],
    likes: ['quartz', 'flounder'],
    dislikes: ['clay', 'complete_breakfast', 'farmer_lunch', 'omelet'],
    hates: ['holly', 'pale_ale', 'beer'],
    schedule: [
      { time: 15 * 60, location: 'mountain', x: 28, y: 6 },
      { time: 19 * 60, location: 'mountain', x: 15, y: 15 },
      { time: 22 * 60, location: 'mountain', x: 28, y: 6 }
    ]
  },
  {
    id: 'shane',
    name: '谢恩',
    location: 'town',
    x: 20,
    y: 15,
    spriteColor: 0x34495e,
    dialogues: ['别烦我。', '我在Joja超市工作。', '只有鸡能理解我。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['beer', 'hot_pepper', 'pepper_poppers', 'pizza'],
    likes: ['egg'],
    dislikes: ['pickles', 'quartz'],
    hates: ['holly'],
    schedule: [
      { time: 9 * 60, location: 'town', x: 20, y: 15 },
      { time: 17 * 60, location: 'town', x: 15, y: 22 },
      { time: 22 * 60, location: 'town', x: 20, y: 15 }
    ]
  },
  {
    id: 'emily',
    name: '艾米丽',
    location: 'town',
    x: 10,
    y: 22,
    spriteColor: 0xe74c3c,
    dialogues: ['这块布料真漂亮！', '我感觉到你的能量很特别。', '你想看我跳舞吗？'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['amethyst', 'aquamarine', 'cloth', 'emerald', 'jade', 'ruby', 'survival_burger', 'topaz', 'wool'],
    likes: ['daffodil', 'quartz'],
    dislikes: ['fried_eel', 'ice_cream', 'rice_pudding', 'salmonberry', 'spicy_eel'],
    hates: ['fish_taco', 'holly', 'maki_roll', 'salmon_dinner', 'sashimi'],
    schedule: [
      { time: 12 * 60, location: 'town', x: 10, y: 22 },
      { time: 16 * 60, location: 'town', x: 15, y: 22 },
      { time: 22 * 60, location: 'town', x: 10, y: 22 }
    ]
  },
  {
    id: 'leah',
    name: '莉亚',
    location: 'forest',
    x: 18,
    y: 20,
    spriteColor: 0xd35400,
    dialogues: ['大自然是我最好的灵感来源。', '我在雕刻一个新的作品。', '这里的宁静正是我需要的。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['goat_cheese', 'poppyseed_muffin', 'salad', 'stir_fry', 'truffle', 'vegetable_medley', 'wine'],
    likes: ['chanterelle', 'common_mushroom', 'daffodil', 'dandelion', 'driftwood', 'hazelnut', 'holly', 'leek', 'morel', 'purple_mushroom', 'snow_yam', 'spring_onion', 'wild_horseradish', 'winter_root'],
    dislikes: ['bread', 'hashbrowns', 'pancakes', 'pizza', 'void_egg'],
    hates: ['biscuit', 'crocus'],
    schedule: [
      { time: 10 * 60, location: 'forest', x: 18, y: 20 },
      { time: 13 * 60, location: 'forest', x: 10, y: 10 },
      { time: 18 * 60, location: 'forest', x: 18, y: 20 }
    ]
  },
  {
    id: 'maru',
    name: '玛鲁',
    location: 'mountain',
    x: 12,
    y: 10,
    spriteColor: 0x8e44ad,
    dialogues: ['我在研究这台机器。', '小心，别碰那个！', '看星星真有趣。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['battery_pack', 'cauliflower', 'cheese_cauliflower', 'diamond', 'gold_bar', 'iridium_bar', 'miner_treat', 'pepper_poppers', 'rhubarb_pie', 'strawberry'],
    likes: ['copper_bar', 'iron_bar', 'oak_resin', 'pine_tar', 'quartz'],
    dislikes: ['blackberry', 'common_mushroom', 'crystal_fruit', 'maple_syrup', 'snow_yam', 'truffle'],
    hates: ['holly', 'honey', 'pickles'],
    schedule: [
      { time: 10 * 60, location: 'mountain', x: 12, y: 10 },
      { time: 17 * 60, location: 'mountain', x: 15, y: 15 },
      { time: 20 * 60, location: 'mountain', x: 12, y: 10 }
    ]
  },
  {
    id: 'caroline',
    name: '卡洛琳',
    location: 'store',
    x: 10,
    y: 8,
    spriteColor: 0x1abc9c,
    dialogues: ['皮埃尔有时候工作太忙了。', '我们在后院有个小花园。', '放松一下挺好的。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['fish_taco', 'green_tea', 'summer_spangle', 'tropical_curry'],
    likes: ['daffodil'],
    dislikes: ['amaranth', 'mayonnaise', 'duck_mayonnaise'],
    hates: ['quartz', 'salmonberry'],
    schedule: [
      { time: 13 * 60, location: 'store', x: 10, y: 8 },
      { time: 15 * 60, location: 'town', x: 15, y: 12 },
      { time: 18 * 60, location: 'store', x: 10, y: 8 }
    ]
  },
  {
    id: 'clint',
    name: '克林特',
    location: 'blacksmith',
    x: 7,
    y: 5,
    spriteColor: 0x7f8c8d,
    dialogues: ['我是铁匠。', '如果有矿石要砸开就找我。', '唉...有时候我觉得很孤单。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['amethyst', 'aquamarine', 'artichoke_dip', 'emerald', 'fiddlehead_risotto', 'gold_bar', 'iridium_bar', 'jade', 'omni_geode', 'ruby', 'topaz'],
    likes: ['copper_bar', 'iron_bar'],
    dislikes: ['daffodil', 'quartz'],
    hates: ['holly'],
    schedule: [
      { time: 9 * 60, location: 'blacksmith', x: 7, y: 5 },
      { time: 17 * 60, location: 'saloon', x: 15, y: 8 },
      { time: 22 * 60, location: 'blacksmith', x: 7, y: 5 }
    ]
  },
  {
    id: 'demetrius',
    name: '德米特里厄斯',
    location: 'mountain',
    x: 12,
    y: 12,
    spriteColor: 0x2c3e50,
    dialogues: ['我在研究当地的生态系统。', '这株植物很有趣。', '为了科学！'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['bean_hotpot', 'ice_cream', 'rice_pudding', 'strawberry'],
    likes: ['egg', 'purple_mushroom'],
    dislikes: ['quartz'],
    hates: ['holly'],
    schedule: [
      { time: 10 * 60, location: 'mountain', x: 12, y: 12 },
      { time: 15 * 60, location: 'mountain', x: 15, y: 15 },
      { time: 19 * 60, location: 'mountain', x: 12, y: 12 }
    ]
  },
  {
    id: 'evelyn',
    name: '艾芙琳',
    location: 'town',
    x: 14,
    y: 18,
    spriteColor: 0x95a5a6,
    dialogues: ['哦，你好啊亲爱的。', '叫我奶奶就好。', '我会烤饼干给你吃。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['beet', 'chocolate_cake', 'diamond', 'fairy_rose', 'stuffing', 'tulip'],
    likes: ['daffodil', 'milk'],
    dislikes: ['wild_horseradish'],
    hates: ['clam', 'coral', 'fried_eel', 'garlic', 'holly', 'maki_roll', 'salmonberry', 'sashimi', 'spice_berry'],
    schedule: [
      { time: 10 * 60, location: 'town', x: 14, y: 18 },
      { time: 13 * 60, location: 'town', x: 15, y: 12 },
      { time: 17 * 60, location: 'town', x: 14, y: 18 }
    ]
  },
  {
    id: 'george',
    name: '乔治',
    location: 'town',
    x: 13,
    y: 18,
    spriteColor: 0x7f8c8d,
    dialogues: ['哼...现在的年轻人。', '电视上没好节目。', '我的腿脚不方便。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['fried_mushroom', 'leek'],
    likes: ['daffodil'],
    dislikes: ['dandelion', 'holly', 'quartz'],
    hates: ['clay'],
    schedule: [
      { time: 10 * 60, location: 'town', x: 13, y: 18 },
      { time: 14 * 60, location: 'town', x: 15, y: 12 },
      { time: 17 * 60, location: 'town', x: 13, y: 18 }
    ]
  },
  {
    id: 'gus',
    name: '格斯',
    location: 'saloon',
    x: 10,
    y: 4,
    spriteColor: 0xe67e22,
    dialogues: ['欢迎来到星之果实餐吧！', '有什么想吃的吗？', '今晚的生意不错。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['diamond', 'escargot', 'fish_taco', 'orange'],
    likes: ['daffodil'],
    dislikes: ['coleslaw'],
    hates: ['holly', 'quartz'],
    schedule: [
      { time: 12 * 60, location: 'saloon', x: 10, y: 4 },
      { time: 24 * 60, location: 'saloon', x: 10, y: 4 }
    ]
  },
  {
    id: 'jas',
    name: '贾斯',
    location: 'forest',
    x: 8,
    y: 10,
    spriteColor: 0x9b59b6,
    dialogues: ['...你好。', '你想玩过家家吗？', '玛妮阿姨对我很好。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['fairy_rose', 'pink_cake', 'plum_pudding'],
    likes: ['coconut', 'daffodil'],
    dislikes: ['quartz'],
    hates: ['clay', 'holly', 'wild_horseradish'],
    schedule: [
      { time: 11 * 60, location: 'forest', x: 8, y: 10 },
      { time: 14 * 60, location: 'forest', x: 15, y: 15 },
      { time: 18 * 60, location: 'forest', x: 8, y: 10 }
    ]
  },
  {
    id: 'jodi',
    name: '乔迪',
    location: 'town',
    x: 10,
    y: 18,
    spriteColor: 0xf39c12,
    dialogues: ['家务活永远做不完。', '保持房子整洁真不容易。', '我想稍微休息一下。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['chocolate_cake', 'crispy_bass', 'diamond', 'eggplant_parmesan', 'fried_eel', 'pancakes', 'rhubarb_pie', 'vegetable_medley'],
    likes: ['egg', 'milk'],
    dislikes: ['daffodil', 'garlic'],
    hates: ['spice_berry'],
    schedule: [
      { time: 10 * 60, location: 'town', x: 10, y: 18 },
      { time: 13 * 60, location: 'town', x: 15, y: 12 },
      { time: 17 * 60, location: 'town', x: 10, y: 18 }
    ]
  },
  {
    id: 'pam',
    name: '潘姆',
    location: 'town',
    x: 24,
    y: 20,
    spriteColor: 0xf1c40f,
    dialogues: ['嘿，给我也来一杯。', '今天的工作真累人。', '潘妮是个好孩子。'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['beer', 'cactus_fruit', 'glazed_yams', 'mead', 'pale_ale', 'parsnip', 'parsnip_soup'],
    likes: ['daffodil', 'milk'],
    dislikes: ['quartz'],
    hates: ['holly', 'octopus', 'squid'],
    schedule: [
      { time: 12 * 60, location: 'town', x: 24, y: 20 },
      { time: 16 * 60, location: 'town', x: 15, y: 22 },
      { time: 22 * 60, location: 'town', x: 24, y: 20 }
    ]
  },
  {
    id: 'vincent',
    name: '文森特',
    location: 'town',
    x: 11,
    y: 19,
    spriteColor: 0xe74c3c,
    dialogues: ['我想快点长大。', '我想吃糖果！', '你能带我去看虫子吗？'],
    currentDialogueIndex: 0,
    relationship: 0,
    loves: ['cranberry_candy', 'ginger_ale', 'grape', 'pink_cake', 'snail'],
    likes: ['coconut', 'daffodil'],
    dislikes: ['quartz'],
    hates: ['clay', 'holly'],
    schedule: [
      { time: 11 * 60, location: 'town', x: 11, y: 19 },
      { time: 14 * 60, location: 'town', x: 15, y: 15 },
      { time: 18 * 60, location: 'town', x: 11, y: 19 }
    ]
  }
]
