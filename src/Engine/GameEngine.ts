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
	public static components: Array<Component> = [];

	private event: GameEvents;

	constructor() {
		GameEngine.Event = this.event = new GameEvents();

		this.event.setMaxListeners(1000);
	}

	StartFrame() {
		requestAnimationFrame(this.loop.bind(this));
	}

	private loop() {
		GameEngine.Event.dispatch({ type: 'TICK' });
		requestAnimationFrame(this.loop.bind(this));
	}
}

class GameEvents extends EventEmitter {

	private queuedActions: Array<any> = [];

	public dispatch(action: any | string) {
		if (action) {
			this.emit(action.type, ...action)
		}
	}
}