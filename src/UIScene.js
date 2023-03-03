const SUFFIXES = ["k","m","g","t"]
const ITEMBUTTONY = 61
const ITEMBUTTON_SCALEX = 1
const ITEMBUTTON_SCALEY = 1
const ITEMBUTTONHEIGHT =  59 * ITEMBUTTON_SCALEY
const ITEMBUTTONX = 800-192*ITEMBUTTON_SCALEX
const GOLDPOSSMALL = [178, 26]
const GOLDPOSBIG = [180,14]
const COLORCODE = {
    "green" : "#33ff00",
    "red" : "#ff0000",
    "gray" : "#808080",
    "white": "#ffffff",
}
class UIScene extends Phaser.Scene{
    // parent (Controller)
    parentScene;
    elapsedTime = 0;
    // button with watering can  
    button;
    // gold (top left)
    boardL;
    #gold;
    goldTxt;
    goldIcon;
    // system
    itemJsonData;
    itemButtons = []
    #purchasedAmounts = [];
    onPurchasedFuncs = [];

    // item
    cursors;
    // production
    #production;
    calcProduction = 0;
    productionPS = 0;
    productionTxt;
    mulipliers = [];
    get button(){return this.button}
    set parentScene(s){this.parentScene = s}
    get gold(){return this.#gold}
    get production(){return this.#production}
    get purchasedAmounts(){return this.#purchasedAmounts}
    set gold(n){
        this.#gold = n
        this.updateSeedButtons()
        this.goldTxt.setText(this.#gold.toLocaleString())
        if (this.#gold > 99999){
            this.goldTxt.setFontSize(18)
            this.goldTxt.setX(GOLDPOSSMALL[0])
            this.goldTxt.setY(GOLDPOSSMALL[1])
        } 
    }
    set purchasedAmounts(n){
        this.#purchasedAmounts[n]++;
        this.production = this.production + this.itemJsonData.items[n].production*this.mulipliers[n]
        this.onPurchasedFuncs[n](this)
    }
    set production(x){
        this.#production = x
        // console.log((parseInt(this.production/10)).toLocaleString()+"."+parseInt(this.production%10));
        this.productionTxt.setText("grows "+(parseInt(this.production/10)).toLocaleString()+"."+parseInt(this.production%10)+"\ntimes per second")
    }
    constructor (config,scene)
    {
        super(config);
        this.parentScene = scene
    }
    updateSeedButtons(){
        for(var i in this.itemButtons){
            if(this.#gold >= this.itemButtons[i].priceInt){
                this.itemButtons[i].setPriceTextColor(COLORCODE["green"])
            }else{
                this.itemButtons[i].setPriceTextColor(COLORCODE["red"])
            }
        }
    }
    create(){
        this.boardL = this.add.image(0,0,"board").setOrigin(0,0)
        this.boardR = this.add.image(ITEMBUTTONX,0,"board").setOrigin(0,0)
        this.button = this.add.sprite(110,280,"seedButtonSq_1")
                              .setOrigin(0.5,0.5)
                              .setInteractive()
        this.itemJsonData = this.parentScene.cache.json.get("item");
        // this.cursors.add(this.add.sprite(40,40,"cursor").setOrigin(0.5,0).setInteractive())
        this.goldTxt = this.add.text(180, 14, '0', { fontFamily:"font1",fontSize: '36px', fill: COLORCODE["white"]})
                               .setOrigin(1,0)
                               .setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);    
        this.gold = 0;
        this.goldIcon = this.add.sprite(10,20,"coin").setOrigin(0,0).setScale(2,2)
        for(var j = 0; j < 10; j++){
            this.#purchasedAmounts.push(0)
            this.mulipliers.push(1)
        };
        this.cursors = []
        for(var i in this.itemJsonData.items){
            this.itemButtons.push(new ItemButton(this,i,this.itemJsonData.items[i]))
        }
        this.#production = 0;
        this.productionTxt = this.add.text(40,160, "grows "+0+"\ntimes per second" , { fontFamily:"font1",fontSize: '16px', fill: COLORCODE["white"],align:"center"}).setOrigin(0,0) 
        this.onPurchasedFuncs = [this.cursor,this.goldenCan,this.rainbowCan]
        this.purchasedAmounts = 0

    }
    
    update(time,delta){
        // glow plants
        this.elapsedTime += delta;
        if (this.elapsedTime >= 100) {
            this.elapsedTime %= 100;  
            this.calcProduction += this.production
        }
        if (this.calcProduction > 100){
            var i = parseInt(this.calcProduction / 100)
            this.calcProduction %= 100
            for (var j  = 0; j < i; j++) this.parentScene.farmScene.farm.grow()
        }

        // move cursors
        for (var i in this.cursors){
            this.cursors[i].angle+=0.2
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
        this.button.on("pointerdown",function(pointer){
            this.button.play("press");
            this.parentScene.farmScene.farm.grow()
        },this)
        this.button.on("pointerup",function(pointer){
            this.button.play("notpress")
        },this)
    }
    getUIScene(){return this.parentScene.farmScene}
    purchase(buttonIdx,price){
        this.gold = this.gold - price
        this.purchasedAmounts = buttonIdx
    }
    addGold(x){
        this.gold = this.gold + x
    }
    cursor(scene){
        var angle = Phaser.Math.Between(-180,180)
        var container = scene.add.container(110,280).setAngle(angle)
        var posy = Phaser.Math.Between(40,50)

        container.add(scene.add.sprite(0,posy,"Cursor")
                     .setOrigin(0.5,0)
                     .setInteractive())
        scene.cursors.push(container)
    }
    goldenCan(scene){}
    rainbowCan(scene){}
}

