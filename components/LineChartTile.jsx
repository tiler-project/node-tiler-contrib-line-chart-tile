'use strict';

var React = require('react');
var LineChart = require("react-chartjs").Line;

module.exports = React.createClass({
  render: function() {
    var self = this;
    var styles = {
      container: {
        color: '#ffffff',
        backgroundColor: '#1e1e1e',
        height: '100%',
        boxSizing: 'border-box',
        paddingLeft: '0.5em',
        paddingRight: '0.5em'
      },
      title: {
        textAlign: 'center'
      },
      chart: {
        width: '100%',
        height: '100%'
      },
      legendList: {
        listStyleType: 'none',
        marginLeft: '0.5em',
        marginRight: '0.5em',
        padding: 0
      }
    };

    var title = (typeof self.props.title === 'undefined') ?
      undefined :
      <div key={'title'} style={styles.title}>{self.props.title}</div>;

    var chart;
    var metrics = self.props.metrics;

    if (metrics && metrics.length > 0) {
      console.log('Creating chart for ', metrics);
      var labels = [];
      var datasets = [];

      metrics.forEach(function(metric) {
        var dataset = {
          label: metric.label,
          data: []
        };
        metric.points.forEach(function(point) {
          dataset.data.push({
            label: point.time,
            value: point.value,
            datasetLabel: dataset.label
          });
          if (labels.indexOf(point.time) == -1) {
            labels.push(point.time);
          }
        });
        datasets.push(dataset);
      });

      labels.sort();

      var colors = [
        'a6cee3',
        '1f78b4',
        'b2df8a',
        '33a02c',
        'fb9a99',
        'e31a1c',
        'fdbf6f',
        'ff7f00',
        'cab2d6',
        '6a3d9a',
        'ffff99',
        'b15928'
      ];

      colors = colors.map(function(color) {
        var rgb = parseInt(color.slice(0, 2), 16) + ',' +
          parseInt(color.slice(2, 4), 16) + ',' +
          parseInt(color.slice(4, 6), 16);
        return {
          strokeColor: 'rgba(' + rgb + ',0.8)',
          fillColor: 'rgba(' + rgb + ',0)',
          legendColor: 'rgba(' + rgb + ',0.8)'
        }
      });

      datasets.forEach(function(dataset, datasetIndex) {
        var sortedData = [];
        labels.forEach(function(label, labelIndex) {
          sortedData[labelIndex] = null;
        });
        dataset.data.forEach(function(dataItem) {
          sortedData[labels.indexOf(dataItem.label)] = dataItem.value;
        });
        dataset.data = sortedData;
        var colorIndex = datasetIndex % colors.length;
        dataset.strokeColor = colors[colorIndex].strokeColor;
        dataset.pointColor = colors[colorIndex].strokeColor;
        dataset.pointStrokeColor = "#000";
        dataset.pointHighlightFill = "#000";
        dataset.pointHighlightStroke = colors[colorIndex].strokeColor;
        dataset.fillColor = colors[colorIndex].fillColor;
      });

      var lastDateLabel = '';

      labels = labels.map(function(timestamp) {
        var date = new Date(timestamp / 1000);
        var dateLabel = ('0000' + date.getFullYear()).slice(-4) + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2);
        var label = '';

        if (dateLabel != lastDateLabel) {
          label += dateLabel;
        }

        var hasMilliseconds = date.getMilliseconds() > 0;
        var hasSecondsOrMilliseconds = date.getSeconds() > 0 || hasMilliseconds;
        var hasHoursOrMinutesOrSecondsOrMilliseconds = date.getHours() > 0 || date.getMinutes() > 0 || hasSecondsOrMilliseconds;

        if (hasHoursOrMinutesOrSecondsOrMilliseconds) {
          label += (label.length > 0 ? ' ' : '') + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2);

          if (hasSecondsOrMilliseconds) {
            label += ':' + ('00' + date.getSeconds()).slice(-2);

            if (hasMilliseconds) {
              label += '.' + ('000' + date.getMilliseconds()).slice(-3);
            }
          }
        }

        lastDateLabel = dateLabel;

        return label;
      });

      var chartOptions = {
        pointDotRadius: 4,
        pointHitDetectionRadius: 5,
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>',
        animation: false,
        responsive: true
      };

      var chartData = {
        labels: labels,
        datasets: datasets
      };

      console.log('chartData', chartData);

      var legend = datasets.map(function(dataset, datasetIndex) {
        var colorIndex = datasetIndex % colors.length;

        var legendItemStyles = {
          listItem: {
            display: 'inline-block',
            marginRight: '1em'
          },
          bullet: {
            //display: 'inline-block',
            font: 'normal normal normal 14px/1 FontAwesome',
            fontSize: 'inherit',
            textRendering: 'auto',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            transform: 'translate(0, 0)',
            color: colors[colorIndex].legendColor
          }
        };

        return (
          <li key={dataset.label} style={legendItemStyles.listItem}><span style={legendItemStyles.bullet}>&#xf068;</span> <span>{dataset.label}</span></li>
        );
      });

      chart = (<div key={'chart'}>
        <LineChart data={chartData} options={chartOptions} redraw style={styles.chart} />
        <ul style={styles.legendList}>
            {legend}
        </ul>
      </div>);
    }
    else {
      chart = undefined;
    }

    return (
      <div style={styles.container}>
        {title}
        {chart}
      </div>
    );
  }
});
