import { Vector2 } from "./Vector2";

describe('Vector2', () => {

	describe('Instance Methods', () => {

		it('new Vector', () => {
			const vector: Vector2 = new Vector2();
			expect(vector).toBeTruthy();
		});

		it('add', () => {
			const vector: Vector2 = new Vector2(3, 4);
			vector.add(new Vector2(1, 2));

			expect(vector.mag()).toBe(new Vector2(4, 6).mag());
		});

		it('sub', () => {
			const vector: Vector2 = new Vector2(4, 5);
			vector.sub(new Vector2(1, 1));

			expect(vector.mag()).toBe(new Vector2(3, 4).mag());
		});

		it('mult', () => {
			const vector: Vector2 = new Vector2(2, 2);
			vector.mult(2);

			expect(vector.mag()).toBe(new Vector2(4, 4).mag());
		});

		it('div', () => {
			const vector: Vector2 = new Vector2(4, 4);
			vector.div(2);

			expect(vector.mag()).toBe(new Vector2(2, 2).mag());
		});
	});

	describe('Static methods', () => {
		it('Vector2 exists', () => {
			expect(Vector2).toBeTruthy();
		})

		it('add', () => {
			const vector: Vector2 = new Vector2(1, 3);
			const vectorSum: Vector2 = Vector2.add(vector, vector);

			expect(vector.mag() + vector.mag()).toBe(vectorSum.mag());
		});

		it('sub', () => {
			const vectorA: Vector2 = new Vector2(4, 5);
			const vectorB: Vector2 = new Vector2(1, 1);
			const vectorSub: Vector2 = Vector2.sub(vectorA, vectorB);

			expect(vectorSub.mag()).toBe(new Vector2(3, 4).mag());
		});

		it('mult', () => {
			const vector: Vector2 = new Vector2(2, 2);
			const vectorMult: Vector2 = Vector2.mult(vector, 2);

			expect(vectorMult.mag()).toBe(new Vector2(4, 4).mag());
		});

		it('div', () => {
			const vector: Vector2 = new Vector2(4, 4);
			const vectorDiv: Vector2 = Vector2.div(vector, 2)

			expect(vectorDiv.mag()).toBe(new Vector2(2, 2).mag());
		});
	});
})