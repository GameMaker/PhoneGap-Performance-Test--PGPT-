# PGPT - The PhoneGap Performance Tester

## SUMMARY
This project is meant to facilitate discussion about best practices for building games on PhoneGap.

Its focus is to allow users to tweak and twiddle to see what changes affect performance the most, so we can make informed decisions in our architectures. It is specifically targetted at the creation of smoothly animated interactive games at (hopefully) native speeds.

## LICENSE
This code is free. Take it, copy it, use it, learn from it.

Then add to it. Discuss it. Dissect it. Improve it.

## DISCUSSION
I'm trying to test the viability of PG as a game platform for mobile games. I am getting conflicting information as to whether HTML5 & Javascript are ready for prime time. I am willing to give up a certain amount of performance in exchange for the cross-platform capabilities of PG, however there is a certain bar that must be cleared before a game can be released. If the framerate is too low, or the game is unresponsive, it will fail. It would be better in that case to write a 100% native app.

Along these lines, some of the questions I want to answer are:
* Can an HTML/Javascript PhoneGa app create smooth scrolling performance at native speeds?
* Which is better: CSS transforms vs. manual handling of DOM (Image) objects on various devices, and by how much?
* How do various properties of a frame impact framerate, such as:
	* number of sprites
	* size of sprites
	* overdraw
	* opacity
	* movement
	* memory management (creation of new particles, etc.)

## ASSUMPTIONS AND CAVEATS

I do most of my development on an iPhone 4, so the code is written mostly in support of that platform. I could use some help with:

1. Android
1. Abstracting the code so it's less resolution-sensitive

I will try to write it so that people can add more tests to the product, run it on their own, etc. However, I'm relatively new to HTML5, JS, and PG, so will probably architect the code poorly. I could use some help with feedback on better ways to do things.

I use the browser as my 'inner loop' for development - meaning, I make changes then run it in Chrome. (Or Safari. Or whatevs.) When I have something I like, I'll build it in xCode and check it in the iPhone simulator. If it looks good, I'll check it on the iPhone.

Since it's easy to add tests, I will try to create more, simpler tests, rather than one gigantic, complex monster. I'm hoping that this will help others use this as a sort of tutorial as well, by working through the test code one at a time.

Browser testing is done on a 2011 MacBook Pro, running Snow Leapard 10.6.8.

## RESULTS
### TEST 1: BASIC SCROLLING STARFIELD
#### Process
1. Draw a starfield as a background, like you might see in a side scroller.
1. Try using a CSS animation (using -webkit-animation), measure performance.
1. Try using pure JS to control the movement of the starfield, measure performance.

#### Results
(See "Basic Starfield" in the app)
I used a SetInterval JS call to activate a framerate counter update, using an interval of 1MS. The goal is to measure how many MS pass between calls, and then derive a framerate from that. It might be interesting to see how the size of this interval impacts things once we get into more complicated tests, since overloading the CPU will be an issue. I expect this will become an area of balancing.

<table border="1px solid black" align="center" width="80%">
	<tr>
		<td align="center" width="20%"><strong>Viewer</td>
		<td align="center" width="20%"><strong>Avg. Framerate</td>
		<td align="center" width="60%"><strong>Notes</td>
	</tr>
	<tr>
		<td align="center">Chrome</td>
		<td align="center">200</td>
		<td>Screamin...clearly we need to give it more to do.</td>
	</tr>
	<tr>
		<td align="center">iPhone (5.0) Simulator</td>
		<td align="center">200</td>
		<td>Looks like still no sweat</td>
	</tr>
	<tr>
		<td align="center">iPad (5.0) Simulator</td>
		<td align="center">200</td>
		<td>Same</td>
	</tr>
	<tr>
		<td align="center">iPhone 4 (iOS 5.0.1)</td>
		<td align="center">200</td>
		<td><strong>But wait...there's a problem</td>
	</tr>
</table>

All looks well - but then I decided to add the ability to measure high/low framerate to see where the peaks and valleys took it.

I also made a change so that the framerate display would only run at 10Hz, while the framerate measuring code would run as often as it could.

The stuff on the MBP was mostly unaffected, but the iPhone started seeing huge swings in framerate:

<table border="1px solid black" align="center" width="80%">
	<tr>
		<td align="center" width="15%"><strong>Viewer</td>
		<td align="center" width="5%"><strong>High Framerate</td>
		<td align="center" width="5%"><strong>Avg. Framerate</td>
		<td align="center" width="5%"><strong>Low Framerate</td>
		<td align="center" width="60%"><strong>Notes</td>
	</tr>
	<tr>
		<td align="center">Chrome</td>
		<td align="center">250</td>
		<td align="center">200</td>
		<td align="center">91</td>
		<td>Screamin...clearly we need to give it more to do.</td>
	</tr>
	<tr>
		<td align="center">iPhone (5.0) Simulator</td>
		<td align="center">250</td>
		<td align="center">200</td>
		<td align="center">33</td>
		<td>Looks like still no sweat</td>
	</tr>
	<tr>
		<td align="center">iPad (5.0) Simulator</td>
		<td align="center">250</td>
		<td align="center">200</td>
		<td align="center">32</td>
		<td>Same</td>
	</tr>
	<tr>
		<td align="center">iPhone 4 (iOS 5.0.1)</td>
		<td align="center">Infinity</td>
		<td align="center">100</td>
		<td align="center">17</td>
		<td><strong>Biggest change is that the average framerate has been cut in half</td>
	</tr>
</table>

I have seen questionable performance with SetInterval / SetTimeout both in person and referenced on the web, so I'm calling that suspect #1.

I rework the code from a dual-interval to a single, with a counter for updates to the display.

<table border="1px solid black" align="center" width="80%">
	<tr>
		<td align="center" width="15%"><strong>Viewer</td>
		<td align="center" width="5%"><strong>High Framerate</td>
		<td align="center" width="5%"><strong>Avg. Framerate</td>
		<td align="center" width="5%"><strong>Low Framerate</td>
		<td align="center" width="60%"><strong>Notes</td>
	</tr>
	<tr>
		<td align="center">Chrome</td>
		<td align="center">Infinity</td>
		<td align="center">Infinity</td>
		<td align="center">200</td>
		<td>Screamin...clearly we need to give it more to do.</td>
	</tr>
	<tr>
		<td align="center">iPhone 4 (iOS 5.0.1)</td>
		<td align="center">1000</td>
		<td align="center">200</td>
		<td align="center">29</td>
		<td>Much better.</td>
	</tr>
</table>

So having multiple intervals/timers is not a good idea.

What if we keep the timing mechanism the same (setInterval(somefunc, 1)), but use JS to move the starfield instead of CSS?

After setting up a toggle button to switch between CSS and JS, I am not seeing a significant difference between the two. They're both seeing:

* about 200-250 FPS (reasonable, since we're doing almost nothing)
* Generally smooth movement - but NOT as smooth as native.
* Framerate fluctuations as wild as 15FPS - 1000FPS

#### My God, it's full of stars...

Ok, so now it's time to turn up the heat. Next I implemented a Parallaxing Starfield test, which builds on the Basic Starfield test, above, which was essentially inconclusive as it failed to stress the machine enough to elicit a framerate drop. (Also, of course, it's barely a copmlete test. But we start somewhere...)

The Parallaxing starfield test adds a suite of items to the UI, that allow the user to control the number of parallaxing stars that are drawn over the moving background.

The user can add or remove 1, 10, or 100 stars at a time.

Also, there is a new "use Opacity" toggle button. When off, all stars are drawn at 100% opacity. If on, stars become more translucent the further they are from the camera. I wanted to use this to test the effect of opacity on framerate.

Finally, I was concerned about the cost of scaling, so there is a similar "use scaling" toggle button that draws all stars at the same size (off) or scales them down if further away (on);

#### Breakthrough

While working on this, I discovered that there was a bug in the timing code - which was causing the iPhone to report much higher framerates than actual. Once I fixed that, the reported framerate dropped to about 25-30...which is what I was seeing onscreen - and that was in the Basic Starfield test, the simplest test of them all.

Wanting to make sure I was seeing good data, I added to the debug display:

1. a 'now()' line so that you got positive confirmation when the display was updated, and
1. a rolling average framerate of the last 10 frames (since the display is only updated every so often). This helped smooth out the variation quite a bit, and gave a more reasonable result.

With those in place, I tried the Parallax Starfield test again, and saw:
<table border="1px solid black" align="center" width="80%">
	<tr>
		<th>Parallax Test - 100 stars</th>
	</tr>
	<tr>
		<td align="center" width="40%"><strong>Viewer</td>
		<td align="center" width="15%"><strong>Mode</td>
		<td align="center" width="15%"><strong>Opacity?</td>
		<td align="center" width="15%"><strong>Scaling?</td>
		<td align="center" width="15%"><strong>Average Framerate</td>
	</tr>
	<tr>
		<td align="center" width="40%">Chrome</td>
		<td align="center" width="15%">JS</td>
		<td align="center" width="15%">Off</td>
		<td align="center" width="15%">Off</td>
		<td align="center" width="15%"><strong>145</td>
	</tr>
	<tr>
		<td align="center" width="40%">Chrome</td>
		<td align="center" width="15%">JS</td>
		<td align="center" width="15%">Off</td>
		<td align="center" width="15%"><strong>On</td>
		<td align="center" width="15%"><strong>175*</td>
	</tr>
	<tr>
		<td align="center" width="40%">Chrome</td>
		<td align="center" width="15%">JS</td>
		<td align="center" width="15%"><strong>On</td>
		<td align="center" width="15%">Off</td>
		<td align="center" width="15%"><strong>33</td>
	</tr>
	<tr>
		<td align="center" width="40%">Chrome</td>
		<td align="center" width="15%">JS</td>
		<td align="center" width="15%"><strong>On</td>
		<td align="center" width="15%"><strong>On</td>
		<td align="center" width="15%"><strong>161</td>
	</tr>
	<tr>
		<td align="center" width="40%">iPhone</td>
		<td align="center" width="15%">JS</td>
		<td align="center" width="15%">Off</td>
		<td align="center" width="15%">Off</td>
		<td align="center" width="15%"><strong>6</td>
	</tr>
	<tr>
		<td align="center" width="40%">iPhone</td>
		<td align="center" width="15%">JS</td>
		<td align="center" width="15%">Off</td>
		<td align="center" width="15%"><strong>On</td>
		<td align="center" width="15%"><strong>Reported: 21, Actual: 5**</td>
	</tr>
	<tr>
		<td align="center" width="40%">iPhone</td>
		<td align="center" width="15%">JS</td>
		<td align="center" width="15%"><strong>On</td>
		<td align="center" width="15%">Off</td>
		<td align="center" width="15%"><strong>2</td>
	</tr>
	<tr>
		<td align="center" width="40%">iPhone</td>
		<td align="center" width="15%">JS</td>
		<td align="center" width="15%"><strong>On</td>
		<td align="center" width="15%"><strong>On</td>
		<td align="center" width="15%"><strong>Reported: 15, Actual: 2**</td>
	</tr>
</table>

##### Notes
\* Interestingly, turning scaling on effectively INCREASED the framerate in Chrome. This is because the scaling in this test scales sprites _down_ dramatically, which greatly reduces the number of pixels to draw. This offset more than compensated for the computational overhead of scaling the sprite. If ther sprites were scaled _up_, I imagine that the performance would have suffered doubly - once for the scaling overhead, and again because you're drawing more pixels.

\** There were two cases in which the iPhone reported very different results from what was being displayed onscreen. Turning scaling on was the controlling factor. I am not sure what mechanism is causing the huge difference in reported vs. observed framerate, but my guess is that when the browser becomes overloaded, it drops frames and goes back to the top of the update loop. In other words, you're not guaranteed to get a screen refresh before updateFramerate() is called again.

So now I'm running into major snags. Running a test with 100 stars (a fairly heavy load, to be sure, but not unreasonable in a game with particles etc.).

#### More trouble

As I looked closer at the discrepancy between reported and actual, I started sprinkling log messages into the code to track timing of important events. In particular, I wanted to know where, in the main loop, I was spending most of my time.

The call to update the framerate was originally started via a setInterval(updateFramerate, 1), so that it would try to update as often as it could.

The issue became clear when I put in some code like this:

'
function updateFramerate() {
	log("entering update loop");
	<update the framerate and draw the stars>
	log("leaving update loop");
}
'

Remember, though, updateFramerate is supposed to be called every 1 ms - so there should be almost no time at all between the "leaving" and "entering" messages. I was expecting to see them almost on top of each other.

Instead, with 100 stars, using scaling and opacity, I was seeing delays of as much as 800+ms between one "leaving" and the next "entering" messages!

I started to have my doubts about setInterval, especially when the phone is under heavy load, so I removed the setInterval and restructured it like this:

'
function updateFramerate() {
	log("entering update loop");
	<update the framerate and draw the stars>
	
	// NEW - call yourself instantly, but let this instance exit
	setTimeout(updateFramerate, 0);

	log("leaving update loop");
}
'

That made a huge improvement in the number of times updateFramerate was called, and got rid of the 800+ms pauses - but there is still a consistent 30-50ms between one 'exit' and the next 'enter' message - system overhead? That's still a big question mark.

Worse - the first time you click "+100", *no stars appeared*. You have to remove them ("-100") and re-add. Then, not only do you see the stars, but the reported and observed framerates seem to agree - it is running at about 3 FPS (scaling and opacity on).

#### Curiouser and curiouser

Ok, duh.

So, what in the world could it be doing between calls?

How about drawing the screen, since all my JS code does is move things around.

Next tasks:

* refine this results doc so it removes some of the stumbling idiocy
* Explore whether there are ways to tell the browser to disable certain bits, like turning off reflowing each frame if I'm going to use absolute positioning on everything
Also, the observed framerate is nothing like 22 FPS. It's still visibly chunking along at 
