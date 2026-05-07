class Level {

    chickens;
    endboss;
    clouds;
    backgroundObjects;
    statusBars;
    coins;
    bottles;

    levelEndX = 5400;

    constructor(ch, eb, cl, bo, sb, coins, bott) {
        this.chickens = ch;
        this.endboss = eb;
        this.clouds = cl;
        this.backgroundObjects = bo;
        this.statusBars = sb;
        this.coins = coins;
        this.bottles = bott;
    }
}