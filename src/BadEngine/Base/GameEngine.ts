import { EventEmitter } from 'events';
import { Camera } from '../Common/Camera/Camera';
import { Component } from './Component/Component';
import { Sprite } from '../Common/Sprite/Sprite';
import { GameComponent } from './GameCmponent/GameComponent';


const sprites: Array<string> = [];
/**
* TODO: Algumas coisas ficaram meio feias, depois fazer um diagrama e tentar melhor
*/
export class GameEngine {

	private static _components: { [key: string] : Component } = { };
	private _componentsInScene: Array<string> = [];
	private event: GameEvents;
	private _running: boolean = false;

	public static FPS: number = 60;
	public static Camera: Camera;
	public static Event: GameEvents;


	constructor() {
		GameEngine.Event = this.event = new GameEvents(this);
	}

	public static addComponent(component: Component) {
		GameEngine._components[component.id] = component;


	}

	public static getComponent(componentId: string): Component {
		return GameEngine._components[componentId];
	}

	public static getComponents(): Array<Component> {
		return Object.keys(GameEngine._components).map((componentId) => GameEngine._components[componentId]);
	}

	public static getSprites(): Array<Sprite> {
		return this.getComponents().filter((gc: any) => gc.constructor.name === 'Sprite') as Array<Sprite>;
	}

	public addToHierarchy(...args: Array<Component>) {
		// TODO: Checar integridade desse metodo
		this._componentsInScene = this._componentsInScene.concat(args.reduce(AllComponentsIds, []));
		//TODO: Não vai ser ser assim se pa, provisorio
		this._componentsInScene.forEach((componentId: string) => {
			GameEngine.getComponent(componentId).registerEvents();

			if (this.isRunning()) {
				GameEngine.getComponent(componentId).Awake();
			}
		});
	}


	public isRunning(): boolean {
		return this._running;
	}

	public Run() {
		this._running = true;
	}

}

class GameEvents extends EventEmitter {

	// TODO: Fazer ainda
	private queuedActions: Array<any> = [];
	private _sprites: Array<Sprite> = [ ];

	constructor(public gameEngineInstance: GameEngine) {
		super();

		this.setMaxListeners(1000);
		this.on('TICK', this.tick.bind(this));
	}

	StartFrame() {
		if (!this.gameEngineInstance.isRunning()) {
			this.gameEngineInstance.Run();

			this._sprites = GameEngine.getSprites().sort(filterByOrderRender);

			this.dispatch({ type: "AWAKE" });
			requestAnimationFrame(this.loop.bind(this));
		}
	}

	private loop() {
		this.dispatch({ type: 'TICK' });

		this._sprites.forEach((sprite: Sprite) => sprite.OnRender());

		requestAnimationFrame(this.loop.bind(this));
	}


	public dispatch(action: any) {
		if (action) {
			this.emit(action.type, action);
		}
	}

	public tick() {
		this.dispatch({ type: 'UPDATE' });
	}
}

function filterByOrderRender(a: Sprite, b: Sprite) {
	if (a.layer > b.layer) return 1;
	else if (a.layer < b.layer) return -1;
	else {
		if (a.orderInLayer > b.orderInLayer) return 1;
		if (a.orderInLayer < b.orderInLayer) return -1;
	}
}

function AllComponentsIds(before: Array<any>, current: GameComponent) {
	before.push(current.id);
	if (current.components && current.components.length) {
		before = before.concat( current.components.map((c: Component) => c.id) );
	}
	if (current.children && current.children.length) {
		before = before.concat(current.children.reduce(AllComponentsIds, []));
	}
	return before;
}