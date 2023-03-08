const BOARD_PADDING_X = 12
const BOARD_PADDING_Y = 17
const UPGRADE_SIZE_XY = 32 
const N_UPDATING_UPGRADES = 5
class UpgradeBoard{
    board;
    scene;
    // visibleUpgrades = []   
    // unlockedUpgrades = []
    upgrades = [];
    jsonData;
    constructor(scene,jsonData){
        this.scene = scene
        this.jsonData = jsonData
        this.board = this.scene.add.image(ITEMBUTTON_X,0,"board").setOrigin(0,0)
        this.purchaseUpgrade(this.jsonData[0])
        this.updateUpgradesIndex() 
        this.updateUpgradesVisibility()
    }
    getUpgradeInfo(index){
        return info
    }
    generateUpgrade(index){
        console.log("generateupgrade:",index);
        console.log(this,this.jsonData,this.jsonData[index],index);
        console.log(this.jsonData[index].name);
        var newUpgrade = this.scene.add.sprite(800,BOARD_PADDING_Y,this.jsonData[index].name)
                                        .setOrigin(0,0)
                                        .setVisible(false)
                                        .setInteractive()
        newUpgrade.setData("board",this)
        newUpgrade.setData("index",this.upgrades.length)
        newUpgrade.setData("jsonData",this.jsonData[index])
        newUpgrade.setData("price",newUpgrade.getData("jsonData").price)
        newUpgrade.on("pointerdown",function(pointer){
            this.scene.sound.play("buy")
            console.log("pointerdown called",this);
            var board = this.getData("board")
            var jsonData = this.getData("jsonData")
            console.log(jsonData.price <= this.scene.gold,jsonData.price,this.scene.gold);
            if (jsonData.price <= this.scene.gold){
                board.upgrades.splice(this.getData("index"),1)
                board.purchaseUpgrade(jsonData)
                board.updateUpgradesIndex() 
                board.updateUpgradesVisibility()
                // this.updateUpgradeVisibility()
                this.destroy()
            }
        },newUpgrade)
        this.insertUpgrades(newUpgrade)
    }
    purchaseUpgrade(jsonData){
        console.log(this.upgrades);
        if(jsonData.price > this.scene.gold) return 1
        this.scene.purchaseUpgrade(jsonData.funcName,jsonData.price,jsonData.args)
        for(var i in jsonData.unlockUpgradeIndices){
            this.generateUpgrade(jsonData.unlockUpgradeIndices[i])
        }
        
        return 0
    }

    insertUpgrades(upgrade){
        console.log("insertUpgrades",this.upgrades.length);
        if (this.upgrades.length==0){
            this.upgrades.push(upgrade)
            return 0
        }else if(this.upgrades.length==1){
            console.log(this.upgrades[0].getData("price") < upgrade.getData("price"),this.upgrades[0].getData("price") , upgrade.getData("price"));
            if(this.upgrades[0].getData("price") < upgrade.getData("price")){
                this.upgrades.push(upgrade)
                return 1
            }else{
                this.upgrades.splice(0,0,upgrade)
                return 0
            }
        }
        // this.upgrades.length >= 2
        if(this.upgrades[-1].getData("price") < upgrade.getData("price")){
            this.upgrades.push(upgrade)
            return this.upgrades.length-1
        }
        //   i=1
        //[0][1][2] 3(length)
        // 1  4  9
        //     ^
        //     5
        for(var i = this.upgrades.length-2; i>=0;i--){
            if(this.upgrades[i].getData("price") < upgrade.getData("price")){
                this.upgrades.splice(i+1,0,upgrade)
                return i+1 
            }
        }
    }
    updateUpgradesIndex(){
        for (var i in this.upgrades){
            console.log(i,this.upgrades[i]);
            this.upgrades[i].setData("index",i)
        }
    }
    updateUpgradesVisibility(){
        var upgrade;
        var alpha;
        for(var i in this.upgrades){
            if (i >= N_UPDATING_UPGRADES) return
            upgrade = this.upgrades[i]
            if(i < N_UPDATING_UPGRADES){
                this.activate(upgrade,i)
                alpha = upgrade.getData("jsonData").price > this.scene.gold ? 0.5 : 1
                upgrade.setAlpha(alpha)
            }else{
                this.deactivate(upgrade)
            }
        
        }
    }
    updateUpgradesAlpha(gold = 0){
        var upgrade;
        for(var i in this.upgrades){
            if (i >= N_UPDATING_UPGRADES) return
            upgrade = this.upgrades[i]
            // console.log(upgrade.getData("jsonData"));
            if(upgrade.getData("jsonData").price > gold){
                upgrade.setAlpha(0.5)
            }else{
                upgrade.setAlpha(1)
            }
        }
    }
    activate(upgrade,index){
        upgrade.setX(ITEMBUTTON_X+BOARD_PADDING_X+index*UPGRADE_SIZE_XY+2)
        upgrade.setVisible(true)
    }

    deactivate(upgrade){
        upgrade.setX(800)
        upgrade.setVisible(false)
    }
}

