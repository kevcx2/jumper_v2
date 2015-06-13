App.Game = function (game) {
    this.targets;
    this.platforms;
    this.circle;
    this.score;
    this.addPlats = false;
    this.topPlat = 0;
    this.topTarg = 0;
    this.targDist = -80;
    this.targDistRange = -60;
    this.platDist = -40;
    this.platDistRange = -100;
    this.playerOnCameraY = 5/6;
    this.debugStatus = false;
};

App.Game.prototype = {

  create: function () {
    App.game.camera.bounds = null;
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.platforms = this.add.group();
    this.targets = this.add.group();

    //create 20 platforms
    this.addPlatforms(20, App.game.width / 2);

    this.circle = new Player(this, 'circle');
    this.circle.setPos(
      this.platforms.getFirstAlive().x,
      this.platforms.getFirstAlive().y
    );

    this.physics.arcade.enable(this.circle);
    this.add.existing(this.circle);

    this.score = this.add.text(0, 0, "Score: " + this.circle.score,
      { font: "18px Arial", fill: "#fff", align: "left" }
    );
  },

  addPlatforms: function(num, x, y) {
    for(var i = 0; i < num; i++) {
      this.platRangeStartY = this.topTarg + this.platDist;
      this.platRangeLengthY = (Math.random() * this.platDistRange);
      this.topPlat = this.platRangeStartY + this.platRangeLengthY;

      var platform = this.platforms.create(x, y || this.topPlat, 'square');
      this.addTarget(platform);

      platform.anchor.set(0.5, 0.5);
      this.physics.arcade.enable(platform);
    }
  },

  addTarget: function(platform) {
    randX = App.game.width/2 + 10 + (Math.random() * (App.game.width/2 - 50));
    randY = platform.y + this.targDist + (Math.random() * this.targDistRange);
    this.topTarg = randY;

    var target = this.targets.create(randX, randY, 'triangle');
    this.physics.arcade.enable(target);

    target.mirror = this.targets.create(App.game.width - target.x - target.height, target.y, 'triangle');
    this.physics.arcade.enable(target.mirror);
  },

  checkLanding: function(circle, platforms){
    this.circle.landed = false;
    var jumpStatus = false;
    this.platforms.forEach( function (platform) {
      if (Phaser.Rectangle.intersects(this.circle.body, platform.body)) {
        jumpStatus = true;
        this.shrinkPlatform(platform);
      }
      else if (this.circle.y < platform.y) {
        platform.alive = false;
      }
    }.bind(this));
    //check to make sure circle has jumped OK AND it collected a target on the jump
    jumpStatus = jumpStatus && this.circle.target;
    this.circle.target = false;

    return jumpStatus;
  },

  checkTarget: function(circle, targets) {
    this.targets.forEach( function (target) {
      if (Phaser.Rectangle.intersects(this.circle.body, target.body)) {
        this.circle.target = true;
        this.circle.burst();
        target.mirror.destroy();
        target.destroy();
      }
    }.bind(this));
  },

  deleteTargets: function() {
    this.targets.forEach( function (target) {
      if (target.y > App.game.camera.y + App.game.height) {
        this.targets.remove(target, true);
      }
    }, this);
  },

  deletePlats: function() {
    this.platforms.forEach( function (platform) {
      if (platform.y > App.game.camera.y + App.game.height) {
        this.platforms.remove(platform, true);
      }
    }, this);
  },

  updateScore: function() {
    this.score.text = "Score: " + this.circle.score;
    this.score.x = App.game.camera.x;
    this.score.y = App.game.camera.y;
  },

  updatePlats: function() {
    if ((this.circle.score % 10 === 0) && (this.addPlats === true)) {
      // console.log('add plats');
      this.addPlatforms(10, App.game.width / 2);
      this.addPlats = false;
    }
    else if (this.circle.score % 10 === 1) {
      this.addPlats = true;
    }
  },

  resetGame: function() {
    // console.log('reset');

    this.platforms.removeAll(true);
    this.targets.removeAll(true);
    this.circle.resetState();

    //create starting platform
    this.addPlatforms(1, this.circle.x, this.circle.y);
    //create 20 platforms
    this.addPlatforms(20, App.game.width / 2);
  },

  shrinkPlatform: function (platform) {
    var shrink = this.add.tween(platform);
    shrink.to({ alpha: 0 }, 2000);
    shrink.start();
    platform.alive = false;

    shrink.onComplete.add(function (plat) {
      if (this.circle.y > plat.y - plat.height) {
        this.resetGame();
      }
      plat.destroy();
    }, this);
  },

  update: function () {
    App.game.camera.y = this.circle.y - (App.game.height * this.playerOnCameraY) + (this.circle.height / 2);

    if (this.circle.landed) {
      if (!this.checkLanding(this.circle, this.platforms)) {
        this.resetGame();
      }
    }
    if (this.circle.jumping) {
      this.checkTarget(this.circle, this.targets);
    }

    this.updateScore();
    this.updatePlats();
    this.deletePlats();
    this.deleteTargets();

    console.log('num platforms: ' + this.platforms.children.length);
    console.log('num targets: ' + this.targets.children.length);
  },

  render: function () {
    //debug render info
    if (this.debugStatus) {
      App.game.debug.cameraInfo(App.game.camera, 32, 32);
      App.game.debug.spriteCoords(this.circle, 32, App.game.height - 100);
    }
  },

};
