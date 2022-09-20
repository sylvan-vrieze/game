import { resources } from "./resources.js";
import { func } from "../main.js";
function nation(id,name,selling,buying) {
    this.id = id
    this.name = name
    this.selling = selling
    this.buying = buying
}
function unit(id,name,CUamount,Mamount,COamount,resourceCost) {
    this.id = id
    this.name = name
    this.amount = {
        current:CUamount,
        max:Mamount,
    },
    this.cost = {
        amount:COamount,
        resource:resourceCost,
    }
}
const warfare = {
    nations: {
        nation1: new nation(0,"nation1",[resources.food,resources.wood,resources.stone],[resources.coal]),
        nation2: new nation(1,"nation2",[resources.coal],[resources.food,resources.copperOre]),
        nation3: new nation(2,"nation3",[resources.copperIngot,resources.ironIngot],[resources.fur]),
    },
    units : {
        warrior: new unit(0,"warrior",0,10,[25],[resources.copperIngot]),
        archer: new unit(1,"archer",0,5,[5,20],[resources.copperIngot,resources.wood]),
    },
    func: {
        createNation: (curNation) => {
            const nation = document.createElement("div")
            nation.id = curNation.name
            nation.innerHTML =`<div>${curNation.name}</div>`
            for(var i = 0; i < 2; i++ ) {
                let part = ["buying","selling"]
                let items = ""
                for(var I = 0; I < curNation[part[i]].length; I++) {
                    if (curNation[part[i]].length == 1 || (I+1) == curNation[part[i]].length) {
                        items += `${curNation[part[i]][I].name} `
                    } else {
                        items += `${curNation[part[i]][I].name}, `
                    }
                }
                nation.innerHTML += `<div class="nationText"> ${part[i]}: ${items}</div>`
            }
            func.getId("nations").appendChild(nation)
            nation.classList.add("nationCard")
            warfare.func.createNationButtons(curNation)
        },
        createNationButtons: (curNation) => {
            const diplomacy = document.createElement("div")
            diplomacy.id = `${curNation.name}diplomacy`
            diplomacy.innerHTML = "diplomacy"
            func.getId(`${curNation.name}`).appendChild(diplomacy)
            func.addClass(`${curNation.name}diplomacy`,"button")

            const attack = document.createElement("div")
            attack.id = `${curNation.name}attack`
            attack.innerHTML = "attack"
            func.getId(`${curNation.name}`).appendChild(attack)
            func.addClass(`${curNation.name}attack`,"button")
        },
        createUnitUI: (curUnit) => {
            const unit = document.createElement("div")
            unit.id = `${curUnit.name}`
            unit.innerHTML = `<div id="${curUnit.name}Text">train ${curUnit.name}</div><div id="${curUnit.name}Amount">0/${curUnit.amount.max}</div>`
            func.getId("army").appendChild(unit)
            func.addClass(`${curUnit.name}`,"unitButton")
            func.addClass(`${curUnit.name}Text`,"unitText")
            func.addClass(`${curUnit.name}Amount`,"unitAmount")
            func.getId(`${curUnit.name}`).addEventListener("click",function(){warfare.func.trainUnit(curUnit)})
        },
        trainUnit: (unit) => {
            if(unit.amount.current == unit.amount.max) {
                if(func.checkCost(unit.cost.resource,unit.cost.amount) == 1) {
                    unit.amount.current += 1
                    func.getId(`${unit.name}Amount`).innerHTML = `${unit.amount.current}/${unit.amount.max}`
                }
            }
        }
    },
}
export { warfare }