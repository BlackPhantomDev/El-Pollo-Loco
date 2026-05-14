/**
 * HUD status bar (health, coin, bottle, endboss). The shown image depends on the percentage value.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {

    /** @type {string[]} Image paths for the coin status bar (0% - 100%). */
    COIN_BAR_IMAGES = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ]

    /** @type {string[]} Image paths for the health status bar (0% - 100%). */
    HEALTH_BAR_IMAGES = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    /** @type {string[]} Image paths for the bottle status bar (0% - 100%). */
    BOTTLE_BAR_IMAGES = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ]

    /** @type {string[]} Image paths for the endboss status bar (0% - 100%). */
    ENDBOSS_BAR_IMAGES = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ]

    /** @type {string[]} Currently active image set (one of the *_BAR_IMAGES arrays). */
    IMAGES = [];
    /** @type {string} Path of the image currently displayed. */
    currentStatusBarImage;

    width = 275;
    height = 75;

    /** @type {number} Current fill level in percent (0 - 100). */
    percentage = 100;

    /**
     * @param {string} imgs - Bar type ('health' | 'coin' | 'bottle' | 'endboss').
     * @param {number} percentage - Initial fill level in percent.
     * @param {number} x - X position of the bar on the canvas.
     * @param {number} y - Y position of the bar on the canvas.
     */
    constructor(imgs, percentage, x, y) {
        super();
        this.percentage = percentage;
        this.evaluateImgs(imgs);
        this.checkPercentageAndSetImage();
        this.loadImages(this.IMAGES);
        this.loadImage(this.currentStatusBarImage);
        this.positionX = x;
        this.positionY = y;
    }

    /**
     * Sets the current percentage value without changing the image.
     * @param {number} p - New percentage value.
     */
    setPercentage(p) {
        this.percentage = p;
    }

    /**
     * Selects the image that matches the current percentage step.
     */
    checkPercentageAndSetImage() {
        if (this.percentage >= 100)     this.currentStatusBarImage = this.IMAGES[5];
        else if (this.percentage >= 80) this.currentStatusBarImage = this.IMAGES[4];
        else if (this.percentage >= 60) this.currentStatusBarImage = this.IMAGES[3];
        else if (this.percentage >= 40) this.currentStatusBarImage = this.IMAGES[2];
        else if (this.percentage >= 20) this.currentStatusBarImage = this.IMAGES[1];
        else if (this.percentage >= 1)  this.currentStatusBarImage = this.IMAGES[1];
        else                            this.currentStatusBarImage = this.IMAGES[0];
    }

    /**
     * Selects the image set that should be used based on bar type.
     * @param {string} imgs - Bar type ('health' | 'coin' | 'bottle' | 'endboss').
     */
    evaluateImgs(imgs) {
        const map = {
            health:  this.HEALTH_BAR_IMAGES,
            coin:    this.COIN_BAR_IMAGES,
            bottle:  this.BOTTLE_BAR_IMAGES,
            endboss: this.ENDBOSS_BAR_IMAGES,
        };
        this.IMAGES = map[imgs] ?? this.IMAGES;
    }

    /**
     * Switches the bar type and refreshes the displayed image.
     * @param {string} imgs - Bar type ('health' | 'coin' | 'bottle' | 'endboss').
     */
    updateStatusBar(imgs) {
        this.evaluateImgs(imgs);
        this.checkPercentageAndSetImage();
        this.loadImage(this.currentStatusBarImage);
    }

    /**
     * Reduces the percentage by the given amount and refreshes the image.
     * @param {number} val - Amount to subtract from the current percentage.
     * @param {string} imgs - Bar type ('health' | 'coin' | 'bottle' | 'endboss').
     */
    updatePercentage(val, imgs) {
        this.percentage = this.percentage - val;
        this.updateStatusBar(imgs);
    }
}
