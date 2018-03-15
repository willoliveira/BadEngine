import { Position } from "../_base/interface/position.interface";
import { Transform } from "../_base/Transform";
import { GameComponent } from "../_base/GameComponent";
import { Sprite } from "../Sprite/Sprite";
import { Camera } from "../Camera/Camera";
import { CameraFollow } from "../Camera/CameraFollow";
import { GameEngine } from "../Engine/GameEngine";
import { Animation, AnimationState } from "../Animation/Animation";

export class Player extends GameComponent {

	private spriteComponent: Sprite;
	private cFollow: CameraFollow;
	private animation: Animation;

	// tirar daqui depois
	// Megaman
	// states: Array<AnimationState> = [
	// 	{
	// 		default: true,
	// 		name: "idle",
	// 		frames: [
	// 			{ rect: { y: 0, x: 0, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 0, x: 36, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 0, x: 72, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 0, x: 108, width: 36, height: 36 }, image: 'megaman', delay: 7 }
	// 		]
	// 	}, {
	// 		default: false,
	// 		name: "run",
	// 		frames: [
	// 			{ rect: { y: 35, x: 0, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 35, x: 36, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 35, x: 72, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 35, x: 108, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 35, x: 144, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 35, x: 180, width: 36, height: 36 }, image: 'megaman', delay: 7 },
	// 			{ rect: { y: 35, x: 216, width: 36, height: 36 }, image: 'megaman', delay: 7 }
	// 		]
	// 	}
	// ];
	//link
	states: Array<AnimationState> = [
		{
			default: true,
			name: "idle",
			frames: [
				{ rect: { y: 0, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 100 },
				{ rect: { y: 0, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 0, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 0, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 150 },
				{ rect: { y: 0, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 0, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 }
			]
		}, {
			default: false,
			name: "run-vertical",
			frames: [
				{ rect: { y: 443, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 306, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 408, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 510, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 612, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 714, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 816, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 443, x: 918, width: 102, height: 110.5 }, image: 'link', delay: 5 }
			]
		}, {
			default: false,
			name: "run-horizontal",
			frames: [
				{ rect: { y: 773.5, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 306, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 408, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 510, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 612, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 714, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 816, width: 102, height: 110.5 }, image: 'link', delay: 5 },
				{ rect: { y: 773.5, x: 918, width: 102, height: 110.5 }, image: 'link', delay: 5 }
			]
		}
	];

	constructor(public transform: Transform, public layer: number) {
		super(transform);
	}

	Awake() {
		this.spriteComponent = this.getComponent("Sprite") as Sprite;
		this.cFollow = Camera.instance.getComponent("CameraFollow") as CameraFollow;
		this.animation = this.getComponent("Animation") as Animation;

		this.animation.animationStates = this.states;
	}

	Update() {
		this.spriteComponent.sprite.destRect = {
			x: ((Camera.instance.transform.x * -1) + this.cFollow.target.transform.x),
			y: ((Camera.instance.transform.y * -1)  + this.cFollow.target.transform.y),
			width: 64,
			height: 64
		}
	}

	/**
	 * TODO: Tentar transferir essa logica para outro lugar
	 * Sprite ou o base
	 */
	OnRender() {
		let srcRect = this.spriteComponent.sprite.sourceRect;
		let destRect = this.spriteComponent.sprite.destRect;

		GameEngine.instance.context2D.drawImage(
			this.spriteComponent.sprite.image,

			srcRect.x, srcRect.y,
			srcRect.width, srcRect.height,

			destRect.x, destRect.y,
			destRect.width, destRect.height
		)

		// console.log(srcRect, destRect)
	}
}