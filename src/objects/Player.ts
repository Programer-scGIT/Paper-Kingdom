import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    public swordAngle = 0;
    public facingLeft = false;

    private bodyGraphics: Phaser.GameObjects.Graphics;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {

        super(scene, x, y, '');

        scene.add.existing(this);

        scene.physics.add.existing(this);

        this.setVisible(false);

        scene.add.existing(this);

        scene.physics.add.existing(this);

        this.bodyGraphics =
            scene.add.graphics();

        this.setSize(34, 72);

        this.setCollideWorldBounds(true);

        this.setBounce(0.05);

        this.setDragX(1800);

        this.setMaxVelocity(260, 900);
    }

    // =====================================
    // UPDATE
    // =====================================

    update(
        cursors: Phaser.Types.Input.Keyboard.CursorKeys
    ) {

        const body =
            this.body as Phaser.Physics.Arcade.Body;

        body.setVelocityX(0);

        if (cursors.left.isDown) {

            body.setVelocityX(-260);

            this.facingLeft = true;

        } else if (cursors.right.isDown) {

            body.setVelocityX(260);

            this.facingLeft = false;
        }

        if (
            cursors.up.isDown &&
            body.blocked.down
        ) {

            body.setVelocityY(-520);
        }


        this.drawKnight();
    }
    // =====================================
    // DRAW KNIGHT
    // =====================================

    private drawKnight() {

        this.bodyGraphics.clear();

        this.bodyGraphics.x = this.x;

        this.bodyGraphics.y = this.y;

        const g = this.bodyGraphics;

        // =====================================
        // WOBBLE
        // =====================================

        g.rotation =
            Math.sin(
                this.scene.time.now * 0.008
            ) * 0.03;

        // =====================================
        // CAPE
        // =====================================

        g.fillStyle(0xb22222);

        g.beginPath();

        if (this.facingLeft) {

            g.moveTo(10, -10);

            g.lineTo(30, 10);

            g.lineTo(8, 28);

        } else {

            g.moveTo(-10, -10);

            g.lineTo(-30, 10);

            g.lineTo(-8, 28);
        }

        g.closePath();

        g.fillPath();

        // =====================================
        // LEGS
        // =====================================

        g.lineStyle(6, 0x2c1f14);

        g.beginPath();

        g.moveTo(-8, 18);

        g.lineTo(-8, 36);

        g.strokePath();

        g.beginPath();

        g.moveTo(8, 18);

        g.lineTo(8, 36);

        g.strokePath();

        // Boots

        g.lineStyle(7, 0x5c4033);

        g.beginPath();

        g.moveTo(-12, 36);

        g.lineTo(-3, 36);

        g.strokePath();

        g.beginPath();

        g.moveTo(3, 36);

        g.lineTo(12, 36);

        g.strokePath();

        // =====================================
        // BODY ARMOR
        // =====================================

        g.fillStyle(0xbfc9d4);

        g.lineStyle(4, 0x2c1f14);

        g.fillRoundedRect(
            -14,
            -8,
            28,
            30,
            6
        );

        g.strokeRoundedRect(
            -14,
            -8,
            28,
            30,
            6
        );

        // Shine

        g.fillStyle(0xffffff);

        g.fillRect(
            -8,
            -4,
            8,
            2
        );

        // =====================================
        // BELT
        // =====================================

        g.fillStyle(0x5c4033);

        g.fillRect(
            -14,
            10,
            28,
            5
        );

        // =====================================
        // ARMS
        // =====================================

        g.lineStyle(6, 0xbfc9d4);

        // Left arm

        g.beginPath();

        if (this.facingLeft) {

            g.moveTo(-12, 0);

            g.lineTo(-24, 10);

        } else {

            g.moveTo(-12, 0);

            g.lineTo(-20, 12);
        }

        g.strokePath();

        // Right arm

        g.beginPath();

        if (this.facingLeft) {

            g.moveTo(12, 0);

            g.lineTo(20, 12);

        } else {

            g.moveTo(12, 0);

            g.lineTo(24, 10);
        }

        g.strokePath();

        // =====================================
        // HELMET
        // =====================================

        g.fillStyle(0xdfe6ee);

        g.lineStyle(4, 0x2c1f14);

        g.fillCircle(
            0,
            -28,
            16
        );

        g.strokeCircle(
            0,
            -28,
            16
        );

        // Helmet top

        g.fillTriangle(
            0,
            -50,
            -10,
            -34,
            10,
            -34
        );

        // =====================================
        // VISOR
        // =====================================

        g.fillStyle(0x2c1f14);

        g.fillRoundedRect(
            -10,
            -30,
            20,
            10,
            4
        );

        // Eyes glow

        g.fillStyle(0x66ccff);

        g.fillCircle(-4, -25, 2);

        g.fillCircle(4, -25, 2);

        // =================================
        // SWORD
        // =================================

        g.save();

        // POSITION

        const swordX =
            this.facingLeft
                ? -29
                : 29;

        const swordY = -0.3;

        g.translateCanvas(
            swordX,
            swordY
        );

        // ROTATION

        const baseAngle =
            this.facingLeft
                ? -45
                : 45;

        const finalAngle =
            this.facingLeft
                ? baseAngle + this.swordAngle
                : baseAngle - this.swordAngle;

        g.rotateCanvas(
            Phaser.Math.DegToRad(
                finalAngle
            )
        );

        // =================================
        // BLADE
        // =================================

        g.lineStyle(
            4,
            0xaebdcb
        );

        g.beginPath();

        g.moveTo(0, 0);

        g.lineTo(0, -34);

        g.strokePath();

        // Blade shine

        g.lineStyle(
            1,
            0xffffff
        );

        g.beginPath();

        g.moveTo(2, -2);

        g.lineTo(2, -30);

        g.strokePath();

        // =================================
        // HANDLE
        // =================================

        g.lineStyle(
            5,
            0x5c4033
        );

        g.beginPath();

        g.moveTo(0, 2);

        g.lineTo(0, 11);

        g.strokePath();

        // =================================
        // GUARD
        // =================================

        g.lineStyle(
            3,
            0xd4af37
        );

        g.beginPath();

        g.moveTo(-7, 0);

        g.lineTo(7, 0);

        g.strokePath();

        g.restore();

    }
}
