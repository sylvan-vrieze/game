import { resources } from "./resources.js"
import { func,addtab,editTooltip,changeProdAndComp } from "../main.js";
function job(id,name,active,max,prodType,prodAmount,compType,compAmount,uipresent) {
    this.id = id;
    this.name = name;
    this.active = active;
    this.max = max;
    this.production = {
        type:prodType,
        amount:prodAmount,
    }
    this.comsumption = {
        type:compType,
        amount:compAmount,
    }
    this.uipresent = uipresent; 
}
const jobs = {
    lumberjack: new job(0,"lumberjack",0,0,[resources.wood],[0.1],["none"],[0],false),
    qaurryworker: new job(1,"qaurryworker",0,0,[resources.stone],[0.1],["none"],[0],false),
    miner: new job(2,"miner",0,0,[resources.copperOre],[0.1],["none"],[0],false),
    coalminer: new job(3,"coalminer",0,0,[resources.coal],[0.1],["none"],[0],false),
    smelter: new job(4,"smelter",0,0,[resources.copperIngot],[0.01],[resources.copperOre,resources.coal],[0.2,0.3],false),
    farmer: new job(5,"farmer",0,0,[resources.food],[0.2],["none"],[0],false), 
    librarian: new job(6,"librarian",0,0,[resources.knowledge],[0.02],["none"],[0],false),
    func: {
        tab: false,
        assigned: 0,
        updateAssigned: (amount,op) => {
            var asPop = func.getId("asPop");
            jobs.func.assigned = func.operations[op](jobs.func.assigned,amount);
            asPop.innerHTML = `assigned ${jobs.func.assigned}/${resources.population.amount}`;
        },
        createUi: (jobType) => {
            const curjob = document.createElement("div");
            curjob.id = jobType.name;
            curjob.innerHTML = `<div class="jobText">${jobType.name}</div><button id="${jobType.name}As">assign</button><span>0/1</span><button id="${jobType.name}UnAs">unassign</button>`;
            func.getId("jobs content").appendChild(curjob);
            func.getId(curjob.id).onmouseover = function() {editTooltip('job',jobType)};
            func.getId(`${jobType.name}As`).onclick = function() {changeProdAndComp(jobType,"+")};
            func.getId(`${jobType.name}UnAs`).onclick = function() {changeProdAndComp(jobType,"-")};
            func.getId(`${jobType.name}As`).classList.add("jobButton");
            func.getId(`${jobType.name}UnAs`).classList.add("jobButton");
        },
        add: (jobType) => {
            if(jobs.func.tab == false) {
                addtab("jobs");
                const element = document.createElement("span");
                element.innerHTML = `assigned 0/${resources.population.amount}`;
                element.id = "asPop"
                func.getId("jobs content").appendChild(element);
                func.getId(element.id).classList.add("large");
                jobs.func.tab = true;
            }
            if(jobType.uipresent == false) {
                jobs.func.createUi(jobType);
                jobType.uipresent = true;
            }
            func.getId(jobType.name).querySelector('span').innerHTML = `${jobType.active}/${jobType.max}`;
        },
    }
}
export { jobs }