/// <reference path="../phaser.d.ts"/>

import { Track } from '../models/Track';
import TestScene from '../scenes/PlayScene';

export class TrackService {

	private tracks: Track[] = [];
	private currentTrack: Track;

	private mouseDownTime: number;
	private didMouseMove: boolean = false;

	constructor(private scene: TestScene, private input: Phaser.Input.InputPlugin, private hoverGraphics: Phaser.GameObjects.Graphics, private trackGraphics: Phaser.GameObjects.Container) {

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			if (pointer.buttons === 1) {
				this.onLeftMouseDown(pointer);
			} else if (pointer.buttons === 2) {
				this.onRightMouseDown(pointer);
			}
		});

		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			this.onMouseMove(pointer);
		});

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			if (pointer.buttons === 1) {
				this.onLeftMouseUp(pointer);
			} else if (pointer.buttons === 2) {
				this.onRightMouseUp(pointer);
			}
		});

		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			let newX = this.getSnapPoint(pointer.worldX);
			let newY = this.getSnapPoint(pointer.worldY);
			gameObject.x = newX;
			gameObject.y = newY;
			gameObject.track.plot();
		});
	}

	private getSnapPoint(pos: number) {
		let newPos = (pos) / this.scene.getScale();
		if ((newPos % 50) > 25) {
			return Math.ceil(newPos / 50) * 50;
		} else {
			return Math.floor(newPos / 50) * 50;
		}
	}

	// private getMiddleOfGrid(pos: number) {
	// 	if (((pos % 50) - 25) > 25) {
	// 		return Math.ceil(pos / 50) * 50 + 25;
	// 	} else {
	// 		return Math.floor(pos / 50) * 50 + 25;
	// 	}
	// }
	//
	// private getStartOfGrid(pos: number) {
	// 	return Math.floor(pos / 50) * 50;
	// }

	private onLeftMouseDown(pointer: Phaser.Input.Pointer) {
		this.mouseDownTime = new Date().getTime();
		this.didMouseMove = false;
	}

	private onRightMouseDown(pointer: Phaser.Input.Pointer) {
		this.mouseDownTime = new Date().getTime();
		this.didMouseMove = false;
	}

	private onMouseMove(pointer: Phaser.Input.Pointer) {
		this.didMouseMove = true;

		let newX = this.getSnapPoint(pointer.worldX);
		let newY = this.getSnapPoint(pointer.worldY);
		this.hoverGraphics.clear();
		this.hoverGraphics.fillStyle(0x000000, 0.2);
		// this.hoverGraphics.fillRectShape(new Rectangle(newX, newY, 50, 50));
		this.hoverGraphics.fillCircle(newX, newY, 10);

		if (this.currentTrack) {
			this.currentTrack.plot(newX, newY);
			//this.plot(newX, newY);
		}
	}

	private onLeftMouseUp(pointer: Phaser.Input.Pointer) {
		let upTime = new Date().getTime();
		if (upTime - this.mouseDownTime < 300) {
			this.onClick(pointer);
		}
	}

	private onRightMouseUp(pointer: Phaser.Input.Pointer) {
		let upTime = new Date().getTime();
		if (upTime - this.mouseDownTime < 300) {
			this.onRightClick(pointer);
		}
	}

	private onClick(pointer: Phaser.Input.Pointer) {
		let newX = this.getSnapPoint(pointer.worldX);
		let newY = this.getSnapPoint(pointer.worldY);
		if (!this.currentTrack) {
			let graphics = this.scene.add.graphics();
			this.trackGraphics.add(graphics);
			this.currentTrack = new Track(graphics, this.scene);
		}
		this.currentTrack.addPoint(newX, newY);
		this.currentTrack.plot();
	}

	private onRightClick(pointer: Phaser.Input.Pointer) {
		if (this.currentTrack) {
			this.tracks.push(this.currentTrack);
			this.currentTrack.plot();
			this.currentTrack = null;
		}
	}
}