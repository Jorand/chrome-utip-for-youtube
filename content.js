(function () {

$(document).ready(init); // Content Ready

var RETRY_DELAY_MS = 800;	// Time between retry
var MAX_RETRY = 3;				// Number of retry
var SUCESS_MIN = 2;				// Minimum match to validate sucess

var timer,
		retryCount = 0,
		sucessCount = 0, // Count of link found in one retry loop
		options = {},
		link = '',
		layout = '2015',
		$buttonContainer = null;

function init() {
	getOptions();

	clearTimeout(timer);
	timer = setTimeout(function() {
		//console.log("[INFO] utip4yt: Testing…");
		link = '';
		
		//$("#meta #more").trigger("click"); // Open description
		
		// Look for a utip link
		// - #watch-description-text (layout version 2015) 
		// - #content, #description (new youtube version)
		var $description = $('#watch-description-text, #content, #description');
		link = $description.find('a[href*="utip.io"]').first().attr("href");

		if (link) {
			//console.log("[INFO] utip4yt: utip link found");
			sucessCount++;
		}
		else {
			sucessCount = 0;
			//console.log("[INFO] utip4yt: no utip link found");
			reset();
		}

		if (sucessCount >= SUCESS_MIN) {
			setLayout();
			console.log("[INFO] utip4yt: utip link found");
			console.log("[INFO] utip4yt: layout version " + layout);
			
			var utipButton = '<button class="utip4yt-button"><svg role="img" aria-label="Utip for youtube button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" enable-background="new 0 0 128 128"><path stroke="#FFA644" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M93 27v47.1c0 4.1-.8 7.9-2.2 11.5-4.3 10.6-14.6 18-26.8 18-16.2 0-29-13.2-29-29.4v-47.2" fill="none"/><path stroke="#26FF82" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M90.8 85.5c-4.3 10.6-14.6 18-26.8 18-16.2 0-29-13.2-29-29.4v-47.1" fill="none"/><path stroke="#BF3BFF" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" fill="none" d="M35 74v-47"/><circle fill="#AE29FC" cx="35" cy="74.5" r="15"/><circle fill="#F99430" cx="93" cy="27" r="15"/><circle fill="#24EA74" cx="91" cy="85" r="15"/><title>Utip for youtube</title><desc>Automatically open a popup when you like a youtube video with a utip link in description.</desc></svg></button>';
			
			var button = '<div class="utip4yt-container">'+utipButton+'</div>';
			
			if ($('#iri-quick-controls-container').length > 0) { // Check for Iridium compatibility - https://github.com/ParticleCore/Iridium
				$('#iri-quick-controls-container').append(utipButton);
			}
			else 
			if (layout == '2018') {
				$buttonContainer.before(button);
			}
			else if (layout == '2015') {
				$buttonContainer.prepend(button);
				$('body').addClass('utip4yt-layout-2015');
				$('.utip4yt-container').addClass('old-layout');
			}
			else {
				$buttonContainer.prepend(button);
				$('.utip4yt-container').addClass('old-layout');
			}
		}
		else {
			if (retryCount < MAX_RETRY) {
				retryCount++;
				//console.log("[INFO] utip4yt: retry ("+retryCount+")");
				init();
			}
			else {
				if (sucessCount != 0) {
					// try again if at least one link has been found once
					refresh();
				}
				else {
					console.log("[INFO] utip4yt: no utip link found");
				}
			}
		}

		$('.utip4yt-button').on("click", openUtip);

		if(options.thumbUp) {
			$('#top-level-buttons ytd-toggle-button-renderer:first-child > a, .like-button-renderer-like-button').on("click", openUtip);
		}

	}, RETRY_DELAY_MS);
};

function openUtip() {
	if (link) {
		window.open(link, "popupWindow", "width=600,height=600,scrollbars=yes");
	}
}

function setLayout() {
	if ($('#menu-container').length > 0) {
		// 2018
		layout = '2018';
		$buttonContainer = $('#menu-container');
	}
	else if ($('ytd-video-primary-info-renderer').length > 0) {
		// 2017
		layout = '2017';
		$buttonContainer = $('.ytd-video-primary-info-renderer');
		if ($buttonContainer.find('ytd-menu-renderer').length > 0) {
			$buttonContainer = $buttonContainer.find('ytd-menu-renderer');
		}
	} else if ($('ytg-watch-footer').length > 0) {
		// 2016 Gaming
		layout = '2016';
		$buttonContainer = $('ytg-watch-footer');
		if ($buttonContainer.find('.actions').length > 0) {
			$buttonContainer = $buttonContainer.find('.actions');
		}
	} else {
		// 2015
		$buttonContainer = $('#watch8-sentiment-actions'); // watch8-secondary-actions
	}
}

function reset() {
	$('.utip4yt-container, .utip4yt-button').remove();
	$('#top-level-buttons ytd-toggle-button-renderer:first-child > a, .utip4yt-button').off("click");
};

function refresh() {
	console.log("[INFO] utip4yt: looking for a utip link…");
	reset();
	retryCount = 0;
	sucessCount = 0;
	$(document).ready(init);
};

function getOptions() {
	// Get extension options
	chrome.storage.sync.get({
		thumbUpOption: true
	}, function(items) {
		options.thumbUp = items.thumbUpOption;
	});
}

var isLoaded = false;

chrome.extension.onMessage.addListener(function(request, sender, response) {
	// listen to messages sent by the background script
	console.log("[MSG] utip4yt: ", request.type);
	if (request.type === 'complete') {
		refresh();
	}
	if (request.type === 'active') {
		if (!isLoaded) {
			isLoaded = true;
			if (sucessCount < SUCESS_MIN) {
				refresh();
			}
			else {
				console.log("[INFO] utip4yt: utip link already found");
			}
		}
	}
	return true;
});

})();
