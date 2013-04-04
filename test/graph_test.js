// Test suite for the graph editing functions

// tests the blank constructor
test("constructor", function(){
    var g = giraph.graph();
    ok(g.order() === 0, "empty set of vertices");
    ok(g.size() === 0, "empty set of edges");
});

// tests if adding a vertex working correctly
test("add_vertex", function(){
    var g = giraph.graph();
    g.add_vertex(1, 2, 3);
    ok(g.vertex(1).id() === 1, "id set correctly");
    ok(g.vertex(1).weight() === 2, "weight set correctly");
    ok(g.vertex(1).extra() === 3, "extra set correctly");
});

// tests if edges are added correctly
test("add_edge", function(){
    var g = giraph.graph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    ok(g.edge(1,2).weight() === 3, "edge was added");
    console.log(g.vertex(1).neighbor(2));
    ok(g.vertex(1).neighbor(2) !== undefined, "vertex updated");
});

// tests if vertices are removed correctly
test("remove_vertex", function(){
    var g = giraph.graph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    g.remove_vertex(2, 2, 2);
    ok(!g.edge(1,2), "edge was removed");
    ok(!g.vertex(1).neighbor(2), "vertex updated");
});

// tests if edges are removed correctly
test("remove_edge", function(){
    var g = giraph.graph();
    g.add_vertex(1, 1, 1);
    g.add_vertex(2, 2, 2);
    g.add_edge(1,2,3,4);
    g.remove_edge(1,2);
    ok(!g.edge(1,2), "edge was removed");
    ok(!g.vertex(1).neighbor(2), "vertex updated");
    ok(!g.vertex(2).neighbor(1), "vertex updated");
});