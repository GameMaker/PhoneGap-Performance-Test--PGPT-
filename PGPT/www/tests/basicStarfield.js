/*global body: true, lastTick: true, tickDuration: true, framerateDisplayUpdateCounter: true, framerateDisplayUpdateFrequency: true, moveMode: true,
   initStarfieldJS: true, clearMainMenu: false*/
/* Entry point. */
function initBasicStarfield() {
	clearMainMenu();

	/* Start in JS mode */
	moveMode = "JS";
	initStarfieldJS();
}