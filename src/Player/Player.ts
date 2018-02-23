import { Position } from "../_base/position.interface";

export interface Character {

	position: Position;
}

export class Player {

	// position: Position;
	// layer: number;

	constructor(public position: Position, public layer: number) { }
}