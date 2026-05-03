class StatusBar extends DrawableObject {

    COIN_BAR_IMAGES = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ]

    HEALTH_BAR_IMAGES = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    BOTTLE_BAR_IMAGES = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ]

    ENDBOSS_BAR_IMAGES = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ]

    IMAGES = [];
    currentStatusBarImage;

    width = 275;
    height = 75;

    percentage = 100;

    constructor(imgs, percentage, x, y) {
        super();
        this.percentage = percentage;
        this.evaluateImgs(imgs);
        this.checkPercentageAndSetImage();
        this.loadImages(this.IMAGES);
        this.loadImage(this.currentStatusBarImage);
        this.positionX = x;
        this.positionY = y;
    }

    setPercentage(p) {
        this.percentage = p;
    }

    checkPercentageAndSetImage() {
        if (this.percentage >= 100)     this.currentStatusBarImage = this.IMAGES[5];
        else if (this.percentage >= 80) this.currentStatusBarImage = this.IMAGES[4];
        else if (this.percentage >= 60) this.currentStatusBarImage = this.IMAGES[3];
        else if (this.percentage >= 40) this.currentStatusBarImage = this.IMAGES[2];
        else if (this.percentage >= 20) this.currentStatusBarImage = this.IMAGES[1];
        else if (this.percentage >= 1)  this.currentStatusBarImage = this.IMAGES[1];
        else                            this.currentStatusBarImage = this.IMAGES[0];
    }

    evaluateImgs(imgs) {
        switch (imgs) {
            case 'health':
                this.IMAGES = this.HEALTH_BAR_IMAGES;
                break;
            case 'coin':
                this.IMAGES = this.COIN_BAR_IMAGES;
                break;
            case 'bottle':
                this.IMAGES = this.BOTTLE_BAR_IMAGES;
                break;
            case 'endboss':
                this.IMAGES = this.ENDBOSS_BAR_IMAGES;
                break;
            default:
                break;
        }
    }

    updateStatusBar(imgs) {
        this.evaluateImgs(imgs);
        this.checkPercentageAndSetImage();
        this.loadImage(this.currentStatusBarImage);
    }

    updatePercentage(val, imgs) {
        this.percentage = this.percentage - val;
        this.updateStatusBar(imgs);
    }
}