class FarmScene extends Phaser.Scene{
    #farm;
    parentScene;
    get farm(){return this.#farm}
    set parentScene(s){this.parentScene = s}
    constructor (config,scene)
    {   
        super(config);
        this.parentScene = scene
        this.IMAGE_SCALE = 2
        this.IMAGE_SIZE = new Phaser.Math.Vector2(16*this.IMAGE_SCALE,32*this.IMAGE_SCALE); 
        this.CHILD_SCALE = 50
        this.LEAF_SPAWNRATE = 30      
        this.#farm = new Farm(this)
        console.log(this);
    }

    create()
    {
        // const
        let data = this.parentScene.cache.json.get("param")
        console.log(data);
        this.#farm.addPlant(new Phaser.Math.Vector2(300,-200),0)
    }
    getUIScene(){return this.parentScene.uiScene}
}