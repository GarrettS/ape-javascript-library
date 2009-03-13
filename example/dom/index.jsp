<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
        "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
<head>
<title>APE.dom</title>
<link type="text/css" rel="stylesheet" href="../../resources/ape.css"/>

</head>

<body>

<h1>APE.dom Examples</h1>

<h2>Package Overview</h2>
<p>
    <a href="../../build/dom/dom.js">dom.js</a> is built from several modules: 
</p>
<ul>
    <li>
        <a href="../../build/dom/classname-f.js">classname-f.js</a>
    </li>
    <li>
        <a href="../../build/dom/Event.js">Event.js</a>
    </li>
    <li>
        <a href="../../build/dom/position-f.js">position-f.js</a>
    </li>
    <li>
        <a href="../../build/dom/style-f.js">style-f.js</a>
    <li>
        <a href="../../build/dom/viewport-f.js">viewport-f.js</a>
    </li>
</ul>

<h3>StyleSheetAdapter</h3>
<p>
    <code>APE.dom.StyleSheetAdapter</code> 
    (<small><a href="../../build/dom/StyleSheetAdapter.js">StyleSheetAdapter.js</a></small>)
    does <em>not</em> get built into <a href="../../build/dom/dom.js">dom.js</a>. 
</p>

<p>
It's an odd duck and frankly, 
    I don't know where else to put it! It has DOM-related functionality; I use it for testing, and it's useful 
    for animation of a CSSRule. It isn't needed for most applications. 
</p>

<h2>Examples</h2>
<ul>
    <li><a href="getOffsetCoords.jsp">getOffsetCoords()</a></li>
</ul>

<jsp:include page="/ape/nav.jsp"/>

</body>
</html>