import { knowledge,copperOre,copperIngot,gold,ironOre,ironIngot,coal } from "./resources.js";
import { mine,coalMine,wharehouse,smeltery } from "./buildings.js";
import { doResearch } from "../main.js";
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
const storage = new research("storage",0,"allows for storing large amounts of resources",[knowledge],[75],function() {doResearch([wharehouse],["none"],["none"],storage,[knowledge],[75])});
const mining = new research("mining",1,"allows for extraction of new resources",[knowledge],[100],function() {doResearch([smelting,mine,coalMine],[copperOre,coal],["none"],mining,[knowledge],[100])}); 
const smelting = new research("smelting",2,"allows for turning ore in to usable material",[knowledge],[150],function() {doResearch([smeltery,ironWorking],[copperIngot],["none"],smelting,[knowledge],[150])}); 
const ironWorking = new research("iron working",3,"make new metals by combining others",[knowledge],[250],function() {doResearch(["none"],[ironOre,ironIngot],[[2,ironOre,0.05,"none",0]],ironWorking,[knowledge],[250])});
const trade = new research("trade",4,"allows for trading with other civilizations",[knowledge],[450],function(){doResearch(["none"],[gold],[[2,gold,0.01,"none",0]],trade,[knowledge],[450])}); 
export { storage,mining,smelting,ironWorking,trade }