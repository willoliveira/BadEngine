import { Component } from "../_base/Component";
import { Camera } from "../Camera/Camera";

import { EventEmitter } from 'events';

/**
* TODO: super provisório, depois investir um tempo pra chegar em um lance legal aqui
*/
export class GameEngine {

	public static FPS: number = 60;
	public static Camera: Camera;
	public static Event: GameEvents;

	private event: GameEvents;

	constructor() {
		GameEngine.Event = this.event =new GameEvents();

		this.event.setMaxListeners(1000);
	}

	StartFrame() {
		requestAnimationFrame(this.loop.bind(this));
	}

	private loop() {
		this.event.emit('TICK', { type: 'TICK' });
		requestAnimationFrame(this.loop.bind(this));
	}
}

class GameEvents extends EventEmitter {

	private queuedEvents: Array<any> = [];

	public dispatch(action: any) {
		if (action && action.type !== 'TICK') {
			this.queuedEvents.push(action);
		} else {
			if (this.queuedEvents.length) {
				let action = this.queuedEvents.shift();
			}

		}
		this.emit(action.type, ...action);
	}
}