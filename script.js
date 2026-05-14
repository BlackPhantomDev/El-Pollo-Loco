/** @type {string} Lowercased user agent string of the current browser. */
const userAgent = navigator.userAgent.toLowerCase();

/** @type {MediaQueryList} Matches small portrait viewports that should show the rotation hint. */
const portraitMql = window.matchMedia(
  "(orientation: portrait) and (max-width: 1080px)"
);

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

/**
 * Entry point called from the HTML. Registers the orientation listener and
 * runs an initial orientation check.
 */
function init() {
  portraitMql.addEventListener("change", checkDeviceOrientation);
  checkDeviceOrientation();
}

/**
 * Toggles the rotation hint and the game wrapper based on the current
 * portrait media query state.
 */
function checkDeviceOrientation() {
  if (portraitMql.matches) {
    deviceOrientationMsg.classList.add('show');
    gameWrapper.classList.add('hide');
  }  else {
    deviceOrientationMsg.classList.remove('show');
    gameWrapper.classList.remove('hide');
  }
}
