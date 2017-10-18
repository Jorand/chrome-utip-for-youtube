$(document).ready(init);

var timer;

function init() {
	console.log("[INFO] utip4yt: init");
	$('.utip4yt-container').remove();
	$('#top-level-buttons ytd-toggle-button-renderer:first-child > a, .utip4yt-button').off("click");

	clearTimeout(timer);

	timer = setTimeout(function() {

		var link = '';

		function checkUtip () {
			$("paper-button#more").trigger("click");

			link = $('a[href*="utip.io"]').first().attr("href");

			if (link) {
				console.log("[INFO] utip4yt: utip link found");
				$('ytd-menu-renderer.ytd-video-primary-info-renderer').prepend('<div class="utip4yt-container"><a class="utip4yt-button"><svg role="img" aria-label="Utip for youtube button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" enable-background="new 0 0 128 128"><path stroke="#FFA644" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M93 27v47.1c0 4.1-.8 7.9-2.2 11.5-4.3 10.6-14.6 18-26.8 18-16.2 0-29-13.2-29-29.4v-47.2" fill="none"/><path stroke="#26FF82" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M90.8 85.5c-4.3 10.6-14.6 18-26.8 18-16.2 0-29-13.2-29-29.4v-47.1" fill="none"/><path stroke="#BF3BFF" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" fill="none" d="M35 74v-47"/><circle fill="#AE29FC" cx="35" cy="74.5" r="15"/><circle fill="#F99430" cx="93" cy="27" r="15"/><circle fill="#24EA74" cx="91" cy="85" r="15"/><title>Utip for youtube</title><desc>Automatically open a popup when you like a youtube video with a utip link in description.</desc></svg></a></div>');
			}
		}

		function openUtip() {
			if (link) {
				window.open(link, "popupWindow", "width=600,height=600,scrollbars=yes");
			}
		}

		checkUtip();

		$('#top-level-buttons ytd-toggle-button-renderer:first-child > a, .utip4yt-button').on("click", openUtip);

	}, 1000);
};

function refresh() {
	$(document).ready(init);
};

var changePageTimer;

chrome.extension.onMessage.addListener(function(request, sender, response) {
	if (request.type === 'changePage') {
		//if (request.data.url.indexOf("watch") >= 0) {
		refresh();
	}

	return true;
});