/**
 * @author Garret Smith
 */
APE.namespace("APE.dom");

(function() {

    // Public exports.
    APE.mixin(APE.dom, {
        getScrollOffsets : getScrollOffsets,
        getViewportDimensions : getViewportDimensions
    });


    var DOCUMENT_ELEMENT = "documentElement", 
        IS_BODY_ACTING_ROOT = document[DOCUMENT_ELEMENT].clientWidth === 0;

    /** @memberOf APE.dom
     * @name getScrollOffsets
     * @function
     * @return an object with <code>width</code> and <code>height</code>.
     * This will exhibit a bug in Mozilla, which is often 5-7 pixels off.
     */
    function getScrollOffsets(win) {
        win = win || window;
        var f, r;
        if("pageXOffset"in win)
            f = function(win) {
                win = win||window;
                return{ left:win.pageXOffset, top: win.pageYOffset};
            };
        else {
            f = function(win) {
              win = win || window;
              var node = win.document[IS_BODY_ACTING_ROOT ? "body" : DOCUMENT_ELEMENT];
              return{ left : node.scrollLeft, top : node.scrollTop };
            };
        }
        r = (this.getScrollOffsets = f)(win);
        win = null;
        return r;
    }

    /** @memberOf APE.dom
     * @name getViewportDimensions
     * @function
     * @return an object with <code>width</code> and <code>height</code>.
     */
    function getViewportDimensions(win) {
        win = win || window;
        var baseName = "document",
            nodeName = baseName, 
            d = win[baseName], 
            propPrefix = "client",
            wName, hName;

    // Safari 2 uses document.clientWidth (default).
        if(typeof d.clientWidth == "number"){
            baseName = "window";
        }

    // Opera < 9.5, or IE in quirks mode.
        else if(IS_BODY_ACTING_ROOT) {
            baseName = DOCUMENT_ELEMENT;
            nodeName = "body";

    // Modern Webkit, Firefox, IE.
    // Might be undefined. 0 in older mozilla.
        } else if(d[DOCUMENT_ELEMENT].clientHeight > 0){
            nodeName = DOCUMENT_ELEMENT;
        }
        wName = propPrefix + "Width";
        hName = propPrefix + "Height";
        function getViewportDimensions(win){
            var node = (win || window)[baseName][nodeName];
            return{width: node[wName], height: node[hName]};
        }

        r = (this.getViewportDimensions = getViewportDimensions)(win);
        win = d = null;
        return r;
    }
})();