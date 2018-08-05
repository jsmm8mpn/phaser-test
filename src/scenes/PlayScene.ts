import Container = Phaser.GameObjects.Container;
import { CameraService } from '../services/CameraService';
import { TrackService } from '../services/TrackService';
import { City } from '../models/City';

class TestScene extends Phaser.Scene {
	layer: Phaser.Tilemaps.StaticTilemapLayer;
	container: Container;

	cameraService: CameraService;
	trackService: TrackService;

	cities: City[] = [];

	trackGraphics: Phaser.GameObjects.Container;
	hoverGraphics: Phaser.GameObjects.Graphics;

	train: Phaser.GameObjects.Sprite;
	bi: number = 0;
	trainPoints = [];

	constructor() {
		super({
			key: 'TestScene'
		});
	}

	preload() {
		this.load.tilemapTiledJSON('map', '/assets/test1.json');
		this.load.image('test1', '/assets/test1.png');
		this.load.image('train', 'assets/ship.png');

		this.load.spritesheet('centroid', '/assets/centroid.png', {
			frameWidth: 16,
			frameHeight: 16
		});
	}

	create() {
		var map: Phaser.Tilemaps.Tilemap = this.add.tilemap('map');
		var tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('kenny1', 'test1');

		this.layer = map.createStaticLayer(0, tileset, 0, 0);

		this.cameras.main.setBounds(0, 0, this.layer.width, this.layer.height);

		this.trackGraphics = this.add.container(0, 0);

		this.hoverGraphics = this.add.graphics();
		this.hoverGraphics.fillStyle(0x000000, 0.2);

		let gridGraphics = this.add.graphics();
		gridGraphics.lineStyle(1, 0x000000, 0.2);
		let gridSpacing = 50;

		for (let i = 0; i < 20; i++) {
			gridGraphics.beginPath();
			gridGraphics.moveTo(i*gridSpacing, 0).lineTo(i*gridSpacing, 1000).closePath().strokePath();
		}

		for (let i = 0; i < 100; i++) {
			gridGraphics.beginPath();
			gridGraphics.moveTo(0, i*gridSpacing).lineTo(1000, i*gridSpacing).closePath().strokePath();
		}

		let cityGraphics = this.add.graphics();
		this.cities.push(new City(new Phaser.Geom.Point(250, 250), cityGraphics));
		this.cities.push(new City(new Phaser.Geom.Point(500, 500), cityGraphics));

		this.train = this.add.sprite(0, 0, 'train');
		this.train.visible = false;

		this.container = this.add.container(0,0, [this.layer, gridGraphics, this.hoverGraphics, this.trackGraphics, cityGraphics, this.train]);

		this.cameraService = new CameraService(this.cameras.main, this.layer);
		this.cameraService.addGameObject(this.container);

		this.trackService = new TrackService(this, this.input, this.hoverGraphics, this.trackGraphics);

		this.input.keyboard.on('keydown', (event) => {
			if (event.which == 32) {
				this.toggleSprite();
			}
		});
	}

	public getScale() {
		return this.layer.scaleX;
	}

	render() {

	}

	public toggleSprite() {

		if (this.train.visible)
		{
			this.train.visible = false;
		}
		else
		{

			let tracks = this.trackService.getTracks();
			if (tracks.length > 0) {

				let linePoints: Phaser.GameObjects.Sprite[] = tracks[0].getLinePoints();
				this.bi = 0;
				this.train.visible = true;

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

	}

	public update() {

		if (this.train.visible)
		{

			this.bi += 1;
			if (this.trainPoints && this.bi < this.trainPoints.length) {

				// let linePoints: Phaser.GameObjects.Sprite[] = tracks[0].getLinePoints();



				// this.train.x = this.train.x + this.trainPoints[this.bi].x;
				// this.train.y = this.train.y + this.trainPoints[this.bi].y;
				this.train.rotation = this.trainPoints[this.bi].angle;
				this.train.x = this.trainPoints[this.bi].x;
				this.train.y = this.trainPoints[this.bi].y;
			} else {
				this.train.visible = false;
			}
		}

	}

	public pointIsCity(x: number, y: number) {
		for (let city of this.cities) {
			if (city.isLocation(x, y)) {
				return true;
			}
		}
		return false;
	}
}

export default TestScene;