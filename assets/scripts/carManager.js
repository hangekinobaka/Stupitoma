const mini = require('./cars/carMini')
const run = require('./cars/carRun')


cc.Class({
  extends: cc.Component,

  properties: {
    carPrefabs: [cc.Prefab],
    playground: cc.Node,
    spawnInterval: 5,
    _cars:[],
    _lineNum: 4,
  },
  onLoad(){
    D.carManager = this;
    this._lineNum = 4 // Has to be inited here, don't know why
  },
  start(){
    for(let i=0; i<this._lineNum; i++){
      this.randPick(i%2)
    }
    this.spawnCar();
    this.schedule(this.spawnCar, this.spawnInterval);
  },

  destroyCar(car,line){
    D.carPool['l'+line].despawn(car)
  },
  spawnCar(){
    for(let i=0; i<this._lineNum; i++){
      this.randPick(i%2)
    }
    if(!(this._cars[0].comp===mini && this._cars[0+this._lineNum].comp===run)){
      D.carPool['l1'].spawnCar(this._cars[0].prefab,this._cars[0].comp,cc.v2(0,200),this.playground,1)
    }

    if(!(this._cars[1].comp===mini && this._cars[1+this._lineNum].comp===run)){
      D.carPool['l2'].spawnCar(this._cars[1].prefab,this._cars[1].comp,cc.v2(D.windowSize.width+this.node.width/2,360),this.playground,2)
    }

    if(!(this._cars[2].comp===mini && this._cars[2+this._lineNum].comp===run)){
      D.carPool['l3'].spawnCar(this._cars[2].prefab,this._cars[2].comp,cc.v2(0,520),this.playground,2)
    }

    if(!(this._cars[3].comp===mini && this._cars[3+this._lineNum].comp===run)){
      D.carPool['l4'].spawnCar(this._cars[3].prefab,this._cars[3].comp,cc.v2(D.windowSize.width+this.node.width/2,680),this.playground,2)
    }

    this._cars.splice(0,this._lineNum)
  },
  // Randomlly pick up a car type from the prefab
  randPick(dir){
    const num = Math.floor((Math.random()*10)+1);
    let car = {};
    if(num <= 7){
      if(dir===0){
        car.prefab = this.carPrefabs[0];
        car.comp = mini;
      }else{
        car.prefab = this.carPrefabs[1];
        car.comp = mini;
      }
    }else{
      if(dir===0){
        car.prefab = this.carPrefabs[2];
        car.comp = run;
      }else{
        car.prefab = this.carPrefabs[3];
        car.comp = run;
      }
    }

    this._cars.push(car)
  }
});
