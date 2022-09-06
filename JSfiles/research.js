import { resources } from "./resources.js";
import { buildings } from "./buildings.js";
import { func,addProdAndComp,market } from "../main.js";
import { upgrades } from "./upgrade.js";
function research(name,id,explanation,CType,CAmount,effect) {
    this.name = name;
    this.id = id;
    this.explanation = explanation;
    this.cost = {
        type:CType,
        amount:CAmount,
    }
    this.effect = effect;
}
const researches = {
    storage: new research("storage",0,"allows for storing large amounts of resources",[resources.knowledge],[75],function() {researches.func.do([researches.milling,buildings.wharehouse],["none"],["none"],researches.storage,[resources.knowledge],[75])}),
    mining: new research("mining",1,"allows for extraction of new resources",[resources.knowledge],[100],function() {researches.func.do([researches.smelting,buildings.mine],[resources.copperOre,resources.coal],["none"],researches.mining,[resources.knowledge],[100])}), 
    smelting: new research("smelting",2,"allows for turning ore in to usable material",[resources.knowledge],[150],function() {researches.func.do([buildings.smeltery,researches.ironWorking],[resources.copperIngot],["none"],researches.smelting,[resources.knowledge],[150])}), 
    ironWorking: new research("iron working",3,"",[resources.knowledge],[250],function() {researches.func.do([researches.woodProcessing],[resources.ironOre,resources.ironIngot],[[2,resources.ironOre,0.05,"none",0],[4,resources.ironIngot,0.005,resources.ironOre,0.1],[4,"none",0,resources.coal,0.2]],researches.ironWorking,[resources.knowledge],[250])}),
    trade: new research("trade",4,"allows for trading with other civilizations",[resources.knowledge],[450],function(){researches.func.do(["none"],[resources.gold],[[2,resources.gold,0.01,"none",0]],researches.trade,[resources.knowledge],[450])}), 
    milling: new research("milling",5,"",[resources.knowledge],[500],function(){researches.func.do([buildings.windmill],["none"],["none"],researches.milling,[resources.knowledge],[500])}),
    woodProcessing: new research("wood processing",6,"",[resources.knowledge],[400],function(){researches.func.do([buildings.sawmill,buildings.charcoalKiln],["none"],["none"],researches.woodProcessing,[resources.knowledge],[400])}),
    func: {
        do: (button,resource,prodComp,research,costR,costA) => {
            if(func.checkCost(costR,costA) == 1) {
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