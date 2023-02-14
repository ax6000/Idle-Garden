class Plant{
#root;

    constractor(x,y){
        this.x = x;
        this.y = y;
    }
    set root(node){
        this.#root = node;
    }
}

class Node{
#edges = [];
#img;
    constractor(img){
        this.img = img;
    }
    add(edge){
        this.#edges.add(edge);
    }

}

class Edge{
    #nodeFrom;
    #nodeTo;
    #img;
    constractor(from,img){
        this.#nodeFrom = from;
        this.#img = img;
    }
    get nodeFrom(){ return this.#nodeFrom};
    get nodeTo(){ return this.#nodeTo};
    set nodeTo(node){this.#NodeTo=node;}
}