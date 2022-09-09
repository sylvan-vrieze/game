import { func,market } from "../main.js";
function resource(id,name,amount,production,comsumption,storageLimit,modifier,unlocked,Ccost,Scost) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.production = production;
    this.comsumption = comsumption;
    this.storageLimit = storageLimit;
    this.modifier = modifier;
    this.endProd = function() {
        return (this.production * this.modifier) - this.comsumption; 
    }
    this.unlocked = unlocked;
    this.cost = {
        current:Ccost,
        start:Scost
    };
}
const resources = {
    food: new resource(0,"food",0,0,0,500,1,true,0.001,0.001),
    wood: new resource(1,"wood",0,0,0,500,1,true,0.001,0.001),
    stone: new resource(2,"stone",0,0,0,500,1,true,0.001,0.001),
    copperOre: new resource(3,"copper ore",0,0,0,500,1,false,0.0015,0.0015),
    coal: new resource(4,"coal",0,0,0,500,1,false,0.0015,0.0015),
    copperIngot: new resource(5,"copper ingot",0,0,0,250,1,false,0.0025,0.0025), 
    knowledge: new resource(6,"knowledge",0,0,0,100,1,true,0,0),
    population: new resource(7,"population",0,"none","none",10,1,true,0,0),
    ironOre: new resource(8,"iron ore",0,0,0,500,1,false,0.002,0.002),
    ironIngot: new resource(9,"iron ingot",0,0,0,250,1,false,0.0045,0.0045),
    gold: new resource(10,"gold",0,0,0,100,1,false,0,0),
    fur: new resource(11,"fur",0,0,0,300,1,false,0.002,0.002),
    func: {
        click: (res) => { res.amount += 1 },
        createUI: (res) => {
            let resUiArray = [["Name",`${res.name}:`],["Amount","0"],["Max",`/${res.storageLimit}`],["Prod",`+0/s`]];
            const resImg = document.createElement('img')
            resImg.src = `images/resources/${res.name}.png`
            func.getId("resImage").appendChild(resImg)
            resImg.classList.add("resImage")
            for(var i = 0; i < resUiArray.length; i++) {
                var resUi = document.createElement('div');
                resUi.id = `${res.name}${resUiArray[i][0]}`;
                resUi.innerHTML = `${resUiArray[i][1]}`;
                func.getId(`res${resUiArray[i][0]}`).appendChild(resUi);
                func.addClass(`${res.name}${resUiArray[i][0]}`,`res${resUiArray[i][0]}`);
            }
            if(res.name != "gold" && market.unlocked == true) {
                market.createUI(res);
            }
            res.unlocked = true ;
        }
    },
}
export { resources }