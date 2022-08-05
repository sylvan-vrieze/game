import { wood,copperIngot } from "./resources.js";
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
const strongerAxe = new upgrade("Stronger Axe",0,"Stronger axes allow for faster cutting",[wood],[0.20],[copperIngot],[50],function(){if(checkCost([copperIngot],[50]) == 1) {changeModifier([wood],[0.20],"+");removeElement("Stronger Axe")}});
const basicWeapons = new upgrade("basic weapons",1,"Basic weapons allow for hunting and warfare",["none"],["none"],[copperIngot],[125],function(){if(checkCost([copperIngot],[125]) == 1) {createWarvareTab()}});
export { strongerAxe,basicWeapons } ;