<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
   "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en-US">
<head>
<title>APE Draggable</title>
<link type="text/css" rel="stylesheet" href="../../resources/ape.css">

</head>

<body>

<h1>Draggable Examples</h1>

<h2>Examples</h2>
<ul>
    <li><a href="table/">table reorder</a></li>
    <li><a href="droptarget/">drop target</a></li>
    <li><a href="Slider">Slider</a></li>
    <li class="d"><a href="sortlist/">sortlist</a></li>
    <li class="d"><a href="sortlist/proxy.html">sortlist/proxy.html</a></li>
</ul>

<h2>Tutorial Overview</h2>
<p>
    First create an element in the HTML.
</p>
<pre>
&lt;div id="testNode" style="position: relative;"&gt;change me&lt;/div&gt;
</pre>
<p>
    (The styles do not need to be in an inline <code>style</code> attribute.)
</p>

<p>
    Next, create a Draggable
</p>

<pre>
&lt;script type='text/javascript&gt;
var draggable = APE.drag.Draggable.getById( "testNode" );
&lt;/script&gt;
</pre>

<jsp:include page="/ape/nav.jsp"/>

</body>
</html>