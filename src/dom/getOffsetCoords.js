/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */
APE.namespace("APE.dom").getOffsetCoords = function(el, container, coords) {
    
    var dom = APE.dom,
        max = Math.max;
    
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
    return(dom.getOffsetCoords = getOffsetCoords)(el, container, coords);
};