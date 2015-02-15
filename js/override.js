var deleteURL = function(id) {
    chrome.storage.local.get('trackr', function(data) {
        var index;
        $.each(data.trackr, function(i, v) {
            if (v.id === id) {
                index = i;
                return false;
            }
        });
        data.trackr.splice(index, 1);
        if (data.trackr.length === 0) {
            chrome.storage.local.remove('trackr');
            return;
        }
        chrome.storage.local.set(data);
    });
};

$(function() {
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
            legendTemplate: '<table class=\"u-full-width <%=name.toLowerCase()%>-legend\"><thead><tr><th>Color</th><th>Title</th><th>Time (minutes)</th></tr></thead><% for (var i=0; i<segments.length; i++){%><tr><td><span class=\"color-box\" style=\"background-color:<%=segments[i].fillColor%>\"></span></td><td class=\"label\"><%if(segments[i].label){%><%=segments[i].label%><%}%></td><td class=\"value\"><%if(segments[i].value){%><%=segments[i].value%><%}%></td></tr><%}%></table>'
        };
        var ctx = $('#chart').get(0).getContext('2d');

        $.each(data.trackr, function(i, v) {
            if (v.time !== 0) {
                var color = $c.rand('hex');
                var backgroundColor = $c.complement(color);
                // http://stackoverflow.com/a/6134070/1042093
                var value = parseFloat(parseFloat(Math.round(((v.time * 5000)/60000) * 100) / 100).toFixed(2));
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
    });
});
