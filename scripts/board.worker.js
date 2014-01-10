var swapGame = {};

importScript("board.js");

addEventListener("message", function(event) {
	var board = swapGame.board,
		message = event.data;
	
	switch (message.command) {
		case "initialise" : 
			swapGame.settings = message.data.settings;
			board.initialise(message.data.startSwapGame, callback);
			break;
		case "swap" :
			board.swap(
				message.data.x1,
				message.data.y1,
				message.data.x2,
				message.data.y2,
				callback);
			break;
	}
	
	function callback(data) {
		postMessage({
			id: message.id,
			data: data,
			blocks: board.getBoard()
		});
	}
	
}, false);