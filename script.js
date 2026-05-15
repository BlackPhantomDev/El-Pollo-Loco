/** @type {string} Lowercased user agent string of the current browser. */
const userAgent = navigator.userAgent.toLowerCase();

/**
 * Detects mobile and tablet devices via user agent. Needed because wide-screen
 * tablets (e.g. iPad Pro in landscape, or any tablet that reports a fine pointer
 * when connected to a trackpad/keyboard) miss the CSS pointer/width media queries.
 * Also covers modern iPadOS, which reports as Mac in the user agent.
 * @returns {boolean}
 */
function isMobileDevice() {
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) return true;
    return /macintosh/.test(userAgent) && navigator.maxTouchPoints > 1;
}

/** @type {MediaQueryList} Matches touch-capable or small viewports — mobile/tablet UX should apply. */
const mobileModeMql = window.matchMedia('(pointer: coarse), (max-width: 1024px)');

/**
 * Sets or clears the `is-mobile` class on `<html>` based on user agent and viewport.
 */
function updateMobileMode() {
    const isMobile = isMobileDevice() || mobileModeMql.matches;
    document.documentElement.classList.toggle('is-mobile', isMobile);
}

mobileModeMql.addEventListener('change', updateMobileMode);
updateMobileMode();

/** @type {MediaQueryList} Matches when the viewport is in portrait orientation. */
const portraitMql = window.matchMedia('(orientation: portrait)');

/** @type {HTMLElement} Wrapper element that contains the game canvas and HUD. */
const gameWrapper = document.getElementById('game-wrapper');
/** @type {HTMLElement} Overlay element that asks the user to rotate the device. */
const deviceOrientationMsg = document.getElementById('device-orientation-msg');

/** @type {HTMLDialogElement} Modal dialog showing the imprint. */
const dialog = document.getElementById('imprint-dialog');
/** @type {HTMLElement} Splash screen shown before and after a game session. */
const splashScreen = document.getElementById('splash-screen');
/** @type {HTMLCanvasElement} Canvas the game world is rendered to. */
let canvas = document.getElementById('canvas');

document.querySelectorAll('.imprint-link').forEach((el) => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        dialog.showModal();
    });
});

document.getElementById('imprint-close').addEventListener('click', () => {
    dialog.close();
});

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
});

document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('button, #start-game-btn')) e.preventDefault();
});

/**
 * Prevents game UI buttons from taking keyboard focus on mouse click, so a
 * subsequent Space/Enter for jumping/throwing doesn't re-trigger the last
 * pressed button (e.g. reload restarting the game while jumping).
 */
document.addEventListener('mousedown', (e) => {
    if (e.target.closest('#game-setting-buttons button, #start-game-btn')) {
        e.preventDefault();
    }
});

/**
 * Entry point called from the HTML. Registers the orientation listener and
 * runs an initial orientation check.
 */
function init() {
  portraitMql.addEventListener("change", checkDeviceOrientation);
  checkDeviceOrientation();
}

/**
 * Toggles the rotation hint and the game wrapper. Shown only on mobile/tablet
 * devices held in portrait — desktop users in a portrait window are unaffected.
 */
function checkDeviceOrientation() {
  if (portraitMql.matches && isMobileDevice()) {
    deviceOrientationMsg.classList.add('show');
    gameWrapper.classList.add('hide');
  }  else {
    deviceOrientationMsg.classList.remove('show');
    gameWrapper.classList.remove('hide');
  }
}
