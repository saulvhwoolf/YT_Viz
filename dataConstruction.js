function objectifyScatter(videos, xVar, yVar){
  var keys = Object.keys(videos);

  var graphableObjects = [];

  keys.forEach(function(id){
    var thisVid = videos[id];
    graphableObjects.push({
      id : id,
      x : getters[xVar](thisVid),
      y : getters[yVar](thisVid)
    });
  });
  return graphableObjects;
}

function objectifyBar(videos, barType, aggregateType, valueType){
  var possibleLabels = uniqueLabels(videos)[barType];
  // console.log(possibleLabels);
  var fullList = [];
  var graphableObjects = [];
  var maxBar = 20;

  possibleLabels.forEach(function(d){
    var criterea = {};
    criterea[barType] = [d];
    // console.log(criterea);
    var subset = filterData(criterea, videos);
    if(Object.keys(subset).length > 0){
      fullList.push({
        label : d,
        value : aggregates[aggregateType](valueType, subset)
      })};
  });
  graphableObjects = sortArray(fullList, maxBar);

  return graphableObjects;
}

function objectifyLine(videos, valueType){
  if (valueType === 'comments'){
    valueType = 'comment_count';
  }
  var keys = Object.keys(videos);
  var firstVid = videos["sXP6vliZIHI"];

  var graphableObjects = [];
  for(var i = 0; i < keys.length; i ++)
  {
    var key = keys[i];
    var aVid = videos[key];
    var days = aVid.dates;
    var f = Object.keys(days).map(function(date){
      return { date : date, value : days[date][valueType]}
    });
    graphableObjects.push({
      id : key,
      values : f,
    });
  }
  return graphableObjects;
}
