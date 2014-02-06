var WINDOW_HEIGHT = window.innerHeight;

var MAP_RATIO = 1.0;

var COUNTRY_ATTR = {
  fill: "#444",
  stroke: "#FFF",
  highlight: "#999"
};

var POP_WIDTH = 200;

var POP_ATTR = {
  width: POP_WIDTH,
  height: Math.floor(POP_WIDTH / MAP_RATIO),
  xInset: 15,
  yInset: 15,
  fill: "#FFF",
  stroke: "#336699",
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
     .translate([getMapWidth()/2, getMapHeight()/2])
     .scale(getMapWidth() / 2 / Math.PI);

var zoom = d3.behavior.zoom()
    .scaleExtent(ZOOM_MINMAX)
    .on("zoom", move);
     
var path = d3.geo.path().projection(projection);

var svg = d3.select("div.column#content").append("svg")
     .attr("width", getMapWidth)
     .attr("height", getMapHeight)
     // .attr("transform", "translate(" + getMapWidth() / 2 + "," + getMapHeight() / 2 + ")")
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
        var pos = d3.mouse(this);
        console.log(pos);
        displayPopover(pos);
      });

  countries.on("mouseout", function() {
        // console.log("Mousing out, setting timer");
        // setPopTimer();
        d3.select(this)
           .attr("fill", COUNTRY_ATTR.fill);
      });
});

function displayPopover(pos) {
  svg.append("g")
      .attr("class", "popover")
      .attr("transform", "translate(" + pos[0] + "," + pos[1] + ")")
      .append("rect")
      .attr("width", POP_ATTR.width)
      .attr("height", POP_ATTR.height)
      .attr("fill", POP_ATTR.fill)
      .attr("stroke", POP_ATTR.stroke);
}


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
    var width = getMapWidth();
    var height = getMapHeight();
    t[0] = Math.min(width * (s - 1), Math.max(width * (1 - s), t[0]));
    t[1] = Math.min(height * (s - 1), Math.max(height * (1 - s), t[1]));
    zoom.translate(t);
    country_g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}

function sizeChange() {
  console.log("inside sizeChange");
  var width = getMapWidth();
  var height = getMapHeight();
  svg.attr("width", width);
  svg.attr("height", height);
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

function getMapHeight() {
  return getMapWidth() * (1/MAP_RATIO);
}

