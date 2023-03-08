const SLOTS_POS_X = 12
const SLOTS_POS_Y = 450
const SLOT_IMG_XY = 30
const SLOT_ICON_OFFSET_XY = 8 
class PlantSlot{
    #parentSlotContainer; 
    #scene;
    #index;
    #selectedSpecies
    #plant
    #isGrowable
    #buttonPause
    #buttonResume
    #buttonDown
    #autoHarvest
    #pathFromButton; 
    #slotImg
    #iconImgs = []
    #bestUnlockedSpecies;
    set bestUnlockedSpecies(i){this.#bestUnlockedSpecies = i}
    constructor(scene,parentSlotContainer,index,species){
        this.#scene = scene 
        this.#parentSlotContainer = parentSlotContainer
        this.#index = index
        this.#selectedSpecies = species
        this.#bestUnlockedSpecies = species
        this.#slotImg = scene.add.image(SLOTS_POS_X+SLOT_IMG_XY*index,SLOTS_POS_Y,"plantSlot")
                                 .setOrigin(0,0)
                                 .setInteractive()
                                 .on("pointerdown",function(pointer){
                                    this.scrollSelectedSpecies()
                                 },this)
        for(var i = 0; i < CURRENT_PLANT_SPECIES;i++){
            this.#iconImgs.push(scene.add.image(SLOTS_POS_X+SLOT_IMG_XY*index+SLOT_ICON_OFFSET_XY,SLOTS_POS_Y+SLOT_ICON_OFFSET_XY,"plantIcon_"+i)
                                         .setOrigin(0,0)
                                         .setVisible(false))
        }   
        this.#iconImgs[this.#selectedSpecies].setVisible(true)
        this.#isGrowable = true
        this.#autoHarvest = true
        this.#buttonDown = scene.add.sprite(SLOTS_POS_X+SLOT_IMG_XY*index,SLOTS_POS_Y+SLOT_IMG_XY,"slotButtonDown_1")
                                    .setOrigin(0,0)
                                    .setInteractive()
                                    .on("pointerdown",function(pointer){
                                        this.#buttonDown.play("slotPressDown");
                                        this.scrollSelectedSpecies()
                                    },this)
                                    .on("pointerup",function(pointer){
                                        this.#buttonDown.play("slotNotPressDown")
                                    },this)
    }
    
    addPlant(pos){
        pos = this.#parentSlotContainer.getPosInBorder(pos)
        this.#plant = new Plant(pos,this.#scene,this.#selectedSpecies,this)
    }
    addPlantChild(x,y){
        this.addPlant(this.#parentSlotContainer.getNormalizedPos(x,y))
    }
    removePlant(){
        this.#plant = null
    }
    onFullyGrown(){
        this.#isGrowable = false
        if (this.#autoHarvest) this.#plant.harvest()
    }
    pause(){
        this.#isGrowable = false
    }
    resume(){
        this.#isGrowable = true
    }
    grow(){
        this.#plant.grow()
    }
    scrollSelectedSpecies(){
        var currentSpecies = this.#selectedSpecies
        var nextSpecies = (this.#selectedSpecies + 1) % (this.#bestUnlockedSpecies+1)
        this.#iconImgs[currentSpecies].setVisible(false)
        this.#iconImgs[nextSpecies].setVisible(true)
        this.#selectedSpecies = nextSpecies
    }


}