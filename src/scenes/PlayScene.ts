import Container = Phaser.GameObjects.Container;
import { CameraService } from '../services/CameraService';
import { TrackService } from '../services/TrackService';

class TestScene extends Phaser.Scene {
	layer: Phaser.Tilemaps.StaticTilemapLayer;
	container: Container;

	cameraService: CameraService;
	trackService: TrackService;

	trackGraphics: Phaser.GameObjects.Container;
	hoverGraphics: Phaser.GameObjects.Graphics;
	pointGraphics: Phaser.GameObjects.Graphics;

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
	}

	create() {
		var map: Phaser.Tilemaps.Tilemap = this.add.tilemap('map');
		var tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('kenny1', 'test1');

		this.layer = map.createStaticLayer(0, tileset, 0, 0);

		this.cameras.main.setBounds(0, 0, this.layer.width, this.layer.height);

		this.trackGraphics = this.add.container(0, 0);
		// this.catmullGraphics = this.add.graphics();
		// this.catmullGraphics.lineStyle(1, 0x000000, 0.6);

		this.hoverGraphics = this.add.graphics();
		this.hoverGraphics.fillStyle(0x000000, 0.2);

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

		this.container = this.add.container(0,0, [this.layer, graphics, this.hoverGraphics, this.trackGraphics, this.pointGraphics]);

		this.cameraService = new CameraService(this.cameras.main, this.layer);
		this.cameraService.addGameObject(this.container);

		this.trackService = new TrackService(this, this.input, this.hoverGraphics, this.trackGraphics);
	}

	public getScale() {
		return this.layer.scaleX;
	}

	render() {

	}
}

export default TestScene;