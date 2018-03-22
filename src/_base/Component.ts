import { Transform } from './Transform';
import { GameComponent } from './GameComponent';

export class Component {

	public parent: GameComponent;

	Awake() { }

	OnEnable() { }

	Start() { }


	FixedUpdate() { }

	Update() { }


	OnRender() { }


	OnDisable() { }

	OnDestroy() { }
}