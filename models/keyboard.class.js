/**
 * Tracks the pressed state of the keys used by the game.
 * Each property is set to true while the corresponding key is held down.
 */
class  Keyboard {
    /** @type {boolean} W key (jump). */
    KEY_W = false;
    /** @type {boolean} A key (walk left). */
    KEY_A = false;
    /** @type {boolean} S key (currently unused). */
    KEY_S = false;
    /** @type {boolean} D key (walk right). */
    KEY_D = false;

    /** @type {boolean} Space key (jump). */
    SPACE = false;
    /** @type {boolean} K key (throw bottle). */
    KEY_K = false;
    /** @type {boolean} Flag used to debounce the throw-bottle key. */
    KEY_K_used = false;
}
