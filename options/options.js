var save_options = function() {
    var blacklist = $('#blacklist');
    var obj = {
        "trackr_settings": {
            "blacklist": blacklist.val().split('\n')
        }
    };
    chrome.storage.sync.set(obj);
    chrome.runtime.sendMessage({ settingsChanged: true });
};

restore_options = function() {
    var blacklist = $('#blacklist');
    chrome.storage.sync.get({
        "trackr_settings": {
            "blacklist": ['newtab', 'devtools', 'extensions']
        }
    }, function(data) {
        chrome.storage.sync.set(data);
        data = data.trackr_settings;
        if (data.blacklist) {
            $.each(data.blacklist, function(i, v) {
                blacklist.append(v + '\n');
            });
        }
    });
};

$(function() {
    restore_options();
    $('#save').on('click', function() {
        save_options();
        $('<div class="alert"><p>Settings saved!</p></div>').prependTo('.container').delay(2000).fadeOut(2000);
    });
});
