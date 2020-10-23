class startScene extends Phaser.Scene {
    constructor() {
        super({key: 'startScene'});
    }

    preload () {
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('barry', 'assets/barry.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('berry', 'assets/berry.png');
        this.load.image('sign', 'assets/sign.png');
        this.load.image('door', 'assets/door.png');
    }

    create() {

        //startGame
        this.input.keyboard.on('keydown_SPACE', () => {
            this.scene.stop('startScene');
            this.scene.start('Level1');
        })

        //text
        this.titleText = this.add.text(400, 200, 'Barry the Berry Picker', {fontSize: '50px', fill: '#ff2e8b'});
            this.titleText.depth = 2;
            this.titleText.setOrigin(0.5);
        this.startText = this.add.text(400, 300, 'Collect all the berries', {fontSize:'25px', fill: '#000000'});
            this.startText.depth = 2;
            this.startText.setOrigin(0.5);
        /*this.pauseInstruct = this.add.text(50, 300, 'You can pause at any time\n   using shift.', {fontSize: '25px', fill: '#000000'});
            this.pauseInstruct.depth = 2;*/

        //platforms
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 575, 'platform');

        //door
        const door = this.physics.add.staticGroup();

        //player animation
        this.anims.create({
            key: 'runLeft',
            frames: this.anims.generateFrameNumbers('barry', {start: 0, end: 1}),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('barry', {start: 2, end: 2}),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'runRight',
            frames: this.anims.generateFrameNumbers('barry', {start: 3, end: 4}),
            frameRate: 5,
            repeat: -1
        })

        //berries
        const berries = this.physics.add.group({
            key: 'berry',
            repeat: 6,
            setXY: {x: 100, y: 400, stepX: 100}
        });

        this.physics.add.collider(berries, platforms);

        berries.children.iterate((berry) => {
            berry.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        })

        //player
        gameState.player = this.physics.add.sprite(100, 300, 'barry');
        gameState.player.setBounce(0.2);
        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, platforms);
        gameState.cursors = this.input.keyboard.createCursorKeys();

        //collect berries
        this.physics.add.overlap(gameState.player, berries, collectBerry, null, this);

        function collectBerry (player, berry) {
            berry.disableBody(true, true);
            if (berries.countActive(true) === 0)
            {
                this.add.image(700, 450, 'sign');
                door.create(785, 480, 'door').setOrigin(0);
                this.physics.add.overlap(gameState.player, door, nextScene, null, this);
                function nextScene () {
                    this.scene.stop('startScene');
                    this.scene.start('Level1');
                }
            }
        }
    }

    update () {
        if (gameState.cursors.left.isDown) {
            gameState.player.setVelocityX(-200);
            gameState.player.anims.play('runLeft', true)
        }   else if (gameState.cursors.right.isDown) {
            gameState.player.setVelocityX(200);
            gameState.player.anims.play('runRight', true)
        }   else {
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('idle', true)
        }

        if (gameState.cursors.up.isDown && gameState.player.body.touching.down) {
            gameState.player.setVelocityY(-300);
        }
    }
}