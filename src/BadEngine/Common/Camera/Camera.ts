import { Component } from "../../Base/Component/Component";
import { Rect } from "../../Base/Math/models/Rect";

export class Camera extends Component {

	private _viewportRect: Rect;

	public static canvas: HTMLCanvasElement;
	public static context2D: CanvasRenderingContext2D;

	constructor(stage?: string) {
		super();

		this.setStage(stage);
	}

	get viewportRect(): Rect {
		return this._viewportRect;
	}

	set viewportRect(v: Rect) {
		this._viewportRect = v;

		Camera.canvas.width =  v.width;
		Camera.canvas.height =  v.height;
	}

	private setStage(stageId: string) {
		if (!stageId) {
			console.warn("None canvas to renderer")
			return;
		}
		Camera.canvas = <HTMLCanvasElement> document.getElementById(stageId);
		Camera.context2D = Camera.canvas.getContext("2d");
	}
}