var debugOn, body, testFrame, starfield, modeButton, moveMode, framerateDisplay, framerateInterval, framerateLow, framerateHigh, framerateAvg, lastTick, tickDuration, framerateDisplayUpdateFrequency, framerateDisplayUpdateCounter, thisTick, frameDuration, currentFramerate;

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

/* Set up the starfield using CSS. */
function initStarfieldCSS() {
	console.log("Initting CSS");
	/* Create the background starfield */
	/* First create a container that will do the clipping for us via overflow:hidden */
	testFrame = document.createElement("div");
	testFrame.className = "frameContainer";
	body.appendChild(testFrame);

	/* Add a framerate display */
	framerateDisplay = document.createElement("div");
	framerateDisplay.className = "framerateDisplay";
	framerateDisplay.style.zIndex = 10;
	framerateDisplay.innerHTML = "<center>Stand by<br>for<br>framerate... ";
	testFrame.appendChild(framerateDisplay);

	/* Add a button to toggle CSS / JS movement */
	modeButton = document.createElement("div");
	modeButton.className = "simpleToggleButton";
	modeButton.style.marginLeft = "300px";
	modeButton.style.marginTop = "20px";
	modeButton.innerHTML = "Move mode: " + moveMode;
	modeButton.onclick = toggleMoveMode;
	testFrame.appendChild(modeButton);

	/* Create a starfield background, and get it moving via a CSS Transform */
	starfield = document.createElement("img");
	starfield.style.zIndex = -10;
	starfield.className = "movingStarfield";
	starfield.src = "media/images/starfield-actual.jpg";
	testFrame.appendChild(starfield);

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

/* Set up the starfield using JavaScript. */
function initStarfieldJS() {
	console.log("Initting JS");
	/* Create the background starfield */
	/* First create a container that will do the clipping for us via overflow:hidden */
	testFrame = document.createElement("div");
	testFrame.className = "frameContainer";
	body.appendChild(testFrame);

	/* Add a framerate display */
	framerateDisplay = document.createElement("div");
	framerateDisplay.className = "framerateDisplay";
	framerateDisplay.style.zIndex = 10;
	framerateDisplay.innerHTML = "<center>Stand by<br>for<br>framerate... ";
	testFrame.appendChild(framerateDisplay);

	/* Add a button to toggle CSS / JS movement */
	modeButton = document.createElement("div");
	modeButton.className = "simpleToggleButton";
	modeButton.style.marginLeft = "300px";
	modeButton.style.marginTop = "20px";
	modeButton.innerHTML = "Move mode: " + moveMode;
	modeButton.onclick = toggleMoveMode;
	testFrame.appendChild(modeButton);

	/* Create a starfield background, and get it moving via a CSS Transform */
	starfield = document.createElement("img");
	starfield.style.zIndex = -10;
	starfield.className = "movingStarfield";
	starfield.src = "media/images/starfield-actual.jpg";
	testFrame.appendChild(starfield);

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

/* Ditch the old one before we set up the next test */
function clearStarfield() {
	testFrame.parentNode.removeChild(testFrame);
}

function toggleMoveMode() {
	console.log("Tapped on mode in mode " + moveMode);
	switch (moveMode) {
		case "CSS":
			moveMode = "JS";
			clearStarfield();
			initStarfieldJS();
			break;
		case "JS":
			moveMode = "CSS";
			clearStarfield();
			initStarfieldCSS();
			break;
	}
}

/* Entry point. */
function initBasicStarfield() {
	var theMainMenu;
	theMainMenu = document.getElementById("mainMenuContainer");
	theMainMenu.parentNode.removeChild(theMainMenu);
	body = document.getElementsByTagName("body")[0];

	/* Turn on the framerate counter */

	/* TickDuration holds the # of milliseconds before we will attempt to check framerate again.
	 * I'm using 1 for now, so that we get the best possible reading.
	 */
	tickDuration = 1;

	/* Counter is a temp variable. We will only update the framerate display every
	 * framerateDisplayUpdateFrequency ticks of the framerate checking function.
	 */
	framerateDisplayUpdateCounter = 0;
	framerateDisplayUpdateFrequency = 100;
	framerateInterval = setInterval(updateFramerate, tickDuration);
	
	/* Start in CSS mode */
	moveMode = "CSS"
	initStarfieldCSS();
}