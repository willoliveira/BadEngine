import { Component } from "./Component";

export class Transform extends Component{

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