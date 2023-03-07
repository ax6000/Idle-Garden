
class ItemButton{
    sprites;
    texts;
    scene;
    index;
    basePrice;
    #price;
    priceInt
    jsonData;
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
        this.texts["price"].setText(this.priceInt.toLocaleString())
    }
    set purchasedAmount(n){
        this.#purchasedAmount = n
        this.texts["amount"].setText(n.toLocaleString())
    }
    
    constructor(scene,i,data){
        this.sprites = {}
        this.texts = {}
        this.scene =scene
        this.index = i
        this.sprites["button"] = this.scene.add.sprite(ITEMBUTTON_X,ITEMBUTTON_Y+ITEMBUTTONHEIGHT*i,"seedButton_1")
                                    .setOrigin(0,0)
                                    .setScale(ITEMBUTTON_SCALE_X,ITEMBUTTON_SCALE_Y)
                                    .setInteractive()
        this.sprites["button"].name = "button"
        this.jsonData = data
        this.texts["price"] = this.scene.add.text(ITEMBUTTON_X+56,37+ITEMBUTTON_Y+ITEMBUTTONHEIGHT*i, 0, { fontFamily:"font1",fontSize: '18px', fill: COLORCODE["red"] })
                                      .setOrigin(0,0)
                                      .setInteractive()
                                      .setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0)
        this.basePrice = data.price
        this.price = this.basePrice
        this.sprites["itemIcon"] = this.scene.add.sprite(ITEMBUTTON_X+10,20+ITEMBUTTON_Y+ITEMBUTTONHEIGHT*i,data.name)
                                  .setOrigin(0,0)
                                  .setScale(data.scaleX,data.scaleY)
                                  .setInteractive()
        this.texts["itemName"] = this.scene.add.text(ITEMBUTTON_X+42,8+ITEMBUTTON_Y+ITEMBUTTONHEIGHT*i, data.name, { fontFamily:"font1",fontSize: '28px', fill: COLORCODE["white"]})
                                 .setOrigin(0,0)
                                 .setInteractive()
                                 .setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0)
        this.sprites["coin"] = this.scene.add.sprite(ITEMBUTTON_X+37,41+ITEMBUTTON_Y+ITEMBUTTONHEIGHT*i,"coin").setOrigin(0,0).setScale(ITEMBUTTON_SCALE_X,ITEMBUTTON_SCALE_Y)
                                  .setInteractive()
        this.texts["amount"] = this.scene.add.text(ITEMBUTTON_X+186,37+ITEMBUTTON_Y+ITEMBUTTONHEIGHT*i, '0', { fontFamily:"font1",fontSize: '18px', fill: COLORCODE["gray"] })
                                       .setOrigin(1,0)
                                       .setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0)
                                       .setInteractive()
        this.buttonItems = this.scene.add.group()
        this.buttonItems.addMultiple([
            this.sprites["itemIcon"],
            this.sprites["coin"],
            this.sprites["button"],
            this.texts["itemName"],
            this.texts["amount"],
            this.texts["price"]
        ])
        this.discount =1
        Phaser.Actions.Call(this.buttonItems.getChildren(),function(item){
            item.setData("parent",this)
            item.on("pointerdown",function(pointer){
            this.getData("parent").purchase()
        })},this)
        this.buttonTweenEnd = 0
       
    }
    setPriceTextColor(color){
        this.texts["price"].setFill(color)
    }
    purchase(){
        if (this.priceInt > this.scene.gold) {
            return
        }    // setter -> UIScene.setter -> update production
        this.scene.sound.play("buy")
        this.purchasedAmount = this.purchasedAmount+1
        this.scene.purchaseItem(this.index,this.priceInt)
        // this.scene.gold = this.scene.gold - this.priceInt
        this.price = Math.pow(1.15,this.purchasedAmount)*this.discount*this.basePrice
    }

}