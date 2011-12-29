<h1>PGPT - The *P*hone*G*ap *P*erformance *T*ester</h1>

<h2>SUMMARY</h4>
This project is meant to facilitate discussion about best practices for building games on PhoneGap.

Its focus is to allow users to tweak and twiddle to see what changes affect performance the most, so we can make informed decisions in our architectures. It is specifically targetted at the creation of smoothly animated interactive games at (hopefully) native speeds.

<h4>LICENSE</h4>
This code is free. Take it, copy it, use it, learn from it.

Then add to it. Discuss it. Dissect it. Improve it.

<h4>DISCUSSION</h4>
I'm trying to test the viability of PG as a game platform for mobile games. I am getting conflicting information as to whether HTML5 & Javascript are ready for prime time. I am willing to give up a certain amount of performance in exchange for the cross-platform capabilities of PG, however there is a certain bar that must be cleared before a game can be released. If the framerate is too low, or the game is unresponsive, it will fail. It would be better in that case to write a 100% native app.

Along these lines, some of the questions I want to answer are:
* Can an HTML/Javascript PhoneGa app create smooth scrolling performance at native speeds?
* Which is better: CSS transforms vs. manual handling of DOM (Image) objects on various devices, and by how much?
* How do various properties of a frame impact framerate, such as:
** number of sprites
** size of sprites
** overdraw
** opacity
** movement
** memory management (creation of new particles, etc.)
