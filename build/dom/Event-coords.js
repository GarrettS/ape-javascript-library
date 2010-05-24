/** @requires viewport-f.js (for scrollOffsets in IE). */
APE.dom.Event.getCoords = function(ev) {
    var dom = APE.dom, getCoords, result;
    if ("pageX" in ev) {
        getCoords = function(ev) {
            return{
                x : ev.pageX,
                y : ev.pageY
            };
        };
    } else {
        getCoords = function(ev) {
            var scrollOffsets = dom.getScrollOffsets(); 
            ev = ev || window.event;
            return{
                x : ev.clientX + scrollOffsets.left,
                y : ev.clientY + scrollOffsets.top
            };
        };
    }
    result = (dom.Event.getCoords = getCoords)(ev);
    ev = null;
    return result;
};