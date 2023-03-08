
class PlantSlotContainer{
    #slots
    #scene
    #farm
    #growableSlotIndices
    constructor(scene,farm){
        this.#slots = []
        this.#scene = scene
        this.#farm = farm
        this.#growableSlotIndices = []
    }
    get length(){return this.#slots.length}
    unlockSlot(){
        this.#slots.push(new PlantSlot(this.#scene,this,this.#slots.length,this.#farm.bestUnlockedSpecies))
        this.#growableSlotIndices.push(this.#slots.length)
        this.addPlant(this.getPosInBorder(this.getNormalizedPos(400,300)),this.#slots.length-1)
    }
    getPosInBorder(pos){
        var borderX = this.#farm.borderX
        var borderY = this.#farm.borderY
        if (pos.x < borderX[0]) pos.x = borderX[0]+(borderX[0]-pos.x)
        if (pos.x > borderX[1]) pos.x = borderX[1]-(pos.x-borderX[1])
        if (pos.y < borderY[0]) pos.y = borderY[0]+(borderY[0]-pos.y)
        if (pos.y > borderY[1]) pos.y = borderY[1]-(pos.y-borderY[1])
        return pos
    }
    getNormalizedPos(x,y){
        var norm = (() => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()))
        return new Phaser.Math.Vector2(x+norm()*this.#scene.CHILD_SCALE,y+norm()*this.#scene.CHILD_SCALE)
    }
    addPlant(pos,i){
        if(i >= this.#slots.length){
            console.log("PlantSlots.addPlant:index out of range");
            return
        }
        // console.log("addPlant",this.#plants,pos);
        this.#slots[i].addPlant(pos)
    }
    unlockNewSpecies(species){
        console.log(species,this.#slots[0]);
        for(var i in this.#slots){
            this.#slots[i].bestUnlockedSpecies = species
        }
    }
    getPlantSlot(index){return this.#slots[index]}
    getGrowablePlantSlot(){

    }
    pauseGrowing(index){

    }
    resumeGrowing(index){

    }
}

