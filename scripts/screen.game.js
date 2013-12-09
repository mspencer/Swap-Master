swapGame.screens["game-screen"] = (function() {
    var settings = swapGame.settings,
    	board = swapGame.board,
        display = swapGame.display,
		input = swapGame.input,		
		dom = swapGame.dom,
		$ = dom.$,
		cursor,
		firstRun = true;

    function run() {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		startGame();
    }
	
	function setup () {
		input.initialise();
		input.bind("selectBlock", selectBlock);
		input.bind("moveUp", moveUp);
		input.bind("moveDown", moveDown);
		input.bind("moveLeft", moveLeft);
		input.bind("moveRight", moveRight);
	}
	
	function startGame () {
		gameState = {
			level: 0,
			score: 0,
			timer: 0, // setTimeout reference
			startTime: 0, // time at start of level
			endTime: 0 // time to game over
		};
		cursor = {
			x: 0,
			y: 0,
			selected: false
		};
		updateGameInfo();
		board.initialise(function () {
			display.initialise(function () {
				display.redraw(board.getBoard(), function() {
					advanceLevel();
				});
			});
		});
	}
	
	function updateGameInfo () {
		$("#game-screen .score span")[0].innerHTML = gameState.score;
		$("#game-screen .level span")[0].innerHTML = gameState.level;
	}
	
	function setLevelTimer (reset) {
		if (gameState.timer) {
			clearTimeout(gameState.timer);
			gameState.timer = 0;
		}
		if (reset) {
			gameState.startTime = Date.now();
			gameState.endTime = settings.baseLevelTimer * Math.pow(gameState.level, -0.05 * gameState.level);
		}
		var delta = gameState.startTime + gameState.endTime - Date.now(),
			percent = (delta / gameState.endTime) * 100,
			progress = $("#game-screen .time .indicator")[0];
		if (delta < 0) {
			gameOver();
		} else {
			progress.style.width = percent + "%";
			gameState.timer = setTimeout(function() {
				setLevelTimer(false);
			}, 30);
		}
	}
	
	function addScore(points) {
		var nextLevelAt = Math.pow(settings.baseLevelScore, Math.pow(settings.baseLevelExp, gameState.level-1));
		gameState.score += points;
		if (gameState.score >= nextLevelAt) {
			advanceLevel();
		}
		updateGameInfo();
	}
	
	function advanceLevel () {
		gameState.level++;
		announce("Level " + gameState.level);
		updateGameInfo();
		gameState.startTime = Date.now();
		gameState.endTime = settings.baseLevelTimer * Math.pow(gameState.level, -0.05 * gameState.level);
		setLevelTimer(true);
		display.levelUp();
	}
	
	function announce (str) {
		var element = $("#game-screen .announcement")[0];
		element.innerHTML = str;
		if (Modernizr.cssanimations) {
			dom.removeClass(element, "zoomfade");
			setTimeout(function() {
				dom.addClass(element, "zoomfade");
			}, 1);
		} else {
			dom.addClass(element, "active");
			setTimeout(function() {
				dom.removeClass(element, "active");
			}, 1000);
		}
	}
	
	function gameOver () {
		display.gameOver(function () {
			announce("Game over");
		});
	}
	
	function setCursor (x, y, select) {
		cursor.x = x;
		cursor.y = y;
		cursor.selected = select;
		display.setCursor(x, y, select);
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
				setCursor(x, y, false);
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
					announce("No moves!");
					display.refill(boardEvent.data, next);
					break;
				case "score" :
					addScore(boardEvent.data);
					next();
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
			if (x >= 0 && x < settings.cols && y >= 0 && y < settings.rows) {
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
