var numTicks = 10;


/* Graph info Data format:
{ title : string(title),
  axes : {
    x : string(x-axis label),
    y : string(y-axis label)
  }
}
*/
var defaultInfo = {
  title : "Would ya look at that",
  axes : {
    x : "X studd",
    y : "Y studd"
  }
}

function genInfo(title, x, y){
  var info = {
    title : title,
    axes : {
      x : x,
      y : y
    }
  }
  // console.log(info);
  return info;
}
/* Scatter Plot Data format:
{ id : string(video id),
  x : num(x value),
  y : num(y value) }
*/

function scatterPlot(width, height, data, parent, graphInfo){

  var tooltipDiv = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var margin = {top: 50, right: 5, bottom: 50, left: 50};
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;
  var svgGroup = genSVG(width, height, margin, parent);

  if(graphInfo == undefined){graphInfo = defaultInfo;}

  //X scale
  var xVals = data.map(function(d) { return parseInt(d.x); });
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(xVals)])
    .range([0, width]);

  //Y scale
  var yVals = data.map(function(d) { return parseInt(d.y); });
  var yScale = d3.scaleLinear()
    .domain([d3.min(yVals), d3.max(yVals)])
    .range([height, 0]);

  //axis
  var xAxis = d3.axisBottom().scale(xScale).ticks(numTicks)
    .tickFormat(d3.format(".2s"));
  var yAxis = d3.axisLeft().scale(yScale).ticks(numTicks)
    .tickFormat(d3.format(".2s"));

  svgGroup.append("g")
      .attr("class", "scatter x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svgGroup.append("g")
      .attr("class", "scatter y axis")
      .call(yAxis)

  //Labels
  addLabels(svgGroup, width, height, margin, graphInfo);

  //data
  var pointsGroup = svgGroup.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("class", "scatterPoint")
      .attr("cx", function(d){
        return xScale(d.x);})
      .attr("cy", function(d){
        return yScale(d.y);})
      .style('opacity', .8)
      .style("fill", function(d){ return cateogryColorScale(allData[d.id].category);})
      .attr("r", 3)
      .on("mouseover", function(d) {
        d3.select(this).style("stroke-width", "3px");
        d3.select(this).style("opactiy", "1");
         tooltipDiv.transition()
           .duration(200)
           .style("opacity", .9)
           .style("width", '100px')
           .style('position', 'absolute');
         tooltipDiv.html(allData[d.id]['title'])
           .style("left", (d3.event.pageX+5) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
         })
       .on("mouseout", function(d) {
         d3.select(this).style("stroke-width", "1px");
         d3.select(this).style("opactiy", ".8");
         tooltipDiv.transition()
           .duration(500)
           .style("opacity", 0);
         })
        .on('click',(d)=>{ window.open( 'https://www.youtube.com/watch?v='+d.id, '_blank')});

}
/* Bar Graph Data format:
{ label : string(video id),
  value : num(y value),
*/
function barGraph(width, height, data, parent, graphInfo){
  var tooltipDiv = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      var margin = {top: 50, right: 5, bottom: 100, left: 50};
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;
  var svgGroup = genSVG(width, height, margin, parent);

  if(graphInfo == undefined){graphInfo = defaultInfo;}

  //X scale
  var xScale = d3.scaleBand()
    .domain(data.map(function(d) { return d.label; }))
    .rangeRound([0, width], .1)
		.paddingInner(0.1);

  //Y scale
  var yVals = data.map(function(d) { return d.value; });
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(yVals)])
    .range([height, 0]);

  //Axis
  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale).ticks(numTicks)
    .tickFormat(d3.format(".2s"));


  let xG = svgGroup.append("g")
      .attr("class", "bar x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  xG.selectAll('text')
  .style("text-anchor", "end")
  .attr("transform", "rotate(-35, 5, 12)")

  svgGroup.append("g")
      .attr("class", "bar y axis")
      .call(yAxis);

  //Labels
  addLabels(svgGroup, width, height, margin, graphInfo);

  var barGroup = svgGroup.selectAll("rect.bar")
        .data(data)
      .enter().append("rect")
        .style('fill', (d,i)=>{return colorScale(i);})
        .attr("class", "bar")
        .attr("x", function(d){return xScale(d.label);})
        .attr("width", xScale.bandwidth())
        .attr("y", function(d){return yScale(d.value);})
        .attr("height", function(d) {return height - yScale(d.value);})
        .on("mouseover", function(d){
          d3.select(this).style("stroke-width", "1px");
          tooltipDiv.transition()
            .duration(200)
            .style("opacity", .9)
            .style("width", '100px')
            .style('position', 'absolute');
            // console.log(d);
          tooltipDiv.html(d.label)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 10) + "px");
        })
        .on("mouseout", function(d){
          d3.select(this).style("stroke-width", "0px");
          tooltipDiv.transition()
            .duration(500)
            .style("opacity", 0);
        });
}

/* Line Graph Data format:
{ label : string(video id),
  values : [{
    date : string,
    values :
  }],
*/
function lineGraph(width, height, data, parent, graphInfo){
  var tooltipDiv = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var margin = {top: 50, right: 5, bottom: 50, left: 50};
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;
  var svgGroup = genSVG(width, height, margin, parent);

  if(graphInfo == undefined){graphInfo = defaultInfo;}

  var parseTime = d3.timeParse("%Y-%m-%d");

  var combinedDates = [];
  var combinedValues = [];

  data.forEach(function(datum){
    datum.values.forEach(function(day){
      combinedDates.push(parseTime(day.date));
      combinedValues.push(parseInt(day.value));
    });
  });

  var xScale = d3.scaleTime().range([0, width])
    .domain(d3.extent(combinedDates));
  var yScale = d3.scaleLinear().range([height, 0])
    .domain([0, d3.max(combinedValues)]);
    var diff = (d3.max(combinedDates)-d3.min(combinedDates))/86400000;
    console.log("Time diff" + diff);
  var xAxis = d3.axisBottom().scale(xScale).ticks(d3.timeDay.every(Math.floor(diff/8)+1));
  var yAxis = d3.axisLeft().scale(yScale).ticks(numTicks)
    .tickFormat(d3.format(".2s"));

  var valueline = d3.line()
      .x(function(d) { return xScale(parseTime(d.date)); })
      .y(function(d) { return yScale(d.value); });

  var aVid = data[0];

  var dataWithIds = data.map(function(d){
    var vals = d.values;
    vals[0].id = d.id;
    return vals;
  });
  let i = -1;
  data.forEach(function(datum){
    var values = datum.values;
    svgGroup.append("path")
        .data([values])
        .attr("class", "line")
        .style('stroke', function(d){ return cateogryColorScale(allData[d[0].id].category);})
        .attr("d", valueline)
        .on("mouseover", function(d){
          d3.select(this).style("stroke-width", "4px");
          tooltipDiv.transition()
            .duration(200)
            .style("opacity", .9)
            .style("width", '100px')
            .style('position', 'absolute');
          tooltipDiv.html(allData[d[0].id].title)
            .style("left", (d3.event.pageX+5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d){
          d3.select(this).style("stroke-width", "2px");
          tooltipDiv.transition()
            .duration(500)
            .style("opacity", 0);
        })
        .on('click',function(d){ window.open( 'https://www.youtube.com/watch?v='+d[0].id, '_blank')});


  });


  addLabels(svgGroup, width, height, margin, graphInfo);

  var lX = svgGroup.append("g")
      .attr("class", "bar x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  lX.selectAll('text')
      .attr("transform", "rotate(-35, 5, 12)");
  svgGroup.append("g")
      .attr("class", "bar y axis")
      .call(yAxis);
}

function genSVG(width, height, margin, parent){
  // var margin = {top: 50, right: 50, bottom: 50, left: 50};
  // var parent = d3.select("body");

  var svg = parent.append("svg")
      .attr("class", "graph")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  svg.append("rect")
    .attr("class", "graphBorder")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right);



  var insideGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  insideGroup.append("rect")
    .attr("class", "graphBackground")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", height)
    .attr("width", width);


  return insideGroup;
}

function addLabels(svg, width, height, margin, info){
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (-margin.top+ 20) + ")")
      .style("text-anchor", "middle")
      .text(info.title);

  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.bottom - 5) + ")")
      .style("text-anchor", "middle")
      .text(info.axes.x);

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(info.axes.y);
}

const  addToolTip = function(d,i){
  const cir = d3.select(this);
  const svg = d3.select(this.parentNode);
}

function removeToolTip(){
  d3.selectAll('.toolTip').remove();
}
