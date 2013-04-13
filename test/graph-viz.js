var edge = new Path()
    .stroke('rgba(0,0,220,0.8)', 4)
    .moveTo(50,50)
    .lineTo(200,50)
    .addTo(stage);

var v = new Circle(50, 50, 25)
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
        redrawEdge(edge, e.x, e.y, 200,50);
    })
    .on("multi:pointerup", function(e){
        this.animate( '300ms', {
            fillColor: 'rgba(220,0,0,0.3)'
        });
    })
    .addTo(stage);

var u = new Circle(200, 50, 25)
    .stroke('rgb(0,220,0)', 2)
    .fill('rgba(0,220,0,0.3)')
    .on("multi:drag", function(e){
        this.animate( '300ms', {
            fillColor: 'rgba(0,220,0,0.6)'
        });
        this.attr({
            x: e.x,
            y: e.y
        });
    })
    .on("multi:pointerup", function(e){
        this.animate( '300ms', {
            fillColor: 'rgba(0,220,0,0.3)'
        });
    })
    .addTo(stage);

function redrawEdge(edge,sx,sy,ex,ey){
    edge.clear().moveTo(sx,sy).lineTo(ex,ey).addTo(stage);
}