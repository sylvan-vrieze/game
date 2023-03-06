import { resources,res } from "./resources.js";
import { build } from "./buildings.js";
import { func } from "../main.js";
import { warfare } from "./warfare.js";
function upgrade(name,id,explanation,Mresource,Mamount,Cresource,Camount,effect) {
    this.name = name;
    this.id = id;
    this.explanation = explanation;
    this.modifier = {
        resource:Mresource,
        amount:Mamount,
    }
    this.cost = {
        resource:Cresource,
        amount:Camount,
    }
    this.effect = effect;
}
const upgrades = {
    copperAxe: new upgrade("copper axe",0,"Stronger axes allow for faster cutting",[res.wood],[0.25],[res.copperIngot],[50],() => upgrades.func.get(upgrades.copperAxe)),
    copperHoe: new upgrade("copper hoe",1,"",[res.food],[0.20],[res.copperIngot],[40],() => upgrades.func.get(upgrades.copperHoe)),
    basicWeapons: new upgrade("basic weapons",2,"Basic weapons allow for hunting and warfare",["none"],["none"],[res.copperIngot],[125],() => upgrades.func.get(upgrades.basicWeapons)),
    func: {
        createWarvareTab: () => {
            func.create.tab("warfare");
            const armytab = document.createElement("div")
            armytab.id = "army" 
            armytab.classList.add("section")
            func.getId("warfare content").appendChild(armytab)
            
            const armytext = document.createElement("div")
            armytext.id = "armytext" 
            armytext.innerHTML = "army"
            func.getId("army").appendChild(armytext)
            
            warfare.func.createUnitUI(warfare.units.warrior)
            warfare.func.createUnitUI(warfare.units.archer)
        //--------------------------------------------------------------
            const nationtab = document.createElement("div")
            nationtab.id = "nations"
            nationtab.classList.add("section")
            func.getId("warfare content").appendChild(nationtab)
            warfare.func.createNation(warfare.nations.nation1)
            warfare.func.createNation(warfare.nations.nation2)
            warfare.func.createNation(warfare.nations.nation3)
        },
        get: (upgrade) => {
            if(func.checkCost(upgrade.cost.resource,upgrade.cost.amount) == 1) {
                if(upgrade.modifier.resource != "none") {
                    for(let i = 0; i < upgrade.modifier.resource.length; i++) {
                        func.changeModifier(upgrade.modifier.resource,upgrade.modifier.amount,"+")
                    }
                }
                func.removeElement(upgrade.name)
                switch(upgrade) {
                    case upgrades.basicWeapons: upgrades.func.createWarvareTab(); func.create.button(build.huntersLodge); resources.func.createUI(res.fur); break;
                }
                func.addCost(upgrade.cost.resource,upgrade.cost.amount)
            }
        }
    }
}
export { upgrades };