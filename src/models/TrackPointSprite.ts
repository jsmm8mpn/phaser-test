/// <reference path="../phaser.d.ts"/>

import { Track } from './Track';
import Sprite = Phaser.GameObjects.Sprite;
import { City } from './City';

export class TrackPointSprite extends Sprite {
	private track: Track;
	private city: City;

	public setTrack(track: Track) {
		this.track = track;
	}

	public setCity(city: City) {
		this.city = city;
	}
}