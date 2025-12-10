# Stardew Vue Development Plan

## Phase 1: Foundation & Setup (Completed)
- [x] **Tech Stack Verification**: Confirmed Vue 3, Pinia, and Pixi.js integration.
- [x] **Project Structure**: Established directory structure for stores, components, and assets.
- [x] **Base Assets**: Defined global CSS variables for Stardew Valley color palette (`base.css`).

## Phase 2: Core Gameplay Systems (Current Focus)
- [x] **Game Loop**: Implemented PIXI.js ticker for real-time updates.
- [x] **Player Movement**: Grid-based and free movement logic.
- [x] **Farming System**: 
  - [x] Tilling soil
  - [x] Planting crops
  - [x] Watering mechanics
  - [x] Growth stages
- [x] **Time System**: Day/Night cycle with visual overlays.
- [x] **NPC System**:
  - [x] Rendering NPCs
  - [x] Dialogue interaction
  - [x] Relationship tracking
- [ ] **Mining & Combat**:
  - [x] Mine world generation
  - [x] Rock breaking & resource collection
  - [x] Monster spawning
  - [x] Monster AI & Movement
  - [x] Basic Combat (Attack & Damage)
  - [ ] Weapon specific mechanics
  - [ ] Loot tables

## Phase 3: UI/UX Overhaul (In Progress)
- [x] **Design System**: Created `PixelPanel`, `PixelButton` with authentic styles.
- [x] **HUD**:
  - [x] Toolbar with selection logic
  - [x] Status bars (Health, Energy)
  - [x] Clock and Money display
- [x] **Menus**:
  - [x] Inventory Screen (Grid view, detailed info)
  - [x] Crafting Menu (Recipe grid, crafting logic)
  - [x] Map Interface (Dynamic location tracking)
  - [x] Settings Menu (Volume sliders placeholder)
  - [x] Shop Interface (Buy items, Gold tracking)
- [x] **Game Entry Flow**:
  - [x] Title Screen (Animations, Backgrounds)
  - [x] Character Creation (Name, Farm Name, Appearance)
  - [x] Smooth Scene Transitions

## Phase 4: Content & Persistence (Next Steps)
- [x] **Save/Load System**: Persist `GameState` to `localStorage`.
- [ ] **Content Expansion**:
  - Add more crop types.
  - Add more tool upgrades.
  - Expand mine levels.
- [ ] **Audio**: Add background music and sound effects (sfx).

## Phase 5: Quality Assurance
- [ ] **Testing**: Verify all mechanics on PC (Keyboard/Mouse).
- [ ] **Performance**: Optimize PIXI.js rendering for lower-end PCs.
- [ ] **Bug Fixes**: Address collision issues and state inconsistencies.
