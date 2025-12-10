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
    relationship: 0
  },
  {
    id: 'pierre',
    name: '皮埃尔',
    location: 'shop',
    x: 5,
    y: 3,
    spriteColor: 0x8B4513, // Brown hair/shirt
    dialogues: [
      '欢迎光临皮埃尔杂货店！',
      '需要买点种子吗？',
      '通过点击柜台来交易。'
    ],
    currentDialogueIndex: 0,
    relationship: 0,
    schedule: [
      { time: 9 * 60, location: 'shop', x: 5, y: 3 },
      { time: 17 * 60, location: 'town', x: 14, y: 7 }
    ]
  },
  {
    id: 'robin',
    name: '罗宾',
    location: 'mountain',
    x: 10,
    y: 10,
    spriteColor: 0xd35400, // Orange hair
    dialogues: ['你好！我是木匠。', '需要升级房子吗？', '这山里的空气真好。'],
    currentDialogueIndex: 0,
    relationship: 0
  },
  {
    id: 'linus',
    name: '莱纳斯',
    location: 'mountain',
    x: 25,
    y: 5, // Near tent
    spriteColor: 0xecf0f1, // White hair
    dialogues: ['别介意我。', '我只是在大自然中生活。', '你是个好人。'],
    currentDialogueIndex: 0,
    relationship: 0
  },
  {
    id: 'willy',
    name: '威利',
    location: 'beach',
    x: 15,
    y: 15, // On dock
    spriteColor: 0x34495e, // Dark cap
    dialogues: ['大海的味道...', '想学钓鱼吗？', '今天的鱼咬钩很勤。'],
    currentDialogueIndex: 0,
    relationship: 0
  },
  {
    id: 'marnie',
    name: '玛妮',
    location: 'forest',
    x: 5,
    y: 15,
    spriteColor: 0xe74c3c, // Reddish
    dialogues: ['动物们都很可爱。', '你需要干草吗？', '镇长...哦，没什么。'],
    currentDialogueIndex: 0,
    relationship: 0
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
    relationship: 0
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
    relationship: 0
  }
]
