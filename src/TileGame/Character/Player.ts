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

// import { Position, Direction } from "../_base/interface/position.interface";
// import { Transform } from "../_base/Transform";
// import { GameComponent } from "../_base/GameComponent";
// import { Sprite } from "../Sprite/Sprite";
// import { Camera } from "../Camera/Camera";
// import { CameraFollow } from "../Camera/CameraFollow";
// import { GameEngine } from "../Engine/GameEngine";
// import { Animation, AnimationState } from "../Animation/Animation";
// import { KeyboardInput } from "../Events/KeyboardInput";
// import { Vector2 } from "../_base/Math/Vector2";

export class Player extends Component {

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
	}

	FixedUpdate() {
		const dir = { x: Direction.Idle, y: Direction.Idle };

		if (KeyboardInput.GetKeyDown("ArrowLeft")) {
			this.animation.setState("run-left");
			dir.x = -1;
		}
		else if (KeyboardInput.GetKeyDown("ArrowRight")) {
			this.animation.setState("run-right");
			dir.x = 1;
		}

		if (KeyboardInput.GetKeyDown("ArrowDown")) {
			this.animation.setState("run-down");
			dir.y = 1;
		}
		else if (KeyboardInput.GetKeyDown("ArrowUp")) {
			this.animation.setState("run-up");
			dir.y = -1;
		}

		// if (KeyboardInput.GetKeyUp("ArrowDown")) {
		// 	this.animation.setState("idle-down");
		// } else if (KeyboardInput.GetKeyUp("ArrowUp")) {
		// 	this.animation.setState("idle-up");
		// }

		// if (KeyboardInput.GetKeyUp("ArrowRight")) {
		// 	this.animation.setState("idle-right");
		// }
		// else if (KeyboardInput.GetKeyUp("ArrowLeft")) {
		// 	this.animation.setState("idle-left");
		// }

		this.parent.transform.position.x += dir.x * this.velocity.x;
		this.parent.transform.position.y += dir.y * this.velocity.y;
	}
}