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
var pop_g = svg.append("g");

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

d3.select(window).on("resize", sizeChange);

var names;
getCountryNames();

d3.json("static/data/ne-countries-110m.json", function(error, world) {

  country = country_g
      .selectAll("path")
      .data(world.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", COUNTRY_ATTR.fill)
      .attr("stroke", COUNTRY_ATTR.stroke);

  country
      .on("mouseenter", function(d, i) {
          var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

          tooltip.classed("hidden", false)
              .attr("style", "left:"+mouse[0]+"px;top:"+mouse[1]+"px")
              .html(d.properties.name);

          d3.select(this).attr("fill", COUNTRY_ATTR.highlight);
      })

      .on("mouseleave", function(d, i) {
        tooltip.classed("hidden", true);
        country.attr("fill", COUNTRY_ATTR.fill);
      })

      .on("click", function(d,i){
        fetchCountryData(d.iso_a2);
      });
}); 




// OR
// 
// Keep a single popover around
// Do the same as above only just update its country name
// On mouseout just set display to none / opacity to zero

function buildPopover() {
  pop_g.attr("class", "popover")
      .append("rect")
      .attr("width", POP_ATTR.width)
      .attr("height", POP_ATTR.height)
      .attr("fill", POP_ATTR.fill)
      .attr("stroke", POP_ATTR.stroke);
  pop_g.attr("opacity", 0);
}


function displayPopover(pos) {
  pop_g.attr("transform", "translate(" + pos[0] + "," + pos[1] + ")")
      .attr("opacity", 1);
}

function hidePopover() {
  pop_g.attr("opacity", 0);
}


function fetchCountryData(countryCode) {
  console.log(countryCode);
  var XHR = new XMLHttpRequest();
  XHR.open('POST', document.URL + 'country-data');
  var FD = new FormData();
  FD.append("country_code", countryCode);
  XHR.addEventListener('load', function() {
    var countryObj = JSON.parse(this.responseText);
    setSidebarText(countryObj);
  });
  XHR.send(FD);   
}

function setSidebarText(countryObj) {
  console.log(countryObj);
}

function getCountryNames() {
  var XHR = new XMLHttpRequest();
  XHR.open('GET', document.URL + 'names');
  XHR.addEventListener('load', function() {
    names = JSON.parse(this.responseText);
  });
  XHR.send();
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
  country.attr("d", path);
}

function getMapWidth() {
  var windowWidth = parseInt(window.innerWidth);
  var sidebarWidth = parseInt(d3.select("div.column#sidebar").style("width"));
  // console.log("windowWidth: " + windowWidth + " sidebarWidth: " + sidebarWidth);
  return windowWidth - sidebarWidth;
}

function getMapHeight() {
  return getMapWidth() * (1/MAP_RATIO);
}

