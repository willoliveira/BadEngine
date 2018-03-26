import { Vector2 } from "./Vector2";

describe("Vector2", () => {
	var vector: Vector2;
	beforeEach(() => {
		vector = new Vector2();
	})

	it("New Vector", () => {
		expect(vector).toBeTruthy();
	});
})