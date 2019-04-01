const carPool = require("carPool")
cc.Class({
  extends: cc.Component,

  properties: {
  },
  onLoad(){
    D.carPool.l1 = new carPool();
    D.carPool.l2 = new carPool();
    D.carPool.l3 = new carPool();
    D.carPool.l4 = new carPool();
  },
  start() {

  },
});
