import { Component } from "../_base/Component";

/**
* TODO: super provisório, depois investir um tempo pra chegar em um lance legal aqui
*/
export class GameEngine extends Component {

	public FPS: number = 60;
	public canvas: HTMLCanvasElement;
	public context2D: CanvasRenderingContext2D;

	public static instance: GameEngine;

	constructor(stageId: string) {
		super();

		GameEngine.instance = this;
		this.Init(stageId);
	}

	Init(stageId: string) {
		this.canvas = <HTMLCanvasElement> document.getElementById(stageId);
		this.context2D = this.canvas.getContext("2d");
	}


}