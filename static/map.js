var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHeight;

var GOLDEN = 1.618;

var COUNTRY_ATTR = {
  fill: "#444",
  stroke: "#FFF",
  highlight: "#999"
};

var POP_WIDTH = 200;

var POP_ATTR = {
  width: POP_WIDTH,
  height: Math.floor(POP_WIDTH / GOLDEN),
  xInset: 15,
  yInset: 15,
  bodyFontHeight: 10,
  bodyFontFamily: "sans-serif",
  headerFontHeight: 13,
  headerFontWeight: "bold",
  headerFontFamily: "sans-serif"
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
        var selection = d3.selectAll("g.popover");
        if (selection .empty()) {
                displayPopover(d, i, d3.event);
                sendData(d.properties.iso_a2);
              }
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

    var popTrans = popover.transition()
        .attr("transform", "translate(" + event.pageX + ", " + event.pageY + ")");
  };

  var sendData = function(countryCode) {
    var XHR = new XMLHttpRequest();
    XHR.open('POST', document.URL + 'country-data');
    var FD = new FormData();
    FD.append("country", countryCode);
    XHR.addEventListener('load', function() {
      var popText = JSON.parse(this.responseText);
      setPopoverText(popText);
    });
    console.log(XHR);
    XHR.send(FD);   
  };

  var setPopoverText = function(response) {
    var popoverTextGroup = d3.select("g.popover")
        .append("g")
        .attr("class", "popover text");

    popoverTextGroup.append("g")
        .attr("transform", "translate(" + POP_ATTR.xInset + "," + (POP_ATTR.yInset + POP_ATTR.bodyFontHeight) + ")")
        .append("text")
        .attr("font-size", POP_ATTR.headerFontHeight)
        .style("font-family", POP_ATTR.headerFontFamily)
        .style("font-weight", POP_ATTR.headerFontWeight)
        .text(response.country_name);

    popoverTextGroup.append("g")
        .attr("transform", "translate(" + POP_ATTR.xInset + "," + (POP_ATTR.height - POP_ATTR.yInset) + ")")
        .append("text")
        .attr("font-size", POP_ATTR.bodyFontHeight)
        .style("font-family", POP_ATTR.bodyFontFamily)
        .text("Cities with pop. > 15K: " + response.cities_over_15k);
  };

  var zoom = d3.behavior.zoom()
      .scaleExtent([1, 8])
      .on("zoom",function() {
          country_g.attr("transform","translate("+ 
              d3.event.translate.join(",")+")scale("+d3.event.scale+")");
          country_g.selectAll("path")  
              .attr("d", path.projection(projection)); 
  });

  var throttleTimer;
  var throttle = function() {
    window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
  };

svg.call(zoom);
});
