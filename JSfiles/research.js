import { resources } from "./resources.js";
import { buildings } from "./buildings.js";
import { createButton,addProdAndComp,removeElement,addtab,checkCost,market } from "../main.js";
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
    storage: new research("storage",0,"allows for storing large amounts of resources",[resources.knowledge],[75],function() {researches.func.do([buildings.wharehouse],["none"],["none"],researches.storage,[resources.knowledge],[75])}),
    mining: new research("mining",1,"allows for extraction of new resources",[resources.knowledge],[100],function() {researches.func.do([researches.smelting,buildings.mine,buildings.coalMine],[resources.copperOre,resources.coal],["none"],mining,[resources.knowledge],[100])}), 
    smelting: new research("smelting",2,"allows for turning ore in to usable material",[resources.knowledge],[150],function() {researches.func.do([buildings.smeltery,researches.ironWorking],[resources.copperIngot],["none"],researches.smelting,[resources.knowledge],[150])}), 
    ironWorking: new research("iron working",3,"make new metals by combining others",[resources.knowledge],[250],function() {researches.func.do(["none"],[resources.ironOre,resources.ironIngot],[[2,resources.ironOre,0.05,"none",0]],researches.ironWorking,[resources.knowledge],[250])}),
    trade: new research("trade",4,"allows for trading with other civilizations",[resources.knowledge],[450],function(){researches.func.do(["none"],[resources.gold],[[2,resources.gold,0.01,"none",0]],researches.trade,[resources.knowledge],[450])}), 
    func: {
        do: (button,resource,prodComp,research,costR,costA) => {
            if(checkCost(costR,costA) == 1) {
                if(button[0] != "none") {
                    for(var i = 0; i < button.length; i++) { createButton(button[i]); }
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
                    case smelting: researches.func.createWorkshop(); break;
                    case trade: market.create(); break;
                }
                removeElement(research.name);
            }
        },
        createWorkshop: () => {
            addtab("upgrade");
            createButton(upgrades.strongerAxe);
            createButton(upgrades.basicWeapons);
        }
    },
}
export { researches }