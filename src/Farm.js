const FARM_PADDING_X = [250,250] 
const FARM_PADDING_Y = [0,250] 
class Farm{
    #plants = []
    #plantType=[]
    #unlockedPlants;
    #scene
    #borderX =[0,800]
    #borderY =[0,600]  
    get scene(){return this.#scene}
    get plants(){return this.#plants}
    constructor(scene){
        this.#scene = scene
        this.#borderX[0] += FARM_PADDING_X[0]
        this.#borderX[1] -= FARM_PADDING_X[1]+this.#scene.IMAGE_SIZE.x*this.scene.IMAGE_SCALE
        
        this.#borderY[0] +=FARM_PADDING_Y[0]
        this.#borderY[1] -= FARM_PADDING_Y[1]+this.#scene.IMAGE_SIZE.x*this.scene.IMAGE_SCALE
        console.log("farm border initialized",this.#borderX,this.#borderY);
        this.#unlockedPlants = [false,false,false,false,false,false,false,false,false,false]
    }

    posInBorder(pos){
        if (pos.x < this.#borderX[0]) pos.x = this.#borderX[0]+(this.#borderX[0]-pos.x)
        if (pos.x > this.#borderX[1]) pos.x = this.#borderX[1]-(pos.x-this.#borderX[1])
        if (pos.y < this.#borderY[0]) pos.y = this.#borderY[0]+(this.#borderY[0]-pos.y)
        if (pos.y > this.#borderY[1]) pos.y = this.#borderY[1]-(pos.y-this.#borderY[1])
        return pos
    }
    addPlant(pos,species){
        pos = this.posInBorder(pos)
        // console.log("addPlant",this.#plants,pos);
        this.#plants.push(new Plant(pos,this.#scene,species,this,this.plants.length))
    }
    removePlant(index){
        this.#plants.splice(index,1)
    }
    grow(){
        var random = Phaser.Math.Between(0,this.plants.length-1)
        this.#plants[random].grow()
    }
    unlockNewPlantArea(){
        var newPos = Phaser.Math.RandomXY(new Phaser.Math.Vector2(400,300)).add(new Phaser.Math.Vector2(400,300))
        this.addPlant(this.posInBorder(newPos),this.getBestUnlockedSpecies())
    }
    getBestUnlockedSpecies(){
        for(var i = this.#unlockedPlants.length; i>=0;i--){
            if(this.#unlockedPlants[i]) return i
        }
        console.log("getBestSpecies not found");
        return null
    }
    unlockNewSpecies(species){
        this.#unlockedPlants[species] = true
    }

}