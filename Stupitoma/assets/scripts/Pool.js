cc.Class({
  extends: cc.Component,

  properties: {
    _pool: null,
  },
  ctor(){
    // new Pool
    this._pool = new cc.js.Pool((obj) => {

    }, 5);

    // 分配pool.get
    this._pool.get = this.get
  },
  get(type) {
    for(let i=0; i<this.count; i++){
      const obj = this._get();
      if(obj instanceof type) return obj;
    }
    return undefined
  },
  spawn(prefab, compType, spawnPos, parent,generator=null) {
    let comp = this._pool.get(compType);
    if(generator===null){
      if (!comp) {
        // console.log('新建对象')
        comp = cc.instantiate(prefab).getComponent(compType);
      } else {
        // console.log('从对象池中取出')
      }
    }else{
      comp = generator(comp);
    }

    if (parent) {
      comp.node.parent = parent;
    }
    else {
      this.node.addChild(comp.node);
    }
    if (typeof (spawnPos) !== 'object') {
      comp.node.x = spawnPos;
    } else {
      comp.node.x = spawnPos.x;
      comp.node.y = spawnPos.y;
    }
    comp.node.active = true;
    return comp;
  },

  despawn(comp) {
    comp.node.removeFromParent();
    comp.node.active = false;
    this.putIntoPool(comp);
  },
  // 检查pool是否已满并回收对象
  putIntoPool(comp) {
    let oldCount = this._pool.count;
    this._pool.put(comp);
    if (oldCount < this._pool.count) {
      return true;
    }
    console.warn('pool has been filled, please resize the array length.')
    return false;
  }
});
