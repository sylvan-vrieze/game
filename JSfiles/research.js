import { resources,res } from "./resources.js";
import { build } from "./buildings.js";
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
    storage: new research("storage",0,"allows for storing large amounts of resources",[res.knowledge],[75],() => researches.func.do([researches.milling,build.wharehouse],["none"],["none"],researches.storage)),
    mining: new research("mining",1,"allows for extraction of new resources",[res.knowledge],[100],() =>researches.func.do([researches.smelting,build.mine],[res.copperOre,res.coal],["none"],researches.mining)), 
    smelting: new research("smelting",2,"allows for turning ore in to usable material",[res.knowledge],[150],() => researches.func.do([build.smeltery,researches.ironWorking],[res.copperIngot],["none"],researches.smelting)), 
    ironWorking: new research("iron working",3,"",[res.knowledge],[250],() => researches.func.do([researches.woodProcessing],[res.ironOre,res.ironIngot],[[2,res.ironOre,0.05,"none",0],[4,res.ironIngot,0.005,res.ironOre,0.1],[4,"none",0,res.coal,0.2]],researches.ironWorking)),
    trade: new research("trade",4,"allows for trading with other civilizations",[res.knowledge],[450],() => researches.func.do(["none"],[res.gold],[[2,res.gold,0.01,"none",0]],researches.trade)), 
    milling: new research("milling",5,"",[res.knowledge],[500],() => researches.func.do([build.windmill],["none"],["none"],researches.milling)),
    woodProcessing: new research("wood processing",6,"",[res.knowledge],[400],() => researches.func.do([build.sawmill,build.charcoalKiln],["none"],["none"],researches.woodProcessing)),
    func: {
        do: (button,resource,prodComp,research) => {
            if(func.checkCost(research.cost.resource,research.cost.amount)) {
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
            func.tooltip.visibilityOff
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