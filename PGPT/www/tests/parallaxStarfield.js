/*global body: true, lastTick: true, tickDuration: true, framerateDisplayUpdateCounter: true, framerateDisplayUpdateFrequency: true, moveMode: true,
 initStarfieldJS: true, numOfStars: true, clearMainMenu: false, window: false, console: false, frameDuration: false, testFrame: false*/

var addStarButton, add10StarsButton, removeStarButton, remove10StarsButton, starCountDisplay, starlist;

function resetStar(star) {
	var size;
	/* We're going to overload the zIndex - smaller stars are farther away, so we'll use zIndex in
	 * the update function to determine how much to move the star as well.
	 */
	size = Math.floor((Math.random() * 99) + 1);
	star.style.zIndex = size * -1;
	star.style.height = 0.96 * size + "px";
	star.style.width = 0.96 * size + "px";
	star.style.marginLeft = "400px";
	/* This probably allows some percentage of stars to be generated offscreen. Whatevs. */
	star.style.marginTop = -90 + Math.random() * 390 + "px";

}

function addStar() {
	var newStar = document.createElement("img");
	newStar.src = "media/images/star.png";
	newStar.className = "floatingSprite";
	resetStar(newStar);
	console.log("Adding star size " + newStar.style.zIndex * -1 + " at " + newStar.style.marginLeft + ", " + newStar.style.marginTop);
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

function addStarUI() {
	/* Add buttons to add/display/remove stars to the starfield */
	/* Button to remove 10 stars */
	remove10StarsButton = document.createElement("div");
	remove10StarsButton.className = "buttonDefault buttonSmall buttonEnabled";
	remove10StarsButton.style.marginLeft = "55px";
	remove10StarsButton.style.marginTop = "250px";
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
	removeStarButton.style.marginLeft = "100px";
	removeStarButton.style.marginTop = "250px";
	removeStarButton.innerHTML = "-";
	removeStarButton.onclick = removeStar;
	testFrame.appendChild(removeStarButton);
	/* Display area for the number of stars in the scene */
	starCountDisplay = document.createElement("div");
	starCountDisplay.className = "buttonDefault buttonMedium buttonDisabled";
	starCountDisplay.style.marginLeft = "145px";
	starCountDisplay.style.marginTop = "250px";
	starCountDisplay.innerHTML = "# Stars: " + numOfStars;
	testFrame.appendChild(starCountDisplay);
	/* Button to add a star */
	addStarButton = document.createElement("div");
	addStarButton.className = "buttonDefault buttonSmall buttonEnabled";
	addStarButton.style.marginLeft = "350px";
	addStarButton.style.marginTop = "250px";
	addStarButton.innerHTML = "+";
	addStarButton.onclick = addStar;
	testFrame.appendChild(addStarButton);
	/* Button to add 10 star */
	add10StarsButton = document.createElement("div");
	add10StarsButton.className = "buttonDefault buttonSmall buttonEnabled";
	add10StarsButton.style.marginLeft = "395px";
	add10StarsButton.style.marginTop = "250px";
	add10StarsButton.innerHTML = "+10";
	add10StarsButton.onclick = function() {
		var i;
		for( i = 0; i < 10; i++) {
				addStar();
		}
	};
	testFrame.appendChild(add10StarsButton);
}

function updateParallaxStars() {
	var i = 0, starPosition;
	while(i < starlist.length) {
		// First, we determine the star's horizontal position by stripping off the 'px' from it's location:
		starPosition = starlist[i].style.marginLeft.slice(0, -2);
		// then move it...
		starlist[i].style.marginLeft = starPosition - (-0.01 * frameDuration * starlist[i].style.zIndex) + "px";
		// then check and see if it's offscreen.
		if(starPosition < ((starlist[i].style.width.slice(0, -2)) * -1)) {
			/* It's offscreen - move it to the right. */
			resetStar(starlist[i]);
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
	addStarUI();
}