var deleteURL = function(id) {
    chrome.storage.sync.get('trackr', function(data) {
        var index;
        $.each(data.trackr, function(i, v) {
            if (v.id === id) {
                index = i;
                return false;
            }
        });
        data.trackr.splice(index, 1);
        if (data.trackr.length === 0) {
            chrome.storage.sync.remove('trackr');
            return;
        }
        chrome.storage.sync.set(data);
    });
};

$(function() {
    var $tbody = $('table tbody');
    chrome.storage.sync.get('trackr', function(data) {
        $.each(data.trackr, function(i, v) {
            $tbody.append('<tr><td>' + v.title + '</td><td>' + ((v.time * 5000)/60000).toFixed(2) + '</td></tr>')
        });
    });
});
