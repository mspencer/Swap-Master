swapGame.board = (function () {
	var dom = swapGame.dom,
		settings,
		worker,
		messageCount,
		callbacks;
		
	function initialise(callback) {
		console.log("board.worker.interface-js");
		settings = swapGame.settings;
		rows = settings.rows;
		cols = settings.cols;
		
		messageCount = 0;
		callbacks = [];
		worker = new Worker("scripts/board.worker.js");
		
		dom.bind(worker, "message", messageHandler);
		post("initialises", settings, callback);
	}
	
	function messageHandler(event) {
		// uncomment to log worker message
		// console.log(event.data);
		
		var message = event.data;
		blocks = message.blocks;
		
		if (callbacks[message.id]) {
			callbacks[message.id](message.data);
			delete callbacks[message.id];
		}
	}
	
	function post(command, data, callback) {
		callbacks[messageCount] = callback;
		worker.postMessage({
			id: messageCount,
			command: command,
			data: data
		});
		messageCount++;
	}
	
	function swap(x1, y1, x2, y2, callback) {
		post("swap", {
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2
		}, callback);	
	}
	
	function getBoard () {
		var copy = [],
			x;
		for (x = 0; x < cols; x++) {
			copy[x] = blocks[x].slice(0);
		}
		return copy;
	}
	
	function print () {
		var str = "";
		for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
				str += getBlock(x,y) + " ";
			}
			str += "\r\n";
		}
		console.log(str);
	}
	
	function getBlock (x,y)  {
		if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
			return -1;
		} else {
			return blocks[x][y];
		}
	}
	
	return {
		initialise: initialise,
		swap: swap,
		getBoard: getBoard,
		print: print
	};
})();