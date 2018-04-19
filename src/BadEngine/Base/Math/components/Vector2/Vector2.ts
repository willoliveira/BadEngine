export class Vector2 {

	constructor(public x: number = 0, public y: number = 0) { }

	public add(v: Vector2) {
		this.x += v.x;
		this.y += v.y;
	}

	public sub(v: Vector2) {
		this.x -= v.x;
		this.y -= v.y;
	}

	public mult(num: number) {
		this.x *= num;
		this.y *= num;
	}

	public div(num: number) {
		this.x /= num;
		this.y /= num;
	}

	public copy(v: Vector2) {
		this.x = v.x;
		this.y = v.y;
	}

	public perp() {
		let x = this.x;
		this.x = this.y;
		this.y = -x;
	}

	public reverse() {
		this.x = -this.x;
		this.y = -this.y;
	}

	public scale(x: number, y?: number) {
		this.x *= x;
		this.y *= y || x;
	}

	public mag() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	public normalize() {
		const m: number = this.mag();
		if (m !== 0) {
			this.div(m);
		}
	}

	public limit(max: number) {
		if (this.mag() > max) {
			this.normalize();
			this.mult(max);
		}
	}



	public static add(v1: Vector2, v2: Vector2) {
		return new Vector2(v1.x + v2.x, v1.y + v2.y);
	}

	public static sub(v1: Vector2, v2: Vector2) {
		return new Vector2(v1.x - v2.x, v1.y - v2.y);
	}

	public static mult(v1: Vector2, num: number) {
		return new Vector2(v1.x * num, v1.y * num);
	}

	public static div(v1: Vector2, num: number) {
		return new Vector2(v1.x / num, v1.y / num);
	}

	public static fromAngle(angle: number, length?: number) {
		if (typeof length === 'undefined') {
			length = 1;
		}
		return new Vector2(length * Math.cos(angle), length * Math.sin(angle));
	};

	public static random2D() {
		return Vector2.fromAngle(Math.random() * (Math.PI * 2));
	};
}