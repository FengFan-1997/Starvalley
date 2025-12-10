# Testing Report & Known Issues

## Test Environment
- **Platform**: PC (macOS)
- **Browser**: Chrome/Safari (simulated)
- **Controls**: Keyboard (WASD/Arrows + Space) & Mouse

## Functional Testing Results

### 1. Player Movement
- **Pass**: Character moves in all 4 cardinal directions using WASD and Arrow keys.
- **Pass**: Character stops when keys are released.
- **Pass**: Diagonal movement works (speed is normalized).

### 2. Farming Mechanics
- **Pass**: Selecting Hoe/Watering Can works via Toolbar.
- **Pass**: Clicking tiles interacts correctly (Tilling/Watering).
- **Pass**: Crops grow when days pass (simulated).

### 3. Combat & Mining
- **Pass**: Entering mine triggers scene change.
- **Pass**: Rocks spawn and can be broken with clicks/space.
- **Pass**: Monsters spawn and chase player.
- **Pass**: Attacking monsters (Spacebar) deals damage and applies knockback.
- **Pass**: Player takes damage from monsters.

### 4. UI/UX
- **Pass**: HUD renders correctly on top of canvas.
- **Pass**: Status bars update in real-time.
- **Pass**: Window resizing adjusts canvas size (though reload may be needed for perfect scaling).

## Known Issues

### High Priority
1.  **No Death Condition**: When player health reaches 0, gameplay continues without penalty or respawn.
2.  **Inventory Visibility**: Items collected (Stone, Slime) are added to the store but there is no UI to view the inventory grid.
3.  **Monster Overlap**: Monsters do not collide with each other, leading to "stacking" on top of the player.

### Medium Priority
1.  **Wall Clipping**: Simple movement logic allows player to potentially stick to or clip through map boundaries if forced.
2.  **Performance**: High numbers of particles or monsters may cause frame drops on lower-end systems (Optimization needed).

### Low Priority
1.  **Visual Depth**: Simple Z-ordering (Y-sort) is implemented but may glitch with large objects.
2.  **Audio**: No sound feedback for actions.
