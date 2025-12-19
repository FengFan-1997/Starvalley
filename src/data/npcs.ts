export interface NPC {
  id: string
  name: string
  portrait: string // emoji or path
  portraitColor: string // hex
  schedule: Record<string, { x: number, y: number, map: string, action?: string }>
  dialogue: {
    introduction: string
    default: string[]
    spring: string[]
    summer: string[]
    autumn: string[]
    winter: string[]
    rain: string[]
    hearts: Record<number, string[]>
    gifts: {
      love: string[]
      like: string[]
      dislike: string[]
      hate: string[]
    }
  }
  birthday: { season: string, day: number }
  x: number
  y: number
  location: string
  facing: 'up' | 'down' | 'left' | 'right'

  relationship?: number
  talkedToday?: boolean
  currentDialogueIndex?: number
  giftsThisWeek?: number
  lastGiftDay?: number

  isMoving?: boolean
  targetX?: number
  targetY?: number
  path?: { x: number, y: number }[]
  destination?: { map: string, x: number, y: number }
}

export const NPCS: Record<string, NPC> = {
  lewis: {
    id: 'lewis',
    name: '刘易斯',
    portrait: '👴',
    portraitColor: '#8B4513',
    birthday: { season: 'spring', day: 7 },
    x: 15,
    y: 15,
    location: 'town',
    facing: 'down',
    schedule: {
      '800': { x: 15, y: 15, map: 'town', action: 'stand' },
      '900': { x: 18, y: 20, map: 'town', action: 'stand' },
      '1700': { x: 15, y: 15, map: 'town', action: 'stand' }
    },
    dialogue: {
      introduction: '你好！我是刘易斯，鹈鹕镇的镇长。如果你有任何问题，尽管问我。',
      default: ['今天天气真不错。', '我担任镇长已经20年了！', '务必常去社区中心看看。'],
      spring: ['春天的气息总是让我充满活力。', '别忘了为蛋情节做准备。'],
      summer: ['夏天要注意防暑。', '州长要来参加鲁奥节，我好紧张。'],
      autumn: ['秋天是收获的季节。', '记得为展览会准备你最好的产品。'],
      winter: ['冬天要注意保暖。', '冰雪节快到了。'],
      rain: ['我不喜欢下雨，弄得我关节痛。'],
      hearts: {
        2: ['你适应得怎么样了？'],
        4: ['我真的很感激你为这个镇子所做的一切。'],
        6: ['你知道吗，我有时候会觉得有点孤独。'],
        8: ['你是我最好的朋友之一。']
      },
      gifts: {
        love: ['hot_pepper', 'tea', 'vegetable_medley'],
        like: ['coconut', 'cactus_fruit'],
        dislike: ['milk', 'salmonberry'],
        hate: ['holly', 'quartz']
      }
    }
  },
  robin: {
    id: 'robin',
    name: '罗宾',
    portrait: '👩‍🦰',
    portraitColor: '#FFD700',
    birthday: { season: 'autumn', day: 21 },
    x: 30,
    y: 10,
    location: 'town', // Carpenter shop
    facing: 'down',
    schedule: {
      '800': { x: 30, y: 10, map: 'town', action: 'work' },
      '1700': { x: 40, y: 15, map: 'town', action: 'walk' }
    },
    dialogue: {
      introduction: '嗨！我是罗宾，这里的木匠。如果你需要升级房子或者建造新建筑，就来找我吧。',
      default: ['你需要木材吗？', '我丈夫德米特里厄斯是个科学家。', '塞巴斯蒂安总是待在地下室里。'],
      spring: ['木头在春天最容易受潮。'],
      summer: ['这么热的天气，干活真累人。'],
      autumn: ['秋天的木材质量最好。'],
      winter: ['如果你需要升级房子，现在是最好的时候。'],
      rain: ['下雨天最适合在室内工作。'],
      hearts: {
        2: ['你把农场打理得不错。'],
        4: ['我很高兴你搬到了这里。'],
        6: ['你知道吗，我真的很喜欢做木工。'],
        8: ['你就像我们家的一份子。']
      },
      gifts: {
        love: ['goat_cheese', 'peach', 'spaghetti'],
        like: ['milk', 'hardwood'],
        dislike: ['wild_horseradish', 'clay'],
        hate: ['holly', 'stone']
      }
    }
  },
  pierre: {
    id: 'pierre',
    name: '皮埃尔',
    portrait: '🧔',
    portraitColor: '#A0522D',
    birthday: { season: 'spring', day: 26 },
    x: 25,
    y: 18,
    location: 'town', // General Store
    facing: 'down',
    schedule: {
      '900': { x: 25, y: 18, map: 'town', action: 'work' },
      '1700': { x: 25, y: 18, map: 'town', action: 'work' }
    },
    dialogue: {
      introduction: '你好！我是皮埃尔。如果你需要种子，就来我的杂货店。我会给你最好的价格。',
      default: ['生意还不错。', '你有看到阿比盖尔吗？', '我在考虑引进一些新产品。'],
      spring: ['春天是播种的季节。', '需要化肥吗？'],
      summer: ['夏天要注意浇水。', '我的向日葵种子很受欢迎。'],
      autumn: ['秋天的农作物价格最高。', '我在为冬天做准备。'],
      winter: ['冬天生意比较清淡。', '你可以趁现在规划明年的种植计划。'],
      rain: ['下雨天没什么顾客。'],
      hearts: {
        2: ['感谢你的光顾。'],
        4: ['你是我最好的顾客之一。'],
        6: ['有时候我觉得乔家超市给我的压力太大了。'],
        8: ['你就像我的家人一样。']
      },
      gifts: {
        love: ['fried_calamari'],
        like: ['milk', 'egg'],
        dislike: ['corn', 'garlic'],
        hate: ['parsnip_soup', 'tortilla']
      }
    }
  },
  abigail: {
    id: 'abigail',
    name: '阿比盖尔',
    portrait: '👩‍🎤',
    portraitColor: '#9370DB',
    birthday: { season: 'autumn', day: 13 },
    x: 25,
    y: 20,
    location: 'town',
    facing: 'down',
    schedule: {
      '900': { x: 25, y: 20, map: 'town', action: 'stand' },
      '1300': { x: 10, y: 10, map: 'town', action: 'walk' }, // Bridge
      '1800': { x: 25, y: 20, map: 'town', action: 'stand' }
    },
    dialogue: {
      introduction: '哦，就是你搬进了那座旧农场？我是阿比盖尔。',
      default: ['我好无聊。', '我想去冒险。', '你觉得我的头发颜色怎么样？'],
      spring: ['花开了，但我更喜欢雨天。'],
      summer: ['太阳太大了，我不想出门。'],
      autumn: ['我喜欢踩在落叶上的声音。', '万圣节是我最喜欢的节日。'],
      winter: ['雪景很美，但是太冷了。'],
      rain: ['我喜欢在雨中散步。'],
      hearts: {
        2: ['你不像我想象的那么无聊。'],
        4: ['也许有一天我们可以一起去探险。'],
        6: ['我觉得我们很合得来。'],
        8: ['你对我来说很特别。']
      },
      gifts: {
        love: ['amethyst', 'pufferfish', 'chocolate_cake', 'spicy_eel', 'pumpkin', 'blackberry_cobbler'],
        like: ['quartz'],
        dislike: ['sugar', 'wild_horseradish'],
        hate: ['clay', 'holly']
      }
    }
  },
  sebastian: {
    id: 'sebastian',
    name: '塞巴斯蒂安',
    portrait: '🧑‍💻',
    portraitColor: '#4B0082',
    birthday: { season: 'winter', day: 10 },
    x: 32,
    y: 12,
    location: 'town', // Basement
    facing: 'up',
    schedule: {
      '1000': { x: 32, y: 12, map: 'town', action: 'computer' },
      '1500': { x: 35, y: 15, map: 'town', action: 'smoke' },
      '1900': { x: 32, y: 12, map: 'town', action: 'computer' }
    },
    dialogue: {
      introduction: '......哦，你好。我是塞巴斯蒂安。',
      default: ['我很忙。', '我在工作。', '这里太吵了。'],
      spring: ['每个人都对春天那么兴奋，我不明白为什么。'],
      summer: ['我讨厌夏天。'],
      autumn: ['这种阴沉的天气很适合我。'],
      winter: ['雪把一切声音都掩盖了，我很喜欢。'],
      rain: ['青蛙在雨天会出来。'],
      hearts: {
        2: ['你经常来这里吗？'],
        4: ['我其实是个程序员。'],
        6: ['我想骑着摩托车离开这里。'],
        8: ['你是唯一懂我的人。']
      },
      gifts: {
        love: ['sashimi', 'pumpkin_soup', 'obsidian', 'frozen_tear', 'void_egg'],
        like: ['quartz', 'coffee'],
        dislike: ['flower', 'omelet'],
        hate: ['clay', 'complete_breakfast']
      }
    }
  },
  penny: {
    id: 'penny',
    name: '佩妮',
    portrait: '👩‍🏫',
    portraitColor: '#FF69B4',
    birthday: { season: 'autumn', day: 2 },
    x: 10,
    y: 25,
    location: 'town', // Trailer
    facing: 'down',
    schedule: {
      '800': { x: 10, y: 25, map: 'town', action: 'read' },
      '1000': { x: 15, y: 20, map: 'town', action: 'teach' }, // Museum/Library
      '1600': { x: 10, y: 25, map: 'town', action: 'clean' }
    },
    dialogue: {
      introduction: '你好，我是佩妮。很高兴见到你。',
      default: ['我在读书。', '我在教文森特和贾斯。', '我妈妈有时候很难相处。'],
      spring: ['春天很美，不是吗？'],
      summer: ['这种天气很适合野餐。'],
      autumn: ['秋天让人感到宁静。'],
      winter: ['即使是冬天，也要保持家里整洁。'],
      rain: ['我喜欢听雨声。'],
      hearts: {
        2: ['你喜欢读书吗？'],
        4: ['我很想拥有一个属于自己的大花园。'],
        6: ['虽然生活很艰难，但我仍然心存感激。'],
        8: ['和你在一起我很开心。']
      },
      gifts: {
        love: ['diamond', 'emerald', 'melon', 'poppy', 'sandfish'],
        like: ['leek', 'dandelion'],
        dislike: ['beer', 'wine', 'grape'],
        hate: ['rabbit_foot', 'beer']
      }
    }
  },
  maru: {
    id: 'maru',
    name: '玛鲁',
    portrait: '👩‍🔬',
    portraitColor: '#800080',
    birthday: { season: 'summer', day: 10 },
    x: 30,
    y: 12,
    location: 'town', // Lab
    facing: 'up',
    schedule: {
      '800': { x: 30, y: 12, map: 'town', action: 'work' },
      '1700': { x: 30, y: 12, map: 'town', action: 'work' }
    },
    dialogue: {
      introduction: '你好！我是玛鲁。我在诊所工作，也在帮爸爸做实验。',
      default: ['我在研究这台机器。', '你要注意身体。', '天上的星星真美。'],
      spring: ['春天万物复苏，真是神奇。'],
      summer: ['要注意防晒。'],
      autumn: ['金属在低温下会收缩。'],
      winter: ['我想制造一个可以在雪地里行走的机器人。'],
      rain: ['这种天气适合在实验室里待着。'],
      hearts: {
        2: ['你对科学感兴趣吗？'],
        4: ['有时候实验会失败，但这没关系。'],
        6: ['我想发明一些能帮助大家的东西。'],
        8: ['你愿意看看我的最新发明吗？']
      },
      gifts: {
        love: ['battery_pack', 'diamond', 'gold_bar', 'iridium_bar', 'strawberry', 'cauliflower'],
        like: ['copper_bar', 'iron_bar', 'oak_resin'],
        dislike: ['honey', 'pickles'],
        hate: ['holly', 'snow_yam']
      }
    }
  },
  haley: {
    id: 'haley',
    name: '海莉',
    portrait: '👱‍♀️',
    portraitColor: '#FFD700',
    birthday: { season: 'spring', day: 14 },
    x: 18,
    y: 22,
    location: 'town',
    facing: 'down',
    schedule: {
      '1000': { x: 18, y: 22, map: 'town', action: 'stand' },
      '1400': { x: 12, y: 15, map: 'town', action: 'walk' }, // Fountain
      '1800': { x: 18, y: 22, map: 'town', action: 'stand' }
    },
    dialogue: {
      introduction: '...你是谁？哦，那个新来的农夫。别弄脏我的衣服。',
      default: ['这件衣服好难看。', '我好想去商场。', '摄影是我的爱好。'],
      spring: ['我对花粉过敏。'],
      summer: ['这是我最喜欢的季节！'],
      autumn: ['我不喜欢秋天，太萧瑟了。'],
      winter: ['冬天太冷了，什么都干不了。'],
      rain: ['我的头发湿了！'],
      hearts: {
        2: ['你其实也没那么脏。'],
        4: ['你会用相机吗？'],
        6: ['我想拍一张你的照片。'],
        8: ['我以前太肤浅了，谢谢你改变了我。']
      },
      gifts: {
        love: ['coconut', 'fruit_salad', 'pink_cake', 'sunflower'],
        like: ['daffodil'],
        dislike: ['milk', 'egg', 'vegetable'],
        hate: ['prismatic_shard', 'wild_horseradish', 'clay']
      }
    }
  },
  elliott: {
    id: 'elliott',
    name: '艾利欧特',
    portrait: '👨‍🦱',
    portraitColor: '#DC143C',
    birthday: { season: 'autumn', day: 5 },
    x: 40,
    y: 30,
    location: 'town', // Beach cabin
    facing: 'down',
    schedule: {
      '800': { x: 40, y: 30, map: 'town', action: 'write' },
      '1200': { x: 42, y: 35, map: 'town', action: 'walk' }, // Beach
      '1800': { x: 40, y: 30, map: 'town', action: 'read' }
    },
    dialogue: {
      introduction: '啊，多么美好的早晨。我是艾利欧特，一个作家。',
      default: ['我在寻找灵感。', '大海的声音让我平静。', '你读过书吗？'],
      spring: ['春天的微风像诗一样。'],
      summer: ['大海在召唤。'],
      autumn: ['落叶是自然的信笺。'],
      winter: ['壁炉的火光给了我温暖。'],
      rain: ['雨声是最好的伴奏。'],
      hearts: {
        2: ['你的到来给了我新的灵感。'],
        4: ['我想把你写进我的书里。'],
        6: ['你就像从故事里走出来的人。'],
        8: ['我为你写了一首诗。']
      },
      gifts: {
        love: ['crab_cakes', 'duck_feather', 'lobster', 'pomegranate', 'tom_kha_soup'],
        like: ['octopus', 'squid'],
        dislike: ['pizza', 'milk'],
        hate: ['amaranth', 'quartz', 'salmonberry']
      }
    }
  },
  harvey: {
    id: 'harvey',
    name: '哈维',
    portrait: '👨‍⚕️',
    portraitColor: '#006400',
    birthday: { season: 'winter', day: 14 },
    x: 28,
    y: 15,
    location: 'town', // Clinic
    facing: 'down',
    schedule: {
      '800': { x: 28, y: 15, map: 'town', action: 'work' },
      '1700': { x: 28, y: 15, map: 'town', action: 'read' }
    },
    dialogue: {
      introduction: '你好，我是哈维医生。请务必保持健康。',
      default: ['记得多吃蔬菜。', '小心别受伤了。', '我是镇上的医生。'],
      spring: ['春天的过敏源很多。'],
      summer: ['要小心中暑。'],
      autumn: ['流感季节快到了。'],
      winter: ['保暖很重要。'],
      rain: ['别淋湿了，会感冒的。'],
      hearts: {
        2: ['你的心率很正常。'],
        4: ['其实我很恐高。'],
        6: ['我很喜欢飞机模型。'],
        8: ['你是我见过最健康的病人。']
      },
      gifts: {
        love: ['coffee', 'pickles', 'super_meal', 'truffle_oil', 'wine'],
        like: ['blackberry', 'corn', 'duck_egg', 'duck_feather', 'goat_milk'],
        dislike: ['bread', 'cheese', 'pizza'],
        hate: ['coral', 'nautilus_shell', 'rainbow_shell', 'salmonberry', 'spice_berry']
      }
    }
  }
}
