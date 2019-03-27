const Pool = require("Pool")
cc.Class({
  extends: cc.Component,

  properties: {
  },

  start() {
    D.carPool.l1 = new Pool();
    D.carPool.l2 = new Pool();
    D.carPool.l3 = new Pool();
    D.carPool.l4 = new Pool();
  },
});
