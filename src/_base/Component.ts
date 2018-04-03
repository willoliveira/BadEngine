import { Transform } from './Transform';
import { GameComponent } from './GameComponent';
import { GameEngine } from '../Engine/GameEngine';
import { EventEmitter } from 'events';
import { Sprite } from '../Sprite/Sprite';

export class Component {

	public parent: GameComponent;
	public event: EventEmitter;

	constructor() {
		this.event = GameEngine.Event;
		this.event.on('TICK', this.handlerEvents.bind(this));
		this.event.on('LIFECYCLE', this.handlerEvents.bind(this));
	}


	private hasSprite() {
		if (this instanceof Sprite) return true;
		return !!this.parent.getComponent(Sprite);
	}

	private handlerEvents(event: any) {
		if (event.type === 'TICK') {
			this.event.emit('LIFECYCLE', { type: 'LIFECYCLE', name: 'FixedUpdate' });
			this.event.emit('LIFECYCLE', { type: 'LIFECYCLE', name: 'Update' });


			if (this.hasSprite()) {
				this.event.emit('LIFECYCLE', { type: 'LIFECYCLE', name: 'OnRender' });
			}

		} else {
			console.log(event.name);
			switch(event.name) {
				case 'Update':
					this.Update();
					break;

				case 'FixedUpdate':
					this.FixedUpdate();
					break;

				case 'OnRender':
					this.OnRender();
					break;
			}
		}
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