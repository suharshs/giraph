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
    this.redraw = function(){
        var that = this;
        this.viz.attr({
            x: that.position[0],
            y: that.position[1]
        }).addTo(stage);
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
    var edgelength = 300; // we will keep the minimum as 100
    var k_c = edgelength*(6-3*(150/(3*edgelength))); // tying k_c to edge_length makes fd speed reasonable and removes overcorrection
    var k_h = k_c/Math.pow(edgelength,3);

    var atrchange = [];

    //attractive edge force (need to use the edge information here)
    for(var id=0; id < edges.length; id++){
        var endpoints = edges[id].endpoints;
        var v1p = endpoints[0].position;
        var v2p = endpoints[1].position;
        var change1 = [0,0];
        var change2 = [0,0];
        var d = Math.sqrt((v2p[0]-v1p[0])*(v2p[0]-v1p[0])+(v2p[1]-v1p[1])*(v2p[1]-v1p[1]) + 100.0);
            change1[0] = +(v2p[0]-v1p[0])*k_h*d;
            change1[1] = +(v2p[1]-v1p[1])*k_h*d;
            change2[0] = -(v2p[0]-v1p[0])*k_h*d;
            change2[1] = -(v2p[1]-v1p[1])*k_h*d;
        atrchange.push([change1,change2]);
    }

    var repchange = [];
    var j;

    // repulsive force here
    for (var i = 0; i < verts.length; i++){
        var v1pos = verts[i].position;
        for (j = i+1; j < verts.length; j++){
            var v2pos = verts[j].position;
            var del1 = [0,0];
            var del2 = [0,0];
            var dist = Math.sqrt((v2pos[0]-v1pos[0])*(v2pos[0]-v1pos[0])+(v2pos[1]-v1pos[1])*(v2pos[1]-v1pos[1]) + 100.0);
            del1[0] = -(v2pos[0]-v1pos[0])*k_c/dist/dist;
            del1[1] = -(v2pos[1]-v1pos[1])*k_c/dist/dist;
            del2[0] = +(v2pos[0]-v1pos[0])*k_c/dist/dist;
            del2[1] = +(v2pos[1]-v1pos[1])*k_c/dist/dist;
            repchange.push(del1);
            repchange.push(del2);
        }
    }

    // applying the atraction changes
    for (id = 0; id < edges.length; id++){
        var endpts = edges[id].endpoints;
        endpts[0].position[0] += atrchange[id][0][0];
        endpts[0].position[1] += atrchange[id][0][1];
        endpts[1].position[0] += atrchange[id][1][0];
        endpts[1].position[1] += atrchange[id][1][1];
    }

    // applying repulsive forces
    for (i = 0; i < verts.length; i++){
        var v1ps = verts[i].position;
        for (j = i+1; j < verts.length; j++){
            var d1 = repchange.shift();
            var d2 = repchange.shift();
            verts[i].position[0] += d1[0];
            verts[i].position[1] += d1[1];
            verts[j].position[0] += d2[0];
            verts[j].position[1] += d2[1];
        }
    }

    // adds a gravitational sink at the centroid of the screen
    // for (var v=0; v < verts.length; v++){
    //     var vpos =  verts[v].position;
    //     var cdist = (650-vpos[0])*(650-vpos[0])+(250-vpos[1])*(250-vpos[1]) + 100.0;
    //     vpos[0] += (650-vpos[0])*0.0000001*cdist - (650-vpos[0])*10000000/cdist/cdist;
    //     vpos[1] += (250-vpos[1])*0.0000001*cdist - (250-vpos[1])*10000000/cdist/cdist;
    // }

    //Need to figure out how to scale the graph edge links based on screen size
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
x.draw();
    v.draw();
    u.draw();
    g.draw();
    f.draw();
    e.draw();

var verts = [v,u,x];
var edges = [g,f,e];

setInterval(function(){
    fd(verts,edges);
    redrawEdge(g);
    redrawEdge(f);
    redrawEdge(e);
    x.redraw();
    v.redraw();
    u.redraw();
},50);




