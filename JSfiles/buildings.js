import { func } from "../main.js";
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
    farm: new building("farm",0,"production",0,[5],[resources.resource.wood],1.2,[jobs.job.farmer],[1],["none"],[0],["none"],[0]),
    lumberjackHut: new building("lumberjack hut",1,"production",0,[10],[resources.resource.wood],1.2,[jobs.job.lumberjack],[1],["none"],[0],["none"],[0]),
    quarry: new building("quarry",2,"production",0,[10],[resources.resource.wood],1.2,[jobs.job.qaurryworker],[1],["none"],[0],["none"],[0]),
    library: new building("library",3,"storage",0,[50,25],[resources.resource.wood,resources.resource.stone],1.4,[jobs.job.librarian],[1],[resources.resource.knowledge],[100],[resources.resource.knowledge],[0.2]),
    simpleHut: new building("simple hut",4,"housing",0,[15,5],[resources.resource.wood,resources.resource.stone],1.3,["none"],[0],[resources.resource.population],[5],["none"],[0]),
    mine: new building("mine",5,"production",0,[15,10],[resources.resource.wood,resources.resource.stone],1.2,[jobs.job.miner,jobs.job.coalminer],[1,1],["none"],[0],["none"],[0]),
    smeltery: new building("smeltery",6,"production",0,[10,30],[resources.resource.wood,resources.resource.stone],1.3,[jobs.job.smelter],[1],["none"],[0],["none"],[0]),
    wharehouse: new building("wharehouse",7,"storage",0,[40,40],[resources.resource.wood,resources.resource.stone],1.4,["none"],[0],[resources.resource.food,resources.resource.wood,resources.resource.stone,resources.resource.copperOre,resources.resource.coal,resources.resource.copperIngot,resources.resource.ironOre,resources.resource.ironIngot,resources.resource.gold],[500,500,500,500,500,250,500,250,100],["none"],[0]),
    sawmill: new building("sawmill",8,"production",0,[100,10],[resources.resource.wood,resources.resource.ironIngot],1.4,["none"],[0],["none"],[0],[resources.resource.wood],[0.1]),
    charcoalKiln: new building("charcoal kiln",9,"production",0,[25,75],[resources.resource.wood,resources.resource.stone],1.3,[jobs.job.charcoalMaker],[1],["none"],[0],["none"],[0]),
    windmill: new building("windmill",10,"production",0,[125,50],[resources.resource.wood,resources.resource.stone],1.3,["none"],[0],["none"],[0],[resources.resource.food],[0.10]),
    huntersLodge: new building("hunters lodge",11,"production",0,[75,],[resources.resource.wood,],1.3,[jobs.job.hunter],[1],[resources.resource.fur],[100],["none"],[0]),
    func: {
        researchUnlocked: false,
        changeAmount: (building,op) => {
            if(building.amount != 0 || op == "+") {
                if(op == "-" || func.checkCost(building.cost.resource,building.cost.amount) == 1) {
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
                        func.changeModifier(building.modifier.type,building.modifier.amount,op);
                    }
                    switch(op){ 
                        case"+": var costOp = "*"; op = "-"; break; 
                        case"-": var costOp = ":"; op = "+"; break; 
                    }
                    for(var i = 0; i < building.cost.resource.length; i++) {
                        building.cost.resource[i].amount = func.operations[op](building.cost.resource[i].amount,building.cost.amount[i])
                        building.cost.amount[i] = Math.round((func.operations[costOp](building.cost.amount[i],building.cost.multiplier))*10) / 10;
                    }
                    func.getId(`${building.name}Count`).innerHTML = `${building.amount}`;
                    func.tooltip.building(building);
                    if(building == buildings.library && buildings.func.researchUnlocked == false ) {
                        func.create.tab("research");
                        func.create.button(researches.storage);
                        func.create.button(researches.mining);
                        func.create.button(researches.trade);
                        buildings.func.researchUnlocked = true;
                    }
                }
            }   
        },
    }
}
export { buildings };