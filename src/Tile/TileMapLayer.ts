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

	tileSet: any;

	constructor(
		public tileSize: number,
		public mapLayers: Array<Array<number>>,
		public blankImage: any // TODO: ficou ruim isso, depois rever
	) {
		super(new Transform(1,1,1,1));
	}


	Awake() {
		this.tileSet = this.getComponent("Sprite") as Sprite;
	}

	OnRender() {
		for (let row = 0; row < Camera.instance.transform.height; row++) {
			for (let col = 0; col < Camera.instance.transform.width; col++) {

				let posY = Camera.instance.transform.y + row;
				let posX = Camera.instance.transform.x + col;

				let imageSrc, widthSrc, heightSrc, widthDist, heightDist;

				widthDist = col * this.tileSize;
				heightDist = row * this.tileSize;

				if (posX < 0 || posY < 0 || posX >= this.mapLayers[0].length || posY >= this.mapLayers.length) {
					imageSrc = this.blankImage;
					widthSrc = 0;
					heightSrc = 0;
				} else {
					let tileNum = this.mapLayers[posY][posX];
					imageSrc = this.tileSet.sprite;
					widthSrc = ((tileNum - 1) % (this.tileSet.sprite.width / this.tileSize));
					heightSrc = Math.floor((tileNum- 1) / (this.tileSet.sprite.width / this.tileSize));
				}

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