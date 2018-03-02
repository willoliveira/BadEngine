import { Component } from '../_base/Component';

export class SpriteComponent extends Component {

	public sprite: any;
	public flip: string;
	public sortingLayer: string;
	public orderInLayer: number;

	constructor() {
		super();
	}
}