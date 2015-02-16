var interval = null;
var updateTime = 5000;
var currentTabInfo = {};
var userActive = true;

var getURL = function(url) {
    chrome.storage.local.get('trackr', function(data) {
        var index, found;

        if ($.isEmptyObject(data)) {
            currentTabInfo.id = '_' + Math.random().toString(36).substr(2, 9);
            currentTabInfo.title = new URL(url).hostname;
            currentTabInfo.time = 0;
            var obj = {
                'trackr': [{
                    'id': currentTabInfo.id,
                    'title': currentTabInfo.title,
                    'time': currentTabInfo.time
                }]
            };
            chrome.storage.local.set(obj);
            return;
        }

        $.each(data.trackr, function(i, v) {
            if (v.title === new URL(url).hostname) {
                index = i;
                found = true;
                return false;
            }
        });

        if (found) {
            var retrieved = data.trackr[index];
            currentTabInfo.id = retrieved.id;
            currentTabInfo.title = retrieved.title;
            currentTabInfo.time = retrieved.time;
        } else {
            currentTabInfo.id = '_' + Math.random().toString(36).substr(2, 9);
            currentTabInfo.title = new URL(url).hostname;
            currentTabInfo.time = 0;

            data.trackr.push({
                'id': currentTabInfo.id,
                'title': currentTabInfo.title,
                'time': currentTabInfo.time
            });
        }

        chrome.storage.local.set(data);
    });
};

var updateURL = function() {
    if (userActive) {
        chrome.storage.local.get('trackr', function(data) {
            var index;
            $.each(data.trackr, function(i, v) {
                if (v.title === currentTabInfo.title) {
                    index = i;
                    return false;
                }
            });
            data.trackr[index].time = data.trackr[index].time + 1;

            chrome.storage.local.set(data);
        });
    }
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    userActive = message.userActive;
});

var getCurrentTab = function() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        getURL(tabs[0].url);
        clearInterval(interval);
        interval = null;
        interval = setInterval(function() {
            updateURL();
        }, updateTime);
    });
};
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.local.clear();
});
getCurrentTab();

chrome.tabs.onUpdated.addListener(getCurrentTab);
chrome.tabs.onActivated.addListener(getCurrentTab);
