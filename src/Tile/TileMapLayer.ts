import { Component } from "../_base/Component";
import { GameComponent } from "../_base/GameComponent";
import { Transform } from "../_base/Transform";
import { Sprite } from "../Sprite/Sprite";
import { Camera } from "../Camera/Camera";
import { GameEngine } from "../Engine/GameEngine";

/**
* Seria um unico mapa de Tile
*/
export class TileMapLayer extends GameComponent {

	tileSet: Sprite;

	beforeX = 0;
	currentX = 0;

	constructor(
		public tileSize: number,
		public mapLayers: Array<Array<number>>,
		public blankImage: any // TODO: ficou ruim isso, depois rever
	) {
		super(new Transform(0, 0, 1 , 1));
	}


	Awake() {
		this.tileSet = this.getComponent("Sprite") as Sprite;
	}

	OnRender() {
		let rowLen = Math.floor(Camera.instance.transform.height/64);
		let colLen = Math.floor(Camera.instance.transform.width/64);

		let sumPosX = Camera.instance.transform.x - (Math.floor(Camera.instance.transform.x/this.tileSize) * this.tileSize);
		let sumPosY = Camera.instance.transform.y - (Math.floor(Camera.instance.transform.y/this.tileSize) * this.tileSize);

		for (let row = 0; row < rowLen + 1; row++) {
			for (let col = 0; col < colLen + 1; col++) {
				let posY = Math.floor(Camera.instance.transform.y/this.tileSize) + row;
				let posX = Math.floor(Camera.instance.transform.x/this.tileSize) + col;

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
					imageSrc = this.tileSet.sprite.image;
					widthSrc = ((tileNum - 1) % (this.tileSet.sprite.image.width / this.tileSize));
					heightSrc = Math.floor((tileNum- 1) / (this.tileSet.sprite.image.width / this.tileSize));
				}

				GameEngine.instance.context2D.drawImage(
					imageSrc,
					// na imagem
					widthSrc * this.tileSize, heightSrc * this.tileSize,
					this.tileSize, this.tileSize,

					//no canvas
					(col  * this.tileSize) - sumPosX, (row * this.tileSize) - sumPosY,
					this.tileSize, this.tileSize);
				}
			}
		}
	}