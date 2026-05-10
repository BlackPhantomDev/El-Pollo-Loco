class Bottle extends MoveableObject {

    IMAGES_ROTATION = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
   
    positionX = (Math.random() * 4000) + 200;
    positionY = 540;
   
    width = 100;
    height = 100;

    offsetX = 25;
    offsetY = 5;
    offsetW = 50;
    offsetH = 10;
    
    constructor(x, y, flipped) {
        super();
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        if (x !== undefined && y !== undefined) {
            this.throwBottle(x, y, flipped);
        }
    }

    throwBottle(x, y, flipped) {
        this.positionX = flipped ? (x - 50) : (x + 50);
        this.positionY = y;
        this.speedY = 10;
        this.applyGravity();
        this.animate(50, this.IMAGES_ROTATION);
        this.throwInterval = setInterval(() => {
            this.positionX += flipped ? -10 : 10;
        }, 1000 / 60);
    }
    
    bottleHits(enemy, onDone) {
        if (this.hasHit) return;
        this.hasHit = true;

        const targetX = enemy.positionX + ((enemy.width / 4) - (this.width / 4));

        clearInterval(this.throwInterval);
        this.throwInterval = setInterval(() => {
            if (this.positionX < targetX) {
                this.positionX += 10;
            } else {
                clearInterval(this.throwInterval);
                this.animateOnce(100, this.IMAGES_SPLASH, onDone);
                this.speedY = 0;
                this.acceleration = 0;
            }
        }, 1000 / 60);
    }
}