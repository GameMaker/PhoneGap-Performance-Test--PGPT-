var debugOn, modeButton, moveMode, framerateDisplay, framerateInterval, framerateLow, framerateHigh, framerateAvg, lastTick, tickDuration, framerateDisplayUpdateFrequency, framerateDisplayUpdateCounter, thisTick, frameDuration, currentFramerate;

/* Updates the framerate display - is called every tickDuration milliseconds via setInterval */
function updateFramerateDisplay() {
	framerateDisplay.innerHTML = "Time since last tick: " + frameDuration + "<br>Framerate: " + currentFramerate + "<br>High Framerate: " + framerateHigh + "<br>Low framerate: " + framerateLow;
}

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
	if(debugOn) {
		framerateDisplayUpdateCounter += 1;
		if(framerateDisplayUpdateCounter === framerateDisplayUpdateFrequency) {
			framerateDisplayUpdateCounter = 0;
			updateFramerateDisplay();
		}
	}
}

/* Initialize the framerate reporting system and turn it on */
function startFramerateDisplayUpdate() {
	debugOn = true;
}

/* Turn off the framerate reporting system. */
function stopFramerateDisplayUpdate() {
	debugOn = false;
}

function toggleMoveMode() {
	alert("that tickled!");
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
	framerateDisplay.innerHTML = "<center>Stand by<br>for<br>framerate... ";
	frame.appendChild(framerateDisplay);

	/* Add a button to toggle CSS / JS movement */
	modeButton = document.createElement("div");
	modeButton.className = "simpleToggleButton";
	modeButton.style.marginLeft = "300px";
	modeButton.style.marginTop = "20px";
	moveMode = "CSS";
	modeButton.innerHTML = "Move mode: " + moveMode;
	modeButton.onclick = toggleMoveMode;
	frame.appendChild(modeButton);

	/* Create a starfield background, and get it moving via a CSS Transform */
	starfield = document.createElement("img");
	starfield.style.zIndex = -10;
	starfield.className = "movingStarfield";
	starfield.src = "media/images/starfield-actual.jpg";
	frame.appendChild(starfield);

	/* Turn on the framerate counter */
	/* TickDuration holds the # of milliseconds before we will attempt to check framerate again.
	 * I'm using 1 for now, so that we get the best possible reading.
	 */
	tickDuration = 1;
	/* Hack - I'm concerned that if we start measuring the max/min framerate right away, we will get
	 * spurious readings during initialization. So I'm going to re-set the high and low once we're underway,
	 * (1 second in) which should give us a better reading of high/lows during execution only.
	 */
	setTimeout(function() {
		framerateHigh = 0;
		framerateLow = 100000;
		startFramerateDisplayUpdate();
	}, 3000);
	/* Counter is a temp variable. We will only update the framerate display every
	 * framerateDisplayUpdateFrequency ticks of the framerate checking function.
	 */
	framerateDisplayUpdateCounter = 0;
	framerateDisplayUpdateFrequency = 100;
	framerateInterval = setInterval(updateFramerate, tickDuration);
}