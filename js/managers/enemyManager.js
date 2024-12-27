import { Enemy } from '../entities/enemy.js';

export class EnemyManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2;
        this.wave = 1;
        this.waveTimer = 0;
        this.waveDuration = 30;
        this.formations = ['line', 'v', 'arc'];
        this.currentFormation = 0;
    }

    reset() {
        this.enemies = [];
        this.spawnTimer = 0;
        this.wave = 1;
        this.waveTimer = 0;
        this.currentFormation = 0;
    }

    update(deltaTime) {
        // Update existing enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime);
            if (this.enemies[i].isOffscreen()) {
                this.enemies.splice(i, 1);
            }
        }

        // Update wave timer
        this.waveTimer += deltaTime;
        if (this.waveTimer >= this.waveDuration) {
            this.wave++;
            this.waveTimer = 0;
            this.currentFormation = (this.currentFormation + 1) % this.formations.length;
            
            // Spawn boss every 5 waves
            if (this.wave % 5 === 0) {
                this.spawnBoss();
            }
        }

        // Update spawn timer
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.getSpawnInterval()) {
            this.spawnEnemies();
            this.spawnTimer = 0;
        }
    }

    render(ctx) {
        this.enemies.forEach(enemy => enemy.render(ctx));
    }

    spawnEnemies() {
        const formation = this.formations[this.currentFormation];
        const enemyType = Math.random() < 0.2 ? 'armored' : 'basic';
        
        switch (formation) {
            case 'line':
                this.spawnLineFormation(enemyType);
                break;
            case 'v':
                this.spawnVFormation(enemyType);
                break;
            case 'arc':
                this.spawnArcFormation(enemyType);
                break;
        }
    }

    spawnLineFormation(type) {
        const count = 3 + Math.floor(this.wave / 3);
        const spacing = 60;
        const totalWidth = (count - 1) * spacing;
        const startX = (this.canvas.width - totalWidth) / 2;

        for (let i = 0; i < count; i++) {
            const x = startX + i * spacing;
            this.enemies.push(new Enemy(x, -20, type));
        }
    }

    spawnVFormation(type) {
        const count = 5;
        const spacing = 50;
        const rows = 3;

        for (let row = 0; row < rows; row++) {
            const rowCount = row * 2 + 1;
            const totalWidth = (rowCount - 1) * spacing;
            const startX = (this.canvas.width - totalWidth) / 2;

            for (let i = 0; i < rowCount; i++) {
                const x = startX + i * spacing;
                const y = -20 - row * 40;
                this.enemies.push(new Enemy(x, y, type));
            }
        }
    }

    spawnArcFormation(type) {
        const count = 7;
        const radius = 100;
        const centerX = this.canvas.width / 2;
        const startY = -20;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI / (count - 1)) * i;
            const x = centerX + Math.cos(angle) * radius;
            const y = startY + Math.sin(angle) * radius;
            this.enemies.push(new Enemy(x, y, type));
        }
    }

    spawnBoss() {
        const x = this.canvas.width / 2;
        const y = -50;
        this.enemies.push(new Enemy(x, y, 'boss'));
    }

    getSpawnInterval() {
        // Decrease spawn interval as waves progress
        return Math.max(0.5, this.spawnInterval - (this.wave - 1) * 0.1);
    }
}
