/** @fileoverview
 * Getting computed styles, opacity functions.
 *
 * @author Garrett Smith
 * @requires dom constants - constants.js
 */
/**@name APE.dom 
 * @namespace*/
APE.namespace("APE.dom");
(function(){

    var dom = APE.dom,
        IS_COMPUTED_STYLE = dom.IS_COMPUTED_STYLE_SUPPORTED,
        CURRENT_STYLE = "currentStyle",
        OPACITY = "opacity",
        STYLE = "style",
        PX = "px",
        FILTER = "filter",
        alphaString = "alpha("+OPACITY+"=",
        multiLengthPropExp = /^(?:margin|(border)(Width|Color|Style)|padding)$/,
        alphaOpExp = /\Wopacity\s*=\s*([\d]+)/i,
        autoPercentExp = /^auto|\d%$/,
        floatProp = "cssFloat",
        props = ["Top", "Right", "Bottom", "Left"];
    if(!(floatProp in document.documentElement[STYLE])) {
        floatProp = "styleFloat";
    }
    
    /** 
     * Special method for a browser that supports el.filters and not style.opacity.
     * @memberOf APE.dom
     * @param {currentStyle} cs an IE currentStyle to find opacity on.
     * @return {ufloat} [0-1] amount of opacity.
     * calling this method on a browser that does not support filters
     * results in 1 being returned.  Use dom.getStyle or dom.getCascadedStyle instead
     */
    function getFilterOpacity(cs) {
        var o, f = cs[FILTER];
        if(!alphaOpExp.test(f)) return 1;
        o = alphaOpExp.exec(f);
        return o[1]/100;
    }
    
    /** 
     * Cross-browser adapter method for style.filters vs style.opacity.
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to set opacity on.
     * @param {ufloat} i [0-1] the amount of opacity.
     * @return {ufloat} [0-1] amount of opacity.
     */
    function setOpacity(el, i) {
        var s = el[STYLE], cs;
        if(OPACITY in s) {
            s[OPACITY] = i;
        } else if(FILTER in s) {
            s[FILTER] = alphaString + (i * 100) + ")";
            cs = el[CURRENT_STYLE];
            if(cs && !cs.hasLayout) {
                s.zoom = 1;
            }
        }
    }

    /** 
     * @memberOf APE.dom
     * @name getStyle
     * 
     * @function
     * @description returns the computed style of property <code>p</code> of <code>el</code>.
     * Returns different results in IE, so user beware! If your 
     * styleSheet has units like "em" or "in", this method does 
     * not attempt to convert those to px.
     *
     * Use "cssFloat" for getting an element's float and special 
     * "filters" treatment for "opacity".
     * 
     * @param {HTMLElement} el the element to set opacity on.
     * @param {String} p the property to retrieve.
     * @return {String} the computed style value or the empty string if no value was found.
     */
    function getStyle(el, p) {
        var value = "", cs, matches, splitVal, i, len, 
        doc = el[dom.OWNER_DOCUMENT];
        
        if(/float/.test(p)) {
            p = floatProp;
        }
        if(IS_COMPUTED_STYLE) {
            cs = doc.defaultView.getComputedStyle(el, "");

            if(!(p in cs))return"";
            value = cs[p];
            if(value === "") {
                // would try to get a rect, but Webkit doesn't support that.
                value = tryGetShorthandValues(cs, p).join(" ");
            } 
            // Special case Safari 2.
            if(p == "zIndex" && value == "normal") return "0";
            if(autoPercentExp.test(value)) {
                value = getCurrentStyleValueFromAutoOrPercent(el, p);
            } 
        } else {
            cs = el[CURRENT_STYLE];
            if(p === OPACITY) {
                value = getFilterOpacity(cs);
            } else {
                value = cs[p];
                if(autoPercentExp.test(value)) {
                    value = getCurrentStyleValueFromAutoOrPercent(el, p);
                } else if(!(p in cs)) {
                    return"";
                }
            }
            matches = nonPixelExp.exec(value);
            if(matches) {
                splitVal = value.split(" ");
                splitVal[0] = convertNonPixelToPixel( el, matches[0]);
                for(i = 1, len = splitVal.length; i < len; i++) {
                    matches = nonPixelExp.exec(splitVal[i]);
                    splitVal[i] = convertNonPixelToPixel( el, matches[0]);
                }
                value = splitVal.join(" ");
            }
        }
        return value;
    }
    
    function getCurrentStyleValueFromAutoOrPercent(el, p) {
        var s = el[STYLE], v, pp, borderWidth, 
            clientTop, clientLeft, paddingWidth;
        if(/^(?:width|height|top|left)$/.test(p) && typeof s.pixelWidth != "undefined") {
            pp = "pixel" + (p.charAt(0).toUpperCase()) + p.substring(1);
            v = s[pp];
        }
        if(v) {
            return v + PX;
        }
        if(p === "width") {
            clientLeft = el.clientLeft||0;
            borderWidth = parseFloat(getStyle(el, "borderRightWidth"))||clientLeft;
            paddingWidth = parseFloat(getStyle(el, "paddingLeft"))||0
                + parseFloat(getStyle(el, "paddingRight"))||0;

            return el.offsetWidth - clientLeft - borderWidth - paddingWidth + PX;
        } else if(p === "height") {
            clientTop = el.clientTop||0;
            borderWidth = parseFloat(getStyle(el, "borderBottomWidth"))||clientTop;
            paddingWidth = parseFloat(getStyle(el, "paddingTop"))||0
                + parseFloat(getStyle(el, "paddingBottom"))||0;
            return el.offsetHeight - clientTop - borderWidth + PX;
        } else if(p === "margin" && el[CURRENT_STYLE].position != "absolute") {
            v = parseFloat(getStyle(el.parentNode, 'width')) - el.offsetWidth;
            if(v === 0) return"0px";
            v = "0px " + v;
            return v + " " + v;
        }
        // Could be zIndex.
        return "0";
        // Can't get borderWidth because we only have clientTop and clientLeft.
    }

    // TODO: Consider removing this; "don't do that."
    /** 
     * Tries to get a shorthand value for margin|padding|borderWidth. 
     * @return  {[string]} Either 4 values or, if all four values are equal,
     * then one collapsed value (in an array).
     */
    function tryGetShorthandValues(cs, p) {
        var multiMatch = multiLengthPropExp.exec(p),
            prefix, suffix, 
            prevValue, nextValue, 
            values,
            allEqual = true, 
            propertyList,
            i = 1;
        
        if(multiMatch && multiMatch[0]) {
            propertyList = props;
            prefix = multiMatch[1]||multiMatch[0];
            suffix = multiMatch[2] || ""; // ["borderWidth", "border", "Width"]
        } else return [""];

        prevValue = cs[prefix + propertyList[0] + suffix ];
        values = [prevValue];

        while(i < 4) {
            nextValue = cs[prefix + propertyList[i] + suffix];
            allEqual = allEqual && nextValue == prevValue;
            prevValue = nextValue;
            values[i++] = nextValue;
        }
        if(allEqual)
            return [prevValue];
        return values;
    }

    var nonPixelExp = /(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;
    /**
     * @param {HTMLElement} el
     * @param {String} val 
     */
    function convertNonPixelToPixel(el, val) {
        
        if(el.runtimeStyle) {

            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels.

            if(parseFloat(val) === 0) {
                return"0px";
            }
            var s = el[STYLE],
                sLeft = s.left,
                rs = el.runtimeStyle,
                rsLeft = rs.left;
            rs.left = el[CURRENT_STYLE].left;
            s.left = (val || 0);

            // The element does not need to have position: to get values.
            // IE's math is a little off with converting em to px; IE rounds to 
            // the nearest pixel.
            val = s.pixelLeft + PX;

            // put it back.
            s.left = sLeft;
            rs.left = rsLeft;
            return val;
        }
    }
    dom.getStyle = getStyle;
    dom.setOpacity = setOpacity;
})();