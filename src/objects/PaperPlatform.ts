import Phaser from 'phaser';

export default class PaperPlatform extends Phaser.Physics.Arcade.StaticGroup {

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number
    ) {

        super(scene.physics.world, scene);

        const graphics = scene.add.graphics();

        graphics.lineStyle(4, 0x5c4033);

        graphics.fillStyle(0xd2b48c);

        graphics.fillRoundedRect(
            x - width / 2,
            y - 14,
            width,
            28,
            6
        );

        graphics.strokeRoundedRect(
            x - width / 2,
            y - 14,
            width,
            28,
            6
        );

        const rect = scene.add.rectangle(
            x,
            y,
            width,
            28,
            0x000000,
            0
        );

        scene.physics.add.existing(rect, true);

        this.add(rect);
    }
}