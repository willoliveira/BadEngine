import { Transform } from './Transform';
import { GameComponent } from './GameComponent';
import { GameEngine } from '../Engine/GameEngine';
import { EventEmitter } from 'events';
import { Sprite } from '../Sprite/Sprite';

export class Component {

	public parent: GameComponent;

	constructor() { }

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