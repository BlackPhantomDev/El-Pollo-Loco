/** @type {World|null} The active game world, or null when no game is running. */
let world;
/** @type {Keyboard} Shared keyboard input state used by the world and controls. */
let keyboard = new Keyboard();
/** @type {boolean} Persisted mute state, restored from localStorage on load. */
let isMuted = localStorage.getItem('muted') === 'true';

document.addEventListener('DOMContentLoaded', () => {
    updateMuteIcon();
    setupMobileControls();
});

/**
 * Configuration for the on-screen mobile control buttons: each entry maps a
 * DOM id to the `down`/`up` actions executed on touch start/end.
 * @type {{id: string, down: () => void, up: () => void}[]}
 */
const MOBILE_CONTROLS = [
    { id: 'btn-left',  down: () => { keyboard.KEY_A = true; },  up: () => { keyboard.KEY_A = false; } },
    { id: 'btn-right', down: () => { keyboard.KEY_D = true; },  up: () => { keyboard.KEY_D = false; } },
    { id: 'btn-jump',  down: () => { keyboard.SPACE = true; },  up: () => { keyboard.SPACE = false; } },
    {
        id: 'btn-throw',
        down: () => { handleThrowBottle(); },
        up:   () => { keyboard.KEY_K = false; keyboard.KEY_K_used = false; }
    },
];

/**
 * Attaches touch listeners (and a contextmenu blocker) to a single mobile button.
 * @param {{id: string, down: () => void, up: () => void}} control - Button id + handlers.
 */
function bindMobileButton({ id, down, up }) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart',  (e) => { e.preventDefault(); down(); }, { passive: false });
    btn.addEventListener('touchend',    (e) => { e.preventDefault(); up();   }, { passive: false });
    btn.addEventListener('touchcancel', (e) => { e.preventDefault(); up();   }, { passive: false });
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

/**
 * Wires up all on-screen mobile control buttons defined in `MOBILE_CONTROLS`.
 */
function setupMobileControls() {
    MOBILE_CONTROLS.forEach(bindMobileButton);
}

if ('mediaSession' in navigator) {
    ['play', 'pause', 'stop', 'nexttrack', 'previoustrack'].forEach(action => {
        try { navigator.mediaSession.setActionHandler(action, () => {}); } catch {}
    });
}

/**
 * Flips the mute state, persists it to localStorage and applies it to
 * the icon and any audio currently owned by the world.
 */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('muted', isMuted);
    updateMuteIcon();
    applyMuteToWorld();
    [victorySound, gameOverSound].forEach(s => s.muted = isMuted);
}

/**
 * Updates the mute button icon to reflect the current mute state.
 */
function updateMuteIcon() {
    document.getElementById('mute-icon').src = isMuted ? 'assets/icons/muted.png' : 'assets/icons/unmuted.png';
}

/**
 * Toggles browser fullscreen mode for the whole page.
 */
function fullscreenGame() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
}

document.addEventListener('fullscreenchange', () => {
    const icon = document.querySelector('#fullscreen-btn img');
    if (!icon) return;
    icon.src = document.fullscreenElement
        ? 'assets/icons/fullscreen-exit.png'
        : 'assets/icons/fullscreen.png';
});

/**
 * Returns every audio element owned by the active world and its character.
 * @returns {HTMLAudioElement[]} Mixed list of world- and character-owned sounds.
 */
function getWorldSounds() {
    return [
        world.backgroundMusic, world.collectSound, world.throwSound, world.splashSound,
        world.character?.walkingSound, world.character?.snoringSound,
        world.character?.jumpSound, world.character?.hurtSound,
    ];
}

/**
 * Applies the current mute state to every audio element owned by the world.
 * Does nothing if no world is active.
 */
function applyMuteToWorld() {
    if (!world) return;
    getWorldSounds().forEach(s => { if (s) s.muted = isMuted; });
}

/**
 * Cancels active loops/intervals of the running world and stops every
 * sound it owns. Used before starting a new game to avoid leaks.
 */
function cleanupWorld() {
    if (!world) return;
    cancelAnimationFrame(world.myAnimationFrame);
    clearInterval(world.runInterval);
    clearInterval(world.character?.keyInterval);
    world.level?.endboss?.forEach(boss => {
        clearInterval(boss.movementInterval);
        clearTimeout(boss.stateChangeTimeout);
    });
    getWorldSounds().forEach(s => { if (s) { s.pause(); s.currentTime = 0; } });
}

/**
 * Starts a new game: tears down any previous world, swaps the splash/end screen
 * for the canvas, builds the level and the world and applies the mute state.
 */
function initGame() {
    cleanupWorld();
    stopEndScreenSounds();
    splashScreen.classList.add('hide');
    document.getElementById('end-screen').classList.remove('show');
    canvas.classList.add('show');
    document.getElementById('game-setting-buttons').classList.add('show');
    initLevel();
    world = new World(canvas, keyboard);
    generateObjects();
    applyMuteToWorld();
}

/**
 * Tears down the active game and shows the win or lose end screen.
 * @param {boolean} hasWon - Whether the player won.
 */
function initGameEnding(hasWon) {
    cleanupWorld();
    canvas.classList.remove('show');
    showEndScreen(hasWon);
    world = null;
}

/**
 * Returns from the running game or end screen to the splash/home screen.
 */
function goToHome() {
    cleanupWorld();
    stopEndScreenSounds();
    canvas.classList.remove('show');
    document.getElementById('end-screen').classList.remove('show');
    splashScreen.classList.remove('hide');
    document.getElementById('game-setting-buttons').classList.remove('show');
    world = null;
}

/** @type {string[]} Filenames inside `assets/img/10_end_screen/` shown when the player wins. */
const WIN_IMAGES = ['You Win A.png', 'You win B.png', 'You won A.png', 'You Won B.png'];

/** @type {string[]} Filenames inside `assets/img/10_end_screen/` shown when the player loses. */
const LOST_IMAGES = ['Game over A.png', 'Game Over.png', 'You lost b.png', 'You lost.png'];

/** @type {HTMLAudioElement} Plays once when the win end screen appears. */
const victorySound = new Audio('assets/audio/victory.mp3');

/** @type {HTMLAudioElement} Plays once when the lose end screen appears. */
const gameOverSound = new Audio('assets/audio/gameover.mp3');

/**
 * Picks a random win/lose image, swaps its src and shows the matching end screen layer.
 * @param {boolean} hasWon - Whether the player won.
 */
function showEndScreen(hasWon) {
    const pool = hasWon ? WIN_IMAGES : LOST_IMAGES;
    const file = pool[Math.floor(Math.random() * pool.length)];
    const wonImg  = document.querySelector('#end-screen-won img');
    const lostImg = document.querySelector('#end-screen-lost img');
    const targetImg = hasWon ? wonImg : lostImg;
    targetImg.src = `assets/img/10_end_screen/${encodeURI(file)}`;
    document.getElementById('end-screen-won').classList.toggle('show', hasWon);
    document.getElementById('end-screen-lost').classList.toggle('show', !hasWon);
    document.getElementById('end-screen').classList.add('show');
    playEndScreenSound(hasWon);
}

/**
 * Stops both end-screen sounds and plays the one matching the result.
 * @param {boolean} hasWon - Whether the player won.
 */
function playEndScreenSound(hasWon) {
    stopEndScreenSounds();
    const sound = hasWon ? victorySound : gameOverSound;
    sound.muted = isMuted;
    sound.play();
}

/**
 * Pauses both end-screen sounds and rewinds them to the start.
 */
function stopEndScreenSounds() {
    [victorySound, gameOverSound].forEach(s => {
        s.pause();
        s.currentTime = 0;
    });
}

/**
 * Marks the throw key as pressed and, on the rising edge, triggers a
 * single bottle throw via the world. Rate-limited to one throw per 1300ms
 * — slightly above the 1200ms enemy hit cooldown so close-range hits
 * never land inside the receiver-side cooldown window and get wasted.
 */
function handleThrowBottle() {
    keyboard.KEY_K = true;
    if (keyboard.KEY_K_used) return;
    if (!world?.character?.cooldown('throw', 1300)) return;
    keyboard.KEY_K_used = true;
    world.checkBottles();
}

/**
 * Maps KeyboardEvent.code values to the property names used on the shared
 * Keyboard instance.
 * @type {Object<string, string>}
 */
const KEY_MAP = {
    Space: 'SPACE',
    KeyW:  'KEY_W',
    KeyA:  'KEY_A',
    KeyS:  'KEY_S',
    KeyD:  'KEY_D',
};

/**
 * Writes the pressed/released state of a known key into the shared keyboard object.
 * @param {string} code - The event.code value (e.g. "KeyA", "Space").
 * @param {boolean} pressed - True for keydown, false for keyup.
 */
function setKeyState(code, pressed) {
    const key = KEY_MAP[code];
    if (key) keyboard[key] = pressed;
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyK') return handleThrowBottle();
    setKeyState(e.code, true);
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyK') {
        keyboard.KEY_K = false;
        keyboard.KEY_K_used = false;
        return;
    }
    setKeyState(e.code, false);
});
