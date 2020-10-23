
const gameState = {};

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '20d5f5',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            enableBody: true,
            debug: false
        }
    },
    scene: [startScene, Level1, Level2, Level3, Level4, Level5, endScene]
};

const game = new Phaser.Game(config);

