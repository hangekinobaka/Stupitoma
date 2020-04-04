
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
      cc.director.preloadScene("Entry", function () {
        cc.director.preloadScene("Main", function () {
          cc.director.loadScene('Entry');
        });
      });
    }
});
