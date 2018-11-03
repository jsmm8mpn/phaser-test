import TestScene from '../scenes/PlayScene';
import { Track } from './Track';

export class TrainRoute {
	trainSprite: any;
	bi: number = 0;
	trainPoints = [];

	constructor(private scene: TestScene, private track: Track) {
		this.trainSprite = this.scene.add.sprite(0, 0, 'train');
		this.trainSprite.visible = false;
	}

	public toggleSprite() {

		if (this.trainSprite.visible)
		{
			this.trainSprite.visible = false;
		}
		else
		{
			let linePoints: Phaser.GameObjects.Sprite[] = this.track.getLinePoints();
			this.bi = 0;
			this.trainSprite.visible = true;

			let x = [];
			let y = [];

			// TODO: Optimize: Call this only when a point changes
			for (let sprite of linePoints) {
				x.push(sprite.x);
				y.push(sprite.y);
			}

			var ix = 0;

			//  100 points per path segment
			var dx = 1 / (x.length * 100);

			let path = [];

			for (var i = 0; i <= 1; i += dx)
			{
				let px = Phaser.Math.Interpolation.Linear(x, i);
				let py = Phaser.Math.Interpolation.Linear(y, i);

				var node = { x: px, y: py, angle: 0 };

				if (ix > 0)
				{
					node.angle = Phaser.Math.Angle.BetweenPoints(path[ix - 1], node);
				}

				path.push(node);
				ix++;
			}

			this.trainPoints = path;
		}

	}

	public update() {

		if (this.trainSprite.visible)
		{

			this.bi += 1;
			if (this.trainPoints && this.bi < this.trainPoints.length) {

				// let linePoints: Phaser.GameObjects.Sprite[] = tracks[0].getLinePoints();



				// this.train.x = this.train.x + this.trainPoints[this.bi].x;
				// this.train.y = this.train.y + this.trainPoints[this.bi].y;
				this.trainSprite.rotation = this.trainPoints[this.bi].angle;
				this.trainSprite.x = this.trainPoints[this.bi].x;
				this.trainSprite.y = this.trainPoints[this.bi].y;
			} else {
				this.trainSprite.visible = false;
			}
		}

	}
}