swapGame.game = (function () {
	var dom = swapGame.dom,
		$ = dom.$;
		
	// hide the active screen (if any) and show the screen with the specified id
	function showScreen (screenId) {
		var activeScreen = $("#game .screen.active")[0],
			screen = $("#" + screenId)[0];
		if (activeScreen) {
			dom.removeClass(activeScreen, "active");
		}
		
		// run the screen module
		swapGame.screens[screenId].run();
		// display the screen html
		dom.addClass(screen, "active");
	}
	
	function setup () {
		// disable native touchmove behaviour to prevent overscroll
		dom.bind(document, "touchmove", function (event) {
			event.preventDefault();
		});
		// hide the address bar on Android devices
		if (/Android/.test(navigator.userAgent)) {
			$("html")[0].style.height = "200%";
			setTimeout(function () {
				window.scrollTo(0,1);
			}, 0);
		}
	}
	
	return {
		showScreen:showScreen,
		setup:setup
	}
})();