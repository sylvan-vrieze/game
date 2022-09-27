const func = {
    getId: id => document.getElementById(id),
    removeElement: id => func.getId(id).remove(),
    addClass: (id,clas) => func.getId(id).classList.add(clas),
    onclick: (id,funct) => func.getId(id).addEventListener("click",funct), 
    checkCost: (resType,resAmount) => {
        for(var i = 0; i < resType.length; i++) {
            if(resType[i].amount < resAmount[i]) {
                return 0;
            } 
        }
        for(var c = 0; c < resType.length; c++) {
            resType[c].amount -= resAmount[c];   
        }
        return 1;
    },
    operations: {
        "+": (a,b) =>  a + b,
        "-": (a,b) =>  a - b,
        "*": (a,b) =>  a * b,
        ":": (a,b) =>  a / b,
    },
    create: {
        button: (item) => {
            const button = document.createElement("div");
            button.id = item.name;
            if(item.constructor.name == "building") {
                button.innerHTML = `
                <div class="buildingBuy" id="${item.name}Buy">
                    <span class="buildingText">${item.name}</span>
                </div>
                <div class="buildingCount" id="${item.name}Count">0</div>
                <div class="buildingSell"  id="${item.name}Sell">sell</div>`;
                func.getId(`${item.type} ${item.constructor.name}`).appendChild(button);
                func.addClass(item.name,"buildingButton")
                func.getId(`${item.name}Sell`).addEventListener("click",() => buildings.func.changeAmount(item,'-'));
                func.getId(`${item.name}Buy`).addEventListener("click",() => buildings.func.changeAmount(item,'+'));
            } else {
                button.onclick = function() { item.effect(); }
                button.innerHTML = item.name
                func.getId(`${item.constructor.name} content`).appendChild(button);
                func.addClass(item.name,"button");
            }
            button.onmouseover = () => func.tooltip.edit(`${item.constructor.name}`,item); 
            
        },
        tab: (tabName) => {
            const tab = document.createElement("button");
            tab.id = tabName;
            tab.innerHTML = tabName;
            tab.onclick = () => openTab(event, `${tabName} content`);
            func.getId("tab").appendChild(tab);
            func.addClass(tabName,"tablinks") ;
            
            const tabcontent = document.createElement("div");
            tabcontent.id = `${tabName} content`;
            func.getId("contentlist").appendChild(tabcontent);
            func.addClass(tabcontent.id,"tabcontent");
        }
    },
    tooltip: {
        edit: (type,item) => {
            if(type == "gather") {
                var text = `gather 1 ${item.name}`
            } else if(type == "building") {
                var text = `${item.name} <br>`;
                text += func.tooltip.cost(item.cost.resource,item.cost.amount);
                if(item.job.type != "none") {
                    for(var i = 0; i < item.job.type.length ; i++) {
                        if(i == 0) {
                            text += `provides ${item.job.amount[i]} ${item.job.type[i].name} job<br>`;
                        } else {
                            text += `and ${item.job.amount[i]} ${item.job.type[i].name} job<br>`;
                        }
                    }
                }
                var part = ["storage","modifier","storage","production"]
                for(var i = 0; i < 2; i++) {
                    if(item[part[i]].type != "none" && item[part[i]].type[0].unlocked == true) {
                        text += `increases ${part[i+2]} for `;
                        for(var j = 0; j < item[part[i]].type.length; j++) {
                            if(i == 0) {
                                text += `${item[part[i]].type[j].name} by ${item[part[i]].amount[j]}<br>`;
                            } else {
                                text += `${item[part[i]].type[j].name} by ${item[part[i]].amount[j]*100}%<br>`
                            }
                        }
                    }
                }
            } else if(type == "job") {
                var text = `${item.name} <br>`;
                var part = ["production","comsumption","produces","comsumes"]
                for(var i = 0; i < 2; i++) {
                    if(item[part[i]].type[0] != "none"){
                        text += part[i+2];
                        for(var j = 0; j < item[part[i]].type.length; j++) {
                            text += ` ${item[part[i]].amount[j]*10} ${item[part[i]].type[j].name} per second<br>`;
                            if(item[part[i]].type.length > 1 && (j+1) < item[part[i]].type.length) {
                                text += "and"
                            }
                        }
                    }
                }
            } else if(type == "upgrade") {
                var text = `${item.name}<br>
                ${func.tooltip.cost(item.cost.type,item.cost.amount)}
                ${item.explanation}</br>`;
                if(item.modifier.type[0] != "none") {
                    for(var i = 0; i < item.modifier.type.length; i++) {
                        text += `increases the production of ${item.modifier.type[i].name} by ${item.modifier.amount[i]*100}%<br>`
                    }
                }
            } else if(type == "research") {
                var text = `${item.name} <br> ${func.tooltip.cost(item.cost.type,item.cost.amount)} ${item.explanation}`;
            } else if(type.includes("market")) {
                var text = `${item.name}<br>`;
                var amount = func.getId("marketInput").value;
                if(type.includes("buy")) {
                    text += `buy ${amount} <br> cost: ${(Math.round((item.cost.current*amount)*1000)/1000)} gold`;
                } else {
                    text += `sell ${amount} <br> gain: ${(Math.round(((item.cost.current*amount)*0.8)*1000)/1000)} gold`;
                }
            } 
            func.getId('tooltip').innerHTML = text;
        },
        cost: (costType,costAmount) => {
            var text = "cost: ";
            for(var i = 0; i < costType.length; i++) {
                text += `${costAmount[i]} ${costType[i].name} `;
                if(costType.length > 1 && (i+1) < costType.length) {
                    text += "and "
                }
            }
            text += "<br>";
            return text;
        },
    },
}
export { func }
//-----------------------------------------------------------------------------------------------------------------------------------------
import { resources } from "./JSfiles/resources.js"
import { jobs } from "./JSfiles/jobs.js"
import { buildings } from "./JSfiles/buildings.js"; 
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
        for (const entry of Object.entries(resources)) {
            var curres = entry[1]
            if(curres.name != "knowledge" && curres.name != "population" && curres.name != "gold") {
                if(curres.unlocked == true) {
                    market.createUI(curres);
                }
            } 
        }
        market.unlocked = true;
    },
    createUI: (curres) => {
        const curDiv = document.createElement("div");
        curDiv.id = `${curres.name}`;
        curDiv.innerHTML = `<div class="marketText">${curres.name}:</div><button id="${curres.name}buy">buy</button><button id="${curres.name}sell">sell</button>`;
        func.getId("market content").appendChild(curDiv);
        func.getId(`${curres.name}buy`).onclick = () => market.buy(curres);
        func.getId(`${curres.name}sell`).onclick = () => market.sell(curres);
        func.getId(`${curres.name}buy`).onmouseover = () => func.tooltip.edit('market buy',curres);
        func.getId(`${curres.name}sell`).onmouseover = () => func.tooltip.edit('market sell',curres);
        func.addClass(`${curres.name}buy`,"marketButton");
        func.addClass(`${curres.name}sell`,"marketButton");
    },
    buy: (curres) => {
        market.amount = Number(func.getId("marketInput").value)
        if(resources.gold.amount >= (curres.cost.current*market.amount)) {
            curres.amount += market.amount;
            resources.gold.amount -= (curres.cost.current*market.amount);
            market.changePrice(curres,"*") 
        }
    },
    sell: (curres) => {
        market.amount = Number(func.getId("marketInput").value)
        if(curres.amount >= market.amount) {
            curres.amount -= market.amount;
            resources.gold.amount += ((curres.cost.current*market.amount)*0.8);
            market.changePrice(curres,":") 
        }
    },
    changePrice: (curres,op) => {
        var changeMultipler = Math.round((Math.random() * 2)*10)/10
        curres.cost.current = func.operations[op](curres.cost.current,(1 + ((market.amount / 50000) * changeMultipler)));
        switch (op) {
            case "*": func.tooltip.edit('market buy',curres); break;
            case ":": func.tooltip.edit('market sell',curres); break;
        }
    },
}
export { market }
//----------------------------------------------------------------------------------------------------------------------------------
function changeProdAndComp(jobType,op) {
    if(jobs.func.assigned != resources.population.amount && jobType.max != jobType.active || op == "-") {
        if(jobType.active != 0 || op == "+") {
            let part = ["production","comsumption"]
            for(let i = 0; i < 2; i++) {
                if(jobType[part[i]].type != "none") {
                    for(let c = 0; c < jobType[part[i]].type.length; c++) {
                        let res = jobType[part[i]].type[c];
                        res[part[i]] = func.operations[op](res[part[i]],jobType[part[i]].amount[c]);
                        updateProd(res);  
                    }          
                }
            }
            jobType.active = func.operations[op](jobType.active,1)
            func.getId(`${jobType.name}Number`).innerHTML = `${jobType.active}/${jobType.max}`;
            jobs.func.updateAssigned(1,op); 
        }  
    }  
}
function updateProd(res) {
    var resEndProd =  Math.round((res.endProd()*10)*10000)/10000;
    if(res.endProd() >= 0) {
        func.getId(`${res.name}Prod`).innerHTML = `+${resEndProd}/s`;
    } else {
        func.getId(`${res.name}Prod`).innerHTML = `${resEndProd}/s`;
    }
}
function changeModifier(modType,modAmount,op) {
    for(var s = 0; s < modType.length; s++) {
        modType[s].modifier = func.operations[op](modType[s].modifier,modAmount[s]);
        updateProd(modType[s]);
    }
}
function addProdAndComp(id,prodres,prodAmount,compres,compAmount) {
    var jobType = Object.entries(jobs)[id][1]
    if(prodres != "none") {
        jobType.production.type.push(prodres);
        jobType.production.amount.push(prodAmount);
        prodres.production += (prodAmount * jobType.active);
        updateProd(prodres) 
    }
    if(compres != "none") {
        jobType.comsumption.type.push(compres);
        jobType.comsumption.amount.push(compAmount);
        compres.comsumption += (compAmount * jobType.active);
        updateProd(compres);
    }
}
export { changeModifier,addProdAndComp,changeProdAndComp }
//---------------------------------------------------------------------------------------------------------------------------------
function autoProduction() {
    for(const entry of Object.entries(resources)) {
        var res = entry[1];
        if(res.unlocked == true) {
            if(res.production != "none") {
                res.amount = Math.round((res.amount + res.endProd()) * 100) / 100;
            }
            if(res.amount > res.storageLimit) {
                res.amount = res.storageLimit;
            }
            func.getId(`${res.name}Amount`).innerHTML = `${res.amount}`;
        }
    }
    checkNegative();
}
function checkNegative() {
    for (const entry of Object.entries(resources)) {
        var negres = entry[1];
        if (negres.amount < 0) {
            setInactive(negres);
        } 
    }
}
function setInactive(negres) {
    for(const entry of Object.entries(jobs)) {
        let jobType = entry[1];
        if(entry[0] != "func") {
            for(var i = 0; i < jobType.comsumption.type.length; i++) {
                if(negres == jobType.comsumption.type[i]) {
                    let part = ["production","comsumption"]
                    for(let I = 0; I < 2; I++) {
                        for(let i = 0; i < jobType[part[I]].type.length; i++) {
                            let res = jobType[part[I]].type[i];
                            res[part[I]] -= (jobType[part[I]].amount[i] * jobType.active);
                            updateProd(res);
                        }
                    }
                    jobs.func.updateAssigned(jobType.active,"-")
                    jobType.active = 0;
                    func.getId(`${jobType.name}Number`).innerHTML = `${jobType.active}/${jobType.max}`;
                    break;
                }
            }
        }
    }
}
function populationCheck() {
    if(resources.population.storageLimit != resources.population.amount && resources.food.amount > 0) {
        resources.population.amount += 1;
        resources.food.comsumption += 0.1;
        func.getId(`${resources.population.name}Amount`).innerHTML = resources.population.amount;
    } else if(resources.food.amount < 0 && resources.population.amount != 0) {
        resources.population.amount -= 1;
        resources.food.comsumption -= 0.1;
        func.getId(`${resources.population.name}Amount`).innerHTML = resources.population.amount;
    }
    if(jobs.func.tab == true) {
        jobs.func.updateAssigned(0,"+");
    }
    updateProd(resources.food);
}
function pricechange() {
    for (const entry of Object.entries(resources)) {
        var curRes = entry[1]
        if(entry[0] != "func") {
            var changeMultipler = Math.round((Math.random() * 2)*10)/10
            if(curRes.cost.current > curRes.cost.start) {
                curRes.cost.current = curRes.cost.current / (1 + (changeMultipler / 10))
            } else if (curRes.cost.current < curRes.cost.start) {
                curRes.cost.current = curRes.cost.current * (1 + (changeMultipler / 10))
            }
        }
    }
}
setInterval(() => autoProduction(),100);
setInterval(() => populationCheck(),10000);
setInterval(() => pricechange(),60000)
//----------------------------------------------------------------------------------------------------------------------------------
window.cheatTest = function(op) {
    for(const entry of Object.entries(resources)) {
        var curres = entry[1];
        if(curres.unlocked == true) {
            if(op == "+") {
                curres.amount = curres.storageLimit;
            } else {
                curres.amount = 0;
            }
            curres.amount = Math.round(curres.amount * 100) / 100;
            func.getId(`${curres.name}Amount`).innerHTML = curres.amount;
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
func.getId("warfareButton").addEventListener("click",() => upgrades.func.createWarvareTab() );
for(var i = 0; i < 5 ; i++) {
    if(i < 3) {
        addOnclickForClickResouces(i)
    } 
    addOnclickForBuilding(i)
}
function addOnclickForClickResouces(i) {
    var curRes = Object.entries(resources)[i][1]
    func.onclick(`${curRes.name}Gather`,() => resources.func.click(curRes))
    func.getId(`${curRes.name}Gather`).addEventListener("mouseover",() => func.tooltip.edit("gather",curRes));
}
function addOnclickForBuilding(i) {
    var curBuilding = Object.entries(buildings)[i][1]
    func.getId(`${curBuilding.name}`).addEventListener("mouseover",() => func.tooltip.edit("building",curBuilding))
    func.onclick(`${curBuilding.name}Buy`,() => buildings.func.changeAmount(curBuilding,"+"))
    func.onclick(`${curBuilding.name}Sell`,() => buildings.func.changeAmount(curBuilding,"-"))
}
//------------------------------------------------------------------------------------------------------------------------------------------