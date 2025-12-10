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
                 if (rand < 0.3) object = { type: 'stone', id: `stone_${x}_${y}`, hp: 3 }
                 else if (rand < 0.6) object = { type: 'wood', id: `wood_${x}_${y}`, hp: 3 }
                 else object = { type: 'weed', id: `weed_${x}_${y}`, hp: 1 }
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

export const MAPS: Record<string, MapConfig> = {
  // 1. FARM
  farm: {
    id: 'farm',
    width: 30,
    height: 20,
    teleports: [
      { x: 29, y: 10, targetMap: 'town', targetX: 1, targetY: 10 }, // Right -> Town
      { x: 29, y: 11, targetMap: 'town', targetX: 1, targetY: 11 },
      { x: 7, y: 6, targetMap: 'house', targetX: 5, targetY: 8 }    // Enter House
    ],
    buildings: [
      { id: 'farmhouse', type: 'house', x: 2, y: 2, width: 6, height: 5, doorX: 7, doorY: 6 }
    ],
    generatePlots: () => createMapFromLayout([
      "TTTTT..TTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTT..TTTTTTTTTTTTTTTTTTTTTTT",
      "..HHHHHH.......T...T...TT...TT",
      "..HHHHHH.......T...T...TT...TT",
      "..HHHHHH.......T.......TT...TT",
      "..HHHHHH.......********.......",
      "..HHHHHH.......#######*.......",
      "...............#######*.......",
      "...............#######*.......",
      "...............********.......",
      "..............................",
      "..............................",
      "~~~~~~........................",
      "~~~~~~........................",
      "~~~~~~...........#############",
      "~~~~~~...........#############",
      "TTTTTT...........#############",
      "TTTTTT........................",
      "TTTTTT.......S....S.....S.....",
      "TTTTTT.......S....S.....S....."
    ], 0.15)
  },

  // 2. HOUSE (Interior)
  house: {
    id: 'house',
    width: 12,
    height: 10,
    teleports: [
      { x: 5, y: 9, targetMap: 'farm', targetX: 7, targetY: 7 }, // Exit House
      { x: 6, y: 9, targetMap: 'farm', targetX: 7, targetY: 7 }
    ],
    generatePlots: () => createMapFromLayout([
      "++++++++++++",
      "++++++++++++",
      "++[A++++++++",
      "++]+++++++++",
      "++%+++++++++",
      "++++++++++++",
      "++++++++++++",
      "++++++++++++",
      "++++++++++++",
      "++++..++++++" // Door mat area
    ], 0)
  },

  // 3. TOWN
  town: {
    id: 'town',
    width: 40,
    height: 30,
    teleports: [
      { x: 0, y: 10, targetMap: 'farm', targetX: 28, targetY: 10 }, // Left -> Farm
      { x: 0, y: 11, targetMap: 'farm', targetX: 28, targetY: 11 },
      { x: 15, y: 12, targetMap: 'shop', targetX: 5, targetY: 9 },  // Enter Pierre's
      { x: 20, y: 29, targetMap: 'beach', targetX: 15, targetY: 1 }, // Down -> Beach
      { x: 39, y: 15, targetMap: 'mountain', targetX: 1, targetY: 15 }, // Right -> Mountain
      { x: 20, y: 0, targetMap: 'mountain', targetX: 20, targetY: 28 } // Up -> Mountain
    ],
    buildings: [
      { id: 'pierre_store', type: 'store', x: 12, y: 5, width: 8, height: 7, doorX: 15, doorY: 12 },
      { id: 'clinic', type: 'clinic', x: 22, y: 5, width: 6, height: 7 },
      { id: 'saloon', type: 'saloon', x: 15, y: 18, width: 10, height: 6 }
    ],
    generatePlots: () => createMapFromLayout([
      "TTTTTTTTTTTTTT..==..TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTT..==..TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTT..==..TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTT..==..TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTT..==..TTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTT..==..TTTTTTTTTTTTTTTTTTTT",
      "................==......................",
      "................==......................",
      "................==......................",
      "................==......................",
      "==============..==..====================",
      "==============..==..====================",
      "................==......................",
      "................==......................",
      "................==......................",
      "................==......................",
      "................==......................",
      "................==......................",
      ".......=========........................",
      ".......=................................",
      ".......=................................",
      ".......=................................",
      ".......=................................",
      ".......=................................",
      ".......=................................",
      ".......=................................",
      ".......=................................",
      ".......=................................",
      ".......=................................",
      ".......=................................"
    ], 0.05)
  },

  // 4. SHOP (Interior)
  shop: {
    id: 'shop',
    width: 12,
    height: 12,
    teleports: [
      { x: 5, y: 11, targetMap: 'town', targetX: 15, targetY: 13 },
      { x: 6, y: 11, targetMap: 'town', targetX: 15, targetY: 13 }
    ],
    generatePlots: () => createMapFromLayout([
      "++++++++++++",
      "++++++++++++",
      "++++++++++++",
      "+++++==+++++", // Counter area
      "++++++++++++",
      "++++++++++++",
      "++++++++++++",
      "++++++++++++",
      "++++++++++++",
      "++++++++++++",
      "++++++++++++",
      "++++..++++++"
    ], 0)
  },

  // 5. MOUNTAIN (Mines)
  mountain: {
    id: 'mountain',
    width: 30,
    height: 30,
    teleports: [
      { x: 20, y: 29, targetMap: 'town', targetX: 20, targetY: 1 }, // Down -> Town
      { x: 15, y: 5, targetMap: 'mine', targetX: 10, targetY: 10 }  // Enter Mine
    ],
    generatePlots: () => createMapFromLayout([
      "SSSSSSSSSSSSSSSS...SSSSSSSSSSS",
      "SSSSSSSSSSSSSS.......SSSSSSSSS",
      "SSSSSSSSSSSS...........SSSSSSS",
      "SSSSSSSSSS...............SSSSS",
      "SSSSSSSS...................SSS",
      "SSSSSS...........===.......SSS",
      "SSSS.............===.........S",
      "SS...............===.........S",
      "S................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      "~~~~~~~~.........===..........",
      "~~~~~~~~.........===..........",
      "~~~~~~~~.........===..........",
      "~~~~~~~~.........===..........",
      "~~~~~~~~.........===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===..........",
      ".................===.........."
    ], 0.3)
  },

  // 6. BEACH
  beach: {
    id: 'beach',
    width: 30,
    height: 20,
    teleports: [
      { x: 15, y: 0, targetMap: 'town', targetX: 20, targetY: 28 } // Up -> Town
    ],
    generatePlots: () => createMapFromLayout([
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "==============================", // Promenade
      "\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"",
      "\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"",
      "\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"",
      "\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"",
      "\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"",
      "\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"",
      "~~~~~~\"\"\"\"\"\"\"\"\"\"~~~~~~~~~~~~~~",
      "~~~~~~~~\"\"\"\"\"\"~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ], 0)
  },

  // 7. FOREST
  forest: {
    id: 'forest',
    width: 30,
    height: 30,
    teleports: [
      { x: 29, y: 15, targetMap: 'town', targetX: 1, targetY: 15 } // Right -> Town
    ],
    generatePlots: () => createMapFromLayout([
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TT.......TTTTTTTTTT...........",
      "T.........TTTTTTTT............",
      "...........TTTTTT.............",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "~~~~~.........................",
      "~~~~~.........................",
      "~~~~~.........................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      "..............................",
      ".............................."
    ], 0.4)
  },

  // 8. MINE
  mine: {
    id: 'mine',
    width: 20,
    height: 20,
    teleports: [
      { x: 10, y: 10, targetMap: 'mountain', targetX: 15, targetY: 6 } // Exit -> Mountain
    ],
    generatePlots: () => createMapFromLayout([
      "SSSSSSSSSSSSSSSSSSSS",
      "SSSSSSSSSSSSSSSSSSSS",
      "SS................SS",
      "SS................SS",
      "SS................SS",
      "SS................SS",
      "SS................SS",
      "SS.......C........SS",
      "SS......ICI.......SS",
      "SS.......G........SS",
      "SS......<=........SS", // Ladder/Exit
      "SS................SS",
      "SS................SS",
      "SS................SS",
      "SS................SS",
      "SS................SS",
      "SS................SS",
      "SS................SS",
      "SSSSSSSSSSSSSSSSSSSS",
      "SSSSSSSSSSSSSSSSSSSS"
    ], 0.4, 'mine') // High object probability for stones/ores
  }
}
