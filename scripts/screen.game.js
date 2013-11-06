swapGame.screens["game-screen"] = (function() {
    var board = swapGame.board,
        display = swapGame.display,
		cursor;

    function run() {
        board.initialise(function() {
            display.initialise(function() {
				cursor = {
					x:0,
					y:0,
					selected:false
				};
                display.redraw(board.getBoard(), function() {
                    // do nothing for now
                });
            });
        });
    }
	
	function setCursor (x, y, select) {
		cursor.x = x;
		cursor.y = y;
		cursor.selected = select;
	}
	
	function selectBlock (x, y) {
		if (arguments.length == 0) {
			selectBlock(cursor.x, cursor.y);
			return;
		}
		if (cursor.selected)
	}

    return {
        run : run
    };
})();
