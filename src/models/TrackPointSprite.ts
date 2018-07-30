/// <reference path="../phaser.d.ts"/>

import { Track } from './Track';
import Sprite = Phaser.GameObjects.Sprite;

export class TrackPointSprite extends Sprite {
	private track: Track;

	public setTrack(track: Track) {
		this.track = track;
	}
}