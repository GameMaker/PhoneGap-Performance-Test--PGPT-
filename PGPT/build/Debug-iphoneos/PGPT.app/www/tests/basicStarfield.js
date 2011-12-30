var debugOn, framerateDisplay, framerateInterval, framerateLow, framerateHigh, framerateAvg, lastTick, tickDuration, framerateDisplayDuration, thisTick, frameDuration, currentFramerate;

function updateFramerate() {
	thisTick = new Date().getTime();
	frameDuration = thisTick - lastTick;
	currentFramerate = Math.round(1000 / frameDuration);
	lastTick = thisTick;
	if(currentFramerate > framerateHigh) {
		framerateHigh = currentFramerate;
	}
	if(currentFramerate < framerateLow) {
		framerateLow = currentFramerate;
	}
}

/* Updates the framerate display - is called every tickDuration milliseconds via setInterval */
function updateFramerateDisplay() {
	framerateDisplay.innerHTML = "Time since last Tick: " + frameDuration + "<br>Framerate: " + currentFramerate + "<br>High Framerate: " + framerateHigh + "<br>Low framerate: " + framerateLow;
}

/* Initialize the framerate reporting system and turn it on */
function startFramerateDisplayUpdate() {
	framerateInterval = setInterval(updateFramerateDisplay, framerateDisplayDuration);
}

/* Turn off the framerate reporting system. */
function stopFramerateDisplayUpdate() {
	clearInterval(framerateInterval);
}

/* Entry point. */
function InitStarfieldCSS() {
	var theMainMenu, starfield, body, frame;
	theMainMenu = document.getElementById("mainMenuContainer");
	theMainMenu.parentNode.removeChild(theMainMenu);
	body = document.getElementsByTagName("body")[0];

	/* Create the background starfield */
	/* First create a container that will do the clipping for us via overflow:hidden */
	frame = document.createElement("div");
	frame.className = "frameContainer";
	body.appendChild(frame);

	/* Add a framerate display */
	framerateDisplay = document.createElement("div");
	framerateDisplay.className = "framerateDisplay";
	framerateDisplay.style.zIndex = 10;
	framerateDisplay.innerHTML = "FRAMERATE: ";
	frame.appendChild(framerateDisplay);

	/* Create a starfield background, and get it moving via a CSS Transform */
	starfield = document.createElement("img");
	starfield.style.zIndex = -10;
	starfield.className = "movingStarfield";
	starfield.src = "media/images/starfield-actual.jpg";
	frame.appendChild(starfield);

	/* Turn on the framerate counter */
	debugOn = true;
	tickDuration = 1;
	/* Hack - I'm concerned that if we start measuring the max/min framerate right away, we will get
	 * spurious readings during initialization. So I'm going to re-set the high and low once we're underway,
	 * (1 second in) which should give us a better reading of high/lows during execution only.
	 */
	framerateDisplayDuration = 100;
	setTimeout(function() {
		framerateHigh = 0;
		framerateLow = 100000;
	}, 1000);
	lastTick = new Date().getTime();
	setInterval(updateFramerate, tickDuration);
	startFramerateDisplayUpdate();
	framerateInterval = setInterval(updateFramerateDisplay, framerateDisplayDuration);
}