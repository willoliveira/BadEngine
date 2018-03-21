import { Component } from "./Component";
import { Vector2 } from "./Math/Vector2";

export class Transform extends Component{

	public scale: Vector2;
	public rotation: Vector2;
	public position: Vector2;

	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number) {
		super();
	}

	//TODO: Implementar ainda
	public setTranslate() { }
}