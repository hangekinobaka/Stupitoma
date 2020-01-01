const carType = require('./cars/CarMover')
const State = cc.Enum({
  None: 0,
  Walk: 1,
  LeftWatch: 2,
  RightWatch: 3,
  Dead: 4
})

cc.Class({
  extends: cc.Component,

  properties: {
    collision:  {
      default: false,
      tooltip: '是否检测碰撞'
    },
    mask:  {
      default: false,
      tooltip: '是否打开视觉障碍'
    },
    speed: 10,
    touchLeft: cc.Node,
    touchRight: cc.Node,
    maskLeft: cc.Node,
    maskRight: cc.Node,

    state: {
      default: State.None,
      type: State,
      visible: false
    }
  },
  onLoad(){
    D.toma = this;
  },
  start() {
    this.anim = this.getComponent(cc.Animation);
    this.node.zIndex = 10;
    // 获取碰撞检测系统
    var manager = cc.director.getCollisionManager();
    // 默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
    manager.enabled = this.collision;

    this.maskLeftAnim = this.maskLeft.getComponent(cc.Animation);
    this.maskRightAnim = this.maskRight.getComponent(cc.Animation);

    // 首次初始化
    this.init();
  },
  update(dt) {
    switch (this.state) {
      case State.Walk:
        this.node.y += this.speed * dt;
        break;
      case State.None:
      case State.Dead:
      default:
        break;
    }

    if(this.node.getBoundingBoxToWorld().yMin > D.windowSize.height){
      this.goBack();
    }
  },
  // 当碰撞产生的时候调用
  onCollisionEnter: function (other, self) {

    const group = cc.game.groupList[other.node.groupIndex];
    switch (group) {
      case 'car':
        // bump
        // 获取肇事车辆脚本组件
        const otherCar = other.getComponent(carType)
        if(this.state === State.Dead){
          setTimeout(() => {
            this.anim.play('toma-die-after')
          }, 300);
          break;
        }
        if(otherCar.direction === D.Car.Dir.Right)
          this.die('l');
        else
          this.die('r')

        D.game.gameOver();
        break;
      default:
        break;
    }
  },

  // toma的初始化
  init() {
    if(this.mask){
      this.maskLeftAnim.play("fadein")
      this.maskRightAnim.play("fadein")
    }

    this.anim.play('toma-idle');
    this.node.zIndex = 10;
    this.registerTouch();
    this.goBack()
  },
  // 前进动作
  walk() {
    this.setState(State.Walk)
    this.anim.play('toma-go-middle');

    // mask control
    this.toggleMask(-1)
  },
  // 转向动作
  turnLeft() {
    if (this.state !== State.LeftWatch) {
      this.setState(State.LeftWatch);
      this.anim.play('toma-turn-left');
    }

    // mask control
    this.toggleMask(0)
  },
  turnRight() {
    if (this.state !== State.RightWatch) {
      this.setState(State.RightWatch);
      this.anim.play('toma-turn-right');
    }

    // mask control
    this.toggleMask(1)
  },
  // 显示和隐藏mask动作
  toggleMask(dir){
    // dir 1 右边 0 左边 -1 全部隐藏 2 全部显示
    if(this.mask){
      switch(dir){
        case 1:
          this.maskLeft.opacity = 255;
          this.maskRight.opacity = 0;
          break;
        case 0:
          this.maskRight.opacity = 255;
          this.maskLeft.opacity = 0;
          break;
        case -1:
          this.maskLeft.opacity = 255;
          this.maskRight.opacity = 255;
          break;
        case 2:
        default:
          this.maskLeft.opacity = 0;
          this.maskRight.opacity = 0;
          break;
      }
    }
  },

  // 注册屏幕左右touch事件
  registerTouch() {
    // 键盘事件
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (e) => {
      switch (e.keyCode) {
        case cc.macro.KEY.left:
          this.turnLeft()
          break;
        case cc.macro.KEY.right:
          this.turnRight()
          break;
        default:
          break
      }
    }, this.node);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (e) => {
      switch (e.keyCode) {
        case cc.macro.KEY.left:
          if (this.state === State.LeftWatch)
            this.walk();
          break;
        case cc.macro.KEY.right:
          if (this.state === State.RightWatch)
            this.walk();
          break;
        default:
          this.walk();
          break
      }
    }, this.node);

    // touch 事件
    this.touchLeft.on(cc.Node.EventType.TOUCH_START, () => {
      this.turnLeft();
    })
    this.touchLeft.on(cc.Node.EventType.TOUCH_END, () => {
      if (this.state === State.LeftWatch)
        this.walk();
    })
    this.touchRight.on(cc.Node.EventType.TOUCH_START, () => {
      this.turnRight();
    })
    this.touchRight.on(cc.Node.EventType.TOUCH_END, () => {
      if (this.state === State.RightWatch)
        this.walk();
    })
  },
  // 取消屏幕左右touch事件
  cancelTouch() {
    // 键盘事件
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);

    // touch 事件
    this.touchLeft.off(cc.Node.EventType.TOUCH_START);
    this.touchLeft.off(cc.Node.EventType.TOUCH_END);
    this.touchRight.off(cc.Node.EventType.TOUCH_START)
    this.touchRight.off(cc.Node.EventType.TOUCH_END)
  },
  setState(val){
    if(val !== this.state){
      this.state = val;
    }
  },
  goBack(){
    this.node.y = 0
    this.node.emit('tomaBack')
  },
  die(dir){
    // mask control
    this.toggleMask(2)

    const animName = `toma-${dir}die`
    this.state = State.Dead;
    this.anim.play(animName);
    this.cancelTouch();
  },
  onDieOver(){
    this.node.zIndex = 1;
  }
});
