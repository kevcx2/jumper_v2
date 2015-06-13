window.onload = function () {
  var game = new Phaser.Game();

  game.state.add('Boot', App.Boot);
  game.state.add('Preload', App.Preload);
  game.state.add('MainMenu', App.MainMenu);
  game.state.add('Game', App.Game);
  // game.state.add('End', App.End);

  game.state.start('Boot');
};
