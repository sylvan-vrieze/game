import { knowledge,copperOre,copperIngot,gold,ironOre,ironIngot,coal,resourceArray } from "./resources.js";
import { mine,coalMine,wharehouse,smeltery } from "./buildings.js";
import { createButton,createResourceUI,addProdAndComp,removeElement,addtab,checkCost,editTooltip,marketTransaction } from "../main.js";
import { strongerAxe,basicWeapons } from "./upgrade.js";
function research(name,id,explanation,CType,CAmount,effect) {
    this.name = name;
    this.id = id;
    this.explanation = explanation;
    this.cost = {
        type:CType,
        amount:CAmount,
    }
    this.effect = effect;
}
const storage = new research("storage",0,"allows for storing large amounts of resources",[knowledge],[75],function() {doResearch([wharehouse],["none"],["none"],storage,[knowledge],[75])});
const mining = new research("mining",1,"allows for extraction of new resources",[knowledge],[100],function() {doResearch([smelting,mine,coalMine],[copperOre,coal],["none"],mining,[knowledge],[100])}); 
const smelting = new research("smelting",2,"allows for turning ore in to usable material",[knowledge],[150],function() {doResearch([smeltery,ironWorking],[copperIngot],["none"],smelting,[knowledge],[150])}); 
const ironWorking = new research("iron working",3,"make new metals by combining others",[knowledge],[250],function() {doResearch(["none"],[ironOre,ironIngot],[[2,ironOre,0.05,"none",0]],ironWorking,[knowledge],[250])});
const trade = new research("trade",4,"allows for trading with other civilizations",[knowledge],[450],function(){doResearch(["none"],[gold],[[2,gold,0.01,"none",0]],trade,[knowledge],[450])}); 
function doResearch(button,resource,prodComp,research,costR,costA) {
    if(checkCost(costR,costA) == 1) {
        if(button[0] != "none") {
            for(var i = 0; i < button.length; i++) {
                createButton(button[i]);
            }
        }
        if(resource[0] != "none") {
            for(var i = 0; i < resource.length; i++) {
                createResourceUI(resource[i]);
            }
        }
        if(prodComp[0] != "none") {
            for(var i = 0; i < prodComp.length; i++) {
                addProdAndComp(prodComp[i][0],prodComp[i][1],prodComp[i][2],prodComp[i][3],prodComp[i][4]);
            }
        }
        switch(research) {
            case smelting: createWorkshop(); break;
            case trade: createMarket(); break;
        }
        removeElement(research.name);
    }
}
function createWorkshop() {
    addtab("upgrade");
    createButton(strongerAxe);
    createButton(basicWeapons);
}
var marketUnlocked = false
function createMarket() {
        addtab("market");
        var input = document.createElement("input");
        input.type = "number";
        input.id = "marketInput";
        input.value = 100;
        document.getElementById("market content").appendChild(input);
        for(var i = 0; i < resourceArray.length; i++) {
            var curres = resourceArray[i];
            if(curres.name != "knowledge" && curres.name != "population" && curres.name != "gold") {
                if(curres.unlocked == true) {
                    createMarketUI(curres);
                }
            } 
        }
        marketUnlocked = true;
}
function createMarketUI(curres) {
    const curDiv = document.createElement("div");
    curDiv.id = `${curres.name}`;
    curDiv.innerHTML = `<div class="marketText">${curres.name}:</div><button id="${curres.name}buy">buy</button><button id="${curres.name}sell">sell</button>`;
    document.getElementById("market content").appendChild(curDiv);
    document.getElementById(`${curres.name}buy`).onclick = function() {marketTransaction(curres,"+")};
    document.getElementById(`${curres.name}sell`).onclick = function() {marketTransaction(curres,"-")};
    document.getElementById(`${curres.name}buy`).onmouseover = function() {editTooltip('market buy',curres)};
    document.getElementById(`${curres.name}sell`).onmouseover = function() {editTooltip('market sell',curres)};
    document.getElementById(`${curres.name}buy`).classList.add("marketButton");
    document.getElementById(`${curres.name}sell`).classList.add("marketButton");
}
export { storage,mining,smelting,ironWorking,trade,marketUnlocked }