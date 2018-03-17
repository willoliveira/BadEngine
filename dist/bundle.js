/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __webpack_require__(1);
class GameComponent extends Component_1.Component {
    constructor(transform) {
        super();
        this.transform = transform;
        this._components = []; // TODO: Tentar assim por enquanto
        this.addComponent(this.transform);
    }
    get components() {
        return this._components;
    }
    addComponent(component) {
        component.parent = this;
        this._components.push(component);
    }
    getComponent(type) {
        return this._components.find((c) => c.constructor.name === type);
    }
    getComponents(type) {
        return this._components.filter((c) => c.constructor.name === type);
    }
}
exports.GameComponent = GameComponent;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Component {
    Awake() { }
    OnEnable() { }
    Start() { }
    FixedUpdate() { }
    Update() { }
    OnRender() { }
    OnDisable() { }
    OnDestroy() { }
}
exports.Component = Component;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameComponent_1 = __webpack_require__(0);
class Camera extends GameComponent_1.GameComponent {
    constructor(transform) {
        super(transform);
        Camera.instance = this;
    }
}
exports.Camera = Camera;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __webpack_require__(1);
/**
* TODO: super provisório, depois investir um tempo pra chegar em um lance legal aqui
*/
class GameEngine extends Component_1.Component {
    constructor(stageId) {
        super();
        this.FPS = 60;
        GameEngine.instance = this;
        this.Init(stageId);
    }
    Init(stageId) {
        this.canvas = document.getElementById(stageId);
        this.context2D = this.canvas.getContext("2d");
    }
}
exports.GameEngine = GameEngine;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __webpack_require__(1);
class Transform extends Component_1.Component {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    //TODO: Implementar ainda
    setTranslate() { }
}
exports.Transform = Transform;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __webpack_require__(1);
class Sprite extends Component_1.Component {
    constructor(image) {
        super();
        // Implementar ainda
        this.flip = {
            x: false,
            y: false
        };
        this.init(image);
    }
    init(image) {
        var ctx;
        this.sprite = {
            backgroundColor: "#FFFFFF",
            canvas: document.createElement("canvas"),
            sourceRect: { x: 0, y: 0, width: image.width, height: image.height },
            destRect: { x: 0, y: 0, width: image.width, height: image.height },
            image
        };
        ctx = this.sprite.canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        this.sprite.canvas.width = image.width;
        this.sprite.canvas.height = image.height;
    }
}
exports.Sprite = Sprite;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Resources = {};
// TODO: Depois refazer com Promise ou com rxJS
function LoadResources(resources, callback) {
    let filesLoaded = 0;
    resources.forEach((resource) => {
        const { url, type } = resource;
        switch (type) {
            case "image":
                let image = new Image();
                image.src = url;
                image.addEventListener('load', () => {
                    filesLoaded += 1;
                    exports.Resources[resource.name] = Object.assign(resource, { file: image });
                    if (filesLoaded === resources.length) {
                        callback(exports.Resources);
                    }
                });
                break;
        }
    });
}
exports.LoadResources = LoadResources;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Essa inicialização não ficara assim, depois pensar no start
*
* Conforme for evoluindo a estrutura com os componentes, vou alterando aqui o padrão
*/
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(8);
const position_interface_1 = __webpack_require__(9);
const Camera_1 = __webpack_require__(2);
const Transform_1 = __webpack_require__(4);
const CameraFollow_1 = __webpack_require__(10);
const GameEngine_1 = __webpack_require__(3);
const Sprite_1 = __webpack_require__(5);
const TileMap_1 = __webpack_require__(11);
const Resources_1 = __webpack_require__(6);
const Animation_1 = __webpack_require__(13);
const gameEngine = new GameEngine_1.GameEngine("stage");
const Resources = [
    { name: "blankImage", url: "/assets/blank.png", type: 'image' },
    { name: "tileSet", url: "/assets/tiles.png", type: 'image' },
    { name: "megaman", url: "/assets/megaman.png", type: 'image' },
    { name: "link", url: "/assets/link/zelda-link.png", type: 'image' },
];
let tileSize = 64;
let mapLayers = [
    [
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 3],
        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 3],
        [3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
        [3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    ],
    [
        [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
        [4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        [4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    ]
];
let mapCollisions = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
let GameComponentsHierarchy = [];
let components;
let camera = new Camera_1.Camera(new Transform_1.Transform(1 * tileSize, 1 * tileSize, 12 * tileSize, 12 * tileSize));
let player;
gameEngine.canvas.width = camera.transform.width;
gameEngine.canvas.height = camera.transform.height;
//Carrega os resources do game
Resources_1.LoadResources(Resources, (files) => {
    let image = new Image();
    let imageBlank = new Image();
    imageBlank.src = "/assets/blank.png";
    let tileMap = new TileMap_1.TileMap(files.tileSet.file, 64, mapLayers, mapCollisions, files.blankImage.file);
    tileMap.Awake();
    player = new Player_1.Player(new Transform_1.Transform(1 * tileSize, 1 * tileSize, tileSize, tileSize), 1);
    let spritePlayer = new Sprite_1.Sprite(files.blankImage.file);
    spritePlayer.layer = 0;
    spritePlayer.orderInLayer = 1;
    player.addComponent(spritePlayer);
    player.addComponent(new Animation_1.Animation());
    player.Awake();
    //Adicionando o target na CameraFollow
    camera.addComponent(new CameraFollow_1.CameraFollow(camera.transform, player));
    camera.Awake();
    //Hierarchy: seguindo a linha do unity, depois posso mudar o nome
    GameComponentsHierarchy.push(camera, tileMap, player);
    components = GameComponentsHierarchy.reduce((before, current) => {
        before.push(current);
        if (current.components && current.components.length)
            before = before.concat(current.components);
        return before;
    }, []);
    console.log(components);
    components.forEach((c) => { c.Awake(); }); // Testar isso também
    init();
});
function init() {
    setInterval(GameLoop, 1000 / gameEngine.FPS);
    document.getElementById("limitBorder").addEventListener("change", (event) => {
        var cFollow = camera.getComponent('CameraFollow');
        cFollow.limitBorder = event.target.checked ? { width: mapLayers[0][0].length * 64, height: mapLayers[0].length * 64 } : null;
    });
}
function GameLoop() {
    components.forEach((c) => { c.FixedUpdate(); });
    components.forEach((c) => { c.Update(); });
    /**
     * Super provisório, só pra mostrar como será depois
     * O render ele será só de elementos que possuem Sprite e/ou Interface
     * A renderização será nessa ordem
     *
     * - Layer
     * 		-> Order
     */
    components
        .filter((c) => {
        if (!c.getComponent)
            return false;
        let sprite = c.getComponent("Sprite");
        return sprite;
    })
        .sort((a, b) => {
        let aSprite, bSprite;
        aSprite = a.getComponent("Sprite");
        bSprite = b.getComponent("Sprite");
        if (aSprite.layer > bSprite.layer)
            return 1;
        else if (aSprite.layer < bSprite.layer)
            return -1;
        else {
            if (aSprite.orderInLayer > bSprite.orderInLayer)
                return 1;
            if (aSprite.orderInLayer < bSprite.orderInLayer)
                return -1;
        }
    })
        .forEach((c) => { c.OnRender(); });
}
let movementDirection;
function onMoveTo(pos) {
    let positionRequest = {
        x: Math.floor((player.transform.x + pos.x) / 64),
        y: Math.floor((player.transform.y + pos.y) / 64)
    };
    // if (!hasCollision(positionRequest)) {
    player.transform.x += pos.x;
    player.transform.y += pos.y;
    // }
    // console.log(player.transform)
}
function hasCollision(position) {
    // Vai sair do mapa
    if (position.y < 0 || position.y >= mapCollisions.length || position.x < 0 || position.x >= mapCollisions[0].length) {
        return true;
    }
    // 1 é colisão
    if (mapCollisions[position.y][position.x] === 1) {
        return true;
    }
    return false;
}
function onKeyPress(evt) {
    let dir = { x: position_interface_1.Direction.Idle, y: position_interface_1.Direction.Idle };
    const playerAnimation = player.getComponent("Animation");
    const playerSprite = player.getComponent("Sprite");
    //left
    if (evt.keyCode === 37) {
        if (playerAnimation) {
            playerAnimation.setState("run-left");
        }
        dir.x = -5;
        playerSprite.flip.x = true;
    }
    //right
    if (evt.keyCode === 39) {
        if (playerAnimation) {
            playerAnimation.setState("run-right");
        }
        dir.x = 5;
        playerSprite.flip.x = false;
    }
    //down
    if (evt.keyCode === 40) {
        if (playerAnimation) {
            playerAnimation.setState("run-down");
        }
        dir.y = 5;
    }
    //up
    if (evt.keyCode === 38) {
        if (playerAnimation) {
            playerAnimation.setState("run-up");
        }
        dir.y = -5;
    }
    movementDirection = dir;
    onMoveTo(dir);
}
function onKeyUp() {
    const playerAnimation = player.getComponent("Animation");
    const playerSprite = player.getComponent("Sprite");
    if (movementDirection.x === 0) {
        if (playerAnimation.currentState.name === "run-down") {
            playerAnimation.setState("idle-down");
        }
        else if (playerAnimation.currentState.name === "run-up") {
            playerAnimation.setState("idle-up");
        }
    }
    else if (movementDirection.y === 0) {
        if (playerAnimation.currentState.name === "run-right") {
            playerAnimation.setState("idle-right");
        }
        else if (playerAnimation.currentState.name === "run-left") {
            playerAnimation.setState("idle-left");
        }
    }
}
window.addEventListener("keydown", onKeyPress);
window.addEventListener("keyup", onKeyUp);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameComponent_1 = __webpack_require__(0);
const Camera_1 = __webpack_require__(2);
const GameEngine_1 = __webpack_require__(3);
class Player extends GameComponent_1.GameComponent {
    constructor(transform, layer) {
        super(transform);
        this.transform = transform;
        this.layer = layer;
        // tirar daqui depois
        // Megaman
        // states: Array<AnimationState> = [
        // 	{
        // 		default: true,
        // 		name: "idle",
        // 		frames: [
        // 			{ rect: { y: 0, x: 0, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 0, x: 36, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 0, x: 72, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 0, x: 108, width: 36, height: 36 }, image: 'megaman', delay: 7 }
        // 		]
        // 	}, {
        // 		default: false,
        // 		name: "run",
        // 		frames: [
        // 			{ rect: { y: 35, x: 0, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 35, x: 36, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 35, x: 72, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 35, x: 108, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 35, x: 144, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 35, x: 180, width: 36, height: 36 }, image: 'megaman', delay: 7 },
        // 			{ rect: { y: 35, x: 216, width: 36, height: 36 }, image: 'megaman', delay: 7 }
        // 		]
        // 	}
        // ];
        //link
        this.states = [
            {
                default: true,
                name: "idle-down",
                frames: [
                    { rect: { y: 0, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 100 },
                    { rect: { y: 0, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 0, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 }
                ]
            },
            {
                default: false,
                name: "idle-left",
                frames: [
                    { rect: { y: 111.5, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 100 },
                    { rect: { y: 111.5, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 111.5, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 }
                ]
            },
            {
                default: false,
                name: "idle-up",
                frames: [
                    { rect: { y: 221, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 100 },
                ]
            },
            {
                default: false,
                name: "idle-right",
                frames: [
                    { rect: { y: 332.5, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 100 },
                    { rect: { y: 332.5, x: 98, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 332.5, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 }
                ]
            },
            {
                default: false,
                name: "run-down",
                frames: [
                    { rect: { y: 443, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 306, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 408, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 510, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 612, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 714, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 816, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 443, x: 918, width: 102, height: 110.5 }, image: 'link', delay: 5 }
                ]
            }, {
                default: false,
                name: "run-up",
                frames: [
                    { rect: { y: 664, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 306, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 408, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 510, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 612, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 714, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 816, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 664, x: 918, width: 102, height: 110.5 }, image: 'link', delay: 5 }
                ]
            }, {
                default: false,
                name: "run-left",
                frames: [
                    { rect: { y: 553.5, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 306, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 408, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 510, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 612, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 714, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 816, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 553.5, x: 918, width: 102, height: 110.5 }, image: 'link', delay: 5 }
                ]
            }, {
                default: false,
                name: "run-right",
                frames: [
                    { rect: { y: 773.5, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 306, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 408, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 510, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 612, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 714, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 816, width: 102, height: 110.5 }, image: 'link', delay: 5 },
                    { rect: { y: 773.5, x: 918, width: 102, height: 110.5 }, image: 'link', delay: 5 }
                ]
            }
        ];
    }
    Awake() {
        this.spriteComponent = this.getComponent("Sprite");
        this.cFollow = Camera_1.Camera.instance.getComponent("CameraFollow");
        this.animation = this.getComponent("Animation");
        this.animation.animationStates = this.states;
    }
    Update() {
        this.spriteComponent.sprite.destRect = {
            x: ((Camera_1.Camera.instance.transform.x * -1) + this.cFollow.target.transform.x),
            y: ((Camera_1.Camera.instance.transform.y * -1) + this.cFollow.target.transform.y),
            width: 64,
            height: 64
        };
    }
    /**
     * TODO: Tentar transferir essa logica para outro lugar
     * Sprite ou o base
     */
    OnRender() {
        let srcRect = this.spriteComponent.sprite.sourceRect;
        let destRect = this.spriteComponent.sprite.destRect;
        GameEngine_1.GameEngine.instance.context2D.drawImage(this.spriteComponent.sprite.image, srcRect.x, srcRect.y, srcRect.width, srcRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
        // console.log(srcRect, destRect)
    }
}
exports.Player = Player;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = -1] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = -1] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Idle"] = 0] = "Idle";
})(Direction = exports.Direction || (exports.Direction = {}));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameComponent_1 = __webpack_require__(0);
class CameraFollow extends GameComponent_1.GameComponent {
    constructor(transform, target, limitBorder) {
        super(transform);
        this.transform = transform;
        this.target = target;
        this.limitBorder = limitBorder;
        this.center = true;
    }
    FixedUpdate() {
        this.Follow();
    }
    Follow() {
        if (!this.target)
            return;
        if (this.center) {
            this.transform.x = this.target.transform.x - Math.floor(this.transform.width / 2);
            this.transform.y = this.target.transform.y - Math.floor(this.transform.height / 2);
        }
        if (this.limitBorder) {
            if (this.transform.x < 0)
                this.transform.x = 0;
            if (this.transform.y < 0)
                this.transform.y = 0;
            if (this.transform.x + this.transform.width > this.limitBorder.width) {
                this.transform.x = this.limitBorder.width - this.transform.width;
            }
            if (this.transform.y + this.transform.height > this.limitBorder.height) {
                this.transform.y = this.limitBorder.height - this.transform.height;
            }
        }
    }
}
exports.CameraFollow = CameraFollow;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameComponent_1 = __webpack_require__(0);
const Transform_1 = __webpack_require__(4);
const Sprite_1 = __webpack_require__(5);
const TileMapLayer_1 = __webpack_require__(12);
/*
 * Isso irá ter uma coleção mapa de Tiles.
 * A cada layer, a ideia que seja um componente de Tile
 */
class TileMap extends GameComponent_1.GameComponent {
    constructor(tileSet, tileSize, mapLayers, mapCollisions, blankImage // TODO: ficou ruim isso, depois rever
    ) {
        super(new Transform_1.Transform(0, 0, 832, 832));
        this.tileSet = tileSet;
        this.tileSize = tileSize;
        this.mapLayers = mapLayers;
        this.mapCollisions = mapCollisions;
        this.blankImage = blankImage; // TODO: ficou ruim isso, depois rever
    }
    Awake() {
        for (let layer = 0; layer < this.mapLayers.length; layer++) {
            // TODO: Talvez, fazer um esquema de filho no Hierarchy aqui, e não adicionar como componente
            let tileMapLayer = new TileMapLayer_1.TileMapLayer(this.tileSize, this.mapLayers[layer], this.blankImage);
            let tileMapLayerSprite = new Sprite_1.Sprite(this.tileSet);
            tileMapLayerSprite.layer = layer;
            tileMapLayerSprite.orderInLayer = 0;
            tileMapLayer.addComponent(tileMapLayerSprite);
            tileMapLayer.Awake();
            this.addComponent(tileMapLayer);
        }
    }
}
exports.TileMap = TileMap;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameComponent_1 = __webpack_require__(0);
const Transform_1 = __webpack_require__(4);
const Camera_1 = __webpack_require__(2);
const GameEngine_1 = __webpack_require__(3);
/**
* Seria um unico mapa de Tile
*/
class TileMapLayer extends GameComponent_1.GameComponent {
    constructor(tileSize, mapLayers, blankImage // TODO: ficou ruim isso, depois rever
    ) {
        super(new Transform_1.Transform(0, 0, 1, 1));
        this.tileSize = tileSize;
        this.mapLayers = mapLayers;
        this.blankImage = blankImage; // TODO: ficou ruim isso, depois rever
        this.beforeX = 0;
        this.currentX = 0;
    }
    Awake() {
        this.tileSet = this.getComponent("Sprite");
    }
    OnRender() {
        let rowLen = Math.floor(Camera_1.Camera.instance.transform.height / 64);
        let colLen = Math.floor(Camera_1.Camera.instance.transform.width / 64);
        let sumPosX = Camera_1.Camera.instance.transform.x - (Math.floor(Camera_1.Camera.instance.transform.x / this.tileSize) * this.tileSize);
        let sumPosY = Camera_1.Camera.instance.transform.y - (Math.floor(Camera_1.Camera.instance.transform.y / this.tileSize) * this.tileSize);
        for (let row = 0; row < rowLen + 1; row++) {
            for (let col = 0; col < colLen + 1; col++) {
                let posY = Math.floor(Camera_1.Camera.instance.transform.y / this.tileSize) + row;
                let posX = Math.floor(Camera_1.Camera.instance.transform.x / this.tileSize) + col;
                let imageSrc, widthSrc, heightSrc, widthDist, heightDist;
                widthDist = col * this.tileSize;
                heightDist = row * this.tileSize;
                // TODO: Depois ver de pintar com hexa ao inves de imagem
                if (posX < 0 || posY < 0 || posX >= this.mapLayers[0].length || posY >= this.mapLayers.length) {
                    imageSrc = this.blankImage;
                    widthSrc = 0;
                    heightSrc = 0;
                }
                else {
                    let tileNum = this.mapLayers[posY][posX];
                    imageSrc = this.tileSet.sprite.image;
                    widthSrc = ((tileNum - 1) % (this.tileSet.sprite.image.width / this.tileSize));
                    heightSrc = Math.floor((tileNum - 1) / (this.tileSet.sprite.image.width / this.tileSize));
                }
                GameEngine_1.GameEngine.instance.context2D.drawImage(imageSrc, 
                // na imagem
                widthSrc * this.tileSize, heightSrc * this.tileSize, this.tileSize, this.tileSize, 
                //no canvas
                (col * this.tileSize) - sumPosX, (row * this.tileSize) - sumPosY, this.tileSize, this.tileSize);
            }
        }
    }
}
exports.TileMapLayer = TileMapLayer;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __webpack_require__(1);
const Resources_1 = __webpack_require__(6);
class Animation extends Component_1.Component {
    constructor() {
        super();
        this.currentFrame = 0;
        this.currentFrameDelay = 0;
        this._animationStates = [];
    }
    set animationStates(value) {
        this._animationStates = value;
        this.currentState = this._animationStates.find(state => state.default);
        // TODO: Aqui não será necessário mais tarde, obrigar sempre ter uma animação default
        if (!this.currentState)
            this.currentState = this._animationStates[0];
    }
    setState(stateName) {
        if (this.currentState.name === stateName)
            return;
        this.currentState = this._animationStates.find((state) => state.name === stateName);
        this.clearState();
        this.setAnimationFrame();
    }
    clearState() {
        this.currentFrame = 0;
        this.currentFrameDelay = 0;
    }
    setAnimationFrame() {
        this.spriteComponent.sprite.sourceRect = this.currentState.frames[this.currentFrame].rect;
        this.spriteComponent.sprite.image = Resources_1.Resources[this.currentState.frames[this.currentFrame].image].file;
    }
    Awake() {
        let parent = this.parent;
        this.spriteComponent = parent.getComponent("Sprite");
        this.setAnimationFrame();
    }
    Update() {
        if (!this._animationStates.length)
            return;
        if (this.currentState.frames[this.currentFrame].delay === this.currentFrameDelay) {
            if (this.currentFrame + 1 > this.currentState.frames.length - 1) {
                this.currentFrame = 0;
            }
            else {
                this.currentFrame += 1;
            }
            this.currentFrameDelay = 0;
            this.setAnimationFrame();
        }
        this.currentFrameDelay += 1;
    }
}
exports.Animation = Animation;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map