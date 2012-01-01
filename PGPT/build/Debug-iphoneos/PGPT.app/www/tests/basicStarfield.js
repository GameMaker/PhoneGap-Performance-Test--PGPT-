/*global body: true, lastTick: true, tickDuration: true, framerateDisplayUpdateCounter: true, framerateDisplayUpdateFrequency: true, moveMode: true,
 initStarfieldJS: true, clearMainMenu: false, window: false, console: false, modeButton: true, toggleMoveMode: false*/
/* Entry point. */
function toggleBasicMode() {
	toggleMoveMode();
	modeButton.onclick = toggleBasicMode;
	modeButton.className = "simpleToggleButton buttonEnabled";
}
function initBasicStarfield() {
	clearMainMenu();

	initStarfieldJS();

	modeButton.onclick = toggleBasicMode;
	modeButton.className = "simpleToggleButton buttonEnabled";

}