let world;
let keyboard = new Keyboard();
let isMuted = localStorage.getItem('muted') === 'true';

document.addEventListener('DOMContentLoaded', () => {
    updateMuteIcon();
});

if ('mediaSession' in navigator) {
    ['play', 'pause', 'stop', 'nexttrack', 'previoustrack'].forEach(action => {
        try { navigator.mediaSession.setActionHandler(action, () => {}); } catch {}
    });
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('muted', isMuted);
    updateMuteIcon();
    applyMuteToWorld();
}

function updateMuteIcon() {
    document.getElementById('mute-icon').src = isMuted ? 'assets/icons/muted.png' : 'assets/icons/unmuted.png';
}

function applyMuteToWorld() {
    if (!world) return;
    [
        world.backgroundMusic, world.collectSound, world.throwSound, world.splashSound,
        world.character?.walkingSound, world.character?.snoringSound,
        world.character?.jumpSound, world.character?.hurtSound,
    ].forEach(s => { if (s) s.muted = isMuted; });
}

function cleanupWorld() {
    if (!world) return;
    cancelAnimationFrame(world.myAnimationFrame);
    clearInterval(world.runInterval);
    clearInterval(world.character?.keyInterval);
    [
        world.backgroundMusic, world.collectSound, world.throwSound, world.splashSound,
        world.character?.walkingSound, world.character?.snoringSound,
        world.character?.jumpSound, world.character?.hurtSound,
    ].forEach(s => { if (s) { s.pause(); s.currentTime = 0; } });
}

function initGame() {
    cleanupWorld();
    splashScreen.classList.add('hide');
    canvas.classList.add('show');
    document.getElementById('game-buttons').classList.add('show');
    initLevel();
    world = new World(canvas, keyboard);
    generateObjects();
    applyMuteToWorld();
}

function initGameEnding(hasWon) {
    canvas.classList.remove('show');
    splashScreen.classList.remove('hide');
    document.getElementById('game-buttons').classList.remove('show');
    world = null;
}

function handleThrowBottle() {
    keyboard.KEY_K = true;
    if (!keyboard.KEY_K_used) {
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