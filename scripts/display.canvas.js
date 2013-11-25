 swapGame.display = (function () {
	var dom = swapGame.dom,
		$ = dom.$,
		canvas, ctx,
		cols, rows,
		blockSize,
		firstRun = true,
		blocks,
		cursor, 
		previousCycle,
		animations = [];
		
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
		ctx.scale(blockSize, blockSize);
		
		boardElement.appendChild(createBackground());
		boardElement.appendChild(canvas);
		
		previousCycle = Date.now();
		requestAnimationFrame(cycle);
	}
	
	function cycle (time) {
		renderCursor(time);
		renderAnimations(time, previousCycle);
		previousCycle = time;
		requestAnimationFrame(cycle);
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
			x, y, 1, 1
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
	
	function clearCursor () {
		if (cursor) {
			var x = cursor.x,
				y = cursor.y;
			clearBlock(x, y);
			drawBlock(blocks[x][y], x, y);
		}
	}
	
	function setCursor (x, y, selected) {
		clearCursor();
		if (arguments.length > 0) {
			cursor = {
				x: x,
				y: y,
				selected: selected
			};
		} else {
			cursor = null;
		}
	}
	
	function renderCursor () {
		if (!cursor) {
			return;
		}
		var x = cursor.x,
			y = cursor.y,
			t1 = (Math.sin(time / 200) + 1) / 2,
			t2 = (Math.sin(time / 400) + 1) / 2;
		
		clearCursor();
		
		if (cursor.selected) {
			ctx.save();
			ctx.globalCompositeOperation = "lighter";
			ctx.globalAlpha = 0.8 * t1;
			drawBlock(blocks[x][y], x, y);
			ctx.restore();
		}
		ctx.save();
		ctx.lineWidth = 0.05 * blockSize;
		ctx.strokeStyle = "rgba(250,250,150" + (0.5 + 0.5 * t2) + ")";
		ctx.strokeRect(
			(x + 0.05) * blockSize, (y + 0.05) * blockSize,
			0.9 * blockSize, 0.9 * blockSize
		);
		ctx.restore();
	}
	
	function clearBlock (x, y) {
		ctx.clearRect(x, y, 1, 1);
	}
	
	function moveBlocks (movedBlocks, callback) {
		var n = movedBlocks.length,
			oldCursor = cursor;
		
		cursor = null;
		movedBlocks.forEach(function (e) {
			var x = e.fromX, 
				y = e.fromY,
				dx = e.toX - e.fromX,
				dy = e.toY - e.fromY,
				dist = Math.abs(dx) + Math.abs(dy);
			addAnimation(200 * dist, {
				before: function (pos) {
					pos = Math.sin(pos * Math.PI / 2);
					clearBlock(x + dx * pos, y + dy * pos);
				},
				render: function (pos) {
					pos = Math.sin(pos * Math.PI / 2);
					drawBlock(
						e.type,
						x + dx * pos, 
						y + dy * pos
					);
				},
				done: function (pos) {
					if (--n == 0) {
						cursor = oldCursor;
						callback();
					}
				}
			});
		});
	}
	
	function removeBlocks (removedBlocks, callback) {
		var n = removedBlocks.length;
		
		for (var i = 0; i < n; i++) {
			clearBlock(removedBlocks[i].x, removedBlocks[i].y);
		}
		callback();
	}
	
	function addAnimation (runTime, fncs) {
		var anim = {
			runTime: runTime,
			startTime: Date.now(),
			pos: 0,
			fncs: fncs
		};
		animations.push(anim);
	}
	
	function renderAnimations (time, lastTime) {
		var anims = animations.slice(0),
			n = anims.length,
			animTime,
			anim,
			i;
			
		// call before() function
		for (i = 0; i < n; i++) {
			anim = anims[i];
			if (anim.fncs.before) {
				anim.fncs.before(anim.pos);
			}
			anim.lastPos = anim.pos;
			animTime = (lastTime - anim.startTime);
			anim.pos = animTime / anim.runTime;
			anim.pos = Math.max(0, Math.min(1, anim.pos));
		}
		
		animations = []; // reset animations list
		
		for (i = 0; i < n; i++) {
			anim = anims[i];
			anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
			if (anim.pos == 1) {
				if (anim.fncs.done) {
					anim.fncs.done(();
				}
			} else {
				animations.push(anim);
			}
		}
	}
	
	return {
		initialise:initialise,
		redraw:redraw,
		setCursor:setCursor,
		moveBlocks: moveBlocks,
		removeBlocks: removeBlocks,
		refill: redraw
	}
 })();