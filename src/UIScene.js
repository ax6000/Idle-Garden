const SUFFIXES = ["k","m","g","t"]
const SEEDBUTTONY = 61
const SEEDBUTTON_SCALEX = 1
const SEEDBUTTON_SCALEY = 1
const SEEDBUTTONHEIGHT =  59 * SEEDBUTTON_SCALEY
const SEEDBUTTONX = 800-192*SEEDBUTTON_SCALEX
const GOLDPOSSMALL = [178, 26]
const GOLDPOSBIG = [180,14]
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
    itemJson;
    seedButtons = []
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
        this.production = this.production + this.itemJson.items[n].production*this.mulipliers[n]
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
        for(var i in this.seedButtons){
            if(this.#gold >= this.seedButtons[i].priceInt){
                this.seedButtons[i].priceTxt.setFill("#33ff00")
            }else{
                this.seedButtons[i].priceTxt.setFill("#ff0000")
            }
        }
    }
    create(){
        this.boardL = this.add.image(0,0,"board").setOrigin(0,0)
        this.boardR = this.add.image(SEEDBUTTONX,0,"board").setOrigin(0,0)
        this.button = this.add.sprite(110,280,"seedButtonSq_1").setInteractive()
        this.itemJson = this.parentScene.cache.json.get("item");
        // this.cursors.add(this.add.sprite(40,40,"cursor").setOrigin(0.5,0).setInteractive())
        this.goldTxt = this.add.text(180, 14, '0', { fontFamily:"font1",fontSize: '36px', fill: '#ffffff'}).setOrigin(1,0).setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);    
        this.gold = 0;
        this.goldIcon = this.add.sprite(10,20,"coin").setOrigin(0,0).setScale(2,2)
        for(var j = 0; j < 10; j++){
            this.#purchasedAmounts.push(0)
            this.mulipliers.push(1)
        };
        this.cursors = this.add.container(110,280);
        for(var i in this.itemJson.items){
            this.seedButtons.push(new Button(this,i,this.itemJson.items[i]))
        }
        this.#production = 0;
        this.productionTxt = this.add.text(40,160, "grows "+0+"\ntimes per second" , { fontFamily:"font1",fontSize: '16px', fill: '#ffffff',align:"center"}).setOrigin(0,0) 
        this.onPurchasedFuncs = [this.cursor,this.goldenCan,this.rainbowCan]
        this.purchasedAmounts = 0
        this.tweens.add({
            targets: this.cursors,
            rotation: -Math.PI * 2,
            duration: 12000,
            repeat: -1
        });
    }
    update(time,delta){
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
    addGold(x){
        this.gold = this.gold + x
        if (this.gold < 1000){
            this.goldTxt.setText(this.gold.toLocaleString())
            return
        }        
    }
    cursor(scene){

        // console.log("cursor called",this);
        var posx = Phaser.Math.Between(-50,50)
        var posy = Phaser.Math.Between(30,50)
        scene.cursors.add(scene.add.sprite(posx,posy,"Cursor").setOrigin(0.5,0).setInteractive())
    }
    goldenCan(scene){}
    rainbowCan(scene){}
}

class Button{
    button;
    scene;
    idx;
    icon;
    txt
    coin;
    basePrice;
    #price;
    priceInt
    jsonData;
    priceTxt
    buttonItems;
    buttonTweenStart;
    buttonTweenEnd;
    #purchasedAmount = 0;
    discount;
    penalty;
    get buttonTweenStart(){return this.buttonTweenStart}
    get price(){return this.#price}
    get purchasedAmount(){return this.#purchasedAmount}
    set price(x){
        this.#price = x
        this.priceInt = parseInt(x)
        // console.log(parseInt(x).toLocaleString());
        this.priceTxt.setText(this.priceInt.toLocaleString())
    }
    set purchasedAmount(n){
        this.#purchasedAmount = n
        this.scene.purchasedAmounts = this.idx
        this.amountTxt.setText(n.toLocaleString())
    }
    
    constructor(scene,i,data){
        this.scene =scene
        this.idx = i
        this.button = this.scene.add.sprite(SEEDBUTTONX,SEEDBUTTONY+SEEDBUTTONHEIGHT*i,"seedButton_1").setOrigin(0,0).setScale(SEEDBUTTON_SCALEX,SEEDBUTTON_SCALEY).setInteractive()
        this.button.name = "button"
        this.jsonData = data
        this.priceTxt = this.scene.add.text(SEEDBUTTONX+56,37+SEEDBUTTONY+SEEDBUTTONHEIGHT*i, 0, { fontFamily:"font1",fontSize: '18px', fill: '#ff0000' }).setOrigin(0,0).setInteractive().setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0)
        this.basePrice = data.price
        this.price = this.basePrice
        this.icon = this.scene.add.sprite(SEEDBUTTONX+10,20+SEEDBUTTONY+SEEDBUTTONHEIGHT*i,data.name).setOrigin(0,0).setScale(data.scaleX,data.scaleY).setInteractive()
        this.txt = this.scene.add.text(SEEDBUTTONX+42,8+SEEDBUTTONY+SEEDBUTTONHEIGHT*i, data.name, { fontFamily:"font1",fontSize: '28px', fill: '#ffffff' }).setOrigin(0,0).setInteractive().setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0)
        this.coin = this.scene.add.sprite(SEEDBUTTONX+37,41+SEEDBUTTONY+SEEDBUTTONHEIGHT*i,"coin").setOrigin(0,0).setScale(SEEDBUTTON_SCALEX,SEEDBUTTON_SCALEY).setInteractive()
        this.amountTxt = this.scene.add.text(SEEDBUTTONX+186,37+SEEDBUTTONY+SEEDBUTTONHEIGHT*i, '0', { fontFamily:"font1",fontSize: '18px', fill: '#808080' }).setOrigin(1,0).setInteractive().setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0)
        this.buttonItems = this.scene.add.group()
        this.buttonItems.addMultiple([this.icon,this.coin,this.txt,this.priceTxt,this.button])
        this.discount =1
        Phaser.Actions.Call(this.buttonItems.getChildren(),function(item){
            item.setData("parent",this)
            item.on("pointerdown",function(pointer){
                // console.log(this,this.scene,this.scene.tweens,this.buttonTweenStart);
                // console.log(this.getData("parent"));
                this.getData("parent").purchase()
        })},this)
        // console.log(this.scene.tweens,this.buttonTweenStart);
        this.buttonTweenEnd = 0
       
    }
    purchase(){
        if (this.#price > this.scene.gold) {
            return
        }    // setter -> UIScene.setter -> update production
        this.scene.sound.play("buy")
        this.purchasedAmount = this.purchasedAmount+1
        this.scene.gold = this.scene.gold - this.priceInt
        // console.log(Math.pow(1.05,this.#purchasedAmount),this.#purchasedAmount,Math.pow(1.15,this.#purchasedAmount)*this.discount*this.basePrice);
        this.price = Math.pow(1.15,this.#purchasedAmount)*this.discount*this.basePrice
    }

}