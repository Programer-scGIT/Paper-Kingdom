import Phaser from 'phaser';
import Player from '../objects/Player';

export default class GameScene extends Phaser.Scene {

    private player!: Player;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private enemies: Phaser.Physics.Arcade.Sprite[] = [];

    private enemyGraphics = new Map<
        Phaser.Physics.Arcade.Sprite,
        Phaser.GameObjects.Graphics
    >();

    private hearts: Phaser.GameObjects.Text[] = [];

    private hp = 3;

    private level = 1;

    private attacking = false;

    private canTakeDamage = true;

    private floor!: Phaser.GameObjects.Rectangle;

    private levelEnd!: Phaser.GameObjects.Arc;

    private portalGlow!: Phaser.GameObjects.Arc;


    // =========================
    // MOBILE BUTTONS
    // =========================

    private leftBtn!: Phaser.GameObjects.Rectangle;

    private rightBtn!: Phaser.GameObjects.Rectangle;

    private jumpBtn!: Phaser.GameObjects.Rectangle;

    private attackBtn!: Phaser.GameObjects.Rectangle;

    private mobileLeft = false;

    private mobileRight = false;

    private mobileJump = false;

    private mobileAttack = false;

    constructor() {

        super('GameScene');
    }

    create() {

        // =====================================
        // RESET
        // =====================================

        this.hp = 3;

        this.hearts = [];

        this.enemies = [];

        this.enemyGraphics.clear();

        this.attacking = false;

        this.canTakeDamage = true;

        // =====================================
        // BACKGROUND
        // =====================================

        this.cameras.main.setBackgroundColor('#f8e9d0');

        for (let y = 0; y < 576; y += 32) {

            this.add.line(
                0,
                y,
                0,
                0,
                2600,
                0,
                0xd8c7a0
            )
                .setOrigin(0, 0)
                .setAlpha(0.25);
        }

        // Notebook red line

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
            .setAlpha(0.35);

        // =====================================
        // WORLD
        // =====================================

        this.physics.world.setBounds(
            0,
            0,
            2600,
            576
        );

        this.cursors =
            this.input.keyboard!.createCursorKeys();

        // =====================================
        // FLOOR
        // =====================================

        this.floor = this.add.rectangle(
            1300,
            548,
            2600,
            56,
            0x8b5a2b
        );

        this.floor.setStrokeStyle(
            5,
            0x5c4033
        );

        this.physics.add.existing(
            this.floor,
            true
        );

        // =====================================
        // PLAYER
        // =====================================

        this.player = new Player(
            this,
            120,
            420
        );

        this.physics.add.collider(
            this.player,
            this.floor
        );

        // =====================================
        // PORTAL
        // =====================================

        this.portalGlow = this.add.circle(
            2400,
            420,
            70,
            0xb57dff,
            0.15
        );

        this.levelEnd = this.add.circle(
            2400,
            420,
            45,
            0x8a2be2
        );

        this.levelEnd.setStrokeStyle(
            8,
            0xd8b4ff
        );

        this.physics.add.existing(
            this.levelEnd,
            true
        );

        // =====================================
        // LOAD LEVEL
        // =====================================

        this.loadLevel();

        // =====================================
        // HEARTS
        // =====================================

        this.createHearts();

        // =====================================
        // CAMERA
        // =====================================

        this.cameras.main.startFollow(
            this.player,
            true,
            0.08,
            0.08
        );

        this.cameras.main.setBounds(
            0,
            0,
            2600,
            576
        );
        // =====================================
// MOBILE BUTTONS
// =====================================

        const isMobile = this.sys.game.device.input.touch;

        if (isMobile) {

            this.leftBtn = this.add.rectangle(
                90,
                500,
                90,
                90,
                0x000000,
                0.25
            )
                .setScrollFactor(0)
                .setDepth(999)
                .setInteractive();

            this.add.text(
                75,
                478,
                '←',
                {
                    fontSize: '40px',
                    color: '#ffffff'
                }
            )
                .setScrollFactor(0)
                .setDepth(1000);

            this.rightBtn = this.add.rectangle(
                200,
                500,
                90,
                90,
                0x000000,
                0.25
            )
                .setScrollFactor(0)
                .setDepth(999)
                .setInteractive();

            this.add.text(
                185,
                478,
                '→',
                {
                    fontSize: '40px',
                    color: '#ffffff'
                }
            )
                .setScrollFactor(0)
                .setDepth(1000);

            this.jumpBtn = this.add.rectangle(
                760,
                500,
                90,
                90,
                0x0066ff,
                0.3
            )
                .setScrollFactor(0)
                .setDepth(999)
                .setInteractive();

            this.add.text(
                742,
                478,
                '↑',
                {
                    fontSize: '40px',
                    color: '#ffffff'
                }
            )
                .setScrollFactor(0)
                .setDepth(1000);

            this.attackBtn = this.add.rectangle(
                900,
                500,
                110,
                110,
                0xff0000,
                0.3
            )
                .setScrollFactor(0)
                .setDepth(999)
                .setInteractive();

            this.add.text(
                872,
                475,
                '⚔',
                {
                    fontSize: '42px',
                    color: '#ffffff'
                }
            )
                .setScrollFactor(0)
                .setDepth(1000);

            // LEFT

            this.leftBtn.on('pointerdown', () => {
                this.mobileLeft = true;
            });

            this.leftBtn.on('pointerup', () => {
                this.mobileLeft = false;
            });

            this.leftBtn.on('pointerout', () => {
                this.mobileLeft = false;
            });

            // RIGHT

            this.rightBtn.on('pointerdown', () => {
                this.mobileRight = true;
            });

            this.rightBtn.on('pointerup', () => {
                this.mobileRight = false;
            });

            this.rightBtn.on('pointerout', () => {
                this.mobileRight = false;
            });

            // JUMP

            this.jumpBtn.on('pointerdown', () => {

                const body =
                    this.player.body as Phaser.Physics.Arcade.Body;

                if (body.blocked.down) {

                    this.player.setVelocityY(-520);
                }
            });

            // ATTACK

            this.attackBtn.on('pointerdown', () => {

                this.attack();
            });
        }
    }

    // =====================================
    // HEARTS
    // =====================================

    private createHearts() {

        for (let i = 0; i < this.hp; i++) {

            const heart = this.add.text(
                950 - i * 40,
                18,
                '♥',
                {
                    fontSize: '34px',
                    color: '#ff4d6d'
                }
            );

            heart.setScrollFactor(0);

            this.hearts.push(heart);
        }
    }

    // =====================================
    // LEVELS
    // =====================================

    private loadLevel() {

        if (this.level === 1) {

            this.createPlatform(300, 420, 300);

            this.createPlatform(650, 340, 300);

            this.createPlatform(1000, 260, 300);

            this.createEnemy(700, 420);

            this.createEnemy(1600, 420);

            this.levelEnd.x = 2400;
        }

        else if (this.level === 2) {

            this.createPlatform(260, 440, 260);

            this.createPlatform(600, 360, 260);

            this.createPlatform(940, 280, 260);

            this.createPlatform(1280, 340, 260);

            this.createEnemy(600, 420);

            this.createEnemy(1300, 420);

            this.createEnemy(2000, 420);

            this.createSpikes(900, 528, 240);

            this.levelEnd.x = 2300;
        }

        else {

            this.createPlatform(260, 420, 280);

            this.createPlatform(620, 340, 280);

            this.createPlatform(980, 260, 280);

            this.createPlatform(1340, 340, 280);

            this.createBoss(2100, 390);

            this.createEnemy(900, 420);

            this.createEnemy(1500, 420);

            this.createSpikes(500, 528, 260);

            this.createSpikes(1300, 528, 260);

            this.levelEnd.x = 2480;
        }
    }

    // =====================================
    // PLATFORM
    // =====================================

    private createPlatform(
        x: number,
        y: number,
        width: number
    ) {

        const platform = this.add.rectangle(
            x,
            y,
            width,
            28,
            0xd2b48c
        );

        platform.setStrokeStyle(
            5,
            0x5c4033
        );

        this.physics.add.existing(
            platform,
            true
        );

        this.physics.add.collider(
            this.player,
            platform
        );
    }

    // =====================================
    // SPIKES
    // =====================================

    private createSpikes(
        x: number,
        y: number,
        width: number
    ) {

        const spikes =
            this.add.graphics();

        spikes.fillStyle(0x444444);

        for (let i = 0; i < width; i += 24) {

            spikes.fillTriangle(
                x + i,
                y,
                x + i + 12,
                y - 24,
                x + i + 24,
                y
            );
        }

        const zone = this.add.rectangle(
            x + width / 2,
            y - 10,
            width,
            20,
            0xff0000,
            0
        );

        this.physics.add.existing(
            zone,
            true
        );

        this.physics.add.overlap(
            this.player,
            zone,
            () => {

                if (!this.canTakeDamage) {
                    return;
                }

                this.damagePlayer(1);
            }
        );
    }

    // =====================================
    // ENEMY
    // =====================================

    private createEnemy(
        x: number,
        y: number
    ) {

        const enemy =
            this.physics.add.sprite(
                x,
                y,
                ''
            );

        enemy.setVisible(false);

        enemy.setSize(34, 110);

        enemy.setCollideWorldBounds(true);

        const speed =
            Phaser.Math.Between(50, 80);

        enemy.setVelocityX(speed);

        (enemy as any).speed = speed;

        this.physics.add.collider(
            enemy,
            this.floor
        );

        const g =
            this.add.graphics();

        this.enemyGraphics.set(enemy, g);

        this.physics.add.overlap(
            this.player,
            enemy,
            () => {

                if (!this.canTakeDamage) {
                    return;
                }

                this.hitEffect(enemy);

                this.damagePlayer(1);
            }
        );

        this.enemies.push(enemy);
    }

    // =====================================
    // BOSS
    // =====================================

    private createBoss(
        x: number,
        y: number
    ) {

        const boss =
            this.physics.add.sprite(
                x,
                y,
                ''
            );

        boss.setVisible(false);

        boss.setSize(42, 140);

        boss.setBounce(1, 0);

        boss.setVelocityX(180);

        boss.setCollideWorldBounds(true);

        (boss as any).hp = 3;

        this.physics.add.collider(
            boss,
            this.floor
        );

        const graphics =
            this.add.graphics();

        this.enemyGraphics.set(
            boss,
            graphics
        );

        this.physics.add.overlap(
            this.player,
            boss,
            () => {

                if (!this.canTakeDamage) {
                    return;
                }

                this.hitEffect(boss);

                this.damagePlayer(2);
            }
        );

        this.enemies.push(boss);
    }

    // =====================================
    // HIT EFFECT
    // =====================================

    private hitEffect(
        enemy: Phaser.Physics.Arcade.Sprite
    ) {

        this.cameras.main.shake(
            120,
            0.003
        );

        for (let i = 0; i < 14; i++) {

            const ink =
                this.add.circle(
                    enemy.x,
                    enemy.y,
                    Phaser.Math.Between(2, 6),
                    0x000000
                );

            this.tweens.add({

                targets: ink,

                x:
                    ink.x +
                    Phaser.Math.Between(-80, 80),

                y:
                    ink.y +
                    Phaser.Math.Between(-80, 80),

                alpha: 0,

                scale: 0,

                duration: 500,

                onComplete: () => {

                    ink.destroy();
                }
            });
        }
    }

    // =====================================
    // DAMAGE
    // =====================================

    private damagePlayer(
        damage: number
    ) {

        this.canTakeDamage = false;

        this.hp -= damage;

        for (let i = 0; i < damage; i++) {

            const heart =
                this.hearts.pop();

            heart?.destroy();
        }

        this.player.setAlpha(0.3);

        this.time.delayedCall(
            200,
            () => {

                this.player.setAlpha(1);
            }
        );

        this.time.delayedCall(
            1000,
            () => {

                this.canTakeDamage = true;
            }
        );

        if (this.hp <= 0) {

            this.scene.start(
                'MenuScene'
            );
        }
    }

// =====================================
// COMBO SYSTEM
// =====================================

    private combo = 0;

    private comboResetEvent?: Phaser.Time.TimerEvent;



// =====================================
// ATTACK
// =====================================

    private attack() {

        if (this.attacking) {
            return;
        }

        this.attacking = true;

        // =====================================
        // COMBO
        // =====================================

        this.combo++;

        if (this.combo > 3) {
            this.combo = 1;
        }

        if (this.comboResetEvent) {

            this.comboResetEvent.destroy();
        }

        this.comboResetEvent =
            this.time.delayedCall(
                700,
                () => {

                    this.combo = 0;
                }
            );

        // =====================================
        // SWORD ANIMATION
        // =====================================

        if (this.combo === 1) {

            this.player.swordAngle = -8;

        } else if (this.combo === 2) {

            this.player.swordAngle = -18;

        } else {

            this.player.swordAngle = -30;
        }

        this.tweens.add({

            targets: this.player,

            swordAngle:

                this.combo === 1
                    ? 45
                    : this.combo === 2
                        ? 70
                        : 105,

            duration: 110,

            ease: 'Cubic.easeOut',

            onComplete: () => {

                this.tweens.add({

                    targets: this.player,

                    swordAngle: 0,

                    duration: 170,

                    ease: 'Back.easeOut'
                });
            }
        });

        // =====================================
        // DIRECTION
        // =====================================

        const dir =
            this.player.facingLeft
                ? -1
                : 1;

        // =====================================
        // SLASH FX
        // =====================================

        const slash =
            this.add.graphics();

        slash.lineStyle(
            this.combo === 3 ? 10 : 6,
            this.combo === 3
                ? 0xffdd55
                : 0xffffff
        );

        slash.beginPath();

        if (dir === 1) {

            slash.arc(
                this.player.x + 42,
                this.player.y,
                this.combo === 3 ? 70 : 40,
                Phaser.Math.DegToRad(-70),
                Phaser.Math.DegToRad(70)
            );

        } else {

            slash.arc(
                this.player.x - 42,
                this.player.y,
                this.combo === 3 ? 70 : 40,
                Phaser.Math.DegToRad(110),
                Phaser.Math.DegToRad(250)
            );
        }

        slash.strokePath();

        slash.setBlendMode(
            Phaser.BlendModes.ADD
        );

        this.tweens.add({

            targets: slash,

            alpha: 0,

            duration: 180,

            onComplete: () => {

                slash.destroy();
            }
        });

        // =====================================
        // FREEZE FRAME
        // =====================================

        this.physics.world.pause();

        this.time.delayedCall(
            40,
            () => {

                this.physics.world.resume();
            }
        );

        // =====================================
        // HIT ENEMIES
        // =====================================

        this.enemies.forEach(enemy => {

            if (!enemy.active) {
                return;
            }

            const dx =
                enemy.x - this.player.x;

            const dy =
                enemy.y - this.player.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            const correctDirection =
                this.player.facingLeft
                    ? enemy.x < this.player.x
                    : enemy.x > this.player.x;

            if (
                distance < (
                    this.combo === 3
                        ? 150
                        : 100
                )
                &&
                correctDirection
            ) {

                const data =
                    enemy as any;

                // =================================
                // BOSS HP
                // =================================

                if (data.hp !== undefined) {

                    data.hp--;

                    enemy.setTint(0xff0000);

                    this.time.delayedCall(
                        120,
                        () => {

                            enemy.clearTint();
                        }
                    );

                    // boss knockback

                    enemy.setVelocityX(
                        dir * 260
                    );

                    if (data.hp > 0) {

                        return;
                    }
                }

                // =================================
                // CRIT
                // =================================

                const crit =
                    Phaser.Math.Between(1, 100) <= 20;

                if (crit) {

                    this.cameras.main.flash(
                        120,
                        255,
                        255,
                        255,
                        false
                    );
                }

                // =================================
                // KNOCKBACK
                // =================================

                enemy.setVelocityX(
                    dir * (
                        this.combo === 3
                            ? 700
                            : 350
                    )
                );

                // =================================
                // PARTICLES
                // =================================

                for (let i = 0; i < (
                    this.combo === 3
                        ? 24
                        : 12
                ); i++) {

                    const p =
                        this.add.circle(
                            enemy.x,
                            enemy.y,
                            Phaser.Math.Between(2, 6),
                            crit
                                ? 0xffdd55
                                : 0x000000
                        );

                    this.tweens.add({

                        targets: p,

                        x:
                            p.x +
                            Phaser.Math.Between(-90, 90),

                        y:
                            p.y +
                            Phaser.Math.Between(-90, 90),

                        alpha: 0,

                        scale: 0,

                        duration: 500,

                        onComplete: () => {

                            p.destroy();
                        }
                    });
                }

                // =================================
                // SCREEN SHAKE
                // =================================

                this.cameras.main.shake(
                    this.combo === 3
                        ? 180
                        : 90,

                    this.combo === 3
                        ? 0.007
                        : 0.003
                );

                // =================================
                // DESTROY
                // =================================

                const graphics =
                    this.enemyGraphics.get(enemy);

                graphics?.destroy();

                enemy.destroy();
            }
        });

        // =====================================
        // ATTACK COOLDOWN
        // =====================================

        this.time.delayedCall(
            220,
            () => {

                this.attacking = false;
            }
        );
    }
    // =====================================
    // DRAW ENEMIES
    // =====================================
    private drawEnemies() {

        this.enemies.forEach(enemy => {

            if (!enemy.active) {
                return;
            }

            const g =
                this.enemyGraphics.get(enemy);

            if (!g) {
                return;
            }

            g.clear();

            g.x = enemy.x;

            g.y = enemy.y;

            const isBoss =
                (enemy as any).hp !== undefined;

            // wobble

            g.rotation =
                Math.sin(
                    this.time.now * 0.003 +
                    enemy.x * 0.01
                ) * 0.008;

            // =================================
            // SHADOW
            // =================================

            g.fillStyle(0x000000, 0.12);

            g.fillEllipse(
                0,
                58,
                34,
                8
            );

            // =================================
            // BODY
            // =================================

            const bodyWidth =
                isBoss ? 34 : 24;

            const bodyHeight =
                isBoss ? 120 : 88;

            g.fillStyle(
                isBoss
                    ? 0x6ec1ff
                    : 0xf4c542
            );

            g.lineStyle(
                4,
                0x2c1f14
            );

            g.fillRoundedRect(
                -bodyWidth / 2,
                -bodyHeight / 2,
                bodyWidth,
                bodyHeight,
                4
            );

            g.strokeRoundedRect(
                -bodyWidth / 2,
                -bodyHeight / 2,
                bodyWidth,
                bodyHeight,
                4
            );

            // =================================
            // ERASER
            // =================================

            g.fillStyle(
                isBoss
                    ? 0xdddddd
                    : 0xff9bb0
            );

            g.fillRect(
                -bodyWidth / 2,
                bodyHeight / 2 - 10,
                bodyWidth,
                14
            );

            g.strokeRect(
                -bodyWidth / 2,
                bodyHeight / 2 - 10,
                bodyWidth,
                14
            );

            // metal

            g.fillStyle(0xb0b0b0);

            g.fillRect(
                -bodyWidth / 2,
                bodyHeight / 2 - 18,
                bodyWidth,
                8
            );

            // =================================
            // TIP
            // =================================

            g.fillStyle(0xe7c9a9);

            g.fillTriangle(
                0,
                -bodyHeight / 2 - 18,
                -12,
                -bodyHeight / 2,
                12,
                -bodyHeight / 2
            );

            // graphite

            g.fillStyle(0x2c1f14);

            g.fillTriangle(
                0,
                -bodyHeight / 2 - 26,
                -5,
                -bodyHeight / 2 - 12,
                5,
                -bodyHeight / 2 - 12
            );

            // =================================
            // FACE
            // =================================

            g.fillStyle(0x2c1f14);

            // eyes

            g.fillCircle(-5, -10, 2);

            g.fillCircle(5, -10, 2);

            // angry eyebrows

            g.lineStyle(2, 0x2c1f14);

            g.beginPath();

            g.moveTo(-10, -16);

            g.lineTo(-2, -13);

            g.strokePath();

            g.beginPath();

            g.moveTo(10, -16);

            g.lineTo(2, -13);

            g.strokePath();

            // mouth

            g.beginPath();

            g.moveTo(-6, 2);

            g.lineTo(0, 5);

            g.lineTo(6, 2);

            g.strokePath();

            // =================================
            // HANDS
            // =================================

            g.lineStyle(3, 0x2c1f14);

            const armSwing =
                Math.sin(
                    this.time.now * 0.008 +
                    enemy.x * 0.01
                ) * 8;

            // LEFT ARM

            g.beginPath();

            g.moveTo(
                -bodyWidth / 2,
                12
            );

            g.lineTo(
                -24,
                22 + armSwing
            );

            g.strokePath();

            // RIGHT ARM

            g.beginPath();

            g.moveTo(
                bodyWidth / 2,
                12
            );

            g.lineTo(
                24,
                22 - armSwing
            );

            g.strokePath();
            // =================================
            // LEGS
            // =================================

            g.beginPath();

            g.moveTo(-6, bodyHeight / 2);

            g.lineTo(-8, bodyHeight / 2 + 18);

            g.strokePath();

            g.beginPath();

            g.moveTo(6, bodyHeight / 2);

            g.lineTo(8, bodyHeight / 2 + 18);

            g.strokePath();
        });
    }
    // =====================================
    // UPDATE
    // =====================================

    update() {

        this.player.update(
            this.cursors
        );

        // =====================================
// MOBILE INPUT
// =====================================

        if (this.mobileLeft) {

            this.player.setVelocityX(-260);

            this.player.facingLeft = true;
        }

        if (this.mobileRight) {

            this.player.setVelocityX(260);

            this.player.facingLeft = false;
        }

        const body =
            this.player.body as Phaser.Physics.Arcade.Body;

        if (
            this.mobileJump &&
            body.blocked.down
        ) {

            this.player.setVelocityY(-520);
        }

        this.drawEnemies();

        // Portal pulse

        const scale =
            1 +
            Math.sin(
                this.time.now * 0.005
            ) * 0.08;

        this.levelEnd.setScale(scale);

        this.portalGlow.setScale(scale);

        this.portalGlow.x =
            this.levelEnd.x;

        this.portalGlow.y =
            this.levelEnd.y;


        // Attack

        if (
            Phaser.Input.Keyboard.JustDown(
                this.cursors.space
            )
        ) {

            this.attack();
        }

        // =====================================
// NEXT LEVEL
// =====================================

        this.physics.overlap(
            this.player,
            this.levelEnd,
            () => {

                // на 10 уровне нельзя пройти портал,
                // пока жив финальный босс

                if (this.level === 10) {

                    const bossAlive =
                        this.enemies.some(enemy => {

                            return (
                                enemy.active &&
                                (enemy as any).finalBoss
                            );
                        });

                    if (bossAlive) {
                        return;
                    }

                    // ПОБЕДА

                    this.add.text(
                        this.cameras.main.scrollX + 260,
                        180,
                        'YOU WIN!',
                        {
                            fontSize: '72px',
                            color: '#ffd700',
                            stroke: '#000000',
                            strokeThickness: 8
                        }
                    )
                        .setScrollFactor(0)
                        .setDepth(9999);

                    this.physics.pause();

                    return;
                }

                // следующий уровень

                this.level++;

                this.scene.restart();
            }
        );
    }
}