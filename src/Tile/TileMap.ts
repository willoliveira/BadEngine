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

	public transform: Transform;
	private camera: Camera;

	constructor(
		public tileSet: any,
		public tileSize: number,
		public mapLayers: Array<Array<Array<number>>>,
		public mapCollisions: Array<Array<number>>,
		public blankImage: any // TODO: ficou ruim isso, depois rever
	) {
		super(new Transform(0, 0, 832, 832));
	}

	Awake() {
		for (let layer = 0; layer < this.mapLayers.length; layer++) {
			// TODO: Talvez, fazer um esquema de filho no Hierarchy aqui, e não adicionar como componente
			let tileMapLayer: TileMapLayer = new TileMapLayer(this.tileSize, this.mapLayers[layer], this.blankImage);
			let tileMapLayerSprite: Sprite = new Sprite(this.tileSet);
			tileMapLayerSprite.layer = layer;
			tileMapLayerSprite.orderInLayer = 0;

			tileMapLayer.addComponent(tileMapLayerSprite);
			tileMapLayer.Awake();

			this.addComponent(tileMapLayer);
		}
	}
}