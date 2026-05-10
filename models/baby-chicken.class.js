class BabyChicken extends Chicken {

    width = 50;
    height = 45;

    offsetX = 5;
    offsetY = 5;
    offsetW = 10;
    offsetH = 5;

    positionY = 580;

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ]
    
constructor() {
    super();
    this.loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(['assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png']);
    this.animate(150, this.IMAGES_WALKING);
    this.moveLeft();
    this.checkHealth();
}

checkHealth() {
    setInterval(() => {
        if (this.health == 0 && !this.isDead) {
            this.isDead = true;
            clearInterval(this.animationInterval);
            this.img = this.imageCache['assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'];
            this.speed = 0;
        }
    }, 10);
}
}