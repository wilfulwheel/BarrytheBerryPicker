class Level4 extends Phaser.Scene {
    constructor() {
        super({key: 'Level4'});
    }

    preload () {
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('barry', 'assets/barry.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('bush', 'assets/bush.png');
        this.load.image('berry', 'assets/berry.png');
        this.load.image('sign', 'assets/sign.png');
        this.load.image('door', 'assets/door.png');
        this.load.spritesheet('bug', 'assets/bug.png', { frameWidth: 60, frameHeight: 38 });
    }

    create() {

        gameState.active = true;

        //text

        //ground
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 975, 'platform');

        //bushes
        const bushes = this.physics.add.staticGroup().setOrigin(0);
        bushes.create(0, 825, 'bush');
        bushes.create(600, 700, 'bush');
        bushes.create(350, 560, 'bush');
        bushes.create(800, 420, 'bush');
        bushes.create(450, 300, 'bush');
        bushes.create(40, 160, 'bush');

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
            setXY: {x: 100, y: 450, stepX: 100}
        });

        berries.createMultiple({
            key: 'berry',
            repeat: 6,
            setXY: {x: 100, y: 50, stepX: 100}
        });

        this.physics.add.collider(berries, platforms);
        this.physics.add.collider(berries, bushes);

        berries.children.iterate((berry) => {
            berry.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        })

        //player
        gameState.player = this.physics.add.sprite(0, 925, 'barry');
        gameState.player.setBounce(0.2);
        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, platforms);
        this.physics.add.collider(gameState.player, bushes)
        gameState.cursors = this.input.keyboard.createCursorKeys();

        //camera
        this.cameras.main.setBounds(0, 0, 800, 1000);
        this.physics.world.setBounds(0, 0, 800, 1000);
        this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);

        //collect berries
        this.physics.add.overlap(gameState.player, berries, collectBerry, null, this);

        function collectBerry (player, berry) {
            berry.disableBody(true, true);

            score += 1;
            scoreText.setText(`Berries Collected: ${score}/14`);

            if (berries.countActive(true) === 0)
            {
                scoreText.setText(`Berries Collected: ${score}/14\nHarvest Complete!`);
                this.add.image(600, 150, 'sign');
                door.create(785, 335, 'door').setOrigin(0);
                this.physics.add.overlap(gameState.player, door, nextScene, null, this);
                function nextScene () {
                    this.scene.stop('Level4');
                    this.scene.start('Level5');
                }
            }
        }

        //score
        let score = 0;
        let scoreText = this.add.text(25, 25, 'Berries Collected: 0/14', {fontSize: '20px', fill: '#000000'}).setScrollFactor(0);

        //bug
        gameState.bug = this.physics.add.sprite(175, 530, 'bug');
        gameState.bug.flipX = true;
        this.physics.add.collider(gameState.bug, platforms);
        this.physics.add.collider(gameState.bug, bushes);

        gameState.bug2 = this.physics.add.sprite(625, 265, 'bug');
        gameState.bug2.flipX = false;
        this.physics.add.collider(gameState.bug2, platforms);
        this.physics.add.collider(gameState.bug2, bushes);

        //bug animation
        this.anims.create({
            key: 'bugMove',
            frames: this.anims.generateFrameNumbers('bug', {start: 0, end: 0}),
            repeat: -1
        });

        gameState.bug.anims.play('bugMove', true);
        gameState.bug2.anims.play('bugMove', true);

        gameState.bug.move = this.tweens.add({
            targets: gameState.bug,
            x: 525,
            ease: 'Linear',
            duration: 3000,
            repeat: -1,
            yoyo: true,
            onYoyo: flipBug,
            onRepeat: flipBug
        })

        function flipBug() {
            gameState.bug.flipX = gameState.bug.flipX === false;
        }

        gameState.bug2.move = this.tweens.add({
            targets: gameState.bug2,
            x: 275,
            ease: 'Linear',
            duration: 3000,
            repeat: -1,
            yoyo: true,
            onYoyo: flipBug2,
            onRepeat: flipBug2
        })

        function flipBug2() {
            gameState.bug2.flipX = gameState.bug2.flipX === false;
        }
    }

    update () {
        if (gameState.active) {
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
        }

        if (gameState.cursors.up.isDown && gameState.player.body.touching.down) {
            gameState.player.setVelocityY(-300);
        }
    }
}