import { Component } from "../Component/Component";
import { Transform } from "../Transform/Transform";
import { GameEngine } from "../GameEngine";

export class GameComponent extends Component {

	public _name: string = 'Game component'; // TODO: Talvez levar esse nome pro nivel do Component

	private _components: Array<string> = [ ];
	private _children: Array<string> = [ ];

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
		return this._components.map((componentId: string) => GameEngine.components.find(c => c.id === componentId))
	}

	get children() {
		return this._children.map((componentId: string) => GameEngine.components.find(c => c.id === componentId) as GameComponent);
	}

	public addComponent(component: Component): Component {
		component.parent = this;
		this._components.push(component.id);
		return component;
	}

	public getComponent(type: any): Component {
		return this.components.find((c: Component) => c.constructor.name === type);
	}

	public getComponents(type: any): Array<Component> {
		return this.components.filter((c: Component) => c.constructor.name === type);
	}

	public addChildren(gameComponent: GameComponent): GameComponent {
		gameComponent.parent = this;
		this._children.push(gameComponent.id);
		return gameComponent;
	}

	public getChild(childName: string): GameComponent {
		return this.children.find((gc: GameComponent) => gc.name === childName);
	}

 	public getChildrens(childName: string): Array<GameComponent> {
		return this.children.filter((gc: GameComponent) => gc.name === childName);
	}
}