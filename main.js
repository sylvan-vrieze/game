let getId = (i) => document.getElementById(i);
export { getId }
//-----------------------------------------------------------------------------------------------------------------------------------------
import { resources } from "./JSfiles/resources.js"
import { jobs } from "./JSfiles/jobs.js"
import { buildings,building } from "./JSfiles/buildings.js"; 
//----------------------------------------------------------------------------------------------------------------------------------
const market = {
    unlocked: false,
    amount: 0,
    create: () => {
        addtab("market");
        var input = document.createElement("input");
        input.type = "number";
        input.id = "marketInput";
        input.value = 100;
        getId("market content").appendChild(input);
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
        getId("market content").appendChild(curDiv);
        getId(`${curres.name}buy`).onclick = function() {market.buy(curres)};
        getId(`${curres.name}sell`).onclick = function() {market.sell(curres)};
        getId(`${curres.name}buy`).onmouseover = function() {editTooltip('market buy',curres)};
        getId(`${curres.name}sell`).onmouseover = function() {editTooltip('market sell',curres)};
        getId(`${curres.name}buy`).classList.add("marketButton");
        getId(`${curres.name}sell`).classList.add("marketButton");
    },
    buy: (curres) => {
        market.amount = Number(getId("marketInput").value)
        if(resources.gold.amount >= (curres.cost*market.amount)) {
            curres.amount += market.amount;
            resources.gold.amount -= (curres.cost*market.amount);
        }
    },
    sell: (curres) => {
        market.amount = Number(getId("marketInput").value)
        if(curres.amount >= market.amount) {
            curres.amount -= market.amount;
            resources.gold.amount += ((curres.cost*market.amount)*0.8);
        } 
    },
}
export { market }
//----------------------------------------------------------------------------------------------------------------------------------
function checkCost(resType,resAmount) {
    for(var i = 0; i < resType.length; i++) {
        if(resType[i].amount < resAmount[i]) {
            return 0;
        } 
    }
    for(var c = 0; c < resType.length; c++) {
        resType[c].amount -= resAmount[c] ;   
    }
    return 1;
}
function changeProdAndComp(jobType,op) {
    if(jobs.func.assigned != resources.population.amount || op == "-") {
        if(jobType.max != jobType.active || op == "-") {
            if(jobType.active != 0 || op == "+") {
                for(var c = 0; c < jobType.production.type.length; c++) {
                    var prodres = jobType.production.type[c];
                    prodres.production = operations[op](prodres.production,jobType.production.amount[c]);
                    updateProd(prodres);
                }
                if(jobType.comsumption.type != "none") {
                    for(var c = 0; c < jobType.comsumption.type.length; c++) {
                        var compres = jobType.comsumption.type[c];
                        compres.comsumption = operations[op](compres.comsumption,jobType.comsumption.amount[c]);
                        updateProd(compres);  
                    }          
                }
                jobType.active = operations[op](jobType.active,1)
                getId(jobType.name).querySelector('span').innerHTML = `${jobType.active}/${jobType.max}`;
                jobs.func.updateAssigned(1,op); 
            }  
        }
    }  
}
function updateProd(curres) {
    var resEndProd =  Math.round((curres.endProd()*10)*10000)/10000;
    if(curres.endProd() >= 0) {
        getId(`${curres.name}Prod`).innerHTML = `+${resEndProd}/s`;
    } else {
        getId(`${curres.name}Prod`).innerHTML = `${resEndProd}/s`;
    }
}
function changeModifier(modType,modAmount,op) {
    for(var s = 0; s < modType.length; s++) {
        modType[s].modifier = operations[op](modType[s].modifier,modAmount[s]);
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
    } else if(compres != "none") {
        jobType.comsumption.type.push(compres);
        jobType.comsumption.amount.push(compAmount);
        compres.comsumption += (compAmount * jobType.active);
        updateProd(compres);
    }
}
export { checkCost,changeModifier,addProdAndComp }
//---------------------------------------------------------------------------------------------------------------------------------
function editTooltip(type,item) {
    if(type == "gather") {
        var text = `gather 1 ${item.name}`;
    } else if(type == "building") {
        var text = `${item.name} <br>`;
        text += costEdit(item.cost.resource,item.cost.cost);
        if(item.job.type != "none") {
            text += `provides ${item.job.amount} ${item.job.type[0].name} job<br>`;
        }
        if(item.storage.type != "none") {
            text += `increases storage for `;
            for(var s = 0; s < item.storage.type.length ;s++) {
                var curres = item.storage.type[s];
                if(curres.unlocked == true) {
                    text += `${item.storage.type[s].name} by ${item.storage.amount[s]}<br>`;
                }
            }
        }
        if(item.modifier.type != "none") {
            text += `increases production for `;
            for(var i = 0; i < item.modifier.type.length ;i++) {
                text += `${item.modifier.type[i].name} by ${item.modifier.multiplier[i]*100}%<br>`;
            }
        }
    } else if(type == "job") {
        var text = `${item.name} <br>`;
        if(item.production.type != "none"){
            text += `produces `;
            for(var i = 0; i < item.production.type.length ;i++) {
                text += `${item.production.amount[i]*10} ${item.production.type[i].name} per second<br>`;
            }
        }
        if(item.comsumption.type != "none"){
            text += `comsumes `;
            for(var i = 0; i < item.comsumption.type.length ;i++) {
                text += `${item.comsumption.amount[i]*10} ${item.comsumption.type[i].name} per second<br>`;
            }
        }
    } else if(type == "upgrade") {
        var text = `${item.name}<br>
        ${costEdit(item.cost.type,item.cost.amount)}
        ${item.explanation}</br>`;
        if(item.modifier.type[0] != "none") {
            for(var i = 0; i < item.modifier.type.length; i++) {
                text += `increases the production of ${item.modifier.type[i].name} by ${item.modifier.amount[i]*100}%<br>`
            }
        }
    } else if(type == "research") {
        var text = `${item.name} <br> ${costEdit(item.cost.type,item.cost.amount)} ${item.explanation}`;
    } else if(type.includes("market")) {
        var text = `${item.name}<br>`;
        var amount = getId("marketInput").value;
        if(type.includes("buy")) {
            text += `buy ${amount} <br> cost: ${(Math.round((item.cost*amount)*100)/100)} gold`;
        } else {
            text += `sell ${amount} <br> gain: ${(Math.round(((item.cost*amount)*0.8)*100)/100)} gold`;
        }
    } 
    getId('tooltip').innerHTML = text;
}
function costEdit(costType,costAmount) {
    var text = "cost: ";
    if(costType.length > 1) {
        for(var i = 0; i < costType.length; i++) {
            text += `${costAmount[i]} ${costType[i].name} `;
        } 
    } else {
        text += `${costAmount} ${costType[0].name}`;
    }
    text += "<br>";
    return text;
}
export { editTooltip }
//---------------------------------------------------------------------------------------------------------------------------------
function autoProduction() {
    for (const entry of Object.entries(resources)) {
        var curres = entry[1];
        if(curres.unlocked == true) {
            if(curres.production != "none") {
                curres.amount += curres.endProd(); 
                curres.amount = Math.round(curres.amount * 100) / 100;
            }
            if(curres.amount > curres.storageLimit) {
                curres.amount = curres.storageLimit;
            }
            getId(`${curres.name}Amount`).innerHTML = `${curres.amount}`;
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
        var jobType = entry[1];
        for(var i = 0; i < jobType.comsumption.type.length; i++) {
            if(jobType.comsumption.type[i] != "none" && negres == res) {
                for(var i = 0; i < jobType.comsumption.type.length; i++) {
                    res = jobType.comsumption.type[i];
                    res.comsumption = res.comsumption - (jobType.comsumption.amount[i] * jobType.active);
                    updateProd(res);
                }
                for(var i = 0; i < jobType.production.type.length; i++) {
                    res = jobType.production.type[i];
                    res.production = res.production - (jobType.production.amount * jobType.active);
                    updateProd(res);
                }
                jobs.func.updateAssigned(jobType.active,"-")
                jobType.active = 0;
                getId(jobType.name).querySelector('span').innerHTML = `${jobType.active}/${jobType.max}`;
                break;
            }
        } 
    }
}
function populationCheck() {
    if(resources.population.storageLimit != resources.population.amount && resources.food.amount > 0) {
        resources.population.amount += 1;
        resources.food.comsumption += 0.1;
        getId(`${population.name}Amount`).innerHTML = population.amount;
    } else if(resources.food.amount < 0 && resources.population.amount != 0) {
        resources.population.amount -= 1;
        resources.food.comsumption -= 0.1;
        getyId(`${resources.population.name}Amount`).innerHTML = resources.population.amount;
    }
    if(jobs.func.tab == true) {
        jobs.func.updateAssigned(0,"+");
    }
    updateProd(resources.food);
}
setInterval(function(){autoProduction();},100);
setInterval(function(){populationCheck();},10000);
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
            getId(`${curres.name}Amount`).innerHTML = curres.amount;
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
    getId(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
var operations = {
    "+": function(a,b) { return a + b},
    "-": function(a,b) { return a - b},
    "*": function(a,b) { return a * b},
    ":": function(a,b) { return a / b},
}
export { operations }
//-----------------------------------------------------------------------------------------------------------------------------------
function removeElement(id) { getId(id).remove(); };
function addtab(tabName) {
    const tab = document.createElement("button");
    tab.id = tabName;
    tab.innerHTML = tabName;
    tab.onclick = function() {openTab(event, `${tabName} content`)};
    getId("tab").appendChild(tab);
    getId(tabName).classList.add("tablinks") ;
    
    const tabcontent = document.createElement("div");
    tabcontent.id = `${tabName} content`;
    getId("contentlist").appendChild(tabcontent);
    getId(tabcontent.id).classList.add("tabcontent");
}
function createButton(item) {
    const button = document.createElement("div");
    button.id = item.name;
    if(item.constructor == building) {
        button.innerHTML = `
        <div class="buildingBuy" id="${item.name}Buy">
            <span class="buildingText">${item.name}</span>
        </div>
        <div class="buildingCount" id="${item.name}Count">0</div>
        <div class="buildingSell"  id="${item.name}Sell">sell</div>`;
        getId(`${item.type} ${item.constructor.name}`).appendChild(button);
        getId(item.name).classList.add("buildingButton");
        getId(`${item.name}Sell`).addEventListener("click",function() {changeBuildingAmount(item,'-')});
        getId(`${item.name}Buy`).addEventListener("click",function() {changeBuildingAmount(item,'+')});
    } else {
        button.onclick = function() {
            var effect = item.effect;
            effect();
        }
        button.innerHTML = item.name
        getId(`${item.constructor.name} content`).appendChild(button);
        getId(item.name).classList.add("button");
    }
    button.onmouseover = function() {editTooltip(`${item.constructor.name}`,item)}; 
    
}
export { removeElement,addtab,createButton }
//-----------------------------------------------------------------------------------------------------------------------------------------
getId("buildingTabButton").addEventListener("click",function(){ openTab(event,'building content')});
for(var i = 0; i < 5 ; i++) {
    if(i < 3) {
        addOnclickForClickResouces(i)
    } 
    addOnclickForBuilding(i)
}
function addOnclickForClickResouces(i) {
    var curRes = Object.entries(resources)[i][1]
    getId(`${curRes.name}Gather`).addEventListener("click",function() {resources.func.click(curRes)});
    getId(`${curRes.name}Gather`).addEventListener("mouseover",function() {editTooltip("gather",curRes)});
}
function addOnclickForBuilding(i) {
    var curBuilding = Object.entries(buildings)[i][1]
    getId(`${curBuilding.name}`).addEventListener("mouseover",function(){editTooltip("building",curBuilding)})
    getId(`${curBuilding.name}Buy`).addEventListener("click",function(){buildings.func.changeBuildingAmount(curBuilding,"+")})
    getId(`${curBuilding.name}Sell`).addEventListener("click",function(){buildings.func.changeBuildingAmount(curBuilding,"-")})
}
//----------------------------------------------------------------------------------------------------------------------------------------