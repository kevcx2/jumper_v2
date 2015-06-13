var App = {};

App.Boot = function (game) {
  App.game = game;
};

App.Boot.prototype = {

  preload: function () {
    this.load.image('preloadLogo', 'assets/img/preloadLogo.png');
  },

  create: function () {
    //deal w mobile scaling here
    this.scale.pageAlignHorizontally = true;
    this.state.start('Preload');
  }
};
