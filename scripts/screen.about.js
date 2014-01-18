swapGame.screens["about"] = (function () {
	var dom = swapGame.dom,
		$ = dom.$,
		game = swapGame.game,
		firstRun = true;

	function setup () {
		var backButton = $("#about footer button[name=back]")[0];
		dom.bind(backButton, "click", function(e){
			game.showScreen("main-menu");
		});
	}

	function run () {
		if (firstRun) {
			setup();
			firstRun = false;
		}
	}

	return {
		run:run
	};
})();