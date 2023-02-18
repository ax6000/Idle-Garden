class UIScene extends Phaser.Scene{
    button;
    constructor ()
    {
        super();
    }

    create(){
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
        this.button = this.add.sprite(100,100,"lock_1").setOrigin(0,0).setInteractive()
        this.button.on("pointerdown",function(pointer){
            this.button.play("press")
        },this)
        this.button.on("pointerup",function(pointer){
            this.button.play("notpress")
        },this)

        
    }
    get button(){return this.button}
}