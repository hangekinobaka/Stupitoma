cc.Class({
  extends: cc.Component,

  properties: {

  },

  onLoad() {
    cc.view.resizeWithBrowserSize(true);
    // cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
    this.getSize();

    cc.view.setResizeCallback(()=> {
      this.getSize();
    });
  },

  getSize() {
    D.windowSize = cc.view.getVisibleSize();
    console.log('screen size: ', D.windowSize)
  }

});
