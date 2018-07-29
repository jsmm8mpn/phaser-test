/// <reference path="../phaser.d.ts"/>

import Container = Phaser.GameObjects.Container;
import Rectangle = Phaser.Geom.Rectangle;
import { LinePoint } from '../models/LinePoint';
import Sprite = Phaser.GameObjects.Sprite;
import { Track } from '../models/Track';

class TestScene extends Phaser.Scene {
	player: Phaser.GameObjects.Sprite;
	cursors: any;
	origDragPoint: any;
	layer: Phaser.Tilemaps.StaticTilemapLayer;
	scaleDelta: number = 0.0001;
	width: number;
	height: number;
	container: Container;
	static maxScale: number = 3;
	mouseDownTime: number;
	didMouseMove: boolean = false;

	// trackGraphics: Phaser.GameObjects.Graphics;
	// drawingTrack: boolean = false;
	// trackXPoints: number[] = [];
	// trackYPoints: number[] = [];
	catmullGraphics: Phaser.GameObjects.Graphics;

	hoverGraphics: Phaser.GameObjects.Graphics;

	pointGraphics: Phaser.GameObjects.Graphics;

	// linePoints: Sprite[] = [];

	tracks: Track[] = [];
	currentTrack: Track;
	spriteToTrackMap: any = {};


	constructor() {
		super({
			key: 'TestScene'
		});
	}

	preload() {
		this.load.tilemapTiledJSON('map', '/assets/test1.json');
		this.load.image('test1', '/assets/test1.png');

		this.load.spritesheet('centroid', '/assets/centroid.png', {
			frameWidth: 16,
			frameHeight: 16
		});
		//this.load.image('player', '/assets/sprites/mushroom.png');
	}

	create() {
		var map: Phaser.Tilemaps.Tilemap = this.add.tilemap('map');
		var tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('kenny1', 'test1');
		console.log(tileset);

		this.width = window.innerWidth-10;//tileset.columns * tileset.tileWidth;
		this.height = window.innerHeight-10;//tileset.rows * tileset.tileHeight;
		this.layer = map.createStaticLayer(0, tileset, 0, 0);

		this.cameras.main.setBounds(0, 0, this.layer.width, this.layer.height);

		// this.trackGraphics = this.add.graphics();
		// this.trackGraphics.lineStyle(1, 0x000000, 0.8);

		this.catmullGraphics = this.add.graphics();
		this.catmullGraphics.lineStyle(1, 0x000000, 0.6);

		this.hoverGraphics = this.add.graphics();
		this.hoverGraphics.fillStyle(0x000000, 0.2);

		// let pointImage = this.add.image(0, 0, 'centroid', 1);
		// pointImage.visible = false;


		this.pointGraphics = this.add.graphics();
		this.pointGraphics.fillStyle(0x000000, 0.4);

		let graphics = this.add.graphics();
		graphics.lineStyle(1, 0x000000, 0.1);
		let gridSpacing = 50;

		for (let i = 0; i < 20; i++) {
			graphics.beginPath();
			graphics.moveTo(i*gridSpacing, 0).lineTo(i*gridSpacing, 1000).closePath().strokePath();
		}

		for (let i = 0; i < 100; i++) {
			graphics.beginPath();
			graphics.moveTo(0, i*gridSpacing).lineTo(1000, i*gridSpacing).closePath().strokePath();
		}

		// this.pointGraphics.setInteractive();
		// this.input.setDraggable(this.pointGraphics, true);

		this.container = this.add.container(0,0, [this.layer, graphics, this.hoverGraphics, this.catmullGraphics, this.pointGraphics]);

		// IE9, Chrome, Safari, Opera
		window.addEventListener("mousewheel",this.onMouseWheel.bind(this), true);
		// Firefox
		window.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this), true);

		window.addEventListener("mousedown",this.onMouseDown.bind(this), true);
		window.addEventListener("mousemove",this.onMouseMove.bind(this), true);
		window.addEventListener("mouseup",this.onMouseUp.bind(this), true);
		window.addEventListener("contextmenu",this.onRightClick.bind(this), true);

		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			let newX = this.getSnapPoint(dragX);
			let newY = this.getSnapPoint(dragY);
			gameObject.x = newX;
			gameObject.y = newY;

			// this.trackXPoints = [];
			// this.trackYPoints = [];
			// for (let sprite of this.linePoints) {
			// 	this.trackXPoints.push(sprite.x);
			// 	this.trackYPoints.push(sprite.y);
			// }

			gameObject.track.plot();
		});
	}

	getSnapPoint(pos: number) {
		if ((pos % 50) > 25) {
			return Math.ceil(pos / 50) * 50;
		} else {
			return Math.floor(pos / 50) * 50;
		}
	}

	getMiddleOfGrid(pos: number) {
		if (((pos % 50) - 25) > 25) {
			return Math.ceil(pos / 50) * 50 + 25;
		} else {
			return Math.floor(pos / 50) * 50 + 25;
		}
	}

	getStartOfGrid(pos: number) {
		return Math.floor(pos / 50) * 50;
	}

	onMouseDown(e) {
		if (e.which === 1) {
			this.mouseDownTime = new Date().getTime();
			this.didMouseMove = false;
		}
	}

	onMouseMove(e) {
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

	onMouseUp(e) {
		if (e.which === 1) { // && !this.didMouseMove) {
			let upTime = new Date().getTime();
			if (upTime - this.mouseDownTime < 300) {
				this.onClick(e);
			}
		}
	}

	onClick(e) {
		let newX = this.getSnapPoint(e.clientX);
		let newY = this.getSnapPoint(e.clientY);
		if (this.currentTrack) {

			// this.trackGraphics.lineTo(newX, newY);
			// this.trackGraphics.strokePath();
		} else {
			this.currentTrack = new Track(this.catmullGraphics, this);
			// this.trackGraphics.beginPath();
			// this.trackGraphics.moveTo(newX, newY);
			// this.drawingTrack = true;
		}
		this.currentTrack.addPoint(newX, newY);
		// this.trackXPoints.push(newX);
		// this.trackYPoints.push(newY);
		//this.pointGraphics.fillCircle(newX, newY, 10);
		// let pointSpite = this.add.sprite(newX, newY, 'centroid', 0);
		// pointSpite.setInteractive();
		// this.input.setDraggable(pointSpite);
		// this.linePoints.push(pointSpite);
		this.currentTrack.plot();
	}

	onRightClick(e) {
		e.preventDefault();
		this.tracks.push(this.currentTrack);
		this.currentTrack = null;
		//this.plot();
	}

	onMouseWheel(e) {

		let currentScale = this.layer.scaleX;

		let oldX = (this.cameras.main.scrollX+e.x)/currentScale;
		let oldY = (this.cameras.main.scrollY+e.y)/currentScale;

		if (e.deltaY < 0) {
			currentScale += 0.1;

			if (currentScale > TestScene.maxScale) {
				currentScale = TestScene.maxScale;
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
		this.container.setScale(currentScale);

		this.cameras.main.setBounds(0,0, this.layer.width*currentScale, this.layer.height*currentScale);

		this.cameras.main.scrollX = (oldX*currentScale - e.x);
		this.cameras.main.scrollY = (oldY*currentScale - e.y);
	}

	update(time: number, delta:number) {
		// if (this.input.activePointer.isDown) {
		// 	if (this.origDragPoint) {
		// 		this.cameras.main.scrollX = this.cameras.main.scrollX + (this.origDragPoint.x - this.input.activePointer.position.x);
		// 		this.cameras.main.scrollY = this.cameras.main.scrollY + (this.origDragPoint.y - this.input.activePointer.position.y);
		// 	}	// set new drag origin to current position
		// 	this.origDragPoint = this.input.activePointer.position.clone();
		// }else {
		// 	this.origDragPoint = null;
		// }
	}

	render() {

	}

	// plot(tempX?, tempY?) {
	//
	//
	// 	let x = [...this.trackXPoints];
	// 	let y = [...this.trackYPoints];
	//
	// 	if (tempX) {
	// 		x.push(tempX);
	// 	}
	// 	if (tempY) {
	// 		y.push(tempY);
	// 	}
	//
	// 	this.catmullGraphics.clear();
	//
	// 	var ix = 0;
	//
	// 	//  100 points per path segment
	// 	var dx = 1 / (x.length * 100);
	//
	// 	let path = [];
	//
	// 	for (var i = 0; i <= 1; i += dx)
	// 	{
	// 		let px = Phaser.Math.Interpolation.CatmullRom(x, i);
	// 		let py = Phaser.Math.Interpolation.CatmullRom(y, i);
	//
	// 		var node = { x: px, y: py, angle: 0 };
	//
	// 		if (ix > 0)
	// 		{
	// 			Phaser.Math.Angle.BetweenPoints(path[ix - 1], node);
	// 		}
	//
	// 		path.push(node);
	//
	// 		ix++;
	//
	// 		if (i === 0) {
	// 			this.catmullGraphics.beginPath().moveTo(px, py);
	// 		} else {
	// 			this.catmullGraphics.lineTo(px, py);
	// 		}
	// 	}
	// 	this.catmullGraphics.strokePath();
	//
	// }
}

export default TestScene;