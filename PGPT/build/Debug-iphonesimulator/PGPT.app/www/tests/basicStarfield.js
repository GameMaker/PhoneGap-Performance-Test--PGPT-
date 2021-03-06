var debugOn, body, clipFrameLeft, testFrame, starfield, modeButton, moveMode, framerateDisplay, framerateInterval, framerateLow, framerateHigh, framerateAvg, lastTick, tickDuration, framerateDisplayUpdateFrequency, framerateDisplayUpdateCounter, thisTick, frameDuration, currentFramerate;

/* Updates the framerate display - is called every tickDuration milliseconds via setInterval */
function updateFramerateDisplay() {
	framerateDisplay.innerHTML = "Time since last tick: " + frameDuration + "<br>Framerate: " + currentFramerate + "<br>High Framerate: " + framerateHigh + "<br>Low framerate: " + framerateLow;
}

/* Calculate and track the current performance. Does NOT update the onscreen readout,
 * but DOES call the function to do so if appropriate. */
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

function updateFramerateJS() {
	/* First, do the basic framerate update - we need to do this so that the global variables
	 * are set with the duration of the last frame, so that we can move the starfield
	 * the correct amount. This should produce an even velocity of starfield movement, even
	 * if the framerate drops.
	 */
	updateFramerate();
	/* Now we know how long the last frame took (frameDuration). We use that to move the
	 * starfield the correct amount. frameDuration is the # of milliseconds since last update,
	 * and we want to move it 10 px / sec, or 1 px / 100ms, or .01px/ms.
	 * 
	 */
	clipFrameLeft += frameDuration * 0.01;

	/* 'scrolling' in this case requires two steps:
	 * 1- move the object to the left
	 * 2- move the clip window into the larger starfield by an equivalent amount
	 */	
	starfield.style.left = starfield.style.left.slice(0,-2) - (frameDuration * 0.01) + "px";
	starfield.style.clip = "rect(0px " + (clipFrameLeft + 479) + "px 298px " + clipFrameLeft + "px)", bar=(300 - clipFrameLeft) + "px";
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
	/* This ended up being about the only difference between CSS and JS -
	 * here in the CSS test, we use the CSS style with the webkit animation.
	 */
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
	starfield.style.left = "0px";
	starfield.style.position = "absolute";
	starfield.style.clip="rect(0px 478px 298px 0px)";
	clipFrameLeft = 0;
	/* Note that in this setup, we don't use the "movingStarfield" CSS class.
	 * Instead, we'll use a slightly different update function that moves the starfield by
	 * an equivalent amount.
	 */
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
	framerateInterval = setInterval(updateFramerateJS, tickDuration);
}

/* Ditch the old one before we set up the next test */
function clearStarfield() {
	testFrame.parentNode.removeChild(testFrame);
	clearInterval(framerateInterval);
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

	/* Start in CSS mode */
	moveMode = "CSS";
	initStarfieldCSS();
}