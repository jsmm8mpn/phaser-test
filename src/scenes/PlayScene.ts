import Container = Phaser.GameObjects.Container;
import { CameraService } from '../services/CameraService';
import { TrackService } from '../services/TrackService';
import { City } from '../models/City';
import { TrainService } from '../services/TrainService';

class TestScene extends Phaser.Scene {
	layer: Phaser.Tilemaps.StaticTilemapLayer;
	container: Container;

	cameraService: CameraService;
	trackService: TrackService;
	trainService: TrainService;

	cities: City[] = [];

	trackGraphics: Phaser.GameObjects.Container;
	hoverGraphics: Phaser.GameObjects.Graphics;

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
		this.cities.push(new City(new Phaser.Geom.Point(250, 750), cityGraphics));

		this.container = this.add.container(0,0, [this.layer, gridGraphics, this.hoverGraphics, this.trackGraphics, cityGraphics]);

		this.cameraService = new CameraService(this.cameras.main, this.layer);
		this.cameraService.addGameObject(this.container);

		this.trackService = new TrackService(this, this.input, this.hoverGraphics, this.trackGraphics);
		this.trainService = new TrainService(this, this.trackService);

		this.trainService.addTrain(this.cities[0], this.cities[1]);
		this.trainService.addTrain(this.cities[0], this.cities[2]);
		this.trainService.addTrain(this.cities[1], this.cities[2]);

		this.input.keyboard.on('keydown', (event) => {
			if (event.which == 32) {
				this.trainService.startTrains();
			}
		});
	}

	public getScale() {
		return this.layer.scaleX;
	}

	render() {

	}

	public update() {
		this.trainService.update();
	}

	public pointIsCity(x: number, y: number) {
		for (let city of this.cities) {
			if (city.isLocation(x, y)) {
				return city;
			}
		}
		return null;
	}
}

export default TestScene;