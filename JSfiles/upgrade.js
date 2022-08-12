import { resources } from "./resources.js";
import { checkCost,changeModifier,removeElement,addtab } from "../main.js";
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
    strongerAxe: new upgrade("Stronger Axe",0,"Stronger axes allow for faster cutting",[resources.wood],[0.20],[resources.copperIngot],[50],function(){if(checkCost([resources.copperIngot],[50]) == 1) {changeModifier([resources.wood],[0.20],"+");removeElement("Stronger Axe")}}),
    basicWeapons: new upgrade("basic weapons",1,"Basic weapons allow for hunting and warfare",["none"],["none"],[resources.copperIngot],[125],function(){if(checkCost([resources.copperIngot],[125]) == 1) {upgrades.func.createWarvareTab()}}),
    func: {
        createWarvareTab: () => {
            addtab("warfare");
            removeElement("basic weapons");
        }
    }
}


export { upgrades };