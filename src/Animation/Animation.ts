import { Component } from "../_base/Component";
import { GameComponent } from "../_base/GameComponent";
import { Sprite } from "../Sprite/Sprite";
import { GameEngine } from "../Engine/GameEngine";
import { Resources } from "../_base/Resources";

interface AnimationState {
	default: boolean,
	name: string,
	frames: Array<AnimationStateFrame>
}

interface AnimationStateFrame {
	y: number,
	x: number,
	width: number,
	height: number,
	delay: number,
	image: string
}

export class Animation extends Component {

	currentFrame = 0;
	currentFrameDelay = 0;
	currentState: AnimationState;

	spriteComponent: Sprite;
	//mock
	idleState: AnimationState = {
		default: true,
		name: "idle",
		frames: [
			{ y: 0, x: 0, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 0, x: 36, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 0, x: 72, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 0, x: 108, width: 36, height: 36, image: 'megaman', delay: 5 }
		]
	};

	runState: AnimationState = {
		default: false,
		name: "run",
		frames: [
			{ y: 36, x: 0, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 36, x: 36, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 36, x: 72, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 36, x: 108, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 36, x: 144, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 36, x: 180, width: 36, height: 36, image: 'megaman', delay: 5 },
			{ y: 36, x: 216, width: 36, height: 36, image: 'megaman', delay: 5 }
		]
	}

	animationStates: Array<AnimationState> = [this.idleState, this.runState];

	constructor() {
		super();

		this.currentState = this.animationStates.find(state => state.default);
	}

	setState(state: string) {
		this.currentState = this.animationStates.find(state => state.default);
	}

	Awake() {
		let parent = this.parent as GameComponent;
		this.spriteComponent = parent.getComponent("Sprite") as Sprite;

		this.spriteComponent.sprite = Resources[this.currentState.frames[this.currentFrame].image].file;
	}

	Update() {

		if (this.currentState.frames[this.currentFrame].delay === this.currentFrameDelay) {
			if (this.currentFrame + 1 > this.currentState.frames.length) {
				this.currentFrame = 0;
			} else {
				this.currentFrame += 1
			}
			this.spriteComponent.sprite.canvas.getContext("2d").drawImage(
				Resources[this.currentState.frames[this.currentFrame].image].file,

				this.currentState.frames[this.currentFrame].x * this.currentState.frames[this.currentFrame].width,
				this.currentState.frames[this.currentFrame].y * this.currentState.frames[this.currentFrame].height,
				this.currentState.frames[this.currentFrame].width, this.currentState.frames[this.currentFrame].height,

				0, 0, this.currentState.frames[this.currentFrame].width, this.currentState.frames[this.currentFrame].height
			);
		}

		this.currentFrameDelay += 1;
	}
}