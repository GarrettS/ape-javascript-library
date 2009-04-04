/**
 * @requires viewport-f.js (for scrollOffsets in IE).
 */
APE.namespace("APE.dom.Event");
(function() {
    var dom = APE.dom, 
        Event = dom.Event;
    Event.getCoords = getCoords;
    function getCoords(e) {
        var f;
        if ("pageX" in e) {
            f = function(e) {
                return {
                    x : e.pageX,
                    y : e.pageY
                };
            };
        } else {
            f = function(e) {
                var scrollOffsets = dom.getScrollOffsets(); 
                e = e || window.event;
                return {
                    x : e.clientX + scrollOffsets.left,
                    y : e.clientY + scrollOffsets.top
                }
            };
        }
        return (Event.getCoords = f)(e);
    }
})();