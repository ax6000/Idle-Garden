const IMAGE_SIZE = new Phaser.Math.Vector2(32,64);
const IMAGE_SCALE = 4
class Plant{
#position;
#root;
#scene;
#species;
#nLeaves;
#nStems;
    constractor(position,scene,species){
        // this.x = x;
        // this.y = y;
        this.#position = position;
        this.#scene = scene;
        this.#species = species
        this.#nLeaves = Object.keys(parameter.plants[species].leaves).length
        this.#nStems= Object.keys(parameter.plants[species].stems).length
    }
    createRoot(){
        this.#root = new Node(this,this.#species,this.#position) 
    }
    set root(node){this.#root = node;}
    get scene(){ return this.#scene;}
    get species(){return this.#species}
    

}

class PlantElementInfo{
    offsetX;
    offsetY;
    endX;
    endY;
    isleft;
    width;
    height;
}

var PlantComponentType = {
    Node:1,
    Stem:2,
    Leaf:3
};

class PlantNodeInfo extends PlantElementInfo{
    socketOffset;
}


class PlantElement{
#position;
#img;
#parent;
#plantInfo;

constractor(parent,img,position){
    this.#parent = parent;
    this.#position = position;
    this.img = parent.scene.img.add(this.fixPrintPos,img).setOrigin(0, 0);
}
fixPrintPos(){
    var pos = Phaser.Math.Vector2.Zero;
    pos.x -= IMAGE_SIZE.y;
    if (!this.#plantInfo.isleft){
        pos.y -= IMAGE_SIZE.y;
    }
    pos.x += this.#plantInfo.offsetX
    pos.y += this.#plantInfo.offsetY
    return pos * IMAGE_SCALE
}
loadPlantElementInfo(type,n = 0){
    species = parent.species;
    if (type == PlantComponentType.Node){
        info = new PlantNodeInfo();
        data = parameter.plants[species].node
    }else if(type==PlantComponentType.Stem){
        info = new PlantElementInfo();
        data = parameter.plants[species].stems[n]
    }else if(type == PlantComponentType.Leaf){
        info = new PlantElementInfo();
        data = parameter.plants[species].leaves[n]
    }
    info.offsetX = data.offset.x
    info.offsetY = data.offset.y
    info.endX = data.offset.endx
    info.endY = data.offset.endy
    info.height = data.size.height
    info.width =  data.size.width
    info.isleft =  data.size.isleft
    if (type == PlantComponentType.Node){
        info.socketOffset = []
        for(var item in data.socketOffset){
            info.socketOffset.add(Phaser.Math.Vector2(data.socketOffset[item].x,data.socketOffset[item].y))
        }
    }
    return info
}
}

class Node extends PlantElement{
#position;
#img;
#parent;
#plantInfo;
#edges = [];
#socketOffset = [];
constructor(parent,img,position){
        super.constractor(parent,img,position);
        this.#socketOffset = this.#plantInfo.socketOffset; 
        this.#plantInfo = this.loadPlantElementInfo(PlantComponentType.Node)
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
    constractor(parent,img,position,from,n){
        super.constractor(parent,img,position);
        this.#nodeFrom = from;
        this.#plantInfo = this.loadPlantElementInfo(PlantComponentType.Stem,n)
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
    constractor(parent,img,position,from,n){
        super.constractor(parent,img,position);
        this.#nodeFrom = from;
        this.#plantInfo = this.loadPlantElementInfo(PlantComponentType.Leaf,n)
    }
    get nodeFrom(){ return this.#nodeFrom};
}