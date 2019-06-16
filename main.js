var allData = null;
var callback;
var colorScale = d3.scaleOrdinal(d3["schemeCategory20"]);
var cateogryColorScale = d3.scaleOrdinal(d3["schemeCategory20"]);


function start(callbackIn){
  callback = callbackIn;
  fetchData(main);
}

function main(data){
  // console.log(colorScale);
  allData = data;

  callback();
}
