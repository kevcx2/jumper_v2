App.MainMenu = function (game) {};

App.MainMenu.prototype = {

  create: function () {
    this.mainTitle = this.add.sprite(this.world.centerX, this.world.height * (1/3), 'mainTitle');
    this.mainTitle.anchor.set(0.5);


    this.startButton = this.add.button(this.world.centerX, this.world.height * (2/3), 'startButton', this.startGame, this);
    this.startButton.anchor.set(0.5);
  },

  startGame: function () {
    this.state.start('Game');
  }

};
