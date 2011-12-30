var debugOn, framerateDisplay, framerateInterval, lastTick, tickDuration;

/* Updates the framerate display - is called every tickDuration milliseconds via setInterval */
function updateFramerateDisplay() {
	var thisTick;
	thisTick = new Date().getTime();
	framerateDisplay.innerHTML = "Time since last Tick: " + (thisTick - lastTick) + "<br>Framerate: " + Math.round(1000 / (thisTick - lastTick));
	lastTick = thisTick;
}

/* Initialize the framerate reporting system and turn it on */
function startFramerateUpdate() {
	lastTick = new Date().getTime();
	framerateInterval = setInterval(updateFramerateDisplay, tickDuration);
}

/* Turn off the framerate reporting system. */
function stopFramerateUpdate() {
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
	startFramerateUpdate();
}