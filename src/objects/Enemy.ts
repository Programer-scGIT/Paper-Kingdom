import Phaser from 'phaser';

export default class Enemy extends Phaser.GameObjects.Container {

    public bodySprite: Phaser.Physics.Arcade.Sprite;

    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y);

        scene.add.existing(this);

        // Физика
        this.bodySprite = scene.physics.add.sprite(x, y, '');

        this.bodySprite.setSize(42, 42);

        this.bodySprite.setBounce(1, 0);

        this.bodySprite.setCollideWorldBounds(true);

        this.bodySprite.setVelocityX(100);

        this.bodySprite.setVisible(false);

        // Рисование
        this.graphics = scene.add.graphics();

        this.add(this.graphics);

        this.drawEnemy();
    }

    private drawEnemy() {

        this.graphics.clear();

        // Чернила
        this.graphics.lineStyle(4, 0x111111);

        this.graphics.fillStyle(0x000000, 0.08);

        // Клякса
        this.graphics.beginPath();

        this.graphics.moveTo(-18, 0);

        this.graphics.lineTo(-10, -18);

        this.graphics.lineTo(10, -16);

        this.graphics.lineTo(22, 0);

        this.graphics.lineTo(10, 18);

        this.graphics.lineTo(-12, 16);

        this.graphics.closePath();

        this.graphics.fillPath();

        this.graphics.strokePath();

        // Глаза
        this.graphics.fillStyle(0xff0000);

        this.graphics.fillCircle(-6, -2, 3);

        this.graphics.fillCircle(6, -2, 3);

        // Каракули
        for (let i = 0; i < 5; i++) {

            this.graphics.lineBetween(
                0,
                0,
                Phaser.Math.Between(-24, 24),
                Phaser.Math.Between(-24, 24)
            );
        }
    }

    update() {

        this.x = this.bodySprite.x;

        this.y = this.bodySprite.y;

        if (this.bodySprite.body?.blocked.left) {

            this.bodySprite.setVelocityX(100);
        }

        if (this.bodySprite.body?.blocked.right) {

            this.bodySprite.setVelocityX(-100);
        }

        this.rotation += Phaser.Math.FloatBetween(-0.01, 0.01);
    }

    destroy() {

        this.bodySprite.destroy();

        super.destroy();
    }
}