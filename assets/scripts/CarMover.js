const Dir = cc.Enum({
  Left: 0,
  Right: 1
})
const Car = cc.Class({
    extends: cc.Component,

    properties: {
      direction: {
        default: 0,
        tooltip: '运动方向，0为左，1为右'
      },
      speed: 30,
      carName: '',
    },
    statics: {
      Dir,
    },
    start () {
      D.Car = Car;
      this.anim = this.getComponent(cc.Animation);
      this.init();
    },
    update(dt){
      if(this.direction === Dir.Right){
        if (this.node.getBoundingBoxToWorld().xMin > D.windowSize.width) {
          D.carPool.l1.despawn(this)
          return;
        }
        this.node.x += this.speed * dt;
      }
    },

    init(){
      this.node.active = true;
      if(this.direction === Dir.Right){
        this.anim.play(this.carName+'-go-right');
      }
    },
});
