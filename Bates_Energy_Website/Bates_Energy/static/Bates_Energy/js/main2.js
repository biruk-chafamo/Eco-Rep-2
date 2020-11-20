var dataset;
var startDate;
var endDate;
var maxQuantity;
var minQuantity;
var years = ['2017', '2018', '2019', '2020']
var buildings = ['select buildings',
                 'Adams',
                 'Bertram',
                 'Carnegie',
                 'Chapel',
                 'Chase',
                 'Cheney',
                 'Dana',
                 'Hathorn',
                 'LaddLibrary',
                 'Lane',
                 'Libbey',
                 'Olin',
                 'Page',
                 'Parker',
                 'Pettengill',
                 'Pettigrew',
                 'Rand',
                 'Rzasa',
                 'Schaeffer',
                 'Underhill',
                 'UnderhillIce'
                ];
// initial render
// upTimeBars(buildings[0]);

// Handler for dropdown value change


var graphChange = function() {
    var val;
    // get list of radio buttons with specified name
    var radios = d3.select('form').selectAll('input')[0];

    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    };
    if (val == 'years') {
        d3.select('#dropdown_buildings').style('display','none')
        d3.select('#dropdown_buildings_years').style('display','inline')
        d3.select('#dropdown_years').style('display','inline')
    };
    if (val == 'buildings') {
        d3.select('#dropdown_buildings').style('display','inline')
        d3.select('#dropdown_years').style('display','none')
        d3.select('#dropdown_buildings_years').style('display','none')
    };
}


var dropdownChangeBuildings = function() {

  var newBuildings = [];
  for (var building of d3.select('#dropdown_buildings').property("selectedOptions")){
        newBuildings.push(building.value)
    };
  var buildingNames = newBuildings.toString();
  var src = window.location.href+`processed_data/${buildingNames}`;
  d3.select("svg").remove();
  updateBars(src);
};

var dropdownChangeYears = function() {
  var buildingName = d3.select('#dropdown_buildings_years').property("selectedOptions")[0].value;
  var selectedYears = [];
  for (var year of d3.select('#dropdown_years').property("selectedOptions")){
        selectedYears.push(year.value)
    };
  var selectedYears = selectedYears.toString();
  var src = window.location.href+`processed_data/date,${buildingName+','+selectedYears}`;
  d3.select("svg").remove();
  updateBars(src);
};

var dropdown_buildings = d3
  .select('#vis-container')
  .insert('select', 'form')
  .attr('id', 'dropdown_buildings')
  .on('change', dropdownChangeBuildings);

d3.select('form')
.on('change', graphChange);

d3.select('#dropdown_buildings')
  .property("multiple",true)

d3.select('#dropdown_buildings')
  .selectAll('option')
  .data(buildings.slice(1,buildings.length))
  .enter()
  .append('option')
  .attr('value', function(d) {
    return d;
  })
  .text(function(d) {
    // return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
    return d;
  });

var dropdown_buildings_years = d3
  .select('#vis-container')
  .insert('select', 'form')
  .attr('id', 'dropdown_buildings_years');

d3.select('#dropdown_buildings_years')
  .selectAll('option')
  .data(buildings)
  .enter()
  .append('option')
  .attr('value', function(d) {
    return d;
  })
  .text(function(d) {
    // return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
    return d;
  });

d3.select('#dropdown_buildings_years')
.style('display','none');




var dropdown_years = d3
  .select('#vis-container')
  .insert('select', 'form')
  .attr('id', 'dropdown_years')
  .on('change', dropdownChangeYears);

d3.select('#dropdown_years')
  .selectAll('option')
  .data(years)
  .enter()
  .append('option')
  .attr('value', function(d) {
    return d;
  })
  .text(function(d) {
    // return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
    return d;
  });

d3.select('#dropdown_years')
.style('display','none')
.property('multiple', true);





function updateBars(src) {
var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var color = d3.scale.category10();

var parseDate = d3.time.format('%Y-%m-%d-%H-%M').parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brush);

var line = d3.svg.line()
    .defined(function(d) { return !isNaN(d.Quantity); })
    .interpolate("cubic")
    .x(function(d) { return x(d.Time); })
    .y(function(d) { return y(d.Quantity); });

var line2 = d3.svg.line()
    .defined(function(d) { return !isNaN(d.Quantity); })
    .interpolate("cubic")
    .x(function(d) {return x2(d.Time); })
    .y(function(d) {return y2(d.Quantity); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv(src, function(error, data) {

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Time"; }));

    data.forEach(function(d) {
      d.Time = parseDate(d.Time);
    });

  var sources = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {Time: d.Time, Quantity: +d[name]};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.Time; }));
    y.domain([d3.min(sources, function(c) { return d3.min(c.values, function(v) { return v.Quantity; }); }),
              d3.max(sources, function(c) { return d3.max(c.values, function(v) { return v.Quantity; }); }) ]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    var focuslineGroups = focus.selectAll("g")
        .data(sources)
      .enter().append("g");

    var focuslines = focuslineGroups.append("path")
        .attr("class","line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) {return color(d.name);})
        .attr("clip-path", "url(#clip)");

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var contextlineGroups = context.selectAll("g")
        .data(sources)
      .enter().append("g");

    var contextLines = contextlineGroups.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line2(d.values); })
        .style("stroke", function(d) {return color(d.name);})
        .attr("clip-path", "url(#clip)");

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

//   legend = svg.append("g")
//  .attr("class","legend")
//  .attr("transform","translate(50,30)")
//  .style("font-size","12px")
//  .call(d3.legend)


});

function brush() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.selectAll("path.line").attr("d",  function(d) {return line(d.values)});
  focus.select(".x.axis").call(xAxis);
  focus.select(".y.axis").call(yAxis);
}
}