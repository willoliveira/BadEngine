import { Component } from "./Component";
import { Vector2 } from "./Math/Vector2";

export class Transform extends Component{

	public scale: Vector2 = new Vector2(1, 1);
	public rotation: Vector2 = new Vector2(0, 0);
	public position: Vector2 = new Vector2(0, 0);

	constructor() {
		super();
	}

	//TODO: Implementar ainda
	public setTranslate() { }
}