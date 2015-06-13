App.Preload = function (game) {};

App.Preload.prototype = {
  preload: function () {
    this.preloadLogo = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadLogo');
    this.preloadLogo.anchor.set(0.5);

    this.load.image('circle', 'assets/img/circle.png');
    this.load.image('square', 'assets/img/square.png');
    this.load.image('triangle', 'assets/img/triangle.png');
    this.load.image('particle', 'assets/img/particle.png');
    this.load.image('burst', 'assets/img/burst.png');
    this.load.image('mainTitle', 'assets/img/main_title.png');
    this.load.image('startButton', 'assets/img/start_button.png');
  },

  create: function () {
    this.state.start('MainMenu');  
  }
};
