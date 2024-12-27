import { Player } from '../entities/player.js';
import { EnemyManager } from '../managers/enemyManager.js';
import { CollisionManager } from '../managers/collisionManager.js';
import { PowerUpManager } from '../managers/powerUpManager.js';
import { ScoreManager } from '../managers/scoreManager.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.player = new Player(
            this.canvas.width / 2,
            this.canvas.height - 50
        );
        
        this.enemyManager = new EnemyManager(this.canvas);
        this.collisionManager = new CollisionManager();
        this.powerUpManager = new PowerUpManager(this.canvas);
        this.scoreManager = new ScoreManager();
        
        this.isRunning = false;
        this.lastTime = 0;
        this.menu = document.getElementById('menu');
        this.setupEventListeners();
    }

    setupCanvas() {
        // Set canvas size to match CSS dimensions
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    setupEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });

        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (this.isRunning) {
                this.player.handleKeyDown(e.key);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.isRunning) {
                this.player.handleKeyUp(e.key);
            }
        });
    }

    startGame() {
        this.isRunning = true;
        this.menu.style.display = 'none';
        this.player.reset();
        this.enemyManager.reset();
        this.powerUpManager.reset();
        this.scoreManager.reset();
        this.gameLoop(0);
    }

    gameLoop(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        this.player.update(deltaTime);
        this.enemyManager.update(deltaTime);
        this.powerUpManager.update(deltaTime);

        // Check collisions
        this.collisionManager.checkCollisions(
            this.player,
            this.enemyManager.enemies,
            this.powerUpManager.powerUps,
            this.scoreManager
        );

        // Check game over condition
        if (this.player.lives <= 0) {
            this.gameOver();
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render game objects
        this.player.render(this.ctx);
        this.enemyManager.render(this.ctx);
        this.powerUpManager.render(this.ctx);

        // Update HUD
        document.getElementById('score').textContent = this.scoreManager.score;
        document.getElementById('lives').textContent = this.player.lives;
    }

    gameOver() {
        this.isRunning = false;
        this.scoreManager.submitScore();
        this.menu.style.display = 'block';
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
