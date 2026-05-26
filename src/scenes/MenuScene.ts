import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {

    constructor() {
        super('MenuScene');
    }

    create() {

        // =================================
        // BACKGROUND
        // =================================

        this.cameras.main.setBackgroundColor(
            '#f8e9d0'
        );

        // notebook lines

        for (let y = 0; y < 576; y += 32) {

            this.add.line(
                0,
                y,
                0,
                0,
                1024,
                0,
                0xd8c7a0
            )
                .setOrigin(0, 0)
                .setAlpha(0.25);
        }

        // red margin line

        this.add.line(
            90,
            0,
            0,
            0,
            0,
            576,
            0xff9999
        )
            .setOrigin(0, 0)
            .setAlpha(0.4);

        // =================================
        // TITLE
        // =================================

        const title =
            this.add.text(
                512,
                150,
                'PAPER\nKINGDOM',
                {
                    fontSize: '82px',
                    color: '#2c1f14',
                    align: 'center',
                    fontStyle: 'bold'
                }
            )
                .setOrigin(0.5);

        title.setAngle(-2);

        // glow

        const glow =
            this.add.text(
                512,
                150,
                'PAPER\nKINGDOM',
                {
                    fontSize: '82px',
                    color: '#ffffff',
                    align: 'center',
                    fontStyle: 'bold'
                }
            )
                .setOrigin(0.5)
                .setAlpha(0.15);

        // floating

        this.tweens.add({

            targets: [title, glow],

            y: 160,

            duration: 2200,

            yoyo: true,

            repeat: -1,

            ease: 'sine.inOut'
        });

        // =================================
        // SUBTITLE
        // =================================

        this.add.text(
            512,
            290,
            'Save the Princess from the Evil Pencil',
            {
                fontSize: '28px',
                color: '#5c4033'
            }
        )
            .setOrigin(0.5);

        // =================================
        // PLAY BUTTON
        // =================================

        const playBg =
            this.add.rectangle(
                512,
                420,
                320,
                90,
                0x5c4033
            );

        playBg.setStrokeStyle(
            6,
            0x2c1f14
        );

        const playText =
            this.add.text(
                512,
                420,
                'PLAY',
                {
                    fontSize: '42px',
                    color: '#fff6df',
                    fontStyle: 'bold'
                }
            )
                .setOrigin(0.5);

        playBg.setInteractive(
            { useHandCursor: true }
        );

        // hover

        playBg.on('pointerover', () => {

            this.tweens.add({

                targets: [playBg, playText],

                scaleX: 1.06,

                scaleY: 1.06,

                duration: 120
            });
        });

        playBg.on('pointerout', () => {

            this.tweens.add({

                targets: [playBg, playText],

                scaleX: 1,

                scaleY: 1,

                duration: 120
            });
        });

        // click

        playBg.on('pointerdown', () => {

            this.cameras.main.flash(
                200,
                255,
                255,
                255
            );

            this.time.delayedCall(
                180,
                () => {

                    this.scene.start(
                        'GameScene'
                    );
                }
            );
        });

        // =================================
        // DECORATIONS
        // =================================

        for (let i = 0; i < 8; i++) {

            const paper =
                this.add.rectangle(
                    Phaser.Math.Between(0, 1024),
                    Phaser.Math.Between(0, 576),
                    Phaser.Math.Between(30, 80),
                    Phaser.Math.Between(10, 25),
                    0xffffff,
                    0.08
                );

            paper.rotation =
                Phaser.Math.FloatBetween(
                    -0.4,
                    0.4
                );
        }
    }
}