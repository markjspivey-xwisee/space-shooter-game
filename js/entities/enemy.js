export class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.health = this.getInitialHealth();
        this.speed = this.getSpeed();
        this.points = this.getPoints();
        this.movementPattern = this.getMovementPattern();
        this.timeAlive = 0;
    }

    getInitialHealth() {
        switch (this.type) {
            case 'basic':
                return 1;
            case 'armored':
                return 3;
            case 'boss':
                return 10;
            default:
                return 1;
        }
    }

    getSpeed() {
        switch (this.type) {
            case 'basic':
                return 100;
            case 'armored':
                return 75;
            case 'boss':
                return 50;
            default:
                return 100;
        }
    }

    getPoints() {
        switch (this.type) {
            case 'basic':
                return 100;
            case 'armored':
                return 250;
            case 'boss':
                return 1000;
            default:
                return 100;
        }
    }

    getMovementPattern() {
        switch (this.type) {
            case 'basic':
                return 'linear';
            case 'armored':
                return 'zigzag';
            case 'boss':
                return 'sweep';
            default:
                return 'linear';
        }
    }

    update(deltaTime) {
        this.timeAlive += deltaTime;

        switch (this.movementPattern) {
            case 'linear':
                this.y += this.speed * deltaTime;
                break;
            case 'zigzag':
                this.y += this.speed * 0.7 * deltaTime;
                this.x += Math.sin(this.timeAlive * 3) * this.speed * deltaTime;
                break;
            case 'sweep':
                this.y += this.speed * 0.3 * deltaTime;
                this.x = 400 + Math.sin(this.timeAlive) * 300;
                break;
        }
    }

    isOffscreen() {
        return this.y > 600 + this.height;
    }

    hit(damage) {
        this.health -= damage;
        return this.health <= 0;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Enemy body
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        
        switch (this.type) {
            case 'basic':
                // Triangle pointing down
                ctx.moveTo(0, this.height / 2);
                ctx.lineTo(-this.width / 2, -this.height / 2);
                ctx.lineTo(this.width / 2, -this.height / 2);
                break;
            case 'armored':
                // Diamond shape
                ctx.moveTo(0, this.height / 2);
                ctx.lineTo(this.width / 2, 0);
                ctx.lineTo(0, -this.height / 2);
                ctx.lineTo(-this.width / 2, 0);
                break;
            case 'boss':
                // Hexagon shape
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI / 3) - Math.PI / 2;
                    const x = Math.cos(angle) * this.width / 2;
                    const y = Math.sin(angle) * this.height / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                break;
        }

        ctx.closePath();
        ctx.fill();

        // Enemy details
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Health bar for armored and boss enemies
        if (this.type !== 'basic') {
            const healthPercentage = this.health / this.getInitialHealth();
            const barWidth = this.width;
            const barHeight = 4;

            ctx.fillStyle = '#600';
            ctx.fillRect(-barWidth / 2, -this.height / 2 - 10, barWidth, barHeight);
            
            ctx.fillStyle = '#f00';
            ctx.fillRect(
                -barWidth / 2,
                -this.height / 2 - 10,
                barWidth * healthPercentage,
                barHeight
            );
        }

        ctx.restore();
    }

    getColor() {
        switch (this.type) {
            case 'basic':
                return '#f00';
            case 'armored':
                return '#f60';
            case 'boss':
                return '#f0f';
            default:
                return '#f00';
        }
    }

    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2
        };
    }
}
