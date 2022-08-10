import { resources } from "./resources.js"
function job(id,name,active,max,prodType,prodAmount,compType,compAmount,uipresent) {
    this.id = id;
    this.name = name;
    this.active = active;
    this.max = max;
    this.production = {
        type:prodType,
        amount:prodAmount,
    }
    this.comsumption = {
        type:compType,
        amount:compAmount,
    }
    this.uipresent = uipresent; 
}
const lumberjack = new job(0,"lumberjack",0,0,[resources.wood],[0.1],["none"],[0],false);
const qaurryworker = new job(1,"qaurryworker",0,0,[resources.stone],[0.1],["none"],[0],false);
const miner = new job(2,"miner",0,0,[resources.copperOre],[0.1],["none"],[0],false); 
const coalminer = new job(3,"coalminer",0,0,[resources.coal],[0.1],["none"],[0],false);
const smelter = new job(4,"smelter",0,0,[resources.copperIngot],[0.01],[resources.copperOre,resources.coal],[0.2,0.3],false); 
const farmer = new job(5,"farmer",0,0,[resources.food],[0.2],["none"],[0],false); 
const librarian = new job(6,"librarian",0,0,[resources.knowledge],[0.02],["none"],[0],false);
//const = new job(,"",0,0,[""],,[""],[],false)
export { lumberjack,qaurryworker,miner,coalminer,smelter,farmer,librarian }