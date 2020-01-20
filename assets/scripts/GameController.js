require('global')
cc.Class({
  extends: cc.Component,

  properties: {
    dieMenu:cc.Node,
    playgrounds:[cc.Node],
    gameScore:cc.Node,
    menuScore:cc.Node,
    highScore:cc.Node
  },

  onLoad() {
    cc.view.resizeWithBrowserSize(true);
    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
    this.getSize();

    cc.view.setResizeCallback(()=> {
      this.getSize();
    });
    D.game = this;
    D.playgrounds = this.playgrounds
    // get comps
    this.dieMenuAnim = this.dieMenu.getComponent(cc.Animation)
    this._menuScoreLabel = this.menuScore.getComponent(cc.Label)
    this._highScoreLabel = this.highScore.getComponent(cc.Label)
  },

  getSize() {
    D.windowSize = cc.view.getVisibleSize();
    console.log('screen size: ', D.windowSize)
  },

  onRestart(){
    D.carManager.init();

    this.gameScore.opacity = 255;
    this.dieMenu.active = false;

    D.toma.init();
  },

  gameOver(){
    this._menuScoreLabel.string = "Score: " + D.score;
    const high = Math.max(D.score, D.highScore);
    D.highScore = high;
    this._highScoreLabel.string = "Best: " + high;
    setTimeout(() => {
      this.gameScore.opacity = 0;
      this.dieMenu.active = true;
      this.dieMenuAnim.play('slide-down');
    }, 1000);
  }

});
