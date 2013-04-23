/*
Contains the binding for the buttons and the manipulation of the graph
*/

var graph, vis;

var vertid = 0;

var fd = false;

// When the document is ready, create the empty graph
$(document).ready(function(){
    graph = giraph.graph.graph();
    vis = giraph.viz.bind("graph-pane",graph,{
        fd: false,
        width: window.innerWidth,
        height: window.innerHeight
    });

    // now bind button click functions on the svg
    $("#graph-pane").click(function(e){
        graph.add_vertex(vertid);
        graph.vertex(vertid).position(e.pageX, e.pageY);
        vertid++;
    });

    // toggle the force direction
    $('#fd').click(function(e){
        fd = !fd;
        if (fd){
            vis.mode('fd');
        }
        else{
            vis.mode('drag');
        }
    });
});