/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */
APE.namespace("APE.dom");
(function() {
    APE.mixin(
        APE.dom, 
            /** @scope APE.dom */ {
            getOffsetCoords : getOffsetCoords,
            isAboveElement : isAboveElement,
            isBelowElement : isBelowElement,
            isInsideElement: isInsideElement
    });
    
    var doc = window.document,
        documentElement = doc.documentElement,

    // Load-time constants.
        IS_BODY_ACTING_ROOT = documentElement && documentElement.clientWidth === 0,

    // IE, Safari, and Opera support clientTop. FF 2 doesn't
        IS_CLIENT_TOP_SUPPORTED = 'clientTop'in documentElement,

        TABLE = /^h/.test(documentElement.tagName) ? "table" : "TABLE",

        IS_CURRENT_STYLE_SUPPORTED = 'currentStyle'in documentElement,

    // XXX Opera <= 9.2 - parent border widths are included in offsetTop.
        IS_PARENT_BORDER_INCLUDED_IN_OFFSET,

    // XXX Opera <= 9.2 - body offsetTop is inherited to children's offsetTop
    // when body position is not static.
    // opera will inherit the offsetTop/offsetLeft of body for relative offsetParents.
    // To amend, we set body to static, then set it back. 
    // This would be done for all browsers that support currentStyle, but not newer 
    // versions of IE that support getBoundingClientRect. 
    // The side effect is a style update that should not be noticeable.

        IS_BODY_MARGIN_INHERITED,
        IS_BODY_TOP_INHERITED,
        IS_BODY_MARGIN_INHERITED_WHEN_BODY_STATIC_AND_CHILD_RELATIVE,
        IS_BODY_OFFSET_EXCLUDING_MARGIN,

    // XXX Mozilla includes a table border in the TD's offsetLeft.
    // There is 1 exception: 
    //   When the TR has position: relative and the TD has block level content.
    //   In that case, the TD does not include the TABLE's border in it's offsetLeft.
    // We do not account for this peculiar bug. 
        IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET,
        IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH,

        IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED,

        getComputedStyle = doc.defaultView && doc.defaultView.getComputedStyle,
        IS_COMPUTED_STYLE_SUPPORTED = typeof getComputedStyle != "undefined",
        getBoundingClientRect = "getBoundingClientRect",
        relative = "relative",
        borderTopWidth = "borderTopWidth",
        borderLeftWidth = "borderLeftWidth",
        bcs,
        positionedExp = /^(?:r|a)/,
        absoluteExp = /^(?:a|f)/;

    /**
     * @memberOf APE.dom
     * @param {HTMLElement} el you want coords of.
     * @param {HTMLElement} container to look up to.
     * @param {x:Number, y:Number} coords object to pass in.
     * @return {x:Number, y:Number} coords of el from container.
     * 
     * Passing in a container will improve performance in other browsers,
     * but will punish IE with a recursive call. Test accordingly.
     * <p>
     * Container is sometimes irrelevant. Container is irrelevant when comparing positions 
     * of objects who do not share a common ancestor. In this case, pass in document.
     * </p>
     *<p>
     * Passing in re-used coords can improve performance in all browsers.
     * There is a side effect to passing in coords:
     * For drag drop operations, reuse coords:
     *</p>
     * <pre>
     * // Update our coords:
     * dom.getOffsetCoords(el, container, this.coords);
     * </pre>
     * Where <code>this.coords = {};</code>
     */
    function getOffsetCoords(el, container, coords) {

        var body = doc.body;

        if(!container)
            container = doc;

        if(!coords) 
            coords = {x:0, y:0};

        if(el === container) {
            coords.x = coords.y = 0;
            return coords;
        }
        if(el[getBoundingClientRect]) {
            
            // In BackCompat mode, body's border goes to the window. BODY is ICB.
            var rootBorderEl = IS_BODY_ACTING_ROOT ? body : documentElement,
                box = el[getBoundingClientRect](),
                x = box.left - rootBorderEl.clientLeft
                    + Math.max( documentElement.scrollLeft, body.scrollLeft ),
                y = box.top - rootBorderEl.clientTop
                    + Math.max( documentElement.scrollTop, body.scrollTop );

            if(container !== doc) {
                box = getOffsetCoords(container, null);
                x -= box.x;
                y -= box.y;
            }
            if(IS_BODY_ACTING_ROOT && IS_CURRENT_STYLE_SUPPORTED) {
                var curSty = body.currentStyle;
                x += parseFloat(curSty.marginLeft);
                y += parseFloat(curSty.marginTop);
            }
            coords.x = x;
            coords.y = y;

            return coords;
        }

    // Crawling up the tree. 
        else if(IS_COMPUTED_STYLE_SUPPORTED){
            
            var offsetLeft = el.offsetLeft, 
                offsetTop = el.offsetTop,
                isBodyStatic = !positionedExp.test(bcs.position),
                lastOffsetParent = el, 
                parent = el.parentNode,
                offsetParent = el.offsetParent;
            
        // Main loop -----------------------------------------------------------------------
            // Loop up, gathering scroll offsets on parentNodes.
            // when we get to a parent that's an offsetParent, update 
            // the current offsetParent marker.
            for( ; parent && parent !== container; parent = parent.parentNode) { 
                if(parent !== body && parent !== documentElement) {
                    offsetLeft -= parent.scrollLeft;
                    offsetTop -= parent.scrollTop;
                }
                if(parent === offsetParent) {
                    // If we get to BODY and have static position, skip it.
                    if(parent === body && isBodyStatic); 
                    else {

                        // XXX Mozilla; Exclude static body; if static, it's offsetTop will be wrong.
                        // Include parent border widths. This matches behavior of clientRect approach.
                        // XXX Opera <= 9.2 includes parent border widths. 
                        // See IS_PARENT_BORDER_INCLUDED_IN_OFFSET below. 
                        if( !IS_PARENT_BORDER_INCLUDED_IN_OFFSET && 
                            ! (parent.tagName === TABLE && IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET)) {
                                var pcs = getComputedStyle(parent, "");
                                // Mozilla doesn't support clientTop. Add borderWidth to the sum. 
                                offsetLeft += parseFloat(pcs[borderLeftWidth])||0;
                                offsetTop += parseFloat(pcs[borderTopWidth])||0;
                        }
                        if(parent !== body) {
                            offsetLeft += offsetParent.offsetLeft;
                            offsetTop += offsetParent.offsetTop;
                            lastOffsetParent = offsetParent;
                            offsetParent = parent.offsetParent; // next marker to check for offsetParent.
                        }
                    }
                }
            }
        
            //--------Post - loop, body adjustments----------------------------------------------
            // Complications due to CSSOM Views - the browsers try to implement a contradictory
            // spec: http://www.w3.org/TR/cssom-view/#offset-attributes

            // XXX Mozilla, Safari Opera: body margin is never included in body offsetLeft/offsetTop.
            // This is wrong. Body's offsetTop should work like any other element.
            //
            // XXX Opera: Do this *after* the Opera static hack.
            //
            // XXX Mozilla: When body has a border, body's offsetTop === negative borderWidth;
            // Don't use body.offsetTop.
            var bodyOffsetLeft = 0,
                bodyOffsetTop = 0,
                isLastElementAbsolute,
                lastOffsetPosition;

            if(lastOffsetParent != doc) {
                lastOffsetPosition = getComputedStyle(lastOffsetParent,'').position;
                isLastElementAbsolute = absoluteExp.test(lastOffsetPosition);
                isLastOffsetElementPositioned = isLastElementAbsolute || 
                    positionedExp.test(lastOffsetPosition);
            }

            if(IS_BODY_MARGIN_INHERITED && IS_BODY_OFFSET_EXCLUDING_MARGIN && !isBodyStatic 
                && !isLastOffsetElementPositioned) {

                bodyOffsetTop -= parseFloat(bcs.marginTop);
                bodyOffsetLeft -= parseFloat(bcs.marginLeft);
            }

            if( (lastOffsetParent === el && el.offsetParent === body && !IS_BODY_MARGIN_INHERITED)
                || (IS_BODY_MARGIN_INHERITED && lastOffsetParent === el && !isLastOffsetElementPositioned)
                || bcs.position == relative 
                && isLastOffsetElementPositioned
                && IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED
                && container === doc || container === documentElement) {

                bodyOffsetLeft += parseFloat(bcs.marginLeft)||0;
                bodyOffsetTop += parseFloat(bcs.marginTop)||0;
            }

            if(isBodyStatic) { 

                // XXX: Safari will use HTML for containing block (CSS),
                // but will subtract the body's border from the body's absolutely positioned 
                // child.offsetTop. Safari reports the child's offsetParent is BODY, but 
                // doesn't treat it that way (Safari bug).
                if(!isLastElementAbsolute) {
                    if(false == IS_PARENT_BORDER_INCLUDED_IN_OFFSET
                        && (container === doc || container === documentElement)){ 
                        offsetTop += parseFloat(bcs[borderTopWidth]);
                        offsetLeft += parseFloat(bcs[borderLeftWidth]);
                    }
                }
                else {
                    // XXX Safari subtracts border width of body from element's offsetTop (opera does it, too)
                    if(IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH) {
                        offsetTop += parseFloat(bcs[borderTopWidth]);
                        offsetLeft += parseFloat(bcs[borderLeftWidth]);
                    }
                }
            }
            else if(IS_BODY_OFFSET_EXCLUDING_MARGIN && !IS_BODY_TOP_INHERITED 
                && container === doc || container === documentElement ) {

                // If the body is positioned, add its left and top value.

                // Safari will sometimes return "auto" for computedStyle, which results NaN.

                 bodyOffsetLeft += parseFloat(bcs.left)||0;
                 bodyOffsetTop += parseFloat(bcs.top)||0;
                
                // XXX: Opera normally include the parentBorder in offsetTop.
                // We have a preventative measure in the loop above.
                if(isLastElementAbsolute) {
                    if(IS_PARENT_BORDER_INCLUDED_IN_OFFSET) {
                        offsetTop += parseFloat(bcs[borderTopWidth]);
                        offsetLeft += parseFloat(bcs[borderLeftWidth]);
                    }
                }
            }
            if(IS_BODY_TOP_INHERITED && IS_BODY_OFFSET_EXCLUDING_MARGIN
                && container != doc && container != documentElement) {
                offsetTop -= parseFloat(bcs.top);
                offsetLeft -= parseFloat(bcs.left);
            }

            coords.x = Math.round(offsetLeft + bodyOffsetLeft);
            coords.y = Math.round(offsetTop + bodyOffsetTop);

            return coords;
        }
    }

// A closure for initializing load time constants.
    if(!(getBoundingClientRect in documentElement) && IS_COMPUTED_STYLE_SUPPORTED)
    (function(){
    var waitForBodyTimer = setInterval(function domInitLoadTimeConstants() {
        var body = doc.body;
        if(!body) return;
        clearInterval(waitForBodyTimer);
        var s = body.style, padding = s.padding, border = s.border, 
            position = s.position, marginTop = s.marginTop, top = s.top,
            bv = '1px solid transparent',
            z = "0",
            one = "1px",
            offsetTop = "offsetTop";

        s.padding = s.top = z;

        s.border = bv;

        var x = doc.createElement('div'),
            xs = x.style;
        xs.margin = z;
        xs.position = "static";
        xs.width = xs.height = xs.fontSize = xs.lineHeight = z;

        // insertBefore - to avoid environment conditions with bottom script
        // where appendChild would fail.
        x = body.insertBefore(x, body.firstChild);
        IS_PARENT_BORDER_INCLUDED_IN_OFFSET = (x[offsetTop] === 1);
        
        s.border = s.padding = z;

        // Table test.
        var table = doc.createElement(TABLE);
        table.innerHTML = "<tbody><tr><td>x</td></tr></tbody>";
        table.style.border = "17px solid";
        table.cellSpacing = table.cellPadding = z;

        body.insertBefore(table, document.body.firstChild);
        IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET = table.getElementsByTagName("td")[0].offsetLeft === 17;

        body.removeChild(table);

        if(getComputedStyle) {
            bcs = getComputedStyle(body,'');
        }
        // Now add margin to determine if body offsetTop is inherited.
        s.marginTop = one;
        s.position = relative;
        IS_BODY_MARGIN_INHERITED = (x[offsetTop] === 1);
            
        IS_BODY_OFFSET_EXCLUDING_MARGIN = body[offsetTop] == 0;
        s.marginTop = z;
        s.top = one;
        IS_BODY_TOP_INHERITED = x[offsetTop] === 1;

        s.top = z;
        s.marginTop = one;
        s.position = relative;
        xs.position = relative;
        IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED = x[offsetTop] === 0;

        xs.position = "absolute";
        x.top = z;
        s.position = "static";
        if(x.offsetParent === body) {
            s.border = bv;
            xs.top = "2px";
            // XXX Safari gets offsetParent wrong (says 'body' when body is static,
            // but then positions element from ICB and then subtracts body's clientWidth.
            // Safari is half wrong.
            //
            // XXX Mozilla says body is offsetParent but does NOT subtract EL's offsetLeft/Top.
            // Mozilla is completely wrong.
            IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH = x[offsetTop] === 1;
        }

        // Safari does this. It's sort of a hybrid between AVK's spec 
        // and what IE does.
        s.marginTop = one;
        xs.position = relative;
        IS_BODY_MARGIN_INHERITED_WHEN_BODY_STATIC_AND_CHILD_RELATIVE = x[offsetTop] === 1;
        
        body.removeChild(x);

        s.position = position;

        s.marginTop = marginTop;
        // Put back border and padding the way they were.
        s.border = border;
        s.padding = padding;
        s.top = top;        
    }, 60);
    })();

    /** 
     * @memberOf APE.dom
     * @return {boolean} true if a is vertically within b's content area (and does not overlap, 
     * top nor bottom).
     */
    function isInsideElement(a, b) {
        var aTop = getOffsetCoords(a).y,
            bTop = getOffsetCoords(b).y;
        return aTop + a.offsetHeight <= bTop + b.offsetHeight && aTop >= bTop;
    }

    /** 
     * @memberOf APE.dom
     * @return {boolean} true if a overlaps the top of b's content area.
     */
    function isAboveElement(a, b) {
        return (getOffsetCoords(a).y <= getOffsetCoords(b).y);
    }

    /** 
     * @memberOf APE.dom
     * @return {boolean} true if a overlaps the bottom of b's content area.
     */
    function isBelowElement(a, b) {
        return (getOffsetCoords(a).y + a.offsetHeight >= getOffsetCoords(b).y + b.offsetHeight);
    }
})();