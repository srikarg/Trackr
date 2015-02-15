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
    chrome.storage.local.get('trackr', function(data) {
        var chartData = [];
        var options = {
            responsive: true,
            legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span class=\"label\" style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span> <span class=\"value\" style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].value){%><%=segments[i].value%><%}%></span></li><%}%></ul>'
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
