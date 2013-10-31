 swapGame.display = (function () {
	var dom = swapGame.dom,
		$ = dom.$,
		canvas, ctx,
		cols, rows,
		blockSize,
		firstRun = true,
		blocks;
		
	function setup () {
		var boardElement = $("#game-screen .game-board")[0];
		
		cols = swapGame.settings.cols;
		rows = swapGame.settings.rows;
		blockSize = swapGame.settings.blockSize;
		
		canvas = document.createElement("canvas");
		ctx = canvas.getContext("2d");
		dom.addClass(canvas, "board");
		canvas.width = cols * blockSize;
		canvas.height = rows * blockSize;
		
		boardElement.appendChild(createBackground());
		boardElement.appendChild(canvas);
	}
	
	function initialise (callback) {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		callback();
	}
	
	function createBackground() {
		var background = document.createElement("canvas"),
			bgctx = background.getContext("2d");
			
		dom.addClass(background, "background");
        background.width = cols * blockSize;
        background.height = rows * blockSize;
		
		bgctx.fillStyle = "rgba(225,235,255,0.3)";
		for (var x = 0; x < cols; x++) {
            for (var y = 0; y < cols; y++) {
                if ((x+y) % 2) {
                    bgctx.fillRect(
                        x * blockSize, y * blockSize,
                        blockSize, blockSize
                    );
                }
            }
        }
		
		return background;
	}
	
	function drawBlock (type, x, y) {
		var image = swapGame.images["images/blocks" + blockSize + ".png"];
		
		ctx.drawImage(image, 
			type * blockSize, 0, blockSize, blockSize,
			x * blockSize, y * blockSize,
			blockSize, blockSize
		);
	}
	
	function redraw (newBlocks, callback) {
		var x, y;
		blocks = newBlocks;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for (x = 0; x < cols; x++) {
			for (y = 0; y < rows; y++) {
				drawBlock(blocks[x][y], x, y);
			}
		}
		callback();
	}
	
	return {
		initialise:initialise,
		redraw:redraw
	}
 })();