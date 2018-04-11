import { Component } from "../../Base/Component/Component";
import { Transform } from "../../Base/Transform/Transform";
import { GameComponent } from "../../Base/GameCmponent/GameComponent";
import { GameEngine } from "../../Base/GameEngine";
import { Camera } from "../Camera/Camera";

//pensar em um nome
export interface SpriteProperty {
	backgroundColor: string; //não usado ainda
	canvas: HTMLCanvasElement, //não usado ainda
	sourceRect: { x: number, y: number, width: number, height: number },
	destRect: { x: number, y: number, width: number, height: number },
	image?: any
}

export enum DrawMode {
	SIMPLE,
	TILED
}

export class Sprite extends Component {

	transform: any;
	gameComponentCamera: any;
	// Implementar ainda
	public flip: { x: boolean, y: boolean } = {
		x: false,
		y: false
	};
	public layer: number;
	public orderInLayer: number;
	public sprite: SpriteProperty;
	public drawMode: DrawMode = DrawMode.SIMPLE;

	constructor(image?: any) {
		super();

		this.Awake = this.Awake.bind(this);

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

	Awake() {
		this.transform = this.parent.getComponent('Transform') as Transform;
		this.gameComponentCamera = GameEngine.Camera.parent as GameComponent;
	}

	//TODO: Tentar dar uma melhorada
	Update() {
		this.sprite.destRect = {
			x: ((this.gameComponentCamera.transform.position.x * -1) + this.transform.position.x),
			y: ((this.gameComponentCamera.transform.position.y * -1)  + this.transform.position.y),
			width: 64,
			height: 64
		}
	}

	OnRender() {
		let srcRect = this.sprite.sourceRect;
		let destRect = this.sprite.destRect;

		if (this.drawMode === DrawMode.SIMPLE) {
			Camera.context2D.drawImage(
				this.sprite.image,

				srcRect.x, srcRect.y,
				srcRect.width, srcRect.height,

				destRect.x, destRect.y,
				destRect.width, destRect.height
			);
		} else if (this.drawMode === DrawMode.TILED) {
			Camera.context2D.drawImage(this.sprite.canvas, 0, 0);
			this.sprite.canvas.getContext('2d').clearRect(0, 0, this.sprite.canvas.width, this.sprite.canvas.height);
		}
	}
}