export interface FurnitureDefinition {
  id: string
  name: string
  type: 'chair' | 'table' | 'bed' | 'lamp' | 'decor' | 'rug' | 'fireplace' | 'window'
  width: number
  height: number
  price: number
  description: string
  icon: string
  rotation?: number // 0, 90, 180, 270
}

export const FURNITURE: Record<string, FurnitureDefinition> = {
  // --- Beds ---
  basic_bed: { id: 'basic_bed', name: '简易床', type: 'bed', width: 2, height: 3, price: 500, description: '一张普通的床。', icon: '🛏️' },
  double_bed: { id: 'double_bed', name: '双人床', type: 'bed', width: 3, height: 3, price: 2000, description: '足够两个人睡。', icon: '🛏️' },
  birch_bed: { id: 'birch_bed', name: '桦木床', type: 'bed', width: 2, height: 3, price: 1000, description: '优雅的桦木床。', icon: '🛏️' },

  // --- Tables ---
  oak_table: { id: 'oak_table', name: '橡木桌', type: 'table', width: 2, height: 2, price: 350, description: '坚固的橡木桌。', icon: '🟫' },
  birch_table: { id: 'birch_table', name: '桦木桌', type: 'table', width: 2, height: 2, price: 350, description: '明亮的桦木桌。', icon: '🟫' },
  mahogany_table: { id: 'mahogany_table', name: '红木桌', type: 'table', width: 3, height: 2, price: 800, description: '昂贵的红木桌。', icon: '🟫' },
  coffee_table: { id: 'coffee_table', name: '咖啡桌', type: 'table', width: 2, height: 1, price: 250, description: '放在沙发前很完美。', icon: '🟫' },

  // --- Chairs ---
  oak_chair: { id: 'oak_chair', name: '橡木椅', type: 'chair', width: 1, height: 1, price: 150, description: '普通的椅子。', icon: '🪑' },
  dining_chair: { id: 'dining_chair', name: '餐椅', type: 'chair', width: 1, height: 1, price: 200, description: '坐垫很软。', icon: '🪑' },
  plush_seat: { id: 'plush_seat', name: '毛绒座椅', type: 'chair', width: 1, height: 1, price: 400, description: '非常舒适。', icon: '🪑' },
  green_armchair: { id: 'green_armchair', name: '绿色扶手椅', type: 'chair', width: 2, height: 1, price: 500, description: '复古风格。', icon: '🛋️' },

  // --- Decor ---
  house_plant: { id: 'house_plant', name: '室内植物', type: 'decor', width: 1, height: 1, price: 250, description: '给房间增添生机。', icon: '🪴' },
  painting_landscape: { id: 'painting_landscape', name: '风景画', type: 'decor', width: 2, height: 1, price: 400, description: '一幅美丽的风景画。', icon: '🖼️' },
  small_plant: { id: 'small_plant', name: '小盆栽', type: 'decor', width: 1, height: 1, price: 50, description: '可爱的小植物。', icon: '🪴' },
  globe: { id: 'globe', name: '地球仪', type: 'decor', width: 1, height: 1, price: 200, description: '世界就在你手中。', icon: '🌍' },
  model_ship: { id: 'model_ship', name: '模型船', type: 'decor', width: 1, height: 1, price: 300, description: '精细的模型。', icon: '⛵' },

  // --- Rugs ---
  red_rug: { id: 'red_rug', name: '红地毯', type: 'rug', width: 3, height: 2, price: 400, description: '温暖的红色地毯。', icon: '🟥' },
  patchwork_rug: { id: 'patchwork_rug', name: '拼布地毯', type: 'rug', width: 3, height: 2, price: 350, description: '色彩斑斓。', icon: '🟧' },
  dark_rug: { id: 'dark_rug', name: '深色地毯', type: 'rug', width: 3, height: 2, price: 400, description: '耐脏。', icon: '⬛' },

  // --- Lamps ---
  floor_lamp: { id: 'floor_lamp', name: '落地灯', type: 'lamp', width: 1, height: 2, price: 300, description: '照亮房间角落。', icon: '🛋️' },
  table_lamp: { id: 'table_lamp', name: '台灯', type: 'lamp', width: 1, height: 1, price: 150, description: '适合阅读。', icon: '💡' },

  // --- Fireplaces ---
  brick_fireplace: { id: 'brick_fireplace', name: '砖砌壁炉', type: 'fireplace', width: 2, height: 1, price: 1500, description: '温暖舒适。', icon: '🔥' },
  stone_fireplace: { id: 'stone_fireplace', name: '石壁炉', type: 'fireplace', width: 2, height: 1, price: 1500, description: '坚固耐用。', icon: '🔥' },

  // --- Windows ---
  small_window: { id: 'small_window', name: '小窗户', type: 'window', width: 1, height: 1, price: 50, description: '让阳光进来。', icon: '🪟' },
  large_window: { id: 'large_window', name: '大窗户', type: 'window', width: 2, height: 1, price: 100, description: '视野开阔。', icon: '🪟' }
}
