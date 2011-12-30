/*global body: true, lastTick: true, tickDuration: true, framerateDisplayUpdateCounter: true, framerateDisplayUpdateFrequency: true, moveMode: true,
 initStarfieldJS: true, numOfStars: true, clearMainMenu: false*/

/* Entry point. */
function initParallaxStarfield() {
	clearMainMenu();
	
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

	/* Allows us to keep track of the number of parallaxing stars we want onscreen, between modes */
	numOfStars = 0;

	/* Start in CSS mode */
	moveMode = "JS";
	initStarfieldJS();
}