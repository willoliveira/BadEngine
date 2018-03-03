import { Component } from "./Component";
import { Transform } from "./Transform";

export class GameComponent extends Component {

	private _components: Array<GameComponent|Component> = [ ]; // TODO: Tentar assim por enquanto

	constructor(public transform: Transform) {
		super();

		this.addComponent(this.transform as Component);
	}

	get components() {
		return this._components;
	}

	public addComponent(component: GameComponent|Component) {
		this.parent = this;
		this._components.push(component);
	}

	public getComponent(type: string) {
		return this._components.filter((c:any) => c.constructor.name === type)[0];
	}

	public getComponents(type: string) {
		return this._components.filter((c:any) => c.constructor.name === type);
	}
}