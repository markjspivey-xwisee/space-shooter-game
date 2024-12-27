export class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 100;
        this.rotation = 0;
        this.rotationSpeed = Math.PI; // Rotate 180 degrees per second
        this.pulseTime = 0;
        this.glowIntensity = 0;
    }

    update(deltaTime) {
        // Move downward
        this.y += this.speed * deltaTime;

        // Rotate
        this.rotation += this.rotationSpeed * deltaTime;

        // Pulse glow effect
        this.pulseTime += deltaTime;
        this.glowIntensity = Math.sin(this.pulseTime * 5) * 0.5 + 0.5;
    }

    isOffscreen() {
        return this.y > 600 + this.height;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw glow effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width);
        gradient.addColorStop(0, `rgba(0, 255, 0, ${0.3 * this.glowIntensity})`);
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            -this.width,
            -this.height,
            this.width * 2,
            this.height * 2
        );

        // Draw power-up symbol (star shape)
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const outerX = Math.cos(angle) * this.width / 2;
            const outerY = Math.sin(angle) * this.height / 2;
            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * this.width / 4;
            const innerY = Math.sin(innerAngle) * this.height / 4;

            if (i === 0) {
                ctx.moveTo(outerX, outerY);
            } else {
                ctx.lineTo(outerX, outerY);
            }
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();

        // Fill and stroke the star
        ctx.fillStyle = '#0f0';
        ctx.fill();
        ctx.strokeStyle = '#0c0';
        ctx.lineWidth = 2;
        ctx.stroke();

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
