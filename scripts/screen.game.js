swapGame.screens["game-screen"] = (function() {
    var board = swapGame.board,
        display = swapGame.display,
		input = swapGame.input,
		settings = swapGame.settings,
		cursor,
		firstRun = true;

    function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		
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
	
	function setup () {
		input.initialise();
		input.bind("selectBlock", selectBlock);
		input.bind("moveUp", moveUp);
		input.bind("moveDown", moveDown);
		input.bind("moveLeft", moveLeft);
		input.bind("moveRight", moveRight);
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
		if (cursor.selected) {
			var dx = Math.abs(x - cursor.x),
				dy = Math.abs(y - cursor.y),
				dist = dx + dy;
				
			if (dist == 0) {
				// deselect the selected block
				setCursor(x, y, false);
			} else if (dist == 1) {
				// select and adjacent block
				board.swap(cursor.x, cursor.y, x, y, playBoardEvents);
			} else {
				// select a different block
				setCursor(x, y, true);
			}
		} else {
			setCursor(x, y, true);
		}
	}

	function playBoardEvents (events) {
		if (events.length > 0) {
			var boardEvent = events.shift(),
				next = function () {
					playBoardEvents(events);
				};
			
			switch (boardEvent.type) {
				case "move" :
					display.moveBlocks(boardEvent.data, next);
					break;
				case "remove" :
					display.removeBlocks(boardEvent.data, next);
					break;
				case "refill" :
					display.refill(boardEvent.data, next);
					break;
				default :
					next();
					break;
			}
		} else {
			display.redraw(board.getBoard(), function () {
				// good to go again
			});
		}
	}
	
	function moveCursor(x, y) {
		if (cursor.selected) {
			x += cursor.x;
			y += cursor.y;
			if (x >= 0 && x <= settings.cols && y >= 0 && y <= settings.rows) {
				selectBlock(x, y);
			}
		} else {
			x = (cursor.x + x + settings.cols) % settings.cols;
			y = (cursor.y + y + settings.rows) % settings.rows;
			setCursor(x, y, false);
		}
	}
	
	function moveUp () {
		moveCursor(0, -1);
	}
	
	function moveDown () {
		moveCursor(0, 1);
	}
	
	function moveLeft () {
		moveCursor(-1, 0);
	}
	
	function moveRight () {
		moveCursor(1, 0);
	}
	
    return {
        run : run
    };
})();
