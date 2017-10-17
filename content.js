$(document).ready(function() {
	setTimeout(function() {

		function checkUtip () {
			$("paper-button#more").trigger("click");

			var link = $('a[href*="utip.io"]').first().attr("href");
			
			window.open(link, "popupWindow", "width=600,height=600,scrollbars=yes");
		}

		$('#top-level-buttons *:first-child .ytd-toggle-button-renderer').on( "click", checkUtip );

	}, 1000);
});
