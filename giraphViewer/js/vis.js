/*
Contains the binding for the buttons and the manipulation of the graph
*/

var graph, vis;

var vertid = 0;

var fd = false;
var addv = false;
var adde = false;

// When the document is ready, create the empty graph
$(document).ready(function(){
    graph = giraph.graph.graph();
    vis = giraph.viz.bind("graph-pane",graph,{
        fd: false,
        width: window.innerWidth,
        height: window.innerHeight
    });

    // toggle the force direction
    $('#fd').click(function(e){
        e.preventDefault();
        fd = !fd;
        if (fd){
            $("#fd").removeClass("btn-danger");
            $("#fd").addClass("btn-success");
            vis.mode('fd');
        }
        else{
            $("#fd").removeClass("btn-success");
            $("#fd").addClass("btn-danger");
            vis.mode('drag');
        }
    });

    // toggle the adding vertex action
    $('#addvertex').click(function(e){
        e.preventDefault();
        addv = !addv;
        if (addv){
            // unselect adding an edge
            adde = !adde;
            $("#addedge").removeClass("btn-success");
            $("#addedge").addClass("btn-danger");
            startvertex = endvertex = undefined;
            $('circle').off('click');

            $("#addvertex").removeClass("btn-danger");
            $("#addvertex").addClass("btn-success");
            // now bind button click functions on the svg
            $("#graph-pane > svg").click(function(e){
                e.preventDefault();
                graph.add_vertex(vertid);
                // ensure verts don't get placed on top of each other
                graph.vertex(vertid).position(e.pageX, e.pageY);
                vertid++;
            });
        }
        else{
            $("#addvertex").removeClass("btn-success");
            $("#addvertex").addClass("btn-danger");
            $("#graph-pane > svg").off('click');
        }
    });

    var startvertex, endvertex;

    // toggle the adding edge action
    $('#addedge').click(function(e){
        e.preventDefault();
        adde = !adde;
        if (adde){
            // unselect adding a vertex
            addv = !addv;
            $("#addvertex").removeClass("btn-success");
            $("#addvertex").addClass("btn-danger");
            $("#graph-pane > svg").off('click');

            $("#addedge").removeClass("btn-danger");
            $("#addedge").addClass("btn-success");
            $('circle').click(function(e){
                if (startvertex === undefined){
                    startvertex = $(this).parent().attr("title");
                }
                else {
                    endvertex = $(this).parent().attr("title");
                    // if the user creates a self loop disallow it
                    if (endvertex === startvertex){
                        endvertex = undefined;
                    }
                    if (endvertex !== undefined){
                        graph.add_edge(startvertex, endvertex);
                        startvertex = endvertex = undefined;
                    }
                }
            });
        }
        else{
            $("#addedge").removeClass("btn-success");
            $("#addedge").addClass("btn-danger");
            startvertex = endvertex = undefined;
            $('circle').off('click');
        }
    });
});

