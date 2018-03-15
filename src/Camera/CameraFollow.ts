import { Component } from "../_base/Component";
import { GameComponent } from "../_base/GameComponent";
import { Transform } from "../_base/Transform";

export class CameraFollow extends GameComponent {

	public center: boolean = true;

	constructor(
		public transform: Transform,
		public target?: GameComponent,
		public limitBorder?: { width: number, height: number }
	) {
		super(transform);
	}

	FixedUpdate() {
		this.Follow();
	}

	Follow() {
		if (!this.target) return;

		if (this.center) {
			this.transform.x = this.target.transform.x - Math.floor(this.transform.width / 2);
			this.transform.y = this.target.transform.y - Math.floor(this.transform.height / 2);
		}

		if (this.limitBorder) {
			if (this.transform.x < 0) this.transform.x = 0;
			if (this.transform.y < 0) this.transform.y = 0;

			if (this.transform.x + this.transform.width > this.limitBorder.width) {
				this.transform.x = this.limitBorder.width - this.transform.width;
			}
			if (this.transform.y + this.transform.height > this.limitBorder.height) {
				this.transform.y = this.limitBorder.height - this.transform.height;
			}
		}
	}

}