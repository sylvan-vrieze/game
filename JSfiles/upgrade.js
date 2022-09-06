import { resources } from "./resources.js";
import { buildings } from "./buildings.js";
import { func,changeModifier } from "../main.js";
import { warfare } from "./warfare.js";
function upgrade(name,id,explanation,MType,MAmount,CType,CAmount,effect) {
    this.name = name;
    this.id = id;
    this.explanation = explanation;
    this.modifier = {
        type:MType,
        amount:MAmount,
    }
    this.cost = {
        type:CType,
        amount:CAmount,
    }
    this.effect = effect;
}
const upgrades = {
    copperAxe: new upgrade("copper axe",0,"Stronger axes allow for faster cutting",[resources.wood],[0.20],[resources.copperIngot],[50],function(){if(func.checkCost([resources.copperIngot],[50]) == 1) {changeModifier([resources.wood],[0.20],"+");func.removeElement("copper axe")}}),
    copperHoe: new upgrade("copper hoe",1,"",[resources.food],[0.20],[resources.copperIngot],[40],function(){if(func.checkCost([resources.copperIngot],[50]) == 1) {changeModifier([resources.food],[0.20],"+");func.removeElement("copper hoe")}}),
    basicWeapons: new upgrade("basic weapons",2,"Basic weapons allow for hunting and warfare",["none"],["none"],[resources.copperIngot],[125],function(){if(func.checkCost([resources.copperIngot],[125]) == 1) {upgrades.func.createWarvareTab(); func.create.button(buildings.huntersLodge); resources.func.createUI(resources.fur); func.removeElement("basic weapons");}}),
    func: {
        createWarvareTab: () => {
            func.create.tab("warfare");
            const armytab = document.createElement("div")
            armytab.id = "amry" 
            armytab.classList.add("section")
            func.getId("warfare content").appendChild(armytab)
            
        //--------------------------------------------------------------
            const nationtab = document.createElement("div")
            nationtab.id = "nations"
            nationtab.classList.add("section")
            func.getId("warfare content").appendChild(nationtab)
            warfare.func.createNation(warfare.nations.nation1)
        }
    }
}
export { upgrades };