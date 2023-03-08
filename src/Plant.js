
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
    #growFlg;
    /** raw value of this plant before applying multiplier*/
    #valueRaw;
    #value;
    #valueParam = [];
    #valueTxt = null
    pruneProba
    #pruneMultiplier
    /** 
     * number of elements [sum,Node,Stem,Leaf]
     *  added on elements' construtor 
    */
   #num;
   #numChild;
   #parentSlot
//    #farm
//    #farmindex
   #fullyGrown
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
    get pruneMultiplier(){return this.#pruneMultiplier}

    get fullyGrown(){return this.#fullyGrown}
    set num(n){
        this.num[0]++;
        this.num[n]++;
        this.pruneProba /= this.#pruneMultiplier
        this.calcValue(n)
    }
    get numChild(){return this.#numChild}
    // farm class
    // get farm (){return this.#farm}
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
    constructor(position,scene,species,parentSlot){
        // this.x = x;
        // this.y = y;
        this.#position = position;
        this.#scene = scene;
        this.#species = species
        this.#parentSlot = parentSlot
        // parameter -> index.js:45
        this.#jsonData = this.#scene.cache.json.get("param").plants[this.#species]
        this.#growFlg = false
        this.#num = [0,0,0,0]
        // console.log(this.jsonData);
        
        for(var key in this.#jsonData.value) {
            // console.log(key);
            this.valueParam.push(this.#jsonData.value[key]);
        }
        // pruneProba: e^-0.1x, x=this.num[0](number of all elements) 
        this.pruneProba = Math.E
        this.#pruneMultiplier = Math.pow(Math.E,0.1)
        this.#valueRaw = 0
        this.#value = 0
        this.#valueTxt = this.scene.add.text(this.#position.x+3, this.#position.y+60*this.#scene.IMAGE_SCALE+30, 0, { fontFamily:"font1",fontSize: '24px', fill: '#000'}).setOrigin(0.5);
        this.#numChild = 1
        // this.#farmindex = farmindex
        this.createRoot()
    }
    /**
     * calculate valueRaw and value
     * @param {PlantElementType} n   
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
        this.#root = new Node(this.#position,this,this.jsonData.node)
    }

    dfs_grow(node){
        if (this.growFlg) return;
        // node 
        if (node.growableSides.length != 0 && Phaser.Math.FloatBetween(0,1) < 0.5){
            
            this.selectElementToSpawn(node)
            this.#growFlg = true;
        }
        // edge(stem)
        var edge;
        if(node.type == PlantElementType.Leaf) return
        for (var i in getRandomizedRange(node.edges.length)){
            edge = node.edges[i]
            if(this.growFlg) return;
            // if edge is not connected to a node
            if (edge.nodeTo == null){
                // try to spawn node
                if (Phaser.Math.FloatBetween(0,1) > 0.5) continue;
                this.selectElementToSpawn(edge)
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
                this.#fullyGrown = !this.#growFlg
                if(this.#fullyGrown)this.#parentSlot.onFullyGrown()

            }
        } 
        this.growFlg = false
    }
    harvest(){
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
        this.#parentSlot.removePlant()
        this.#parentSlot.addPlantChild(this.#position.x,this.#position.y)
    }


    harvestNode(node)
    {
        if (node.type == PlantElementType.Leaf){
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
     * Elementを生成
     * 1. 親Elementに隣接する生成先の座標を決定
     * 2. 生成するElementを決定
     * 3. 生成
     * @param {PlantElement} parent 生成されるElementの親となるElement(Node or Stem)
     * @returns 
     */
    selectElementToSpawn(parent){
        if (this.growFlg){
            console.log("selectElementToSpawn:growFlg is true")
            return
        } 
        
        // decide socket to use
        var socketOffsetsindex = Phaser.Math.Between(0,parent.growableSides.length-1)
        var socketindex = Phaser.Math.Between(0,parent.socketOffsets[socketOffsetsindex].sockets.length-1)
        var tmpOffsetData = parent.socketOffsets[socketOffsetsindex].sockets[socketindex]
        var socketOffset = new Phaser.Math.Vector2(tmpOffsetData.x,tmpOffsetData.y).scale(this.scene.IMAGE_SCALE)
        // decide spawn Leaf or not
        var random = Phaser.Math.Between(0,99)
        var doSpawnLeaf = random < this.scene.LEAF_SPAWNRATE
        // console.log(doSpawnLeaf,random,this.scene.LEAF_SPAWNRATE);
        var elementJsonDataToSpawn;
        var elementType;
        // if parent is Stem, spawn Node (or Leaf)
        // else if parent is Node, make Stem (or Leaf) 
        if (parent.type == PlantElementType.Stem){
            elementJsonDataToSpawn = doSpawnLeaf ? this.jsonData.leaves[Phaser.Math.Between(0,this.#jsonData.leaves.length-1)] : this.jsonData.node
            elementType = doSpawnLeaf ? PlantElementType.Leaf : PlantElementType.Node
            parent.growableSides.pop()
        }else{
        
            var growDirection = parent.socketOffsets[socketOffsetsindex].direction
            elementJsonDataToSpawn = this.setElementJsonDataToSpawn(growDirection,doSpawnLeaf)
            elementType = doSpawnLeaf ? PlantElementType.Leaf: PlantElementType.Stem
            parent.growableSides.splice(parent.growableSides.indexOf(socketOffsetsindex),1)
        }
        if(parent.growableSides.length == 1){
            // pruneProba: e^-0.1x, x=this.num[0](number of all elements) 
            if (Phaser.Math.FloatBetween(0,1) > this.pruneProba) parent.growableSides.pop()
        }

        // if (parent.growableSides.length == 1) parent.growableSides.pop()  
        this.createPlantElement(elementType,socketOffset.add(parent.position),elementJsonDataToSpawn,parent)
    }

    setElementJsonDataToSpawn(growDirection,doSpawnLeaf){
        var targetJsonData = doSpawnLeaf ? this.jsonData.leaves : this.jsonData.stems
        var targetJsonIndexData
        var tmpElementIndex
        var targetElementIndex
        if(growDirection == "left"){
            targetJsonIndexData = doSpawnLeaf ? this.#jsonData.leafIndices : this.#jsonData.stemIndices
            tmpElementIndex = Phaser.Math.Between(0,targetJsonIndexData.left.length-1)
            targetElementIndex = targetJsonIndexData.left[tmpElementIndex]
        }
        if(growDirection == "right"){
            targetJsonIndexData = doSpawnLeaf ? this.#jsonData.leafIndices : this.#jsonData.stemIndices
            tmpElementIndex = Phaser.Math.Between(0,targetJsonIndexData.right.length-1)
            targetElementIndex = targetJsonIndexData.right[tmpElementIndex]
        }
        if(growDirection == "mid"){
            targetElementIndex = Phaser.Math.Between(0,(targetJsonData.length-1))
        }
        
        return targetJsonData[targetElementIndex]
    }
    createPlantElement(type,position,elementJsonData,parentElement){
        var element
        if(type == PlantElementType.Node){
            element =  new Node(position,this,elementJsonData,parentElement)
            // console.log("created Node",element);
        } 
        if(type == PlantElementType.Stem){
            element =  new Stem(position,this,elementJsonData,parentElement)
            // console.log("created Stem",element);
        }
        if(type == PlantElementType.Leaf){
            element =  new Leaf(position,this,elementJsonData,parentElement)
            // console.log("created Leaf",element);
        }
        // console.log(type,element.type,element,parentElement)
        this.updateParentElement(type,element,parentElement)
    }
    updateParentElement(type,element,parentElement){
        if(parentElement.type == PlantElementType.Stem){
            parentElement.nodeTo = element
            return
        }
        if(type == PlantElementType.Stem){
            parentElement.pushEdges(element)
        }else if(type == PlantElementType.Leaf){
            parentElement.pushLeaves(element)
        }
        
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


