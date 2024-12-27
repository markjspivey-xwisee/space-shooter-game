export class CollisionManager {
    constructor() {
        this.explosions = [];
    }

    checkCollisions(player, enemies, powerUps, scoreManager) {
        this.checkPlayerEnemyCollisions(player, enemies);
        this.checkBulletEnemyCollisions(player, enemies, scoreManager);
        this.checkPlayerPowerUpCollisions(player, powerUps);
    }

    checkPlayerEnemyCollisions(player, enemies) {
        const playerBounds = {
            left: player.x - player.width / 2,
            right: player.x + player.width / 2,
            top: player.y - player.height / 2,
            bottom: player.y + player.height / 2
        };

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const enemyBounds = enemy.getBounds();

            if (this.isColliding(playerBounds, enemyBounds)) {
                // Player takes damage
                player.hit();
                
                // Remove enemy
                enemies.splice(i, 1);
                
                // Add explosion effect
                this.addExplosion(enemy.x, enemy.y);
            }
        }
    }

    checkBulletEnemyCollisions(player, enemies, scoreManager) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const enemyBounds = enemy.getBounds();

            for (let j = player.bullets.length - 1; j >= 0; j--) {
                const bullet = player.bullets[j];
                const bulletBounds = bullet.getBounds();

                if (this.isColliding(bulletBounds, enemyBounds)) {
                    // Remove bullet
                    player.bullets.splice(j, 1);

                    // Damage enemy
                    if (enemy.hit(bullet.damage)) {
                        // Enemy destroyed
                        enemies.splice(i, 1);
                        scoreManager.addScore(enemy.points);
                        this.addExplosion(enemy.x, enemy.y);
                        break;
                    }
                }
            }
        }
    }

    checkPlayerPowerUpCollisions(player, powerUps) {
        const playerBounds = {
            left: player.x - player.width / 2,
            right: player.x + player.width / 2,
            top: player.y - player.height / 2,
            bottom: player.y + player.height / 2
        };

        const powerUp = powerUps.checkCollision(playerBounds);
        if (powerUp) {
            player.activatePowerUp();
            powerUps.removePowerUp(powerUp);
            this.addPowerUpEffect(player.x, player.y);
        }
    }

    isColliding(rect1, rect2) {
        return rect1.left < rect2.right &&
               rect1.right > rect2.left &&
               rect1.top < rect2.bottom &&
               rect1.bottom > rect2.top;
    }

    addExplosion(x, y) {
        this.explosions.push({
            x,
            y,
            radius: 0,
            maxRadius: 30,
            duration: 0.5,
            timer: 0
        });
    }

    addPowerUpEffect(x, y) {
        this.explosions.push({
            x,
            y,
            radius: 0,
            maxRadius: 40,
            duration: 0.3,
            timer: 0,
            isPowerUp: true
        });
    }

    update(deltaTime) {
        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.timer += deltaTime;
            
            // Update radius based on timer
            const progress = explosion.timer / explosion.duration;
            explosion.radius = explosion.maxRadius * Math.sin(progress * Math.PI);
            
            // Remove completed explosions
            if (explosion.timer >= explosion.duration) {
                this.explosions.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // Render explosions
        this.explosions.forEach(explosion => {
            const alpha = 1 - (explosion.timer / explosion.duration);
            
            ctx.save();
            ctx.globalAlpha = alpha;
            
            // Create gradient
            const gradient = ctx.createRadialGradient(
                explosion.x, explosion.y, 0,
                explosion.x, explosion.y, explosion.radius
            );
            
            if (explosion.isPowerUp) {
                gradient.addColorStop(0, 'rgba(0, 255, 0, 1)');
                gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.5)');
                gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(255, 200, 0, 1)');
                gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
}
