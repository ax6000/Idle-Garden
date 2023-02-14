var config = {
    parent: divId,
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        // Or set parent divId here
        parent: divId,

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: 400,
            height: 300
        },
        // Or set minimum size like these
        // minWidth: 800,
        // minHeight: 600,

        // Maximum size
        max: {
            width: 1600,
            height: 1200
        },
        // Or set maximum size like these
        // maxWidth: 1600,
        // maxHeight: 1200,

        zoom: 2,  // Size of game canvas = game size * zoom
    }
};


var game = new Phaser.Game(config);

function loadImage(game,n,name){
    game.load.image(name,"assets/"+n+"/"+name+".png")
}

function preload ()
{
    fetch("./src/parameters.json")
    .then(response => response.json())
    .then( data => {
        // console.log(data.plants)
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
    })
    this.load.image("soil","assets/soil.png");
    this.load.image("soil_2","assets/soil_2.png");
    this.load.image("soil_3","assets/mushroom_soil.png");
    this.load.image("number","assets/number.png");
}

function create ()
{
    // this.add.image(400, 200, 'soil_3');
    this.add.image(10,10,"1_r_1").setScale(2,2)
}

function update ()
{
}