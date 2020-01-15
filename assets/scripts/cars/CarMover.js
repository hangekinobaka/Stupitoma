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
    speed: 100,
    carName: '',
    _line: 0,
    _side: null,
  },
  statics: {
    Dir,
  },
  start() {
    D.Car = Car;
    this.anim = this.getComponent(cc.Animation);
    this.yMin = this.node.getBoundingBoxToWorld().yMin + 20;
    // // 获取碰撞检测系统
    // var manager = cc.director.getCollisionManager();
    // // 默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
    // manager.enabled = true;

    // 计算轮子转速
    const wheelSpeed = this.speed / 100

    // 播放转轮动画
    const animState =  this.anim.play('roll-wheel');
    animState.speed = wheelSpeed;
    this.init();
  },
  update(dt) {
    // 判断方向移动车辆
    if (this.direction === Dir.Right) {
      if (this.node.getBoundingBoxToWorld().xMin > D.windowSize.width) {
        this.destroySelf();
        return;
      }
      this.node.x += this.speed * dt;
    } else {
      if (this.node.getBoundingBoxToWorld().xMax < 0) {
        this.destroySelf();
        return;
      }
      this.node.x -= this.speed * dt;
    }

    // 判断toma是否已通过
    if (!this.tomaPassed) {
      this.ifTomaHasPassed();
    }
  },
  onDestroy(){
    this.cancelListener()
  },

  init() {
    this.node.active = true;

    this.tomaPassed = false;
    this.node.zIndex = 5 - this._line;

    this.registerEvent();
  },
  destroySelf() {
    this.cancelListener();
    D.carManager.destroyCar(this, this._line);
  },
  ifTomaHasPassed() {
    if (this.yMin < D.toma.node.getBoundingBoxToWorld().yMin) {
      this.tomaPassed = true;
      this.node.zIndex = this.node.zIndex+100;
    }
  },
  _tomaBackHandler(){
    this.tomaPassed = false;
    this.node.zIndex = 5 - this._line;
  },
  registerEvent() {
    // 添加toma是否回来的事件捕捉
    D.toma.node.on('tomaBack', this._tomaBackHandler, this)
  },
  cancelListener() {
    D.toma.node.off('tomaBack', this._tomaBackHandler, this);
  },
  setLine(l) {
    this._line = l;
  },
  getLine() {
    return this._line;
  },
  // 检测车辆在哪一侧
  whichSide(){

  }
});
