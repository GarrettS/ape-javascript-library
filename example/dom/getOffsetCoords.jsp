<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
   "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en-US">
<head>

<title>APE - Find Element Position</title>

<link type="text/css" rel="stylesheet" href="../../resources/ape.css"/>

<script type="text/javascript" src="../../build/APE.js"></script>
<script type="text/javascript" src="../../build/dom/position-f.js"></script>

<script type="text/javascript">
    function moveMarker() {

        // pop in a scrollbar.
        document.body.style.height = "1000px";

        // add some random scroll
        scrollTo(0, (Math.random() * 10)|0);


        // put the marker on the target.
        var marker = document.getElementById("marker"),
            ms = marker.style,
            target = document.getElementById("target");

        var coords = APE.dom.getOffsetCoords( target, document.body );
        ms.position = "absolute";
        ms.display="block";
        ms.top = coords.y + "px";
        ms.left = coords.x + "px";
        ms.margin="0"; 
    }
</script></head><body style="position: relative;">

<h1>APE.dom.getOffsetCoords()</h1>

<p>
    One of the most powerful features of <code>APE.dom</code> is 
    <code>getOffsetCoords(<var>el</var>, <var>container</var>[, <var>coords</var>]);</code>.
</p>

<h2>What is it?</h2>
<p>
    <code>APE.dom.getOffsetCoords</code> returns the 
    coordinates of the element relative to an optional ancestor, e.g. <code> { x : 10, y : 10 }</code>
</p>

<span id="target" style="background: rgb(255, 255, 255) none repeat scroll 0%; position: relative; cursor: pointer; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial;" onclick="moveMarker()">click me!</span>

<div id="marker" style="background: rgb(0, 255, 0) none repeat scroll 0%; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; width: 10px; height: 10px;"></div>


<h2>It works</h2>
<p>
    <a href="http://dhtmlkitchen.com/ape/test/tests/dom/position-f-test.html">I tested the shit out of it</a>. 
    Please find a case where <code>getOffsetCoords()</code> will fail.
</p>

<h3>Quirks Mode Caveat</h3>
<p>
	There are some cases where <code>getOffsetCoords()</code> will fail in IE with no <code>DOCTYPE</code>. 
	For best results, use a <code>DOCTYPE</code> that triggers standards mode.
</p>

<h3>Speed is King</h3>
<p>
    Function <code>APE.dom.getOffsetCoords()</code> is blazingly fast. Results in a complex tree with 
    scrolled parents takes on average 2.5ms in Firefox (the worst performer). 
</p>

<h2>Cross-browser Woes</h2>
<p>
    Finding an element's position is extremely
    hard. It is hard because of differences in 
    <code>offsetTop</code>, <code>offsetLeft</code>, and <code>offsetParent</code>. 
</p>

<h2>Compare to [<samp>insert_library_here</samp>]</h2>
<p>
    Other libraries have attempted to address these differences with browser detection. 
    This is bad for a few reasons:
</p>

<ol>
    <li>when [<samp>browser_x</samp>] fixes a bug that had a specific workaround based on 
    a browser check, the code will fail (and rightly so).</li>
    <li>the event of (1) occurring is less likely if the script is used in widespread library code.</li>
</ol>

<p>
    Other libraries will fail when there is
    <code>margin</code> and <code>position</code> on <code>body</code>. 
</p>
<p>
    They're also slower. Some of the 
    "better" libraries take up to 15ms to return wrong results. That sucks!
</p>
<jsp:include page="/ape/nav.jsp"/>

</body></html>