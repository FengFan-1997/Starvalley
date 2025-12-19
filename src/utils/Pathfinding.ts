import type { GameState } from '@/types'
import { MAPS } from '@/data/maps'

interface Point {
  x: number
  y: number
}

class Node {
  x: number
  y: number
  g: number = 0
  h: number = 0
  f: number = 0
  parent: Node | null = null

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export const findPath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  gameState: GameState,
  mapId: string
): Point[] => {
  const startNode = new Node(Math.round(startX), Math.round(startY))
  const endNode = new Node(Math.round(endX), Math.round(endY))

  // If start is same as end, return empty path
  if (startNode.x === endNode.x && startNode.y === endNode.y) {
    return []
  }

  const openList: Node[] = []
  const closedList: Set<string> = new Set()

  openList.push(startNode)

  // Safety break
  let iterations = 0
  const MAX_ITERATIONS = 2000 // Increased for larger maps

  while (openList.length > 0) {
    iterations++
    if (iterations > MAX_ITERATIONS) break // Too complex or stuck

    // Find node with lowest f
    let currentNode: Node = openList[0]!
    let currentIndex = 0
    for (let i = 1; i < openList.length; i++) {
      const node = openList[i]
      if (node && node.f < currentNode.f) {
        currentNode = node
        currentIndex = i
      }
    }

    // Remove current from open, add to closed
    openList.splice(currentIndex, 1)
    closedList.add(`${currentNode.x},${currentNode.y}`)

    // Found destination?
    if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
      const path: Point[] = []
      let curr: Node | null = currentNode
      while (curr) {
        path.push({ x: curr.x, y: curr.y })
        curr = curr.parent
      }
      return path.reverse() // Start to End
    }

    // Generate children
    const neighbors = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 },  // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 }   // Right
    ]

    for (const offset of neighbors) {
      const newX = currentNode.x + offset.x
      const newY = currentNode.y + offset.y

      // Check bounds and obstacles
      if (!isValidLocation(newX, newY, gameState, mapId)) {
        continue
      }

      const nodeKey = `${newX},${newY}`
      if (closedList.has(nodeKey)) continue

      // Create new node
      const neighbor = new Node(newX, newY)
      neighbor.parent = currentNode
      neighbor.g = currentNode.g + 1
      neighbor.h = Math.abs(neighbor.x - endNode.x) + Math.abs(neighbor.y - endNode.y) // Manhattan
      neighbor.f = neighbor.g + neighbor.h

      // Check if in open list with lower g
      const existing = openList.find(n => n.x === neighbor.x && n.y === neighbor.y)
      if (existing && existing.g <= neighbor.g) {
        continue
      }

      openList.push(neighbor)
    }
  }

  // No path found
  return []
}

const isValidLocation = (x: number, y: number, gameState: GameState, mapId: string): boolean => {
    // 1. Check Map Bounds
    const mapConfig = MAPS[mapId]
    if (mapConfig) {
        if (x < 0 || y < 0 || x >= mapConfig.width || y >= mapConfig.height) return false
    } else {
        // Fallback
        if (x < 0 || y < 0 || x > 100 || y > 100) return false
    }

    // 2. Check Farm Plots (only if on farm)
    // We only have plots for the current location loaded in gameState usually,
    // or savedMaps.
    if (mapId === 'farm') {
        // If we are currently ON farm, gameState.plots is accurate.
        // If we are elsewhere, we should use savedMaps['farm'] if available,
        // or re-generate/mock.
        // For pathfinding, we really only care about static obstacles if the map isn't loaded.
        // But let's try to be accurate.

        // If mapId matches current location, use active plots
        const usePlots = (gameState.location === 'farm') ? gameState.plots : gameState.savedMaps['farm']

        if (usePlots && y < usePlots.length) {
            const row = usePlots[y]
            if (row && x < row.length) {
                const plot = row[x]
                if (plot) {
                    if (plot.terrain === 'water') return false
                    // Objects block path
                    if (plot.object && plot.object.type !== 'weed') return false
                    // Weeds are passable? In Stardew they slow you down but are passable?
                    // Actually they block movement usually until cut.
                }
            }
        }
    } else {
        // Non-farm maps don't have dynamic plots in this engine yet (except maybe mine)
        // They use static layouts from createMapFromLayout which generates plots.
        // We can regenerate or cache.
        // For simplicity, let's assume non-farm maps only have buildings and static tiles as obstacles.
        // But wait, createMapFromLayout generates the base tiles (water, fences).
        // We should probably check the static layout logic.

        // Quick fix: Check if the tile is water/wall based on MAPS layout helper
        // Since we don't have the plots array easily accessible for off-screen maps without generating it.
        // Let's generate it temporarily or assume walkable if not building.
        // Actually, generating it is fast.
        // if (mapConfig && mapConfig.generatePlots) {
            // This is expensive to do every step!
            // We should cache map plots in the store.
            // For now, let's just check buildings.
        // }
    }

    // 3. Check Furniture (global)
    const mapFurniture = gameState.furniture[mapId] || []
    for (const furn of mapFurniture) {
        if (furn.x === x && furn.y === y) return false
    }

    // 4. Check Map Buildings/Obstacles
    if (mapConfig && mapConfig.buildings) {
        for (const b of mapConfig.buildings) {
             // Check if inside building footprint
             if (x >= b.x && x < b.x + b.width &&
                 y >= b.y && y < b.y + b.height) {
                 // Doors are walkable?
                 if (b.doorX !== undefined && b.doorY !== undefined && x === b.doorX && y === b.doorY) return true
                 return false
             }
        }
    }

    return true
}
