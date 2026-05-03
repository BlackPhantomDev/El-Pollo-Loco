class Character extends MoveableObject {

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

    IMAGES_WALK = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];

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

    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    speed = 4;
    speedY = 0;

    width = 100;
    height = 200;

    positionY = 230;
    positionX = 50;

    world;
    keyboard;

    isCharacterFlipped = false;
    walkingSound;

    bottleAmount = 3;

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

    evaluateKeyPresses() {
        setInterval(() => {
            this.checkIsCharacterWalking();
            this.checkIsCharacterJumping();
            let images = this.setAnimationArrays();

            this.startAnimation(images);
            this.world.cameraX = -this.positionX + this.width;
        }, 1000 / 60);
    }

    setAudios() {
        this.walkingSound = new Audio('assets/audio/footsteps.wav');
    }

    checkWalkingKeys() {
        return (this.world.keyboard.KEY_A || this.world.keyboard.KEY_D) && 
            (this.world.keyboard.KEY_A !== this.world.keyboard.KEY_D);
    }

    checkIsCharacterJumping() {
        if (this.world.keyboard.SPACE || this.world.keyboard.KEY_W) this.jump();
    }
    
    checkIsCharacterWalking() {
        if (this.checkWalkingKeys()) {
            this.applyWalking();
            //this.walkingSound.play();
        } else {
            this.walkingSound.pause();
            this.walkingSound.currentTime = 0;
        }
    }

    setAnimationArrays() {
        if (this.isAboveGround()) return this.IMAGES_JUMP; 
        else if (this.checkWalkingKeys()) return this.IMAGES_WALK;
        else return this.IMAGES_IDLE;
    }

    jump() {
        if (!this.isAboveGround() && this.speedY <= 0) {
            this.walkingSound.pause();
            this.speedY = 25;
        }
    }

    applyWalking() {
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

    startAnimation(images) {
        if (this.currentAnimationImages !== images) {
            this.currentAnimationImages = images;
            const interval = (images === this.IMAGES_IDLE || images === this.IMAGES_JUMP) ? 150 : 100;
            this.animate(interval, images);
        }
    }


}
