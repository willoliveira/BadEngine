import { EventEmitter } from 'events';
import { Camera } from '../Common/Camera/Camera';
import { Component } from './Component/Component';
import { Sprite } from '../Common/Sprite/Sprite';
import { GameComponent } from './GameCmponent/GameComponent';
import { Box2D } from '../Common/Box2D/Box2D';
import { Transform } from './Transform/Transform';


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

	public static getComponents(type?: string): Array<Component> {
		if (type) {
			return Object.keys(GameEngine._components)
				.map((componentId) => GameEngine._components[componentId])
				.filter(comp => comp.constructor.name === type);
		}
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
	private _box2D: Array<Box2D> = [ ];

	constructor(public gameEngineInstance: GameEngine) {
		super();

		this.setMaxListeners(1000);
		this.on('TICK', this.tick.bind(this));
	}

	StartFrame() {
		if (!this.gameEngineInstance.isRunning()) {
			this.gameEngineInstance.Run();

			this._sprites = GameEngine.getComponents("Sprite").sort(filterByOrderRender) as Array<Sprite>;
			this._box2D = GameEngine.getComponents("Box2D").sort(filterByOrderRender) as Array<Box2D>;

			{
				const box1: Box2D = this._box2D[0];
				const box1Transform: Transform = this._box2D[0].parent.getComponent("Transform") as Transform;

				const box2: Box2D = this._box2D[1];
				const box2Transform: Transform = this._box2D[1].parent.getComponent("Transform") as Transform;

				console.log(box2Transform.position.x - box1Transform.position.x - box2.size.x / 2 - box1.size.x / 2);
			}


			this.dispatch({ type: "AWAKE" });
			requestAnimationFrame(this.loop.bind(this));
		}
	}

	private loop() {
		this.dispatch({ type: 'TICK' });

		this._sprites.forEach((sprite: Sprite) => sprite.OnRender());

		// console.log(GameEngine.getComponents())

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