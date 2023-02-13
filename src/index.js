var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    for (var i = 1; i< 27; i++){
        // node
        this.load.image(i+"_node","assets/"+i+"/"+i+"_node.png");
        // left stems
        for (var j = 1;  j < 10; j++){
            this.load.image(i+"_l_"+j,"assets/"+i+"/"+i+"_l_"+j+".png");
        } 
        //right stems
        for (j = 1;  j < 10; j++){
            this.load.image(i+"_r_"+j,"assets/"+i+"/"+i+"_r_"+j+".png");
        } 
        // left leaves
        for (j = 1;  j < 10; j++){
            this.load.image(i+"_le_r_"+j,"assets/"+i+"/"+i+"_le_l_"+j+".png");
        } 
        //right leaves
        for (j = 1;  j < 10; j++){
            this.load.image(i+"_le_r_"+j,"assets/"+i+"/"+i+"_le_r_"+j+".png");
        } 
        
    }
    this.load.image("soil","assets/soil.png");
    this.load.image("soil_2","assets/soil_2.png");
}

function create ()
{
    this.add.image(400, 300, 'soil');
}

function update ()
{
}