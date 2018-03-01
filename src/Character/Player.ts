import { Position } from "../_base/interface/position.interface";
import { Trasnform } from "../_base/Transform";
import { GameComponent } from "../_base/GameComponent";

export class Player extends GameComponent {

	constructor(public trasnform: Trasnform, public layer: number) {
		super();
	}
}