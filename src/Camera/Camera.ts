import { Player } from "../Player/Player";

export class Camera {

	public center: boolean = true;

	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		public target?: Player,
		public limitBorder?: { width: number, height: number } // TODO: Super provisório
	) { }


	Follow() {
		if (!this.target) return;

		if (this.center) {
			this.x = this.target.position.x - (this.width / 2);
			this.y = this.target.position.y - (this.height / 2);
		}

		if (this.limitBorder) {
			if (this.x < 0) this.x = 0;
			if (this.y < 0) this.y = 0;

			if (this.x + this.width > this.limitBorder.width) {
				this.x = this.limitBorder.width - this.width;
			}
			if (this.y + this.height > this.limitBorder.height) {
				this.y = this.limitBorder.height - this.height;
			}
		}
	}
}