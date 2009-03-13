/** @fileoverview
 * Element style functions
 *
 * @author Garrett Smith
 */

/**@name APE.dom 
 * @namespace*/
APE.namespace("APE.dom");
(function(){

    APE.mixin(APE.dom, /** @scope APE.dom */{
        /** @function */ getStyle : _getComputedStyle,
        getCascadedStyle : getCascadedStyle,
        setOpacity : setOpacity,
        getFilterOpacity : getFilterOpacity,
        getStyleUnit : getStyleUnit,
        findInheritedStyle : findInheritedStyle,
        getContainingBlock : getContainingBlock,
        getPixelCoords : getPixelCoords
    });
    
    var getCS = "getComputedStyle",
        IS_COMPUTED_STYLE_SUPPORTED = document.defaultView 
            && typeof document.defaultView[getCS] == "function",
        currentStyle = "currentStyle",
        style = "style";

    /** findInheritedStyle tries to find a cascaded style value for the element.
     * If the value is inherit|transparent, it looks up the tree, recursively.
     * @memberOf APE.dom
     * 
     * @param {Element} el - element's style you want.
     * @param prop {String} style property, such as backgroundColor.
     * @param {String} [units] optional unit to search for. Example: "em".
     * @return {String} computed style or an empty string.
     */
    function findInheritedStyle(el, prop, units) {
        var value = "", n = el;
        for( ; value = getCascadedStyle(n, prop, units); n = n.parentNode) 
            if(value && !noValueExp.test(value)) break;
        return value;
    }

    var noValueExp = /^(?:inher|trans|(?:rgba\((?=(0,\s))(?:\1\1\1)0\)))/;
    
    /** 
     * Special method for a browser that supports el.filters and not style.opacity.
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to find opacity on.
     * @return {ufloat} [0-1] amount of opacity.
     * calling this method on a browser that does not support filters
     * results in 1 being returned.  Use dom.getStyle or dom.getCascadedStyle instead
     */
     function getFilterOpacity(el) {
        var filters = el.filters;
        if(!filters) return"";
        try { // Will throw error if no DXImageTransform.
            return filters['DXImageTransform.Microsoft.Alpha'].opacity/100;

        } catch(e) {
            try { 
                return filters('alpha').opacity/100;
            } catch(e) {
                return 1;
            }
        }
    }

    /** 
     * Cross-browser adapter method for style.filters vs style.opacity.
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to set opacity on.
     * @param {ufloat} i [0-1] the amount of opacity.
     * @return {ufloat} [0-1] amount of opacity.
     */
     function setOpacity(el, i) {
        var s = el[style], cs;
        if("opacity"in s) {
            s.opacity = i;
        }
        else if("filter"in s) {
            cs = el[currentStyle];
            s.filter = 'alpha(opacity=' + (i * 100) + ')';
            if(cs && ("hasLayout"in cs) && !cs.hasLayout) {
                style.zoom = 1;
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
    function _getComputedStyle(el, p) {
        var value = "", cs, matches, splitVal, i, len, doc = el.ownerDocument, 
            defaultView = doc.defaultView;
        if(IS_COMPUTED_STYLE_SUPPORTED) {
            cs = defaultView[getCS](el, "");
            if(p == "borderRadius" && !("borderRadius"in cs)) {
                p = "MozBorderRadius"in cs ? "MozBorderRadius" : 
                    "WebkitBorderRadius"in cs ? "WebkitBorderRadius" : "";
            }

            if(!(p in cs)) return "";
            value = cs[p];
            if(value === "") {
                // would try to get a rect, but Webkit doesn't support that.
                value = (tryGetShorthandValues(cs, p)).join(" ");
            }
        }
        else if(currentStyle in el) {
            cs = el[currentStyle];
            if(p == "opacity" && !("opacity"in el[currentStyle]))
                value = getFilterOpacity(el);
            else {
                if(p == "cssFloat")
                    p = "styleFloat";
                value = cs[p];

                if(p == "clip" && !value && ("clipTop"in cs)) {
                    value = getCurrentStyleClipValues(el, cs);
                }
                else if(value == "auto") 
                    value = getCurrentStyleValueFromAuto(el, p);
                else if(!(p in cs)) return "";
            }
            matches = nonPixelExp.exec(value);
            if(matches) {
                splitVal = value.split(" ");
                splitVal[0] = convertNonPixelToPixel( el, matches);
                for(i = 1, len = splitVal.length; i < len; i++) {
                    matches = nonPixelExp.exec(splitVal[i]);
                    splitVal[i] = convertNonPixelToPixel( el, matches);
                }
                value = splitVal.join(" ");
            }
        }
        return value;
    }

    function getCurrentStyleClipValues(el, cs) {
        var values = [], i = 0, prop;
        for( ;i < 4; i++){
            prop = props[i];
            clipValue = cs['clip'+prop];
            if(clipValue == "auto") {
                clipValue = (prop == "Left" || prop == "Top" ? "0px" : prop == "Right" ? 
                    el.offsetWidth + px : el.offsetHeight + px);
            }
            values.push(clipValue);
        }
        return {
            top:values[0], right:values[1], bottom:values[2], left:values[3],
            toString : function() {return 'rect(' + values.join(' ')+')';}
        };
    }

    var sty = document.documentElement[style],
        floatProp = 'cssFloat'in sty ? 'cssFloat': 'styleFloat',
        props = ["Top", "Right", "Bottom", "Left"],
        cornerProps = ["Topright", "Bottomright", "Bottomleft", "Topleft"];
        docEl = sty = null;
    /** 
     * @memberOf APE.dom
     *
     * @description Cross-browser adapter method for reading style. 
     * Adapts for filters from opacity and styleFloat from cssFloat.
     * For browsers that support computed styles, but not <code>currentStyle</code>
     * (Firefox/Safari) pass in a <code>desiredUnit</code> of either <code>em<code> or 
     * <code>ex</code>
     * @memberOf APE.dom
     *
     * Tries to get a style of the attribute el[p]. If not found, uses 
     * getComputedStyle or currentStyle. getComputedStyle returns a pixel unit, but 
     * we have a patch to do the math.
     * 
     * <p>
     * Performance tip: performance-critical operations can reference the 
     * element's style first: <code>var val = el.style[p] || getComputedStyle(el);</code>
     * </p>
     * 
     * @param {HTMLElement} el the element to set opacity on.
     * @param {String} p the property to retrieve.
     * @param {String} desiredUnit one of: ["em", ] the type of unit to retrieve/compute - 
     * this is not really supported in IE - it is mostly for browsers that don't support 
     * currentStyle.
     * @return {String} the cascaded style value or the empty string if no value was found.
     */
    function getCascadedStyle(el, p, desiredUnit) {
        
        var s = el[style],
            value = s[p]||"";
        if(value && multiLengthPropExp.test(p)) {
            value = normalizeValue(value);
        }

        // IE provides "medium" as default inline-style border value for all border props.
        // This bogus value should be ignored.

        if(!value || (desiredUnit && value.indexOf(desiredUnit) === -1) 
            || p.indexOf("border") === 0 && borderWidthExp.test(value)) {

            if(currentStyle in el) {
                value = getCascadedFromCurrent(el, p, desiredUnit);
            }

            else {
                if(borderRadiusExp.test(p))
                    p = borderRadiusExp.exec(p)[0];
                value = getCascadedFromComputed(el, p, desiredUnit);
            }
        }
        return value;
    }

    function getCascadedFromCurrent(el, p, desiredUnit) {

        var curSty = el[currentStyle], value = "", unitAdapter, doc = el.ownerDocument, 
            defaultView = doc.defaultView;
        
        if(p == "opacity") {
            
            // currentStyle is pretty fucked in Opera.
            // returns "1". So go for getComputedStyle first.
            if(IS_COMPUTED_STYLE_SUPPORTED)
                value = defaultView[getCS](el,'').opacity;
            else if(!("opacity"in curSty)) {
                value = getFilterOpacity(el);
            }
        }
        else if(p == 'clip' && !curSty[p] && 'clipTop'in curSty) {
            value = getCurrentStyleClipValues(el, curSty);
        }
        else {

            // We've tried clip and opacity now, so it seems that the property 
            // does not exist, ala "WebkitBorderRadius" in IE.
            if(!(p in curSty)) return"";
            if(floatExp.test(p))
                p = floatProp;
            value = el[style][p] || curSty[p];

            if(value == "auto") 
                value = getCurrentStyleValueFromAuto(el, p) || value;

        }

        if(desiredUnit && value.indexOf(desiredUnit) == -1) {
            // Opera 9.2 royally fucked up currentStyle.
            // calls floor() on some values
            // If we ended up here, we have something like "0em",
            // so we pretend to have "0px" and then use a UnitAdapter.
            if(isCurrentStyleFloored && unitExp.test(value) && IS_COMPUTED_STYLE_SUPPORTED) {
                var cs = defaultView[getCS](el, p);
                unitAdapter = getAdapterFor(el, p, desiredUnit);
                if(unitAdapter) {
                    value = unitAdapter.fromPx(el.parentNode, p, cs[p], cs);
                }
            }
            else if(value == 0 && desiredUnit)
                value = "0" + desiredUnit;
            else {
                unitAdapter = getAdapterFor(el, p, desiredUnit);
                value = unitAdapter.fromPx(el.parentNode, p);
            }

        }
        return value;
    }

    function getCurrentStyleValueFromAuto(el, p) {
        
        var s = el[style], v, borderWidth, doc = el.ownerDocument;
        if("pixelWidth"in s && pixelDimensionExp.test(p)) {
            var pp = "pixel" + (p.charAt(0).toUpperCase()) + p.substring(1);
            v = s[pp];
            if(v === 0) {
                if(p == "width") {
                    borderWidth = parseFloat(_getComputedStyle(el, "borderRightWidth"))||0;
                    paddingWidth = parseFloat(_getComputedStyle(el, "paddingLeft"))||0
                        + parseFloat(_getComputedStyle(el, "paddingRight"))||0;

                    return el.offsetWidth - el.clientLeft - borderWidth - paddingWidth + "px";
                } 
                else if(p == "height") {
                    borderWidth = parseFloat(_getComputedStyle(el, "borderBottomWidth"))||0;
                    paddingWidth = parseFloat(_getComputedStyle(el, "paddingTop"))||0
                        + parseFloat(_getComputedStyle(el, "paddingBottom"))||0;
                    return el.offsetHeight - el.clientTop - borderWidth + "px";
                }
            }
            return s[pp] + "px";
        }
        if(p == "margin" && el[currentStyle].position != "absolute" && 
          doc.compatMode != "BackCompat") {
            v = parseFloat(_getComputedStyle(el.parentNode, 'width')) - el.offsetWidth;
            if(v == 0) return "0px";
            v = "0px " + v;
            return v + " " + v;
        }
        
        // Can't get borderWidth because we only have clientTop and clientLeft.
    }

    function getCascadedFromComputed(el, p, desiredUnit) {

        if(IS_COMPUTED_STYLE_SUPPORTED) {
            var defaultView = el.ownerDocument.defaultView,
                cs = defaultView[getCS](el,''),
                value = cs[p],
                valueSplit,
                i = 0,
                len,
                parentNode,
                unitAdapter,
                valuei;

            // Always return a string. Even for bogus properties.
            if(!(p in cs)) return "";

            if(value === "") {
                valueSplit = tryGetShorthandValues(cs, p);
            }
            else if(parseFloat(value) == 0 && desiredUnit) {
                return "0" + desiredUnit;
            }

            // The desiredUnit won't match computedStyle, but might match the 
            // element's HTML style Attribute.
            if(desiredUnit) { 
                if(!valueSplit)
                    valueSplit = [value];
                unitAdapter = getAdapterFor(el, p, desiredUnit);

                if(unitAdapter) {
                    parentNode = el.parentNode;
                    for(len = valueSplit.length; i < len; i++) {
                        valuei = valueSplit[i];
                        if(valuei == "0") valueSplit[i] = "0" + desiredUnit;
                        else if(!unitAdapter.exp.test(valuei))
                            valueSplit[i] = unitAdapter.fromPx(parentNode, p, valuei, cs);
                    }
                }
            }
            if(valueSplit)
                value = normalizeValue(valueSplit.join(" "));
            return value;
        }
    }

    /** 
     * takes a "1px 1px 1px 1px" string and tries to reduce to 
     * 1px. This makes calculating some values easier.
     */
    function normalizeValue(value) {
        var values = value.split(" "),
            i = 1,
            len,
            allEqual = true,
            p0 = values[0];
        for(len = values.length-1; i < len; i++) {
            if(!allEqual) break;
            allEqual = values[i] == values[i+1];
        }
        if(allEqual) 
            value = p0;
        return value;
    }

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
        }
        else if(borderRadiusExp.test(p)) {
           propertyList = cornerProps;
            prefix = borderRadiusExp.exec(p)[0];
            suffix = ""; 
        }
        else return [""];

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

    
    /** UnitAdapter to convert from px (default) to em/ex.
     */
    // The ugliness of this adapter is that it has conditional logic
    // based on support of gcs.
    function UnitFontAdapter(unit, fontSizeMultiplier, el, prop) {
        this.exp = new RegExp("\\d" + unit + "$");
        this.unit = unit;
        this.fontSizeMultiplier = fontSizeMultiplier;

        if(el && el[currentStyle]) {
            this.val = el[currentStyle][prop];
            if(nonPixelExp.test(this.val))
                this.val = convertNonPixelToPixel(el, nonPixelExp.exec(this.val));
            if(prop == "fontSize") el = el.parentNode; 
            this.fontSize = _getComputedStyle(el, "fontSize");
        }
    }

    UnitFontAdapter.prototype = {
        fromPx : convertPixelToEmEx
    };
    
    function getAdapterFor(el, prop, desiredUnit) {
        if(desiredUnit == 'em') {
            if(IS_COMPUTED_STYLE_SUPPORTED)
                return UnitFontAdapter.em || (UnitFontAdapter.em = new UnitFontAdapter( "em", 1 ));
            return new UnitFontAdapter( "em", 1, el, prop);
        }
        if(desiredUnit == 'ex') {
            if(IS_COMPUTED_STYLE_SUPPORTED)
                return UnitFontAdapter.ex || (UnitFontAdapter.ex = new UnitFontAdapter( "ex", .5 ));
            return new UnitFontAdapter( "ex", 1, el, prop);
        }

        if(desiredUnit == "%") {
            if(percentFromContainingBlock.test(prop))
                return new CbPercentageAdapter(el, prop);
            return new ParentPercentageAdapter(el, prop);
        }
    }

    var pxExp = /\dpx$/, 
        borderWidthExp = /^thi|med/,
        nonPixelExp = /(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/,
        unitExp = /(-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)\s*/,
        floatExp = /loat$/,
	    positiveLengthExp = /(?:width|height|padding|fontSize)$/ig, 
        percentFromContainingBlock = /^width|height|margin|padding|textIndent/,
        inherFromParExp = /^(?:font|text|letter)/,
        pixelDimensionExp = /width|height|top|left/,
        px = "px",

        // Capture (border)(Width) because we need to put "Top" in the middle.
        // CSS 2.1 should be borderWidthTop, to be consistent with paddingTop ~ it is backwards.
        multiLengthPropExp = /^(?:margin|(border)(Width)|padding)$/,
        
        borderRadiusExp = /^[a-zA-Z]*[bB]orderRadius$/; 

    /**
     * @requires nonPixelExp
     * @param {HTMLElement} el
     * @param {Array} String[] of matches from nonPixelExp.exec( val ).
     */
    function convertNonPixelToPixel(el, matches) {

        if(el.runtimeStyle) {

            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels.

            var val = matches[0]; // grab the -1.2em or whatever.
            if(parseFloat(val) == 0) {
                return "0px";
            }

            var s = el[style],
                sLeft = s.left,
                rs = el.runtimeStyle,
                rsLeft = rs.left;

            rs.left = el[currentStyle].left;
            s.left = (val || 0);

            // The element does not need to have position: to get values.
            // IE's math is a little off with converting em to px; IE rounds to 
            // the nearest pixel.
            val = s.pixelLeft + px;
            // put it back.
            s.left = sLeft;
            rs.left = rsLeft;
            return val;
        }
    }

    // Calculates a value based on the containing block.
    // 8.1 Box dimensions.
    //
    // This needs to have at least a few instance variables: el, p.
    // This change, adding 
    // Refactor this.



    var PercentageAdapter_prototype = {

        fromPx : function(containingBlockNode/*ignore*/, prop, val) {
            
            containingBlockNode = this.parent;

            var defaultView = containingBlockNode.ownerDocument.defaultView;
                containingBlockValue = defaultView[getCS](containingBlockNode,'').width,
                containingBlockPx = parseFloat(containingBlockValue),
                thisPx = parseFloat(val),

            // toPrecision of 2 decimal places.
                thisPercent = Math.ceil(thisPx/containingBlockPx * 10000)/100;

            // textIndent can be negative, but none of the other props 
            // that we care about can (width, padding, margin).
            if(positiveLengthExp.test(prop))
                if(thisPercent < 0) thisPercent = 0;
            return thisPercent + "%";
        },
        
        exp : inherFromParExp
    };

    function ParentPercentageAdapter(el, p) {
        this.p = p;
        this.parent = getContainingBlock(el);
    }

    function CbPercentageAdapter(el, p) {
        this.p = p;
        this.parent = el.parentNode;
    }

    ParentPercentageAdapter.prototype = CbPercentageAdapter.prototype = PercentageAdapter_prototype;
    CbPercentageAdapter.prototype.exp = percentFromContainingBlock;

    /** 
     * @memberOf APE.dom
     * @param {String} value a string value of a measurement. Example: 5em
     * @return {String} The unit portion of the string. If no matching unit is found,
     * then the empty string is returned.
     */
    function getStyleUnit( value ) {
        var unit = unitExp.exec(value);
        return unit && unit[2] || "";
    }

    /** 
     * Used for converting getComputedStyle(el,"") 
     * value to an em value. If the property is fontSize, 
     * it is necessary to get the parent's computed fontSize.
     * @memberOf APE.dom
     * @param {HTMLElement} parentNode
     * @param {String} prop style property to work with.
     * @param {String} val the value, such as "12.3px".
     * @param {ComputedCSSStyleDeclaration} computedStyle object to work with.
     */
    function convertPixelToEmEx(parentNode, prop, val, computedStyle) {
        val = this.val || val;
        var match = pxExp.exec(val),
            defaultView = parentNode.ownerDocument.defaultView;
        if(match) {
            if(match[0]) {
                var fontSize,
                    d = parseFloat(val);

                if(!this.fontSize) {
                    // If we're trying to get fontSize
                    if(prop == "fontSize") {
                        fontSize = defaultView[getCS](parentNode,'').fontSize;
                    }
                    else
                        fontSize = computedStyle.fontSize;
                }
                fontSize = parseFloat(fontSize||this.fontSize);
                if(isFinite(d)) {
                    return d/fontSize * this.fontSizeMultiplier + this.unit;
                }
            }
        }
        if(!val) return "";
        else if(isFinite(val)) return val + this.unit;
        return val; // return input.
    }

    var isCurrentStyleFloored = (function(){
        var head = document.getElementsByTagName("head")[0],
            fs, isFloored, s;
        if(!head[currentStyle]) return false;
        s = head[style];
        fs = s.fontSize;
        s.fontSize = ".4em";
        isFloored = head[currentStyle].fontSize == "0em";
        s.fontSize = fs;
        return isFloored;
    })();

    /** 
     * Finds the containing block of el, as per CSS 2.1 sec 10.1
     * @memberOf APE.dom 
     * @param {HTMLElement} el
     * @return {HTMLElement} el's containing block.
     */
    function getContainingBlock(el) {
        var elPosition = _getComputedStyle(el, "position"), 
            docEl = el.ownerDocument.documentElement,
            parent = el.parentNode;
        if(/^(?:r|s)/.test(elPosition) || !elPosition) return parent;
        if(elPosition == "fixed") return null;
        while(parent && parent != docEl) {
            if(_getComputedStyle(parent, "position") != "static")
                return parent;
            parent = parent.parentNode;
        }
        return docEl;
    }
    
    /** @function()
     * @return {Object} {x: Number, y:Number}
     */
    function getPixelCoords(el){
        var f = (IS_COMPUTED_STYLE_SUPPORTED ? function(el) {
            var cs = el.ownerDocument.defaultView[getCS](el, "");
            return {
                x : parseInt(cs.left)||0,
                y : parseInt(cs.top)||0
            };
        } : function(el){
            var style = el.style;
            return {
                // pixelLeft will return 0 when the element does not have 
                // left: in the style attribute.
                x : style.pixelLeft || parseInt(_getComputedStyle(el,"left"))||0,
                y : style.pixelTop || parseInt(_getComputedStyle(el,"top"))||0
            };
        });
        this.getPixelCoords = f;
        return f(el);
    }
})();