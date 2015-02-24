// Options Page: chrome-extension://omnlmmapcpkadfkajeijakgjcjoildaf/options/options.html

var save_options = function() {
    var blacklist = $('#blacklist');
    var time_units = $('input[name=time-units]:checked');
    var obj = {
        "trackr_settings": {
            "blacklist": blacklist.val().trim().split('\n'),
            "time_units": time_units.attr('id')
        }
    };
    chrome.storage.sync.set(obj);
    chrome.runtime.sendMessage({
        settingsChanged: true
    });
};

restore_options = function() {
    var blacklist = $('#blacklist');
    chrome.storage.sync.get('trackr_settings', function(data) {
        data = data.trackr_settings;

        $.each(data.blacklist, function(i, v) {
            blacklist.append(v + '\n');
        });

        $('#' + data.time_units).prop('checked', true);
    });
};

$(function() {
    restore_options();
    $('#save').on('click', function() {
        save_options();
        if ($('.alert').length === 0) {
            $('<div class="alert"><p>Settings saved!</p></div>').prependTo('.container').delay(2000).fadeOut(400, function() {
                $(this).remove();
            });
        }
    });
});
