const SUFFIXES = ["k","m","g","t"]
const ITEMBUTTON_SCALE_X = 1
const ITEMBUTTON_SCALE_Y = 1
const ITEMBUTTONHEIGHT =  59 * ITEMBUTTON_SCALE_Y
const ITEMBUTTON_X = 800-192*ITEMBUTTON_SCALE_X
const ITEMBUTTON_Y = 61
const GOLDPOSSMALL = [178, 26]
const GOLDPOSBIG = [180,14]
const COLORCODE = {
    "green" : "#33ff00",
    "red" : "#ff0000",
    "gray" : "#808080",
    "white": "#ffffff",
}
// enum
const ItemType = {
    Cursor:0,
    GoldenCan:1,
    RainbowCan:2
};
class UIScene extends Phaser.Scene{
    // parent (Controller)
    #parentScene;
    #elapsedTime = 0;
    // button with watering can  
    #button;
    // gold (top left)
    #boardL;
    #gold;
    #goldTxt;
    #goldIcon;
    // system
    #itemJsonData;
    #itemButtons = []
    #purchasedAmounts = [];
    #onPurchasedItemFuncs;
    #onPurchasedUpgradeFuncs;
    // item
    #cursors;
    // production
    #production;
    #calcProduction = 0;
    productionPS = 0;
    #productionTxt;
    #mulipliers = [];
    // get button(){return this.button}
    get parentScene(){return this.#parentScene}
    get gold(){return this.#gold}
    get production(){return this.#production}
    get purchasedAmounts(){return this.#purchasedAmounts}
    set gold(n){
        this.#gold = n
        this.onGoldChanged(n)
        this.#goldTxt.setText(this.#gold.toLocaleString())
        if (this.#gold > 99999){
            this.#goldTxt.setFontSize(18)
            this.#goldTxt.setX(GOLDPOSSMALL[0])
            this.#goldTxt.setY(GOLDPOSSMALL[1])
        } 
    }
    set production(x){
        this.#production = x
        // console.log((parseInt(this.production/10)).toLocaleString()+"."+parseInt(this.production%10));
        this.#productionTxt.setText("grows "+(parseInt(this.production/10)).toLocaleString()+"."+parseInt(this.production%10)+"\ntimes per second")
    }
    constructor (config,scene)
    {
        super(config);
        this.#parentScene = scene
        
        for(var j = 0; j < 10; j++){
            this.#purchasedAmounts.push(0)
            this.#mulipliers.push(1)
        };
        this.#cursors = []

        this.#onPurchasedItemFuncs = [this.cursor,this.goldenCan,this.rainbowCan]
        this.#onPurchasedUpgradeFuncs = {"unlockNewPlantArea":this.unlockNewPlantArea,
                                        "unlockSpecies":this.unlockSpecies,
                                        "upgradeInitFunc":this.upgradeInitFunc  
        }
    }

    create(){
        this.#itemJsonData = this.parentScene.cache.json.get("item");
        this.#boardL = this.add.image(0,0,"board").setOrigin(0,0)
        this.boardR = new UpgradeBoard(this,this.#itemJsonData.upgrades)
        console.log(this.boardR);
        // this.boardR = this.add.image(ITEMBUTTON_X,0,"board").setOrigin(0,0)
        this.#button = this.add.sprite(110,280,"seedButtonSq_1")
                              .setOrigin(0.5,0.5)
                              .setInteractive()
        this.#goldTxt = this.add.text(180, 14, '0', 
                                { fontFamily:"font1",fontSize: '36px', fill: COLORCODE["white"]})
                               .setOrigin(1,0)
                               .setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);    
        this.#goldIcon = this.add.sprite(10,20,"coin")
                                .setOrigin(0,0)
                                .setScale(2,2)
        this.#productionTxt = this.add.text(40,160, "grows "+0+"\ntimes per second" , 
                                     { fontFamily:"font1",fontSize: '16px', fill: COLORCODE["white"],align:"center"})
                                     .setOrigin(0,0) 
        this.gold = 0;
        this.#production = 0;
        for(var i in this.#itemJsonData.items){
            this.#itemButtons.push(new ItemButton(this,i,this.#itemJsonData.items[i]))
        }
        // this.purchaseItem(ItemType.Cursor,0)
    }
    
    update(time,delta){
        // glow plants
        this.#elapsedTime += delta;
        if (this.#elapsedTime >= 100) {
            this.#elapsedTime %= 100;  
            this.#calcProduction += this.production
        }
        if (this.#calcProduction > 100){
            var i = parseInt(this.#calcProduction / 100)
            this.#calcProduction %= 100
            for (var j  = 0; j < i; j++) this.getFarmScene().farm.grow()
        }

        // move cursors
        for (var i in this.#cursors){
            this.#cursors[i].angle+=0.1
        } 
    }
    
    createButtonActions(){
        this.anims.create({
            key:"press",
            frames:[
                {key:"seedButtonSq_2"},
                {key:"seedButtonSq_1"}
            ],
            frameRate: 6,
            repeat: 0
                })
        this.anims.create({
            key:"notpress",
            frames:[
                {key:"seedButtonSq_1"}
            ],
            frameRate: 6,
            repeat: 0
        })
        this.#button.on("pointerdown",function(pointer){
            this.#button.play("press");
            this.getFarmScene().farm.grow()
        },this)
        this.#button.on("pointerup",function(pointer){
            this.#button.play("notpress")
        },this)
    }
    purchaseItem(buttonIdx,price){
        this.gold = this.gold - price
        this.#purchasedAmounts[buttonIdx]++;
        this.production = this.production + this.#itemJsonData.items[buttonIdx].production*this.#mulipliers[buttonIdx]
        this.#onPurchasedItemFuncs[buttonIdx](this)
    }
    purchaseUpgrade(funcName,price,args){
        console.log(price,"gold");
        if(price != 0) this.gold = this.gold - price
        this.#onPurchasedUpgradeFuncs[funcName](this,args)
    }

    addGold(x){
        this.gold = this.gold + x
    }
    cursor(scene){
        var angle = Phaser.Math.Between(-180,180)
        var container = scene.add.container(110,280).setAngle(angle)
        var posY = Phaser.Math.Between(40,50)

        container.add(scene.add.sprite(0,posY,"Cursor")
                     .setOrigin(0.5,0)
                     .setInteractive())
        scene.#cursors.push(container)
    }
    goldenCan(scene){}
    rainbowCan(scene){}
    unlockNewPlantArea(scene,...args){
        scene.getFarmScene().unlockNewPlantArea()
    }
    unlockSpecies(scene,...args){
        scene.getFarmScene().unlockSpecies(args[0].species)
    }
    getFarmScene(){
        return this.parentScene.farmScene
    }
    upgradeInitFunc(scene,...args){
        // scene.getFarmScene().unlockSpecies(0)
        console.log("upgradeInitFunc called");
    }
    onGoldChanged(gold){
        this.updateSeedButtons()
        this.boardR.updateUpgradesAlpha(gold)
    }
    updateSeedButtons(){
        for(var i in this.#itemButtons){
            if(this.#gold >= this.#itemButtons[i].priceInt){
                this.#itemButtons[i].setPriceTextColor(COLORCODE["green"])
            }else{
                this.#itemButtons[i].setPriceTextColor(COLORCODE["red"])
            }
        }
    }
}   

