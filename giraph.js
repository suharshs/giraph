// giraph graph library

// library
giraph = (function(){
    var edge_id = 0;

    // private graph constructor
    var graph = function(){
        var vertices = {}; // map of vertices indexed by id
        var edges = {}; // map of edges indexed by id

        // methods
        // add a vertex
        this.add_vertex = function(id, weight, extra){
            // create the new vertex
            var v = new vertex(id, weight, extra);
            vertices[id] = v;
            return this;
        };
        // add an edge
        this.add_edge = function(v1, v2, weight, extra){
            // if one of the vertices doesn't exist
            if (!(v1 in vertices && v2 in vertices)){
                return; // gracefully exit without adding edge
            }
            // create the new edge
            var id = edge_id;
            edge_id++;
            var e = new edge(id, v1, v2, weight, extra);

            edges[id] = e;
            vertices[v1].neighbors[v2] = id;
            vertices[v2].neighbors[v1] = id;
            return this;
        };
        // remove an edge
        this.remove_edge = function(v1, v2){
            // if one of the vertices doesn't exist
            if (!(v1 in vertices && v2 in vertices)){
                return; // gracefully exit without removing edge
            }
            var id = vertices[v1].neighbors[v2];
            delete vertices[v1].neighbors[v2];
            delete vertices[v2].neighbors[v1];
            delete edges[id];
            return this;
        };
        // remove a vertex
        this.remove_vertex = function (v){
            if (!(v in vertices)){
                return; // gracefully exit
            }
            var neighbors = Object.keys(vertices[v].neighbors);
            for (var i = 0; i < neighbors.length; i++){
                delete edges[neighbors[i]];
                delete vertices[neighbors[i]].neighbors[v];
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
            return edges[vertices[v1].neighbors[v2]];
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
            var values = [];
            for (var key in vertices){
                values.push(vertices[key]);
            }
            // if the user want to sort the verts
            if (sortfn) values.sort(sortfn);
            // now get the ids
            for (var i = 0; i < values.length; i++){
                verts.push(values[i].id());
            }
            return verts;
        };
        // get the list of edge endpoints
        this.edges = function(sortfn){
            var values = [];
            for (var key in edges){
                values.push(edges[key]);
            }
            // if the user wants to sort the verts
            if (sortfn) values.sort(sortfn);
            var edge_keys = [];
            for (var i = 0; i < values.length; i++){
                console.log(values[i].weight());
                edge_keys.push(values[i].id());
            }
            var endpts = [];
            for (i = 0; i < edge_keys.length; i++){
                endpts.push(edges[edge_keys[i]].endpoints());
            }
            return endpts;
        };
    };

    // private vertex constructor
    var vertex = function(aid, aweight, aextra){
        var id, weight, extra;
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
        var neighbors = {}; // key neighbor, value edge index

        // returns the desired neighbor
        this.neighbor = function(v){
            if (!(v in neighbors)){
                return false; // gracefully exit
            }
            return neighbors[v];
        };

        // returns the ids for all of the neighbors
        this.neighbors = function(){
            return Object.keys(neighbors);
        };
        // returns the id
        this.id = function(){
            return id;
        };
        // getter and setter of weight
        this.weight = function(aweight){
            if (aweight === undefined) return weight;
            weight = aweight;
        };
        // getter and setter of extra
        this.extra = function(aextra){
            if (aextra === undefined) return extra;
            extra = aextra;
        };
    };

    // private edge constructor
    var edge = function(aid, av1, av2, aweight, aextra) {
        var id, endpoints, weight, extra;
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
            if (aweight === undefined) return weight;
            weight = aweight;
        };
        // getter and setter of extra
        this.extra = function(aextra){
            if (aextra === undefined) return extra;
            extra = aextra;
        };
        // get the endpoints of this edge
        this.endpoints = function(v1,v2){
            if (v1 === undefined || v2 === undefined) return endpoints;
            endpoints = [v1,v2];
        };
    };

    // some sample algorithms
    var alg = {
        kruskalMST: function(graph){
            var MST = [];
            var weight = 0;
            var verts = graph.vertices();
            console.log(verts);
            var set = {};
            // sort the edges from lowest weight to highest weight
            var edges = graph.edges(function(a,b){
                return a.weight()-b.weight();
            });
            console.log(edges);
            for (var i = 0; i < verts.length; i++){
                set[verts[i]] = i;
            }
            for (i = 0; i < edges.length; i++){
                var start = edges[i][0];
                var end = edges[i][1];
                // if we can add this edge without creating a cycle
                if (set[start] !== set[end]){
                    MST.push(edges[i]);
                    weight += graph.edge(start, end).weight();
                    var set_keys = Object.keys(set);
                    console.log(set_keys);
                    // update the disjoint sets
                    if (set[start] < set[end]){
                        for (var j = 0; j < set_keys.length; j++){
                            console.log(set[set_keys[j]],set[end]);
                            if (set[set_keys[j]] === set[end]){
                                set[set_keys[j]] = set[start];
                            }
                        }
                    }
                    else {
                        for (var k = 0; k < set_keys.length; k++){
                            if (set[set_keys[k]] === set[start]){
                                set[set_keys[k]] = set[end];
                            }
                        }
                    }
                    console.log(start, end, graph.edge(start, end).weight());
                    console.log("set", set);
                }
            }
            return {MST: MST, weight: weight};
        }
    };

    // return the public methods
    return {
        // returns a new empty graph
        graph: function(){
            return new graph();
        },
        // provides algorithm functionality
        alg: alg
    };

})();

