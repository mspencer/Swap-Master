swapGame.audio = (function () {
	var dom = swapGame.dom,
		extension,
		sounds,
		activeSounds;

	function initialise () {
		extension = formatTest();
		if (!extension) {
			return;
		}
		sounds = {};
		activeSounds = [];
	}

	function formatTest () {
		var exts = ["ogg", "mp3"],
			i;
		for (i = 0; i < exts.length; i++) {
			if (Modernizr.audio[exts[i]] == "probably") {
				return exts[i];
			}
		}
		for (i = 0; i < exts.length; i++) {
			if (Modernizr.audio[exts[i]] == "maybe") {
				return exts[i];
			}
		}
	}

	function createAudio (thename) {
		var el = new Audio("sounds/" + thename + "." + extension);
		dom.bind(el, "ended", cleanActive);
		sounds[thename] = sounds[thename] || [];
		sounds[thename].push(el);

		return el;
	}

	function getAudioElement (thename) {
		if (sounds[thename]) {
			for (var i = 0, n = sounds[thename].length; i < n; i++) {
				if (sounds[thename][i].ended) {
					return sounds[thename][i];
				}
			}
		}
		return createAudio(thename);
	}

	function cleanActive() {
		for (var i = 0; i < activeSounds; i++) {
			if (activeSounds[i].ended) {
				activeSounds.splice(i, 1);
			}
		}
	}

	function play (thename) {
		var audio = getAudioElement(thename);
		audio.play();
		activeSounds.push(audio);
	}

	function stop () {
		for (var i = activeSounds.length-1; i >= 0; i--) {
			activeSounds[i].stop();
		}
		activeSounds = [];
	}

	return {
		initialise: initialise,
		play: play,
		stop: stop
	};
})();