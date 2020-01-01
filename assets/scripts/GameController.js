require('global')
cc.Class({
  extends: cc.Component,

  properties: {
    dieMenu:cc.Node,
  },

  onLoad() {
    cc.view.resizeWithBrowserSize(true);
    // cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
    this.getSize();

    cc.view.setResizeCallback(()=> {
      this.getSize();
    });
    D.game = this;

    // get comps
    this.dieMenuAnim = this.dieMenu.getComponent(cc.Animation)
  },

  getSize() {
    D.windowSize = cc.view.getVisibleSize();
    console.log('screen size: ', D.windowSize)
  },

  onRestart(){
    D.carManager.init();

    this.dieMenu.active = false;

    D.toma.init();
  },

  gameOver(){
    setTimeout(() => {
      this.dieMenu.active = true;
      this.dieMenuAnim.play('slide-down');
    }, 1000);
  }

});
