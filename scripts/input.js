swapGame.input = (function () {
	var keys = {
		37: "KEY_LEFT",
		38: "KEY_UP",
		39: "KEY_RIGHT",
		40: "KEY_DOWN",
		13: "KEY_ENTER",
		32: "KEY_SPACE"
	};

	var dom = swapGame.dom,
		$ = dom.$,
		settings = swapGame.settings,
		inputHandlers;
		
	function initialise () {
		inputHandlers = {};
		var board = $("#game-screen .game-board")[0];
		
		dom.bind(board, "mousedown", function(event) {
			handleClick(event, "CLICK", event);
		});
		
		dom.bind(board, "touchstart", function(event) {
			handleClick(event, "TOUCH", event.targetTouches[0]);
		});
		
		dom.bind(document, "keydown", function(event) {
			var keyName = keys[event.keyCode];
			if (keyName && settings.controls[keyName]) {
				event.preventDefault();
				trigger(settings.controls[keyName]);
			}
		});
	}
	
	function handleClick (event, control, click) {
		// is any action bound to this input control?
		var action = settings.controls[control];
		if (!action) {
			return;
		}
		
		var board = $("#game-screen .game-board")[0],
			rect = board.getBoundingClientRect(),
			relX, relY,
			blockX, blockY;
			
		// click position relative to board
		relX = click.clientX - rect.left;
		relY = click.clientY - rect.top;
		
		// block coordinates
		blockX = Math.floor(relX / rect.width * settings.cols);
		blockY = Math.floor(relY / rect.height * settings.rows);
		
		// trigger functions bound to action
		trigger(action, blockX, blockY);
		
		// prevent default click behaviour
		event.preventDefault();
	}
	
	function bind (action, handler) {
		if (!inputHandlers[action]) {
			inputHandlers[action] = [];
		}
		inputHandlers[action].push(handler);
	}
	
	function trigger (action) {
		var handlers = inputHandlers[action],
			args = Array.prototype.slice.call(arguments, 1);
		
		if (handlers) {
			for (var i = 0; i < handlers.length; i++) {
				handlers[i].apply(null, args);
			}
		}
	}
	
	return {
		initialise: initialise,
		bind: bind
	};
})();