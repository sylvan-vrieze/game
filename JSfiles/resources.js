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
const food = new resource(0,"food",0,0,0,500,1,true,0.001);
const wood = new resource(1,"wood",0,0,0,500,1,true,0.001);
const stone = new resource(2,"stone",0,0,0,500,1,true,0.001);
const copperOre = new resource(3,"copper ore",0,0,0,500,1,false,0.0015);
const coal = new resource(4,"coal",0,0,0,500,1,false,0.0015); 
const copperIngot = new resource(5,"copper ingot",0,0,0,250,1,false,0.0025); 
const knowledge = new resource(6,"knowledge",0,0,0,100,1,true,0);
const population = new resource(7,"population",0,"none","none",10,1,true,0);
const ironOre = new resource(8,"iron ore",0,0,0,500,1,false,0.002);
const ironIngot = new resource(9,"iron ingot",0,0,0,250,1,false,0.0045);
const gold = new resource(10,"gold",0,0,0,100,1,false,0);
export { food,wood,stone,copperOre,coal,copperIngot,knowledge,population,ironOre,ironIngot,gold }