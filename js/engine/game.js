import { Player } from '../entities/player.js';
import { EnemyManager } from '../managers/enemyManager.js';
import { PowerUpManager } from '../managers/powerUpManager.js';
import { CollisionManager } from '../managers/collisionManager.js';
import { ScoreManager } from '../managers/scoreManager.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Initialize game objects
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 50);
        this.enemyManager = new EnemyManager(this.canvas);
        this.powerUpManager = new PowerUpManager(this.canvas);
        this.collisionManager = new CollisionManager();
        this.scoreManager = new ScoreManager();
        
        // Game state
        this.isGameOver = false;
        this.isPaused = false;
        this.lastTime = 0;
        
        // Initialize high scores display
        ScoreManager.addStyles();
        
        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Add event listeners
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        
        // Start button click handler
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.startGame();
            });
        }
    }
    
    startGame() {
        // Hide menu
        const menu = document.getElementById('menu');
        if (menu) {
            menu.style.display = 'none';
        }
        
        // Reset game state
        this.isGameOver = false;
        this.isPaused = false;
        this.player.reset();
        this.enemyManager.reset();
        this.powerUpManager.reset();
        this.scoreManager.reset();
        
        // Start game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    gameLoop(currentTime) {
        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        if (!this.isPaused && !this.isGameOver) {
            this.update(deltaTime);
            this.render();
        }
        
        if (!this.isGameOver) {
            requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            this.handleGameOver();
        }
    }
    
    update(deltaTime) {
        // Update game objects
        this.player.update(deltaTime);
        this.enemyManager.update(deltaTime);
        this.powerUpManager.update(deltaTime);
        this.collisionManager.update(deltaTime);
        
        // Check collisions
        this.collisionManager.checkCollisions(
            this.player,
            this.enemyManager.enemies,
            this.powerUpManager,
            this.scoreManager
        );
        
        // Check game over condition
        if (this.player.lives <= 0) {
            this.isGameOver = true;
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render game objects
        this.player.render(this.ctx);
        this.enemyManager.render(this.ctx);
        this.powerUpManager.render(this.ctx);
        this.collisionManager.render(this.ctx);
    }
    
    handleGameOver() {
        // Show menu
        const menu = document.getElementById('menu');
        if (menu) {
            menu.style.display = 'block';
        }
        
        // Submit score
        this.scoreManager.submitScore();
    }
    
    handleKeyDown(event) {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            this.player.moveLeft();
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            this.player.moveRight();
        } else if (event.key === ' ') {
            this.player.shoot();
        } else if (event.key === 'p') {
            this.isPaused = !this.isPaused;
        }
    }
    
    handleKeyUp(event) {
        if ((event.key === 'ArrowLeft' || event.key === 'a') && this.player.velocity.x < 0) {
            this.player.stopMoving();
        } else if ((event.key === 'ArrowRight' || event.key === 'd') && this.player.velocity.x > 0) {
            this.player.stopMoving();
        }
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    new Game();
});
