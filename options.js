var optionIds = {
  thumbUp: 'save-thumb-up'
};

// Saves options to chrome.storage.sync.
function save_options() {
  var thumbUpOption = document.getElementById(optionIds.thumbUp).checked;

  chrome.storage.sync.set({
    thumbUpOption: thumbUpOption
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    status.classList.add("visible");
    setTimeout(function() {
      status.classList.remove("visible");
      status.textContent = '';
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    thumbUpOption: true
  }, function(items) {
    document.getElementById(optionIds.thumbUp).checked = items.thumbUpOption;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById(optionIds.thumbUp).addEventListener('click',
    save_options);
