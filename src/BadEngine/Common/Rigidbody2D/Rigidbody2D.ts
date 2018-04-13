import { Component } from "../../Base/Component/Component";
import { Vector2 } from "../../Base/Math/components/Vector2/Vector2";

export interface PhysicMaterial {
	friction: number,
	bouciness: number
}

export class Rigidbody2D extends Component {

	public material: PhysicMaterial;
	public bodyType: 'Dynamic' | 'Kinematic';
	public mass: number;

	public addForce(force: Vector2) {
		return Vector2.div(force, this.mass);
	}
}