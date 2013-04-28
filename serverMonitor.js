$(function () {
    "use strict";


    var chart;
    var chart2;
    var versionsData = [];
    var content = $('#content');
    var input   = $('#input');
    var status  = $('#status');
    var grid    = $('#serverStatus');
    var myColor = false;
    var myName  = false;
    var isAlive = true;
    var isFirst = true;
    var upSeconds = 0;
    var colors = Highcharts.getOptions().colors,
        categories = ['RAM'],
        name = 'RAM',
        data = [{
                y: 95.11,
                color: colors[2],
                drilldown: {
                    name: 'Physical Ram',
                    categories: ['Used', 'Free'],
                    data: [190950, 566500]
                }
        }];


    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].drilldown.data.length; j++) {
            var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'memGraph',
            type: 'pie',
            backgroundColor: '#EEEEEE',
            width: 190,
            height: 150,
            spacingBottom: 5,
            spacingLeft:   15,
            spacingRight:  0,
            spacingTop:    -5
        },
        title: {text: ''},
        yAxis: {title: {text: ''}},
        plotOptions: {
            pie: { shadow: false },
            center: ['100%', '100%'],
            borderWidth: 1,
            borderColor: '#FFFFFF'
        },
        exporting: { enabled: false },
        credits:{enabled:false},
        tooltip: { formatter: function() {
                return '<b>'+ this.point.name +'</b>: '+ Math.round(this.y/1024)+' MB';
        }},
        series: [{
            name: 'Versions',
            data: versionsData,
            innerSize: '70%',
            dataLabels: {
                enabled:false
            }
        }]
    });

    chart2 = new Highcharts.Chart({
        chart: {
            renderTo: 'netGraph',
            type: 'spline',
            backgroundColor: '#EEEEEE',
            width:  210,
            height: 170,
            spacingBottom: 40,
            spacingLeft:   0,
            spacingRight:  0,
            spacingTop:    10
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            labels: {enabled:false}
        },
        yAxis: {
            title: { text: '' },
            labels: {enabled:false},
            plotLines: [{ value: 0, width: 1, color: '#808080'}] },
        tooltip: { formatter: function() {
            return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2) + "kb/s";
        }},
        legend: { enabled: false },
        exporting: { enabled: false },
        credits:{enabled:false},
        series: [{
            name: 'Recived',
            dataLabels: { enabled:false },
            color: '#86DBCF',
            data: (function() {
                var data = [], time = (new Date()).getTime(), i;

                for (i = -10; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 0
                    });
                }
                return data;
            })()},{
            name: 'Transmitted',
            labels: { enabled:false },
            color: '#B09DC6',
            data: (function() {
                var data = [], time = (new Date()).getTime(), i;
                for (i = -10; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: 0
                    });
                }
                return data;
            })()}]
    });

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        status.text('Your browser doesn\'t support WebSockets.');
        return;
    }

    var connection = new WebSocket('ws://92.243.17.170:2468');

    connection.onopen = function () {
        status.text('Connected');
    };

    connection.onerror = function (error) {
        status.removeClass('offset4 span4').addClass('offset3 span6');
        status.text('There\'s some problem with your connection or the server is down.' );
        grid.slideUp('slow');
    };

    connection.onmessage = function (message) {
        var json;

        try {
            json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        if (json.type === 'message') {
            /**
             * CPU Load HTML
             */
            $('#cpuLoad').html('').append(
                $('<span>').addClass('statusMain').text( json.data[0].now )
            ).append(
                $('<span>').addClass('statusSecondary').text( '/' + json.data[0].count )
            ).append(
                $('<div>').addClass('pull-left').html( json.data[0].five + " <br> 5 Mins" )
            ).append(
                $('<div>').addClass('pull-right').html( json.data[0].fifteen + " <br> 15 Mins" )
            );

            /**
             * Memory Usage HTML
             */
            var used = parseInt(json.data[0].total - json.data[0].free, 10);
            var free = parseInt(json.data[0].free, 10);

            chart.series[0].data[0].update(['Used', used], true, true);
            chart.series[0].data[1].update(['Free', free], true, true);

            /**
             * Network information
             */
            var x = (new Date()).getTime();
            var rx = (json.data[0].rx/ 1024);
            var tx = (json.data[0].tx/ 1024);

            chart2.series[0].addPoint([x, rx], false, true);
            chart2.series[1].addPoint([x, tx], true, true);

            $('#driveList').find('tbody').empty();
            $.each(json.data[0].drives, function(key, value) {
                if(typeof value.mount !== "undefined") {
                    $('#driveList').find('tbody').append(
                        $('<tr>').append(
                            $('<td>').html( $.trim(value.mount) ).width('40%').addClass("driveMount")
                        ).append(
                            $('<td>').append(
                                $('<div>').addClass('progress progress-info progress-striped').append(
                                    $('<div>').addClass('bar').width(value.percent)
                                )
                            )
                        )
                    );
                }
            });

            $('#portScan').find('tbody').empty();
            $.each(json.data[0].ports, function(key, value) {
                var response = "";

                if (value[2] === true) {
                    response = $('<span>').addClass('label label-success').html('Up');
                } else {
                    response = $('<span>').addClass('label label-important').html('Down');
                }

                $('#portScan').find('tbody').append(
                    $('<tr>').append(
                        $('<td>').html(value[0])
                    ).append(
                        $('<td>').html(response)
                    )
                );

            });

            if (isFirst === true) {
                grid.slideDown('slow');
                isFirst = false;
            }

        } else if (json.type === 'uptime') {
            upSeconds = json.data;
        } else if (json.type === 'error') {
            grid.hide('slow');
            status.text(json.data);
            isAlive = false;
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };

    setInterval(function() {
        if (connection.readyState === 1) {
            connection.send('ping');
        }
    }, 5000);


    setInterval(function() {
        if (connection.readyState !== 1 && isAlive === true) {
            status.text('Unable to interact with the server.');
            grid.slideUp('slow');
            isAlive = false;
        }
    }, 3000);

    setInterval(function() {
        var uptimeString = "";
        var secs  = parseInt(upSeconds % 60, 10);
        var mins  = parseInt(upSeconds / 60 % 60, 10);
        var hours = parseInt(upSeconds / 3600 % 24, 10);
        var days  = parseInt(upSeconds / 86400, 10);

        $('#day').text(days);
        $('#days-label').text(((days == 1) ? "Day" : "Days"));

        if (hours > 0) {
            uptimeString += hours;
            uptimeString += ((hours == 1) ? " Hour" : " Hours");
        }

        if (mins > 0) {
            uptimeString += ((hours > 0) ? ", " : "") + mins;
            uptimeString += ((mins == 1) ? " Minute" : " Minutes");
        }

        if (secs > 0) {
            uptimeString += ((days > 0 || hours > 0 || mins > 0) ? ", " : "") + secs;
            uptimeString += ((secs == 1) ? " Second" : " Seconds");
        }

        $('#uptime').text(uptimeString);

        upSeconds++;
    }, 1000);
});
