const Pool = require("Pool")
cc.Class({
  extends: Pool,

  properties: {
  },
  onLoad(){
  },
  start() {

  },
  spawnCar(prefab, compType, spawnPos, parent,line){
    this.spawn(prefab, compType, spawnPos, parent,(comp)=>{
      if (!comp) {
        // console.log('新建对象')
        comp = cc.instantiate(prefab).getComponent(compType);
        comp.setLine(line);
      } else {
        // console.log('从对象池中取出')
        comp.init();
      }
      return comp
    })
  }
});
