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
function loadImage(game,n,name){
    game.load.image(name,"assets/"+n+"/"+name+".png")
}

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
    this.load.script('plant', 'src/Plant.js');    
    this.load.image("soil","assets/soil.png");
    this.load.image("soil_2","assets/soil_2.png");
    this.load.image("soil_3","assets/mushroom_soil.png");
    this.load.image("number","assets/number.png");
}
function addObject(scene){
    scene.add.image(0,0,"0_r_1").setScale(1,1).setOrigin(0,0)
}
function test(){
    return [400,300]
}
function create ()
{   
    let data = this.cache.json.get("param")
    console.log(data)
    this.add.image(0,0,"soil_2").setScale(2.5,2.5).setOrigin(0,0)
    this.add.image(0,0,"0_r_1").setScale(3,3).setOrigin(0,0)
    // this.add.image(test(),"0_node").setOrigin(0,0).setScale(3,3)
    // console.log(new Phaser.Math.Vector2(0,0));
    var plant1 = new Plant(new Phaser.Math.Vector2(400,300),this,0)
    plant1.createRoot()
}

function update ()
{
}