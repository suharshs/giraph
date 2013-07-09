// giraph graph library

// library
giraph = (function(){

  // private digraph constructor
  var digraph = function(){
    var edge_id = 0;
    var vertices = {}; // map of vertices indexed by id
    var edges = {}; // map of edges indexed by id
    this.visualization = undefined;
    this.isdrag = false;

    // methods
    // add a vertex
    this.add_vertex = function(id, weight, extra){
      // create the new vertex
      var v = new vertex(id, weight, extra);
      vertices[id] = v;
      v.visualization = this.visualization;
      v.drag(this.isdrag);
      return this;
    };
    // add an edge
    this.add_edge = function(v1, v2, weight, extra){
      // if one of the vertices doesn't exist
      if (!(v1 in vertices && v2 in vertices) || v2 in vertices[v1]._out_neighbors){
        return; // gracefully exit without adding edge
      }
      // create the new edge
      var id = edge_id;
      edge_id++;
      var e = new edge(id, this.vertex(v1), this.vertex(v2), weight, extra);
      e.visualization = this.visualization;
      edges[id] = e;
      e.draw();
      // only add in this direction
      vertices[v1]._out_neighbors[v2] = this.vertex(v2);
      vertices[v2]._in_neighbors[v1] = this.vertex(v1);
      vertices[v1]._out_edges[v2] = e;
      vertices[v2]._in_edges[v1] = e;
      return this;
    };
    // remove an edge
    this.remove_edge = function(v1, v2){
      // if one of the vertices doesn't exist
      if (!(v1 in vertices && v2 in vertices)){
        return false; // gracefully exit without removing edge
      }
      this.edge(v1,v2).visclear();
      var id = vertices[v1]._out_edges[v2].id();
      delete vertices[v1]._out_neighbors[v2];
      delete vertices[v2]._in_neighbors[v1];
      delete vertices[v1]._out_edges[v2];
      delete vertices[v2]._in_edges[v1];
      delete edges[id];
      return this;
    };
    // remove a vertex
    this.remove_vertex = function (v){
      if (!(v in vertices)){
        return false; // gracefully exit
      }
      this.vertex(v).visclear();
      // delete the in neighbors reference to v
      var neighbors = Object.keys(vertices[v]._in_neighbors);
      for (var i = 0; i < neighbors.length; i++){
        edges[neighbors[i]].visclear();
        delete edges[neighbors[i]];
        delete vertices[neighbors[i]]._out_neighbors[v];
        delete vertices[neighbors[i]]._out_edges[v];
      }
      // delete the out neighbors reference to v
      neighbors = Object.keys(vertices[v]._out_neighbors);
      for (i = 0; i < neighbors.length; i++){
        edges[neighbors[i]].visclear();
        delete edges[neighbors[i]];
        delete vertices[neighbors[i]]._in_neighbors[v];
        delete vertices[neighbors[i]]._in_edges[v];
      }
      delete vertices[v];
      return this;
    };
    // get a vertex
    this.vertex = function(v){
      if (!(v in vertices)){
        return false; // gracefully exit
      }
      return vertices[v];
    };
    // get an edge
    this.edge = function(v1, v2){
      if (!(v1 in vertices && v2 in vertices)){
        return false; // gracefully exit
      }
      return vertices[v1]._out_edges[v2];
    };
    // get the size of the graph (number of edges)
    this.size = function(){
      return Object.keys(edges).length;
    };
    // get the order of the graph (number of vertices)
    this.order = function(){
      return Object.keys(vertices).length;
    };
    // get the list of vertices
    this.vertices = function(sortfn){
      var verts = [];
      for (var key in vertices){
        verts.push(vertices[key]);
      }
      // if the user want to sort the verts
      if (sortfn) verts.sort(sortfn);
      return verts;
    };
    // get the list of edge endpoints
    this.edges = function(sortfn){
      var values = [];
      for (var key in edges){
        values.push(edges[key]);
      }
      // if the user wants to sort the edges
      if (sortfn) values.sort(sortfn);
      return values;
    };
    // sets the visualization in all of this graph's components
    this.viz = function(visual){
      this.visualization = visual;
      var verts = this.vertices();
      var edges = this.edges();
      for (var i = 0; i < verts.length; i++){
        verts[i].visualization = this.visualization;
      }
      for (i = 0; i < edges.length; i++){
        edges[i].visualization = this.visualization;
      }
    };
    // displays the graph
    this.draw = function(){
      if (this.visualization){
        var verts = this.vertices();
        var edges = this.edges();
        for (var i = 0; i < verts.length; i++){
          verts[i].draw();
        }
        for (i = 0; i < edges.length; i++){
          edges[i].draw();
        }
      }
    };
    // notifies the vertices about drag
    this.drag = function(choice){
      this.isdrag = choice;
      if (this.visualization){
        var verts = this.vertices();
        for (var i = 0; i < verts.length; i++){
          verts[i].drag(choice);
        }
      }
    };
    // clears the graph
    this.clear = function(){
      if (this.visualization){
        var verts = this.vertices();
        var edgs = this.edges();
        for (var i = 0; i < verts.length; i++){
          verts[i].visclear();
        }
        for (i = 0; i < edgs.length; i++){
          edgs[i].visclear();
        }
      }
      edge_id = 0;
      vertices = {};
      edges = {};
    };
    // resets the graph
    this.reset = function(){
      if (this.visualization){
        var verts = this.vertices();
        var edgs = this.edges();
        for (var i = 0; i < verts.length; i++){
          verts[i].reset();
        }
        for (i = 0; i < edgs.length; i++){
          edgs[i].reset();
        }
      }
    };
  };

  // private graph constructor
  var graph = function(){
    var edge_id = 0;
    var vertices = {}; // map of vertices indexed by id
    var edges = {}; // map of edges indexed by id
    this.visualization = undefined;
    this.isdrag = false;

    // methods
    // add a vertex
    this.add_vertex = function(id, weight, extra){
      // create the new vertex
      var v = new vertex(id, weight, extra);
      vertices[id] = v;
      v.visualization = this.visualization;
      v.draw();
      v.drag(this.isdrag);
      return this;
    };
    // add an edge
    this.add_edge = function(v1, v2, weight, extra){
      // if one of the vertices doesn't exist
      if (!(v1 in vertices && v2 in vertices) || v2 in vertices[v1]._out_neighbors){
        return; // gracefully exit without adding edge
      }
      // create the new edge
      var id = edge_id;
      edge_id++;
      var e = new edge(id, this.vertex(v1), this.vertex(v2), weight, extra);
      e.visualization = this.visualization;
      edges[id] = e;
      e.draw();
      // only add in this direction
      vertices[v1]._out_neighbors[v2] = this.vertex(v2);
      vertices[v2]._out_neighbors[v1] = this.vertex(v1);
      vertices[v2]._in_neighbors[v1] = this.vertex(v2);
      vertices[v1]._in_neighbors[v2] = this.vertex(v1);
      vertices[v1]._out_edges[v2] = e;
      vertices[v2]._out_edges[v1] = e;
      vertices[v2]._in_edges[v1] = e;
      vertices[v1]._in_edges[v2] = e;
      return this;
    };
    // remove an edge by id of vertex
    this.remove_edge = function(v1, v2){
      // if one of the vertices doesn't exist
      if (!(v1 in vertices && v2 in vertices)){
        return false; // gracefully exit without removing edge
      }
      this.edge(v1,v2).visclear();
      var id = vertices[v1]._out_edges[v2].id();
      delete vertices[v1]._out_neighbors[v2];
      delete vertices[v2]._out_neighbors[v1];
      delete vertices[v1]._in_neighbors[v2];
      delete vertices[v2]._in_neighbors[v1];
      delete vertices[v1]._out_edges[v2];
      delete vertices[v2]._out_edges[v1];
      delete vertices[v2]._in_edges[v1];
      delete vertices[v1]._in_edges[v2];
      delete edges[id];
      return this;
    };
    // remove a vertex
    this.remove_vertex = function (v){
      if (!(v in vertices)){
        return false; // gracefully exit
      }
      this.vertex(v).visclear();
      // delete the in neighbors reference to v
      var neighbors = Object.keys(vertices[v]._in_neighbors);
      for (var i = 0; i < neighbors.length; i++){
        edges[neighbors[i]].visclear();
        delete edges[neighbors[i]];
        delete vertices[neighbors[i]]._out_neighbors[v];
        delete vertices[neighbors[i]]._out_edges[v];
      }
      // delete the out neighbors reference to v
      neighbors = Object.keys(vertices[v]._out_neighbors);
      for (i = 0; i < neighbors.length; i++){
        edges[neighbors[i]].visclear();
        delete edges[neighbors[i]];
        delete vertices[neighbors[i]]._in_neighbors[v];
        delete vertices[neighbors[i]]._in_edges[v];
      }
      delete vertices[v];
      return this;
    };
    // get a vertex
    this.vertex = function(v){
      if (!(v in vertices)){
        return false; // gracefully exit
      }
      return vertices[v];
    };
    // get an edge
    this.edge = function(v1, v2){
      if (!(v1 in vertices && v2 in vertices)){
        return false; // gracefully exit
      }
      return vertices[v1]._out_edges[v2];
    };
    // get the size of the graph (number of edges)
    this.size = function(){
      return Object.keys(edges).length;
    };
    // get the order of the graph (number of vertices)
    this.order = function(){
      return Object.keys(vertices).length;
    };
    // get the list of vertices
    this.vertices = function(sortfn){
      var verts = [];
      for (var key in vertices){
        verts.push(vertices[key]);
      }
      // if the user want to sort the verts
      if (sortfn) verts.sort(sortfn);
      return verts;
    };
    // get the list of edge endpoints
    this.edges = function(sortfn){
      var values = [];
      for (var key in edges){
        values.push(edges[key]);
      }
      // if the user wants to sort the edges
      if (sortfn) values.sort(sortfn);
      return values;
    };
    // sets the visualization in all of this graph's components
    this.viz = function(visual){
      this.visualization = visual;
      var verts = this.vertices();
      var edges = this.edges();
      for (var i = 0; i < verts.length; i++){
        verts[i].visualization = this.visualization;
      }
      for (i = 0; i < edges.length; i++){
        edges[i].visualization = this.visualization;
      }
    };
    // displays the graph
    this.draw = function(){
      if (this.visualization){
        var verts = this.vertices();
        var edges = this.edges();
        for (var i = 0; i < verts.length; i++){
          verts[i].draw();
        }
        for (i = 0; i < edges.length; i++){
          edges[i].draw();
        }
      }
    };
    // notifies the vertices about drag
    this.drag = function(choice){
      this.isdrag = choice;
      if (this.visualization){
        var verts = this.vertices();
        for (var i = 0; i < verts.length; i++){
          verts[i].drag(choice);
        }
      }
    };
    // clears the graph
    this.clear = function(){
      if (this.visualization){
        var verts = this.vertices();
        var edgs = this.edges();
        for (var i = 0; i < verts.length; i++){
          verts[i].visclear();
        }
        for (i = 0; i < edgs.length; i++){
          edgs[i].visclear();
        }
      }
      edge_id = 0;
      vertices = {};
      edges = {};
    };
    // resets the graph
    this.reset = function(){
      if (this.visualization){
        var verts = this.vertices();
        var edgs = this.edges();
        for (var i = 0; i < verts.length; i++){
          verts[i].reset();
        }
        for (i = 0; i < edgs.length; i++){
          edgs[i].reset();
        }
      }
    };
  };

  // private directed vertex constructor
  var vertex = function(aid, aweight, aextra){
    var id, weight, extra, color, x=0, y=0;
    this.visualization = undefined; // will store the visualization object
    this.viselement = undefined;
    this.label = undefined;
    this.weightlabel = undefined;
    color = "rgba(220,50,50)";
    // set this vertex's information
    if (aid === undefined){
      throw new Error("vertex object requires an id");
    }
    else {
      id = aid;
    }
    if (aweight === undefined){
      weight = 0;
    }
    else {
      weight = aweight;
    }
    if (aextra === undefined){
      extra = {};
    }
    else {
      extra = aextra;
    }
    this._in_neighbors = {}; // key neighbor, value vertex object
    this._out_neighbors = {}; // key neighbor, value vertex object
    this._in_edges = {}; // key neighbor id, value edge object
    this._out_edges = {}; // key neighbor id, value edge object

    // returns the objects for all of the in_neighbors
    this.in_neighbors = function(){
      var neighbors = Object.keys(this._in_neighbors);
      var retval = [];
      for (var i = 0; i < neighbors.length; i++){
        retval.push(this._in_neighbors[neighbors[i]]);
      }
      return retval;
    };
    // returns the objects for all of the out_neighbors
    this.neighbors = function(){
      var neighbors = Object.keys(this._out_neighbors);
      var retval = [];
      for (var i = 0; i < neighbors.length; i++){
        retval.push(this._out_neighbors[neighbors[i]]);
      }
      return retval;
    };
    // returns the in_edges of this vertex
    this.in_edges = function(){
      var neighbors = Object.keys(this._in_edges);
      var retval = [];
      for (var i = 0; i < neighbors.length; i++){
        retval.push(this._in_edges[neighbors[i]]);
      }
      return retval;
    };
    // returns the out_edges of this vertex
    this.edges = function(){
      var neighbors = Object.keys(this._out_edges);
      var retval = [];
      for (var i = 0; i < neighbors.length; i++){
        retval.push(this._out_edges[neighbors[i]]);
      }
      return retval;
    };
    // returns the id
    this.id = function(){
      return id;
    };
    // getter and setter of weight
    this.weight = function(aweight){
      if (aweight === undefined) return weight;
      weight = aweight;
      return this;
    };
    // getter and setter of extra
    this.extra = function(aextra){
      if (aextra === undefined) return extra;
      extra = aextra;
      return this;
    };
    // returns boolean if the vertex is a neighbor
    this.is_neighbor = function(v){
      return (this._out_neighbors[v] !== undefined);
    };
    // returns boolean if the vertex is a in_neighbor
    this.is_in_neighbor = function(v){
      return (this._in_neighbors[v] !== undefined);
    };
    // getter and setter of color
    this.color = function(col){
      if (col === undefined) return color;
      color = col;
      this.draw(true); // update the visualization
      return this;
    };
    // getter and setter of position
    // update is a boolean of whether we should update the visualization immediately
    this.position = function(ax,ay,update){
      if (ax === undefined || ay === undefined) return {x:x,y:y};
      x = ax;
      y = ay;
      if (update === undefined){
        update = true;
      }
      if (update){
        this.draw(true); // update the visualization
        var edges = this.edges().concat(this.in_edges());
        // update all of the edges that need to be redrawn
        for (var i = 0; i < edges.length; i++){
          edges[i].draw(true);
        }
      }
      return this;
    };
    // send the draw message to the visualization
    this.draw = function(instant){
      if (this.viselement && instant){
        this.viselement.attr({
          cx: x,
          cy: y,
          fill: color
        });
        this.label.attr({
          x: x,
          y: y-10
        });
        this.weightlabel.attr({
          x: x,
          y: y+10
        });
      }
      else if (this.viselement){
        this.viselement.animate({
          cx: x,
          cy: y,
          fill: color
        },100);
        this.label.animate({
          x: x,
          y: y-10
        }, 100);
        this.weightlabel.animate({
          x: x,
          y: y+10
        }, 100);
      }
      else{
        if (this.visualization){
          this.viselement = this.visualization.canvas.circle(x, y, 25);
          this.viselement.attr("fill", color);
          this.viselement.attr("title", String(id));
          this.label = this.visualization.canvas.text(x,y-10, String(this.id()));
          this.label.attr("fill", "black");
          this.label.attr("font-size", 20);
          this.weightlabel = this.visualization.canvas.text(x,y+10, String(this.weight()));
          this.weightlabel.attr("fill", "black");
          this.weightlabel.attr("font-size", 15);
        }
      }
    };
    // send the visualization clear message
    this.visclear = function(){
      if (this.viselement){
        this.viselement.remove();
        this.label.remove();
        this.weightlabel.remove();
        this.viselement = undefined;
        this.label = undefined;
        this.weightlabel = undefined;
      }
    };

    // turns on and off drag events for the vertex
    this.drag = function(choice){
      if (this.viselement){
        if (choice){
          var that = this;
          this.viselement.drag(function(dx,dy,x,y,e){
            that.position(x,y,true);
          },function(){},function(){});
        }
        else {
          this.viselement.undrag();
        }
      }
    };
    // resets the vertex
    this.reset = function(){
      this.color("rgba(220,50,50)");
    };
  };

  // private edge constructor
  var edge = function(aid, av1, av2, aweight, aextra) {
    var id, endpoints, weight, extra, color;
    color = 'rgb(50,250,50)';
    this.visualization = undefined; // will store the visualization object
    this.viselement = undefined;
    this.weightlabel = undefined;
    // set this vertex's information
    if (aid === undefined || av1 === undefined || av2 === undefined){
      throw new Error("edge object requires an id and two endpoint vertices");
    }
    else {
      id = aid;
      endpoints = [av1,av2];
    }
    if (aweight === undefined){
      weight = 0;
    }
    else {
      weight = aweight;
    }
    if (aextra === undefined){
      extra = {};
    }
    else {
      extra = aextra;
    }
    // returns the id
    this.id = function(){
      return id;
    };
    // getter and setter of weight
    this.weight = function(aweight){
      if (aweight === undefined) {return weight;}
      weight = aweight;
      return this;
    };
    // getter and setter of extra
    this.extra = function(aextra){
      if (aextra === undefined) return extra;
      extra = aextra;
      return this;
    };
    // get the endpoints of this edge
    // v1 and v2 are vertex objects
    this.endpoints = function(){
      return endpoints;
    };
    // getter and setter of color
    this.color = function(col){
      if (col === undefined) return color;
      color = col;
      this.draw(true);
      return this;
    };
    // send the draw message to the visualization
    this.draw = function(instant){
      var svert = this.endpoints()[0].position();
      var evert = this.endpoints()[1].position();
      var delx = evert.x-svert.x;
      var dely = evert.y-svert.y;
      var x = 25/Math.sqrt(1+(dely/delx)*(dely/delx));
      var y = Math.sqrt(625 - x*x);
      if (delx < 0){
        x = -x;
      }
      if (dely < 0){
        y = -y;
      }
      if (this.viselement && instant){
        this.viselement.attr({
          path: ["M", svert.x+x,svert.y+y,"L", evert.x-x,evert.y-y].join(","),
          stroke: this.color()
        });
        this.weightlabel.attr({
          x: svert.x+delx/2,
          y: svert.y+dely/2
        });
      }
      else if (this.viselement){
        this.viselement.animate({
          path: ["M", svert.x+x,svert.y+y,"L", evert.x-x,evert.y-y].join(","),
          stroke: this.color()
        },100);
        this.weightlabel.animate({
          x: svert.x+delx/2,
          y: svert.y+dely/2
        },100);
      }
      else {
        if (this.visualization){
          this.viselement = this.visualization.canvas.path(["M", svert.x+x,svert.y+y,"L", evert.x-x,evert.y-y].join(","));
          this.viselement.attr({stroke: this.color()});
          this.weightlabel = this.visualization.canvas.text(svert.x+delx/2,svert.y+dely/2,String(weight));
          this.weightlabel.attr("fill", "rgb(255,255,255)");
          this.weightlabel.attr("font-size", 12);
        }
      }
    };
    // send the visualization clear message
    this.visclear = function(){
      if (this.viselement){
        this.viselement.remove();
        this.viselement = undefined;
        this.weightlabel.remove();
        this.weightlabel = undefined;
      }
    };
    // resets the vertex
    this.reset = function(){
      this.color("rgb(50,250,50)");
    };
  };

  // the visualization object
  function visualization(aid, agraph, options) {
    if (aid === undefined || agraph === undefined){
      throw new Error("must input a valid id and graph");
    }
    var id = aid;
    var graph = agraph;
    graph.viz(this);
    /* TODO: must be a way to tie edge length to number of verts and width and height */
    var edgelength = 300;
    if (options && options.edgelength){
      edgelength = options.edgelength;
    }
    var k_c = edgelength*(6-3*(150/(3*edgelength))); // tying k_c to edge_length removes force overcorrection
    var k_h = k_c/Math.pow(edgelength,3);
    var width = 500, height = 500;
    if (options && options.width){
      width = options.width;
    }
    if (options && options.height){
      height = options.height;
    }

    // whether force direction is on or not
    this.fd = true;

    this.canvas = Raphael(id, width, height);
    // computes and redraws the graph with force direction for 100 iteration
    this.force_direction = function(){
      /* TODO: Make this not run all of the time and tie this to a user defined boolean */
      // There must also be a better way to update the fd other than set interval
      var that = this;
      setInterval(function(){
        if (that.fd){
          graph.draw();
        }
      }, 100);
      var id = setInterval(function(){
        if (that.fd){
          shift_centroid();
          fd_iter();
        }
      }, 15);
    };
    // one iteration of force_direction
    var fd_iter = function(){
      var edges = graph.edges();
      var verts = graph.vertices();
      // retrieve the force calculations
      var atrchange = atr_forces();
      var repchange = rep_forces();
      var v1,v2,v1p,v2p;
      // applying the atraction changes
      for (var id = 0; id < edges.length; id++){
        var endpts = edges[id].endpoints();
        v1 = endpts[0];
        v2 = endpts[1];
        v1p = v1.position();
        v2p = v2.position();
        v1.position(v1p.x + atrchange[id][0][0], v1p.y + atrchange[id][0][1],false);
        v2.position(v2p.x + atrchange[id][1][0], v2p.y + atrchange[id][1][1],false);
      }

      // applying repulsive forces
      for (var i = 0; i < verts.length; i++){
        v1 = verts[i];
        for (var j = i+1; j < verts.length; j++){
          v2 = verts[j];
          var d1 = repchange.shift();
          var d2 = repchange.shift();
          v1p = v1.position();
          v2p = v2.position();
          v1.position(v1p.x + d1[0], v1p.y + d1[1],false);
          v2.position(v2p.x + d2[0], v2p.y + d2[1],false);
        }
      }
    };
    // compute the attractive forces
    var atr_forces = function(){
      var edges = graph.edges();
      var atrchange = [];
      var delx,dely,v1p,v2p,d,change1,change2;

      //attractive edge force (need to use the edge information here)
      for(var id=0; id < edges.length; id++){
        var endpoints = edges[id].endpoints();
        v1p = endpoints[0].position();
        v2p = endpoints[1].position();
        change1 = [0,0];
        change2 = [0,0];
        delx = (v2p.x-v1p.x);
        if (delx === 0) delx += 1;
        dely = (v2p.y-v1p.y);
        if (dely === 0) dely += 1;
        d = Math.sqrt(delx*delx+dely*dely + 100.0);
        change1[0] = delx*k_h*d;
        change1[1] = dely*k_h*d;
        change2[0] = -delx*k_h*d;
        change2[1] = -dely*k_h*d;
        atrchange.push([change1,change2]);
      }
      return atrchange;
    };
    // compute the repulsive forces
    var rep_forces = function(){
      var verts = graph.vertices();
      var repchange = [];
      // repulsive force here
      for (var i = 0; i < verts.length; i++){
        v1p = verts[i].position();
        for (j = i+1; j < verts.length; j++){
          v2p = verts[j].position();
          change1 = [0,0];
          change2 = [0,0];
          delx = (v2p.x-v1p.x);
          if (delx === 0) delx += 1;
          dely = (v2p.y-v1p.y);
          if (dely === 0) dely += 1;
          var dist = Math.sqrt(delx*delx+dely*dely + 100.0);
          change1[0] = -delx*k_c/dist/dist + delx*k_h/3*dist;
          change1[1] = -dely*k_c/dist/dist + dely*k_h/3*dist;
          change2[0] = delx*k_c/dist/dist - delx*k_h/3*dist;
          change2[1] = dely*k_c/dist/dist - dely*k_h/3*dist;
          repchange.push(change1);
          repchange.push(change2);
        }
      }
      return repchange;
    };
    // shift the centroid of the graph to the centroid of the canvas
    var shift_centroid = function(){
      var verts = graph.vertices();
      var repchange = [],vp;
      // compute centroid of vertices
      var centroid = [0,0];
      for (var v=0; v < verts.length; v++){
        vp = verts[v].position();
        centroid[0] += vp.x;
        centroid[1] += vp.y;
      }
      centroid[0] = centroid[0]/verts.length;
      centroid[1] = centroid[1]/verts.length;
      var xdiff = centroid[0] - width/2;
      var ydiff = centroid[1] - height/2;

      // translate be centroid of vertices (this should not)
      for (v = 0; v < verts.length; v++){
        vp = verts[v].position();
        verts[v].position(vp.x - xdiff, vp.y - ydiff,false);
      }
    };

    // toggle between fd and draggability
    // option must be either 'drag' or 'fd'
    this.mode = function(option){
      if (option === 'fd'){
        this.fd = true;
        graph.drag(false);
      }
      else if (option === 'drag'){
        this.fd = false;
        graph.drag(true);
      }
    };
  }

  var util = (function() {
    var disjoint_set = function(size){
      var sets = [];
      for (var i = 0; i < size; ++i) {
        sets.push(-1);
      }

      this.find = function(n){
        if (sets[n] < 0){
          return n;
        } else {
          return (sets[n] = this.find(sets[n]));
        }
      };

      this.setunion = function(first, second) {
        var r1 = this.find(first);
        var r2 = this.find(second);
        sets[r1] = r2;
      };
    };

    return {
      disjoint_set: function(size){
        return new disjoint_set(size);
      }
    };
  })();

  // some sample algorithms
  var alg = {
    // returns a list of the names all of the algorithms
    all: function(){
      return [
        'kruskalMST',
        'BFS',
        'DFS'
      ];
    },
    animate: function(func,i,component,animaterate){
      if (animaterate === undefined) {
        animaterate = 1000;
      }
      window.setTimeout(function(){
        func(component);
      }, (i+1)*animaterate);
    },
    kruskalMST: function(graph, edgefun, edgefun2){
      if (edgefun === undefined){
        edgefun = function(e){
          e.color("rgb(30,30,200)");
        };
      }
      if (edgefun2 === undefined){
        edgefun2 = function(e){
          e.color("rgb(200,0,0)");
        };
      }
      var MST = [];
      var weight = 0;
      var verts = graph.vertices();
      var set = {};
      var dsets = util.disjoint_set(verts.length);
      // sort the edges from lowest weight to highest weight
      var edges = graph.edges(function(a,b){
        return a.weight()-b.weight();
      });
      for (var i = 0; i < verts.length; i++){
        set[verts[i].id()] = i;
      }
      for (i = 0; i < edges.length; i++){
        var endpoints = edges[i].endpoints();
        var start = endpoints[0].id();
        var end = endpoints[1].id();
        if (dsets.find(start) !== dsets.find(end)){
          MST.push(edges[i]);
          this.animate(edgefun,i,edges[i]);
          weight += graph.edge(start, end).weight();
          dsets.setunion(start, end);
        } else{
          this.animate(edgefun2,i,edges[i]);
        }
      }
      return {MST: MST, weight: weight};
    },
    // the abstract search function
    // orderingStucture must have add, size, and remove functions
    search: function(graph, orderingStructure, start, target, colorfun){
      if (colorfun === undefined) {
        colorfun = function(c){
          c.color("rgb(30,30,200)");
        };
      }
      var reached = {};
      orderingStructure.add(start);
      var order = [];
      var steps = 0;
      while (orderingStructure.size() > 0){
        steps++;
        var current = orderingStructure.remove();
        reached[current] = true;
        this.animate(colorfun, steps, graph.vertex(current), 500);
        if (current === target){
          return {vertex: graph.vertex(current), order: order};
        }
        var neighbors = graph.vertex(current).neighbors();
        order.push(current);
        // add unreached neighbors
        for (var i = 0; i < neighbors.length; i++){
          if (!(neighbors[i].id() in reached || orderingStructure.exists(neighbors[i].id()))){
            orderingStructure.add(neighbors[i].id());
          }
        }
      }
      return false; // not connected
    },
    // BFS Search
    BFS: function(graph, start, target){
      var orderingStructure = function(){
        var verts = [];
        this.add = function(v){
          console.log(verts);
          verts.push(v);
        };
        this.remove =  function(){
          console.log(verts);
          return verts.shift();
        };
        this.size = function(){
          return verts.length;
        };
        this.exists = function(v){
          return verts.indexOf(v) != -1;
        };
      };
      return this.search(graph, new orderingStructure(), start, target);
    },
    // DFS Search
    DFS: function(graph, start, target){
      var orderingStructure = function(){
        var verts = [];
        this.add = function(v){
          verts.push(v);
        };
        this.remove =  function(){
          return verts.pop();
        };
        this.size = function(){
          return verts.length;
        };
        this.exists = function(v){
          return verts.indexOf(v) != -1;
        };
      };
      return this.search(graph, new orderingStructure(), start, target);
    }
  };

  // the visualizations for a graph
  var viz = {
    // binds a graph to a visualization in a div and creates the visualization
    bind: function(id, graph, options){
      var v = new visualization(id,graph,options);
      if (options.fd === false){
        v.mode('drag');
      } else {
        v.mode('fd');
      }
      graph.draw();
      v.force_direction();
      return v;
    }
  };

  // return the public methods
  return {
    // returns a new empty graph
    graph: {
      graph :function(){
        return new graph();
      },
      // returns a new digraph
      digraph: function(){
        return new digraph();
      }
    },
    // provides algorithm functionality
    alg: alg,
    viz: viz
  };

})();
