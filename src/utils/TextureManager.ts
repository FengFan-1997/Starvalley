import * as PIXI from 'pixi.js'
import { PALETTE, SPRITES } from '@/data/pixelArt'

export class TextureManager {
  private static instance: TextureManager
  private textures: Map<string, PIXI.Texture> = new Map()

  private constructor() {}

  public static getInstance(): TextureManager {
    if (!TextureManager.instance) {
      TextureManager.instance = new TextureManager()
    }
    return TextureManager.instance
  }

  public getTexture(key: string): PIXI.Texture {
    if (this.textures.has(key)) {
      return this.textures.get(key)!
    }

    if (SPRITES[key]) {
      const texture = this.generateTextureFromData(SPRITES[key])
      // Set scale mode to nearest neighbor for pixel art look
      texture.source.scaleMode = 'nearest'
      this.textures.set(key, texture)
      return texture
    }

    // Fallback for colored rectangles (e.g., "color_0xFF0000")
    if (key.startsWith('color_')) {
      const part = key.split('_')[1] || '000000'
      const colorHex = parseInt(part, 16)
      const texture = this.createSolidTexture(colorHex)
      this.textures.set(key, texture)
      return texture
    }

    return PIXI.Texture.WHITE // Fallback
  }

  public getDataUrl(key: string): string {
    if (SPRITES[key]) {
      const canvas = this.generateCanvasFromData(SPRITES[key])
      return canvas.toDataURL()
    }
    return ''
  }

  private generateTextureFromData(data: string[]): PIXI.Texture {
    const canvas = this.generateCanvasFromData(data)
    return PIXI.Texture.from(canvas)
  }

  private generateCanvasFromData(data: string[]): HTMLCanvasElement {
    const height = data.length
    const width = (data[0] ?? '').length

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    // Clear transparent
    ctx.clearRect(0, 0, width, height)

    for (let y = 0; y < height; y++) {
      const row = data[y] ?? ''
      for (let x = 0; x < width; x++) {
        const char = row[x] ?? ' '
        const color = PALETTE[char]

        if (color !== null && color !== undefined) {
          ctx.fillStyle = '#' + color.toString(16).padStart(6, '0')
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
    return canvas
  }

  private createSolidTexture(color: number): PIXI.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0')
    ctx.fillRect(0, 0, 16, 16)
    return PIXI.Texture.from(canvas)
  }
}
