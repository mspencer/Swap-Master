var swapGame = {
	screens:{},
	settings:{
		rows:8,
		cols:8,
		baseScore:100,
		numBlockTypes:7
	},
	images: {}
};

// wait until main document is loaded
window.addEventListener("load", function () {

	// determine block size
	var blockProto = document.getElementById("block-proto"),
		rect = blockProto.getBoundingClientRect();
	swapGame.settings.blockSize = rect.width;
	
	// function test if the user has the option to install the application but hasn't done it yet
	Modernizr.addTest("standalone", function () {
		return (window.navigator.standalone != false);
	});
	
	// extend yep nope with preloading 
	yepnope.addPrefix("preload", function(resource) {
		resource.noexec = true;
		return resource;
	});
	
	var numPreload = 0,
		numLoad = 0;
	yepnope.addPrefix("loader", function(resource) {
		// console.log("Loading: " + resource.url);
		var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
		resource.noexec = isImage;
		
		numPreload++;
		resource.autoCallback = function(e) {
			// console.log("Finished loading: " + resource.url);
			numLoad++;
			if (isImage) {
				var image = new Image();
				image.src = resource.url;
				swapGame.images[resource.url] = image;
			}
		};
		return resource;
	});
	
	function getLoadProgress () {
		if (numPreload > 0) {
			return numLoad/numPreload;
		} else {
			return 0;
		}
	}
	
	// loading stage 1
	Modernizr.load([
		{
			// these files are always loaded
			load: [
				"scripts/sizzle.js",
				"scripts/dom.js",
				"scripts/game.js"
			]
		}, {
			test: Modernizr.standalone,
			yep: "scripts/screen.splash.js",
			nope: "scripts/screen.install.js",
			// called when all files have finished loading and executing
			complete: function () {
				swapGame.game.setup();
				// show the first screen
				if (Modernizr.standalone) {
					swapGame.game.showScreen("splash-screen", getLoadProgress);
				} else {
					swapGame.game.showScreen("install-screen");
				}
			}
		}
	]);
	
	// loading stage 2
	if (Modernizr.standalone) {
		Modernizr.load([
		{
			test : Modernizr.canvas,
			yep : "loader!scripts/display.canvas.js",
			nope: "loader!scripts/display.dom.js"
		},{
			test : Modernizr.webworkers,
			yep : [
				"loader!scripts/board.worker.interface.js",
				"preload!scripts/board.worker.js"
			],
			nope : "loader!scripts/board.js"
		}, {
			load : [
			"loader!scripts/display.canvas.js",
            "loader!scripts/screen.main-menu.js",
            "loader!scripts/screen.game.js",
            "loader!images/blocks"
                + swapGame.settings.blockSize + ".png"
			]
		}
		]);
	}
	
}, false);