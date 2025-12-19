export interface MachineRecipe {
  machineId: string
  inputs: { itemId: string, quantity: number }[]
  output: { itemId: string, quantity: number }
  processingTime: number // Game minutes
}

export const MACHINE_RECIPES: MachineRecipe[] = [
  // Furnace
  {
    machineId: 'furnace',
    inputs: [{ itemId: 'copper_ore', quantity: 5 }, { itemId: 'coal', quantity: 1 }],
    output: { itemId: 'copper_bar', quantity: 1 },
    processingTime: 30
  },
  {
    machineId: 'furnace',
    inputs: [{ itemId: 'iron_ore', quantity: 5 }, { itemId: 'coal', quantity: 1 }],
    output: { itemId: 'iron_bar', quantity: 1 },
    processingTime: 120
  },
  {
    machineId: 'furnace',
    inputs: [{ itemId: 'gold_ore', quantity: 5 }, { itemId: 'coal', quantity: 1 }],
    output: { itemId: 'gold_bar', quantity: 1 },
    processingTime: 300
  },

  // Mayonnaise Machine
  {
    machineId: 'mayonnaise_machine',
    inputs: [{ itemId: 'egg', quantity: 1 }],
    output: { itemId: 'mayonnaise', quantity: 1 },
    processingTime: 180
  },

  // Cheese Press
  {
    machineId: 'cheese_press',
    inputs: [{ itemId: 'milk', quantity: 1 }],
    output: { itemId: 'cheese', quantity: 1 },
    processingTime: 200
  },

  // Preserves Jar
  {
    machineId: 'preserves_jar',
    inputs: [{ itemId: 'tomato', quantity: 1 }],
    output: { itemId: 'pickles', quantity: 1 },
    processingTime: 4000
  },
  {
    machineId: 'preserves_jar',
    inputs: [{ itemId: 'corn', quantity: 1 }],
    output: { itemId: 'pickles', quantity: 1 },
    processingTime: 4000
  },
  {
    machineId: 'preserves_jar',
    inputs: [{ itemId: 'pumpkin', quantity: 1 }],
    output: { itemId: 'pickles', quantity: 1 },
    processingTime: 4000
  },
  {
    machineId: 'preserves_jar',
    inputs: [{ itemId: 'parsnip', quantity: 1 }],
    output: { itemId: 'pickles', quantity: 1 },
    processingTime: 4000
  },
  {
    machineId: 'preserves_jar',
    inputs: [{ itemId: 'potato', quantity: 1 }],
    output: { itemId: 'pickles', quantity: 1 },
    processingTime: 4000
  },
  {
    machineId: 'preserves_jar',
    inputs: [{ itemId: 'green_bean', quantity: 1 }],
    output: { itemId: 'pickles', quantity: 1 },
    processingTime: 4000
  },
  {
    machineId: 'preserves_jar',
    inputs: [{ itemId: 'cauliflower', quantity: 1 }],
    output: { itemId: 'pickles', quantity: 1 },
    processingTime: 4000
  },
  {
    machineId: 'preserves_jar',
    inputs: [{ itemId: 'kale', quantity: 1 }],
    output: { itemId: 'pickles', quantity: 1 },
    processingTime: 4000
  },

  // Keg
  {
    machineId: 'keg',
    inputs: [{ itemId: 'wheat', quantity: 1 }],
    output: { itemId: 'beer', quantity: 1 },
    processingTime: 1750
  },
  {
    machineId: 'keg',
    inputs: [{ itemId: 'grape', quantity: 1 }],
    output: { itemId: 'wine', quantity: 1 },
    processingTime: 10000
  },
  {
    machineId: 'keg',
    inputs: [{ itemId: 'coffee_bean', quantity: 5 }],
    output: { itemId: 'coffee', quantity: 1 },
    processingTime: 120
  },
  {
    machineId: 'keg',
    inputs: [{ itemId: 'honey', quantity: 1 }],
    output: { itemId: 'mead', quantity: 1 },
    processingTime: 600
  },
  
  // Loom
  {
    machineId: 'loom',
    inputs: [{ itemId: 'wool', quantity: 1 }],
    output: { itemId: 'cloth', quantity: 1 },
    processingTime: 240
  },

  // Oil Maker
  {
    machineId: 'oil_maker',
    inputs: [{ itemId: 'truffle', quantity: 1 }],
    output: { itemId: 'truffle_oil', quantity: 1 },
    processingTime: 360
  },
  {
    machineId: 'oil_maker',
    inputs: [{ itemId: 'corn', quantity: 1 }],
    output: { itemId: 'oil', quantity: 1 },
    processingTime: 1000 // approx 16 hours
  },
  {
    machineId: 'oil_maker',
    inputs: [{ itemId: 'sunflower_seeds', quantity: 1 }],
    output: { itemId: 'oil', quantity: 1 },
    processingTime: 200 // approx 3 hours
  },
  {
    machineId: 'oil_maker',
    inputs: [{ itemId: 'sunflower', quantity: 1 }],
    output: { itemId: 'oil', quantity: 1 },
    processingTime: 60
  },

  // Recycling Machine
  {
    machineId: 'recycling_machine',
    inputs: [{ itemId: 'trash', quantity: 1 }],
    output: { itemId: 'stone', quantity: 1 }, // simplified
    processingTime: 60
  },
  {
    machineId: 'recycling_machine',
    inputs: [{ itemId: 'driftwood', quantity: 1 }],
    output: { itemId: 'wood', quantity: 1 }, // simplified
    processingTime: 60
  },
  {
    machineId: 'recycling_machine',
    inputs: [{ itemId: 'broken_glasses', quantity: 1 }],
    output: { itemId: 'refined_quartz', quantity: 1 },
    processingTime: 60
  },
  {
    machineId: 'recycling_machine',
    inputs: [{ itemId: 'broken_cd', quantity: 1 }],
    output: { itemId: 'refined_quartz', quantity: 1 },
    processingTime: 60
  },
  {
    machineId: 'recycling_machine',
    inputs: [{ itemId: 'soggy_newspaper', quantity: 1 }],
    output: { itemId: 'torch', quantity: 3 },
    processingTime: 60
  },
  {
    machineId: 'keg',
    inputs: [{ itemId: 'tomato', quantity: 1 }],
    output: { itemId: 'juice', quantity: 1 },
    processingTime: 6000
  },
  {
    machineId: 'keg',
    inputs: [{ itemId: 'pumpkin', quantity: 1 }],
    output: { itemId: 'juice', quantity: 1 },
    processingTime: 6000
  },

  // Loom
  {
    machineId: 'loom',
    inputs: [{ itemId: 'wool', quantity: 1 }],
    output: { itemId: 'cloth', quantity: 1 },
    processingTime: 240
  },

  // Oil Maker
  {
    machineId: 'oil_maker',
    inputs: [{ itemId: 'corn', quantity: 1 }],
    output: { itemId: 'oil', quantity: 1 },
    processingTime: 1000
  },
  {
    machineId: 'oil_maker',
    inputs: [{ itemId: 'truffle', quantity: 1 }],
    output: { itemId: 'truffle_oil', quantity: 1 },
    processingTime: 360
  },

  // Furnace (Iridium)
  {
    machineId: 'furnace',
    inputs: [{ itemId: 'iridium_ore', quantity: 5 }, { itemId: 'coal', quantity: 1 }],
    output: { itemId: 'iridium_bar', quantity: 1 },
    processingTime: 480
  },

  // Keg (New Crops)
  { machineId: 'keg', inputs: [{ itemId: 'coffee_bean', quantity: 5 }], output: { itemId: 'coffee', quantity: 1 }, processingTime: 120 },
  { machineId: 'keg', inputs: [{ itemId: 'strawberry', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'grape', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'blueberry', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },

  // Preserves Jar (New Crops)
  { machineId: 'preserves_jar', inputs: [{ itemId: 'strawberry', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'grape', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'blueberry', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },

  // Seed Maker (New Crops)
  { machineId: 'seed_maker', inputs: [{ itemId: 'strawberry', quantity: 1 }], output: { itemId: 'strawberry_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'grape', quantity: 1 }], output: { itemId: 'grape_starter', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'blueberry', quantity: 1 }], output: { itemId: 'blueberry_seeds', quantity: 2 }, processingTime: 20 },

  // --- Restored Recipes ---
  { machineId: 'preserves_jar', inputs: [{ itemId: 'melon', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'wild_plum', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'blackberry', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'crystal_fruit', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'snow_yam', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'winter_root', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },

  { machineId: 'keg', inputs: [{ itemId: 'melon', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'wild_plum', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'blackberry', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'crystal_fruit', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },

  { machineId: 'seed_maker', inputs: [{ itemId: 'parsnip', quantity: 1 }], output: { itemId: 'parsnip_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'potato', quantity: 1 }], output: { itemId: 'potato_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'cauliflower', quantity: 1 }], output: { itemId: 'cauliflower_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'green_bean', quantity: 1 }], output: { itemId: 'bean_starter', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'kale', quantity: 1 }], output: { itemId: 'kale_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'wheat', quantity: 1 }], output: { itemId: 'wheat_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'tomato', quantity: 1 }], output: { itemId: 'tomato_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'corn', quantity: 1 }], output: { itemId: 'corn_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'pumpkin', quantity: 1 }], output: { itemId: 'pumpkin_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'melon', quantity: 1 }], output: { itemId: 'melon_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'tulip', quantity: 1 }], output: { itemId: 'tulip_bulb', quantity: 2 }, processingTime: 20 },

  // Recycling Machine
  { machineId: 'recycling_machine', inputs: [{ itemId: 'trash', quantity: 1 }], output: { itemId: 'stone', quantity: 3 }, processingTime: 60 },
  { machineId: 'recycling_machine', inputs: [{ itemId: 'driftwood', quantity: 1 }], output: { itemId: 'wood', quantity: 3 }, processingTime: 60 },
  { machineId: 'recycling_machine', inputs: [{ itemId: 'soggy_newspaper', quantity: 1 }], output: { itemId: 'torch', quantity: 3 }, processingTime: 60 },
  { machineId: 'recycling_machine', inputs: [{ itemId: 'broken_cd', quantity: 1 }], output: { itemId: 'refined_quartz', quantity: 1 }, processingTime: 60 },
  { machineId: 'recycling_machine', inputs: [{ itemId: 'broken_glasses', quantity: 1 }], output: { itemId: 'refined_quartz', quantity: 1 }, processingTime: 60 },

  // Charcoal Kiln
  { machineId: 'charcoal_kiln', inputs: [{ itemId: 'wood', quantity: 10 }], output: { itemId: 'coal', quantity: 1 }, processingTime: 30 },

  // --- Expanded Recipes ---
  // Keg - Fruits (Wine)
  { machineId: 'keg', inputs: [{ itemId: 'starfruit', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'ancient_fruit', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'rhubarb', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'strawberry', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'cranberries', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'pineapple', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'mango', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'banana', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'peach', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'orange', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'pomegranate', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'apple', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'cherry', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'apricot', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'coconut', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'cactus_fruit', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'spice_berry', quantity: 1 }], output: { itemId: 'wine', quantity: 1 }, processingTime: 10000 },
  { machineId: 'keg', inputs: [{ itemId: 'common_mushroom', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'red_mushroom', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'purple_mushroom', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },

  // Keg - Vegetables (Juice)
  { machineId: 'keg', inputs: [{ itemId: 'garlic', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'red_cabbage', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'radish', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'artichoke', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'beet', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'bok_choy', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'eggplant', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'yam', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'amaranth', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },
  { machineId: 'keg', inputs: [{ itemId: 'fiddlehead_fern', quantity: 1 }], output: { itemId: 'juice', quantity: 1 }, processingTime: 6000 },

  // Keg - Other
  { machineId: 'keg', inputs: [{ itemId: 'honey', quantity: 1 }], output: { itemId: 'mead', quantity: 1 }, processingTime: 600 },
  { machineId: 'keg', inputs: [{ itemId: 'tea_leaves', quantity: 1 }], output: { itemId: 'green_tea', quantity: 1 }, processingTime: 180 },
  { machineId: 'keg', inputs: [{ itemId: 'hops', quantity: 1 }], output: { itemId: 'pale_ale', quantity: 1 }, processingTime: 2250 },

  // Preserves Jar - Fruits (Jelly)
  { machineId: 'preserves_jar', inputs: [{ itemId: 'starfruit', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'ancient_fruit', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'rhubarb', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'cranberries', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'pineapple', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'mango', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'banana', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'peach', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'orange', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'pomegranate', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'apple', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'cherry', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'apricot', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'coconut', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'cactus_fruit', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'spice_berry', quantity: 1 }], output: { itemId: 'jelly', quantity: 1 }, processingTime: 4000 },

  // Preserves Jar - Vegetables (Pickles)
  { machineId: 'preserves_jar', inputs: [{ itemId: 'garlic', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'red_cabbage', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'radish', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'artichoke', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'beet', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'bok_choy', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'eggplant', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'yam', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'amaranth', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'fiddlehead_fern', quantity: 1 }], output: { itemId: 'pickles', quantity: 1 }, processingTime: 4000 },

  // Preserves Jar - Other
  { machineId: 'preserves_jar', inputs: [{ itemId: 'caviar', quantity: 1 }], output: { itemId: 'aged_roe', quantity: 1 }, processingTime: 4000 },
  { machineId: 'preserves_jar', inputs: [{ itemId: 'sturgeon_roe', quantity: 1 }], output: { itemId: 'caviar', quantity: 1 }, processingTime: 6000 },

  // Seed Maker
  { machineId: 'seed_maker', inputs: [{ itemId: 'starfruit', quantity: 1 }], output: { itemId: 'starfruit_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'ancient_fruit', quantity: 1 }], output: { itemId: 'ancient_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'rhubarb', quantity: 1 }], output: { itemId: 'rhubarb_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'cranberries', quantity: 1 }], output: { itemId: 'cranberry_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'pineapple', quantity: 1 }], output: { itemId: 'pineapple_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'garlic', quantity: 1 }], output: { itemId: 'garlic_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'red_cabbage', quantity: 1 }], output: { itemId: 'red_cabbage_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'radish', quantity: 1 }], output: { itemId: 'radish_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'artichoke', quantity: 1 }], output: { itemId: 'artichoke_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'beet', quantity: 1 }], output: { itemId: 'beet_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'bok_choy', quantity: 1 }], output: { itemId: 'bok_choy_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'eggplant', quantity: 1 }], output: { itemId: 'eggplant_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'yam', quantity: 1 }], output: { itemId: 'yam_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'amaranth', quantity: 1 }], output: { itemId: 'amaranth_seeds', quantity: 2 }, processingTime: 20 },
  { machineId: 'seed_maker', inputs: [{ itemId: 'sweet_gem_berry', quantity: 1 }], output: { itemId: 'rare_seed', quantity: 2 }, processingTime: 20 },

  // Furnace
  { machineId: 'furnace', inputs: [{ itemId: 'quartz', quantity: 1 }, { itemId: 'coal', quantity: 1 }], output: { itemId: 'refined_quartz', quantity: 1 }, processingTime: 90 },
  { machineId: 'furnace', inputs: [{ itemId: 'fire_quartz', quantity: 1 }, { itemId: 'coal', quantity: 1 }], output: { itemId: 'refined_quartz', quantity: 3 }, processingTime: 90 },

  // Oil Maker
  { machineId: 'oil_maker', inputs: [{ itemId: 'sunflower_seeds', quantity: 1 }], output: { itemId: 'oil', quantity: 1 }, processingTime: 200 },
  { machineId: 'oil_maker', inputs: [{ itemId: 'sunflower', quantity: 1 }], output: { itemId: 'oil', quantity: 1 }, processingTime: 1000 }
]
