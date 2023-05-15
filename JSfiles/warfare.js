import { res } from "./resources.js";
import { func,market } from "../main.js";
function nation(id,name,selling,buying,UTamount,units,opinion) {
    this.id = id
    this.name = name
    this.selling = selling
    this.buying = buying
    this.army = {
        amount:UTamount, 
        units:units,
    }
    this.opinion = opinion
}
function unit(id,name,CUamount,Mamount,COamount,resourceCost,health,defence,damage) {
    this.id = id
    this.name = name
    this.amount = {
        current:CUamount,
        max:Mamount,
    },
    this.cost = {
        amount:COamount,
        resource:resourceCost,
    },
    this.attributes = {
        health:health,
        defence:defence,
        damage:damage,
    }
}
const units = {
    warrior: new unit(0,"warrior",0,10,[25],[res.copperIngot],20,10,5),
    archer: new unit(1,"archer",0,5,[5,20],[res.copperIngot,res.wood],15,5,10),
}
const warfare = {
    units,
    nations: {
        nation1: new nation(0,"nation1",[res.food,res.wood,res.stone],[res.coal],[10],[units.warrior],0),
        nation2: new nation(1,"nation2",[res.coal],[res.food,res.copperOre],[15,5],[units.warrior,units.archer],0),
        nation3: new nation(2,"nation3",[res.copperIngot,res.ironIngot],[res.fur],[30,20],[units.warrior,units.archer],0),
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
            for(let i = 0; i < 2; i++) {
                let type = ["diplomacy","attack"]
                const button = document.createElement("div") 
                button.id = `${curNation.name}${type[i]}`
                button.innerHTML = `${type[i]}`
                func.getId(`${curNation.name}`).appendChild(button)
                func.addClass(`${curNation.name}${type[i]}`,"button")
                func.onclick(`${curNation.name}${type[i]}`,() => warfare.func[type[i]](curNation))
            }
        },
        createUnitUI: (curUnit) => {
            const unit = document.createElement("div")
            unit.id = `${curUnit.name}`
            unit.innerHTML = `<div id="${curUnit.name}Text">train ${curUnit.name}</div><div id="${curUnit.name}Amount">0/${curUnit.amount.max}</div>`
            func.getId("army").appendChild(unit)
            func.addClass(`${curUnit.name}`,"unitButton")
            func.addClass(`${curUnit.name}Text`,"unitText")
            func.addClass(`${curUnit.name}Amount`,"unitAmount")
            func.onclick(`${curUnit.name}`,() => warfare.func.trainUnit(curUnit))
            func.onhover(`${curUnit.name}`,() => func.tooltip.unit(curUnit))
        },
        diplomacy: (nation) => {
            func.getId("overlay").style.visibility = "visible" 
            func.getId("diplomacy").style.visibility = "visible" 
        },
        attack: (nation) => {
            let availableUnits = []
            for(const unit of Object.entries(warfare.units)) {
                if(unit[1].amount.current > 0) {
                    availableUnits.push(unit[1])
                }
            }
            if(availableUnits.length == 0) { return }
            //---
            let nationAmount = 0
            let nationDef = 0
            let nationDam = 0
            let nationHP = 0
            //---
            let armyAmount = 0
            let armyDef = 0
            let armyDam = 0
            let armyHP = 0
            //---
            //let part = ["defence","damage","health"]
            for(let i = 0; i < nation.army.units.length; i++) {
                nationAmount += nation.army.amount[i]
                nationDef += (nation.army.units[i].attributes.defence * nation.army.amount[i])
                nationDam += (nation.army.units[i].attributes.damage * nation.army.amount[i])
                nationHP += (nation.army.units[i].attributes.health * nation.army.amount[i])
            }
            for(let i = 0; i < availableUnits.length; i++) {
                armyAmount += availableUnits[i].amount.current
                armyDef += (availableUnits[i].attributes.defence * availableUnits[i].amount.current)
                armyDam += (availableUnits[i].attributes.damage * availableUnits[i].amount.current)
                armyHP += (availableUnits[i].attributes.health * availableUnits[i].amount.current)
            }
            console.log(nationAmount)
            let damageTaken = nationDam / (1 + (armyDef / 100))
            let killedUnits = Math.round((damageTaken / 50) * ((nationAmount / armyAmount) * (Math.round(Math.random() * 6))))
            if(killedUnits < 0) { killedUnits = killedUnits * -1 }
            if((armyAmount / 2 ) > killedUnits) {
                for(let i = 0; i < nation.selling.length; i++) {
                    nation.selling[i].amount += nation.selling[i].endProd() * 100 
                }
            }
            if(market.unlocked) {
                for(let i = 0; nation.selling.length; i++) {
                    market.changePrice(nation.selling[i],"*")
                }
                for(let i = 0; nation.buying.length; i++) {
                    market.changePrice(nation.buying[i],":")
                }
            }
            for(let i = 0; i < availableUnits.length; i++) {
                if(availableUnits[i].amount.current <= killedUnits) {
                    availableUnits[i].amount.current = 0
                    killedUnits -= availableUnits[i].amount.current
                    func.getId(`${availableUnits[i].name}Amount`).innerHTML = `${availableUnits[i].amount.current}/${availableUnits[i].amount.max}`
                    continue
                } else if(availableUnits[i].amount.current == 0 || killedUnits == 0) {
                    break
                } else if(availableUnits[i].amount.current > killedUnits) {
                    availableUnits[i].amount.current -= killedUnits
                    func.getId(`${availableUnits[i].name}Amount`).innerHTML = `${availableUnits[i].amount.current}/${availableUnits[i].amount.max}`
                    killedUnits = 0
                }
            }
        },
        trade: () => {

        },
        trainUnit: (unit) => {
            if(unit.amount.current != unit.amount.max && func.checkCost(unit.cost.resource,unit.cost.amount)) {
                unit.amount.current += 1
                func.getId(`${unit.name}Amount`).innerHTML = `${unit.amount.current}/${unit.amount.max}`
                func.addCost(unit.cost.resource,unit.cost.amount)
            }
        },
    },
}
export { warfare }