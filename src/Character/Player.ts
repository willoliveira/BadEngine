import { Position } from "../_base/position.interface";
import { Trasnform } from "../_base/Transform";


export class Player {

	constructor(public trasnform: Trasnform, public layer: number) { }
}