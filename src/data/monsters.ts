export interface MonsterDefinition {
  type: 'slime' | 'bat' | 'ghost' | 'grub' | 'fly'
  name: string
  maxHp: number
  damage: number
  speed: number
  aggroRange: number
  drops: string[] // Item IDs
  exp: number
}

export const MONSTERS: Record<string, MonsterDefinition> = {
  slime: {
    type: 'slime',
    name: '绿史莱姆',
    maxHp: 20,
    damage: 5,
    speed: 0.02,
    aggroRange: 5,
    drops: ['slime', 'sap'],
    exp: 5
  },
  bat: {
    type: 'bat',
    name: '蝙蝠',
    maxHp: 30,
    damage: 8,
    speed: 0.04,
    aggroRange: 7,
    drops: ['bat_wing'],
    exp: 7
  },
  ghost: {
    type: 'ghost',
    name: '幽灵',
    maxHp: 60,
    damage: 15,
    speed: 0.015,
    aggroRange: 10,
    drops: ['solar_essence'],
    exp: 15
  },
  grub: {
    type: 'grub',
    name: '幼虫',
    maxHp: 10,
    damage: 4,
    speed: 0.01,
    aggroRange: 4,
    drops: ['bug_meat'],
    exp: 3
  },
  fly: {
    type: 'fly',
    name: '洞穴蝇',
    maxHp: 25,
    damage: 6,
    speed: 0.05,
    aggroRange: 8,
    drops: ['bug_meat'],
    exp: 10
  }
}
