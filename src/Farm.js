const FARM_PADDING_X = [250,250] 
const FARM_PADDING_Y = [0,250] 
class Farm{
    #plants = []
    #plantSlotContainer
    #bestUnlockedSpecies;
    #scene
    #borderX =[0,800]
    #borderY =[0,600]  
    get scene(){return this.#scene}
    get plants(){return this.#plants}
    get borderX(){return this.#borderX}
    get borderY(){return this.#borderY}
    get plantSlotContainer(){return this.#plantSlotContainer}
    get bestUnlockedSpecies(){return this.#bestUnlockedSpecies}
    constructor(scene){
        this.#scene = scene
        this.#borderX[0] += FARM_PADDING_X[0]
        this.#borderX[1] -= FARM_PADDING_X[1]+this.#scene.IMAGE_SIZE.x*this.scene.IMAGE_SCALE
        
        this.#borderY[0] +=FARM_PADDING_Y[0]
        this.#borderY[1] -= FARM_PADDING_Y[1]+this.#scene.IMAGE_SIZE.y*this.scene.IMAGE_SCALE
        console.log("farm border initialized",this.#borderX,this.#borderY);
        this.#bestUnlockedSpecies = 0
        this.#plantSlotContainer = new PlantSlotContainer(this.#scene,this)
    }
    grow(){
        var random = Phaser.Math.Between(0,this.plantSlotContainer.length-1)
        this.#plantSlotContainer.getPlantSlot(random).grow()
    }
    unlockNewPlantArea(){
        this.#plantSlotContainer.unlockSlot()
        
    }

    unlockNewSpecies(species){
        this.#bestUnlockedSpecies = species
        this.#plantSlotContainer.unlockNewSpecies(species)
    }
    // getPlantSlotContainer(){
    //     return this.#plantSlotContainer.getPlantSlot(i)
    // }

}