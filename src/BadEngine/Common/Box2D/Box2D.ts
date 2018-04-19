import { Component } from "../../Base/Component/Component";
import { Vector2 } from "../../Base/Math/components/Vector2/Vector2";
import { Rect } from "../../Base/Math/models/Rect";

export class Box2D extends Component {

	public offset: Vector2 = new Vector2(0, 0);
	public size: Vector2 = new Vector2(1, 1);
	public rect: Rect;

	public isTrigger: boolean = false;

	public isCollider: boolean = false;
}