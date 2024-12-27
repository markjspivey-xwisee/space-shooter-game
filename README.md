# Space Shooter Game

A browser-based space shooter game built with HTML5 Canvas and JavaScript. Features include player ship controls, enemy waves, power-ups, and high scores.

Play the game: [https://markjspivey-xwisee.github.io/space-shooter-game/](https://markjspivey-xwisee.github.io/space-shooter-game/)

## Features

- Smooth player ship controls with keyboard input
- Multiple enemy types with different behaviors
  - Basic enemies (red triangles)
  - Armored enemies (orange diamonds)
  - Boss enemies (purple hexagons)
- Power-up system with triple-shot and increased fire rate
- Dynamic enemy wave patterns
- Particle effects for explosions and power-ups
- Local high score system
- Responsive canvas rendering

## Controls

- **Left Arrow** or **A**: Move left
- **Right Arrow** or **D**: Move right
- **Spacebar**: Shoot
- **P**: Pause game (when implemented)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/markjspivey-xwisee/space-shooter-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd space-shooter-game
   ```

3. Open `index.html` in a modern web browser, or serve it using a local development server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js's http-server
   npx http-server
   ```

4. Visit `http://localhost:8000` in your web browser to play the game.

## Game Mechanics

### Player Ship
- 3 lives per game
- Temporary invulnerability after being hit
- Can collect power-ups for enhanced abilities

### Enemy Types
- **Basic Enemy**
  - 1 hit point
  - Linear movement
  - 100 points when destroyed

- **Armored Enemy**
  - 3 hit points
  - Zigzag movement pattern
  - 250 points when destroyed

- **Boss Enemy**
  - 10 hit points
  - Sweeping movement pattern
  - 1000 points when destroyed

### Power-ups
- Triple-shot: Fire three bullets in a spread pattern
- Increased fire rate: Shoot faster for a limited time
- Power-ups appear randomly and when defeating certain enemies

### Wave System
- Increasing difficulty with each wave
- Different enemy formations:
  - V-formation
  - Line formation
  - Arc formation
- Boss waves every few levels

## Technical Details

The game is built using vanilla JavaScript with ES6 modules and follows an object-oriented design pattern. Key components include:

- Game engine with requestAnimationFrame for smooth animation
- Entity component system for game objects
- Collision detection system
- Particle system for visual effects
- Local storage for high scores

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Credits

- Game design and development: Mark Spivey
- Sound effects: (To be added)
- Background music: (To be added)
