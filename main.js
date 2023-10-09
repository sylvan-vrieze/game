const func = {
    getId: id => document.getElementById(id),
    removeElement: id => func.getId(id).remove(),
    addClass: (id,clas) => func.getId(id).classList.add(clas),
    onclick: (id,funct) => func.getId(id).addEventListener("click",funct), 
    onhover: (id,funct) => func.getId(id).addEventListener("mouseover",funct),
    checkCost: (res,cost) => {
        for(let i = 0; i < res.length; i++) {
            if(res[i].amount < cost[i]) {
                return false;
            } 
        }
        return true;
    },
    addCost: (res,cost) => {
        for(let i = 0; i < res.length; i++) {
            res[i].amount -= cost[i];   
        }
    },
    updateProd: (res) => {
        let resEndProd =  Math.round((res.endProd()*10)*10000)/10000;
        if(res.endProd() >= 0) {
            func.getId(`${res.name}Prod`).innerHTML = `+${resEndProd}/s`;
        } else {
            func.getId(`${res.name}Prod`).innerHTML = `${resEndProd}/s`;
        }
    },
    changeModifier: (res,Amount,op) => {
        for(let i = 0; i < res.length; i++) {
            res[i].modifier = func.operations[op](res[i].modifier,Amount[i]);
            func.updateProd(res[i]);
        }
    },
    operations: {
        "+": (a,b) =>  a + b,
        "-": (a,b) =>  a - b,
        "*": (a,b) =>  a * b,
        ":": (a,b) =>  a / b,
    },
    create: {
        button: item => {
            const button = document.createElement("div");
            button.id = item.name;
            if(item.constructor.name == "building") {
                button.innerHTML = 
                `<div class="buildingBuy" id="${item.name}Buy">
                    <span class="buildingtext">${item.name}</span>
                </div>
                <div class="buildingCount" id="${item.name}Count">0</div>
                <div class="buildingSell"  id="${item.name}Sell">sell</div>`;
                func.getId(`${item.type} ${item.constructor.name}`).appendChild(button);
                func.addClass(item.name,"buildingButton")
                func.onclick(`${item.name}Sell`,() => buildings.func.changeAmount(item,'-'))
                func.onclick(`${item.name}Buy`,() => buildings.func.changeAmount(item,'+')) 
                func.getId(`${item.name}Buy`).addEventListener("mouseenter",func.tooltip.visibilityOn)
                func.getId(`${item.name}Buy`).addEventListener("mouseleave",func.tooltip.visibilityOff)
            } else {
                button.onclick = () => item.effect();
                button.innerHTML = item.name
                func.getId(`${item.constructor.name} content`).appendChild(button);
                func.addClass(item.name,"button");
                button.addEventListener("mouseenter",func.tooltip.visibilityOn)
                button.addEventListener("mouseleave",func.tooltip.visibilityOff)
            }
            button.onmouseover = () => func.tooltip[`${item.constructor.name}`](item);
        },
        tab: name => { 
            const tab = document.createElement("button");
            tab.id = name;
            tab.innerHTML = name;
            tab.onclick = () => openTab(event, `${name} content`);
            func.getId("tab").appendChild(tab);
            func.addClass(name,"tablinks") ;
            
            const tabcontent = document.createElement("div");
            tabcontent.id = `${name} content`;
            func.getId("contentlist").appendChild(tabcontent);
            func.addClass(tabcontent.id,"tabcontent");
        }
    },
    tooltip: {
        gather: () => {func.tooltip.text =  `gather 1 ${resources.resource[event.target.id].name}`,func.tooltip.position(event.target)},
        research: research => {
            func.tooltip.text = `${research.name} <br> ${func.tooltip.cost(research.cost.resource,research.cost.amount)} ${research.explanation}`
            func.tooltip.position(event.target)
        },
        upgrade: upgrade => {
            func.tooltip.text = `${upgrade.name}<br>
            ${func.tooltip.cost(upgrade.cost.resource,upgrade.cost.amount)}
            ${upgrade.explanation}</br>`;
            if(upgrade.modifier.resource[0] != "none") {
                for(let i = 0; i < upgrade.modifier.resource.length; i++) {
                    func.tooltip.text += `increases the production of ${upgrade.modifier.resource[i].name} by ${upgrade.modifier.amount[i]*100}%<br>`
                }
            }
            func.tooltip.position(event.target)
        },
        job: job => {
            func.tooltip.text = `${job.name} <br>`;
            let part = ["production","comsumption","produces","comsumes"]
            for(let i = 0; i < 2; i++) {
                if(job[part[i]].type[0] != "none"){
                func.tooltip.text += part[i+2];
                    for(let j = 0; j < job[part[i]].type.length; j++) {
                        func.tooltip.text += ` ${job[part[i]].amount[j]*10} ${job[part[i]].type[j].name} per second<br>`;
                        if(job[part[i]].type.length > 1 && (j+1) < job[part[i]].type.length) {
                            func.tooltip.text += "and"
                        }
                    }
                }
            }
            func.tooltip.position(event.target)
        },
        building: building => {
            func.tooltip.text = `${building.name} <br>`;
            func.tooltip.text += func.tooltip.cost(building.cost.resource,building.cost.amount);
            if(building.job.type != "none") {
                for(let i = 0; i < building.job.type.length ; i++) {
                    if(i == 0) {
                        func.tooltip.text += `provides ${building.job.amount[i]} ${building.job.type[i].name} job<br>`;
                    } else {
                        func.tooltip.text += `and ${building.job.amount[i]} ${building.job.type[i].name} job<br>`;
                    }
                }
            }
            let part = ["storage","modifier","storage","production"]
            for(let i = 0; i < 2; i++) {
                if(building[part[i]].type != "none" && building[part[i]].type[0].unlocked == true) {
                    func.tooltip.text += `increases ${part[i+2]} for `;
                    for(let j = 0; j < building[part[i]].type.length; j++) {
                        if(i == 0) {
                            if(building[part[i]].type[j].name == "population") {
                                func.tooltip.text.replace( "increases storage for",`increases housing by ${building[part[i]].amount[j]}` );
                            } else {
                                func.tooltip.text += `${building[part[i]].type[j].name} by ${building[part[i]].amount[j]}<br>`;
                            }
                        } else {
                            func.tooltip.text += `${building[part[i]].type[j].name} by ${building[part[i]].amount[j]*100}%<br>`
                        }
                    }
                }
            }
            func.tooltip.position(event.target)
        },
        market: (type,res) => {
            func.tooltip.text = `${res.name}<br>`;
            let amount = func.getId("marketInput").value;
            if(type == "buy") {
                func.tooltip.text += `buy ${amount} <br> cost: ${(Math.round((res.cost.current*amount)*1000)/1000)} gold`;
            } else {
                func.tooltip.text += `sell ${amount} <br> gain: ${(Math.round(((res.cost.current*amount)*0.8)*1000)/1000)} gold`;
            }
            func.tooltip.position(event.target)  
        },
        unit: unit => {
            func.tooltip.text = `${unit.name} <br>`
            func.tooltip.text += func.tooltip.cost(unit.cost.resource,unit.cost.amount)
            func.tooltip.position(event.target)
        },
        cost: (res,cost) => {
            let text = "cost: ";
            for(let i = 0; i < res.length; i++) {
                text += `${cost[i]} ${res[i].name} `;
                if(res.length > 1 && (i+1) < res.length) {
                    text += "and "
                }
            }
            text += "<br>";
            return text;
        },
        position: el => {
            let tooltip = func.getId('tooltip')
            tooltip.style.setProperty("top",(el.getBoundingClientRect().top + el.getBoundingClientRect().height) + 5)
            tooltip.style.setProperty("left",el.getBoundingClientRect().left - (el.getBoundingClientRect().width / 2)) 
        },
        visibilityOff: () => func.getId('tooltip').style.setProperty("visibility","hidden"),
        visibilityOn: () => func.getId('tooltip').style.setProperty("visibility","visible"),
    },
}
export { func }
//-----------------------------------------------------------------------------------------------------------------------------------------
import { resources,res } from "./JSfiles/resources.js"
import { jobs } from "./JSfiles/jobs.js"
import { buildings,build } from "./JSfiles/buildings.js"; 
import { upgrades } from "./JSfiles/upgrade.js";
//----------------------------------------------------------------------------------------------------------------------------------
const market = {
    unlocked: false,
    amount: 0,
    create: () => {
        func.create.tab("market");
        var input = document.createElement("input");
        input.type = "number";
        input.id = "marketInput";
        input.value = 100;
        func.getId("market content").appendChild(input);
        for (const res of Object.values(resources.resource)) {
            if(res.name != "knowledge" && res.name != "population" && res.name != "gold" && res.unlocked == true) {
                market.createUI(res);
            } 
        }
        market.unlocked = true;
    },
    createUI: res => {
        const curDiv = document.createElement("div");
        curDiv.id = `${res.name}`;
        curDiv.innerHTML = `<div class="markettext">${res.name}:</div><button id="${res.name}buy">buy</button><button id="${res.name}sell">sell</button>`;
        func.getId("market content").appendChild(curDiv);
        func.getId(`${res.name}buy`).onclick = () => market.buy(res);
        func.getId(`${res.name}sell`).onclick = () => market.sell(res);
        func.onhover(`${res.name}buy`,() => func.tooltip.market('buy',res))
        func.getId(`${res.name}buy`).addEventListener("mouseenter",func.tooltip.visibilityOn)
        func.getId(`${res.name}buy`).addEventListener("mouseleave",func.tooltip.visibilityOff)
        func.onhover(`${res.name}sell`,() => func.tooltip.market('sell',res));
        func.getId(`${res.name}sell`).addEventListener("mouseenter",func.tooltip.visibilityOn)
        func.getId(`${res.name}sell`).addEventListener("mouseleave",func.tooltip.visibilityOff)
        func.addClass(`${res.name}buy`,"marketButton");
        func.addClass(`${res.name}sell`,"marketButton");
    },
    buy: res => {
        market.amount = Number(func.getId("marketInput").value)
        if(resources.resource.gold.amount >= (res.cost.current*market.amount)) {
            curres.amount += market.amount;
            resources.resource.gold.amount -= (res.cost.current*market.amount);
            market.changePrice(res,"*") 
        }
    },
    sell: res => {
        market.amount = Number(func.getId("marketInput").value)
        if(res.amount >= market.amount) {
            res.amount -= market.amount;
            resources.resource.gold.amount += ((res.cost.current*market.amount)*0.8);
            market.changePrice(res,":") 
        }
    },
    changePrice: (res,op) => {
        let changeMultipler = Math.round((Math.random() * 2)*10)/10
        res.cost.current = func.operations[op](res.cost.current,(1 + ((market.amount / 50000) * changeMultipler)));
        switch (op) {
            case "*": func.tooltip.market('buy',res); break;
            case ":": func.tooltip.market('sell',res); break;
        }
    },
}
export { market }
//----------------------------------------------------------------------------------------------------------------------------------
function changeJobActive(job,op) {
    if(jobs.func.assigned != resources.resource.population.amount && job.max != job.active || op == "-") {
        if(job.active != 0 || op == "+") {
            let part = ["production","comsumption"]
            for(let i = 0; i < 2; i++) {
                if(job[part[i]].type != "none") {
                    for(let j = 0; j < job[part[i]].type.length; j++) {
                        let res = job[part[i]].type[j];
                        res[part[i]] = func.operations[op](res[part[i]],job[part[i]].amount[j]);
                        func.updateProd(res);  
                    }          
                }
            }
            job.active = func.operations[op](job.active,1)
            func.getId(`${job.name}Number`).innerHTML = `${job.active}/${job.max}`;
            jobs.func.updateAssigned(1,op); 
        }  
    }  
}
function addProdAndComp(id,prodRes,prodAmount,compRes,compAmount) {
    let job = Object.values(jobs.job)[id]
    if(prodRes != "none") {
        job.production.type.push(prodRes);
        job.production.amount.push(prodAmount);
        prodRes.production += (prodAmount * job.active);
        func.updateProd(prodRes) 
    }
    if(compRes != "none") {
        job.comsumption.type.push(compRes);
        job.comsumption.amount.push(compAmount);
        compRes.comsumption += (compAmount * job.active);
        func.updateProd(compRes);
    }
}
export { addProdAndComp,changeJobActive }
//---------------------------------------------------------------------------------------------------------------------------------
function autoProduction() {
    for(const res of Object.values(resources.resource)) {
        if(res.unlocked == true) {
            if(res.production != "none") {
                res.amount = Math.round((res.amount + res.endProd()) * 100) / 100;
            }
            if (res.amount < 0) {
                setInactive(res);
            }
            if(res.amount > res.storageLimit) {
                res.amount = res.storageLimit;
            } else if ( 0 > res.amount) {
                res.amount = 0
            }
            func.getId(`${res.name}Amount`).innerHTML = `${res.amount}`;
        }
    }
    tooltipUpdate()
}
function tooltipUpdate() {
    func.getId('tooltip').innerHTML = func.tooltip.text;
}
function setInactive(negRes) {
    for(const job of Object.values(jobs.job)) {
        for(let i = 0; i < job.comsumption.type.length; i++) {
            if(negRes == job.comsumption.type[i]) {
                let part = ["production","comsumption"]
                for(let j = 0; j < 2; j++) {
                    for(let e = 0; e < job[part[j]].type.length; e++) {
                        let res = job[part[j]].type[i];
                        res[part[j]] -= (job[part[j]].amount[e] * job.active);
                        func.updateProd(res);
                    }
                }
                jobs.func.updateAssigned(job.active,"-")
                job.active = 0;
                func.getId(`${jobType.name}Number`).innerHTML = `${job.active}/${job.max}`;
                break;
            }
        }
    }
}
function populationCheck() {
    let population = resources.resource.population
    let food = resources.resource.food
    if(population.storageLimit != population.amount && food.amount > 0) {
        population.amount += 1;
        food.comsumption += 0.1;
        func.getId(`${population.name}Amount`).innerHTML = population.amount;
    } else if(food.amount < 0 && population.amount != 0) {
        population.amount -= 1;
        food.comsumption -= 0.1;
        func.getId(`${population.name}Amount`).innerHTML = population.amount;
    }
    if(jobs.func.tab == true) {
        jobs.func.updateAssigned(0,"+");
    }
    func.updateProd(food);
}
function pricechange() {
    for (const res of Object.values(resources.resource)) {
        var changeMultipler = Math.round((Math.random() * 2)*10)/10
        if(res.cost.current > res.cost.start) {
            res.cost.current = res.cost.current / (1 + (changeMultipler / 10))
        } else if (res.cost.current < res.cost.start) {
            res.cost.current = res.cost.current * (1 + (changeMultipler / 10))
        }
    }
}
let day = 0 
let year = 1
let season = ["spring","summer","autumn","winter"]
let ses = 0
function daycycle() {
    day++
    if(day > 91) {
        day = 1
        ses++
        if(ses > 3) {
            ses = 0
            year++
        }
    }
    func.getId("dateContent").innerHTML = `day ${day} ${season[ses]} year ${year}`
}
setInterval(() => autoProduction(),100);
setInterval(() => populationCheck(),10000);
setInterval(() => pricechange(),60000);
setInterval(daycycle,5000)
//----------------------------------------------------------------------------------------------------------------------------------
window.cheatTest = function(op) {
    for(const res of Object.values(resources.resource)) {
        if(res.unlocked == true) {
            if(op == "+") {
                res.amount = res.storageLimit;
            } else {
                res.amount = 0;
            }
            res.amount = Math.round(res.amount * 100) / 100;
            func.getId(`${res.name}Amount`).innerHTML = res.amount;
        }
    }
}
function openTab(evt,tabName) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    func.getId(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
//-----------------------------------------------------------------------------------------------------------------------------------------
func.getId("buildingTabButton").addEventListener("click",() => openTab(event,'building content'));
func.getId("warfareButton").addEventListener("click",() => { upgrades.func.createWarvareTab(),resources.func.createUI(res.copperIngot) } );
for(let i = 0; i < 5 ; i++) {
    if(i < 3) {
        addOnclickForClickResouces(i)
    } 
    addOnclickForBuilding(i)
}
function addOnclickForClickResouces(i) {
    let res = Object.values(resources.resource)[i]
    func.onclick(`${res.name}`,resources.func.click)
    func.onhover(`${res.name}`,func.tooltip.gather)
    func.getId(`${res.name}`).addEventListener("mouseenter",func.tooltip.visibilityOn)
    func.getId(`${res.name}`).addEventListener("mouseleave",func.tooltip.visibilityOff)
}
function addOnclickForBuilding(i) {
    let building = Object.values(build)[i]
    func.onhover(`${building.name}`,() => func.tooltip.building(building))
    func.getId(`${building.name}Buy`).addEventListener("mouseenter",func.tooltip.visibilityOn)
    func.getId(`${building.name}Buy`).addEventListener("mouseleave",func.tooltip.visibilityOff)
    func.onclick(`${building.name}Buy`,() => buildings.func.changeAmount(building,"+"))
    func.onclick(`${building.name}Sell`,() => buildings.func.changeAmount(building,"-"))
}
function test() {
    //let e = document.querySelector("[name='gather'][id='food']")
    //console.log(e)
}
//test()
//------------------------------------------------------------------------------------------------------------------------------------------