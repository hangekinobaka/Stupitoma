const car1 = require('./cars/carMini')

cc.Class({
  extends: cc.Component,

  properties: {
    carPrefabs: [cc.Prefab],
    playground: cc.Node,
    spawnInterval: 5,
  },
  onLoad(){
    D.carManager = this;

  },
  start(){
    this.spawnCar();
    this.schedule(this.spawnCar, this.spawnInterval);
  },

  destroyCar(car,line){
    D.carPool['l'+line].despawn(car)
  },
  spawnCar(){
    D.carPool['l1'].spawnCar(this.carPrefabs[0],car1,cc.v2(0,200),this.playground,1)
    D.carPool['l2'].spawnCar(this.carPrefabs[1],car1,cc.v2(D.windowSize.width+this.node.width/2,360),this.playground,2)
  },
});
