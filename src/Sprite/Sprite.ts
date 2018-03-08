import { Component } from '../_base/Component';
import { GameEngine } from '../Engine/GameEngine';

//pensar em um nome
interface SpriteProperty {
	backgroundColor: string; //não usado ainda
	canvas: HTMLCanvasElement,
	image?: any
}

export class Sprite extends Component {

	public flip: { x: boolean, y: boolean } = {
		x: false,
		y: false
	};
	public layer: number;
	public orderInLayer: number;
	public sprite: SpriteProperty = {
		backgroundColor: "#FFFFFF",
		canvas: <HTMLCanvasElement> document.createElement("canvas")
	};

	constructor(image?: any) {
		super();

		this.UpdateCanvas(image);
	}

	UpdateCanvas(image?: any) {
		const ctx: CanvasRenderingContext2D = this.sprite.canvas.getContext("2d") as CanvasRenderingContext2D;
		ctx.drawImage(image, 0, 0);

		this.sprite.canvas.width = image.width;
		this.sprite.canvas.height = image.height;
		this.sprite.image = image;
	}
}