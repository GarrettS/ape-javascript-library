/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */
APE.namespace("APE.dom");
(function() {
    
    var dom = APE.dom,
        round = Math.round, max = Math.max,
    	IS_SCROLL = typeof document.createElement("p").scrollLeft == "number";
    APE.createMixin(
        dom, {
            getOffsetCoords : getOffsetCoords,
            isAboveElement : isAboveElement,
            isBelowElement : isBelowElement,
            isInsideElement: isInsideElement,
            
            // Blackberry9000 does not, and does not support scrollLeft, scrollTop.
            IS_SCROLL_SUPPORTED : IS_SCROLL
    });
    
    function getOffsetCoords(el, container, coords) {

        var doc = el[dom.OWNER_DOCUMENT],
            documentElement = doc.documentElement,
            body = doc.body;

        if(!container)
            container = doc;

        if(!coords)
            coords = {x:0, y:0};

        coords.x = coords.y = 0;
        if(el === container) {
            return coords;
        }

        // In BackCompat mode, body's border goes to the window. BODY is ICB.
        var rootBorderEl = dom.IS_BODY_ACTING_ROOT ? body : documentElement,
            box = el.getBoundingClientRect(),
            x = box.left + max( documentElement.scrollLeft, body.scrollLeft ),
            y = box.top + max( documentElement.scrollTop, body.scrollTop ),
            bodyCurrentStyle,
            borderTop = rootBorderEl.clientTop,
            borderLeft = rootBorderEl.clientLeft;

        if(dom.IS_CLIENT_TOP_SUPPORTED) {
            x -= borderLeft;
            y -= borderTop;
        }
        if(container !== doc) {
            box = getOffsetCoords(container, null);
            x -= box.x;
            y -= box.y;
            if(dom.IS_CLIENT_TOP_SUPPORTED) {
                if(dom.IS_BODY_ACTING_ROOT && container === body) {
                    x -= borderLeft;
                    y -= borderTop;
                } else if(container !== doc 
                    && container !== documentElement && container !== body) {
                    x -= container.clientLeft;
                    y -= container.clientTop;
                }
            }
        }
        if(dom.IS_BODY_ACTING_ROOT && dom.IS_CURRENT_STYLE_SUPPORTED
            && container != doc && container !== body) {
            bodyCurrentStyle = body.currentStyle;
            x += parseFloat(bodyCurrentStyle.marginLeft)||0 +
                parseFloat(bodyCurrentStyle.left)||0;
            y += parseFloat(bodyCurrentStyle.marginTop)||0 +
                 parseFloat(bodyCurrentStyle.top)||0;
        }
        coords.x = x;
        coords.y = y;

        return coords;
    }

  // TODO: add an optional commonAncestor parameter to the below.
    /**
     * @memberOf APE.dom
     * @return {boolean} true if a is vertically within b's content area (and does not overlap,
     * top nor bottom).
     */
    function isInsideElement(a, b) {
        var aTop = dom.getOffsetCoords(a).y,
            bTop = dom.getOffsetCoords(b).y;
        return aTop + a.offsetHeight <= bTop + b.offsetHeight && aTop >= bTop;
    }

    /**
     * @memberOf APE.dom
     * @return {boolean} true if a overlaps the top of b's content area.
     */
    function isAboveElement(a, b) {
        return (dom.getOffsetCoords(a).y <= dom.getOffsetCoords(b).y);
    }

    /**
     * @memberOf APE.dom
     * @return {boolean} true if a overlaps the bottom of b's content area.
     */
    function isBelowElement(a, b) {
        return (dom.getOffsetCoords(a).y + a.offsetHeight >= 
            dom.getOffsetCoords(b).y + b.offsetHeight);
    }
})();
