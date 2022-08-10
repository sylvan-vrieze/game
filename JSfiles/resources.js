function resource(id,name,amount,production,comsumption,storageLimit,modifier,unlocked,cost) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.production = production;
    this.comsumption = comsumption;
    this.storageLimit = storageLimit;
    this.modifier = modifier;
    this.endProd = function() {
        return (this.production * this.modifier) - this.comsumption; 
    }
    this.unlocked = unlocked;
    this.cost = cost;
}
const resources = {
    food: new resource(0,"food",0,0,0,500,1,true,0.001),
    wood: new resource(1,"wood",0,0,0,500,1,true,0.001),
    stone: new resource(2,"stone",0,0,0,500,1,true,0.001),
    copperOre: new resource(3,"copper ore",0,0,0,500,1,false,0.0015),
    coal: new resource(4,"coal",0,0,0,500,1,false,0.0015),
    copperIngot: new resource(5,"copper ingot",0,0,0,250,1,false,0.0025), 
    knowledge: new resource(6,"knowledge",0,0,0,100,1,true,0),
    population: new resource(7,"population",0,"none","none",10,1,true,0),
    ironOre: new resource(8,"iron ore",0,0,0,500,1,false,0.002),
    ironIngot: new resource(9,"iron ingot",0,0,0,250,1,false,0.0045),
    gold: new resource(10,"gold",0,0,0,100,1,false,0),
}

var resourceArray = [food,wood,stone,copperOre,coal,copperIngot,knowledge,population,ironOre,ironIngot,gold];
export { resources,resourceArray }