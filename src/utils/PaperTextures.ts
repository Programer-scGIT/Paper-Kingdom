import Phaser from 'phaser';

export function createPaperTextures(scene: Phaser.Scene) {

    // Игрок
    const g = scene.add.graphics();

    g.lineStyle(4, 0x2c1f14);

    g.strokeRoundedRect(0, 0, 38, 58, 6);

    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(0, 0, 38, 58, 6);

    g.generateTexture('knight', 38, 58);

    g.clear();

    // Враг
    g.lineStyle(4, 0x1a1a1a);

    g.strokeCircle(24, 24, 22);

    for (let i = 0; i < 8; i++) {
        g.lineBetween(
            24,
            24,
            Phaser.Math.Between(0, 48),
            Phaser.Math.Between(0, 48)
        );
    }

    g.generateTexture('scribbleEnemy', 48, 48);

    g.clear();

    // Платформа
    g.lineStyle(3, 0x5c4033);

    g.fillStyle(0xd2b48c);

    g.fillRoundedRect(0, 0, 200, 28, 6);

    g.strokeRoundedRect(0, 0, 200, 28, 6);

    g.generateTexture('platform', 200, 28);

    g.destroy();
}