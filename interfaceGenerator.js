var graphCounter = 0;

var criteria = [{value:"likes", text: "Likes"},
                {value:"dislikes", text: "Dislikes"},
                {value:"comments", text: "Comments"},
                {value:"views", text: "Views"}];

var barTypes = [{value:"category", text: "Categories", onGraph: "Categories"},
                {value:"tags", text: "Tags", onGraph: "Tags"}];

var aggTypes = [{value:"count", text: "Video Counts", onGraph: "Number of Videos"},
                {value:"sum", text: "Totals", onGraph: "Total Number of"},
                {value:"average", text: "Averages", onGraph: "Average Number of"},
                {value:"max", text: "Maxs", onGraph: "Max Number of"}]

function genInterface(type, parent, allData){
  var className = "graph" + graphCounter;
  var container = parent.append('div')
    .attr("class", "container " + className);

  var menuContainer = container.append('div')
    .attr("class", "menuContainer " + className);
  var iContainer = menuContainer.append('div')
    .attr("class", "interfaceContainer " + className);
  var fContainer = menuContainer.append('div')
    .attr("class", "filterContainer " + className);
  var gContainer = container.append('div')
    .attr("class", "graphContainer " + className);

  switch(type){
    case "scatter":
      createScatterBox(gContainer, iContainer, fContainer, className);
      updateScatter(gContainer, className);
      break;
    case "bar":
      //cat/tags
      //kind
      //aggregation
      createBarBox(gContainer, iContainer, fContainer, className);
      updateBar(gContainer, className)
      break;
    case "line":
      createLineBox(gContainer, iContainer, fContainer, className);
      updateLine(gContainer, className)
      break;
  }
  graphCounter ++;
}

function createScatterBox(gContainer, iContainer, fContainer, className){
  var xDiv = iContainer.append("div").attr("class", "dropdownHolder");

  var xAxis = xDiv.append("text")
    .attr("class", "menuLabel")
    .text("X-Axis: ")

  var xDrop = xDiv.append("select")
    .attr("class", "scatter dropdown x custom-select " + className)
    .on("change", function(){updateScatter(gContainer, className);})

  xDrop.selectAll('option'+className)
    .data(criteria).enter()
    .append('option')
      .property("value", function(d){return d.value;})
      .text(function(d){return d.text;})
      .attr("selected", function(d){if(d.value=="views"){return "selected";}})

  var yDiv = iContainer.append("div").attr("class", "dropdownHolder");

  var yAxis = yDiv.append("text")
    .attr("class", "menuLabel")
    .text("Y-Axis: ")

  var yDrop = yDiv.append("select")
    .attr("class", "scatter dropdown y custom-select " + className)
    // .attr("float", "right")
    .on("change", function(){updateScatter(gContainer, className);})

  yDrop.selectAll('option'+className)
    .data(criteria).enter()
    .append('option')
      .property("value", function(d){return d.value;})
      .text(function(d){return d.text;})
      .attr("selected", function(d){if(d.value=="likes"){return "selected";}})

    var filterText = fContainer.append("text")
        .attr("class", "menuLabel")
        .html("Filter By </br>")

    var filterTags = fContainer.append("text")
      .attr("class", "menuLabel")
      .text("Tags: ")

    var tagInput = fContainer.append("input")
      .attr("class", "scatter input tags form-control " + className)
      .attr("autocomplete", "on")
      .on("change", function(){updateScatter(gContainer, className);})

    var filterCategory = fContainer.append("text")
      .attr("class", "menuLabel")
      .text("Categories: ")

    var categoryInput = fContainer.append("input")
      .attr("class", "scatter input category form-control " + className)
      .attr("autocomplete", "on")
      .on("change", function(){updateScatter(gContainer, className);})
}

function createBarBox(gContainer, iContainer, fContainer, className){

  //criteria
  var cDiv = iContainer.append("div").attr("class", "dropdownHolder");

  var criteriaLabel = cDiv.append("text")
    .attr("class", "menuLabel")
    .text("Criteria: ")

  var criteriaDrop = cDiv.append("select")
    .attr("class", "bar dropdown criteria custom-select " + className)
    .on("change", function(){updateBar(gContainer, className);})

  criteriaDrop.selectAll('option'+className)
    .data(criteria).enter()
    .append('option')
    .property("value", function(d){return d.value;})
    .text(function(d){return d.text;})
    .attr("selected", function(d){if(d.value=="likes"){return "selected";}})

  //display
  var dDiv = iContainer.append("div").attr("class", "dropdownHolder");

  var display = dDiv.append("text")
    .attr("class", "menuLabel")
    .text("Display By: ")

  var barTypeDrop = dDiv.append("select")
    .attr("class", "bar dropdown barType custom-select " + className)
    .on("change", function(){updateBar(gContainer, className);})

  barTypeDrop.selectAll('option'+className)
    .data(barTypes).enter()
    .append('option')
    .property("value", function(d){return d.value;})
    .text(function(d){return d.text;})
    .attr("selected", function(d){if(d.value=="likes"){return "selected";}})

  //display
  var vDiv = iContainer.append("div").attr("class", "dropdownHolder");

  var values = vDiv.append("text")
    .attr("class", "menuLabel")
    .text("Values: ")

  var aggTypeDrop = vDiv.append("select")
    .attr("class", "bar dropdown aggType custom-select " + className)
    .on("change", function(){updateBar(gContainer, className);})

  aggTypeDrop.selectAll('option'+className)
    .data(aggTypes).enter()
    .append('option')
    .property("value", function(d){return d.value;})
    .text(function(d){return d.text;})
    .attr("selected", function(d){if(d.value=="likes"){return "selected";}})

  var filterText = fContainer.append("text")
        .attr("class", "menuLabel")
        .html("Filter By </br>")

  var filterTags = fContainer.append("text")
    .attr("class", "menuLabel")
    .text("Tags: ")

  var tagInput = fContainer.append("input")
    .attr("class", "bar input tags form-control " + className)
    .attr("autocomplete", "on")
    .on("change", function(){updateBar(gContainer, className);})

  var filterCategory = fContainer.append("text")
    .attr("class", "menuLabel")
    .text("Categories: ")

  var categoryInput = fContainer.append("input")
    .attr("class", "bar input category form-control " + className)
    .attr("autocomplete", "on")
    .on("change", function(){updateBar(gContainer, className);})
}

function createLineBox(gContainer, iContainer, fContainer, className){
    var cDiv = iContainer.append("div").attr("class", "dropdownHolder");


    var criteriaLabel = cDiv.append("text")
      .attr("class", "menuLabel")
      .text("Criteria: ")

    var displayDrop = cDiv.append("select")
      .attr("class", "line dropdown display custom-select " + className)
      .on("change", function(){updateLine(gContainer, className);})

    displayDrop.selectAll('option'+className)
      .data(criteria).enter()
      .append('option')
        .property("value", function(d){return d.value;})
        .text(function(d){return d.text;})
        .attr("selected", function(d){if(d.value=="likes"){return "selected";}})

    var filterText = fContainer.append("text")
      .attr("class", "menuLabel")
      .html("Filter By </br>")

    var filterTags = fContainer.append("text")
      .attr("class", "menuLabel")
      .text("Tags: ")

    var tagInput = fContainer.append("input")
      .attr("class", "line input tags form-control " + className)
      .attr("autocomplete", "on")
      .on("change", function(){updateLine(gContainer, className);})

    var filterCategory = fContainer.append("text")
      .attr("class", "menuLabel")
      .text("Categories: ")

    var categoryInput = fContainer.append("input")
      .attr("class", "line input category form-control " + className)
      .attr("autocomplete", "on")
      .on("change", function(){updateLine(gContainer, className);})
}

function updateScatter(container, graphClass){
  container.selectAll("*").remove();
  var x = d3.select("select.x."+graphClass)._groups[0][0].value;
  var y = d3.select("select.y."+graphClass)._groups[0][0].value;
  var labels = scatterLabels(x, y);
  var info = genInfo(labels.x+" by "+labels.y, labels.x, labels.y);
  var inputFilters = {};
  var tagData = d3.select("input.tags."+graphClass)._groups[0][0].value;
  var categoryData = d3.select("input.category."+graphClass)._groups[0][0].value;
  if(!tagData==""){
    inputFilters.tags = tagData.split(" ");
  }
  inputFilters.category = categoryData.split(" ");
  var inputData = filterData(inputFilters, allData);
  var scatterArray = objectifyScatter(inputData, x, y);
  scatterPlot(500, 400, scatterArray, container, info);
}

function updateBar(container, graphClass){
  container.selectAll("*").remove();
  var barType = d3.select("select.barType."+graphClass)._groups[0][0].value;
  var subject = d3.select("select.criteria."+graphClass)._groups[0][0].value;
  var aggType = d3.select("select.aggType."+graphClass)._groups[0][0].value;
  var labels = barLabels(barType, subject, aggType);
  var title;
  if(labels.aggType == "Number of Videos"){
    title = labels.aggType+" by "+labels.barType;
  } else{
    title = labels.aggType+" "+labels.subject+" by "+labels.barType;
  }
  var info = genInfo(title, labels.barType, labels.subject);
  var inputFilters = {};
  var tagData = d3.select("input.tags."+graphClass)._groups[0][0].value;
  var categoryData = d3.select("input.category."+graphClass)._groups[0][0].value;
  if(!tagData==""){
    inputFilters.tags = tagData.split(" ");
  }
  inputFilters.category = categoryData.split(" ");
  var inputData = filterData(inputFilters, allData);
  // console.log(inputData);
  var barArray = objectifyBar(inputData, barType, aggType, subject);
  // console.log(barArray);
  barGraph(500, 400, barArray, container, info);
}

function updateLine(container, graphClass){
  container.selectAll("*").remove();
  var display = d3.select("select.display."+graphClass)._groups[0][0].value;
  var labels = lineLabels(display);
  var inputFilters = {};
  var tagData = d3.select("input.tags."+graphClass)._groups[0][0].value;
  var categoryData = d3.select("input.category."+graphClass)._groups[0][0].value;
  var title = labels.x + " by Date";
  var info = genInfo(title, "Dates", labels.x);
  if(!tagData==""){
    inputFilters.tags = tagData.split(" ");
  }
  inputFilters.category = categoryData.split(" ");
  var inputData = filterData(inputFilters, allData);
  var lineArray = objectifyLine(inputData, display);
  lineGraph(500, 400, lineArray, container, info);
}

function scatterLabels(x, y){
  var labels = {};
  for(i=0; i < criteria.length; i++){
    if(x==criteria[i].value){
      labels["x"] = criteria[i].text;
    }
    if(y==criteria[i].value){
      labels["y"] = criteria[i].text;
    }
  }
  return labels;
}

function barLabels(barType, subject, aggType){
  var labels = {};
  for(i=0; i < barTypes.length; i++){
    if(barType==barTypes[i].value){
      labels["barType"] = barTypes[i].onGraph;
    }
  }
  for(i=0; i < criteria.length; i++){
    if(subject==criteria[i].value){
      labels["subject"] = criteria[i].text;
    }
    if(aggType==aggTypes[i].value){
      labels["aggType"] = aggTypes[i].onGraph;
    }
  }
  return labels;
}

function lineLabels(x){
  var labels = {};
  for(i=0; i < criteria.length; i++){
    if(x==criteria[i].value){
      labels["x"] = criteria[i].text;
    }
  }
  return labels;
}
