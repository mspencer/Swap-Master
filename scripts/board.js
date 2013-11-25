swapGame.board = (function () {
	var settings,
		blocks, // two-dimensional array presenting the block in each location on the board
		cols,
		rows,
		baseScore,
		numBlockTypes;
		
	function fillBoard () {
		var x,y;
		blocks = [];
		for (x = 0; x < cols; x++) {
			blocks[x] = [];
			for (y = 0; y < rows; y++) {
				type = randomBlock();
				while ((type === getBlock(x-1,y) &&
						type === getBlock(x-2,y)) ||
					   (type === getBlock(x,y-1) &&
					    type === getBlock(x,y-2))) {
					type = randomBlock();	
				}
				blocks[x][y] = type;
			}
		}
		// fill board recursively if new board has no moves
		if (!hasMoves()) {
			fillBoard();
		}
	}
	
	function randomBlock () {
		return Math.floor(Math.random()*numBlockTypes);
	}
	
	function getBlock (x,y)  {
		if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
			return -1;
		} else {
			return blocks[x][y];
		}
	}
	
	function checkChain (x, y) {
		var type = getBlock(x, y),
			left = 0, right = 0,
			up = 0, down = 0;
		
		// look right
		while (type === getBlock(x + right + 1, y)) {
			right++;
		}
		// look left
		while (type === getBlock(x - left - 1, y)) {
			left++;
		}
		// look up
		while (type === getBlock(x, y + up + 1)) {
			up++;
		}
		// look down
		while (type === getBlock(x, y - down -1)) {
			down++;
		}
		
		return Math.max(left + 1 + right, up + 1 + down);
	}
	
	function canSwap (x1, y1, x2, y2) {
		var type1 = getBlock(x1, y1),
			type2 = getBlock(x2, y2),
			chain;
		
		if (!isAdjacent(x1, y1, x2, y2)) {
			return false;
		}
		
		// temporarily swap the blocks
		blocks[x1][y1] = type2;
		blocks[x2][y2] = type1;
		
		chain = (checkChain(x2, y2) > 2 || checkChain(x1, y1) > 2);
		
		// swap back
		blocks[x1][y1] = type1;
		blocks[x2][y2] = type2;
		
		return chain;
	}
	
	function isAdjacent (x1, y1, x2, y2) {
		var dx = Math.abs(x1 - x2),
			dy = Math.abs(y1 - y2);
			
		return (dx + dy === 1);
	}
	
	function getChains () {
		var x, y,
			chains = [];
			
		for (x = 0; x < cols; x++) {
			chains[x] = [];
			for (y = 0; y < rows; y++) {
				chains[x][y] = checkChain(x,y);
			}	
		}
		
		return chains;
	}
	
	function check (events) {
		var chains = getChains(),
			hadChains = false,
			score = 0,
			removed = [],
			moved = [],
			gaps = [],
			events = events || [];
		
		for (var x = 0; x < cols; x++) {
			gaps[x] = 0;
			for (var y = rows-1; y >= 0; y--) {
				if (chains[x][y] > 2) {
					hadChains = true;
					gaps[x]++;
					removed.push({
						x:x,
						y:y,
						type:getBlock(x,y)
					});
					// add points to score
					score += baseScore*Math.pow(2,(chains[x][y] - 3));
				} else if (gaps[x] > 0) {
					moved.push({
						toX:x,
						toY:y + gaps[x],
						fromX:x,
						fromY:y,
						type:getBlock(x,y)
					});
					blocks[x][y + gaps[x]] = getBlock(x,y);
				}				
			}
			// fill from top
			for (y = 0; y < gaps[x]; y++) {
				blocks[x][y] = randomBlock();
				moved.push({
					toX:x,
					toY:y,
					fromX:x,
					fromY:y - gaps[x],
					type:blocks[x][y]
				});
			}
		}
		
		if (hadChains) {
			events.push({
				type:"remove",
				data:removed
			}, {
				type:"score",
				data:score
			}, {
				type:"move",
				data:moved
			});
			// refill if no more moves
			if (!hasMoves()) {
				fillBoard();
				events.push({
					type:"refill",
					data:getBoard()
				});
			}
			return check(events);
		} else {
			return events;
		}
	}
	
	function hasMoves () {
		for (var x = 0; x < cols; x++) {
			for (var y = 0; y < rows; y++) {
				if (canBlockMove(x,y)) {
					return true;
				}
			}
		}
		return false;
	}
	
	function canBlockMove (x,y) {
		return ((x > 0 && canSwap(x,y,x-1,y)) ||
				(x < cols-1 && canSwap(x,y,x+1,y)) ||
				(y > 0 && canSwap(x,y,x,y-1)) ||
				(y < rows-1 && canSwap(x,y,x,y+1)));
	}
	
	function getBoard () {
		var copy = [],
			x;
		for (x = 0; x < cols; x++) {
			copy[x] = blocks[x].slice(0);
		}
		return copy;
	}
	
	function swap (x1,y1,x2,y2,callback) {
		var tmp, 
			swap1, swap2,
			events;
		
		swap1 = {
			type: "move",
			data: [{
				type: getBlock(x1,y1),
				fromX: x1, fromY: y1,
				toX: x2, toY: y2
			}, {
				type: getBlock(x2,y2),
				fromX: x2, fromY: y2,
				toX: x1, toY: y1
			}]
		};
		
		swap2 = {
			type: "move",
			data: [{
				type: getBlock(x2,y2),
				fromX: x1, fromY: y1,
				toX: x2, toY: y2
			}, {
				type: getBlock(x1,y1),
				fromX: x2, fromY: y2,
				toX: x1, toY: y1
			}]
		};
		
		if (isAdjacent(x1, y1, x2, y2)) {
			events.push(swap1);
		
			if (canSwap(x1,y1,x2,y2)) {
				// swap the blocks
				tmp = getBlock(x1,y1);
				blocks[x1][y1] = getBlock(x2,y2);
				blocks[x2][y2] = tmp;
				// check the board and get list of events
				events = events.concat(check());
			} else {
				events.push(swap2, {type: "badswap"});
			}
			callback(events);
		}
	}
	
	function initialise (callback) {
		settings = swapGame.settings;
		numBlockTypes = settings.numBlockTypes;
		baseScore = settings.baseScore;
		cols = settings.cols;
		rows = settings.rows;
		fillBoard();
		callback();
	}
	
	function print () {
		var str = "";
		for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
				str += "[" + x + "]" + "[" + y + "]";
				str += getBlock(x,y) + " ";
			}
			str += "\r\n";
		}
		console.log(str);
	}
	
	return {
		initialise:initialise,
		canSwap:canSwap,
		print:print,
		getBoard:getBoard,
		swap:swap
	};
})();