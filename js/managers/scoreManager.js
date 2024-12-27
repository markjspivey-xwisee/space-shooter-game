export class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScores = this.loadHighScores();
    }

    reset() {
        this.score = 0;
    }

    addScore(points) {
        this.score += points;
        this.updateDisplay();
    }

    updateDisplay() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    loadHighScores() {
        const scores = localStorage.getItem('spaceShooterHighScores');
        return scores ? JSON.parse(scores) : [];
    }

    saveHighScores() {
        localStorage.setItem('spaceShooterHighScores', JSON.stringify(this.highScores));
    }

    submitScore() {
        // Only save score if it's in the top 10
        if (this.isHighScore(this.score)) {
            const name = this.getPlayerName();
            this.addHighScore(name, this.score);
            this.saveHighScores();
            this.displayHighScores();
        }
    }

    isHighScore(score) {
        return this.highScores.length < 10 || score > this.highScores[this.highScores.length - 1].score;
    }

    getPlayerName() {
        let name = prompt('You got a high score! Enter your name:', 'Player');
        return name ? name.substring(0, 10) : 'Anonymous';
    }

    addHighScore(name, score) {
        this.highScores.push({ name, score, date: new Date().toLocaleDateString() });
        
        // Sort high scores in descending order
        this.highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        if (this.highScores.length > 10) {
            this.highScores.length = 10;
        }
    }

    displayHighScores() {
        const highScoresList = document.getElementById('highScoresList');
        if (!highScoresList) return;

        // Clear existing scores
        highScoresList.innerHTML = '';

        // Add each high score to the list
        this.highScores.forEach((score, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="rank">${index + 1}.</span>
                <span class="name">${score.name}</span>
                <span class="score">${score.score}</span>
                <span class="date">${score.date}</span>
            `;
            highScoresList.appendChild(li);
        });

        // Add empty slots if less than 10 scores
        for (let i = this.highScores.length; i < 10; i++) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="rank">${i + 1}.</span>
                <span class="name">---</span>
                <span class="score">0</span>
                <span class="date">--/--/--</span>
            `;
            li.classList.add('empty');
            highScoresList.appendChild(li);
        }
    }

    // Add CSS styles for high scores display
    static addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #highScoresList {
                list-style: none;
                padding: 0;
                margin: 0;
                color: #fff;
                font-family: monospace;
            }

            #highScoresList li {
                display: grid;
                grid-template-columns: 30px 120px 80px 80px;
                gap: 10px;
                padding: 5px;
                border-bottom: 1px solid #333;
            }

            #highScoresList li.empty {
                opacity: 0.5;
            }

            #highScoresList .rank {
                color: #0f0;
            }

            #highScoresList .score {
                color: #ff0;
                text-align: right;
            }

            #highScoresList .date {
                color: #666;
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    }
}
