import { Transform } from './Transform';
import { GameComponent } from './GameComponent';

export class Component {

	constructor() {
		this.Awake();
	}

	public parent: GameComponent | Component;

	Awake() { }

	OnEnable() { }

	Start() { }


	FixedUpdate() { }

	Update() { }


	onRender() { }


	OnDisable() { }

	OnDestroy() { }
}