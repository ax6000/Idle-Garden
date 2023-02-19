
class Controller extends Phaser.Scene{
    farmScene;
    uiScene;
    constructor(){

        super("controller")
    }
    get uiScene(){return this.uiScene}
    get farmScene(){return this.farmScene}
    preload ()
    {
        /** load a json flle in async */
        const asyncLoader = (loaderPlugin) => new Promise((resolve, reject) => {
            loaderPlugin.on('filecomplete', resolve).on('loaderror', reject);
            loaderPlugin.start();
        });

        /** 
         * load json
         * then load image files using json data
         */

        const doStuff = async () => {
            var loadImage = (game,n,name) => game.load.image(name,"assets/"+n+"/"+name+".png");
            asyncLoader(this.load.json("param","./src/parameters.json")).then(()=>{
                let data = this.cache.json.get("param")
                for(let plant in data.plants){
                    
                    loadImage(this,data.plants[plant].name,data.plants[plant].node.name)
                    for(var item in data.plants[plant].leaves){
                        loadImage(this,data.plants[plant].name,data.plants[plant].leaves[item].name)
                    }
                    for(var item in data.plants[plant].stems){
                        // console.log(data.plants[plant].stems[item])
                        loadImage(this,data.plants[plant].name,data.plants[plant].stems[item].name)
                    }
                }
            });
            
        };
        doStuff()
        // script
        this.load.script('plant', 'src/Plant.js'); 
        this.load.script('farm', 'src/Farm.js'); 
        this.load.script('scene_ui', 'src/UIScene.js'); 
        this.load.script('scene_farm', 'src/FarmScene.js'); 
        // other images   
        this.load.image("soil","assets/soil.png");
        this.load.image("soil_2","assets/soil_2.png");
        //button
        this.load.image("seedButton_1","assets/button/buttonmedium1.png")
        this.load.image("seedButton_2","assets/button/buttonmedium2.png")
        this.load.image("seedButton_3","assets/button/buttonmedium3.png")
        this.load.image("seedButtonSq_1","assets/button/buttonsq1.png")
        this.load.image("seedButtonSq_2","assets/button/buttonsq2.png")
        //item
        this.load.image("Cursor","assets/cursor.png")
        this.load.image("coin","assets/coin.png")
        this.load.image("can","assets/can/can.png")
        this.load.image("can_down","assets/can/can_down.png")
        this.load.image("Golden","assets/can/golden_can.png")
        this.load.image("Rainbow","assets/can/rainbow_can.png")
        
        this.load.image("board","assets/board2x.png")
        this.load.image("upgrade","assets/upgrade.png")
        //audio
        this.load.audio("score","assets/audio/score.mp3")
        this.load.audio("kusa","assets/audio/kusa.mp3")
        this.load.audio("buy","assets/audio/buy.mp3")

        //other json
        this.load.json("item","./src/items.json")
        //font
    
    }
    create ()
    {   
        this.add.image(0,0,"soil_2").setScale(3.5,2.5).setOrigin(0,0)
        this.farmScene = new FarmScene({key:"farmScene"},this)
        this.scene.add("scene_farm",this.farmScene,true,{key:"uiScene1"})
        this.uiScene = new UIScene({key:"uiScene1"},this)
        this.scene.add("scene_ui",this.uiScene,true,{key:"uiScene1"})
        this.uiScene.createButtonActions()
    }

    update ()
    {
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Controller,
    pixelArt: true
};
var game = new Phaser.Game(config);