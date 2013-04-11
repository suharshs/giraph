// giraph graph library

// library
giraph = (function(){

    // private digraph constructor
    var digraph = function(){
        var edge_id = 0;
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
            // only add in this direction
            vertices[v1]._out_neighbors[v2] = id;
            vertices[v2]._in_neighbors[v1] = id;
            return this;
        };
        // remove an edge
        this.remove_edge = function(v1, v2){
            // if one of the vertices doesn't exist
            if (!(v1 in vertices && v2 in vertices)){
                return false; // gracefully exit without removing edge
            }
            var id = vertices[v1]._out_neighbors[v2];
            delete vertices[v1]._out_neighbors[v2];
            delete vertices[v2]._in_neighbors[v1];
            delete edges[id];
            return this;
        };
        // remove a vertex
        this.remove_vertex = function (v){
            if (!(v in vertices)){
                return false; // gracefully exit
            }
            // delete the in neighbors reference to v
            var neighbors = Object.keys(vertices[v]._in_neighbors);
            for (var i = 0; i < neighbors.length; i++){
                delete edges[neighbors[i]];
                delete vertices[neighbors[i]]._out_neighbors[v];
            }
            // delete the out neighbors reference to v
            neighbors = Object.keys(vertices[v]._out_neighbors);
            for (i = 0; i < neighbors.length; i++){
                delete edges[neighbors[i]];
                delete vertices[neighbors[i]]._in_neighbors[v];
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
            return edges[vertices[v1]._out_neighbors[v2]];
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
    };

    // private graph constructor
    var graph = function(){
        var edge_id = 0;
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
            // only add in this direction
            vertices[v1]._out_neighbors[v2] = id;
            vertices[v2]._out_neighbors[v1] = id;
            vertices[v2]._in_neighbors[v1] = id;
            vertices[v1]._in_neighbors[v2] = id;
            return this;
        };
        // remove an edge
        this.remove_edge = function(v1, v2){
            // if one of the vertices doesn't exist
            if (!(v1 in vertices && v2 in vertices)){
                return false; // gracefully exit without removing edge
            }
            var id = vertices[v1]._out_neighbors[v2];
            delete vertices[v1]._out_neighbors[v2];
            delete vertices[v2]._out_neighbors[v1];
            delete vertices[v1]._in_neighbors[v2];
            delete vertices[v2]._in_neighbors[v1];
            delete edges[id];
            return this;
        };
        // remove a vertex
        this.remove_vertex = function (v){
            if (!(v in vertices)){
                return false; // gracefully exit
            }
            // delete the in neighbors reference to v
            var neighbors = Object.keys(vertices[v]._in_neighbors);
            for (var i = 0; i < neighbors.length; i++){
                delete edges[neighbors[i]];
                delete vertices[neighbors[i]]._out_neighbors[v];
            }
            // delete the out neighbors reference to v
            neighbors = Object.keys(vertices[v]._out_neighbors);
            for (i = 0; i < neighbors.length; i++){
                delete edges[neighbors[i]];
                delete vertices[neighbors[i]]._in_neighbors[v];
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
            return edges[vertices[v1]._out_neighbors[v2]];
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
    };

    // private directed vertex constructor
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
        this._in_neighbors = {}; // key neighbor, value edge index
        this._out_neighbors = {}; // key neighbor, value edge index

        // returns the ids for all of the in_neighbors
        this.in_neighbors = function(){
            return Object.keys(this._in_neighbors);
        };
        // returns the ids for all of the out_neighbors
        this.neighbors = function(){
            return Object.keys(this._out_neighbors);
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
        // returns boolean if the vertex is a neighbor
        this.is_neighbor = function(v){
            return (this._out_neighbors[v] !== undefined);
        };
        // returns boolean if the vertex is a in_neighbor
        this.is_in_neighbor = function(v){
            return (this._in_neighbors[v] !== undefined);
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
            var set = {};
            // sort the edges from lowest weight to highest weight
            var edges = graph.edges(function(a,b){
                return a.weight()-b.weight();
            });
            for (var i = 0; i < verts.length; i++){
                set[verts[i].id()] = i;
            }
            for (i = 0; i < edges.length; i++){
                var endpoints = edges[i].endpoints();
                var start = endpoints[0];
                var end = endpoints[1];
                // if we can add this edge without creating a cycle
                if (set[start] !== set[end]){
                    MST.push(edges[i]);
                    weight += graph.edge(start, end).weight();
                    var set_keys = Object.keys(set);
                    // update the disjoint sets
                    if (set[start] < set[end]){
                        for (var j = 0; j < set_keys.length; j++){
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
                }
            }
            return {MST: MST, weight: weight};
        },
        // the abstract search function
        // orderingStucture must have add, size, and remove functions
        search: function(graph, orderingStructure, start, target){
            var reached = {};
            orderingStructure.add(start);
            var order = [];
            var steps = 0;
            while (orderingStructure.size() > 0){
                steps++;
                var current = orderingStructure.remove();
                reached[current] = true;
                if (current === target){
                    return {vertex: graph.vertex(current), order: order};
                }
                var neighbors = graph.vertex(current).neighbors();
                order.push(current);
                // add unreached neighbors
                for (var i = 0; i < neighbors.length; i++){
                    if (!(neighbors[i] in reached || orderingStructure.exists(neighbors[i]))){
                        orderingStructure.add(neighbors[i]);
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
                    verts.push(v);
                };
                this.remove =  function(){
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

