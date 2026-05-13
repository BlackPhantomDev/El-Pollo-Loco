/**
 * Container for all objects that belong to a single level
 * (enemies, background, status bars, collectables, ...).
 */
class Level {

    /** @type {Chicken[]} Regular chicken enemies. */
    chickens;
    /** @type {Endboss[]} Endboss instances. */
    endboss;
    /** @type {Cloud[]} Decorative clouds. */
    clouds;
    /** @type {BackgroundObject[]} Parallax background tiles. */
    backgroundObjects;
    /** @type {StatusBar[]} HUD status bars. */
    statusBars;
    /** @type {Coin[]} Collectable coins. */
    coins;
    /** @type {Bottle[]} Collectable bottles lying around. */
    bottles;

    /** @type {number} X coordinate at which the level ends (level boundary). */
    levelEndX = 5400;

    /**
     * @param {Chicken[]} ch - Chickens for this level.
     * @param {Endboss[]} eb - Endboss instances.
     * @param {Cloud[]} cl - Clouds.
     * @param {BackgroundObject[]} bo - Background objects.
     * @param {StatusBar[]} sb - Status bars.
     * @param {Coin[]} coins - Coins to collect.
     * @param {Bottle[]} bott - Bottles to collect.
     */
    constructor(ch, eb, cl, bo, sb, coins, bott) {
        this.chickens = ch;
        this.endboss = eb;
        this.clouds = cl;
        this.backgroundObjects = bo;
        this.statusBars = sb;
        this.coins = coins;
        this.bottles = bott;
    }
}
