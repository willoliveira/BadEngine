import { GameComponent } from "../_base/GameComponent";
import { Transform } from "../_base/Transform";
import { Camera } from "../Camera/Camera";
import { Sprite } from "../Sprite/Sprite";
import { GameEngine } from "../Engine/GameEngine";
import { TileMapLayer } from "./TileMapLayer";

/*
 * Isso irá ter uma coleção mapa de Tiles.
 * A cada layer, a ideia que seja um componente de Tile
 */
export class TileMap extends GameComponent {

	constructor() {
		super(new Transform());
	}
}