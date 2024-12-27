export class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 100;
        this.type = Math.random() < 0.5 ? 'tripleShot' : 'rapidFire';
    }

    update(deltaTime) {
        // Move downward
        this.y += this.speed * deltaTime;
    }

    render(ctx) {
        ctx.save();
        
        // Draw power-up
        ctx.fillStyle = this.type === 'tripleShot' ? '#00ff00' : '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.type === 'tripleShot' ? '#00ff00' : '#ffff00';
        ctx.fill();
        
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
        return this.y > 600 + this.height;
    }
}
