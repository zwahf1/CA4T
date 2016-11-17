angular.module('chart.service',[])


.factory('Chart', function () {
    var drawChart =  function () {
                    var a_short = [
                      ['Zeit', 'Glucose mmol/L'],
                      a[a.length-7],
                      a[a.length-6],
                      a[a.length-5],
                      a[a.length-4],
                      a[a.length-3],
                      a[a.length-2],
                      a[a.length-1]
                    ];
                    var data = google.visualization.arrayToDataTable(a_short);


                    var options = {
                    fontSize: 20,
                    title: "Elisabeth's Diabetes",
                    curveType: 'none',
                    pointSize: 50,
                    legend: { position: 'bottom' }
                  };

                  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

                  chart.draw(data, options);
    }

    var newValue = function () {
      var r = (Math.random()*5 );
      var last = a[a.length-1][1]-2;
      var act = last+r;
      document.getElementById("w_value").value = act.toFixed(1);
      document.getElementById("b_add").disabled = false;
    }

    var addA = function () {
      var v = document.getElementById("w_value").value;
      document.getElementById("w_value").value ='';
      a.push([getDateString(), Number(v)]);
      drawChart();
    }

    var getDateString = function() {
      var d = new Date();
      var h = d.getHours();
      var min = d.getMinutes();
      var y = d.getFullYear();
      return h+":"+min+".";
    }

    var getDateStringI = function (i) {
      var d = new Date();
      d.setHours(14);
      //d.setMinutes(00);
      d.setTime(d.getTime() - (i*28800000));
      var h = d.getHours();
      var min = d.getMinutes();
      var y = d.getFullYear();
      return h+':'+'00';
    }

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    var a = [
    ['Zeit', 'Glucose mmol/L'],
    [getDateStringI(7),  5.3],
    [getDateStringI(6),  13.4],
    [getDateStringI(5),  7.6],
    [getDateStringI(4),  6.9],
    [getDateStringI(3),  5.6],
    [getDateStringI(2),  9.5],
    [getDateStringI(1),  8.6]];


    return {
      drawChart,
      newValue,
      addA,
      getDateString,
      getDateStringI
    };
});
