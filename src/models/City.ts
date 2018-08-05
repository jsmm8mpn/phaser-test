export class City {

	constructor(private location: Phaser.Geom.Point, private graphics: Phaser.GameObjects.Graphics) {
		this.graphics.fillStyle(0x0000ff, 0.5);
		// this.hoverGraphics.fillRectShape(new Rectangle(newX, newY, 50, 50));
		this.graphics.fillCircle(location.x, location.y, 20);
	}

	// isLocation(point: Phaser.Geom.Point) {
	// 	return (point.x === this.location.x && point.y === this.location.y);
	// }

	isLocation(x: number, y: number) {
		return (x === this.location.x && y === this.location.y);
	}
}