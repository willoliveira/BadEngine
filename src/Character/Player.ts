import { Position, Direction } from "../_base/interface/position.interface";
import { Transform } from "../_base/Transform";
import { GameComponent } from "../_base/GameComponent";
import { Sprite } from "../Sprite/Sprite";
import { Camera } from "../Camera/Camera";
import { CameraFollow } from "../Camera/CameraFollow";
import { GameEngine } from "../Engine/GameEngine";
import { Animation, AnimationState } from "../Animation/Animation";
import { KeyboardInput } from "../Events/KeyboardInput";
import { Vector2 } from "../_base/Math/Vector2";

export class Player extends GameComponent {

	private velocity: Vector2 = new Vector2(5, 5);

	private spriteComponent: Sprite;
	private cFollow: CameraFollow;
	private animation: Animation;

	constructor(public transform: Transform, public layer: number) {
		super(transform);
	}

	Awake() {
		this.spriteComponent = this.getComponent(Sprite) as Sprite;
		this.cFollow = Camera.instance.getComponent(CameraFollow) as CameraFollow;
		this.animation = this.getComponent(Animation) as Animation;
	}

	FixedUpdate() {
		const dir = { x: Direction.Idle, y: Direction.Idle };

		if (KeyboardInput.GetKeyDown("ArrowLeft")) {
			if (this.animation) {
				this.animation.setState("run-left");
			}
			dir.x = -1;
		}
		else if (KeyboardInput.GetKeyDown("ArrowRight")) {
			if (this.animation) {
				this.animation.setState("run-right");
			}
			dir.x = 1;
		}

		if (KeyboardInput.GetKeyDown("ArrowDown")) {
			if (this.animation) {
				this.animation.setState("run-down");
			}
			dir.y = 1;
		}
		else if (KeyboardInput.GetKeyDown("ArrowUp")) {
			if (this.animation) {
				this.animation.setState("run-up");
			}
			dir.y = -1;
		}


		this.transform.x += dir.x * this.velocity.x;
		this.transform.y += dir.y * this.velocity.y;
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
		);
	}
}