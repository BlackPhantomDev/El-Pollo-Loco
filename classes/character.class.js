/**
 * The playable main character "Pepe".
 * Handles input-driven movement, animations, sounds and interactions with the world.
 * @extends MoveableObject
 */
class Character extends MoveableObject {

    /** @type {string[]} Frames for the short idle animation. */
    IMAGES_IDLE = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /** @type {string[]} Frames for the long idle (sleeping) animation. */
    IMAGES_LONG_IDLE = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /** @type {string[]} Frames for the walking animation. */
    IMAGES_WALK = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    /** @type {string[]} Frames for the jumping animation. */
    IMAGES_JUMP = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    /** @type {string[]} Frames for the hurt animation. */
    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {string[]} Frames for the death animation. */
    IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    speed = 5;
    speedY = 0;

    width = 120;
    height = 240;

    positionY = 190;
    positionX = 50;

    /** @type {World} Reference to the world instance. */
    world;
    /** @type {Keyboard} Reference to the keyboard input state. */
    keyboard;

    /** @type {boolean} Whether the character sprite is currently flipped horizontally. */
    isCharacterFlipped = false;
    /** @type {HTMLAudioElement} Looping footstep sound played while walking. */
    walkingSound;
    /** @type {HTMLAudioElement} Snoring sound played during long idle. */
    snoringSound;
    /** @type {number} Timestamp of the last user-triggered movement, used to detect long idle. */
    lastMoveTime = Date.now();

    /** @type {number} Current bottle ammunition. */
    bottleAmount = 3;
    /** @type {number} Number of coins collected. */
    coinsCollected = 0;

    offsetX = 24;
    offsetY = 108;
    offsetW = 60;
    offsetH = 120;

    /**
     * Loads all character images, applies gravity, starts the input loop and sets up audio.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]);

        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.evaluateKeyPresses();
        this.setAudios();
    }

    /**
     * Starts a 60 FPS loop that reacts to keyboard input, updates animations and camera.
     * Skipped once the character is dead so death cannot be interrupted by input.
     */
    evaluateKeyPresses() {
        this.keyInterval = setInterval(() => {
            if (this.health === 0) return;
            this.checkIsCharacterWalking();
            this.checkIsCharacterJumping();
            let images = this.setAnimationArrays();

            this.startAnimation(images);
            this.world.cameraX = -this.positionX + this.width;
        }, 1000 / 60);
    }

    /**
     * Initialises the audio assets used by the character.
     */
    setAudios() {
        this.walkingSound = new Audio('assets/audio/footsteps.wav');
        this.walkingSound.loop = true;
        this.walkingSound.volume = 0.8;
        this.jumpSound = new Audio('assets/audio/jump.mp3');
        this.hurtSound = new Audio('assets/audio/hurt.mp3');
        this.snoringSound = new Audio('assets/audio/snoring.mp3');
    }

    /**
     * Returns true if exactly one walking key (A or D) is pressed (not both, not none).
     * @returns {boolean}
     */
    checkWalkingKeys() {
        return (this.world.keyboard.KEY_A || this.world.keyboard.KEY_D) &&
            (this.world.keyboard.KEY_A !== this.world.keyboard.KEY_D);
    }

    /**
     * Triggers a jump when the jump key is currently held down.
     */
    checkIsCharacterJumping() {
        if (this.world.keyboard.SPACE || this.world.keyboard.KEY_W) this.jump();
    }

    /**
     * Applies walking movement and manages the walking sound playback.
     */
    checkIsCharacterWalking() {
        if (this.checkWalkingKeys()) {
            this.applyWalking();
            if (!this.isAboveGround()) this.walkingSound.play();
            else this.walkingSound.pause();
        } else {
            this.walkingSound.pause();
            this.walkingSound.currentTime = 0;
        }
    }

    /**
     * Selects which animation array should currently be played based on character state.
     * @returns {string[]} The image array for the current state.
     */
    setAnimationArrays() {
        if (this.isAboveGround()) return this.IMAGES_JUMP;
        else if (this.checkWalkingKeys()) return this.IMAGES_WALK;
        else if (Date.now() - this.lastMoveTime > 5000) return this.IMAGES_LONG_IDLE;
        else return this.IMAGES_IDLE;
    }

    /**
     * Performs a jump if the character is on the ground.
     */
    jump() {
        if (!this.isAboveGround() && this.speedY <= 0) {
            this.lastMoveTime = Date.now();
            this.walkingSound.pause();
            this.jumpSound.currentTime = 0;
            this.jumpSound.play();
            this.speedY = 25;
        }
    }

    /**
     * Checks whether the character is currently stomping on an enemy from above.
     * @param {MoveableObject} mo - Enemy object to check against.
     * @returns {boolean} True if a stomp hit is occurring.
     */
    isStompingOn(mo) {
        const myFeetBottom = this.positionY + this.offsetY + (this.height - this.offsetH);
        const enemyTop = mo.positionY + (mo.offsetY ?? 0);
        return this.isAboveGround() && this.speedY < 0 && myFeetBottom <= enemyTop + 24;
    }

    /**
     * Applies horizontal walking based on key state and level bounds.
     * @returns {string[]} The walking image array (kept for API symmetry).
     */
    applyWalking() {
        this.lastMoveTime = Date.now();
        const currentSpeed = this.isAboveGround() ? this.speed * 0.7 : this.speed;
        if (this.world.keyboard.KEY_D && this.positionX < this.world.level.levelEndX) {
            this.positionX += currentSpeed;
            this.isCharacterFlipped = false;
        }
        if (this.world.keyboard.KEY_A && this.positionX > 0) {
            this.positionX -= currentSpeed;
            this.isCharacterFlipped = true;
        }
        return this.IMAGES_WALK;
    }

    /**
     * Starts the given animation only if it differs from the currently running one.
     * Also handles snoring playback for the long idle animation.
     * @param {string[]} images - Image array to animate.
     */
    startAnimation(images) {
        if (this.isHurt) return;
        if (this.currentAnimationImages === images) return;
        this.currentAnimationImages = images;
        this.playAnimationByType(images);
        this.handleSnoring(images);
    }

    /**
     * Plays the jump animation once and loops all other animations.
     * @param {string[]} images - Image array to animate.
     */
    playAnimationByType(images) {
        if (images === this.IMAGES_JUMP) {
            this.animateOnce(120, images);
            return;
        }
        const interval = images === this.IMAGES_WALK ? 100 : 150;
        this.animate(interval, images);
    }

    /**
     * Starts or stops the snoring sound depending on the current animation.
     * @param {string[]} images - Image array currently animating.
     */
    handleSnoring(images) {
        if (images === this.IMAGES_LONG_IDLE) {
            this.snoringSound.play();
            return;
        }
        this.snoringSound.pause();
        this.snoringSound.currentTime = 0;
    }

    /**
     * Plays the hurt sound and locks animations for a short time after taking damage.
     * Overrides the inherited method to add sound handling.
     */
    characterGetHurted() {
        this.isHurt = true;
        this.lastMoveTime = Date.now();
        this.snoringSound.pause();
        this.snoringSound.currentTime = 0;
        this.hurtSound.currentTime = 0;
        this.hurtSound.play();
        setTimeout(() => {
            this.isHurt = false;
            this.currentAnimationImages = null;
            if (this.checkWalkingKeys()) this.animate(100, this.IMAGES_WALK);
            else this.animate(150, this.IMAGES_IDLE);
        }, 600);
    }

    /**
     * Silences the walking and snoring sounds, plays the final hurt sound in
     * sync with the death animation, then delegates to the inherited death
     * handling (animation + game over).
     * @override
     */
    applyDeath(statusBar, barType) {
        this.walkingSound?.pause();
        if (this.walkingSound) this.walkingSound.currentTime = 0;
        this.snoringSound?.pause();
        if (this.snoringSound) this.snoringSound.currentTime = 0;
        if (this.hurtSound) {
            this.hurtSound.currentTime = 0;
            this.hurtSound.play();
        }
        super.applyDeath(statusBar, barType);
    }
}
