import { GameEngine } from "../GameEngine";
import { GameComponent } from "../GameCmponent/GameComponent";

let _counterComponents: number = 0;

export class Component {
	private _parent: string;
	private _id: string;

	constructor() {
		this._id = `Component_${_counterComponents++}`;

		GameEngine.addComponent(this);
	}

	//TODO: Avaliar esses eventos
	public registerEvents() {
		GameEngine.Event.on("AWAKE", this.Awake.bind(this));
		GameEngine.Event.on("ON_ENABLE", this.OnEnable.bind(this));
		GameEngine.Event.on("START", this.Start.bind(this));

		GameEngine.Event.on("UPDATE", this.Update.bind(this));
		// GameEngine.Event.on("ON_RENDER", this.OnRender.bind(this));

		GameEngine.Event.on("ON_DISABLE", this.OnDisable.bind(this));
		GameEngine.Event.on("ON_DESTROY", this.OnDestroy.bind(this));
	}

	get parent(): GameComponent {
		return GameEngine.getComponent(this._parent) as GameComponent;
	}

	set parent(value: GameComponent) {
		this._parent = value.id;
	}

	get id(): string {
		return this._id;
	}

	public Awake() { }

	public OnEnable() { }

	public Start() { }


	public Update() { }

	public OnRender() { }


	public OnDisable() { }

	public OnDestroy() { }
}