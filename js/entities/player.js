import { Bullet } from './bullet.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 300;
        this.bullets = [];
        this.lives = 3;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 2;
        this.invulnerabilityTimer = 0;
        this.shootCooldown = 0.25;
        this.shootTimer = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.isShooting = false;
        this.powerUpTime = 0;
        this.hasPowerUp = false;
    }

    reset() {
        this.lives = 3;
        this.bullets = [];
        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
        this.shootTimer = 0;
        this.powerUpTime = 0;
        this.hasPowerUp = false;
    }

    handleKeyDown(key) {
        switch (key) {
            case 'ArrowLeft':
            case 'a':
                this.moveLeft = true;
                break;
            case 'ArrowRight':
            case 'd':
                this.moveRight = true;
                break;
            case ' ':
                this.isShooting = true;
                break;
        }
    }

    handleKeyUp(key) {
        switch (key) {
            case 'ArrowLeft':
            case 'a':
                this.moveLeft = false;
                break;
            case 'ArrowRight':
            case 'd':
                this.moveRight = false;
                break;
            case ' ':
                this.isShooting = false;
                break;
        }
    }

    update(deltaTime) {
        // Movement
        if (this.moveLeft) {
            this.x -= this.speed * deltaTime;
        }
        if (this.moveRight) {
            this.x += this.speed * deltaTime;
        }

        // Keep player within screen bounds
        this.x = Math.max(this.width / 2, Math.min(800 - this.width / 2, this.x));

        // Shooting
        this.shootTimer -= deltaTime;
        if (this.isShooting && this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = this.shootCooldown;
        }

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update(deltaTime);
            if (this.bullets[i].isOffscreen()) {
                this.bullets.splice(i, 1);
            }
        }

        // Update invulnerability
        if (this.isInvulnerable) {
            this.invulnerabilityTimer -= deltaTime;
            if (this.invulnerabilityTimer <= 0) {
                this.isInvulnerable = false;
            }
        }

        // Update power-up
        if (this.hasPowerUp) {
            this.powerUpTime -= deltaTime;
            if (this.powerUpTime <= 0) {
                this.hasPowerUp = false;
                this.shootCooldown = 0.25;
            }
        }
    }

    shoot() {
        if (this.hasPowerUp) {
            // Triple shot
            this.bullets.push(
                new Bullet(this.x, this.y, -Math.PI / 6),  // Left bullet
                new Bullet(this.x, this.y, 0),             // Center bullet
                new Bullet(this.x, this.y, Math.PI / 6)    // Right bullet
            );
        } else {
            // Single shot
            this.bullets.push(new Bullet(this.x, this.y, 0));
        }
    }

    hit() {
        if (!this.isInvulnerable) {
            this.lives--;
            this.isInvulnerable = true;
            this.invulnerabilityTimer = this.invulnerabilityTime;
        }
    }

    activatePowerUp() {
        this.hasPowerUp = true;
        this.powerUpTime = 10; // Power-up lasts 10 seconds
        this.shootCooldown = 0.15; // Faster shooting with power-up
    }

    render(ctx) {
        // Don't render if invulnerable and blinking
        if (this.isInvulnerable && Math.floor(this.invulnerabilityTimer * 10) % 2) {
            return;
        }

        // Draw player ship
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Ship body
        ctx.fillStyle = this.hasPowerUp ? '#0f0' : '#fff';
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.closePath();
        ctx.fill();

        // Ship details
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Render bullets
        this.bullets.forEach(bullet => bullet.render(ctx));
    }
}
