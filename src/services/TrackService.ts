/// <reference path="../phaser.d.ts"/>

import { Track } from '../models/Track';
import TestScene from '../scenes/PlayScene';

export class TrackService {

	private tracks: Track[] = [];
	private currentTrack: Track;

	private mouseDownTime: number;
	private didMouseMove: boolean = false;

	constructor(private scene: TestScene, private input: Phaser.Input.InputPlugin, private hoverGraphics: Phaser.GameObjects.Graphics, private trackGraphics: Phaser.GameObjects.Container) {
		window.addEventListener("mousedown", (e: any) => {
			if (e.which === 1) {
				this.onLeftMouseDown(e);
			} else if (e.which === 3) {
				this.onRightMouseDown(e);
			}
		}, true);

		window.addEventListener("mousemove",(e: any) => {
			this.onMouseMove(e);
		}, true);
		window.addEventListener("mouseup",(e:any) => {
			if (e.which === 1) {
				this.onLeftMouseUp(e);
			} else if (e.which === 3) {
				this.onRightMouseUp(e);
			}
		}, true);
		window.addEventListener("contextmenu",(e:any) => {
			e.preventDefault();
		}, true);

		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			let newX = this.getSnapPoint(dragX);
			let newY = this.getSnapPoint(dragY);
			gameObject.x = newX;
			gameObject.y = newY;
			gameObject.track.plot();
		});
	}

	private getSnapPoint(pos: number) {
		let newPos = (pos) / this.scene.getScale();
		console.log(newPos);
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

	private onLeftMouseDown(e: any) {
		this.mouseDownTime = new Date().getTime();
		this.didMouseMove = false;
	}

	private onRightMouseDown(e: any) {
		this.mouseDownTime = new Date().getTime();
		this.didMouseMove = false;
	}

	private onMouseMove(e: any) {
		this.didMouseMove = true;

		let newX = this.getSnapPoint(e.clientX);
		let newY = this.getSnapPoint(e.clientY);
		this.hoverGraphics.clear();
		this.hoverGraphics.fillStyle(0x000000, 0.2);
		// this.hoverGraphics.fillRectShape(new Rectangle(newX, newY, 50, 50));
		this.hoverGraphics.fillCircle(newX, newY, 10);

		if (this.currentTrack) {
			this.currentTrack.plot(newX, newY);
			//this.plot(newX, newY);
		}
	}

	private onLeftMouseUp(e: any) {
		let upTime = new Date().getTime();
		if (upTime - this.mouseDownTime < 300) {
			this.onClick(e);
		}
	}

	private onRightMouseUp(e: any) {
		let upTime = new Date().getTime();
		if (upTime - this.mouseDownTime < 300) {
			this.onRightClick(e);
		}
	}

	private onClick(e) {
		let newX = this.getSnapPoint(e.clientX);
		let newY = this.getSnapPoint(e.clientY);
		if (!this.currentTrack) {
			let graphics = this.scene.add.graphics();
			this.trackGraphics.add(graphics);
			this.currentTrack = new Track(graphics, this.scene);
		}
		this.currentTrack.addPoint(newX, newY);
		this.currentTrack.plot();
	}

	private onRightClick(e) {
		if (this.currentTrack) {
			this.tracks.push(this.currentTrack);
			this.currentTrack.plot();
			this.currentTrack = null;
		}
	}
}