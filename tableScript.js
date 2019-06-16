var $table = $('#table'),
    $stable = $('#selectedTable'),
      selections = [];
var selectedVids = {};
var localData;

function initTable(tableData) {
    localData = tableData;
    $table.bootstrapTable({
        // height: getHeight(),
        columns: [
            [
                {   field: 'id',
                    title: 'Video ID',
                    // rowspan: 2,
                    align: 'left',
                    valign: 'middle',
                    sortable: true,
                    visible: false
                    // footerFormatter: totalTextFormatter
                },
                {   field: 'title',
                    title: 'Title',
                    sortable: true,
                    align: 'left'
                },
                {   field: 'channel',
                    title: 'Channel',
                    sortable: true,
                    align: 'center'
                },
                {   field: 'category',
                    title: 'Category',
                    sortable: true,
                    align: 'center'
                },
                {   field: 'views',
                    title: 'Views',
                    sortable: true,
                    align: 'center'
                },
                {   field: 'likes',
                    title: 'Likes',
                    sortable: true,
                    align: 'center'
                },
                {   field: 'dislikes',
                    title: 'Dislikes',
                    sortable: true,
                    align: 'center',
                    visible: false
                },
                {   field: 'comments',
                    title: 'Comments',
                    sortable: true,
                    align: 'center',
                    visible: false
                },
                {   field: 'selected',
                    title: 'Selected',
                    valign: 'middle',
                    align: 'center',
                    sortable : true,
                    // sorter : "compareFavorite",
                    events: operateEvents,
                    formatter: operateFormatter
                },
            ]
        ],
        data : tableData

    });

    // sometimes footer render error.
    setTimeout(function () {
        $table.bootstrapTable('resetView');
    }, 200);

    $table.on('expand-row.bs.table', function (e, index, row, $detail) {
        if (index % 2 == 1) {
            $detail.html('<a href="https://www.youtube.com/watch?v='+row.id+ '"><p style="text-align:center;">Video had Embedding Disabled... Click to be redirected</p></a>');
            $.get('LICENSE', function (res) {
                $detail.html(res.replace(/\n/g, '<br>'));
            });
        }
    });
    // $table.on('all.bs.table', function (e, name, args) {
    //     // console.log(name, args);
    // });

    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
}

function initSelectedTable(startData) {
    // var startData = randomStartingVideos();
    selections = startData.map(function(d){return d.id;});

    $stable.bootstrapTable({
        data: startData,
        columns: [
            [
                {   field: 'id',
                    title: 'Video ID',
                    visible: false
                },
                {   field: 'title',
                    title: 'Title',
                    align: 'left'
                },
                {   field: 'color',
                    title: 'Color',
                    valign: 'middle',
                    align: 'center',
                    formatter: colorFormatter
                },
            ]
        ],

    });
}



function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    });
}

function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.id, selections) !== -1;
    });
    return res;
}

function getHeight() {
    return $(window).height() - $('h1').outerHeight(true);
}

function operateFormatter(value, row, index) {
  var color = "black";
  var icon = "glyphicon-eye-close";

  if(row["selected"]){
    var selectIndex = selections.indexOf(row["id"]);
    color = colorScale(selectIndex);
    icon = "glyphicon-eye-open"
  }
  return [
      '<a class="like" href="javascript:void(0)" title="Like">',
      '<i class="glyphicon ' + icon + '" style="color:' + color + ';"></i>',
      '</a>  '
  ].join('');
}
function colorFormatter(value, row, index) {
  var color = colorScale(index)+"";
  // console.log("color", color);

  return '<i class="glyphicon glyphicon-asterisk" style="color:'
          + color + '"></i>';

}

function detailFormatter(index, row) {
  var id = row["id"]; //width='420' height='315'
  var embed = "<iframe width='100%' height='500' src='https://www.youtube.com/embed/"
                  + id
                  + "'></iframe>";
  return embed;
}

window.operateEvents = {
    'click .like': function (e, value, row, index) {
        // alert('You click like action, row: ' + JSON.stringify(row));
        if(!row["selected"]){
          selections.push(row["id"]);
          row["selected"] = true;
        }else{
          var index = selections.indexOf(row["id"]);
          if(index > -1){
            selections.splice(index, 1);
          }
          row["selected"] = false;
        }
        // console.log("Selected List", selections)
        var selectionData = selections.map(function(s){
          var vid = allData[s];
          // console.log(vid);
          return {
            id : s,
            title : vid.title,
          }
        })

        /* Bar Graph Data format:
        { label : string(video id),
          value : num(y value),
        */

        $table.bootstrapTable('load', localData);
        $stable.bootstrapTable('load', selectionData);
        updateTableGraph(selectionData);
    }
};

function updateTableGraph(selectionData){
d3.select('#graphContainer').select('svg').remove();
  var yAxis = document.getElementById("tableYAxis").options[document.getElementById("tableYAxis").selectedIndex].value;
  var data = [];
  var choice = document.getElementById("tableGraphType").options[document.getElementById("tableGraphType").selectedIndex].value;
  if (choice==='bar'){
    for(let i=0; i<selectionData.length; i++){
      var dates = allData[selectionData[i].id] ['dates'];
      data.push ({label: allData[selectionData[i].id].title, value: parseInt(dates[Object.keys(dates)[0]][yAxis])});
    }
    barGraph(540, 375, data, d3.select('#graphContainer'), genInfo('Selected Videos by '+yAxis, 'Videos', yAxis ));
    d3.selectAll('.x').html('');
  }else{
      var data = {};
    for(let i=0; i<selectionData.length; i++){
      data[selectionData[i].id] =   allData[selectionData[i].id];
    }

    var graph = objectifyLine(data, yAxis);
    lineGraph(540, 375, graph, d3.select('#graphContainer'), genInfo('Selected Videos by '+yAxis, 'Videos', yAxis ))
  }
}
function getSelectionData(){
  var selectionData = selections.map(function(s){
    var vid = allData[s];
    // console.log(vid);
    return {
      id : s,
      title : vid.title,
    }
  })
  return selectionData;
}
