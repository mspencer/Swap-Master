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
		
		boardElement.appendChild(canvas);
		boardElement.appendChild(createBackground());
				
		previousCycle = Date.now();
		requestAnimationFrame(cycle);
	}
	
	function cycle () {
		var time = Date.now();
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
	
	function drawBlock (type, x, y, scale, rot) {
		var image = swapGame.images["images/blocks" + blockSize + ".png"];
		
		ctx.save();
		if (typeof scale != "undefined" && scale > 0) {
			ctx.beginPath();
			ctx.rect(x,y,1,1);
			ctx.clip();
			ctx.translate(x + 0.5, y + 0.5);
			ctx.scale(scale, scale);
			if (rot) {
				ctx.rotate(rot);
			}
			ctx.translate(-x - 0.5, -y - 0.5);
		}
		ctx.drawImage(image, type * blockSize, 0, blockSize, blockSize,
			x, y, 1, 1
		);
		ctx.restore();
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
		renderCursor();
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
	
	function renderCursor() {
        if (!cursor) {
            return;
        }
        var x = cursor.x,
            y = cursor.y;

        clearCursor();

        if (cursor.selected) {
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = 0.8;
            drawBlock(blocks[x][y], x, y);
            ctx.restore();
        }
        ctx.save();
        ctx.lineWidth = 0.05 * blockSize;
        ctx.strokeStyle = "rgba(250,250,150,0.8)";
        ctx.strokeRect(
            (x + 0.05) * blockSize, (y + 0.05) * blockSize,
            0.9 * blockSize, 0.9 * blockSize
        );
        ctx.restore();
    }
	
	function renderCursor (time) {
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
		ctx.strokeStyle = "rgba(250,250,150," + (0.5 + 0.5 * t2) + ")";
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
		
		removedBlocks.forEach(function(e) {
			addAnimation(400, {
				before: function() {
					clearBlock(e.x, e.y);
				},
				render: function(pos) {
					ctx.save();
					ctx.globalAlpha = 1 - pos;
					drawBlock(
						e.type, e.x, e.y,
						1 - pos, pos * Math.PI * 2
					);
					ctx.restore();
				},
				done: function() {
					if (--n == 0) {
						callback();
					}
				}
			});
		});
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
					anim.fncs.done();
				}
			} else {
				animations.push(anim);
			}
		}
	}
	
	function refill (newBlocks, callback) {
		var lastBlock = 0;
		addAnimation(1000, {
			render: function(pos) {
				var thisBlock = Math.floor(pos * cols * rows),
					i, x, y;
				for (i = lastBlock; i < thisBlock; i++) {
					x = i % cols;
					y = Math.floor(i / cols);
					clearBlock(x, y);
					drawBlock(newBlocks[x][y], x, y);
				}
				lastBlock = thisBlock;
				canvas.style.webkitTransform = "rotateX(" + (360 * pos) + "deg)";
			},
			done: function() {
				canvas.style.webkitTransform = "";
				callback();
			}
		});
	}
	
	function levelUp (callback) {
		addAnimation(1000, {
			before: function(pos) {
				var j = Math.floor(pos * rows * 2),
					x, y;
				for (y = 0, x = j; y < rows; y++, x--) {
					if (x >= 0 && x < cols) {
						clearBlock(x,y);
						drawBlock(blocks[x][y], x, y);
					}
				}
			},
			render: function(pos) {
				var j = Math.floor(pos * rows * 2),
					x, y;
				ctx.save();
				ctx.globalCompositeOperation = "lighter";
				for (y = 0, x = j; y < rows; y++, x--) {
					if (x >= 0 && x < cols) {
						drawBlock(blocks[x][y], x, y, 1.1);
					}
				}
				ctx.restore();
			},
			done: callback
		});
	}
	
	function gameOver (callback) {
		addAnimation(1000, {
			render: function (pos) {
				canvas.style.left = 0.2 * pos * (Math.random() - 0.5) + "em";
				canvas.style.top = 0.2 * pos * (Math.random() - 0.5) + "em";
			},
			done: function () {
				canvas.style.left = "0";
				canvas.style.top = "0";
				explode(callback);
			}
		});
	}
	
	function explode (callback) {
		var pieces = [],
			piece,
			x, y;
		for (x = 0; x < cols; x++) {
			for (y = 0; y < rows; y++) {
				piece = {
					type: blocks[x][y],
					pos: {
						x: x + 0.5,
						y: y + 0.5
					},
					vel: {
						x: (Math.random() - 0.5) * 20,
						y: -Math.random() * 10
					},
					rot: (Math.random() - 0.5) * 3
				};
				pieces.push(piece);
			}
		}
		
		addAnimation(2000, {
			before: function (pos) {
				ctx.clearRect(0,0,cols,rows);
			},
			render: function (pos, delta) {
				explodePieces(pieces, pos, delta);
			},
			done: callback
		});
	}
	
	function explodePieces (pieces, pos, delta) {
		var piece, i;
		for (i = 0; i < pieces.length; i++) {
			piece = pieces[i];
			
			piece.vel.y += 50 * delta;
			piece.pos.y += piece.vel.y * delta;
			piece.pos.x += piece.vel.x * delta;
			
			if (piece.pos.x < 0 || piece.pos.x > cols) {
				piece.pos.x = Math.max(0, piece.pos.x);
				piece.pos.x = Math.min(cols, piece.pos.x);
				piece.vel.x *= -1;
			}
			
			ctx.save();
			ctx.globalCompositeOperation = "lighter";
			ctx.translate(piece.pos.x, piece.pos.y);
			ctx.rotate(piece.rot * pos * Math.PI * 4);
			ctx.translate(-piece.pos.x, -piece.pos.y);
			drawBlock(piece.type, piece.pos.x - 0.5, piece.pos.y - 0.5);
			ctx.restore();
		}
	}
	
	return {
		initialise:initialise,
		redraw:redraw,
		setCursor:setCursor,
		moveBlocks: moveBlocks,
		removeBlocks: removeBlocks,
		refill: refill,
		levelUp: levelUp,
		gameOver: gameOver
	}
 })();