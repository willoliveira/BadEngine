import { Component } from "../../Base/Component/Component";
import { Vector2 } from "../../Base/Math/components/Vector2/Vector2";

export class Box2D extends Component {

	public offset: Vector2 = new Vector2(1, 1);
	public size: Vector2 = new Vector2(1, 1);

	public isTrigger: boolean = false;
}