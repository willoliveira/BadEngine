import { Component } from '../_base/Component';
import { GameEngine } from '../Engine/GameEngine';

//pensar em um nome
interface SpriteProperty {
	backgroundColor: string; //não usado ainda
	canvas: HTMLCanvasElement,
	sourceRect: { x: number, y: number, width: number, height: number },
	destRect: { x: number, y: number, width: number, height: number },
	image?: any
}

export class Sprite extends Component {

	public flip: { x: boolean, y: boolean } = {
		x: false,
		y: false
	};
	public layer: number;
	public orderInLayer: number;
	public sprite: SpriteProperty;

	constructor(image?: any) {
		super();

		this.init(image);
	}

	init(image?: any) {
		var ctx: CanvasRenderingContext2D;

		this.sprite = {
			backgroundColor: "#FFFFFF",
			canvas: <HTMLCanvasElement> document.createElement("canvas"),
			sourceRect: { x: 0, y: 0, width: image.width, height: image.height },
			destRect: { x: 0, y: 0, width: image.width, height: image.height },
			image
		}

		ctx = this.sprite.canvas.getContext("2d") as CanvasRenderingContext2D;
		ctx.drawImage(image, 0, 0);

		this.sprite.canvas.width = image.width;
		this.sprite.canvas.height = image.height;
	}
}