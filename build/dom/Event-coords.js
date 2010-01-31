/** @requires viewport-f.js (for scrollOffsets in IE). */
APE.namespace("APE.dom.Event").getCoords = function(ev) {
    var dom = APE.dom, getCoords;
    if ("pageX" in ev) {
        getCoords = function(ev) {
            return {
                x : ev.pageX,
                y : ev.pageY
            };
        };
    } else {
        getCoords = function(ev) {
            var scrollOffsets = dom.getScrollOffsets(); 
            ev = ev || window.event;
            return {
                x : ev.clientX + scrollOffsets.left,
                y : ev.clientY + scrollOffsets.top
            };
        };
    }
    return (Event.getCoords = getCoords)(ev);
};