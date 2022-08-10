import { resources } from "./resources.js";
import { lumberjack,qaurryworker,miner,coalminer,smelter,farmer,librarian } from "./jobs.js";
function building(name,id,type,amount,cost,costmultiplier,resourceCost,jobType,jobAmount,Stype,SAmount,Mtype,Mmultiplier) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.cost = {
        cost:cost,
        multiplier:costmultiplier,
        resource:resourceCost,
    }
    this.job = {
        type:jobType,
        amount:jobAmount
    }
    this.storage = {
        type:Stype,
        amount:SAmount,
    }
    this.modifier = {
        type:Mtype,
        multiplier:Mmultiplier,
    }
}
const farm = new building("farm",0,"production",0,[5],1.2,[resources.wood],[farmer],[1],["none"],[0],["none"],[0]);
const lumberjackHut = new building("lumberjack hut",1,"production",0,[10],1.2,[resources.wood],[lumberjack],[1],["none"],[0],["none"],[0]);
const quarry = new building("quarry",2,"production",0,[10],1.2,[resources.wood],[qaurryworker],[1],["none"],[0],["none"],[0]);
const library = new building("library",3,"storage",0,[50,25],1.4,[resources.wood,resources.stone],[librarian],[1],[resources.knowledge],[100],[resources.knowledge],[0.2]);
const simpleHut = new building("simple hut",4,"housing",0,[15,5],1.2,[resources.wood,resources.stone],["none"],[0],[resources.population],[5],["none"],[0]);
const mine = new building("mine",5,"production",0,[15,10],1.2,[resources.wood,resources.stone],[miner],[1],["none"],[0],["none"],[0]);
const coalMine = new building("coal mine",6,"production",0,[15,10],1.2,[resources.wood,resources.stone],[coalminer],[1],["none"],[0],["none"],[0]);
const smeltery = new building("smeltery",7,"production",0,[10,30],1.3,[resources.wood,resources.stone],[smelter],[1],["none"],[0],["none"],[0]);
const wharehouse = new building("wharehouse",8,"storage",0,[40,40],1.4,[resources.wood,resources.stone],["none"],[0],[resources.food,resources.wood,resources.stone,resources.copperOre,resources.coal,resources.copperIngot,resources.ironOre,resources.ironIngot,resources.gold],[500,500,500,500,500,250,500,250,100],["none"],[0]);
const sawmill = new building("sawmill",9,"production",0,[10],1.2,[wood],["none"],[0],["none"],[0],["wood"],[0.2]);
//const = new building("",,0,[],,[""],[""],[],[""],[],[""],[])
export { farm,lumberjackHut,quarry,library,simpleHut,mine,coalMine,smeltery,wharehouse,sawmill,building };