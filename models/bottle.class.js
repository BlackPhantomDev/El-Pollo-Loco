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
   
    positionX = 100;
    positionY = 200;
   
    width = 100;
    height = 100;
   
    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.throwBottle(x, y);
    }

    throwBottle(x ,y) {
        this.positionX = x;
        this.positionY = y;
        this.speedY = 10;
        this.applyGravity();
        setInterval(() => {
            this.positionX += 10;
        }, 25);
    }
    
}