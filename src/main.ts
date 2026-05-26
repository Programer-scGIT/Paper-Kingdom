import Phaser from 'phaser';
import './style.css';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    backgroundColor: '#f8e9d0',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 900 },   // ← Вот здесь исправлено
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene]
};

new Phaser.Game(config);