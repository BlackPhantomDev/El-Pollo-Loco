/**
 * Final boss of the level — a large chicken with walk, alert, attack, hurt and death animations.
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {

    positionX = 4500;
    positionY = 190;

    width = 420;
    height = 480;

    /** @type {number} Horizontal speed in pixels per frame. */
    speed = 1;

    /** @type {boolean} Whether the endboss is currently in the walking phase. */
    isWalking = false;

    /** @type {string[]} Frames for the walking animation. */
    IMAGES_WALK = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ]

    /** @type {string[]} Frames for the alert (default) animation. */
    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ]

    /** @type {string[]} Frames for the attack animation. */
    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ]

    /** @type {string[]} Frames for the hurt animation. */
    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ]

    /** @type {string[]} Frames for the death animation. */
    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ]

    /**
     * Pre-loads every animation set and starts the idle/walk behaviour loop.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.startBehaviour();
    }

    /**
     * Starts the alert animation, the random state scheduler and the movement loop.
     * Movement is paused while the endboss is in its hurt state.
     */
    startBehaviour() {
        this.animate(200, this.IMAGES_ALERT);
        this.scheduleStateChange();
        this.movementInterval = setInterval(() => {
            if (this.isWalking && !this.isHurt && this.health > 0) this.positionX -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Schedules the next idle <-> walking flip after a random delay (3-5 seconds).
     */
    scheduleStateChange() {
        const delay = Math.random() * 2000 + 3000;
        this.stateChangeTimeout = setTimeout(() => {
            this.toggleWalkingState();
            this.scheduleStateChange();
        }, delay);
    }

    /**
     * Flips the walking state and swaps to the matching animation. While hurt
     * the animation swap is skipped so the hurt sprite isn't overridden.
     */
    toggleWalkingState() {
        this.isWalking = !this.isWalking;
        if (this.isHurt) return;
        if (this.isWalking) this.animate(180, this.IMAGES_WALK);
        else this.enterAlert();
    }

    /**
     * Pauses movement during the hurt animation, then resumes the walk or alert
     * animation depending on the current walking state. Overrides the base
     * implementation which always resumed alert.
     */
    endbossGetHurted() {
        this.isHurt = true;
        clearTimeout(this.hurtTimeout);
        this.hurtTimeout = setTimeout(() => {
            this.isHurt = false;
            if (this.isWalking) this.animate(180, this.IMAGES_WALK);
            else this.enterAlert();
        }, 600);
    }

    /**
     * Starts the alert animation and plays the alert sound once.
     */
    enterAlert() {
        this.animate(200, this.IMAGES_ALERT);
        const sound = this.world?.chickenAlertSound;
        if (!sound) return;
        sound.currentTime = 0;
        sound.play();
    }
}
