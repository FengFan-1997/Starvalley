export class SoundManager {
  private static instance: SoundManager
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled: boolean = true

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  public preloadSound(key: string, src: string) {
    const audio = new Audio(src)
    audio.preload = 'auto'
    this.sounds.set(key, audio)
  }

  public play(key: string, volume: number = 1.0) {
    if (!this.enabled) return

    const sound = this.sounds.get(key)
    if (sound) {
      // Clone to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement
      clone.volume = volume
      clone.play().catch(e => console.warn(`Failed to play sound ${key}:`, e))
    } else {
      console.log(`[SoundManager] Playing mock sound: ${key}`)
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
  }
}
