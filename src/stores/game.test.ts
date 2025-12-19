import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore, type InventoryItem } from './game'
import { ITEMS } from '../data/items'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0
}
vi.stubGlobal('localStorage', localStorageMock)

describe('Game Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes correctly', () => {
    const store = useGameStore()
    expect(store.playerEnergy).toBe(100)
    expect(store.gameState.currentDay).toBe(1)
  })

  describe('Collection System', () => {
    it('adds item to inventory if space exists', () => {
      const store = useGameStore()
      // Clear inventory for test
      store.gameState.inventory = []

      const success = store.addToInventory({ id: 'wood', quantity: 10 })
      expect(success).toBe(true)
      expect(store.gameState.inventory.length).toBe(1)
      expect(store.gameState.inventory[0]?.quantity).toBe(10)
    })

    it('stacks items correctly', () => {
      const store = useGameStore()
      const wood = ITEMS['wood']
      if (!wood) throw new Error('Wood item definition not found')

      const woodItem: InventoryItem = {
          id: 'wood',
          name: wood.name || 'Wood',
          type: wood.type || 'resource',
          quantity: 10,
          icon: wood.icon || 'x'
      }
      store.gameState.inventory = [woodItem]

      const success = store.addToInventory({ id: 'wood', quantity: 5 })
      expect(success).toBe(true)
      expect(store.gameState.inventory[0]?.quantity).toBe(15)
    })

    it('fails if inventory is full', () => {
        const store = useGameStore()
        const wood = ITEMS['wood']
        if (!wood) throw new Error('Wood item definition not found')

        store.gameState.inventory = Array(36).fill(null).map((_, i) => ({
             id: `wood_${i}`,
             name: wood.name || 'Wood',
             type: wood.type || 'resource',
             quantity: 1,
             icon: wood.icon || 'x'
        }))

        const success = store.addToInventory({ id: 'stone', quantity: 1 })
        expect(success).toBe(false)
    })
  })

  describe('Gathering System', () => {
      it('calculates stamina cost based on proficiency', () => {
          const store = useGameStore()
          store.gameState.player.toolProficiency.hoe = 0
          expect(store.calculateStaminaCost('hoe')).toBe(2)

          store.gameState.player.toolProficiency.hoe = 5
          expect(store.calculateStaminaCost('hoe')).toBe(1.5)

          store.gameState.player.toolProficiency.hoe = 10
          expect(store.calculateStaminaCost('hoe')).toBe(1)
      })

      it('scythe costs 0 energy', () => {
          const store = useGameStore()
          expect(store.calculateStaminaCost('scythe')).toBe(0)
      })
  })

  describe('Dialogue System', () => {
      it('updates talkedToday and relationship', () => {
          const store = useGameStore()
          const npcId = 'abigail'
          const npc = store.gameState.npcs.find(n => n.id === npcId)
          if (!npc) throw new Error('NPC not found')

          const initialRel = npc.relationship || 0

          // Interact
          store.interactWithNPC(npcId)

          expect(npc.talkedToday).toBe(true)
          expect(npc.relationship).toBe(initialRel + 20)

          // Interact again
          store.interactWithNPC(npcId)
          expect(npc.relationship).toBe(initialRel + 20) // No extra points
      })

      it('resets talkedToday on new day', () => {
          const store = useGameStore()
          const npc = store.gameState.npcs[0]
          if (!npc) throw new Error('NPC not found')
          npc.talkedToday = true

          store.processNewDay()

          expect(npc.talkedToday).toBe(false)
      })
  })
})
