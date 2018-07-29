import { Track } from './Track';

export class TrackPointSprite extends Phaser.GameObjects.Sprite {
	private track: Track;

	public setTrack(track: Track) {
		this.track = track;
	}
}