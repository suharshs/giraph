function redrawEdge(edge){
    edge.viz.clear().moveTo(edge.endpoints[0].position[0], edge.endpoints[0].position[1])
        .lineTo(edge.endpoints[1].position[0],edge.endpoints[1].position[1]).addTo(stage);
}

function vertex(){
    this.position = [Math.floor(Math.random()*500),Math.floor(Math.random()*500)];
    this.edges = [];
    this.viz = undefined;
    this.draw = function(){
        var that = this;
        this.viz = new Circle(this.position[0], this.position[1], 25)
        .stroke('rgb(220,0,0)', 2)
        .fill('rgba(220,0,0,0.3)')
        .on("multi:drag", function(e){
            this.animate( '300ms', {
                fillColor: 'rgba(220,0,0,0.6)'
            });
            this.attr({
                x: e.x,
                y: e.y
            });
            that.position = [e.x,e.y];
            for (var i = 0; i < that.edges.length; i++){
                redrawEdge(that.edges[i]);
            }
        })
        .on("multi:pointerup", function(e){
            this.animate( '300ms', {
                fillColor: 'rgba(220,0,0,0.3)'
            });
        })
        .addTo(stage);
    };
}

function edge(){
    this.viz = undefined;
    this.endpoints = [];
    this.draw = function(){
        this.viz = new Path()
        .stroke('rgba(0,0,220,0.8)', 4)
        .moveTo(this.endpoints[0].position[0],this.endpoints[0].position[1])
        .lineTo(this.endpoints[1].position[0],this.endpoints[1].position[1])
        .addTo(stage);
    };
}

function fd(vrts, edgs){
    //attractive edge force (need to use the edge information here)
    for(var id=0; id < edges.length; id++){
        var endpoints = edges[id].endpoints;
        var v1p = endpoints[0].position;
        var v2p = endpoints[1].position;
        var d = (v2p[0]-v1p[0])*(v2p[0]-v1p[0])+(v2p[1]-v1p[1])*(v2p[1]-v1p[1]);
            v1p[0] = v1p[0]+(v2p[0]-v1p[0])*550/d;
            v1p[1] = v1p[1]+(v2p[1]-v1p[1])*550/d;
            v2p[0] = v2p[0]-(v2p[0]-v1p[0])*550/d;
            v2p[1] = v2p[1]-(v2p[1]-v1p[1])*550/d;
        endpoints[0].position = v1p;
        endpoints[1].position = v2p;
    }

    // repulsive force here
    for (var i = 0; i < verts.length; i++){
        var v1pos = verts[i].position;
        for (var j = i+1; j < verts.length; j++){
            var v2pos = verts[j].position;
            var dist = (v2pos[0]-v1pos[0])*(v2pos[0]-v1pos[0])+(v2pos[1]-v1pos[1])*(v2pos[1]-v1pos[1]);
            v1pos[0] = v1pos[0]-(v2pos[0]-v1pos[0])*500/dist;
            v1pos[1] = v1pos[1]-(v2pos[1]-v1pos[1])*500/dist;
            v2pos[0] = v2pos[0]+(v2pos[0]-v1pos[0])*500/dist;
            v2pos[1] = v2pos[1]+(v2pos[1]-v1pos[1])*500/dist;
            verts[j].position = v2pos;
        }
        verts[i].position = v1pos;
    }
}




var v = new vertex();
//v.position = [50,50];
var u = new vertex();
//u.position = [200,50];
var x = new vertex();
//x.position = [150,100];
var e = new edge();
e.endpoints = [v,u];
var f = new edge();
f.endpoints = [u,x];
var g = new edge();
g.endpoints = [v,x];
v.edges.push(g);
x.edges.push(g);
u.edges.push(f);
x.edges.push(f);
v.edges.push(e);
u.edges.push(e);

var verts = [v,u,x];
var edges = [g,f,e];

setInterval(function(){
    fd(verts,edges);
    x.draw();
    v.draw();
    u.draw();
    g.draw();
    f.draw();
    e.draw();
},10);




