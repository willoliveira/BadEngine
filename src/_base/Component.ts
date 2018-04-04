import { Transform } from './Transform';
import { GameComponent } from './GameComponent';
import { GameEngine } from '../Engine/GameEngine';
import { EventEmitter } from 'events';
import { Sprite } from '../Sprite/Sprite';

export class Component {

	public parent: GameComponent;

	constructor() {
		GameEngine.Event.on('TICK', this.handlerEvents.bind(this));
		GameEngine.Event.on('LIFECYCLE', this.handlerEvents.bind(this));
	}


	private hasSprite(): boolean {
		return this.constructor.name === "Sprite" || !!(this.parent && this.parent.getComponent('Sprite'))
	}

	private handlerEvents(event: any) {
		if (event.type === 'TICK') {
			// console.log('hasSprite')
			 GameEngine.Event.emit('LIFECYCLE', { type: 'LIFECYCLE', name: 'FixedUpdate' });
			 GameEngine.Event.emit('LIFECYCLE', { type: 'LIFECYCLE', name: 'Update' });

			if (this.hasSprite()) {
				 GameEngine.Event.emit('LIFECYCLE', { type: 'LIFECYCLE', name: 'OnRender' });
			}

		} else {
			switch(event.name) {
				case 'Update':
					this.Update.call(this);
					break;

				case 'FixedUpdate':
					this.FixedUpdate.call(this);
					break;

				case 'OnRender':
					this.OnRender.call(this);
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