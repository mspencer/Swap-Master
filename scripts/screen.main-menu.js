swapGame.screens["main-menu"] = (function () {
	var dom = swapGame.dom,
		game = swapGame.game,
		firstRun = true;
		
	function setup () {
		dom.bind("#main-menu ul.menu", "click", function (e) {
			if (e.target.nodeName.toLowerCase() === "button") {
				var action = e.target.getAttribute("name");
				if (action == "exit-game") {
					game.showScreen("splash-screen");
				} else {
					game.showScreen(action);
				}
			}
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