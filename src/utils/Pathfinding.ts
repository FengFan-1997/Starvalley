import type { GameState } from '@/stores/game'
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
  gameState: GameState
): Point[] => {
  const startNode = new Node(Math.round(startX), Math.round(startY))
  const endNode = new Node(Math.round(endX), Math.round(endY))

  const openList: Node[] = []
  const closedList: Set<string> = new Set()

  openList.push(startNode)

  // Safety break
  let iterations = 0
  const MAX_ITERATIONS = 1000

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
      if (!isValidLocation(newX, newY, gameState)) {
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

const isValidLocation = (x: number, y: number, gameState: GameState): boolean => {
    // 1. Check bounds
    if (y < 0 || y >= gameState.plots.length) return false
    const row = gameState.plots[y]
    if (!row || x < 0 || x >= row.length) return false
    const plot = row[x]
    if (!plot) return false

    // 2. Check terrain
    if (plot.terrain === 'water') return false

    // 3. Check objects (collidable)
    if (plot.object) {
        // Some objects might be passable? For now assume all block path
        // Maybe 'floor' objects don't?
        // But plot.object usually means something on top like stone, wood, machine
        // Passable: maybe 'rug'?
        return false
    }

    // 4. Check buildings
    const mapConfig = MAPS[gameState.location]
    if (mapConfig && mapConfig.buildings) {
        for (const b of mapConfig.buildings) {
             // Check if inside building footprint
             if (x >= b.x && x < b.x + b.width &&
                 y >= b.y && y < b.y + b.height) {
                 return false
             }
        }
    }

    return true
}
