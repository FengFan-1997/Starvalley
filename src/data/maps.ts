import type { Plot } from '@/stores/game'

export interface Teleport {
  x: number
  y: number
  targetMap: string
  targetX: number
  targetY: number
}

export interface Building {
  id: string
  type: string // 'house', 'shop', 'barn', etc. for rendering
  x: number
  y: number
  width: number
  height: number
  doorX?: number
  doorY?: number
}

export interface MapConfig {
  id: string
  width: number
  height: number
  teleports: Teleport[]
  buildings?: Building[]
  generatePlots: () => Plot[][]
}

// Helper to create map from string layout
// Symbols:
// . = grass
// # = tilled soil (initially untilled but distinct area)
// ~ = water
// = = paved/road
// _ = floor (indoor)
// " = sand
// T = tree
// S = stone
// W = wood
// F = weed
// * = fence
// r = red flower
// y = yellow flower
const createMapFromLayout = (
  layout: string[],
  objectProbability: number = 0.1,
  biome: 'default' | 'mine' | 'forest' = 'default'
): Plot[][] => {
  const plots: Plot[][] = []

  for (let y = 0; y < layout.length; y++) {
    const row: Plot[] = []
    const line = layout[y] || ''

    for (let x = 0; x < line.length; x++) {
      const char = line[x]
      let terrain: 'grass' | 'dirt' | 'paved' | 'water' | 'floor' | 'floor_light' | 'sand' = 'grass'
      let object: { type: string, id: string, hp: number } | undefined = undefined
      const isTilled = false

      switch (char) {
        case '~': terrain = 'water'; break
        case '=': terrain = 'paved'; break
        case '_': terrain = 'floor'; break
        case '+': terrain = 'floor_light'; break
        case '"': terrain = 'sand'; break
        case '#': terrain = 'dirt'; break // Potential farming soil
        case '%':
          terrain = 'floor_light'
          object = { type: 'rug', id: `rug_${x}_${y}`, hp: 1 }
          break
        case '[':
          terrain = 'floor_light'
          object = { type: 'bed_head', id: `bed_${x}_${y}`, hp: 1 }
          break
        case ']':
          terrain = 'floor_light'
          object = { type: 'bed_foot', id: `bed_${x}_${y}`, hp: 1 }
          break
        case 'A':
          terrain = 'floor_light'
          object = { type: 'table', id: `table_${x}_${y}`, hp: 1 }
          break
        case '*':
          terrain = 'grass'
          object = { type: 'fence', id: `fence_${x}_${y}`, hp: 3 }
          break
        case 'T':
          terrain = 'grass'
          // Randomize tree type
          const treeType = ['tree_oak', 'tree_maple', 'tree_pine'][Math.floor(Math.random() * 3)] || 'tree_oak'
          object = { type: treeType, id: `${treeType}_${x}_${y}`, hp: 5 }
          break
        case 'B':
          terrain = 'grass'
          object = { type: 'shipping_bin', id: `bin_${x}_${y}`, hp: 999 }
          break
        case '<':
          terrain = 'floor_light'
          object = { type: 'ladder', id: `ladder_${x}_${y}`, hp: 999 }
          break
        case 'S':
          terrain = 'grass'
          object = { type: 'stone', id: `stone_${x}_${y}`, hp: 3 }
          break
        case 'C':
          terrain = 'grass'
          object = { type: 'copper_node', id: `copper_${x}_${y}`, hp: 4 }
          break
        case 'I':
          terrain = 'grass'
          object = { type: 'iron_node', id: `iron_${x}_${y}`, hp: 6 }
          break
        case 'G':
          terrain = 'grass'
          object = { type: 'gold_node', id: `gold_${x}_${y}`, hp: 8 }
          break
        case 'R':
          terrain = 'grass'
          object = { type: 'iridium_node', id: `iridium_${x}_${y}`, hp: 12 }
          break
        case 'W':
          terrain = 'grass'
          object = { type: 'wood', id: `wood_${x}_${y}`, hp: 3 }
          break
        case 'F':
          terrain = 'grass'
          object = { type: 'weed', id: `weed_${x}_${y}`, hp: 1 }
          break
        case 'J':
          terrain = 'grass'
          object = { type: 'iron_node', id: `joja_${x}_${y}`, hp: 999 } // Industrial look
          break
        case '.':
        default:
          terrain = 'grass'
          if (biome === 'mine') {
             terrain = 'dirt' // Mines are usually dirt/stone floor
          }

          // Random objects on grass/dirt
          if (Math.random() < objectProbability) {
             const rand = Math.random()
             if (biome === 'mine') {
                 if (rand < 0.6) object = { type: 'stone', id: `stone_${x}_${y}`, hp: 3 }
                 else if (rand < 0.75) object = { type: 'copper_node', id: `copper_${x}_${y}`, hp: 4 }
                 else if (rand < 0.85) object = { type: 'iron_node', id: `iron_${x}_${y}`, hp: 6 }
                 else if (rand < 0.92) object = { type: 'gold_node', id: `gold_${x}_${y}`, hp: 8 }
                 else if (rand < 0.95) object = { type: 'iridium_node', id: `iridium_${x}_${y}`, hp: 12 }
                 else object = { type: 'weed', id: `weed_${x}_${y}`, hp: 1 }
             } else {
                 // Farm/Wild
                 // Less clutter than original Stardew start
                 if (rand < 0.1) object = { type: 'stone', id: `stone_${x}_${y}`, hp: 3 }
                 else if (rand < 0.2) object = { type: 'wood', id: `wood_${x}_${y}`, hp: 3 }
                 else if (rand < 0.3) object = { type: 'weed', id: `weed_${x}_${y}`, hp: 1 }
             }
          }
          break
      }

      row.push({
        x,
        y,
        isTilled,
        hasCrop: false,
        object,
        terrain
      })
    }
    plots.push(row)
  }
  return plots
}

const FARM_LAYOUT = [
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TT........................................................TT",
  "TT........................................................TT",
  "TT....HHHHHH..............TTT.......TTT.......TTT.........TT",
  "TT....HHHHHH..............TTT.......TTT.......TTT.........TT",
  "TT....HHHHHH..............TTT.......TTT.......TTT.........TT",
  "TT....HHHHHH..............TTT.......TTT.......TTT.........TT",
  "TT....HHHHHH.B............................................TT",
  "TT........................................................TT",
  "TT........................######################..........TT",
  "TT........................######################..........TT",
  "TT........................######################..........TT",
  "TT........................######################..........TT",
  "TT.......~~~~.............######################..........TT",
  "TT.......~~~~.............######################..........TT",
  "TT.......~~~~.............######################..........TT",
  "TT.......~~~~.............######################..........TT",
  "TT.......~~~~.............######################..........TT",
  "TT.......~~~~.............................................TT",
  "TT........................................................TT",
  "TT........................................................TT",
  "TT........................................................TT",
  "TT........................................................TT",
  "TT........................................................TT",
  "TT..........TTT...........................................TT",
  "TT..........TTT...........................................TT",
  "TT..........TTT...........................................TT",
  "TT..........TTT.......................~~~~~~..............TT",
  "TT....................................~~~~~~..............TT",
  "TT....................................~~~~~~..............TT",
  "TT....................................~~~~~~..............TT",
  "TT....................................~~~~~~..............TT",
  "TT........................................................TT",
  "TT........................................................TT",
  "TT........................................................TT",
  "TT........................................................TT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
]

const MOUNTAIN_LAYOUT = [
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TT...................<.................TT", // Mine entrance
  "TT.....................................TT",
  "TT.....................................TT", // Robin's house area (Cleared)
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT~~~~~~~..............................TT",
  "TT~~~~~~~..............................TT",
  "TT~~~~~~~..............................TT", // Linus tent (Cleared)
  "TT~~~~~~~..............................TT",
  "TT~~~~~~~..............................TT",
  "TT~~~~~~~..............................TT",
  "TT~~~~~~~..............................TT",
  "TT~~~~~~~..............................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT=====================================TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
]

const FOREST_LAYOUT = [
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT", // Marnie's ranch (Cleared)
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT", // Wizard tower (Cleared)
  "TT.....................................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TT~~~~~~~~~~~~.........................TT",
  "TT~~~~~~~~~~~~.........................TT",
  "TT~~~~~~~~~~~~.........................TT",
  "TT.....................................TT",
  "TT.....................................TT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
]

const BEACH_LAYOUT = [
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'TT.....................................TT',
  'TT.....................................TT',
  'TT.....................................TT',
  'TT.....................................TT', // Willy's shop (Cleared)
  'TT.....................................TT',
  'TT.....................................TT',
  'TT.....................................TT',
  'TT.....................................TT',
  'TT.....................................TT',
  'TT"""""""""""""""""""""""""""""""""""""TT',
  'TT"""""""""""""""""""""""""""""""""""""TT',
  'TT"""""""""""""""""""""""""""""""""""""TT',
  'TT"""""""""""""""""""""""""""""""""""""TT',
  'TT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TT',
  'TT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TT',
  'TT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TT',
  'TT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TT',
  'TT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TT',
  'TT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TT'
]

const TOWN_LAYOUT = [
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TT....................................TT",
  "TT....................................TT",
  "TT...SSSSS.SSSSSSS..SSSSSSS..JJJJJJJ..TT",
  "TT...S...S.S.....S..S.....S..J.....J..TT",
  "TT...S...S.S.....S..S.....S..J.....J..TT",
  "TT...SSSSS.SSSSSSS..SSSSSSS..JJJJJJJ..TT",
  "TT....................................TT",
  "TT....................................TT",
  "TT====================================TT",
  "TT====================================TT",
  "TT............................SSSSSSS.TT",
  "TT............................S.....S.TT",
  "TT............................S.....S.TT",
  "TT.........AAAAAAA............SSSSSSS.TT",
  "TT.........A.....A....................TT",
  "TT.........A.....A....................TT",
  "TT.........AAAAAAA....................TT",
  "TT....................................TT",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
]

const STORE_LAYOUT = [
  "WWWWWWWWWWWWWWW",
  "W.............W",
  "W.............W",
  "W...%%%%%%%...W",
  "W.............W",
  "W.............W",
  "W.............W",
  "W.............W",
  "W.............W",
  "W.............W",
  "W......=......W",
  "WWWWWWWWWWWWWWW"
]

const SALOON_LAYOUT = [
  "WWWWWWWWWWWWWWWWWWWW",
  "W..................W",
  "W...%%%%%%%%%%%%...W",
  "W..................W",
  "W...AA...AA...AA...W",
  "W..................W",
  "W...AA...AA...AA...W",
  "W..................W",
  "W..................W",
  "W..................W",
  "W.........=........W",
  "WWWWWWWWWWWWWWWWWWWW"
]

const BLACKSMITH_LAYOUT = [
  "WWWWWWWWWWWWWWW",
  "W.............W",
  "W.............W",
  "W...%%%%%%%...W",
  "W.............W",
  "W.............W",
  "W...S...C...I.W",
  "W.............W",
  "W.............W",
  "W.............W",
  "W......=......W",
  "WWWWWWWWWWWWWWW"
]

const CARPENTER_LAYOUT = [
  "WWWWWWWWWWWWWWWW",
  "W..............W",
  "W...%%%%%%%%...W",
  "W..............W",
  "W..............W",
  "W..............W",
  "W...A......A...W",
  "W..............W",
  "W......=.......W",
  "WWWWWWWWWWWWWWWW"
]

const RANCH_LAYOUT = [
  "WWWWWWWWWWWWWWWW",
  "W..............W",
  "W...%%%%%%%%...W",
  "W..............W",
  "W..............W",
  "W...A..........W",
  "W..............W",
  "W......=.......W",
  "WWWWWWWWWWWWWWWW"
]

const FISH_SHOP_LAYOUT = [
  "WWWWWWWWWWWW",
  "W..........W",
  "W...%%%%...W",
  "W..........W",
  "W..........W",
  "W...A......W",
  "W..........W",
  "W.....=....W",
  "WWWWWWWWWWWW"
]

const HARVEY_CLINIC_LAYOUT = [
  "WWWWWWWWWWWW",
  "W..........W", // Harvey's room
  "W...%%%%...W",
  "W..........W",
  "W..........W", // Exam room / Counter
  "W...A......W", // Counter
  "W..........W",
  "W.....=....W", // Entrance
  "WWWWWWWWWWWW"
]

const WIZARD_TOWER_LAYOUT = [
  "WWWWWWWWWWWW",
  "W..........W",
  "W...%%%%...W", // Cauldron/Magic circle
  "W..........W",
  "W..........W",
  "W...A......W", // Desk
  "W..........W",
  "W.....=....W", // Entrance
  "WWWWWWWWWWWW"
]

const JOJA_MART_LAYOUT = [
  "WWWWWWWWWWWWWWWWWWWW",
  "W..................W",
  "W...%%%%%%%%%%%%...W", // Shelves
  "W..................W",
  "W...%%%%%%%%%%%%...W",
  "W..................W",
  "W...A......A.......W", // Counters (Morris, Checkout)
  "W..................W",
  "W.........=........W", // Entrance
  "WWWWWWWWWWWWWWWWWWWW"
]

export const MAPS: Record<string, MapConfig> = {
  // 1. FARM
  farm: {
    id: 'farm',
    width: 60,
    height: 40,
    teleports: [
      { x: 59, y: 20, targetMap: 'town', targetX: 1, targetY: 10 },
      { x: 59, y: 21, targetMap: 'town', targetX: 1, targetY: 11 },
      { x: 30, y: 0, targetMap: 'mountain', targetX: 20, targetY: 22 }, // North to Mountain
      { x: 31, y: 0, targetMap: 'mountain', targetX: 21, targetY: 22 },
      { x: 30, y: 39, targetMap: 'forest', targetX: 20, targetY: 1 },   // South to Forest
      { x: 31, y: 39, targetMap: 'forest', targetX: 21, targetY: 1 },
      { x: 9, y: 8, targetMap: 'house', targetX: 5, targetY: 8 }
    ],
    buildings: [
      { id: 'farmhouse', type: 'house', x: 6, y: 4, width: 6, height: 5, doorX: 9, doorY: 8 }
    ],
    generatePlots: () => createMapFromLayout(FARM_LAYOUT, 0.05)
  },
  // 2. HOUSE
  house: {
    id: 'house',
    width: 12,
    height: 10,
    teleports: [
      { x: 5, y: 9, targetMap: 'farm', targetX: 9, targetY: 9 }
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout([
      "____________",
      "____________",
      "__[__]______",
      "____________",
      "_____A______",
      "____________",
      "____________",
      "____________",
      "____________",
      "_____=______"
    ], 0)
  },
  // 3. TOWN
  town: {
    id: 'town',
    width: 40,
    height: 20,
    teleports: [
      { x: 0, y: 10, targetMap: 'farm', targetX: 58, targetY: 20 },
      { x: 0, y: 11, targetMap: 'farm', targetX: 58, targetY: 21 },
      { x: 20, y: 19, targetMap: 'beach', targetX: 20, targetY: 1 }, // South to Beach
      { x: 21, y: 19, targetMap: 'beach', targetX: 21, targetY: 1 },
      { x: 20, y: 0, targetMap: 'mountain', targetX: 35, targetY: 22 }, // North to Mountain (Link to side)
      { x: 7, y: 8, targetMap: 'harvey_clinic', targetX: 6, targetY: 7 }, // Harvey's Clinic
      { x: 14, y: 8, targetMap: 'store', targetX: 7, targetY: 10 }, // Pierre's Store
      { x: 23, y: 8, targetMap: 'saloon', targetX: 10, targetY: 10 }, // Saloon
      { x: 33, y: 15, targetMap: 'blacksmith', targetX: 7, targetY: 10 } // Blacksmith
    ],
    buildings: [
      { id: 'harvey_clinic', type: 'house', x: 5, y: 4, width: 5, height: 5, doorX: 7, doorY: 8 },
      { id: 'shop', type: 'shop', x: 11, y: 4, width: 7, height: 5, doorX: 14, doorY: 8 },
      { id: 'saloon', type: 'shop', x: 20, y: 4, width: 7, height: 5, doorX: 23, doorY: 8 }, // Saloon next to shop
      { id: 'blacksmith', type: 'barn', x: 30, y: 12, width: 7, height: 5, doorX: 33, doorY: 15 }, // Blacksmith bottom right
      { id: 'community_center', type: 'barn', x: 11, y: 15, width: 7, height: 5, doorX: 14, doorY: 19 } // Placeholder
    ],
    generatePlots: () => createMapFromLayout(TOWN_LAYOUT, 0)
  },
  // 3.1 STORE (Pierre's)
  store: {
    id: 'store',
    width: 15,
    height: 12,
    teleports: [
      { x: 7, y: 11, targetMap: 'town', targetX: 14, targetY: 9 }
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(STORE_LAYOUT, 0)
  },
  // 3.2 SALOON
  saloon: {
    id: 'saloon',
    width: 20,
    height: 12,
    teleports: [
      { x: 10, y: 11, targetMap: 'town', targetX: 23, targetY: 9 }
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(SALOON_LAYOUT, 0)
  },
  // 3.3 BLACKSMITH
  blacksmith: {
    id: 'blacksmith',
    width: 15,
    height: 12,
    teleports: [
      { x: 7, y: 11, targetMap: 'town', targetX: 33, targetY: 16 }
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(BLACKSMITH_LAYOUT, 0)
  },
  // 3.4 CARPENTER (Robin)
  carpenter: {
    id: 'carpenter',
    width: 16,
    height: 10,
    teleports: [
      { x: 7, y: 9, targetMap: 'mountain', targetX: 10, targetY: 8 }
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(CARPENTER_LAYOUT, 0)
  },
  // 3.5 RANCH (Marnie)
  ranch: {
    id: 'ranch',
    width: 16,
    height: 9,
    teleports: [
      { x: 7, y: 8, targetMap: 'forest', targetX: 10, targetY: 9 }
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(RANCH_LAYOUT, 0)
  },
  // 3.6 JOJA MART
  joja_mart: {
    id: 'joja_mart',
    width: 20,
    height: 10,
    teleports: [
      { x: 9, y: 8, targetMap: 'town', targetX: 25, targetY: 5 } // Placeholder exit
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(JOJA_MART_LAYOUT, 0)
  },
  // 4. MOUNTAIN
  mountain: {
    id: 'mountain',
    width: 40,
    height: 24,
    teleports: [
      { x: 20, y: 23, targetMap: 'farm', targetX: 30, targetY: 1 }, // South to Farm
      { x: 21, y: 23, targetMap: 'farm', targetX: 31, targetY: 1 },
      { x: 35, y: 23, targetMap: 'town', targetX: 20, targetY: 1 }, // South-East to Town
      { x: 21, y: 1, targetMap: 'mine', targetX: 10, targetY: 18 },   // Cave Entrance
      { x: 10, y: 7, targetMap: 'carpenter', targetX: 7, targetY: 8 } // Robin's House
    ],
    buildings: [
      { id: 'carpenter', type: 'house', x: 7, y: 3, width: 6, height: 5, doorX: 10, doorY: 7 }
    ],
    generatePlots: () => createMapFromLayout(MOUNTAIN_LAYOUT, 0.1)
  },
  // 5. FOREST
  forest: {
    id: 'forest',
    width: 40,
    height: 19,
    teleports: [
      { x: 20, y: 0, targetMap: 'farm', targetX: 30, targetY: 38 }, // North to Farm
      { x: 21, y: 0, targetMap: 'farm', targetX: 31, targetY: 38 },
      { x: 10, y: 8, targetMap: 'ranch', targetX: 7, targetY: 7 }, // Marnie's Ranch
      { x: 23, y: 13, targetMap: 'wizard_tower', targetX: 6, targetY: 7 } // Wizard Tower
    ],
    buildings: [
      { id: 'ranch', type: 'barn', x: 7, y: 4, width: 6, height: 5, doorX: 10, doorY: 8 },
      { id: 'wizard', type: 'tower', x: 21, y: 9, width: 4, height: 5, doorX: 23, doorY: 13 }
    ],
    generatePlots: () => createMapFromLayout(FOREST_LAYOUT, 0.1, 'forest')
  },
  // 6. BEACH
  beach: {
    id: 'beach',
    width: 40,
    height: 20,
    teleports: [
      { x: 20, y: 0, targetMap: 'town', targetX: 20, targetY: 18 },
      { x: 21, y: 0, targetMap: 'town', targetX: 21, targetY: 18 },
      { x: 14, y: 8, targetMap: 'fish_shop', targetX: 6, targetY: 7 } // Willy's Shop
    ],
    buildings: [
      { id: 'fish_shop', type: 'house', x: 11, y: 4, width: 6, height: 5, doorX: 14, doorY: 8 }
    ],
    generatePlots: () => createMapFromLayout(BEACH_LAYOUT, 0.05)
  },
  // 6.1 FISH SHOP
  fish_shop: {
    id: 'fish_shop',
    width: 12,
    height: 9,
    teleports: [
      { x: 6, y: 8, targetMap: 'beach', targetX: 14, targetY: 9 }
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(FISH_SHOP_LAYOUT, 0)
  },
  // 6.2 HARVEY CLINIC
  harvey_clinic: {
    id: 'harvey_clinic',
    width: 12,
    height: 9,
    teleports: [
      { x: 6, y: 8, targetMap: 'town', targetX: 7, targetY: 9 }
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(HARVEY_CLINIC_LAYOUT, 0)
  },
  // 6.3 WIZARD TOWER
  wizard_tower: {
    id: 'wizard_tower',
    width: 12,
    height: 9,
    teleports: [
      { x: 6, y: 8, targetMap: 'forest', targetX: 23, targetY: 14 } // Back to Forest
    ],
    buildings: [],
    generatePlots: () => createMapFromLayout(WIZARD_TOWER_LAYOUT, 0)
  },
  // 7. MINE
  mine: {
    id: 'mine',
    width: 20,
    height: 20,
    teleports: [
      { x: 10, y: 19, targetMap: 'mountain', targetX: 21, targetY: 2 } // Exit to Mountain
    ],
    buildings: [],
    generatePlots: () => {
       // Randomly generate a mine layout
       const width = 20
       const height = 20
       const layout: string[] = []
       for (let y = 0; y < height; y++) {
         let row = ''
         for (let x = 0; x < width; x++) {
           // Borders
           if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
             row += 'S' // Stone wall
           } else {
             row += '.'
           }
         }
         layout.push(row)
       }
       // Add ladder at entrance
       if (layout[2]) {
         const chars = layout[2].split('')
         chars[10] = '<' // Ladder up
         layout[2] = chars.join('')
       }

       return createMapFromLayout(layout, 0.15, 'mine')
    }
  }
}
