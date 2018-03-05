import { Position } from "../_base/interface/position.interface";
import { Transform } from "../_base/Transform";
import { GameComponent } from "../_base/GameComponent";
import { Sprite } from "../Sprite/Sprite";
import { Camera } from "../Camera/Camera";
import { CameraFollow } from "../Camera/CameraFollow";
import { GameEngine } from "../Engine/GameEngine";

export class Player extends GameComponent {

	private spriteComponent: Sprite;
	private cFollow: CameraFollow;

	constructor(public transform: Transform, public layer: number) {
		super(transform);
	}

	Awake() {
		this.spriteComponent = this.getComponent("Sprite") as Sprite;

	}

	OnRender() {
		this.cFollow = Camera.instance.getComponent("CameraFollow") as CameraFollow;

		GameEngine.instance.context2D.drawImage(
			this.spriteComponent.sprite,
			0, 0,
			64, 64,

			((Camera.instance.transform.x * -1) + this.cFollow.target.transform.x) * 64, ((Camera.instance.transform.y * -1)  + this.cFollow.target.transform.y) * 64,
			64, 64
		)

	}
}