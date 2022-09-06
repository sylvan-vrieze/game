import { resources } from "./resources.js";
import { func } from "../main.js";
function nation(id,name,selling,buying) {
    this.id = id
    this.name = name
    this.selling = selling
    this.buying = buying
}
const warfare = {
    nations: {
        nation1: new nation(0,"nation1",[resources.food,resources.wood,resources.stone],[resources.coal]),
        nation2: new nation(1,"nation2",[resources.coal],[resources.food,resources.copperOre]),
        nation3: new nation(2,"nation3",[resources.copperIngot,resources.ironIngot],[resources.fur]),
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
            warfare.func.createbuttons(curNation)
        },
        createbuttons: (curNation) => {
            const diplomacy = document.createElement("div")
            diplomacy.id = `${curNation.name}diplomacy`
            diplomacy.innerHTML = "diplomacy"
            func.getId(`${curNation.name}`).appendChild(diplomacy)
            func.getId(`${curNation.name}diplomacy`).classList.add("button")

            const attack = document.createElement("div")
            attack.id = `${curNation.name}attack`
            attack.innerHTML = "attack"
            func.getId(`${curNation.name}`).appendChild(attack)
            func.getId(`${curNation.name}attack`).classList.add("button")
        },
    },
}
export { warfare }