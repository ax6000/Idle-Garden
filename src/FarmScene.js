class FarmScene extends Phaser.Scene{
    #farm;
    parentScene;
    get farm(){return this.#farm}
    set parentScene(s){this.parentScene = s}
    constructor (config,scene)
    {   
        super(config);
        this.parentScene = scene
        this.IMAGE_SCALE = 6
        this.IMAGE_SIZE = new Phaser.Math.Vector2(16,32); 
        this.CHILD_SCALE = 50
        // Node-Stem-Nodeとなる確率 -> (1-P)^2
        // Nodeが一つも出ない確率 -> (1-(1-P)^6) 
        this.LEAF_SPAWNRATE = 50      
        this.#farm = new Farm(this)
        console.log(this);
    }

    create()
    {
        // const
        let data = this.parentScene.cache.json.get("param")
        console.log(data);
        // this.#farm.addPlant(new Phaser.Math.Vector2(300,-200),0)
        this.#farm.unlockNewPlantArea()
        // animation used in PlantSlot.buttonDown
        this.anims.create({
            key:"slotPressDown",
            frames:[
                {key:"slotButtonDown_2"},
                {key:"slotButtonDown_1"}
            ],
            frameRate: 6,
            repeat: 0
        })
        this.anims.create({
            key:"slotNotPressDown",
            frames:[
                {key:"slotButtonDown_1"}
            ],
            frameRate: 6,
            repeat: 0
        })
    }
    getUIScene(){return this.parentScene.uiScene}
    unlockSpecies(species){this.#farm.unlockNewSpecies(species)}
    unlockNewPlantArea(){this.#farm.unlockNewPlantArea()}
}