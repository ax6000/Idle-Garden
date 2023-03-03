/** 
 * enum
 * classの種類
 * 
 */
const PlantElementType = {
    Node:1,
    Stem:2,
    Leaf:3
};

class PlantElement{
    #position;
    #img;
    #from;
    #parent;
    #elementInfo;
    #socketOffsets = [];
    #growableSides = [];
    #name;
    #type;
    get elementInfo(){return this.#elementInfo}
    get from(){return this.#from}
    get position(){return this.#position}
    get growableSides(){return this.#growableSides}
    get socketOffsets(){return this.#socketOffsets}
    get img(){return this.#img}
    get type(){return this.#type}
    get parent(){return this.#parent}
    get name(){return this.#name}

    /**
     * 初期化と画像の表示
     * jsonData:dict
     * @param {Phaser.Math.Vector2} position 
     * @param {Plant} parent 
     * 
     * @param {PlantElement} from  
     */
    constructor(position,parent,elementJsonData,from = null){
        this.#parent = parent;
        this.#position = position;
        if (this.constructor.name == "Node"){
            this.#type = PlantElementType.Node
        }else if(this.constructor.name == "Stem"){
            this.#type = PlantElementType.Stem
        }else if(this.constructor.name == "Leaf"){
            this.#type = PlantElementType.Leaf
        }else{
            this.#type = null
        }
        this.#elementInfo = elementJsonData
        var tmpPos = this.fixPrintPos(this.#position)
        this.#name = this.elementInfo.name
        this.#img = this.#parent.scene.add.image(tmpPos.x,tmpPos.y,this.name).setOrigin(0, 0).setScale(this.parent.scene.IMAGE_SCALE,this.parent.scene.IMAGE_SCALE);
        this.#from = from
        this.#socketOffsets = this.elementInfo.socketOffsets;
        for (var i = 0; i< this.#socketOffsets.length;i++) this.#growableSides.push(i) 
        // console.log(position,parent,elementJsonData,from,this,tmpPos,this.elementInfo,this.elementInfo.alignedLeft,this.elementInfo["alignedLeft"]);
    }

    /**
     * 左下or右下に詰められている画像の座標を調整して親のオブジェクトと見た目が接続するように  
     * constructorで呼び出し
     * @param {Phaser.Math.Vector2} origin 画像の座標(this.#position)
     * @returns {Phaser.Math.Vector2} 修正後の座標尾
     */
    fixPrintPos(origin){
        var pos = new Phaser.Math.Vector2(0,0)
        //画像左上の座標->左下の座標をとる
        // pos.y -= this.scene.IMAGE_SIZE.y;
        // 右下詰めなので、 左下->右下の座標をとる   
        // 左下詰めの画像はそのまま
        if (!this.#elementInfo.alignedLeft) pos.x -= (this.parent.scene.IMAGE_SIZE.x-1)*this.parent.scene.IMAGE_SCALE;
        // 画像内で先端が角以外にある場合は調整
        pos.x += this.#elementInfo.offset.x*this.parent.scene.IMAGE_SCALE
        pos.y += this.#elementInfo.offset.y*this.parent.scene.IMAGE_SCALE
        return pos.add(origin)
    }
}

class Node extends PlantElement{
    #edges = [];
    #leaves = []

    constructor(position,parent,elementJsonData,from){
            super(position,parent,elementJsonData,from);
            parent.num = PlantElementType.Node
            }
    pushEdges(edge){
        this.#edges.push(edge);
    }
    pushLeaves(leaf){
        this.#leaves.push(leaf);
    }   
    get edges(){return this.#edges}
    get leaves(){return this.#leaves}

}

class Stem extends PlantElement{
    #nodeTo;
    constructor(position,parent,elementJsonData,from){
        super(position,parent,elementJsonData,from);
        this.#nodeTo = null
        parent.num = PlantElementType.Stem
    }
    get nodeTo(){ return this.#nodeTo};
    set nodeTo(node){this.#nodeTo = node}
    // set nodeTo(node){this.#NodeTo=node;}
}

class Leaf extends PlantElement{
    constructor(position,parent,elementJsonData,from){
        super(position,parent,elementJsonData,from);
        parent.num = PlantElementType.Leaf
    }
}