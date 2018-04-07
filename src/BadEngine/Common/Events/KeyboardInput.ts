
const KeyboardInputs: Array<String> = [ ];

export class KeyboardInput {

	constructor() {
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
	}

	onKeyDown(evt: KeyboardEvent) {
		if (KeyboardInputs.indexOf(evt.code) === -1) {
			KeyboardInputs.push(evt.code);
		}
	}

	onKeyUp(evt: KeyboardEvent) {
		const inputKeyboardIndex = KeyboardInputs.indexOf(evt.code);
		if (inputKeyboardIndex > -1) {
			KeyboardInputs.splice(inputKeyboardIndex, 1);
		}
	}

	static GetKeyDown(key: String): Boolean {
		return KeyboardInputs.indexOf(key) !== -1;
	}
}

export default new KeyboardInput();