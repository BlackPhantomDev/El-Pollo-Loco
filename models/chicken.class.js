class Chicken extends MoveableObject {

    width = 80;
    height = 80;

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
        this.animate(150, this.IMAGES_WALKING);

        this.speed = 0.15 + (Math.random() * 0.25);

        this.moveLeft();
    }


}