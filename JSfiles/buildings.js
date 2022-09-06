import { func,changeModifier } from "../main.js";
import { resources } from "./resources.js";
import { jobs } from "./jobs.js";
import { researches } from "./research.js";
function building(name,id,type,amount,Camount,resourceCost,costmultiplier,jobType,jobAmount,Stype,SAmount,Mtype,MAmount) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.cost = {
        amount:Camount,
        resource:resourceCost,
        multiplier:costmultiplier, 
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
        amount:MAmount,
    }
}
const buildings = {
    farm: new building("farm",0,"production",0,[5],[resources.wood],1.2,[jobs.farmer],[1],["none"],[0],["none"],[0]),
    lumberjackHut: new building("lumberjack hut",1,"production",0,[10],[resources.wood],1.2,[jobs.lumberjack],[1],["none"],[0],["none"],[0]),
    quarry: new building("quarry",2,"production",0,[10],[resources.wood],1.2,[jobs.qaurryworker],[1],["none"],[0],["none"],[0]),
    library: new building("library",3,"storage",0,[50,25],[resources.wood,resources.stone],1.4,[jobs.librarian],[1],[resources.knowledge],[100],[resources.knowledge],[0.2]),
    simpleHut: new building("simple hut",4,"housing",0,[15,5],[resources.wood,resources.stone],1.3,["none"],[0],[resources.population],[5],["none"],[0]),
    mine: new building("mine",5,"production",0,[15,10],[resources.wood,resources.stone],1.2,[jobs.miner,jobs.coalminer],[1,1],["none"],[0],["none"],[0]),
    smeltery: new building("smeltery",6,"production",0,[10,30],[resources.wood,resources.stone],1.3,[jobs.smelter],[1],["none"],[0],["none"],[0]),
    wharehouse: new building("wharehouse",7,"storage",0,[40,40],[resources.wood,resources.stone],1.4,["none"],[0],[resources.food,resources.wood,resources.stone,resources.copperOre,resources.coal,resources.copperIngot,resources.ironOre,resources.ironIngot,resources.gold],[500,500,500,500,500,250,500,250,100],["none"],[0]),
    sawmill: new building("sawmill",8,"production",0,[100,10],[resources.wood,resources.ironIngot],1.4,["none"],[0],["none"],[0],[resources.wood],[0.1]),
    charcoalKiln: new building("charcoal kiln",9,"production",0,[25,75],[resources.wood,resources.stone],1.3,[jobs.charcoalMaker],[1],["none"],[0],["none"],[0]),
    windmill: new building("windmill",10,"production",0,[125,50],[resources.wood,resources.stone],1.3,["none"],[0],["none"],[0],[resources.food],[0.10]),
    huntersLodge: new building("hunters lodge",11,"production",0,[75,],[resources.wood,],1.3,[jobs.hunter],[1],[resources.fur],[100],["none"],[0]),
    func: {
        researchUlocked: false,
        changeAmount: (building,op) => {
            if(building.amount != 0 || op == "+") {
                if(op == "+") {
                    if(func.checkCost(building.cost.resource,building.cost.amount) != 1) { return };
                }
                building.amount = func.operations[op](building.amount,1);
                if(building.job.type[0] != "none") {
                    for(var i = 0; i < building.job.type.length; i++) {
                        building.job.type[i].max = func.operations[op](building.job.type[i].max,1);
                        jobs.func.add(building.job.type[i]);
                    }
                }
                if(building.storage.type[0] != "none") {
                    for(var s = 0; s < building.storage.type.length; s++) {
                        var storeRes = building.storage.type[s];
                        if (storeRes.unlocked == true) {
                            storeRes.storageLimit = func.operations[op](storeRes.storageLimit,building.storage.amount[s]);
                            func.getId(`${storeRes.name}Max`).innerHTML = `/${storeRes.storageLimit}`;
                        }
                    }
                }
                if(building.modifier.type[0] != "none") {
                    changeModifier(building.modifier.type,building.modifier.amount,op);
                }
                for(var i = 0; i < building.cost.amount.length; i++) {
                    switch(op){ 
                        case"+": var costOp = "*"; break; 
                        case"-": var costOp = ":"; building.cost.resource[i].amount += building.cost.amount[i]*0.75 ; break; 
                    }
                    building.cost.amount[i] = Math.round((func.operations[costOp](building.cost.amount[i],building.cost.multiplier))*10) / 10;
                }
                func.getId(`${building.name}Count`).innerHTML = `${building.amount}`;
                func.tooltip.edit("building",building);
                if(building == buildings.library && buildings.func.researchUlocked == false ) {
                    func.create.tab("research");
                    func.create.button(researches.storage);
                    func.create.button(researches.mining);
                    func.create.button(researches.trade);
                    buildings.func.researchUlocked = true;
                }  
            }   
        },
    }
}
export { buildings };