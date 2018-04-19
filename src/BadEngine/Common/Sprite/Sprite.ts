import { Component } from "../../Base/Component/Component";
import { Transform } from "../../Base/Transform/Transform";
import { GameComponent } from "../../Base/GameCmponent/GameComponent";
import { GameEngine } from "../../Base/GameEngine";
import { Camera } from "../Camera/Camera";
import { Box2D } from "../Box2D/Box2D";

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

	transform: Transform;
	gameComponentCamera: GameComponent;
	box2D: Box2D;
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
		this.box2D = this.parent.getComponent('Box2D') as Box2D;
	}

	//TODO: Tentar dar uma melhorada
	Update() {
		this.sprite.destRect.x = ((this.gameComponentCamera.transform.position.x * -1) + this.transform.position.x);
		this.sprite.destRect.y = ((this.gameComponentCamera.transform.position.y * -1)  + this.transform.position.y);
		//TODO: remover isso, e controlar o tamanho de outra forma, com o scale do Transform é uma possibilidade
		this.sprite.destRect.width = 64;
		this.sprite.destRect.height = 64;
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

		if (this.box2D) {
			Camera.context2D.strokeStyle = '#00ff1f';
			Camera.context2D.strokeRect(
				destRect.x + this.box2D.offset.x,
				destRect.y + this.box2D.offset.y,
				this.box2D.size.x,
				this.box2D.size.y
			);
		}
	}
}