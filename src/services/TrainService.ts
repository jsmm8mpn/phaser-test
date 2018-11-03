import TestScene from '../scenes/PlayScene';
import { TrackService } from './TrackService';
import { City } from '../models/City';
import { Train } from '../models/Train';
import { TrainRoute } from '../models/TrainRoute';

export class TrainService {

	trains: Train[] = [];
	routes: TrainRoute[] = [];

	constructor(private scene: TestScene, private trackService: TrackService) {

	}

	public addTrain(from: City, to: City) {
		this.trains.push(new Train(from,  to));
	}

	public startTrains() {
		this.routes = [];
		for (let train of this.trains) {
			for (let track of this.trackService.getTracks()) {
				if (track.supportsTrain(train)) {
					let route = new TrainRoute(this.scene, track)
					this.routes.push(route);
					route.toggleSprite();
				}
			}
		}
	}

	public update() {
		for (let route of this.routes) {
			route.update();
		}
	}
}