import { Component } from '../_base/Component';
import { GameEngine } from '../Engine/GameEngine';

export class Sprite extends Component {

	public backgroundColor: string;
	public flip: { x: boolean, y: boolean } = {
		x: false,
		y: false
	};
	public sortingLayer: string;
	public order: number;

	constructor(public sprite?: any) {
		super();
	}
}