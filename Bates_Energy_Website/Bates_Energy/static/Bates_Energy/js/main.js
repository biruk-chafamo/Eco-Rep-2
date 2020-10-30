var dataset;
var startDate;
var endDate;
var maxQuantity;
var minQuantity;
var buildings = ['Select building...',
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
// updateBars(buildings[0]);

// Handler for dropdown value change
var dropdownChange = function() {
  var newBuilding = d3.select(this).property('value'),
    newData = newBuilding;
  d3.select("svg").remove();
  updateBars(newData);
};

// Get names of cereals, for dropdown
// var buildings = Object.keys(buildingMap).sort();

var dropdown = d3
  .select('#vis-container')
  .insert('select', 'svg')
  .on('change', dropdownChange);

dropdown
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

function updateBars(name) {
  var src = window.location.href+`processed_data/${name}`;
//  window.location = window.location.href+`processed_data/${name}`
  d3.json(src, function(error, data) {
    if (error) throw error;

    var parseTime = d3.time.format('%Y-%m-%d-%H-%M').parse;

    data.forEach(function (d) {
      d.Time = parseTime(d.Time);
    });

    data.sort(function(a, b) {
      return a.Time - b.Time;
    });

    makeVis(data);
  });


  function makeVis(data) {
    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;

    // var parseDate = d3.time.format("%b %Y").parse;
    var parseTime = d3.time.format('%Y-%m-%d-%H-%M').parse;

    // //added for mousehover
    // var bisectDate = d3.bisector(function(d) { return d.Time; }).left,
    //     formatValue = d3.format(",.2f"),
    //     formatData = function(d) { return formatValue(d) + " kWh"; };
    // //

    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left");

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    var area = d3.svg.area()
        .interpolate("step-after")
        .x(function(d) { return x(d.Time); })
        .y0(height)
        .y1(function(d) { return y(d.Quantity); });

    var area2 = d3.svg.area()
        .interpolate("step-after")
        .x(function(d) { return x2(d.Time); })
        .y0(height2)
        .y1(function(d) { return y2(d.Quantity); });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var zoom = d3.behavior.zoom().scaleExtent([1,1000])
        .on("zoom", zoomed);

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    x.domain(d3.extent(data.map(function(d) { return d.Time; })));
    y.domain([0, d3.max(data.map(function(d) { return d.Quantity; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    zoom.x(x);

    focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", "none");

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    focus.call(zoom);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

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

    // ADD TIMEFRAME
    var timeframes = [
      {RangeStart: parseTime('2017-10-01-22-45'),RangeEnd: parseTime('2017-10-08-00-15'), Color: "red"},
      {RangeStart: parseTime('2017-12-03-22-45'),RangeEnd: parseTime('2017-12-17-00-15'), Color: "red"}
    ];

    if (name == 'Demo') {
      for (let i=0; i<timeframes.length; i++) {
        var timeframe = timeframes[i];
        context.append("rect")
            .attr("x", x(timeframe.RangeStart))
            .attr("y", 0)
            .attr("width", x(timeframe.RangeEnd) - x(timeframe.RangeStart))
            .attr("height", height2)
            .style("fill", timeframe.Color)
            .style("fill-opacity", 0.5);
      }
    }
    // END TIMEFRAME

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Energy (kWh)");

    //added for mousehover
    // var xy = svg.append("g")
    //     .attr("class", "xy")
    //     .style("display", "none");
    //
    // xy.append("circle")
    //         .attr("r", 4.5);
    //
    // xy.append("text")
    //         .attr("x", 9)
    //         .attr("dy", ".35em");
    //
    // svg.append("rect")
    //         .attr("class", "overlay")
    //         .attr("width", width)
    //         .attr("height", height)
    //         .style("fill", "none")
    //         .on("mouseover", function() { xy.style("display", null); })
    //         .on("mouseout", function() { xy.style("display", "none"); })
    //         .on("mousemove", mousemove);
    //
    // function mousemove() {
    //   // console.log('inside mousemove')
    //     var x0 = x.invert(d3.mouse(this)[0]),
    //             i = bisectDate(data, x0, 1),
    //             d0 = data[i - 1],
    //             d1 = data[i],
    //             d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //
    //     console.log(d.Time, d.Quantity);
    //
    //     xy.attr("transform", "translate(" + x(d.Time) + "," + y(d.Quantity) + ")");
    //     xy.select("text").text(formatData(d.Quantity));
    //
    // }
    //

    function brushed() {
      x.domain(brush.empty() ? x2.domain() : brush.extent());
      focus.select(".area").attr("d", area);
      focus.select(".x.axis").call(xAxis);
      var s = x.domain();
      var s_orig = x2.domain();
      var newS = (s_orig[1]-s_orig[0])/(s[1]-s[0]);
      var t = (s[0]-s_orig[0])/(s_orig[1]-s_orig[0]);
      var trans = width*newS*t;
      zoom.scale(newS);
      zoom.translate([-trans,0]);
    }

    function zoomed() {
      var t = 	d3.event.translate;
      var s = 	d3.event.scale;
      var size = width*s;
      t[0] = Math.min(t[0], 0);
      t[0] = Math.max(t[0], width-size);
      zoom.translate(t);
      focus.select(".area").attr("d", area);
      focus.select(".x.axis").call(xAxis);
      //Find extent of zoomed area, what's currently at edges of graphed region
      var brushExtent = [x.invert(0), x.invert(width)];
      context.select(".brush").call(brush.extent(brushExtent));
    }
  }
}
