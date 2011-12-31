/*global window: false, console: false, toggleMoveMode: false, toggleOpacityMode, false */
var opacityButton, opacityMode, jsUpdateCallback, numOfStars, debugOn, body, clipFrameLeft, testFrame, starfield, modeButton, moveMode, framerateDisplay, framerateInterval, framerateLow, framerateHigh, framerateAvg, lastTick, tickDuration, framerateDisplayUpdateFrequency, framerateDisplayUpdateCounter, thisTick, frameDuration, currentFramerate;

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
	 * and we want to move it 30 px / sec, or 1 px / 33.3ms, or .03px/ms.
	 *
	 */
	clipFrameLeft += frameDuration * 0.03;

	/* 'scrolling' in this case requires two steps:
	 * 1- move the object to the left
	 * 2- move the clip window into the larger starfield by an equivalent amount
	 */
	/* need to adjust for browser size... */
	starfield.style.left = (((window.innerWidth - 480) / 2) - (clipFrameLeft)) + "px";
	// starfield.style.left = starfield.style.left.slice(0,-2) - (frameDuration * 0.03) + "px";
	starfield.style.clip = "rect(0px " + (clipFrameLeft + 479) + "px 298px " + clipFrameLeft + "px)";

	if(jsUpdateCallback) {
		jsUpdateCallback();
	}
}

/* Initialize the framerate reporting system and turn it on
 Not currently used - in the future I could see wanting to turn the debug pane on and off. */
function startFramerateDisplayUpdate() {
	debugOn = true;
}

/* Turn off the framerate reporting system.
 Not currently used. */
function stopFramerateDisplayUpdate() {
	debugOn = false;
}

function setUpUI() {
	/* Add a framerate display */
	framerateDisplay = document.createElement("div");
	framerateDisplay.className = "framerateDisplay";
	framerateDisplay.style.zIndex = 10;
	framerateDisplay.innerHTML = "<center>Stand by<br>for<br>framerate... ";
	testFrame.appendChild(framerateDisplay);

	/* Add a button to toggle CSS / JS movement */
	modeButton = document.createElement("div");
	modeButton.className = "simpleToggleButton buttonDisabled";
	modeButton.style.marginLeft = "300px";
	modeButton.style.marginTop = "10px";
	modeButton.innerHTML = "Move mode: " + moveMode;
	testFrame.appendChild(modeButton);

	/* Add a button to toggle opacity */
	opacityButton = document.createElement("div");
	opacityButton.className = "simpleToggleButton buttonDisabled";
	opacityButton.style.marginLeft = "300px";
	opacityButton.style.marginTop = "55px";
	opacityButton.innerHTML = "Opacity: " + opacityMode;
	testFrame.appendChild(opacityButton);
}

/* Set up the starfield using CSS. */
function initStarfieldCSS() {
	// console.log("Initting CSS");
	/* Create the background starfield */
	/* First create a container that will do the clipping for us via overflow:hidden */
	testFrame = document.createElement("div");
	testFrame.className = "frameContainer";
	body.appendChild(testFrame);

	setUpUI();

	/* Create a starfield background, and get it moving via a CSS Transform */
	starfield = document.createElement("img");
	starfield.style.zIndex = -1000;
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
	}, 1000);
	/* Counter is a temp variable. We will only update the framerate display every
	 * framerateDisplayUpdateFrequency ticks of the framerate checking function.
	 */
	framerateDisplayUpdateCounter = 0;
	framerateDisplayUpdateFrequency = 100;
	framerateInterval = setInterval(updateFramerate, tickDuration);
}

/* Set up the starfield using JavaScript. */
function initStarfieldJS(callback) {
	// console.log("Initting JS");
	/* If the test needs a callback every update, then we'll apply it, otherwise, leave it null */
	if(callback) {
		jsUpdateCallback = callback;
	} else {
		jsUpdateCallback = null;
	}
	/* Create the background starfield */
	/* First create a container that will do the clipping for us via overflow:hidden */
	testFrame = document.createElement("div");
	testFrame.className = "frameContainer";
	body.appendChild(testFrame);

	setUpUI();

	/* Create a starfield background, and get it moving via a CSS Transform */
	starfield = document.createElement("img");
	starfield.style.zIndex = -1000;
	starfield.style.position = "absolute";
	starfield.style.clip = "rect(0px 478px 298px 0px)";
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
	}, 1000);
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

function toggleMoveMode(callback) {
	switch (moveMode) {
		case "CSS":
			moveMode = "JS";
			clearStarfield();
			if(callback) {
				initStarfieldJS(callback);
			} else {
				initStarfieldJS();
			}
			break;
		case "JS":
			moveMode = "CSS";
			clearStarfield();
			initStarfieldCSS();
			break;
	}
}

function toggleOpacityMode() {
	opacityMode = !opacityMode;
	opacityButton.innerHTML = "Opacity: " + opacityMode;
}

/* Get rid of the main menu */
function clearMainMenu() {
	var theMainMenu;
	theMainMenu = document.getElementById("mainMenuContainer");
	theMainMenu.parentNode.removeChild(theMainMenu);
	body = document.getElementsByTagName("body")[0];
}

function initTestHarness() {
	/* Seed the time of the 'last' update, otherwise our first duration will be NaN */
	lastTick = new Date().getTime();
	/* TickDuration holds the # of milliseconds before we will attempt to check framerate again.
	 * I'm using 1 for now, so that we get the best possible reading.
	 */
	tickDuration = 1;
	moveMode = "JS";
	opacityMode = false;

	/* Counter is a temp variable. We will only update the framerate display every
	 * framerateDisplayUpdateFrequency ticks of the framerate checking function.
	 */
	framerateDisplayUpdateCounter = 0;
	framerateDisplayUpdateFrequency = 1000;

	console.log("Done initialiazing the base PGPT test harness.");
}