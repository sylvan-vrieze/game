let getId = (i) => document.getElementById(i);
import { food,wood,stone,copperOre,coal,copperIngot,knowledge,population,ironOre,ironIngot,gold,resourceArray } from "./JSfiles/resources.js"
//-----------------------------------------------------------------------------------------------------------------------------------------
function clickresource(clickres) { clickres.amount += 1 };
import { marketUnlocked } from "./JSfiles/research.js";
function createResourceUI(resource) {
    var resUiArray = [["Name",`${resource.name}:`],["Amount","0"],["Max",`/${resource.storageLimit}`],["Prod",`+0/s`]];
    var resImg = document.createElement('img')
    resImg.src = `images/resources/${resource.name}.png`
    getId("resImage").appendChild(resImg)
    resImg.classList.add("resImage")
    for(var i = 0; i < resUiArray.length; i++) {
        var resUi = document.createElement('div');
        resUi.id = `${resource.name}${resUiArray[i][0]}`;
        resUi.innerHTML = `${resUiArray[i][1]}`;
        getId(`res${resUiArray[i][0]}`).appendChild(resUi);
        getId(`${resource.name}${resUiArray[i][0]}`).classList.add(`res${resUiArray[i][0]}`);
    }
    if(resource.name != "gold" && marketUnlocked == true) {
        createMarketUI(resource);
    }
    resource.unlocked = true ;
}
export { createResourceUI }
//------------------------------------------------------------------------------------------------------------------------
import { lumberjack,qaurryworker,miner,coalminer,smelter,farmer,librarian } from "./JSfiles/jobs.js"
const jobArray = [lumberjack,qaurryworker,miner,coalminer,smelter,farmer,librarian];
var jobtab = false;
// function addjob(jobType) {
//     if(jobtab == false) {
//         addtab("jobs");
//         const element = document.createElement("span");
//         element.innerHTML = `assigned 0/${population.amount}`;
//         element.id = "asPop"
//         getId("jobs content").appendChild(element);
//         getId(element.id).classList.add("large");
//         jobtab = true;
//     }
//     if(jobType.uipresent == false) {
//         createJobUi(jobType);
//         jobType.uipresent = true;
//     }
//     var curjob = getId(jobType.name);
//     curjob.querySelector('span').innerHTML = `${jobType.active}/${jobType.max}`;
// }
var asAmount = 0
function updateAssigned(amount,op) {
    var asPop = getId("asPop");
    asAmount = operations[op](asAmount,amount);
    asPop.innerHTML = `assigned ${asAmount}/${population.amount}`;
}
function createJobUi(job) {
    const curjob = document.createElement("div");
    curjob.id = job.name;
    curjob.innerHTML = `<div class="jobText">${job.name}</div><button id="${job.name}As">assign</button><span>0/1</span><button id="${job.name}UnAs">unassign</button>`;
    getId("jobs content").appendChild(curjob);
    getId(curjob.id).onmouseover = function() {editTooltip('job',job)};
    getId(`${job.name}As`).onclick = function() {changeProdAndComp(job,"+")};
    getId(`${job.name}UnAs`).onclick = function() {changeProdAndComp(job,"-")};
    getId(`${job.name}As`).classList.add("jobButton");
    getId(`${job.name}UnAs`).classList.add("jobButton"); 
}
//------------------------------------------------------------------------------------------------------------------------
import { farm,lumberjackHut,quarry,library,simpleHut,mine,coalMine,smeltery,wharehouse,sawmill,building } from "./JSfiles/buildings.js";
const buildingArray = [farm,lumberjackHut,quarry,library,simpleHut,mine,coalMine,smeltery,wharehouse,sawmill];
var researchUlocked = false;
function changeBuildingAmount(building,op) {
    if(building.amount != 0 || op == "+") {
        if(op == "+") {
            if(checkCost(building.cost.resource,building.cost.cost) != 1) { return };
        }
        building.amount = operations[op](building.amount,1);
        if(building.job.type[0] != "none") {
            for(var i = 0; i < building.job.type.length; i++) {
                building.job.type[i].max = operations[op](building.job.type[i].max,1);
                job.add(building.job.type[i]);
            }
        }
        if(building.storage.type[0] != "none") {
            for(var s = 0; s < building.storage.type.length; s++) {
                var storeRes = building.storage.type[s];
                if (storeRes.unlocked == true) {
                    storeRes.storageLimit = operations[op](storeRes.storageLimit,building.storage.amount[s]);
                    getId(`${storeRes.name}Max`).innerHTML = `/${storeRes.storageLimit}`;
                }
            }
        }
        if(building.modifier.type[0] != "none") {
            changeModifier(building.modifier.type,building.modifier.multiplier,op);
        }
        for(var j = 0; j < building.cost.cost.length; j++) {
            switch(op){ 
                case"+": var costOp = "*"; break; 
                case"-": var costOp = ":"
                building.cost.resource[j].amount += building.cost.cost[j]*0.75 ; break; 
            }
            building.cost.cost[j] = Math.round((operations[costOp](building.cost.cost[j],building.cost.multiplier))*10) / 10;
        }
        getId(`${building.name}Count`).innerHTML = `${building.amount}`;
        editTooltip("building",building);
        if(building == library && researchUlocked == false ) {
            createResearchLab();
            researchUlocked = true;
        }  
    }   
} 
//-------------------------------------------------------------------------------------------------------------------------------
import { storage,mining,smelting,ironWorking,trade } from "./JSfiles/research.js"
function createResearchLab() {
    addtab("research");
    createButton(storage);
    createButton(mining);
    createButton(trade);
}
//------------------------------------------------------------------------------------------------------------------------------
let job = {
    type: false, // define job type
    add: (jobType) => {
        if(jobtab == false) {
            addtab("jobs");
            const element = document.createElement("span");
            element.innerHTML = `assigned 0/${population.amount}`;
            element.id = "asPop"
            getId("jobs content").appendChild(element);
            getId(element.id).classList.add("large");
            jobtab = true;
        }
        if(jobType.uipresent == false) {
            createJobUi(jobType);
            jobType.uipresent = true;
        }
        getId(jobType.name).querySelector('span').innerHTML = `${jobType.active}/${jobType.max}`;
    },
};
//--------------------------------------------------------------------------------------------------------------------------------
function marketTransaction(curres,op) {
    var amount = Number(getId("marketInput").value);
    if(op == "+") {
        if(gold.amount >= (curres.cost*amount)) {
            curres.amount += amount;
            gold.amount -= (curres.cost*amount);
            console.log(curres.amount)
        }
    } else if(op == "-") {
        if(curres.amount >= amount) {
            curres.amount -= amount;
            gold.amount += ((curres.cost*amount)*0.8);
            console.log(amount)
        }
    }
    amount = 0
}
export { marketTransaction }
//----------------------------------------------------------------------------------------------------------------------------------
function miscellaneous(name,id,CType,CAmount,explanation) {
    this.name = name;
    this.id = id;
    this.cost = {
        type:CType,
        amount:CAmount,
    }
    this.explanation = explanation;
}
const workshop = new miscellaneous("workshop",0,[wood,stone],[300,200],"unlocks upgrades to improve production");
const researchLab = new miscellaneous("research lab",1,[wood,stone],[200,100],"unlocks research to find new means of production");
const market = new miscellaneous("market",2,[wood,stone],[250,400],"allows for buying and selling of resources");
const miscellaneousArray = [workshop,researchLab,market];
//--------------------------------------------------------------------------------------------------------------------------------
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
    if(asAmount != population.amount || op == "-") {
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
                var curjob = getId(jobType.name);
                curjob.querySelector('span').innerHTML = `${jobType.active}/${jobType.max}`;
                updateAssigned(1,op); 
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
    var jobType = jobArray[id];
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
            text += `${costAmount[i]} ${costType[i].name}`;
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
    for(var i = 0; i < resourceArray.length; i++) { 
        var curres = resourceArray[i];
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
    for(var n = 0; n < resourceArray.length; n++) {
        var negres = resourceArray[n];
        if (negres.amount < 0) {
            setInactive(negres);
        } 
    }
}
function setInactive(negres) {
    for(var b = 0; b < jobArray.length; b++) {
        var jobType = jobArray[b];
        for(var i = 0; i < jobType.comsumption.type.length; i++) {
            var res = jobType.comsumption.type[i];
            if(res != "none" && negres == res) {
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
                updateAssigned(jobType.active,"-")
                jobType.active = 0;
                curjob = getId(jobType.name);
                curjob.querySelector('span').innerHTML = `${jobType.active}/${jobType.max}`;
                break;
            }
        } 
    }
}
function populationCheck() {
    if(population.storageLimit != population.amount && food.amount > 0) {
        population.amount += 1;
        food.comsumption += 0.1;
        getId(`${population.name}Amount`).innerHTML = population.amount;
    } else if(food.amount < 0 && population.amount != 0) {
        population.amount -= 1;
        food.comsumption -= 0.1;
        getyId(`${population.name}Amount`).innerHTML = population.amount;
    }
    if(jobtab == true) {
        updateAssigned(0,"+");
    }
    updateProd(food);
}
setInterval(function(){autoProduction();},100);
setInterval(function(){populationCheck();},10000);
//----------------------------------------------------------------------------------------------------------------------------------
window.cheatTest = function(op) {
    for(var i = 0; i < resourceArray.length; i++) {
        var curres = resourceArray[i];
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
    var curRes = resourceArray[i];
    getId(`${curRes.name}Gather`).addEventListener("click",function() {clickresource(curRes)});
    getId(`${curRes.name}Gather`).addEventListener("mouseover",function() {editTooltip("gather",curRes)});
}
function addOnclickForBuilding(i) {
    var curBuilding = buildingArray[i]
    getId(`${curBuilding.name}`).addEventListener("mouseover",function(){editTooltip("building",curBuilding)})
    getId(`${curBuilding.name}Buy`).addEventListener("click",function(){changeBuildingAmount(curBuilding,"+")})
    getId(`${curBuilding.name}Sell`).addEventListener("click",function(){changeBuildingAmount(curBuilding,"-")})
}
//----------------------------------------------------------------------------------------------------------------------------------------