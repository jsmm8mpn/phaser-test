/// <reference path="../phaser.d.ts"/>

export class UIScene extends Phaser.Scene {

	score: number;

	constructor ()
	{
		super({ key: 'UIScene', active: true });

		this.score = 0;
	}

	create ()
	{
		//  Our Text object to display the Score
		let info = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#000000', backgroundColor: '#cb9865' });

		//  Grab a reference to the Game Scene
		let ourGame = this.scene.get('GameScene');

		// //  Listen for events from it
		// ourGame.events.on('addScore', function () {
		//
		// 	this.score += 10;
		//
		// 	info.setText('Score: ' + this.score);
		//
		// }, this);
	}
}