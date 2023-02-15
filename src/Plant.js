// 分割した画像ファイルの大きさ
const IMAGE_SIZE = new Phaser.Math.Vector2(32,64);
// 画像ファイルから画面に表示するために拡大する倍率
const IMAGE_SCALE = 3
/**
 * index.jsで生成される  
 * #rootから木構造で葉や茎のオブジェクトに分割された植物を管理
 */
class Plant{
    #position;

    #root;
    /** parent scene of this class */
    #scene;
    /** type of plant images locted in assets/{#species}" */
    #species;
    #jsonData;
    #nLeaves;

    #nStems;
    /**
     * constructor
     * @param {Phaser.Math.Vector2} position 
     * @param {Phaser.Scene} scene 
     * @param {String} species 
     */
    constructor(position,scene,species){
        // this.x = x;
        // this.y = y;
        console.log(position);
        this.#position = position;
        this.#scene = scene;
        this.#species = species
        // parameter -> index.js:45
        this.#jsonData = this.#scene.cache.json.get("param")        

        this.#nLeaves = Object.keys(this.#jsonData.plants[this.#species].leaves).length
        this.#nStems= Object.keys(this.#jsonData.plants[this.#species].stems).length
    }
    /**
     * create new Node object
     */
    createRoot(){
        console.log(this.#position);
        this.#root = new Node(this.#position,this,this.#species+"_node") 
    }
    set root(node){this.#root = node;}
    get scene(){ return this.#scene;}
    get species(){return this.#species}
    get jsonData(){return this.#jsonData}
    
    

}
/**
 * struct  
 * parameters.jsonから取り出した画像ごとの定数を管理  
 * 各画像オブジェクトごとに存在
 */
function makePlantElementInfo(){
    return {
    /** 
     * 茎や葉の先端が画像の角にある場合: 0  
     * 茎や葉の先端が画像の角にない場合:Nodeに隣接するようにずれを調整  
     * pos.x + offsetX = (画像左上の座標)  
     * @type {Number}
     */
    offsetX : null,
    /** 
     * pos.y + offsetY = (画像左上の座標)
     *  Nodeに隣接するようにずれを調整
     */
    offsetY : null,
    /** pos.x + offsetX + width + endX = (茎の終点の座標) */
    endX: null,
    /** pos.y + offsetY + height + endY = (茎の終点の座標) */
    endY: null,
    /** 
     * 葉、茎が左向きに接続するか（連結する始点が左側にあるか）
     * @type {Boolean} 
     * */
    isLeft: null,
    /** 画像内の要素部分の幅（画像自体は一律32x64） */
    width : null,
    /** 画像内の要素部分の高さ（画像自体は一律32x64） */
    height: null
    }
}
/** 
 * enum
 * classの種類
 * PlantElement.loadPlantElementInfo()で使用
 */
var PlantComponentType = {
    Node:1,
    Stem:2,
    Leaf:3
};
/**
 * Node のときのみ使う PlantNodeInfo
 */
function makePlantNodeInfo (){
    var dict =  makePlantElementInfo()
    /**
     * Nodeに隣接していて、葉や茎が接続可能なピクセルの座標
     * pos + offset = (該当ピクセルの座標)
     * @type {Array<Phaser.Math.Vector2>}
     */
    dict.socketOffsets = [];
    return dict;
}



class PlantElement{
#position;
#img;
#parent;
#plantInfo;

/**
 * 初期化と画像の表示
 * @param {Phaser.Math.Vector2} position 
 * @param {Plant} parent 
 * @param {String} img filename of plant image  
 */
constructor(position,parent,img,n = 0){
    this.#parent = parent;
    this.#position = position;
    // console.log(this.#parent);
    // console.log(this.#parent.scene);
    var type;
    if (this.constructor.name == "Node"){
        type = PlantComponentType.Node
    }else if(this.constructor.name == "Stem"){
        type = PlantComponentType.Stem
    }else if(this.constructor.name == "Leaf"){
        type = PlantComponentType.Leaf
    }else{
        type = null
    }
    this.#plantInfo = this.loadPlantElementInfo(type,n)
    console.log(this.fixPrintPos(this.#position));
    var tmpPos = this.fixPrintPos(this.#position)
    // console.log(img,IMAGE_SCALE,tmpx,tmpy)
    this.#img = this.#parent.scene.add.image(tmpPos.x,tmpPos.y,img).setOrigin(0, 0).setScale(IMAGE_SCALE,IMAGE_SCALE);
}

/**
 * 左下or右下に詰められている画像の座標を調整して親のオブジェクトと見た目が接続するように  
 * constructorで呼び出し
 * @param {Phaser.Math.Vector2} origin 画像の座標(this.#position)
 * @returns {Phaser.Math.Vector2} 修正後の座標尾
 */
fixPrintPos(origin){
    var pos = new Phaser.Math.Vector2(0,0)
    // console.log(pos);
    //画像左上の座標->左下の座標をとる
    pos.x -= IMAGE_SIZE.y;
    // console.log(pos);
    // 右下詰めなので、 左下->右下の座標をとる   
    // 左下詰めの画像はそのまま
    if (!this.#plantInfo.isLeft){
        pos.y -= IMAGE_SIZE.y;
    }
    // console.log(pos);
    // 画像内で先端が角以外にある場合は調整
    pos.x += this.#plantInfo.offsetX
    pos.y += this.#plantInfo.offsetY
    // console.log(pos.scale(IMAGE_SCALE).add(origin));
    return pos.scale(IMAGE_SCALE).add(origin)
}
/**
 * 
 * @param {PlantComponentType} type 要素の種類(頂点、茎、葉)
 * @param {Number} n json内のindex(Nodeは無い)
 * @returns {PlantElementInfo}
 */
loadPlantElementInfo(type,n = 0){
    var species = this.#parent.species;
    var jsonData = this.#parent.jsonData
    // console.log(species);
    // console.log(jsonData.plants);
    // Nodeだけ継承クラスを使用
    var info, data
    if (type == PlantComponentType.Node){
        info = makePlantNodeInfo();
        data = jsonData.plants[species].node
    }else if(type==PlantComponentType.Stem){
        info = makePlantElementInfo();
        data = jsonData.plants[species].stems[n]
    }else if(type == PlantComponentType.Leaf){
        info = makePlantElementInfo();
        data = jsonData.plants[species].leaves[n]
    }
    info.offsetX = data.offset.x
    info.offsetY = data.offset.y
    info.endX = data.offset.endx
    info.endY = data.offset.endy
    info.height = data.size.height
    info.width =  data.size.width
    info.isLeft =  data.isLeft
    if (type == PlantComponentType.Node){
        for(var item in data.socketOffsets){
            info.socketOffsets.push(new Phaser.Math.Vector2(data.socketOffsets[item].x,data.socketOffsets[item].y))
            // console.log( Phaser.Math.Vector2(data.socketOffsets[item].x,data.socketOffsets[item].y));
        }
        // console.log(info.socketOffsets);
    }
    return info
}
get plantInfo(){return this.#plantInfo}
}

class Node extends PlantElement{
    #position;
    #img;
    #parent;
    #edges = [];
    #socketOffsets = [];
    constructor(position,parent,img){
            super(position,parent,img);
            this.#socketOffsets = super.plantInfo.socketOffsets; 
    }
    addEdge(edge){
        this.#edges.add(edge);
    }    
}

class Stem extends PlantElement{
    #position;
    #parent;
    #plantInfo;
    #nodeFrom;
    #nodeTo;
    #img;
    constructor(position,parent,img,from,n){
        super(position,parent,img,n);
        this.#nodeFrom = from;
    }
    get nodeFrom(){ return this.#nodeFrom};
    get nodeTo(){ return this.#nodeTo};
    // set nodeTo(node){this.#NodeTo=node;}
}

class Leaf extends PlantElement{
    #position;
    #parent;
    #plantInfo;
    #nodeFrom;
    #img;
    constructor(position,parent,img,from,n){
        super(position,parent,img,n);
        this.#nodeFrom = from;
    }
    get nodeFrom(){ return this.#nodeFrom};
}