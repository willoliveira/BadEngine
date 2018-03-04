import { GameComponent } from "../_base/GameComponent";
import { Transform } from "../_base/Transform";
import { Camera } from "../Camera/Camera";
import { Sprite } from "../Sprite/Sprite";
import { GameEngine } from "../Engine/GameEngine";

/*
 * Isso irá ter uma coleção mapa de Tiles.
 * A cada layer, a ideia que seja um componente de Tile
 */
export class TileMap extends GameComponent {

	public transform: Transform;
	private camera: Camera;

	private tileSet: Sprite;

	constructor(
		public tileSize: number,
		public mapLayers: Array<Array<Array<number>>>,
		public mapCollisions: Array<Array<number>>,
		public blankImage: any // TODO: ficou ruim isso, depois rever
	) {
		super(new Transform(0, 0, 832, 832));
	}

	Awake() {
		this.tileSet = this.getComponent("Sprite") as Sprite;
	}

	OnRender() {
		for (let layer = 0; layer < this.mapLayers.length; layer++) {

			for (let row = 0; row < Camera.instance.transform.height; row++) {
				for (let col = 0; col < Camera.instance.transform.width; col++) {

					let posY = Camera.instance.transform.y + row;
					let posX = Camera.instance.transform.x + col;

					let imageSrc, widthSrc, heightSrc, widthDist, heightDist;

					widthDist = col * this.tileSize;
					heightDist = row * this.tileSize;

					if (posX < 0 || posY < 0 || posX >= this.mapLayers[0][0].length || posY >= this.mapLayers[0].length) {
						imageSrc = this.blankImage;
						widthSrc = 0;
						heightSrc = 0;
					} else {
						let tileNum = this.mapLayers[layer][posY][posX];
						imageSrc = this.tileSet.sprite;
						widthSrc = ((tileNum - 1) % (this.tileSet.sprite.width / this.tileSize));
						heightSrc = Math.floor((tileNum- 1) / (this.tileSet.sprite.width / this.tileSize));
					}

					// TODO: Tirar depois o personagem daqui
					// if (layer + 1 === player.layer) {
					// 	ctx.drawImage(
					// 		imageBlank,
					// 		0, 0,
					// 		this.tileSize, this.tileSize,

					// 		((Camera.instance.transform.x * -1) + Camera.instance.target.trasnform.x) * this.tileSize, ((Camera.instance.transform.y * -1)  + camera.target.trasnform.y) * this.tileSize,
					// 		this.tileSize, this.tileSize
					// 	)
					// }

					GameEngine.instance.context2D.drawImage(
						imageSrc,
						// na imagem
						widthSrc * this.tileSize, heightSrc * this.tileSize,
						this.tileSize, this.tileSize,

						//no canvas
						col * this.tileSize, row * this.tileSize,
						this.tileSize, this.tileSize);
				}
			}
		}
	}
}