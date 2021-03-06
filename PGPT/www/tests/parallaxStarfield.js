/*global body: true, lastTick: true, tickDuration: true, framerateDisplayUpdateCounter: true, framerateDisplayUpdateFrequency: true, moveMode: true,
 initStarfieldJS: true, numOfStars: true, clearMainMenu: false, window: false, console: false, frameDuration: false, testFrame: false,
 opacityButton: true, toggleOpacityMode: false, opacityMode: false, addStarUI: false, toggleMoveMode: false, modeButton: true,
 updateParallaxStars: false, scalingButton: true, toggleScaling: true, toggleScalingMode: false, scalingMode: false */

var topPadding, addStarButton, add10StarsButton, add100StarsButton, removeStarButton, remove10StarsButton, remove100StarsButton, starCountDisplay, starlist;

function resetStarJS(star) {
	var size;
	/* We're going to overload the zIndex - smaller stars are farther away, so we'll use zIndex in
	 * the update function to determine how much to move the star as well.
	 */
	size = Math.floor((Math.random() * 99) + 1);
	star.style.zIndex = size * -1;
	if(scalingMode) {
		star.style.height = 0.96 * size + "px";
		star.style.width = 0.96 * size + "px";
	}
	star.style.marginLeft = "480px";
	/* This probably allows some percentage of stars to be generated offscreen. Whatevs. */
	star.style.marginTop = topPadding - 50 + Math.random() * 300 + "px";
	if(opacityMode) {
		star.style.opacity = size / 100;
	}
}

function addStarJS() {
	var newStar = document.createElement("img");
	newStar.src = "media/images/star.png";
	newStar.className = "floatingSprite";
	resetStarJS(newStar);
	// console.log("Adding star size " + newStar.style.zIndex * -1 + " at " + newStar.style.marginLeft + ", " + newStar.style.marginTop);
	testFrame.appendChild(newStar);

	starlist.push(newStar);
	starCountDisplay.innerHTML = "# Stars: " + starlist.length;
}

function removeStar() {
	var theStar = starlist.pop();

	if(!theStar) {
		return;
	}
	theStar.parentNode.removeChild(theStar);

	starCountDisplay.innerHTML = "# Stars: " + starlist.length;
}

function toggleOpacity() {
	var i = 0;

	toggleOpacityMode();

	while(i < starlist.length) {
		if(opacityMode) {
			starlist[i].style.opacity = starlist[i].style.zIndex / -100;
		} else {
			starlist[i].style.opacity = 1;
		}
		i++;
	}
}

function toggleScaling() {
	var i = 0;

	toggleScalingMode();

	while(i < starlist.length) {
		if(scalingMode) {
			starlist[i].style.height = -0.96 * starlist[i].style.zIndex + "px";
			starlist[i].style.width = -0.96 * starlist[i].style.zIndex + "px";
		} else {
			starlist[i].style.height = "96px";
			starlist[i].style.width = "96px";
		}
		i++;
	}
}

function removeAllStars() {
	var temp;
	while(starlist.length) {
		temp = starlist.pop();
		temp.parentNode.removeChild(temp);
	}
}

function toggleMode() {
	removeAllStars();
	/* The page is 'flow'ed differently if you're using CSS vs. JS for placement.
	 * The buttons are shown AFTER (i.e. below) the starfield in CSS mode, but
	 * directly on top of the starfield in JS mode. In other words, a Y coordinate
	 * of "0" means "top of the screen" in JS mode, but "after the last element"
	 * or "bottom of the screen" in CSS mode. So we need to choose our marginTop
	 * padding appropriately. This needs to be global as it will also be used
	 * during star generation.
	 */
	switch (moveMode) {
		case "JS":
			toggleMoveMode();
			topPadding = -302;
			break;
		case "CSS":
			toggleMoveMode(updateParallaxStars);
			topPadding = 0;
			break;
	}
	addStarUI();
}

function addStarUI() {
	/* Add buttons to add/display/remove stars to the starfield */
	/* Button to remove 100 stars */
	remove100StarsButton = document.createElement("div");
	remove100StarsButton.className = "buttonDefault buttonSmall buttonEnabled";
	remove100StarsButton.style.marginLeft = "5px";
	remove100StarsButton.style.marginTop = (topPadding + 250) + "px";
	remove100StarsButton.innerHTML = "-100";
	// remove100StarsButton.position = "absolute";
	remove100StarsButton.onclick = function() {
		var i;
		for( i = 0; i < 100; i++) {
			if(starlist.length > 0) {
				removeStar();
			}
		}
	};
	testFrame.appendChild(remove100StarsButton);
	/* Button to remove 10 stars */
	remove10StarsButton = document.createElement("div");
	remove10StarsButton.className = "buttonDefault buttonSmall buttonEnabled";
	remove10StarsButton.style.marginLeft = "50px";
	remove10StarsButton.style.marginTop = (topPadding + 250) + "px";
	remove10StarsButton.innerHTML = "-10";
	remove10StarsButton.onclick = function() {
		var i;
		for( i = 0; i < 10; i++) {
			if(starlist.length > 0) {
				removeStar();
			}
		}
	};
	testFrame.appendChild(remove10StarsButton);
	/* Button to remove a star */
	removeStarButton = document.createElement("div");
	removeStarButton.className = "buttonDefault buttonSmall buttonEnabled";
	removeStarButton.style.marginLeft = "95px";
	removeStarButton.style.marginTop = (topPadding + 250) + "px";
	removeStarButton.innerHTML = "-";
	removeStarButton.onclick = removeStar;
	testFrame.appendChild(removeStarButton);
	/* Display area for the number of stars in the scene */
	starCountDisplay = document.createElement("div");
	starCountDisplay.className = "buttonDefault buttonMedium buttonDisabled";
	starCountDisplay.style.marginLeft = "140px";
	starCountDisplay.style.marginTop = (topPadding + 250) + "px";
	starCountDisplay.innerHTML = "# Stars: " + numOfStars;
	testFrame.appendChild(starCountDisplay);
	/* Button to add a star */
	addStarButton = document.createElement("div");
	addStarButton.className = "buttonDefault buttonSmall buttonEnabled";
	addStarButton.style.marginLeft = "345px";
	addStarButton.style.marginTop = (topPadding + 250) + "px";
	addStarButton.innerHTML = "+";
	addStarButton.onclick = addStarJS;
	testFrame.appendChild(addStarButton);
	/* Button to add 10 star */
	add10StarsButton = document.createElement("div");
	add10StarsButton.className = "buttonDefault buttonSmall buttonEnabled";
	add10StarsButton.style.marginLeft = "390px";
	add10StarsButton.style.marginTop = (topPadding + 250) + "px";
	add10StarsButton.innerHTML = "+10";
	add10StarsButton.onclick = function() {
		var i;
		for( i = 0; i < 10; i++) {
			addStarJS();
		}
	};
	testFrame.appendChild(add10StarsButton);
	/* Button to add 100 star */
	add100StarsButton = document.createElement("div");
	add100StarsButton.className = "buttonDefault buttonSmall buttonEnabled";
	add100StarsButton.style.marginLeft = "435px";
	add100StarsButton.style.marginTop = (topPadding + 250) + "px";
	add100StarsButton.innerHTML = "+100";
	add100StarsButton.onclick = function() {
		var i;
		for( i = 0; i < 100; i++) {
			addStarJS();
		}
	};
	testFrame.appendChild(add100StarsButton);

	/* Overload the toggle buttons to point to test-specific stuff */
	modeButton.onclick = toggleMode;
	modeButton.className = "simpleToggleButton buttonEnabled";

	/* Also need to enable the toggle opacity UI button */
	opacityButton.className = "simpleToggleButton buttonEnabled";
	opacityButton.onclick = toggleOpacity;

	/* Also need to enable the toggle scale UI button */
	scalingButton.className = "simpleToggleButton buttonEnabled";
	scalingButton.onclick = toggleScaling;
}

function updateParallaxStars() {
	var i = 0, starPosition, starVelocity;
	while(i < starlist.length) {
		// First, we determine the star's horizontal position by stripping off the 'px' from it's location:
		starPosition = starlist[i].style.marginLeft.slice(0, -2);
		// then move it...and remember that zIndex is a negative, which is why we get movement to the left!
		starVelocity = (-0.006 * starlist[i].style.zIndex) * frameDuration;
		starlist[i].style.marginLeft = starPosition - starVelocity + "px";
		// then check and see if it's offscreen.
		if(starPosition < -50) {
			/* It's offscreen - move it to the right. */
			resetStarJS(starlist[i]);
		}
		i++;
	}
}

/* Entry point. */
function initParallaxStarfield() {
	clearMainMenu();

	/* Allows us to keep track of the number of parallaxing stars we want onscreen, between modes */
	numOfStars = 0;
	starlist = [];

	initStarfieldJS(updateParallaxStars);
	topPadding = 0;
	addStarUI();
}