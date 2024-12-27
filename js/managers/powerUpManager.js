import { PowerUp } from '../entities/powerup.js';

export class PowerUpManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.powerUps = [];
        this.spawnTimer = 0;
        this.spawnInterval = 15; // Spawn power-up every 15 seconds
        this.spawnChance = 0.3; // 30% chance to spawn when timer is up
    }

    reset() {
        this.powerUps = [];
        this.spawnTimer = 0;
    }

    update(deltaTime) {
        // Update existing power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            this.powerUps[i].update(deltaTime);
            if (this.powerUps[i].isOffscreen()) {
                this.powerUps.splice(i, 1);
            }
        }

        // Check if it's time to spawn a new power-up
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            if (Math.random() < this.spawnChance) {
                this.spawnPowerUp();
            }
            this.spawnTimer = 0;
        }
    }

    spawnPowerUp() {
        // Don't spawn if there are too many power-ups
        if (this.powerUps.length >= 3) return;

        // Random position at the top of the screen
        const x = Math.random() * (this.canvas.width - 40) + 20;
        const y = -20;

        this.powerUps.push(new PowerUp(x, y));
    }

    // Spawn a power-up at a specific location (e.g., when an enemy is destroyed)
    spawnPowerUpAt(x, y) {
        if (Math.random() < 0.1 && this.powerUps.length < 3) { // 10% chance
            this.powerUps.push(new PowerUp(x, y));
        }
    }

    render(ctx) {
        this.powerUps.forEach(powerUp => powerUp.render(ctx));
    }

    // Remove a power-up when collected
    removePowerUp(powerUp) {
        const index = this.powerUps.indexOf(powerUp);
        if (index !== -1) {
            this.powerUps.splice(index, 1);
        }
    }

    // Check if any power-up collides with a given rectangle (used for player collision)
    checkCollision(rect) {
        for (const powerUp of this.powerUps) {
            const bounds = powerUp.getBounds();
            if (this.isColliding(bounds, rect)) {
                return powerUp;
            }
        }
        return null;
    }

    isColliding(rect1, rect2) {
        return rect1.left < rect2.right &&
               rect1.right > rect2.left &&
               rect1.top < rect2.bottom &&
               rect1.bottom > rect2.top;
    }
}
