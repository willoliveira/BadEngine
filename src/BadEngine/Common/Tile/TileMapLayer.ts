import { GameComponent } from "../../Base/GameCmponent/GameComponent";
import { Sprite } from "../Sprite/Sprite";
import { Transform } from "../../Base/Transform/Transform";
import { GameEngine } from "../../Base/GameEngine";
import { Camera } from "../Camera/Camera";

/**
* Seria um unico mapa de Tile
*/
export class TileMapLayer extends GameComponent {

	private gameComponentCamera: GameComponent;
	private ctx: CanvasRenderingContext2D;

	spriteComponent: Sprite;

	constructor(
		public tileSize: number,
		public mapLayers: Array<Array<number>>,
		public blankImage: any // TODO: ficou ruim isso, depois rever
	) {
		super(new Transform());
	}


	Awake() {
		this.gameComponentCamera = GameEngine.Camera.parent as GameComponent

		this.spriteComponent = this.getComponent('Sprite') as Sprite;
		this.spriteComponent.sprite.canvas.width = Camera.canvas.width;
		this.spriteComponent.sprite.canvas.height = Camera.canvas.height;
		this.ctx = this.spriteComponent.sprite.canvas.getContext('2d');
	}

	/**
	 * Trocar esse lance pra outra coisa...
	 * Fazer só o sprite fazer render...
	 */
	Update() {
		let rowLen = Math.floor(GameEngine.Camera.viewportRect.height/64);
		let colLen = Math.floor(GameEngine.Camera.viewportRect.width/64);

		let sumPosX = this.gameComponentCamera.transform.position.x - (Math.floor(this.gameComponentCamera.transform.position.x/this.tileSize) * this.tileSize);
		let sumPosY = this.gameComponentCamera.transform.position.y - (Math.floor(this.gameComponentCamera.transform.position.y/this.tileSize) * this.tileSize);

		for (let row = 0; row < rowLen + 1; row++) {
			for (let col = 0; col < colLen + 1; col++) {
				let posY = Math.floor(this.gameComponentCamera.transform.position.y/this.tileSize) + row;
				let posX = Math.floor(this.gameComponentCamera.transform.position.x/this.tileSize) + col;

				let imageSrc, widthSrc, heightSrc, widthDist, heightDist;

				widthDist = col * this.tileSize;
				heightDist = row * this.tileSize;
				// TODO: Depois ver de pintar com hexa ao inves de imagem
				if (posX < 0 || posY < 0 || posX >= this.mapLayers[0].length || posY >= this.mapLayers.length) {
					imageSrc = this.blankImage;
					widthSrc = 0;
					heightSrc = 0;
				} else {
					let tileNum = this.mapLayers[posY][posX];
					if (tileNum === 0) continue;
					imageSrc = this.spriteComponent.sprite.image;
					widthSrc = ((tileNum - 1) % (this.spriteComponent.sprite.image.width / this.tileSize));
					heightSrc = Math.floor((tileNum- 1) / (this.spriteComponent.sprite.image.width / this.tileSize));
				}

				this.ctx.drawImage(
					imageSrc,
					// na imagem
					widthSrc * this.tileSize, heightSrc * this.tileSize,
					this.tileSize, this.tileSize,

					//no canvas
					(col  * this.tileSize) - sumPosX, (row * this.tileSize) - sumPosY,
					this.tileSize, this.tileSize
				);
			}
		}
	}
}