import { Position } from "../_base/interface/position.interface";
import { Transform } from "../_base/Transform";
import { GameComponent } from "../_base/GameComponent";

export class Player extends GameComponent {

	constructor(public trasnform: Transform, public layer: number) {
		super(trasnform);
	}
}