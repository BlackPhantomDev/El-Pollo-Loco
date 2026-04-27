class MoveableObject {
    positionX = 50;
    positionY;
    img;
    
    width;
    height;

    speed;
    world;
    
    imageCache = {};
    currentImage = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        setInterval(() => {
            this.positionX += this.speed;
        }, 1000 / 60);
    }

    moveLeft() {
        setInterval(() => {
            this.positionX -= this.speed;
        }, 1000 / 60);
    }

    animate(interval, currentAnimationArray) {
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            let i = this.currentImage % currentAnimationArray.length;
            let path = currentAnimationArray[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, interval);
    }

    
}