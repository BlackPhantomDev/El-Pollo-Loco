let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);    
}

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "Space":
            keyboard.SPACE = true;
            break;
        case "KeyK":
            keyboard.KEY_K = true;
            break;
        case "KeyW":
            keyboard.KEY_W = true;
            break;
        case "KeyA":
            keyboard.KEY_A = true;
            break;
        case "KeyS":
            keyboard.KEY_S = true;
            break;
        case "KeyD":
            keyboard.KEY_D = true;
            break;
        default:
            break;
    }    
});

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case "Space":
            keyboard.SPACE = false;
            break;
        case "KeyK":
            keyboard.KEY_K = false;
            break;
        case "KeyW":
            keyboard.KEY_W = false;
            break;
        case "KeyA":
            keyboard.KEY_A = false;
            break;
        case "KeyS":
            keyboard.KEY_S = false;
            break;
        case "KeyD":
            keyboard.KEY_D = false;
            break;
        default:
            break;
    }    
});