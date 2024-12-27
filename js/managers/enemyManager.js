import { Enemy } from '../entities/enemy.js';

export class EnemyManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.waveNumber = 0;
        this.timeSinceLastSpawn = 0;
        this.spawnCooldown = 1;
        this.reset();
    }

    reset() {
        this.enemies = [];
        this.waveNumber = 0;
        this.timeSinceLastSpawn = 0;
        this.spawnCooldown = 1;
        this.spawnNextWave();
    }

    update(deltaTime) {
        // Update existing enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime);
            if (this.enemies[i].isOffscreen()) {
                this.enemies.splice(i, 1);
            }
        }

        // Spawn new enemies
        this.timeSinceLastSpawn += deltaTime;
        if (this.timeSinceLastSpawn >= this.spawnCooldown && this.enemies.length < 10) {
            this.spawnEnemy();
            this.timeSinceLastSpawn = 0;
        }

        // Check if wave is complete
        if (this.enemies.length === 0) {
            this.spawnNextWave();
        }
    }

    spawnEnemy() {
        const x = Math.random() * (this.canvas.width - 60) + 30;
        const y = -30;
        
        let type = 'basic';
        const roll = Math.random();
        
        if (this.waveNumber >= 5) {
            if (roll < 0.1) {
                type = 'boss';
            } else if (roll < 0.3) {
                type = 'armored';
            }
        } else if (this.waveNumber >= 3) {
            if (roll < 0.2) {
                type = 'armored';
            }
        }

        this.enemies.push(new Enemy(x, y, type));
    }

    spawnNextWave() {
        this.waveNumber++;
        
        // Adjust difficulty based on wave number
        this.spawnCooldown = Math.max(0.5, 1 - this.waveNumber * 0.05);
        
        // Create initial wave enemies
        const numEnemies = Math.min(5 + this.waveNumber, 15);
        
        // Formation patterns
        switch (this.waveNumber % 3) {
            case 0: // V formation
                this.spawnVFormation(numEnemies);
                break;
            case 1: // Line formation
                this.spawnLineFormation(numEnemies);
                break;
            case 2: // Arc formation
                this.spawnArcFormation(numEnemies);
                break;
        }
    }

    spawnVFormation(numEnemies) {
        const spacing = 50;
        const centerX = this.canvas.width / 2;
        const startY = -50;

        for (let i = 0; i < numEnemies; i++) {
            const row = Math.floor(i / 2);
            const isLeft = i % 2 === 0;
            const x = centerX + (isLeft ? -1 : 1) * spacing * (row + 1);
            const y = startY - row * spacing;
            this.enemies.push(new Enemy(x, y));
        }
    }

    spawnLineFormation(numEnemies) {
        const spacing = this.canvas.width / (numEnemies + 1);
        const y = -50;

        for (let i = 0; i < numEnemies; i++) {
            const x = spacing * (i + 1);
            this.enemies.push(new Enemy(x, y));
        }
    }

    spawnArcFormation(numEnemies) {
        const centerX = this.canvas.width / 2;
        const radius = 150;
        const startY = -50;

        for (let i = 0; i < numEnemies; i++) {
            const angle = (Math.PI / (numEnemies - 1)) * i;
            const x = centerX + Math.cos(angle) * radius;
            const y = startY + Math.sin(angle) * radius;
            this.enemies.push(new Enemy(x, y));
        }
    }

    render(ctx) {
        this.enemies.forEach(enemy => enemy.render(ctx));
    }
}
