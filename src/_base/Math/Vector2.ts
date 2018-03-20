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

	normalize() {
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
}