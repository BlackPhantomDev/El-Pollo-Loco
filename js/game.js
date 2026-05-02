let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);    
}

function handleThrowBottle(params) {
    keyboard.KEY_K = true;
    if (!keyboard.KEY_K_used) {  // ← nur einmal pro Tastendruck
        keyboard.KEY_K_used = true;
        world.checkBottles();
    }
}

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "Space":
            keyboard.SPACE = true;
            break;
        case "KeyK":
            handleThrowBottle();
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
            keyboard.KEY_K_used = false; 
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