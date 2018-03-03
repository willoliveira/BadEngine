import { Component } from '../_base/Component';
import { GameEngine } from '../Engine/GameEngine';

export class SpriteComponent extends Component {

	public sprite: any;
	public backgroundColor: string;
	public flip: { x: boolean, y: boolean } = {
		x: false,
		y: false
	};
	public sortingLayer: string;
	public order: number;

	private ctx: CanvasRenderingContext2D;

	constructor() {
		super();

		this.ctx = GameEngine.instance.context2D;
	}

	onRender() {
		// if (this.sprite) {

		// 	this.ctx.drawImage(
		// 		this.sprite, 0, 0,
		// 		tileSize, tileSize,

		// 		((camera.transform.x * -1) + camera.target.trasnform.x) * tileSize, ((camera.transform.y * -1)  + camera.target.trasnform.y) * tileSize,
		// 		tileSize, tileSize
		// 	)
		// }
	}
}