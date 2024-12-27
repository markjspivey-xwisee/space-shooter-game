export class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 12;
        this.speed = 500;
        this.angle = angle;
        this.damage = 1;
    }

    update(deltaTime) {
        // Move bullet based on angle
        this.x += Math.sin(this.angle) * this.speed * deltaTime;
        this.y -= Math.cos(this.angle) * this.speed * deltaTime;
    }

    isOffscreen() {
        return this.y < -this.height || this.y > 600 || 
               this.x < -this.width || this.x > 800;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw bullet trail (glow effect)
        const gradient = ctx.createLinearGradient(0, -this.height, 0, this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width, -this.height * 1.5, this.width * 2, this.height * 3);

        // Draw bullet body
        ctx.fillStyle = '#fff';
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
}
