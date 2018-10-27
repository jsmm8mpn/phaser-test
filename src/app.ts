/// <reference path="phaser.d.ts"/>

import 'phaser';

import TestScene from './scenes/PlayScene';
import { UIScene } from './scenes/UIScene';

const config:GameConfig = {
	type: Phaser.AUTO,
	parent: 'content',
	width: window.innerWidth-10,
	height: window.innerHeight-10,
	resolution: 1,
	backgroundColor: "#EDEEC9",
	scene: [
		TestScene, UIScene
	]
	// physics: {
	// 	default: 'arcade',
	// 	arcade: {
	// 		gravity: {y: 500},
	// 		debug: false
	// 	}
	// }
};

new Phaser.Game(config);