export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velocity = { x: 0, y: 0 };
        this.speed = 300;
        this.bullets = [];
        this.lives = 3;
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 2;
        this.invulnerabilityTimer = 0;
        
        // Power-up states
        this.hasTripleShot = false;
        this.hasRapidFire = false;
        this.powerUpDuration = 5;
        this.powerUpTimer = 0;
        this.shootCooldown = 0.25;
        this.shootTimer = 0;
    }

    reset() {
        this.lives = 3;
        this.bullets = [];
        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
        this.hasTripleShot = false;
        this.hasRapidFire = false;
        this.powerUpTimer = 0;
        this.shootTimer = 0;
    }

    update(deltaTime) {
        // Update position
        this.x += this.velocity.x * deltaTime;
        
        // Keep player within screen bounds
        this.x = Math.max(this.width / 2, Math.min(800 - this.width / 2, this.x));
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update(deltaTime);
            if (this.bullets[i].isOffscreen()) {
                this.bullets.splice(i, 1);
            }
        }
        
        // Update invulnerability
        if (this.isInvulnerable) {
            this.invulnerabilityTimer += deltaTime;
            if (this.invulnerabilityTimer >= this.invulnerabilityDuration) {
                this.isInvulnerable = false;
                this.invulnerabilityTimer = 0;
            }
        }
        
        // Update power-ups
        if (this.hasTripleShot || this.hasRapidFire) {
            this.powerUpTimer += deltaTime;
            if (this.powerUpTimer >= this.powerUpDuration) {
                this.hasTripleShot = false;
                this.hasRapidFire = false;
                this.powerUpTimer = 0;
                this.shootCooldown = 0.25;
            }
        }
        
        // Update shoot timer
        if (this.shootTimer > 0) {
            this.shootTimer -= deltaTime;
        }
    }

    render(ctx) {
        ctx.save();
        
        // Draw player ship
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.closePath();
        
        // Flash when invulnerable
        if (this.isInvulnerable && Math.floor(this.invulnerabilityTimer * 10) % 2) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        } else {
            ctx.fillStyle = '#fff';
        }
        
        ctx.fill();
        
        // Add glow effect for power-ups
        if (this.hasTripleShot || this.hasRapidFire) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.hasTripleShot ? '#00ff00' : '#ffff00';
            ctx.fill();
        }
        
        ctx.restore();
        
        // Render bullets
        this.bullets.forEach(bullet => bullet.render(ctx));
    }

    moveLeft() {
        this.velocity.x = -this.speed;
    }

    moveRight() {
        this.velocity.x = this.speed;
    }

    stopMoving() {
        this.velocity.x = 0;
    }

    shoot() {
        if (this.shootTimer <= 0) {
            if (this.hasTripleShot) {
                // Create three bullets in a spread pattern
                this.bullets.push(
                    new Bullet(this.x, this.y, -0.2),
                    new Bullet(this.x, this.y, 0),
                    new Bullet(this.x, this.y, 0.2)
                );
            } else {
                // Create a single bullet
                this.bullets.push(new Bullet(this.x, this.y, 0));
            }
            
            // Reset shoot timer based on rapid fire status
            this.shootTimer = this.hasRapidFire ? this.shootCooldown / 2 : this.shootCooldown;
        }
    }

    hit() {
        if (!this.isInvulnerable) {
            this.lives--;
            this.isInvulnerable = true;
            this.invulnerabilityTimer = 0;
        }
    }

    activatePowerUp(type) {
        if (type === 'tripleShot') {
            this.hasTripleShot = true;
            this.hasRapidFire = false;
        } else if (type === 'rapidFire') {
            this.hasRapidFire = true;
            this.hasTripleShot = false;
        }
        this.powerUpTimer = 0;
    }
}

class Bullet {
    constructor(x, y, angle = 0) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 10;
        this.speed = 500;
        this.angle = angle;
        this.damage = 1;
    }

    update(deltaTime) {
        this.x += Math.sin(this.angle) * this.speed * deltaTime;
        this.y -= Math.cos(this.angle) * this.speed * deltaTime;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw bullet
        ctx.fillStyle = '#fff';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Add glow effect
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#fff';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.restore();
    }

    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2
        };
    }

    isOffscreen() {
        return this.y < -this.height;
    }
}
