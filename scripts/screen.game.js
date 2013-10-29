swapGame.screens["game-screen"] = (function () {
	var board = swapGame.board,
		display = swapGame.display;
		
	function run () {
		board.initialise(function () {
			display.initialise(function () {
				// start the game
			});
		});
	}
	
	return {
		run:function () {}
	};
})();