<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
<title>APE JavaScript Library</title>
<link type="text/css" rel="stylesheet" href="resources/ape.css">
</head>

<body>

<h1>Welcome to APE!</h1>

<p>
    <abbr title="AOP Pointcuts for EcmaScript">APE</abbr> is a minimal JavaScript 
   library for writing and developing widgets. 
</p>

<p>
    <abbr title="AOP Pointcuts for EcmaScript">APE</abbr> does not change the way you write JavaScript. 
</p>

<p>
    <abbr title="AOP Pointcuts for EcmaScript">APE</abbr> uses a global namespace, <code>APE</code>, 
    which itself defines inheritance, namespacing, and <abbr title="Inversion of Control">IoC</abbr>. 
</p>

<h2>Features</h2>
<ul>
    <li>
        <a href="/ape/build/APE.js"><abbr title="AOP Pointcuts for EcmaScript">APE</abbr> Core</a> 
        (<abbr title="less than three kilobytes">&lt; 3k</abbr> minified) 
        Namespacing and Object creation features.
    </li>
    <li>
        <a href="/ape/build/EventPublisher.js">EventPublisher</a> - <abbr title="Aspect Oriented Programming">AOP</abbr> custom and native events.
    </li>
    <li>
        Subscription Based <a href="/ape/example/ajax/ajax-test.html">Async Requests</a> 
        - use APE.EventPublisher to chain multiple callbacks.
    </li>
    <li>
        Time-based <a href="/ape/example/anim/">animation</a>.
    </li>
    <li>
        Featureful <a href="/ape/example/drag/">drag and drop</a>.
    </li>
    <li>
        <a href="/ape/example/widget/">Widgets</a>.
        APE is designed for developing widgets.    
    </li>
</ul>

<h3>Compatibility</h3>
<p>The tests mostly pass in the following browsers:</p>
<ul>
	<li>Firefox 2 (Mac), Firefox 2, 3 (Win)</li>
	<li>IE 6,7, 8 (Win)</li>
	<li>Safari 2.0.2, 3 (Mac), Safari 3 (Win)</li>
	<li>Opera 9 (Mac/Win) (Opera 9.2 some tests fail falsely due to a
    	<a href="http://sourceforge.net/tracker/index.php?func=detail&amp;aid=1923420&amp;group_id=165715&amp;atid=836476"
        >bug triggered by the testrunner</a>)
    </li>
</ul>
<p>
	It is generally a good idea to <a href="test/tests/">run the test suite</a> in the 
	browsers you are targetting. 
</p>

<h3>Getting Started</h3>
<p>
    The commonly used files, <a href="/ape/build/APE.js">APE.js</a>, 
    <a href="/ape/build/EventPublisher.js">EventPublisher.js</a>, 
    and <a href="/ape/build/dom/dom.js">dom.js</a>, have been conveniently 
    packaged in to one rollup file, <a href="/ape/build/ape-ep-dom.js">ape-ep-dom.js</a> 
    (<a href="/ape/build/ape-ep-dom-min.js"><abbr title="less than seventeen kilobytes">&lt; 17k</abbr> 
    minified</a>; under 8k gzip'd). 
</p>

<p>
    For css-based animation, the files <a href="/ape/build/anim/StyleTransition.js">StyleTransition.js</a> 
    and <a href="/ape/build/anim/Animation.js">Animation.js</a> have been rolled up into 
    <a href="/ape/build/anim/anim.js">anim.js</a> (<a href="/ape/build/anim/anim-min.js"><abbr title="less than nine kilobytes">&lt; 3k</abbr> gzip'd and minified</a>).
</p>

<h3>How APE is Built</h3>
<p>
    Get a "behind the scenes" look at how APE is built: 
    <a href="/ape/build.html">Using ANT and YUICompressor to Build APE</a>.
</p>

<h3>Usage</h3>
<p><abbr title="AOP Pointcuts for EcmaScript">APE</abbr> is intellectual propertly, licensed under <abbr title="Academic Free Licensing">AFL</abbr>. Please keep the copyright notice intact. You may use it as a whole, or in part, but please 
don't alter the copyright notice.
</p>

<jsp:include page="nav.jsp?"/>

</body></html>
