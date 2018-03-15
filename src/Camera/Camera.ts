import { Player } from "../Character/Player";
import { Transform } from "../_base/Transform";
import { GameComponent } from "../_base/GameComponent";

export class Camera extends GameComponent {

	public static instance: Camera;

	constructor(transform: Transform) {
		super(transform);

		Camera.instance = this;
	}
}