export class Vector2 {

	constructor(public x: number, public y: number) { }

	public add(v: Vector2) {
		this.x += v.x;
		this.y += v.y;
	}

	public sub(v: Vector2) {
		this.x -= v.x;
		this.y -= v.y;
	}

	public mult(m: number) {
		this.x *= m;
		this.y *= m;
	}

	public div(m: number) {
		this.x /= m;
		this.y /= m;
	}

	public mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
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

	public fromAngle(angle: number, length?: number) {
		if (typeof length === 'undefined') {
			length = 1;
		}
		return new Vector2(length * Math.cos(angle), length * Math.sin(angle));
	};

	public random2D() {
		return this.fromAngle(Math.random() * (Math.PI * 2));
	};
}