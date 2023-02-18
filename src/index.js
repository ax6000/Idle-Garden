

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true
};


var game = new Phaser.Game(config);

function preload ()
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
    // this.load.script('ui', 'src/UIScene.js'); 
    // other images   
    this.load.image("soil","assets/soil.png");
    this.load.image("soil_2","assets/soil_2.png");
    this.load.image("soil_3","assets/mushroom_soil.png");
    this.load.image("number","assets/number.png");
    //button
    this.load.image("lock_1","assets/button/lock1.png")
    this.load.image("lock_2","assets/button/lock2.png")
    this.load.image("lock_3","assets/button/lock3.png")
    this.load.image("lock_4","assets/button/lock4.png")
    this.load.image("press_1","assets/button/press1.png")
    this.load.image("press_2","assets/button/press2.png")
    this.load.image("press_3","assets/button/press3.png")
    this.load.image("press_4","assets/button/press4.png")
}
function addObject(scene){
    scene.add.image(0,0,"0_r_1").setScale(1,1).setOrigin(0,0)
}
function test(){
    for(var i = 0; i < 20; i++){
        console.log(Phaser.Math.Between(0,2))
    }
    return [400,300]
}
function create ()
{   
    // test()        
    this.add.image(0,0,"soil_2").setScale(2.5,2.5).setOrigin(0,0)
    this.anims.create({
        key:"press",
        frames:[
            {key:"press_1"},
            {key:"press_2"},
            {key:"press_3"}
        ],
        frameRate: 6,
        repeat: 0
    })
    this.anims.create({
        key:"notpress",
        frames:[
            {key:"press_3"},
            {key:"press_4"}
        ],
        frameRate: 6,
        repeat: 0
    })
    const button = this.add.sprite(70,100,"lock_1").setOrigin(0,0).setInteractive()
    console.log(button);

    let data = this.cache.json.get("param")
    console.log(data)

    this.add.image(0,0,"0_r_1").setScale(3,3).setOrigin(0,0)
    // this.add.image(test(),"0_node").setOrigin(0,0).setScale(3,3)
    // console.log(new Phaser.Math.Vector2(0,0));
    var plant1 = new Plant(new Phaser.Math.Vector2(400,300),this,0)
    // const button = new Button(40, 20, 'Grow', this, ((plant) => (plant.grow()))(plant1));
    plant1.createRoot()
    button.on("pointerdown",function(pointer){
        button.play("press")
        plant1.grow()
    },this)
    button.on("pointerup",function(pointer){
        button.play("notpress")
    },this)
}

function update ()
{
}