var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHeight;

var GOLDEN = 1.618;

var COUNTRY_ATTR = {
  fill: "#444",
  stroke: "#FFF",
  highlight: "#999"
};

var POP_WIDTH = 500;

var POP_ATTR = {
  width: POP_WIDTH,
  height: Math.floor(POP_WIDTH / GOLDEN),
  xInset: 15,
  yInset: 15
};

var svg = d3.select("body").append("svg")
     .attr("width", WINDOW_WIDTH)
     .attr("height", WINDOW_HEIGHT);

var projection = d3.geo.mercator()
     .translate([WINDOW_WIDTH/2, WINDOW_HEIGHT/2])
     .scale(500);

var path = d3.geo.path().projection(projection);

var country_g = svg.append("g");


d3.json("static/data/ne-countries-110m.json", function(error, world) {

  countries = country_g.selectAll("path")
      .data(world.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", COUNTRY_ATTR.fill)
      .attr("stroke", COUNTRY_ATTR.stroke)
      .on("click", function(d, i) {
        displayPopover(d, i, d3.event);
      })
      .on("mouseover", function() {
        d3.select(this)
           .attr("fill", COUNTRY_ATTR.highlight);
      })
      .on("mouseout", function() {
        d3.selectAll("g.popover")
           .transition()
           .attr("transform", "translate(" + WINDOW_WIDTH + ", 0)")
           .remove();
        d3.select(this)
           .attr("fill", COUNTRY_ATTR.fill);
      });


  var displayPopover = function(d, i, mouseEvent) {
    var popover = svg.append("g")
        .attr("class", "popover");

    var popInitPos = popover.attr("transform", "translate(" + WINDOW_WIDTH + ", 0)");

    var popRect = popover.append("rect")
        .attr("fill", "white")
        .attr("stroke", "blue")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", POP_ATTR.width)
        .attr("height", POP_ATTR.height);

    var popText = popover.append("text")
        .attr("x", POP_ATTR.xInset)
        .attr("y", POP_ATTR.yInset)
        .text(d.properties.iso_a2);

    var popTrans = popover.transition()
        .attr("transform", "translate(" + event.pageX + ", " + event.pageY + ")");
      // console.log(d.properties.iso_a2);
  };

  var zoom = d3.behavior.zoom()
      .on("zoom",function() {
          country_g.attr("transform","translate("+ 
              d3.event.translate.join(",")+")scale("+d3.event.scale+")");
          country_g.selectAll("path")  
              .attr("d", path.projection(projection)); 
  });

svg.call(zoom);
});
