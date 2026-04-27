class Level {

    enemies;
    clouds;
    backgroundObjects;
    levelEndX = 5400;

    constructor(e, c, bo) {
        this.enemies = e;
        this.clouds = c;
        this.backgroundObjects = bo;
    }
}