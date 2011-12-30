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
### TEST 1: SIMPLE SCROLLING STARFIELD
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

