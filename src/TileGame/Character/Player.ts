import { GameComponent } from "../../BadEngine/Base/GameCmponent/GameComponent";
import { Vector2 } from "../../BadEngine/Base/Math/components/Vector2/Vector2";
import { Sprite } from "../../BadEngine/Common/Sprite/Sprite";
import { CameraFollow } from "../Camera/CameraFollow";
import { Transform } from "../../BadEngine/Base/Transform/Transform";
import { GameEngine } from "../../BadEngine/Base/GameEngine";
import { Direction } from "../../BadEngine/Base/models/position.interface";
import { KeyboardInput } from "../../BadEngine/Common/Events/KeyboardInput";
import { Animation } from "../../BadEngine/Common/Animation/Animation";
import { Component } from "../../BadEngine/Base/Component/Component";

export class Player extends Component {

	private dir = { x: Direction.Idle, y: Direction.Idle };
	private velocity: Vector2 = new Vector2(5, 5);

	private spriteComponent: Sprite;
	private gameComponentCamera: GameComponent;
	private cameraFollow: CameraFollow;
	private animation: Animation;


	Awake() {
		this.gameComponentCamera = GameEngine.Camera.parent as GameComponent
		this.cameraFollow = this.gameComponentCamera.getComponent('CameraFollow') as CameraFollow;
		this.spriteComponent = this.parent.getComponent('Sprite') as Sprite;
		this.animation = this.parent.getComponent('Animation') as Animation;

		window.addEventListener("keyup", this.onKeyUp.bind(this));
	}

	// TODO: Provisório
	private onKeyUp() {
		if (this.dir.x === 0) {
			if (this.animation.currentState.name === "run-down") {
				this.animation.setState("idle-down");
			} else if (this.animation.currentState.name === "run-up") {
				this.animation.setState("idle-up");
			}
		}
		else if (this.dir.y === 0) {
			if (this.animation.currentState.name === "run-right") {
				this.animation.setState("idle-right");
			} else if (this.animation.currentState.name === "run-left") {
				this.animation.setState("idle-left");
			}
		}

		this.dir = { x: Direction.Idle, y: Direction.Idle };
	}

	Update() {
		this.dir = { x: Direction.Idle, y: Direction.Idle };

		if (KeyboardInput.GetKeyDown("ArrowLeft")) {
			this.animation.setState("run-left");
			this.dir.x = -1;
		}
		else if (KeyboardInput.GetKeyDown("ArrowRight")) {
			this.animation.setState("run-right");
			this.dir.x = 1;
		}

		if (KeyboardInput.GetKeyDown("ArrowDown")) {
			this.animation.setState("run-down");
			this.dir.y = 1;
		}
		else if (KeyboardInput.GetKeyDown("ArrowUp")) {
			this.animation.setState("run-up");
			this.dir.y = -1;
		}

		this.parent.transform.position.x += this.dir.x * this.velocity.x;
		this.parent.transform.position.y += this.dir.y * this.velocity.y;
	}
}