export class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.speed = 100;
        this.points = 100;
        this.health = 1;
        
        // Set properties based on enemy type
        switch (type) {
            case 'armored':
                this.health = 3;
                this.points = 250;
                this.speed = 75;
                break;
            case 'boss':
                this.health = 10;
                this.points = 1000;
                this.speed = 50;
                this.width = 50;
                this.height = 50;
                break;
        }
        
        // Movement pattern variables
        this.movementTimer = 0;
        this.movementPhase = 0;
        this.amplitude = 100;
        this.frequency = 2;
    }

    update(deltaTime) {
        // Basic downward movement
        this.y += this.speed * deltaTime;
        
        // Additional movement patterns based on type
        switch (this.type) {
            case 'armored':
                // Zigzag movement
                this.movementTimer += deltaTime;
                this.x += Math.sin(this.movementTimer * this.frequency) * this.speed * deltaTime;
                break;
            case 'boss':
                // Sweeping movement
                this.movementTimer += deltaTime;
                this.x = 400 + Math.sin(this.movementTimer) * this.amplitude;
                break;
        }
    }

    render(ctx) {
        ctx.save();
        
        // Set color based on enemy type
        switch (this.type) {
            case 'basic':
                ctx.fillStyle = '#ff0000';
                break;
            case 'armored':
                ctx.fillStyle = '#ff8800';
                break;
            case 'boss':
                ctx.fillStyle = '#ff00ff';
                break;
        }
        
        // Draw enemy shape based on type
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        
        switch (this.type) {
            case 'basic':
                // Triangle
                ctx.moveTo(0, -this.height / 2);
                ctx.lineTo(this.width / 2, this.height / 2);
                ctx.lineTo(-this.width / 2, this.height / 2);
                break;
            case 'armored':
                // Diamond
                ctx.moveTo(0, -this.height / 2);
                ctx.lineTo(this.width / 2, 0);
                ctx.lineTo(0, this.height / 2);
                ctx.lineTo(-this.width / 2, 0);
                break;
            case 'boss':
                // Hexagon
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    const x = Math.cos(angle) * this.width / 2;
                    const y = Math.sin(angle) * this.height / 2;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                break;
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        
        // Show health bar for armored and boss enemies
        if (this.type !== 'basic') {
            const maxHealth = this.type === 'armored' ? 3 : 10;
            const healthPercentage = this.health / maxHealth;
            const barWidth = this.width;
            const barHeight = 4;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(-barWidth / 2, -this.height / 2 - 10, barWidth, barHeight);
            
            ctx.fillStyle = healthPercentage > 0.5 ? '#0f0' : healthPercentage > 0.25 ? '#ff0' : '#f00';
            ctx.fillRect(-barWidth / 2, -this.height / 2 - 10, barWidth * healthPercentage, barHeight);
        }
        
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

    hit(damage) {
        this.health -= damage;
        return this.health <= 0;
    }

    isOffscreen() {
        return this.y > 600 + this.height;
    }
}
