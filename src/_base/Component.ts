import { Transform } from './Transform';
import { GameComponent } from './GameComponent';
import { GameEngine } from '../Engine/GameEngine';
import { EventEmitter } from 'events';
import { Sprite } from '../Sprite/Sprite';

let _counterComponents: number = 0;

export class Component {
	private _parent: string;
	private _id: string;

	constructor() {
		this._id = `Component_${_counterComponents}`;
		_counterComponents += 1;

		GameEngine.components.push(this);
	}

	get parent(): GameComponent {
		return GameEngine.components.find((gc: GameComponent) => gc._id === this._parent) as GameComponent;
	}

	set parent(value: GameComponent) {
		this._parent = value.id;
	}

	get id(): string {
		return this._id;
	}

	private hasSprite(): boolean {
		return this.constructor.name === "Sprite" || !!(this.parent && this.parent.getComponent('Sprite'))
	}

	public Awake() { }

	public OnEnable() { }

	public Start() { }


	public FixedUpdate() { }

	public Update() { }

	public OnRender() { }


	public OnDisable() { }

	public OnDestroy() { }
}