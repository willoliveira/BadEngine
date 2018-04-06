import { Component } from "./Component";
import { Transform } from "./Transform";

export class GameComponent extends Component {

	public _name: string = 'Game component';
	public id: string; // TODO: Gera um hash automático depois talvez

	private _components: Array<Component> = [ ]; // TODO: Tentar assim por enquanto
	private _children: Array<GameComponent> = [ ];

	constructor(public transform: Transform) {
		super();

		this.addComponent(this.transform as Component);
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		if (value !== '') {
			this._name = value;
		}
	}

	get components() {
		return this._components;
	}

	get children() {
		return this._children;
	}


	public addComponent(component: GameComponent|Component): Component {
		component.parent = this;
		this._components.push(component);
		return component;
	}

	public getComponent(type: any): Component {
		return this._components.find((c:any) => c.constructor.name === type);
	}

	public getComponents(type: any): Array<Component> {
		return this._components.filter((c:any) => c.constructor.name === type);
	}

	public addChildren(gameComponent: GameComponent): GameComponent {
		gameComponent.parent = this;
		this._children.push(gameComponent);
		return gameComponent;
	}

	public getChild(childName: string): GameComponent {
		return this._children.find((gc: GameComponent) => gc.name === childName);
	}

 	public getChildrens(childName: string): Array<GameComponent> {
		return this._children.filter((gc: GameComponent) => gc.name === childName);
	}
}