export interface QuestStep {
  description: string
  targetId?: string
  targetCount?: number
  currentCount?: number
  completed: boolean
}

export interface QuestDefinition {
  id: string
  title: string
  description: string
  type: 'story' | 'help_wanted'
  goldReward: number
  itemReward?: { id: string, count: number }
  steps: QuestStep[]
  trigger?: {
    type: 'day' | 'friendship' | 'money' | 'skill'
    value: number
    target?: string
  }
}

export const QUESTS: Record<string, QuestDefinition> = {
  // Story Quests
  introductions: {
    id: 'introductions',
    title: '介绍',
    description: '如果你想适应新生活，最好去认识一下镇上的其他人。',
    type: 'story',
    goldReward: 0,
    steps: [
      { description: '问候28个人', targetCount: 28, currentCount: 0, completed: false }
    ],
    trigger: { type: 'day', value: 1 }
  },
  how_to_win_friends: {
    id: 'how_to_win_friends',
    title: '如何结交朋友',
    description: '送礼物是加深友谊的好方法。送给某人一件礼物。',
    type: 'story',
    goldReward: 100,
    steps: [
      { description: '送给某人一件礼物', targetCount: 1, currentCount: 0, completed: false }
    ],
    trigger: { type: 'day', value: 2 }
  },
  getting_started: {
    id: 'getting_started',
    title: '开始',
    description: '如果你想成为一名农夫，就得从基本功练起。',
    type: 'story',
    goldReward: 100,
    steps: [
      { description: '耕种并收获防风草', targetId: 'parsnip', targetCount: 1, currentCount: 0, completed: false }
    ],
    trigger: { type: 'day', value: 1 }
  },
  explore_the_mines: {
    id: 'explore_the_mines',
    title: '探索矿井',
    description: '矿井里充满了宝藏，也充满了危险。',
    type: 'story',
    goldReward: 0,
    steps: [
      { description: '到达矿井第5层', targetCount: 5, currentCount: 0, completed: false }
    ],
    trigger: { type: 'day', value: 5 }
  },
  raising_animals: {
    id: 'raising_animals',
    title: '饲养动物',
    description: '罗宾可以为你建造一个鸡舍，这样你就可以养鸡了。',
    type: 'story',
    goldReward: 0,
    steps: [
      { description: '建造一个鸡舍', completed: false }
    ],
    trigger: { type: 'day', value: 3 } // Usually triggered by letter
  },
  advancement: {
    id: 'advancement',
    title: '进阶',
    description: '随着经验的增长，你会发现新的制作配方。制造一个稻草人。',
    type: 'story',
    goldReward: 100,
    steps: [
      { description: '达到耕种等级1', completed: false },
      { description: '制造一个稻草人', completed: false }
    ],
    trigger: { type: 'skill', value: 1, target: 'farming' }
  },
  archaeology: {
    id: 'archaeology',
    title: '考古',
    description: '冈瑟让你如果你发现了古物或者矿物，就捐赠给博物馆。',
    type: 'story',
    goldReward: 250,
    steps: [
      { description: '向博物馆捐赠一件物品', targetCount: 1, currentCount: 0, completed: false }
    ]
  },
  meet_the_wizard: {
    id: 'meet_the_wizard',
    title: '拜访法师',
    description: '你收到了一封来自住在森林西部塔楼里的法师的信。',
    type: 'story',
    goldReward: 0,
    steps: [
      { description: '进入法师塔', completed: false }
    ],
    trigger: { type: 'day', value: 6 } // Needs community center event first
  },
  
  // Help Wanted (Templates)
  item_delivery: {
    id: 'item_delivery',
    title: '物品递送',
    description: '需要一个{item}。',
    type: 'help_wanted',
    goldReward: 0, // dynamic
    steps: [
      { description: '给{npc}送去{item}', completed: false }
    ]
  },
  slay_monsters: {
    id: 'slay_monsters',
    title: '消灭怪物',
    description: '需要有人去矿井里清理{monster}。',
    type: 'help_wanted',
    goldReward: 0, // dynamic
    steps: [
      { description: '消灭{count}个{monster}', completed: false }
    ]
  },
  fishing: {
    id: 'fishing',
    title: '钓鱼',
    description: '我想吃{fish}。请给我带一条来。',
    type: 'help_wanted',
    goldReward: 0, // dynamic
    steps: [
      { description: '钓一条{fish}', completed: false },
      { description: '把它交给{npc}', completed: false }
    ]
  }
}
