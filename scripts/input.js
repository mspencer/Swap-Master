swapGame.input = (function () 
	var keys = {
		37: "KEY_LEFT",38: "KEY_UP",39: "KEY_RIGHT",40: "KEY_DOWN",13: "KEY_ENTER",32: "KEY_SPACE",
		65: "KEY_A", 66: "KEY_B", 67: "KEY_C", 68: "KEY_D", 69: "KEY_E", 70: "KEY_F", 71: "KEY_G", 
		72: "KEY_H", 73: "KEY_I", 74: "KEY_J", 75: "KEY_K", 76: "KEY_L", 77: "KEY_M", 78: "KEY_N", 
		79: "KEY_O", 80: "KEY_P", 81: "KEY_Q", 82: "KEY_R", 83: "KEY_S", 84: "KEY_T", 85: "KEY_U", 
		86: "KEY_V", 87: "KEY_W", 88: "KEY_X", 89: "KEY_Y", 90"KEY_Z", 
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
		// bind a handler function to a game action
	}
	
	function trigger (action) {
		// trigger a game action
	}
	
	return {
		initialise: initialise
	}
})();