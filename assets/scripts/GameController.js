cc.Class({
  extends: cc.Component,

  properties: {

  },

  onLoad() {
    D.windowSize = cc.view.getVisibleSize();
    console.log('screen size: ', D.windowSize)
  },

});
