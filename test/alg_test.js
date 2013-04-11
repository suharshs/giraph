// tests whether the implemented algorithms

// tests kruskal algorithm
test("kruskalMST", function(){
    var g = giraph.graph();
    g.add_vertex("A").add_vertex("B").add_vertex("C").add_vertex("D").add_vertex("E");
    g.add_edge("A", "B", 7).add_edge("A", "E", 5).add_edge("A", "D", 3)
    .add_edge("E", "B", 3).add_edge("C", "B", 4).add_edge("C", "D", 9);
    var MST = giraph.alg.kruskalMST(g);
    console.log(MST);
    ok(MST.weight === 15, "weight sum matches");
});

// tests BFS search
test("search", function(){
    var g = giraph.graph();
    g.add_vertex("A").add_vertex("B").add_vertex("C").add_vertex("D").add_vertex("E");
    g.add_edge("A", "B", 7).add_edge("A", "E", 5).add_edge("A", "D", 3)
    .add_edge("E", "B", 3).add_edge("C", "B", 4).add_edge("C", "D", 9);
    var BFS = giraph.alg.BFS(g, "A", "C");
    ok(BFS.order.length === 4, "order correct");
    ok(BFS.order[1] === "B", "order correct");
});

// tests DFS search
