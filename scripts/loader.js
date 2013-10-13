var swapGame = {
	screens:{},
	settings:{
		rows:8,
		cols:8,
		baseScore:100,
		numBlockTypes:7
	}
};

// wait until main document is loaded
window.addEventListener("load", function () {
	
	// function test if the user has the option to install the application but hasn't done it yet
	Modernizr.addTest("standalone", function () {
		return (window.navigator.standalone != false);
	});
	
	// loading stage 1
	Modernizr.load([
		{
			// these files are always loaded
			load: [
				"scripts/sizzle.js",
				"scripts/dom.js",
				"scripts/game.js",
				"scripts/screen.splash.js",
				"scripts/screen.main-menu.js"
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
					swapGame.game.showScreen("splash-screen");
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
			load: [
				"scripts/screen.main-menu.js",
				"scripts/board.js"
			]
		}
		]);
	}
	
}, false);