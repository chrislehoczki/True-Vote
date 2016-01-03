'use strict';

(function () {
   
   //CREATE AN ARRAY OF CHART DATA
   var chartData = [];
   data.options.map(function(item) {
       var itemArray = [];
       itemArray.push(item.option)
       itemArray.push(item.value)
       chartData.push(itemArray)
   });
   
   //GOOGLE CHARTS
   
    // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Options');
        data.addColumn('number', 'Votes');
        data.addRows(chartData);

        // Set chart options
        var options = {
                       'width':400,
                       'height':300,
                        'is3d': true,
                        "colors": ["black"],
                        "legend": {position: 'none'},
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
   
   
})();
