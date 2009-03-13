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


    var docEl = document.documentElement,
        IS_BODY_ACTING_ROOT = docEl && docEl.clientWidth === 0;
    docEl = null;

    /** @memberOf APE.dom
     * @name getScrollOffsets
     * @function
     * @return an object with <code>width</code> and <code>height</code>.
     * This will exhibit a bug in Mozilla, which is often 5-7 pixels off.
     */
    function getScrollOffsets(win) {
        win = win || window;
        var f, d = win.document, node = d.documentElement;
        if("pageXOffset"in win)
            f = function() {
                return{ left:win.pageXOffset, top: win.pageYOffset};
            };
        else {
            if(IS_BODY_ACTING_ROOT) node = d.body;
            f = function() {
              return{ left : node.scrollLeft, top : node.scrollTop };
            };
        }
        d = null;
        this.getScrollOffsets = f;
        return f();
    }

    /** @memberOf APE.dom
     * @name getViewportDimensions
     * @function
     * @return an object with <code>width</code> and <code>height</code>.
     */
    function getViewportDimensions(win) {
        win = win || window;
        var node = win.document, d = node, propPrefix = "client",
            wName, hName;

    // Safari 2 uses document.clientWidth (default).
        if(typeof d.clientWidth == "number");

    // Opera < 9.5, or IE in quirks mode.
        else if(IS_BODY_ACTING_ROOT || isDocumentElementHeightOff(win)) {
            node = d.body;

    // Modern Webkit, Firefox, IE.
    // Might be undefined. 0 in older mozilla.
        } else if(d.documentElement.clientHeight > 0){
            node = d.documentElement;

    // For older versions of Mozilla.
        } else if(typeof innerHeight == "number") {
            node = win;
            propPrefix = "inner";
        }
        wName = propPrefix + "Width";
        hName = propPrefix + "Height";

        return (this.getViewportDimensions = function() {
            return{width: node[wName], height: node[hName]};
        })();

    // Used to feature test Opera returning wrong values
    // for documentElement.clientHeight.
        function isDocumentElementHeightOff(win){
            var d = win.document,
                div = d.createElement('div');
            div.style.height = "2500px";
            d.body.insertBefore(div, d.body.firstChild);
            var r = d.documentElement.clientHeight > 2400;
            d.body.removeChild(div);
            return r;
        }
    }
})();