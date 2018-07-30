/// <reference path="../phaser.d.ts"/>

import TestScene from '../scenes/PlayScene';

export class CameraService {

	static maxScale: number = 3;

	private readonly width: number;
	private readonly height: number;

	private mouseDownTime: number;
	private didMouseMove: boolean = false;
	private origDragPoint: any;

	private gameObjects: Phaser.GameObjects.Components.Transform[] = [];

	constructor(private camera: Phaser.Cameras.Scene2D.Camera, private layer: Phaser.Tilemaps.StaticTilemapLayer) {

		this.width = window.innerWidth-10;//tileset.columns * tileset.tileWidth;
		this.height = window.innerHeight-10;//tileset.rows * tileset.tileHeight;

		// IE9, Chrome, Safari, Opera
		window.addEventListener("mousewheel",this.onMouseWheel.bind(this), true);
		// Firefox
		window.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this), true);

		window.addEventListener("mousedown", (e: any) => {
			if (e.which === 1) {
				this.onLeftMouseDown(e);
			} else if (e.which === 3) {
				this.onRightMouseDown(e);
			}
		}, true);

		window.addEventListener("mousemove",(e: any) => {
			if (e.which === 1) {
				this.onLeftMouseMove(e);
			} else if (e.which === 3) {
				this.onRightMouseMove(e);
			}
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
	}

	public addGameObject(object: Phaser.GameObjects.Components.Transform) {
		this.gameObjects.push(object);
	}

	private onLeftMouseDown(e: any) {

	}

	private onRightMouseDown(e: any) {
		this.mouseDownTime = new Date().getTime();
		this.didMouseMove = false;
	}

	private onLeftMouseMove(e: any) {

	}

	private onRightMouseMove(e: any) {
		this.didMouseMove = true;

		if (this.origDragPoint) {
			this.camera.scrollX = this.camera.scrollX + (this.origDragPoint.clientX - e.clientX);
			this.camera.scrollY = this.camera.scrollY + (this.origDragPoint.clientY - e.clientY);
		}
		this.origDragPoint = e;
	}

	private onLeftMouseUp(e: any) {

	}

	private onRightMouseUp(e: any) {
		let upTime = new Date().getTime();
		if (upTime - this.mouseDownTime < 300) {
			// right mouse click
			//this.onClick(e);
		}
		this.mouseDownTime = null;
		this.origDragPoint = null;
	}

	private onMouseWheel(e: any) {

		let currentScale = this.layer.scaleX;

		let oldX = (this.camera.scrollX+e.x)/currentScale;
		let oldY = (this.camera.scrollY+e.y)/currentScale;

		if (e.deltaY < 0) {
			currentScale += 0.1;

			if (currentScale > CameraService.maxScale) {
				currentScale = CameraService.maxScale;
			}
		} else {
			currentScale -= 0.1;
			if (currentScale <= 0) {
				currentScale = 0.1;
			}
		}

		if (this.layer.width*currentScale < this.width || this.layer.height*currentScale < this.height) {
			let optionA = this.width/this.layer.width;
			let optionB = this.height/this.layer.height;
			currentScale = (optionA > optionB)?optionA:optionB;
		}

		this.layer.setScale(currentScale);
		for (let object of this.gameObjects) {
			object.setScale(currentScale);
		}

		this.camera.setBounds(0,0, this.layer.width*currentScale, this.layer.height*currentScale);

		this.camera.scrollX = (oldX*currentScale - e.x);
		this.camera.scrollY = (oldY*currentScale - e.y);
	}
}