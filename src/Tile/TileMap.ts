import { GameComponent } from "../_base/GameComponent";
import { Transform } from "../_base/Transform";

/*
 * Isso irá ter uma coleção mapa de Tiles.
 * A cada layer, a ideia que seja um componente de Tile
 */
export class TileMap extends GameComponent {

	public transform: Transform;

	constructor(
		public tileSet: any,
		public tileSize: number,
		public mapLayers: Array<Array<Array<number>>>,
		public mapCollisions: Array<Array<number>>
	) {
		super(new Transform(0, 0, 1920, 1080));
	}
}