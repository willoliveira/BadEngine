import { Component } from "../../BadEngine/Base/Component/Component";
import { Transform } from "../../BadEngine/Base/Transform/Transform";
import { Camera } from "../../BadEngine/Common/Camera/Camera";
import { GameComponent } from "../../BadEngine/Base/GameCmponent/GameComponent";
import { GameEngine } from "../../BadEngine/Base/GameEngine";

export class CameraFollow extends Component {

	private transform: Transform;
	private camera: Camera;

	public center: boolean = true;

	constructor(
		public target?: GameComponent,
		public limitBorder?: { width: number, height: number }
	) {
		super();
	}

	Awake() {
		this.transform = this.parent.getComponent('Transform') as Transform;
		this.camera = GameEngine.Camera;
	}

	FixedUpdate() {
		this.Follow();
	}

	Follow() {
		if (!this.target) return;

		if (this.center) {
			this.transform.position.x = this.target.transform.position.x - Math.floor(this.camera.viewportRect.width / 2);
			this.transform.position.y = this.target.transform.position.y - Math.floor(this.camera.viewportRect.height / 2);
		}

		if (this.limitBorder) {
			if (this.transform.position.x < 0) this.transform.position.x = 0;
			if (this.transform.position.y < 0) this.transform.position.y = 0;

			if (this.transform.position.x + this.camera.viewportRect.width > this.limitBorder.width) {
				this.transform.position.x = this.limitBorder.width - this.camera.viewportRect.width;
			}
			if (this.transform.position.y + this.camera.viewportRect.height > this.limitBorder.height) {
				this.transform.position.y = this.limitBorder.height - this.camera.viewportRect.height;
			}
		}
	}

}