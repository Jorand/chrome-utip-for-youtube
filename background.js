chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, {type: 'changePage', data: tab}, function (doc) {
      console.log(doc);
    });
  }
});