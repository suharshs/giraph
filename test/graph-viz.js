var v = new Circle(51, 51, 50)
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
    })
    .on("multi:pointerup", function(e){
        this.animate( '300ms', {
            fillColor: 'rgba(220,0,0,0.3)'
        });
    })
    .addTo(stage);