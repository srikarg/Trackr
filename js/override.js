$(function() {
    var settings, time_units;

    var getSettings = function() {
        chrome.storage.sync.get('trackr_settings', function(data) {
            if (data.trackr_settings) {
                settings = data.trackr_settings;
                time_units = settings.time_units;
            }
        });
    };

    getSettings();

    $('.controls #clear').on('click', function() {
        chrome.storage.local.remove('trackr');
        location.reload();
    });

    chrome.storage.local.get('trackr', function(data) {
        if ($.isEmptyObject(data)) {
            var $container = $('.container');
            $container.empty();
            $container.append('<div class="message"><h1>No URLs are tracked yet!</h1></div>');
            return;
        }

        var chartData = [];
        var options = {
            animation: false,
            responsive: true,
            segmentShowStroke: false,
            legendTemplate: '<table class=\"u-full-width <%=name.toLowerCase()%>-legend\"><thead><tr><th>Color</th><th>Title</th><th>Time (' + time_units + ')</th></tr></thead><% for (var i=0; i<segments.length; i++){%><tr><td><span class=\"color-box\" style=\"background-color:<%=segments[i].fillColor%>\"></span></td><td class=\"label\"><a href=\"http://<%=segments[i].label%>\" style=\"color:<%=segments[i].fillColor%>;text-decoration:none\"><%if(segments[i].label){%><%=segments[i].label%><%}%></a></td><td class=\"value\"><%if(segments[i].value){%><%=segments[i].value%><%}%></td></tr><%}%></table>'
        };
        var ctx = $('#chart').get(0).getContext('2d');

        $.each(data.trackr, function(i, v) {
            if (v.time !== 0) {
                var color = $c.rand('hex');
                var backgroundColor = $c.complement(color);
                // http://stackoverflow.com/a/6134070/1042093
                var value = v.time * 5;
                switch (time_units) {
                    case 'seconds':
                        break;
                    case 'minutes':
                        value = value / 60;
                        break;
                    case 'hours':
                        value = value / 3600;
                        break;
                }
                value = parseFloat(parseFloat(Math.round(value * 100) / 100).toFixed(2));
                if (value === 0) return;
                chartData.push({
                    value: value,
                    color: color,
                    highlight: backgroundColor,
                    label: v.title
                });
            }
        });

        var chart = new Chart(ctx).Doughnut(chartData, options);
        var legend = chart.generateLegend();

        $('.legend').html(legend);
        $('.legend table').tablesorter({
            sortList: [
                [2, 1]
            ],
            headers: {
                0: {
                    sorter: false
                }
            }
        });
    });
});
