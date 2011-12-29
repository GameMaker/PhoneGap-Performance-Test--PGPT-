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

	/* Create a starfield background, and get it moving via a CSS Transform */
	starfield = document.createElement("img");
	starfield.className = "movingStarfield";
	starfield.src = "media/images/starfield-actual.jpg";
	frame.appendChild(starfield);
	
	
}