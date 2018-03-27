import { Vector2 } from "../../../../src/_base/Math/Vector2";

const mouse: Vector2 = new Vector2(0, 0);
const offeset: Vector2 = new Vector2(0, 0);


document.addEventListener("mousemove", function(evt) {
	// deixando o (0, 0) no centro, ao inves do canto superior esquerdo, para os testes sairem certo;
	mouse.x = evt.x + window.scrollX - offeset.x;
	mouse.y = evt.y + window.scrollY - offeset.y;
});

/**
* Exemplo 1.3: subtração vetorial
*/

const canvasVectorSub = <HTMLCanvasElement> document.getElementById("vector-sub");
const ctxVectorSub = canvasVectorSub.getContext("2d");

const center: Vector2 = new Vector2(canvasVectorSub.width / 2, canvasVectorSub.height / 2);

canvasVectorSub.addEventListener('mousemove', function(evt) {
	offeset.y = canvasVectorSub.offsetTop;
	offeset.x = canvasVectorSub.offsetLeft;

	mouse.sub(center);

	ctxVectorSub.clearRect(0, 0, canvasVectorSub.width, canvasVectorSub.height);

	ctxVectorSub.beginPath();
	ctxVectorSub.moveTo(canvasVectorSub.width / 2, canvasVectorSub.height / 2);
	ctxVectorSub.lineTo(center.x + mouse.x, center.y + mouse.y);
	ctxVectorSub.stroke();
});


/**
* Example 1.4: Multiplying a vector
*/

const canvasVectorMult = <HTMLCanvasElement> document.getElementById("vector-mult");
const ctxVectorMult = canvasVectorMult.getContext("2d");

canvasVectorMult.addEventListener('mousemove', function(evt) {
	offeset.y = canvasVectorMult.offsetTop;
	offeset.x = canvasVectorMult.offsetLeft;

	mouse.sub(center);
	mouse.mult(0.5);

	ctxVectorMult.clearRect(0, 0, canvasVectorMult.width, canvasVectorMult.height);

	ctxVectorMult.beginPath();
	ctxVectorMult.moveTo(center.x, center.y);
	ctxVectorMult.lineTo(center.x + mouse.x, center.y + mouse.y);
	ctxVectorMult.stroke();
})


/**
* Example 1.5: Vector magnitude
*/

const canvasVectorMag = <HTMLCanvasElement> document.getElementById("vector-magnitude");
const ctxVectorMag = canvasVectorMag.getContext("2d");

canvasVectorMag.addEventListener('mousemove', function(evt) {
	offeset.y = canvasVectorMag.offsetTop;
	offeset.x = canvasVectorMag.offsetLeft;

	mouse.sub(center);

	const mag = mouse.mag();

	ctxVectorMag.clearRect(0, 0, canvasVectorMag.width, canvasVectorMag.height);

	ctxVectorMag.beginPath();
	ctxVectorMag.rect(0, 0, mag, 10);
	ctxVectorMag.moveTo(center.x, center.y);
	ctxVectorMag.lineTo(center.x + mouse.x, center.y + mouse.y);
	ctxVectorMag.stroke();
})


/**
* Exemplo 1.6: Normalização de um vetor
*/

const canvasVectorNormalize = <HTMLCanvasElement> document.getElementById("vector-normalize");
const ctxVectorNormalize = canvasVectorNormalize.getContext("2d");

canvasVectorNormalize.addEventListener('mousemove', function(evt) {
	offeset.y = canvasVectorNormalize.offsetTop;
	offeset.x = canvasVectorNormalize.offsetLeft;

	mouse.sub(center);

	mouse.normalize();
	mouse.mult(50);

	ctxVectorNormalize.clearRect(0, 0, canvasVectorNormalize.width, canvasVectorNormalize.height);

	ctxVectorNormalize.beginPath();
	ctxVectorNormalize.moveTo(center.x, center.y);
	ctxVectorNormalize.lineTo(center.x + mouse.x, center.y + mouse.y);
	ctxVectorNormalize.stroke();
})





/**
* Exemplo 1.7: Motion 101 (velocidade)
*/
class Motion {

	width: number = canvasMotionVelocity.width;
	height: number = canvasMotionVelocity.height;

	constructor(
		public location: Vector2,
		public velocity: Vector2,
		public ctx: CanvasRenderingContext2D, w?: number, h?: number) {
			if(w) this.width = w;
			if(h) this.height = h;
		}

	update() { }

	display() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.beginPath();
		this.ctx.moveTo(50, 50);
		this.ctx.rect(this.location.x, this.location.y, 16, 16);
		this.ctx.stroke();
	}

	checkEdges() {
		if (this.location.x > this.width) {
			this.location.x = 0;
		} else if (this.location.x < 0) {
			this.location.x = this.width;
		}

		if (this.location.y > this.height) {
			this.location.y = 0;
		} else if (this.location.y < 0) {
			this.location.y = this.height;
		}
	}
}

const canvasMotionVelocity = <HTMLCanvasElement> document.getElementById("motion-velocity");
const ctxMotionVelocity = canvasMotionVelocity.getContext("2d");

class MotionVelocity extends Motion {

	update() {
		// Motion 101: Mudanças de localização por velocidade.
		this.location.add(this.velocity);
	}
}

const motionVelocity = new MotionVelocity(
	new Vector2(
		Math.floor(Math.random() * canvasMotionVelocity.width),
		Math.floor(Math.random() * canvasMotionVelocity.height)
	),
	new Vector2(2, 1),
	ctxMotionVelocity
);

/**
 * Exemplo 1.8: Movimento 101 (velocidade e aceleração constante)
 */
const canvasMotionConstVelocity = <HTMLCanvasElement> document.getElementById("motion-const-velocity");
const ctxMotionConstVelocity = canvasMotionConstVelocity.getContext("2d");

class MotionAcceleration extends Motion {

	acceleration: Vector2;
	topspeed: number;

	constructor(public location: Vector2, public velocity: Vector2, ctx: CanvasRenderingContext2D) {
		super(location, velocity, ctx);

		this.acceleration = new Vector2(-0.001, 0.01);
		this.topspeed = 10;
	}

	update() {
		this.velocity.add(this.acceleration);
    	this.velocity.limit(this.topspeed);
		this.location.add(this.velocity);
	}
}

const motionAcceleration = new MotionAcceleration(
	new Vector2(
		Math.floor(Math.random() * canvasMotionVelocity.width),
		Math.floor(Math.random() * canvasMotionVelocity.height)
	),
	new Vector2(0, 0),
	ctxMotionConstVelocity
);

/**
 * Exercício 1.5
 * Crie uma simulação de um carro (ou corredor) que acelere quando você pressiona a tecla para cima e os freios quando você pressiona a tecla para baixo.
 */
const canvasCar = <HTMLCanvasElement> document.getElementById("car");
const ctxCar = canvasCar.getContext("2d");

 class Car extends Motion {

	isAccelerating: Boolean = false;

	acceleration: Vector2;
	topspeed: number;

	constructor(public location: Vector2, public velocity: Vector2, ctx: CanvasRenderingContext2D) {
		super(location, velocity, ctx);

		this.acceleration = new Vector2(0.1, 0);
		this.topspeed = 10;

		window.addEventListener("keydown", this.onKeyDown.bind(this));
		window.addEventListener("keyup", this.onKeyUp.bind(this));
	}

	update() {
		if (!this.isAccelerating) {
			// TODO: Aqui ta errado se pa
			if (this.velocity.x !== 0) {
				if (this.velocity.x < 0) {
					this.velocity.add(this.acceleration);
				} else if (this.velocity.x > 0) {
					this.velocity.sub(this.acceleration);
				}
			}
		}

		this.location.add(this.velocity);
		this.velocity.limit(this.topspeed);
	}

	onKeyDown(evt: KeyboardEvent) {
		this.isAccelerating = true;
		//down
		if (evt.keyCode === 83) {
			this.velocity.sub(this.acceleration);
		}
		//up
		if (evt.keyCode === 87) {
			this.velocity.add(this.acceleration);
		}

	}

	onKeyUp() {
		this.isAccelerating = false;
	}

 }

 const car = new Car(
	new Vector2(
		Math.floor(canvasMotionVelocity.width / 2),
		Math.floor(canvasMotionVelocity.height / 2)
	),
	new Vector2(0, 0),
	ctxCar
);


/**
 * Exemplo 1.9: Movimento 101 (velocidade e aceleração constante)
 */
const canvasMotionRandomVelocity = <HTMLCanvasElement> document.getElementById("motion-random-velocity");
const ctxMotionRandomVelocity = canvasMotionRandomVelocity.getContext("2d");

class MotionRandomLocation extends Motion {

	acceleration: Vector2;
	topspeed: number;

	constructor(public location: Vector2, public velocity: Vector2, ctx: CanvasRenderingContext2D, w: number, h: number) {
		super(location, velocity, ctx, w, h);

		this.acceleration = new Vector2(0.001, 0.01);
		this.topspeed = 10;
	}

	update() {
		this.acceleration = Vector2.random2D();

		this.acceleration.mult(0.5);

		this.velocity.add(this.acceleration);
		this.velocity.limit(this.topspeed);
		this.location.add(this.velocity);
	}
}

const motionRandomLocation = new MotionRandomLocation(
	new Vector2(
		Math.floor(Math.random() * canvasMotionRandomVelocity.width),
		Math.floor(Math.random() * canvasMotionRandomVelocity.height)
	),
	new Vector2(0, 0),
	ctxMotionRandomVelocity,
	canvasMotionRandomVelocity.width,  canvasMotionRandomVelocity.height
);

/**
 * Exemplo 1.10: Movimento 101 (velocidade e aceleração constante)
 */
const canvasMotionMouseDirection = <HTMLCanvasElement> document.getElementById("motion-mouse-velocity");
const ctxMotionMouseDirection = canvasMotionMouseDirection.getContext("2d");

canvasMotionMouseDirection.addEventListener('mousemove', function(evt) {
	offeset.y = canvasMotionMouseDirection.offsetTop;
	offeset.x = canvasMotionMouseDirection.offsetLeft;
})

class MotionMouseDirection extends Motion {

	acceleration: Vector2;
	topspeed: number;

	constructor(public location: Vector2, public velocity: Vector2, ctx: CanvasRenderingContext2D, w: number, h: number) {
		super(location, velocity, ctx, w, h);

		this.acceleration = new Vector2(0.001, 0.01);
		this.topspeed = 10;
	}

	update() {
		const direction = Vector2.sub(mouse, this.location);

		direction.normalize();

		direction.mult(.5);

		this.acceleration = direction;

		this.velocity.add(this.acceleration);
		this.velocity.limit(this.topspeed);
		this.location.add(this.velocity);
	}

	display() {
		this.ctx.beginPath();
		this.ctx.moveTo(50, 50);
		this.ctx.rect(this.location.x, this.location.y, 16, 16);
		this.ctx.stroke();
	}

	clearReact() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

}

const motionMouseDirection = new MotionMouseDirection(
	new Vector2(
		Math.floor(Math.random() * canvasMotionMouseDirection.width),
		Math.floor(Math.random() * canvasMotionMouseDirection.height)
	),
	new Vector2(0, 0),
	ctxMotionMouseDirection,

	canvasMotionMouseDirection.width, canvasMotionMouseDirection.height
);

/**
 * Exemplo 1.11: Matriz de movimentadores acelerando em direção ao mouse
 */
const canvasMotionMouseDirections = <HTMLCanvasElement> document.getElementById("motion-mouse-mult");
const ctxMotionMouseDirections = canvasMotionMouseDirections.getContext("2d");

canvasMotionMouseDirections.addEventListener('mousemove', function(evt) {
	offeset.y = canvasMotionMouseDirections.offsetTop;
	offeset.x = canvasMotionMouseDirections.offsetLeft;
});

const motionMouseDirectionArr: Array<MotionMouseDirection> = [];
for (let contDirection = 0; contDirection < 30; contDirection++){

	motionMouseDirectionArr.push(new MotionMouseDirection(
		new Vector2(
			Math.floor(Math.random() * canvasMotionMouseDirections.width),
			Math.floor(Math.random() * canvasMotionMouseDirections.height)
		),
		new Vector2(0, 0),
		ctxMotionMouseDirections,

		canvasMotionMouseDirections.width, canvasMotionMouseDirections.height
	));
}

setInterval(() => {
	motionVelocity.update();
	motionVelocity.checkEdges();
	motionVelocity.display();

	motionAcceleration.update();
	motionAcceleration.checkEdges();
	motionAcceleration.display();

	car.update();
	car.checkEdges();
	car.display();

	motionRandomLocation.update();
	motionRandomLocation.checkEdges();
	motionRandomLocation.display();

	motionMouseDirection.update();
	motionMouseDirection.checkEdges();
	motionMouseDirection.clearReact();
	motionMouseDirection.display();

	motionMouseDirectionArr.forEach(m => { m.update() });
	motionMouseDirectionArr.forEach(m => { m.checkEdges() });
	motionMouseDirectionArr.forEach(m => { m.clearReact() });
	motionMouseDirectionArr.forEach(m => { m.display() });
}, 1000 / 60);