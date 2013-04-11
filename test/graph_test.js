// Test suite for the graph editing functions

// tests the blank constructor
test("constructor", function(){
    var g = giraph.graph.graph();
    ok(g.order() === 0, "empty set of vertices");
    ok(g.size() === 0, "empty set of edges");
});

// tests if adding a vertex working correctly
test("add_vertex", function(){
    var g = giraph.graph.graph();
    g.add_vertex(1, 2, 3);
    ok(g.vertex(1).id() === 1, "id set correctly");
    ok(g.vertex(1).weight() === 2, "weight set correctly");
    ok(g.vertex(1).extra() === 3, "extra set correctly");
});

// tests if edges are added correctly
test("add_edge", function(){
    var g = giraph.graph.graph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    ok(g.edge(1,2).weight() === 3, "edge was added");
    ok(g.vertex(1).is_neighbor(2) !== undefined, "vertex updated");
});

// tests if vertices are removed correctly
test("remove_vertex", function(){
    var g = giraph.graph.graph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    g.remove_vertex(2, 2, 2);
    ok(!g.edge(1,2), "edge was removed");
    ok(!g.vertex(1).is_neighbor(2), "vertex updated");
});

// tests if edges are removed correctly
test("remove_edge", function(){
    var g = giraph.graph.graph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    g.remove_edge(1,2);
    ok(!g.edge(1,2), "edge was removed");
    ok(!g.vertex(1).is_neighbor(2), "vertex updated");
    ok(!g.vertex(2).is_neighbor(1), "vertex updated");
});

// tests the blank constructor
test("directed constructor", function(){
    var g = giraph.graph.digraph();
    ok(g.order() === 0, "empty set of vertices");
    ok(g.size() === 0, "empty set of edges");
});

// tests if adding a vertex working correctly
test("directed add_vertex", function(){
    var g = giraph.graph.digraph();
    g.add_vertex(1, 2, 3);
    ok(g.vertex(1).id() === 1, "id set correctly");
    ok(g.vertex(1).weight() === 2, "weight set correctly");
    ok(g.vertex(1).extra() === 3, "extra set correctly");
});

// tests if edges are added correctly
test("directed add_edge", function(){
    var g = giraph.graph.digraph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    ok(g.edge(1,2).weight() === 3, "edge was added");
    ok(g.vertex(2).in_neighbors()[0] === "1", "edge was added");
    ok(g.vertex(2).neighbors().length === 0, "no out neighbors for 2");
    ok(g.vertex(1).is_neighbor(2) !== undefined, "vertex updated");
});

// tests if vertices are removed correctly
test("directed remove_vertex", function(){
    var g = giraph.graph.graph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    g.remove_vertex(2, 2, 2);
    ok(!g.edge(1,2), "edge was removed");
    ok(!g.vertex(1).is_neighbor(2), "vertex updated");
});

// tests if edges are removed correctly
test("directed remove_edge", function(){
    var g = giraph.graph.graph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    g.remove_edge(1,2);
    ok(!g.edge(1,2), "edge was removed");
    ok(!g.vertex(1).is_neighbor(2), "vertex updated");
    ok(!g.vertex(2).is_in_neighbor(1), "vertex updated");
});