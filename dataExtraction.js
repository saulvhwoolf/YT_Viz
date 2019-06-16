//Gets last day
function getDay(video){
  var dates = video["dates"];
  var dateKeys = Object.keys(dates);
  var lastDay = dates[dateKeys[dateKeys.length-1]];
  return lastDay;
}


function getLikes(video){
  return parseInt(getDay(video)["likes"]);
}

function getDislikes(video){
    return parseInt(getDay(video)["dislikes"]);
}

function getCommentCount(video){
    return parseInt(getDay(video)["comment_count"]);
}

function getViews(video){
    return parseInt(getDay(video)["views"]);
}

function getCategory(video){
    return parseInt(video["category"]);
}


var getters = {
  likes : getLikes,
  dislikes : getDislikes,
  comments : getCommentCount,
  views : getViews,
  // category : getCategory
}

function getAll(getterType, videos){
  var keys = Object.keys(videos);
  var mapped = keys.map(function(id) {
    return getters[getterType](videos[id]);
  });
  return mapped;
}

function getAverage(getterType, videos){
  return Math.floor(d3.mean(getAll(getterType, videos)));
}

function getSum(getterType, videos){
  return d3.sum(getAll(getterType, videos));
}

function getMax(getterType, videos){
  return d3.max(getAll(getterType, videos));
}

function getCount(type, videos){
  return getAll(type, videos).length;
}

var aggregates = {
  average : getAverage,
  sum : getSum,
  max : getMax,
  count : getCount
}
