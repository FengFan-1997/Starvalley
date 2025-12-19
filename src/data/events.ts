export interface GameEvent {
  id: string
  trigger: {
    type: 'location' | 'time' | 'friendship'
    location?: string
    season?: string
    day?: number
    timeRange?: [number, number]
    weather?: 'sun' | 'rain' | 'storm' | 'snow'
    npc?: string
    hearts?: number
  }
  cutscene: CutsceneStep[]
  seen: boolean
}

export interface CutsceneStep {
  type: 'move' | 'speak' | 'emote' | 'playSound' | 'pause' | 'changeMap' | 'addItem' | 'addQuest' | 'choice'
  actor?: string // 'player' or NPC id
  target?: { x: number, y: number } | string // coordinates or target entity
  text?: string
  emote?: 'question' | 'exclamation' | 'heart' | 'angry' | 'music' | 'sleep'
  sound?: string
  duration?: number
  itemId?: string
  questId?: string
  choices?: { text: string, nextId: string }[]
}

export const EVENTS: Record<string, GameEvent> = {
  intro: {
    id: 'intro',
    trigger: { type: 'time', day: 1, season: 'spring' }, // Special trigger
    seen: false,
    cutscene: [
      { type: 'speak', actor: 'Lewis', text: '你好啊！你一定是新来的农夫。' },
      { type: 'speak', actor: 'Lewis', text: '我是刘易斯，鹈鹕镇的镇长。' },
      { type: 'speak', actor: 'Robin', text: '嗨！我是罗宾，镇上的木匠。' },
      { type: 'speak', actor: 'Lewis', text: '这里就是你的爷爷留下的农场...确实有点乱。' },
      { type: 'speak', actor: 'Robin', text: '别担心，只要稍微清理一下，这里就会变得很棒！' },
      { type: 'addItem', itemId: 'parsnip_seeds', text: '获得 15个 防风草种子' },
      { type: 'addQuest', questId: 'introductions' },
      { type: 'speak', actor: 'Lewis', text: '好了，我们就不打扰你了。祝你好运！' }
    ]
  },
  community_center_unlock: {
    id: 'community_center_unlock',
    trigger: { type: 'location', location: 'town', season: 'spring', day: 5, timeRange: [800, 1300], weather: 'sun' },
    seen: false,
    cutscene: [
      { type: 'move', actor: 'Lewis', target: { x: 40, y: 30 } },
      { type: 'emote', actor: 'Lewis', emote: 'exclamation' },
      { type: 'speak', actor: 'Lewis', text: '哎...这个老社区中心。' },
      { type: 'speak', actor: 'Lewis', text: '以前这里充满了活力，现在却变成了这副模样。' },
      { type: 'speak', actor: 'Lewis', text: '甚至有人说这里面有奇怪的小生物...' },
      { type: 'speak', actor: 'Lewis', text: '如果你愿意的话，可以进去看看。但是我把门锁了，哈哈。开个玩笑，门没锁。' },
      { type: 'addQuest', questId: 'meet_the_wizard' }
    ]
  },
  meet_wizard: {
    id: 'meet_wizard',
    trigger: { type: 'location', location: 'wizard_tower' },
    seen: false,
    cutscene: [
      { type: 'speak', actor: 'Wizard', text: '啊...我预见到了你的到来。' },
      { type: 'speak', actor: 'Wizard', text: '你看到了那些小生物，对吧？祝尼魔。' },
      { type: 'speak', actor: 'Wizard', text: '来，喝下这个。' },
      { type: 'speak', actor: 'player', text: '（你喝下了奇怪的绿色液体）' },
      { type: 'emote', actor: 'player', emote: 'music' },
      { type: 'speak', actor: 'Wizard', text: '现在你应该能理解它们的语言了。' }
    ]
  }
}
