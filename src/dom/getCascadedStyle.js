/**
 * @fileoverview
 * getting cascaded styles for easy style transitions.
 * @requires style-f.js, getContainingBlock.js
 */

(function(){
    APE.mixin(APE.dom, {
            getStyleUnit : getStyleUnit,
            findInheritedStyle : findInheritedStyle,
            getCascadedStyle : getCascadedStyle
    });
	var dom = APE.dom,
		style = "style",
		IS_COMPUTED_STYLE = dom.IS_COMPUTED_STYLE,
		getCS = "getComputedStyle",
		currentStyle = "currentStyle",
		pxExp = /\dpx$/, 
	    borderWidthExp = /^thi|med/,
	    nonPixelExp = /(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/,
	    unitExp = /(-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)\s*/,
        borderRadiusExp = dom.borderRadiusExp,
	    floatExp = /loat$/,
	    positiveLengthExp = /(?:width|height|padding|fontSize)$/ig, 
	    percentFromContainingBlock = /^width|height|margin|padding|textIndent/,
	    inherFromParExp = /^(?:font|text|letter)/,
	    pixelDimensionExp = /width|height|top|left/,
	    px = "px";

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
        for(var value, n = el ; value = getCascadedStyle(n, prop, units); n = n.parentNode) 
            if(value && !/^(?:inher|trans|(?:rgba\((?=(0,\s))(?:\1\1\1)0\)))/.test(value)) break;
        return value;
    }

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
        if(value && dom.multiLengthPropExp.test(p)) {
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
                if(borderRadiusExp.test(p)) {
                    p = borderRadiusExp.exec(p)[0];
                }
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
            if(IS_COMPUTED_STYLE) {
                value = defaultView[getCS](el,'').opacity;
            } else if(!("opacity"in curSty)) {
                value = dom.getFilterOpacity(el);
            }
        }
        else if(p == 'clip' && !(p in curSty) && 'clipTop'in curSty) {
            value = getCurrentStyleClipValues(el, curSty);
        }
        else {

            // We've tried clip and opacity now, so it seems that the property 
            // does not exist, ala "WebkitBorderRadius" in IE.
            if(!(p in curSty)) return"";
            if(floatExp.test(p)) {
                p = floatProp;
            } 
            
            value = el[style][p] || curSty[p];

            if(value == "auto") {
                value = dom.getCurrentStyleValueFromAuto(el, p) || value;
            }

        }

        if(desiredUnit && value.indexOf(desiredUnit) == -1) {
            // Opera 9.2 royally fucked up currentStyle.
            // calls floor() on some values
            // If we ended up here, we have something like "0em",
            // so we pretend to have "0px" and then use a UnitAdapter.
            if(isCurrentStyleFloored && unitExp.test(value) && IS_COMPUTED_STYLE) {
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

    function getCascadedFromComputed(el, p, desiredUnit) {

        if(IS_COMPUTED_STYLE) {
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
                valueSplit = dom.tryGetShorthandValues(cs, p);
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
     
     function getAdapterFor(el, prop, desiredUnit) {
         if(desiredUnit == 'em') {
             if(IS_COMPUTED_STYLE)
                 return UnitFontAdapter.em || (UnitFontAdapter.em = new UnitFontAdapter( "em", 1 ));
             return new UnitFontAdapter( "em", 1, el, prop);
         }
         if(desiredUnit == 'ex') {
             if(IS_COMPUTED_STYLE)
                 return UnitFontAdapter.ex || (UnitFontAdapter.ex = new UnitFontAdapter( "ex", .5 ));
             return new UnitFontAdapter( "ex", 1, el, prop);
         }

         if(desiredUnit == "%") {
             if(percentFromContainingBlock.test(prop))
                 return new CbPercentageAdapter(el, prop);
             return new ParentPercentageAdapter(el, prop);
         }
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
                 this.val = dom.convertNonPixelToPixel(el, nonPixelExp.exec(this.val));
             if(prop == "fontSize") el = el.parentNode; 
             this.fontSize = dom.getStyle(el, "fontSize");
         }
     }

     UnitFontAdapter.prototype = {
         fromPx : convertPixelToEmEx
     };
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
         this.parent = dom.getContainingBlock(el);
     }

     function CbPercentageAdapter(el, p) {
         this.p = p;
         this.parent = el.parentNode;
     }

     ParentPercentageAdapter.prototype = CbPercentageAdapter.prototype = PercentageAdapter_prototype;
     CbPercentageAdapter.prototype.exp = percentFromContainingBlock;

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

})();