import Sprite = Phaser.GameObjects.Sprite;
import { TrackPointSprite } from './TrackPointSprite';
import TestScene from '../scenes/PlayScene';
import { City } from './City';
import { Train } from './Train';

export class Track {
	// public x: number[] = [];
	// public y: number[] = [];

	private linePoints: Sprite[] = [];
	private cities: City[] = [];

	constructor(private graphics: Phaser.GameObjects.Graphics, private scene: TestScene) {

	}

	public addPoint(newX: number, newY: number) {
		// this.x.push(newX);
		// this.y.push(newY);

		let pointSpite = new TrackPointSprite(this.scene, newX, newY, 'centroid', 0);
		this.scene.add.existing(pointSpite);
		this.scene.container.add(pointSpite);
		pointSpite.setTrack(this);
		let city = this.scene.pointIsCity(newX, newY);
		if (city) {
			pointSpite.setCity(city);
			this.cities.push(city);
		}
		pointSpite.setInteractive();
		this.scene.input.setDraggable(pointSpite);
		this.linePoints.push(pointSpite);
	}

	public supportsTrain(train: Train) {
		let hasFrom = false, hasTo = false;
		for (let city of this.cities) {
			if (city === train.fromCity) {
				hasFrom = true;
			} else if (city === train.toCity) {
				hasTo = true;
			}
		}
		return hasFrom && hasTo;
	}

	public getLinePoints() {
		return this.linePoints;
	}

	public getLength() {
		return 0;
	}

	public plot(tempX?, tempY?) {
		this.plotCurve(tempX, tempY);
	}

	public plotCatmull(tempX?, tempY?) {
		let x = [];
		let y = [];

		// TODO: Optimize: Call this only when a point changes
		for (let sprite of this.linePoints) {
			x.push(sprite.x);
			y.push(sprite.y);
		}

		if (tempX) {
			x.push(tempX);
		}
		if (tempY) {
			y.push(tempY);
		}

		this.graphics.clear();
		this.graphics.lineStyle(5, 0x000000);

		var ix = 0;

		//  100 points per path segment
		var dx = 1 / (x.length * 100);

		let path = [];

		for (var i = 0; i <= 1; i += dx)
		{
			let px = Phaser.Math.Interpolation.CatmullRom(x, i);
			let py = Phaser.Math.Interpolation.CatmullRom(y, i);

			var node = { x: px, y: py, angle: 0 };

			if (ix > 0)
			{
				node.angle = Phaser.Math.Angle.BetweenPoints(path[ix - 1], node);
			}

			path.push(node);

			ix++;

			if (i === 0) {
				this.graphics.beginPath().moveTo(px, py);
			} else {
				this.graphics.lineTo(px, py);
			}
		}
		this.graphics.strokePath();

	}

	public plotCurve(tempX?, tempY?) {
		let x = [];
		let y = [];

		// TODO: Optimize: Call this only when a point changes
		for (let sprite of this.linePoints) {
			x.push(sprite.x);
			y.push(sprite.y);
		}

		if (tempX) {
			x.push(tempX);
		}
		if (tempY) {
			y.push(tempY);
		}

		this.graphics.clear();
		this.graphics.lineStyle(5, 0x000000);

		this.graphics.beginPath().moveTo(x[0],y[0]);

		for (var i = 1; i <= x.length; i += 1) {
			let px = x[i];
			let py = y[i];
			this.graphics.lineTo(px, py);
		}

		this.graphics.strokePath();
	}


}