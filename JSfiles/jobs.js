import { res } from "./resources.js"
import { func,changeJobActive } from "../main.js";
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
    job: {
        lumberjack: new job(0,"lumberjack",0,0,[res.wood],[0.1],["none"],[0],false),
        qaurryworker: new job(1,"qaurryworker",0,0,[res.stone],[0.1],["none"],[0],false),
        miner: new job(2,"miner",0,0,[res.copperOre],[0.1],["none"],[0],false),
        coalminer: new job(3,"coalminer",0,0,[res.coal],[0.1],["none"],[0],false),
        smelter: new job(4,"smelter",0,0,[res.copperIngot],[0.01],[res.copperOre,res.coal],[0.2,0.3],false),
        farmer: new job(5,"farmer",0,0,[res.food],[0.125],["none"],[0],false), 
        librarian: new job(6,"librarian",0,0,[res.knowledge],[0.02],["none"],[0],false),
        charcoalMaker: new job(7,"charcoal maker",0,0,[res.coal],[0.1],[res.wood],[0.2],false),
        hunter: new job(8,"hunter",0,0,[res.food,res.fur],[0.11,0.025],["none"],[0],false),
    },
    func: {
        tab: false,
        assigned: 0,
        updateAssigned: (amount,op) => {
            var asPop = func.getId("asPop");
            jobs.func.assigned = func.operations[op](jobs.func.assigned,amount);
            asPop.innerHTML = `assigned ${jobs.func.assigned}/${res.population.amount}`;
        },
        createUi: (jobType) => {
            const curjob = document.createElement("div");
            curjob.id = jobType.name;
            curjob.innerHTML = `<div class="jobText">${jobType.name}</div><button id="${jobType.name}As">assign</button>
                <div id="${jobType.name}Number" style="display: inline-block;">0/1</div><button id="${jobType.name}UnAs">unassign</button>`;
            func.getId("jobs content").appendChild(curjob);
            func.onhover(curjob.id,() => func.tooltip.job(jobType));
            func.getId(curjob.id).querySelector("[class='jobText']").addEventListener("mouseenter",func.tooltip.visibilityOn)
            func.getId(curjob.id).querySelector("[class='jobText']").addEventListener("mouseleave",func.tooltip.visibilityOff)
            func.onclick(`${jobType.name}As`,() => changeJobActive(jobType,"+"));
            func.onclick(`${jobType.name}UnAs`,() => changeJobActive(jobType,"-"));
            func.addClass(`${jobType.name}As`,"jobButton");
            func.addClass(`${jobType.name}UnAs`,"jobButton");
            jobType.uipresent = true;
        },
        add: (jobType) => {
            if(jobs.func.tab == false) {
                func.create.tab("jobs");
                const element = document.createElement("span");
                element.innerHTML = `assigned 0/${res.population.amount}`;
                element.id = "asPop"
                func.getId("jobs content").appendChild(element);
                func.addClass(element.id,"large");
                jobs.func.tab = true;
            }
            if(jobType.uipresent == false) {
                jobs.func.createUi(jobType);
            }
            func.getId(`${jobType.name}Number`).innerHTML = `${jobType.active}/${jobType.max}`;
        },
    }
}
export { jobs }