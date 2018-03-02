// Fired when a tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  if (info.status === 'complete' && tab.active === true) {
    chrome.tabs.sendMessage(tabId, {type: info.status, data: tab}, function (doc) {
      //console.log(doc);
    });
  }
});

// Fires when the active tab in a window changes
// - For suspend tab or new tab not activated
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.sendMessage(activeInfo.tabId, {type: "active", data: activeInfo}, function (doc) {
    //console.log(doc);
  });
}); 
