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
 * Binds touch handlers to the on-screen mobile control buttons so they
 * update the shared keyboard state like real key presses do.
 */
function setupMobileControls() {
    const controls = [
        { id: 'btn-left',  down: () => { keyboard.KEY_A = true; },  up: () => { keyboard.KEY_A = false; } },
        { id: 'btn-right', down: () => { keyboard.KEY_D = true; },  up: () => { keyboard.KEY_D = false; } },
        { id: 'btn-jump',  down: () => { keyboard.SPACE = true; },  up: () => { keyboard.SPACE = false; } },
        {
            id: 'btn-throw',
            down: () => { handleThrowBottle(); },
            up:   () => { keyboard.KEY_K = false; keyboard.KEY_K_used = false; }
        },
    ];
    controls.forEach(({ id, down, up }) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('touchstart',   (e) => { e.preventDefault(); down(); }, { passive: false });
        btn.addEventListener('touchend',     (e) => { e.preventDefault(); up(); },   { passive: false });
        btn.addEventListener('touchcancel',  (e) => { e.preventDefault(); up(); },   { passive: false });
        btn.addEventListener('contextmenu',  (e) => e.preventDefault());
    });
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
 * Applies the current mute state to every audio element owned by the world
 * and the character. Does nothing if no world is active.
 */
function applyMuteToWorld() {
    if (!world) return;
    [
        world.backgroundMusic, world.collectSound, world.throwSound, world.splashSound,
        world.character?.walkingSound, world.character?.snoringSound,
        world.character?.jumpSound, world.character?.hurtSound,
    ].forEach(s => { if (s) s.muted = isMuted; });
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
    [
        world.backgroundMusic, world.collectSound, world.throwSound, world.splashSound,
        world.character?.walkingSound, world.character?.snoringSound,
        world.character?.jumpSound, world.character?.hurtSound,
    ].forEach(s => { if (s) { s.pause(); s.currentTime = 0; } });
}

/**
 * Starts a new game: tears down any previous world, swaps the splash screen
 * for the canvas, builds the level and the world and applies the mute state.
 */
function initGame() {
    cleanupWorld();
    splashScreen.classList.add('hide');
    canvas.classList.add('show');
    document.getElementById('game-setting-buttons').classList.add('show');
    initLevel();
    world = new World(canvas, keyboard);
    generateObjects();
    applyMuteToWorld();
}

/**
 * Tears down the active game and returns the UI to the splash screen.
 * @param {boolean} _hasWon - Whether the player won (currently unused).
 */
function initGameEnding(_hasWon) {
    cleanupWorld();
    canvas.classList.remove('show');
    splashScreen.classList.remove('hide');
    document.getElementById('game-setting-buttons').classList.remove('show');
    world = null;
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
