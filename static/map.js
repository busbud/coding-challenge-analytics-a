var WINDOW_WIDTH = window.innerWidth * 0.8;
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
  headerFontFamily: "sans-serif",
  hintFontHeight: 8,
  hintFontFamily: "sans-serif",
  hintFontStyle: "italic"
};

var ZOOM_MINMAX = [1, 8];

var projection = d3.geo.mercator()
     .translate([WINDOW_WIDTH/2, WINDOW_HEIGHT/2])
     // .scale(WINDOW_WIDTH / 2 / Math.PI);
     .scale(getMapWidth() / 2 / Math.PI);

var zoom = d3.behavior.zoom()
    .scaleExtent(ZOOM_MINMAX)
    .on("zoom", move);
     
var path = d3.geo.path().projection(projection);

var svg = d3.select("div.column#content").append("svg")
     .attr("width", function() {
      return getMapWidth();
     })
     .attr("height", WINDOW_HEIGHT)
     .attr("transform", "translate(" + WINDOW_WIDTH / 2 + "," + WINDOW_HEIGHT / 2 + ")")
     .call(zoom);
     
var country_g = svg.append("g");

d3.select(window).on("resize", sizeChange);


d3.json("static/data/ne-countries-110m.json", function(error, world) {

  countries = country_g.selectAll("path")
      .data(world.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", COUNTRY_ATTR.fill)
      .attr("stroke", COUNTRY_ATTR.stroke);

  // countries.on("click", function(d, i) {
  //       removePopover();  // In case one already path.exists(path, callback);
  //       displayPopover(d, i, d3.event, svg);
  //       var countryCode = d.properties.iso_a2;
  //       sendData(countryCode);
  //     });

  countries.on("mouseover", function() {
        d3.select(this)
           .attr("fill", COUNTRY_ATTR.highlight);
      });

  countries.on("mouseout", function() {
        // console.log("Mousing out, setting timer");
        // setPopTimer();
        d3.select(this)
           .attr("fill", COUNTRY_ATTR.fill);
      });
});


// function removePopover() {
//   d3.selectAll("g.popover")
//      .transition()
//      .attr("transform", "translate(" + WINDOW_WIDTH + ", 0)")
//      .remove();
// }


// function displayPopover(d, i, mouseEvent, target) {
//   var popover = target.append("g")
//       .attr("class", "popover");

//   var popInitPos = popover.attr("transform", "translate(" + WINDOW_WIDTH + ", 0)");

//   var popRect = popover.append("rect")
//       .attr("fill", "white")
//       .attr("stroke", "blue")
//       .attr("x", 0)
//       .attr("y", 0)
//       .attr("width", POP_ATTR.width)
//       .attr("height", POP_ATTR.height)
//       .on("mouseover", function() {
//         console.log("Mousing over popover, clearing timeout");
//         window.clearTimeout(popTimer);
//       })
//       .on("mouseout", removePopover);

//   var popTrans = popover.transition()
//       .attr("transform", "translate(" + event.pageX + ", " + event.pageY + ")");
// }


function sendData(countryCode) {
  var XHR = new XMLHttpRequest();
  XHR.open('POST', document.URL + 'country-data');
  var FD = new FormData();
  FD.append("country", countryCode);
  XHR.addEventListener('load', function() {
    var popText = JSON.parse(this.responseText);
    setPopoverText(popText);
  });
  XHR.send(FD);   
}


function setPopoverText(response) {
  var pop_g = d3.selectAll("g.popover");

  pop_g.append("g")
      .attr("class", "popover text");
  
  pop_g.append("g")
      .attr("transform", "translate(" + POP_ATTR.xInset + "," + (POP_ATTR.yInset + POP_ATTR.bodyFontHeight) + ")")
      .append("text")
      .attr("font-size", POP_ATTR.headerFontHeight)
      .style("font-family", POP_ATTR.headerFontFamily)
      .style("font-weight", POP_ATTR.headerFontWeight)
      .text(response.country_name);

  pop_g.append("g")
        .attr("transform", "translate(" + POP_ATTR.xInset + "," + (POP_ATTR.yInset + POP_ATTR.bodyFontHeight * 2) + ")")
        .append("text")
        .attr("font-size", POP_ATTR.hintFontHeight)
        .style("font-family", POP_ATTR.hintFontFamily)
        .style("font-style", POP_ATTR.hintFontStyle)
        .text("(Double-click country for detail)");

  pop_g.append("g")
      .attr("transform", "translate(" + POP_ATTR.xInset + "," + (POP_ATTR.height - POP_ATTR.yInset) + ")")
      .append("text")
      .attr("font-size", POP_ATTR.bodyFontHeight)
      .style("font-family", POP_ATTR.bodyFontFamily)
      .text("Cities with pop. > 15K: " + response.cities_over_15k);
}

function move() {
    var t = d3.event.translate;
    var s = d3.event.scale;
    t[0] = Math.min(WINDOW_WIDTH / 2 * (s - 1), Math.max(WINDOW_WIDTH / 2 * (1 - s), t[0]));
    t[1] = Math.min(WINDOW_HEIGHT / 2 * (s - 1) + 230 * s, Math.max(WINDOW_HEIGHT / 2 * (1 - s) - 230 * s, t[1]));
    zoom.translate(t);
    country_g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}

function sizeChange() {
  console.log("inside sizeChange");
  var width = getMapWidth();
  svg.attr("width", width);
  projection.scale(width / 2 / Math.PI);

  // d3.select("g").attr("transform", "scale(" + $("#container").width()/900 + ")");
  //     $("svg").height($("#container").width()*0.618);

  countries.attr("d", path);
}

function getMapWidth() {
  var windowWidth = parseInt(window.innerWidth);
  var sidebarWidth = parseInt(d3.select("div.column#sidebar").style("width"));
  console.log("windowWidth: " + windowWidth + " sidebarWidth: " + sidebarWidth);
  return windowWidth - sidebarWidth;
} 

