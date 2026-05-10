class Chicken extends MoveableObject {

    width = 80;
    height = 80;

    offsetX = 5;
    offsetY = 5;
    offsetW = 10;
    offsetH = 5;

    positionY = 550;
    positionX = 450 + (Math.random() * 4000); 

    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];
    
    constructor() {
        super();
        this.loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(['assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png']);
        this.animate(150, this.IMAGES_WALKING);
        this.speed = 0.15 + (Math.random() * 0.25);
        this.moveLeft();
        this.checkHealth();
    }

    checkHealth() {
        setInterval(() => {
            if (this.health == 0 && !this.isDead) {
                this.speed = 0;
                this.isDead = true;
                clearInterval(this.animationInterval);
                setTimeout(() => {
                    this.img = this.imageCache['assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];
                }, 100);
            }
        }, 10);
    }

}