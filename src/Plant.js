
// 分割した画像ファイルの大きさ
// const this.scene.IMAGE_SIZE = new Phaser.Math.Vector2(32,64);
// 画像ファイルから画面に表示するために拡大する倍率
// const this.scene.IMAGE_SCALEIMAGE_SCALE = 3
// const CHILD_SCALE = 50
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
    /** */
    #jsonData;
    // #nLeftLeaves;
    // #nRightLeaves;
    // #nLeftStems;
    // #nRightStems
    /** number of components(node,stem) which can connect more components*/
    #growFlg;
    /** raw value of this plant before applying multiplier*/
    #valueRaw;
    #value;
    #valueParam = [];
    #valueTxt = null
    /** 
     * number of components [sum,Node,Stem,Leaf]
     *  added on components' construtor 
    */
   #num;
   #numChild;
   #farm
   #farmIdx
    set root(node){this.#root = node;}
    get scene(){ return this.#scene;}
    get species(){return this.#species}
    get jsonData(){return this.#jsonData}
    get growFlg(){return this.#growFlg}
    set growFlg(bool){this.#growFlg = bool}
    get root(){return this.#root}
    get value(){return this.#value}
    get valueRaw(){return this.#valueRaw}
    get valueParam(){return this.#valueParam}
    get num(){return this.#num}
    set num(n){
        this.num[0]++;
        this.num[n]++;
        this.calcValue(n)
    }
    get numChild(){return this.#numChild}
    // farm class
    get farm (){return this.#farm}
    // gold
    get valueTxt(){return this.#valueTxt}
    set valueTxt(n){
        this.#valueTxt.setText(parseInt(n))
    }
    set valueRaw(n){this.#valueRaw = n}
    set value(n){this.#value = n}
    
    /**
     * constructor
     * @param {Phaser.Math.Vector2} position 
     * @param {Phaser.Scene} scene 
     * @param {String} species 
     */
    constructor(position,scene,species,farm,farmIdx){
        // this.x = x;
        // this.y = y;

        this.#position = position;
        this.#scene = scene;
        this.#species = species
        this.#farm = farm
        // parameter -> index.js:45
        this.#jsonData = this.#scene.cache.json.get("param").plants[this.#species]
        this.#growFlg = false
        this.#num = [0,0,0,0]
        // console.log(this.jsonData);
        
        for(var key in this.#jsonData.value) {
            // console.log(key);
            this.valueParam.push(this.#jsonData.value[key]);
        }
        this.#valueRaw = 0
        this.#value = 0
        this.#valueTxt = this.scene.add.text(this.#position.x+3, this.#position.y+60*this.#scene.IMAGE_SCALE+30, 0, { fontFamily:"font1",fontSize: '24px', fill: '#000'}).setOrigin(0.5);
        this.#numChild = 1
        this.#farmIdx = farmIdx
        this.createRoot()
    }
    /**
     * calculate valueRaw and value
     * @param {PlantComponentType} n   
     */
    calcValue(n){
        this.#valueRaw = this.valueRaw+this.#valueParam[n]
        this.#value = this.#valueRaw*(1+this.#valueParam[0]*this.#num[0])
        this.valueTxt = this.#value
    }
    /**
     * create new Node object
     */
    createRoot(){
        this.#root = new Node(this.#position,this,this.#species+"_node")
    }

    dfs_grow(node){
        if (this.growFlg) return;
        // node 
        if (node.growableSides.length != 0 && Phaser.Math.FloatBetween(0,1) < 0.5){
            
            this.createComponent(node)
            this.#growFlg = true;
        }
        // edge
        var edge;
        if(node.type == PlantComponentType.Leaf) return
        for (var i in getRandomizedRange(node.edges.length)){
            edge = node.edges[i]
            if(this.growFlg || this.c) return;
            // if edge is not connected to a node
            if (edge.nodeTo == null){
                // try to spawn node
                if (Phaser.Math.FloatBetween(0,1) > 0.5) continue;
                this.createComponent(edge)
                this.growFlg = true
                return   
            }
             this.dfs_grow(edge.nodeTo)
        }
    }
    grow(){
        for(var i = 0; i < 10; i++){
            if(this.growFlg) break
            this.dfs_grow(this.#root)
            if(i == 9 && !this.#growFlg){
                // console.log("can't grow anymore",this.#root)
                this.harvest()
            }
        } 
        this.growFlg = false
    }
    harvest(dropSeeds=true){
        this.scene.sound.play("kusa");
        this.#valueTxt.setText("+"+this.#valueTxt.text)
        this.scene.tweens.add({
            targets: this.#valueTxt,
            duration: 500,
            props:{
                alpha:0,
                y:"-=50",
            },                
            yoyo:false,
            repeat:0,
            onComplete:()=> {
                this.#valueTxt.destroy()
                this.scene.sound.play("score");},
        })
        this.scene.getUIScene().addGold(parseInt(this.value))
        this.value = 0
        this.harvestNode(this.#root)
        var norm = (() => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()))
        for(var i = 0; i < this.#numChild;i++){
            this.#farm.removePlant(this.#farmIdx)
            if (dropSeeds){
                var childPos = new Phaser.Math.Vector2(this.#position.x+norm()*this.scene.CHILD_SCALE,this.#position.y+norm()*this.scene.CHILD_SCALE)
                this.#farm.addPlant(childPos,this.species)
            }
        }
    }


    harvestNode(node)
    {
        if (node.type == PlantComponentType.Leaf){
            node.img.destroy()
        } 
        for (var edge in node.edges){
            if (node.edges[edge].nodeTo != null) this.harvestNode(node.edges[edge].nodeTo);
            node.edges[edge].img.destroy()
        }
        for(var leaf in node.leaves){
            node.leaves[leaf].img.destroy()
        }
        node.img.destroy()
    }
    /**
     * 
     * @param {PlantElement} parent Node or Stem
     * @returns 
     */
    createComponent(parent){
        if (this.growFlg){
            console.log("createComponent:growFlg is true")
            return
        } 
        var spawnSocketOffset,tmpOffset;
        var randomSocket = Phaser.Math.Between(0,parent.growableSides.length-1)
        // decide socket to use
        tmpOffset = parent.socketOffsets[randomSocket].sockets[Phaser.Math.Between(0,parent.socketOffsets[randomSocket].sockets.length-1)]
        spawnSocketOffset = new Phaser.Math.Vector2(tmpOffset.x,tmpOffset.y).scale(this.scene.IMAGE_SCALE)
            // decide spawn stem or not
        var randomComponent = Phaser.Math.Between(0,99)
        var spawnLeaf = randomComponent < this.scene.LEAF_SPAWNRATE
        var spawnComponentIndex;
        // if parent is Stem, make node
        if (parent.constructor.name != "Node"){
            spawnComponentIndex= Phaser.Math.Between(0,this.#jsonData.leaves.length-1)
            component = spawnLeaf ? new Node(spawnSocketOffset.add(parent.position),this,this.species+"_node",parent)
            : new Leaf(spawnSocketOffset.add(parent.position),this,this.jsonData.leaves[spawnComponentIndex].name,parent,spawnComponentIndex)
            parent.nodeTo = component
            parent.growableSides.pop()
            return
        }
        // if parent is Node, make stem or leaf 

        var component;
        if(parent.socketOffsets[randomSocket].direction == "left"){
            randomComponent = spawnLeaf ? Phaser.Math.Between(0,this.#jsonData.leafIndices.left.length-1) : Phaser.Math.Between(0,this.#jsonData.stemIndices.left.length-1)
            spawnComponentIndex = spawnLeaf ? this.#jsonData.leafIndices.left[randomComponent] : this.#jsonData.stemIndices.left[randomComponent]
        }
        if(parent.socketOffsets[randomSocket].direction == "right"){
            randomComponent = spawnLeaf ? Phaser.Math.Between(0,this.#jsonData.leafIndices.right.length-1) : Phaser.Math.Between(0,this.#jsonData.stemIndices.right.length-1)
            spawnComponentIndex = spawnLeaf ? this.#jsonData.leafIndices.right[randomComponent] : this.#jsonData.stemIndices.right[randomComponent]
  
        }else if(parent.socketOffsets[randomSocket].direction == "mid"){
            randomComponent = spawnLeaf ? Phaser.Math.Between(0,(this.#jsonData.leaves.length-1)) : Phaser.Math.Between(0,this.#jsonData.stems.length-1)
            spawnComponentIndex = randomComponent
        }
        console.log(randomComponent,spawnComponentIndex,this.#jsonData.leaves,this.#jsonData.leaves.length,this.#jsonData,randomSocket)
        if (spawnLeaf){
            component = new Leaf(spawnSocketOffset.add(parent.position),this,this.jsonData.leaves[spawnComponentIndex].name,parent,spawnComponentIndex)
            parent.pushLeaves(component)
        }else{
            component = new Stem(spawnSocketOffset.add(parent.position),this,this.jsonData.stems[spawnComponentIndex].name,parent,spawnComponentIndex)
            parent.pushEdges(component)
        }
        parent.growableSides.splice(parent.growableSides.indexOf(randomSocket),1)
    }

    

}
function getRandomizedRange(n){
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // [0,1,...,n-1]
    var array = Array.from(Array(n).keys())
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    
    return array;
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
     * 画像ファイルが左側にそろえられているか
     * @type {Boolean} 
     * */
    alignedLeft: true,
    /** 画像内の要素部分の幅（画像自体は一律32x64） */
    width : null,
    /** 画像内の要素部分の高さ（画像自体は一律32x64） */
    height: null,
        /**
     * Nodeに隣接していて、葉や茎が接続可能なピクセルの座標
     * pos + offset = (該当ピクセルの座標)
     * @type {Array<Phaser.Math.Vector2>}
     */
    socketOffsets : [],
    /** 
     * 葉、茎が左向きに接続するか（連結する始点が左側にあるか）
     * @type {Boolean} 
     * */
    connectLeftSide :  null,
    connectRightSide : null,
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

class PlantElement{
#position;
#img;
#from;
#parent;
#plantInfo;
#socketOffsets = [];
#growableSides = [];
#name;
#type;
get plantInfo(){return this.#plantInfo}
get from(){return this.#from}
get position(){return this.#position}
get growableSides(){return this.#growableSides}
get socketOffsets(){return this.#socketOffsets}
get img(){return this.#img}
get type(){return this.#type}
get parent(){return this.#parent}

/**
 * 初期化と画像の表示
 * @param {Phaser.Math.Vector2} position 
 * @param {Plant} parent 
 * @param {String} img filename of plant image
 * @param {PlantElement} from  
 * @param {Number} n index inside of sjson data 
 */
constructor(position,parent,img,from = null,n = 0){
    this.#parent = parent;
    this.#position = position;
    if (this.constructor.name == "Node"){
        this.#type = PlantComponentType.Node
    }else if(this.constructor.name == "Stem"){
        this.#type = PlantComponentType.Stem
    }else if(this.constructor.name == "Leaf"){
        this.#type = PlantComponentType.Leaf
    }else{
        this.#type = null
    }
    this.#plantInfo = this.loadPlantElementInfo(this.#type,n)
       var tmpPos = this.fixPrintPos(this.#position)
    this.#img = this.#parent.scene.add.image(tmpPos.x,tmpPos.y,img).setOrigin(0, 0).setScale(this.parent.scene.IMAGE_SCALE,this.parent.scene.IMAGE_SCALE);
    this.#from = from
    this.#name = img
    this.#socketOffsets = this.plantInfo.socketOffsets;
    for (var i = 0; i< this.#socketOffsets.length;i++) this.#growableSides.push(i) 

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
    if (!this.#plantInfo.alignedLeft) pos.x -= (this.parent.scene.IMAGE_SIZE.x-1)*this.parent.scene.IMAGE_SCALE;
    // 画像内で先端が角以外にある場合は調整
    pos.x += this.#plantInfo.offsetX*this.parent.scene.IMAGE_SCALE
    pos.y += this.#plantInfo.offsetY*this.parent.scene.IMAGE_SCALE
    return pos.add(origin)
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

    // Nodeだけ継承クラスを使用
    var info, data,indicesData;
    info = makePlantElementInfo();

    if (type == PlantComponentType.Node){
        data = jsonData.node
    }else if(type==PlantComponentType.Stem){
        data = jsonData.stems[n]
        indicesData = jsonData.stemIndices
    }else if(type == PlantComponentType.Leaf){
        data = jsonData.leaves[n]
        indicesData = jsonData.leafIndices
    }
    info.offsetX = data.offset.x
    info.offsetY = data.offset.y
    info.endX = data.offset.endx
    info.endY = data.offset.endy
    info.height = data.size.height
    info.width =  data.size.width
    for(var item in data.socketOffsets){
        // info.socketOffsets.push(new Phaser.Math.Vector2(data.socketOffsets[item].x,data.socketOffsets[item].y))
        info.socketOffsets.push(data.socketOffsets[item])
    }
    // Nodeはここで終わり
    if(type ==  PlantComponentType.Node) return info;

    info.alignedLeft = data.alignedLeft
    info.connectLeftSide = info.connectRightSide = false
    for(var idx in indicesData.left){
        if(idx == n) {
            info.connectLeftSide = true
            break
        }
    }
    for(var idx in indicesData.right){
        if(idx == n) {
            info.connectRightSide = true
            break
        }
    }
    return info
}

}

class Node extends PlantElement{
    #position;
    #img;
    #parent;
    #from
    #edges = [];
    #leaves = []

    constructor(position,parent,img,from){
            super(position,parent,img,from);
            parent.num = PlantComponentType.Node
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
    #position;
    #parent;
    #plantInfo;
    #from;
    #nodeTo;
    #img;
    constructor(position,parent,img,from,n){
        super(position,parent,img,from,n);
        this.#nodeTo = null
        parent.num = PlantComponentType.Stem
    }
    get nodeTo(){ return this.#nodeTo};
    set nodeTo(node){this.#nodeTo = node}
    // set nodeTo(node){this.#NodeTo=node;}
}

class Leaf extends PlantElement{
    #position;
    #parent;
    #plantInfo;
    #from;
    #img;
    constructor(position,parent,img,from,n){
        super(position,parent,img,from,n);
        parent.num = PlantComponentType.Leaf
    }
}