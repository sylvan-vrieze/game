import { resources } from "./resources.js";
import { buildings } from "./buildings.js";
import { func,addProdAndComp,market } from "../main.js";
import { upgrades } from "./upgrade.js";
function research(name,id,explanation,Cresource,CAmount,effect) {
    this.name = name;
    this.id = id;
    this.explanation = explanation;
    this.cost = {
        resource:Cresource,
        amount:CAmount,
    }
    this.effect = effect;
}
const researches = {
    storage: new research("storage",0,"allows for storing large amounts of resources",[resources.resource.knowledge],[75],() => researches.func.do([researches.milling,buildings.wharehouse],["none"],["none"],researches.storage)),
    mining: new research("mining",1,"allows for extraction of new resources",[resources.resource.knowledge],[100],() =>researches.func.do([researches.smelting,buildings.mine],[resources.resource.copperOre,resources.resource.coal],["none"],researches.mining)), 
    smelting: new research("smelting",2,"allows for turning ore in to usable material",[resources.resource.knowledge],[150],() => researches.func.do([buildings.smeltery,researches.ironWorking],[resources.resource.copperIngot],["none"],researches.smelting)), 
    ironWorking: new research("iron working",3,"",[resources.resource.knowledge],[250],() => researches.func.do([researches.woodProcessing],[resources.resource.ironOre,resources.resource.ironIngot],[[2,resources.resource.ironOre,0.05,"none",0],[4,resources.resource.ironIngot,0.005,resources.resource.ironOre,0.1],[4,"none",0,resources.resource.coal,0.2]],researches.ironWorking)),
    trade: new research("trade",4,"allows for trading with other civilizations",[resources.resource.knowledge],[450],() => researches.func.do(["none"],[resources.resource.gold],[[2,resources.resource.gold,0.01,"none",0]],researches.trade)), 
    milling: new research("milling",5,"",[resources.resource.knowledge],[500],() => researches.func.do([buildings.windmill],["none"],["none"],researches.milling)),
    woodProcessing: new research("wood processing",6,"",[resources.resource.knowledge],[400],() => researches.func.do([buildings.sawmill,buildings.charcoalKiln],["none"],["none"],researches.woodProcessing)),
    func: {
        do: (button,resource,prodComp,research) => {
            if(func.checkCost(research.cost.resource,research.cost.amount) == 1) {
                if(button[0] != "none") {
                    for(var i = 0; i < button.length; i++) { func.create.button(button[i]); }
                }
                if(resource[0] != "none") {
                    for(var i = 0; i < resource.length; i++) { resources.func.createUI(resource[i]); }
                }
                if(prodComp[0] != "none") {
                    for(var i = 0; i < prodComp.length; i++) {
                        addProdAndComp(prodComp[i][0],prodComp[i][1],prodComp[i][2],prodComp[i][3],prodComp[i][4]);
                    }
                }
                switch(research) {
                    case researches.smelting: researches.func.createWorkshop(); break;
                    case researches.trade: market.create(); break;
                }
                func.addCost(research.cost.resource,research.cost.amount)
                func.removeElement(research.name);
            }
        },
        createWorkshop: () => {
            func.create.tab("upgrade");
            func.create.button(upgrades.copperAxe);
            func.create.button(upgrades.copperHoe)
            func.create.button(upgrades.basicWeapons);
        }
    },
}
export { researches }