const mini = require('./cars/carMini')
const run = require('./cars/carRun')
const truck = require('./cars/carTruck')
const car = require('./cars/CarMover')


cc.Class({
  extends: cc.Component,

  properties: {
    carPrefabs: [cc.Prefab],
    playground: cc.Node,
    spawnInterval: 5,
    _cars:[],
    _lineNum: 4,
    _schedulers:[]
  },
  onLoad(){
    D.carManager = this;
    // Has to be inited here, don't know why
    this._lineNum = 4

  },
  start(){
    this.init()

  },

  init(){
    this._schedulers.forEach(func => {
      this.unschedule(func)
    });
    this._schedulers = []

    const list = [...this.playground.children]
    list.forEach(c => {
      if(c.name.substr(0,3) === 'car'){
        c.getComponent(car).destroySelf();
      }
    });
    this._cars = []

    this.spawn()
  },

  spawn(){
    // Predict two cars
    for(let i=0; i<this._lineNum; i++){
      const newArr = new Array()
      this._cars.push(newArr)
      this.randPick(i+1)
      this.randPick(i+1)
    }
    // Schedule the car spawn
    for(let i=0; i<this._lineNum; i++){
      setTimeout(() => {
        this.spawnCar(i+1);
        const func = ()=>this.spawnCar(i+1)
        this._schedulers.push(func)
        this.schedule(func, this.spawnInterval);
      }, 300 * i);
    }
  },

  destroyCar(car,line){
    D.carPool['l'+line].despawn(car)
  },
  spawnCar(line){
    this.randPick(line)
    // run cannot follow other cars rather than run
    // truck cannot be followed by other cars rather than truck
    if(!(this._cars[line-1][1].comp!==run && this._cars[line-1][2].comp===run)){
      if(!(this._cars[line-1][0].comp===truck && this._cars[line-1][1].comp!==truck)){
        const car = this._cars[line-1][1]
        D.carPool['l'+line].spawnCar(car.prefab,car.comp,
          (line%2) ? cc.v2(D.windowSize.width+this.node.width/2,200+160*(line-1)) : cc.v2(0,200+160*(line-1)), // start from different side
          this.playground,line)
      }
    }

    this._cars[line-1].shift();
  },
  // Randomlly pick up a car type from the prefab
  randPick(line){
    const num = Math.floor((Math.random()*10)+1);
    let car = {};
    if(num <= 6){
      if(line%2===0){
        car.prefab = this.carPrefabs[0];
        car.comp = mini;
      }else{
        car.prefab = this.carPrefabs[1];
        car.comp = mini;
      }
    }else if(num <= 8){
      if(line%2===0){
        car.prefab = this.carPrefabs[2];
        car.comp = run;
      }else{
        car.prefab = this.carPrefabs[3];
        car.comp = run;
      }
    }else{
      if(line%2===0){
        car.prefab = this.carPrefabs[4];
        car.comp = truck;
      }else{
        car.prefab = this.carPrefabs[5];
        car.comp = truck;
      }
    }

    this._cars[line-1].push(car)
  }
});
