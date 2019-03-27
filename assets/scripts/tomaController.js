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
    speed: 10,
    touchLeft: cc.Node,
    touchRight: cc.Node,

    state: {
      default: State.None,
      type: State,
      visible: false
    }
  },
  start() {
    D.toma = this;
    this.anim = this.getComponent(cc.Animation);
    // 首次初始化
    this.init();
  },
  update(dt) {
    switch (this.state) {
      case State.Walk:
        this.node.y += this.speed * dt;
        break;
      case State.None:
      default:
        break;
    }
  },
  // toma的初始化
  init() {
    this.registerTouch();
  },
  // 前进动作
  walk() {
    this.setState(State.Walk)
    this.anim.play('toma-go-middle');
  },
  // 转向动作
  turnLeft() {
    if (this.state !== State.LeftWatch) {
      this.setState(State.LeftWatch);
      this.anim.play('toma-turn-left');
    }
  },
  turnRight() {
    if (this.state !== State.RightWatch) {
      this.setState(State.RightWatch);
      this.anim.play('toma-turn-right');
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
  setState(val){
    if(val !== this.state){
      this.state = val;
    }
  }
});
