function resource(id,name,amount,production,comsumption,storageLimit,modifier,unlocked,cost) {
    this.id = id
    this.name = name
    this.amount = amount;
    this.production = production
    this.comsumption = comsumption
    this.storageLimit = storageLimit
    this.modifier = modifier
    this.endProd = function() {
        return (this.production * this.modifier) - this.comsumption 
    }
    this.unlocked = unlocked
    this.cost = cost
}
const food = new resource(0,"food",0,0,0,500,1,true,0.001)
const wood = new resource(1,"wood",0,0,0,500,1,true,0.001)
const stone = new resource(2,"stone",0,0,0,500,1,true,0.001)
const copperOre = new resource(3,"copper ore",0,0,0,500,1,false,0.0015) 
const coal = new resource(4,"coal",0,0,0,500,1,false,0.0015) 
const copperIngot = new resource(5,"copper ingot",0,0,0,250,1,false,0.0025) 
const knowledge = new resource(6,"knowledge",0,0,0,100,1,true,0)
const population = new resource(7,"population",0,"none","none",10,1,true,0)
const ironOre = new resource(8,"iron ore",0,0,0,500,1,false,0.002)
const ironIngot = new resource(9,"iron ingot",0,0,0,250,1,false,0.0045)
const gold = new resource(10,"gold",0,0,0,100,1,false,0)
var resourceArray = [food,wood,stone,copperOre,coal,copperIngot,knowledge,population,ironOre,ironIngot,gold]
//-----------------------------------------------------------------------------------------------------------------------------------------
function clickresource(clickres) { clickres.amount += 1 }
function createResourceUI(resource) {
    var resUiArray = [["Name",`${resource.name}:`],["Amount","0"],["Max",`/${resource.storageLimit}`],["Prod",`+0/s`]]
    for(var i = 0; i < resUiArray.length; i++) {
        var resUi = document.createElement('div')
        resUi.id = `${resource.name}${resUiArray[i][0]}`
        resUi.innerHTML = `${resUiArray[i][1]}`
        document.getElementById(`res${resUiArray[i][0]}`).appendChild(resUi)
        document.getElementById(`${resource.name}${resUiArray[i][0]}`).classList.add(`res${resUiArray[i][0]}`)
    }
    if(resource.name != "gold" && marketUnlocked == true) {
        createMarketUI(resource)
    }
    resource.unlocked = true 
}
//------------------------------------------------------------------------------------------------------------------------
function job(id,name,active,max,prodType,prodAmount,compType,compAmount,uipresent) {
    this.id = id
    this.name = name
    this.active = active
    this.max = max
    this.production = {
        type:prodType,
        amount:prodAmount
    }
    this.comsumption = {
        type:compType,
        amount:compAmount
    }
    this.uipresent = uipresent 
}
const lumberjack = new job(0,"lumberjack",[0,1],0,[wood],[0.1],["none"],[0],false)
const qaurryworker = new job(1,"qaurryworker",[0,1],0,[stone],[0.1],["none"],[0],false)
const miner = new job(2,"miner",[0,1],0,[copperOre],[0.1],["none"],[0],false) 
const coalminer = new job(3,"coalminer",[0,1],0,[coal],[0.1],["none"],[0],false)
const smelter = new job(4,"smelter",[0,1],0,[copperIngot],[0.01],[copperOre,coal],[0.2,0.3],false) 
const farmer = new job(5,"farmer",[0,1],0,[food],[0.2],["none"],[0],false) 
const librarian = new job(6,"librarian",[0,1],0,[knowledge],[0.02],["none"],[0],false)
//const = new job(,"",[0,1],0,[""],,[""],[],false)
const jobArray = [lumberjack,qaurryworker,miner,coalminer,smelter,farmer,librarian]
var jobtab = false
function addjob(jobType) {
    if(jobtab == false) {
        addtab("jobs")
        const element = document.createElement("span");
        element.innerHTML = `assigned 0/${population.amount}`;
        element.id = "asPop"
        document.getElementById("jobs content").appendChild(element);
        document.getElementById(element.id).classList.add("large")
        jobtab = true
    }
    if(jobType.uipresent == false) {
        createJobUi(jobType)
        jobType.uipresent = true
    }
    curjob = document.getElementById(jobType.name)
    curjob.querySelector('span').innerHTML = `${jobType.active[0]}/${jobType.max}`
}
var asAmount = 0
function updateAssigned(amount,op) {
    asPop = document.getElementById("asPop")
    asAmount = operations[op](asAmount,amount)
    asPop.innerHTML = `assigned ${asAmount}/${population.amount}`;
}
function createJobUi(job) {
    const curjob = document.createElement("div")
    curjob.id = job.name
    curjob.innerHTML = `<div class="jobText">${job.name}</div><button id="${job.name}As">assign</button><span>0/1</span><button id="${job.name}UnAs">unassign</button>`
    document.getElementById("jobs content").appendChild(curjob);
    document.getElementById(curjob.id).onmouseover = function() {editTooltip('job',job)}
    document.getElementById(`${job.name}As`).onclick = function() {changeProdAndComp(job,"+")}
    document.getElementById(`${job.name}UnAs`).onclick = function() {changeProdAndComp(job,"-")}
    document.getElementById(`${job.name}As`).classList.add("jobButton")
    document.getElementById(`${job.name}UnAs`).classList.add("jobButton") 
}
//------------------------------------------------------------------------------------------------------------------------
function building(name,id,type,amount,cost,costmultiplier,resourceCost,jobType,jobAmount,Stype,SAmount,Mtype,Mmultiplier) {
    this.name = name
    this.id = id;
    this.type = type;
    this.amount = amount
    this.cost = {
        cost:cost,
        multiplier:costmultiplier,
        resource:resourceCost
    }
    this.job = {
        type:jobType,
        amount:jobAmount
    }
    this.storage = {
        type:Stype,
        amount:SAmount
    }
    this.modifier = {
        type:Mtype,
        multiplier:Mmultiplier
    }
}
const sawmill = new building("sawmill",0,"production",0,[10],1.2,[wood],["none"],[0],["none"],[0],["wood"],[0.2])
const quarry = new building("quarry",1,"production",0,[10],1.2,[wood],[qaurryworker],[1],["none"],[0],["none"],[0])
const mine = new building("mine",2,"production",0,[15,10],1.2,[wood,stone],[miner],[1],["none"],[0],["none"],[0])
const coalMine = new building("coal mine",3,"production",0,[15,10],1.2,[wood,stone],[coalminer],[1],["none"],[0],["none"],[0])
const smeltery = new building("smeltery",4,"production",0,[10,30],1.3,[wood,stone],[smelter],[1],["none"],[0],["none"],[0])
const wharehouse = new building("wharehouse",5,"storage",0,[40,40],1.4,[wood,stone],["none"],[0],[food,wood,stone,copperOre,coal,copperIngot,ironOre,ironIngot,gold],[500,500,500,500,500,250,500,250,100],["none"],[0])
const farm = new building("farm",6,"production",0,[5],1.2,[wood],[farmer],[1],["none"],[0],["none"],[0])
const library = new building("library",7,"storage",0,[50,25],1.4,[wood,stone],[librarian],[1],[knowledge],[100],[knowledge],[0.2])
const simpleHouse = new building("simple house",8,"housing",0,[15,10],1.2,[wood,stone],["none"],[0],[population],[5],["none"],[0])
const lumberjackHut = new building("lumberjack hut",9,"production",0,[10],1.2,[wood],[lumberjack],[1],["none"],[0],["none"],[0])
//const = new building("",,0,[],,[""],[""],[],[""],[],[""],[])
const buildingArray = [sawmill,quarry,mine,coalMine,smeltery,wharehouse,farm,library,simpleHouse,lumberjackHut]
var researchUlocked = false
function changeBuildingAmount(building,op) {
    if(checkCost(building.cost.resource,building.cost.cost) == 1) {
        building.amount = operations[op](building.amount,1)
        console.log(building.amount)
        if(building.job.type[0] != "none") {
            for(var i = 0; i < building.job.type.length; i++) {
                building.job.type[i].max = operations[op](building.job.type[i].max,1)
                addjob(building.job.type[i])
            }
        }
        if(building.storage.type[0] != "none") {
            for(var s = 0; s < building.storage.type.length; s++) {
                var storeRes = building.storage.type[s]
                if (storeRes.unlocked == true) {
                    storeRes.storageLimit = operations[op](storeRes.storageLimit,building.storage.amount[s])
                    document.getElementById(`${storeRes.name}Max`).innerHTML = `/${storeRes.storageLimit}`
                }
            }
        }
        if(building.modifier.type[0] != "none") {
            changeModifier(building.modifier.type,building.modifier.multiplier,op)
        }
        for(var j = 0; j < building.cost.cost.length; j++) {
            building.cost.cost[j] = Math.round((building.cost.cost[j] * building.cost.multiplier) * 10) / 10
        }
        document.getElementById(`${building.name}Count`).innerHTML = `${building.amount}`
        editTooltip("building",building)
        if(building == library && researchUlocked == false ) {
            createResearchLab()
            researchUlocked = true
        }  
    }
} 
//-------------------------------------------------------------------------------------------------------------------------------
function upgrade(name,id,explanation,MType,MAmount,CType,CAmount,effect) {
    this.name = name
    this.id = id
    this.explanation = explanation
    this.modifier = {
        type:MType,
        amount:MAmount
    }
    this.cost = {
        type:CType,
        amount:CAmount
    }
    this.effect = effect
}
const strongerAxe = new upgrade("Stronger Axe",0,"Stronger axes allow for faster cutting",[wood],[0.20],[copperIngot],[50],function(){if(checkCost([copperIngot],[50]) == 1) {changeModifier([wood],[0.20],"+");removeElement("Stronger Axe")}});
const upgradeArray = [strongerAxe];
function createWorkshop() {
        addtab("upgrade")
        createButton(strongerAxe)
}
//--------------------------------------------------------------------------------------------------------------------------------
function research(name,id,explanation,CType,CAmount,effect) {
    this.name = name
    this.id = id
    this.explanation = explanation
    this.cost = {
        type:CType,
        amount:CAmount
    }
    this.effect = effect
}
const storage = new research("storage",0,"allows for storing large amounts of resources",[knowledge],[75],function() {doResearch([wharehouse],["none"],["none"],storage,[knowledge],[75])})
const mining = new research("mining",1,"allows for extraction of new resources",[knowledge],[100],function() {doResearch([smelting,mine,coalMine],[copperOre,coal],["none"],mining,[knowledge],[100])}) 
const smelting = new research("smelting",2,"allows for turning ore in to usable material",[knowledge],[150],function() {doResearch([smeltery,ironWorking],[copperIngot],["none"],smelting,[knowledge],[150])}) 
const ironWorking = new research("iron working",3,"make new metals by combining others",[knowledge],[250],function() {doResearch(["none"],[ironOre,ironIngot],[[2,ironOre,0.05,"none",0]],ironWorking,[knowledge],[250])})
const trade = new research("trade",4,"allows for trading with other civilizations",[knowledge],[450],function(){doResearch(["none"],[gold],[[2,gold,0.01,"none",0]],trade,[knowledge],[450])}) 
const researchArray = [storage,mining,smelting,ironWorking,trade];
function createResearchLab() {
    addtab("research")
    createButton(storage)
    createButton(mining)
    createButton(trade)
}
function doResearch(button,resource,prodComp,research,costR,costA) {
    if(checkCost(costR,costA) == 1) {
        if(button[0] != "none") {
            for(var i = 0; i < button.length; i++) {
                createButton(button[i])
            }
        }
        if(resource[0] != "none") {
            for(var i = 0; i < resource.length; i++) {
                createResourceUI(resource[i])
            }
        }
        if(prodComp[0] != "none") {
            for(var i = 0; i < prodComp.length; i++) {
                addProdAndComp(prodComp[i][0],prodComp[i][1],prodComp[i][2],prodComp[i][3],prodComp[i][4])
            }
        }
        switch(research) {
            case smelting: createWorkshop(); break;
            case trade: createMarket(); break;
        }
        removeElement(research.name)
    }
}
//--------------------------------------------------------------------------------------------------------------------------------
function miscellaneous(name,id,CType,CAmount,explanation) {
    this.name = name
    this.id = id
    this.cost = {
        type:CType,
        amount:CAmount
    }
    this.explanation = explanation
}
const workshop = new miscellaneous("workshop",0,[wood,stone],[300,200],"unlocks upgrades to improve production")
const researchLab = new miscellaneous("research lab",1,[wood,stone],[200,100],"unlocks research to find new means of production")
const market = new miscellaneous("market",2,[wood,stone],[250,400],"allows for buying and selling of resources")
const miscellaneousArray = [workshop,researchLab,market]
//--------------------------------------------------------------------------------------------------------------------------------
var marketUnlocked = false
function createMarket() {
        addtab("market")
        var input = document.createElement("input")
        input.type = "number"
        input.id = "marketInput"
        input.value = 100
        document.getElementById("market content").appendChild(input)
        for(var i = 0; i < resourceArray.length; i++) {
            var curres = resourceArray[i]
            if(curres.name != "knowledge" && curres.name != "population" && curres.name != "gold") {
                if(curres.unlocked == true) {
                    createMarketUI(curres)
                }
            } 
        }
        marketUnlocked = true
}
function createMarketUI(curres) {
    const curDiv = document.createElement("div")
    curDiv.id = `${curres.name}`
    curDiv.innerHTML = `<div class="marketText">${curres.name}:</div><button id="${curres.name}buy">buy</button><button id="${curres.name}sell">sell</button>`
    var res = curres
    document.getElementById("market content").appendChild(curDiv);
    document.getElementById(`${curres.name}buy`).onclick = function() {marketTransaction(curres,"+")}
    document.getElementById(`${curres.name}sell`).onclick = function() {marketTransaction(curres,"-")}
    document.getElementById(`${curres.name}buy`).onmouseover = function() {editTooltip('market buy',curres)}
    document.getElementById(`${curres.name}sell`).onmouseover = function() {editTooltip('market sell',curres)}
    document.getElementById(`${curres.name}buy`).classList.add("marketButton")
    document.getElementById(`${curres.name}sell`).classList.add("marketButton") 
}
function marketTransaction(curres,op) {
    var gold = resourceArray[10]
    var amount = document.getElementById("marketInput").value
    if(op == "+") {
        if(gold.amount >= (curres.cost*amount)) {
            curres.amount += amount
            gold.amount -= (curres.cost*amount)
        }
    } else if(op == "-") {
        if(curres.amount >= amount) {
            curres.amount -= amount
            gold.amount += ((curres.cost*amount)*0.8)
        }
    }
}
//--------------------------------------------------------------------------------------------------------------------------------
function checkCost(resType,resAmount) {
    for(var i = 0; i < resType.length; i++) {
        if(resType[i].amount < resAmount[i]) {
            return 0
        } 
    }
    for(var c = 0; c < resType.length; c++) {
        resType[c].amount -= resAmount[c]    
    }
    return 1
}
function changeProdAndComp(jobType,op) {
    if(asAmount != population.amount || op == "-") {
        if(jobType.max != jobType.active[0] || op == "-") {
            if(jobType.active[0] != 0 || op == "+") {
                for(var c = 0; c < jobType.production.type.length; c++) {
                    var prodres = jobType.production.type[c]
                    prodres.production = operations[op](prodres.production,jobType.production.amount[c])
                    updateProd(prodres)
                }
                if(jobType.comsumption.type != "none") {
                    for(var c = 0; c < jobType.comsumption.type.length; c++) {
                        var compres = jobType.comsumption.type[c]
                        compres.comsumption = operations[op](compres.comsumption,jobType.comsumption.amount[c])
                        updateProd(compres)  
                    }          
                }
                jobType.active[0] = operations[op](jobType.active[0],1)
                curjob = document.getElementById(jobType.name)
                curjob.querySelector('span').innerHTML = `${jobType.active[0]}/${jobType.max}`
                updateAssigned(1,op)  
            }  
        }
    }  
}
function updateProd(curres) {
    resEndProd =  Math.round((curres.endProd()*10)*10000)/10000
    if(curres.endProd() >= 0) {
        document.getElementById(`${curres.name}Prod`).innerHTML = `+${resEndProd}/s`
    } else {
        document.getElementById(`${curres.name}Prod`).innerHTML = `${resEndProd}/s`
    }
}
function changeModifier(modType,modAmount,op) {
    for(var s = 0; s < modType.length; s++) {
        modType[s].modifier = operations[op](modType[s].modifier,modAmount[s])
        updateProd(modType[s])
    }
}
function addProdAndComp(id,prodres,prodAmount,compres,compAmount) {
    jobType = jobArray[id]
    if(prodres != "none") {
        jobType.production.type.push(prodres)
        jobType.production.amount.push(prodAmount)
        prodres.production += (prodAmount * jobType.active[0])
        updateProd(prodres) 
    } else if(compres != "none") {
        jobType.comsumption.type.push(compres)
        jobType.comsumption.amount.push(compAmount) 
        compres.comsumption += (compAmount * jobType.active[0])
        updateProd(compres)   
    }
}
//---------------------------------------------------------------------------------------------------------------------------------
function editTooltip(type,item) {
    if(type == "gather") {
        var text = `gather 1 ${item.name}`
    } else if(type == "building") {
        var text = `${item.name} <br>`
        text += costEdit(item.cost.resource,item.cost.cost)
        if(item.job.type != "none") {
            text += `provides ${item.job.amount} ${item.job.type[0].name} job<br>`
        }
        if(item.storage.type != "none") {
            text += `increases storage for ` 
            for(s = 0; s < item.storage.type.length ;s++) {
                var curres = item.storage.type[s]
                if(curres.unlocked == true) {
                    text += `${item.storage.type[s].name} by ${item.storage.amount[s]}<br>`
                }
            }
        }
        if(item.modifier.type != "none") {
            text += `increases production for `
            for(i = 0; i < item.modifier.type.length ;i++) {
                text += `${item.modifier.type[i].name} by ${item.modifier.multiplier[i]*100}%<br>`
            }
        }
    } else if(type == "job") {
        var text = `${item.name} <br>`
        if(item.production.type != "none"){
            text += `produces `
            for(i = 0; i < item.production.type.length ;i++) {
                text += `${item.production.amount[i]*10} ${item.production.type[i].name} per second<br>`
            }
        }
        if(item.comsumption.type != "none"){
            text += `comsumes `
            for(i = 0; i < item.comsumption.type.length ;i++) {
                text += `${item.comsumption.amount[i]*10} ${item.comsumption.type[i].name} per second<br>`
            }
        }
    } else if(type == "upgrade") {
        text = `${item.name}<br>
        ${costEdit(item.cost.type,item.cost.amount)}
        ${item.explanation}</br>`
        for(i = 0; i < item.modifier.type.length; i++) {
            text += `increases the production of ${item.modifier.type[i].name} by ${item.modifier.amount[i]*100}%<br>`
        }
    } else if(type == "research") {
        text = `${item.name} <br> ${costEdit(item.cost.type,item.cost.amount)} ${item.explanation}`
    } else if(type == "miscellaneous") {
        text = `${item.name} <br> ${costEdit(item.cost.type,item.cost.amount)} ${item.explanation}`
    } else if(type.includes("market")) {
        text = `${item.name}<br>`
        var amount = document.getElementById("marketInput").value
        if(type.includes("buy")) {
            text += `buy ${amount} <br> cost: ${(Math.round((item.cost*amount)*100)/100)} gold`
        } else {
            text += `sell ${amount} <br> gain: ${(Math.round(((item.cost*amount)*0.8)*100)/100)} gold`
        }
    } 
    document.getElementById('tooltip').innerHTML = text
}
function costEdit(costType,costAmount) {
    var text = "cost: "
    if(costType.length > 1) {
        for(var i = 0; i < costType.length; i++) {
            text += `${costAmount[i]} ${costType[i].name} `
        } 
    } else {
        text += `${costAmount} ${costType[0].name}`
    }
    text += "<br>"
    return text
}
//---------------------------------------------------------------------------------------------------------------------------------
function autoProduction() {
    for(var i = 0; i < resourceArray.length; i++) { 
        var curres = resourceArray[i]
        if(curres.unlocked == true) {
            if(curres.production != "none") {
                curres.amount += curres.endProd(); 
                curres.amount = Math.round(curres.amount * 100) / 100
            }
            if(curres.amount > curres.storageLimit) {
                curres.amount = curres.storageLimit
            }
            document.getElementById(`${curres.name}Amount`).innerHTML = `${curres.amount}`
        }
    }
    checkNegative()
}
function checkNegative() {
    for(n = 0; n < resourceArray.length; n++) {
        var negres = resourceArray[n]
        if (negres.amount < 0) {
            setInactive(negres)
        } 
    }
}
function setInactive(negres) {
    for(var b = 0; b < jobArray.length; b++) {
        var jobType = jobArray[b]
        for(var i = 0; i < jobType.comsumption.type.length; i++) {
            var res = jobType.comsumption.type[i]
            if(res != "none" && negres == res) {
                for(var i = 0; i < jobType.comsumption.type.length; i++) {
                    res = jobType.comsumption.type[i]
                    res.comsumption = res.comsumption - (jobType.comsumption.amount[i] * jobType.active[0])
                    updateProd(res)
                }
                for(var i = 0; i < jobType.production.type.length; i++) {
                    res = jobType.production.type[i]
                    res.production = res.production - (jobType.production.amount * jobType.active[0]) 
                    updateProd(res)  
                }
                updateAssigned(jobType.active[0],"-")
                jobType.active[0] = 0
                jobType.active[1] = 1 
                curjob = document.getElementById(jobType.name)
                curjob.querySelector('span').innerHTML = `${jobType.active[0]}/${jobType.max}`
                break
            }
        } 
    }
}
function populationCheck() {
    if(population.storageLimit != population.amount && food.amount > 0) {
        population.amount += 1
        food.comsumption += 0.1
        document.getElementById(`${population.name}Amount`).innerHTML = population.amount
    } else if(food.amount < 0 && population.amount != 0) {
        population.amount -= 1
        food.comsumption -= 0.1
        document.getElementById(`${population.name}Amount`).innerHTML = population.amount
    }
    if(jobtab == true) {
        updateAssigned(0,"+")
    }
    updateProd(food) 
}
setInterval(function(){autoProduction();},100);
setInterval(function(){populationCheck();},10000);
//----------------------------------------------------------------------------------------------------------------------------------
function cheatTest(op) {
    for(var i = 0; i < resourceArray.length; i++) {
        curres = resourceArray[i]
        if(curres.unlocked == true) {
            if(op == "+") {
                curres.amount = curres.storageLimit
            } else {
                curres.amount = 0
            }
            curres.amount = Math.round(curres.amount * 100) / 100
            document.getElementById(`${curres.name}Amount`).innerHTML = curres.amount
        }
    }
}
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
var operations = {
    "+": function(a,b) { return a + b},
    "-": function(a,b) { return a - b},
    "*": function(a,b) { return a * b},
    ":": function(a,b) { return a / b},
}
//-----------------------------------------------------------------------------------------------------------------------------------
function removeElement(id) { document.getElementById(id).remove(); }
function addtab(tabName) {
    const tab = document.createElement("button");
    tab.id = tabName
    tab.innerHTML = tabName
    tab.onclick = function() {openTab(event, `${tabName} content`)}
    document.getElementById("tab").appendChild(tab);
    document.getElementById(tabName).classList.add("tablinks") 
    
    const tabcontent = document.createElement("div")
    tabcontent.id = `${tabName} content`
    document.getElementById("contentlist").appendChild(tabcontent);
    document.getElementById(tabcontent.id).classList.add("tabcontent")
}
function createButton(item) {
    const button = document.createElement("div")
    button.id = item.name
    if(item.constructor == building) {
        button.onclick = function() {changeBuildingAmount(item)}
        button.innerHTML = `<span>${item.name}</span>
        <div class="buildingCount" id="${item.name}Count">0</div>
        <div class="buildingSell">sell</div>`
        document.getElementById(`${item.type} ${item.constructor.name}`).appendChild(button)
        document.getElementById(item.name).classList.add("buildingButton")
    } else {
        button.onclick = function() {
            effect = item.effect
            effect()
        }
        button.innerHTML = item.name
        document.getElementById(`${item.constructor.name} content`).appendChild(button)
        document.getElementById(item.name).classList.add("button")
    }
    button.onmouseover = function() {editTooltip(`${item.constructor.name}`,item)} 
    
}