import { Component } from "../../Base/Component/Component";
import { Sprite } from "../Sprite/Sprite";
import { Resources } from "../Ressource/Resources";
import { GameComponent } from "../../Base/GameCmponent/GameComponent";

export interface AnimationState {
	default: boolean,
	name: string,
	frames: Array<AnimationStateFrame>
}

export interface AnimationStateFrame {
	rect: {
		y: number,
		x: number,
		width: number,
		height: number
	}
	delay: number,
	image: string
}

export class Animation extends Component {

	private currentFrame = 0;
	private currentFrameDelay = 0;
	private _animationStates: Array<AnimationState> = [ ];
	private spriteComponent: Sprite;

	public currentState: AnimationState;
	public animationController: any; // TODO: Fazer um controlador de transição de animações, penso em algo parecido com unity


	set animationStates(value: Array<AnimationState>) {
		this._animationStates = value;

		this.currentState = this._animationStates.find(state => state.default);
		// TODO: Aqui não será necessário mais tarde, obrigar sempre ter uma animação default
		if (!this.currentState) this.currentState = this._animationStates[0];

	}

	constructor() {
		super();
	}

	setState(stateName: string) {
		if (this.currentState.name === stateName) return;
		this.currentState = this._animationStates.find((state: AnimationState) => state.name === stateName);

		this.clearState();
		this.setAnimationFrame();
	}

	private clearState() {
		this.currentFrame = 0;
		this.currentFrameDelay = 0;
	}

	setAnimationFrame() {
		this.spriteComponent.sprite.sourceRect = this.currentState.frames[this.currentFrame].rect;

		// TODO: remover isso, e controlar o tamanho de outra forma, com o scale do Transform é uma possibilidade
		// this.spriteComponent.sprite.destRect.width = this.spriteComponent.sprite.sourceRect.width;
		// this.spriteComponent.sprite.destRect.height = this.spriteComponent.sprite.sourceRect.height;

		this.spriteComponent.sprite.image = Resources[this.currentState.frames[this.currentFrame].image].file;
	}

	Awake() {
		let parent = this.parent as GameComponent;
		this.spriteComponent = parent.getComponent('Sprite') as Sprite;

		this.setAnimationFrame();
	}

	Update() {
		if (!this._animationStates.length) return;
		if (this.currentState.frames[this.currentFrame].delay === this.currentFrameDelay) {
			if (this.currentFrame + 1 > this.currentState.frames.length - 1) {
				this.currentFrame = 0;
			} else {
				this.currentFrame += 1
			}
			this.currentFrameDelay = 0;

			this.setAnimationFrame();
		}

		this.currentFrameDelay += 1;
	}
}