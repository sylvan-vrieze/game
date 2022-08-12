import { checkCost,changeModifier } from "../main.js";
import { resources } from "./resources.js";
import { jobs } from "./jobs.js";
import { researches } from "./research.js";
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
const buildings = {
    farm: new building("farm",0,"production",0,[5],1.2,[resources.wood],[jobs.farmer],[1],["none"],[0],["none"],[0]),
    lumberjackHut: new building("lumberjack hut",1,"production",0,[10],1.2,[resources.wood],[jobs.lumberjack],[1],["none"],[0],["none"],[0]),
    quarry: new building("quarry",2,"production",0,[10],1.2,[resources.wood],[jobs.qaurryworker],[1],["none"],[0],["none"],[0]),
    library: new building("library",3,"storage",0,[50,25],1.4,[resources.wood,resources.stone],[jobs.librarian],[1],[resources.knowledge],[100],[resources.knowledge],[0.2]),
    simpleHut: new building("simple hut",4,"housing",0,[15,5],1.2,[resources.wood,resources.stone],["none"],[0],[resources.population],[5],["none"],[0]),
    mine: new building("mine",5,"production",0,[15,10],1.2,[resources.wood,resources.stone],[jobs.miner],[1],["none"],[0],["none"],[0]),
    coalMine: new building("coal mine",6,"production",0,[15,10],1.2,[resources.wood,resources.stone],[jobs.coalminer],[1],["none"],[0],["none"],[0]),
    smeltery: new building("smeltery",7,"production",0,[10,30],1.3,[resources.wood,resources.stone],[jobs.smelter],[1],["none"],[0],["none"],[0]),
    wharehouse: new building("wharehouse",8,"storage",0,[40,40],1.4,[resources.wood,resources.stone],["none"],[0],[resources.food,resources.wood,resources.stone,resources.copperOre,resources.coal,resources.copperIngot,resources.ironOre,resources.ironIngot,resources.gold],[500,500,500,500,500,250,500,250,100],["none"],[0]),
    sawmill: new building("sawmill",9,"production",0,[10],1.2,[resources.wood],["none"],[0],["none"],[0],[resources.wood],[0.2]),
    func: {
        researchUlocked: false,
        changeBuildingAmount: (building,op) => {
            if(building.amount != 0 || op == "+") {
                if(op == "+") {
                    if(checkCost(building.cost.resource,building.cost.cost) != 1) { return };
                }
                building.amount = operations[op](building.amount,1);
                if(building.job.type[0] != "none") {
                    for(var i = 0; i < building.job.type.length; i++) {
                        building.job.type[i].max = operations[op](building.job.type[i].max,1);
                        jobs.func.add(building.job.type[i]);
                    }
                }
                if(building.storage.type[0] != "none") {
                    for(var s = 0; s < building.storage.type.length; s++) {
                        var storeRes = building.storage.type[s];
                        if (storeRes.unlocked == true) {
                            storeRes.storageLimit = operations[op](storeRes.storageLimit,building.storage.amount[s]);
                            getId(`${storeRes.name}Max`).innerHTML = `/${storeRes.storageLimit}`;
                        }
                    }
                }
                if(building.modifier.type[0] != "none") {
                    changeModifier(building.modifier.type,building.modifier.multiplier,op);
                }
                for(var i = 0; i < building.cost.cost.length; i++) {
                    switch(op){ 
                        case"+": var costOp = "*"; break; 
                        case"-": var costOp = ":"; building.cost.resource[i].amount += building.cost.cost[i]*0.75 ; break; 
                    }
                    building.cost.cost[i] = Math.round((operations[costOp](building.cost.cost[i],building.cost.multiplier))*10) / 10;
                }
                getId(`${building.name}Count`).innerHTML = `${building.amount}`;
                editTooltip("building",building);
                if(building == buildings.library && researchUlocked == false ) {
                    addtab("research");
                    createButton(researches.storage);
                    createButton(researches.mining);
                    createButton(researches.trade);
                    researchUlocked = true;
                }  
            }   
        },
    }
}
export { buildings,building };