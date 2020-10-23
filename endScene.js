class endScene extends Phaser.Scene {
    constructor() {
        super({key: 'endScene'});
    }

    preload () {
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('barry', 'assets/barry.png', {frameWidth: 32, frameHeight: 48});
        this.load.image('berry', 'assets/berry.png');
        this.load.image('sign', 'assets/sign.png');
        this.load.image('door', 'assets/door.png');
        this.load.spritesheet('house', 'assets/house.png', {frameWidth: 40, frameHeight: 70});
    }

    create() {

        //text
        this.titleText = this.add.text(400, 200, 'Good work Barry!', {fontSize: '50px', fill: '#ff2e8b'});
        this.titleText.depth = 2;
        this.titleText.setOrigin(0.5);
        this.endText = this.add.text(400, 300, 'You collected all the berries', {fontSize:'25px', fill: '#000000'});
        this.endText.depth = 2;
        this.endText.setOrigin(0.5);
        this.bedText = this.add.text(400, 400, 'Time to go to bed', {fontSize:'25px', fill: '#000000'});
        this.bedText.depth = 2;
        this.bedText.setOrigin(0.5);


        //platforms
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 575, 'platform');

        //house
        //const house = this.physics.add.staticGroup();

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

        //player
        gameState.player = this.physics.add.sprite(0, 525, 'barry');
        gameState.player.setBounce(0.2);
        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, platforms);
        gameState.cursors = this.input.keyboard.createCursorKeys();

        //house animation
        this.anims.create({
            key: 'smoke',
            frames: this.anims.generateFrameNumbers('house', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        })

        //house
        const house = this.physics.add.sprite(650, 515, 'house');
        house.anims.play('smoke', true);
        this.physics.add.collider(house, platforms);
        this.physics.add.overlap(gameState.player, house, () => {
            gameState.player.setVisible(false);
        })

        //restart game
        this.input.keyboard.on('keydown_SPACE', () => {
            if (gameState.player.visible === false) {
                this.scene.stop('testendScene');
                this.scene.start('startScene');
            }
        })
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