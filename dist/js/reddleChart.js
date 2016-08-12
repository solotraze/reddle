/*
var backgroundColor = [
                    'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'
                ];
var borderColor = [
                    'rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'
                ];
*/
/*
var valuesDummy = [
                  {x:moment().add(-280, 's').format(),y:193},
                   {x:moment().add(-240, 's').format(),y:382},
                   {x:moment().add(-217, 's').format(),y:300},
                   {x:moment().add(-180, 's').format(),y:44},
                   {x:moment().add(-150, 's').format(),y:382},
                   {x:moment().add(-60, 's').format(),y:44},
                   {x:moment().add(-54, 's').format(),y:150},
                   {x:moment().add(-40, 's').format(),y:300},
                   {x:moment().add(-23, 's').format(),y:44},
                   {x:moment().add(-10, 's').format(),y:382},
                   {x:moment().add(-1, 's').format(),y:330},
                   //{x:moment('2016-08-10T02:10:45.000Z').format(),y:193},
                  ];
*/

var optionsLine =  {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    xAxes: [{
      type: "time",
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Timeline'
      },
      time: {
        unit: 'second',
        unitStepSize: 60,
        //min: '2016-08-10T02:10:15.000Z',
        //max: '2016-08-10T02:10:30.000Z'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'value'
      },
      ticks: {
        beginAtZero:true
      }
    }]
  }
};

var dataTemplate = {
  datasets: [{
    label: "Data Label",
    data: [],

    fill: false,
    lineTension: 0,//0.1,
    backgroundColor: "rgba(75,192,192,0.4)",
    borderColor: "rgba(75,192,192,0.6)",
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: "rgba(75,192,192,1)",//"rgba(180,63,63,1)"
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 3,
    pointHoverBackgroundColor: "rgba(75,192,192,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 3,
    pointRadius: 1,
    pointHitRadius: 10,
    spanGaps: false,
  }]
};

var reddleChart = function (_dataName, _valueLabel, _ctx, responsive, minutesWindow) {
  this.ctx = _ctx;
  this.width = this.ctx.width;
  this.height = this.ctx.height;
  
  this.chartData = (JSON.parse(JSON.stringify(dataTemplate)));
  this.chartOptions = (JSON.parse(JSON.stringify(optionsLine)));
  this.chartValues = [];//valuesDummy
  
  this.chartData.datasets[0].label = _dataName;
  this.chartOptions.scales.yAxes[0].scaleLabel.labelString = _valueLabel;
  if (responsive != undefined) {
    this.chartOptions.responsive = responsive;
    this.chartOptions.maintainAspectRatio = !responsive;
  }
  this.minutesWindow = (minutesWindow != undefined) ? (-1 * Math.abs(minutesWindow)) : -5;
};

reddleChart.prototype.load = function(_chartValues) {
  this.chartValues = (_chartValues != undefined) ? _chartValues : [];
  this.loadData(this.chartValues);
};

reddleChart.prototype.clear = function() {
  this.loadData([]);
};

reddleChart.prototype.update = function(_val, _time) {
  if (this.chartValues == undefined) {
    this.chartValues = []; 
  }
  this.chartValues.push({x:_time.format(),y:_val});
  
  this.loadData(this.chartValues);
};

/* Only concerned about the chart object */
reddleChart.prototype.loadData = function(values) {
  // If fixed size canvas is needed, resize it everytime to prevent distortion from ChartJS (http://stackoverflow.com/questions/19847582/chart-js-canvas-resize)
  this.ctx.width = this.width;
  this.ctx.height = this.height;

  var startMoment = (moment().startOf('minute')).add(this.minutesWindow, 'm');
  this.chartOptions.scales.xAxes[0].time.min = startMoment.format();
  this.chartOptions.scales.xAxes[0].time.max = startMoment.add(Math.abs(this.minutesWindow)+2, 'm').format();
  
  if (values != undefined) {
    this.chartData.datasets[0].data = values;
  }
  
  this.chart = new Chart(this.ctx, { type: 'line', data: this.chartData, options: this.chartOptions});
};








