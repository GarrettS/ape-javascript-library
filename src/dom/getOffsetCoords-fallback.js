/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */
if(!document.documentElement.getBoundingClientRect && APE.dom.IS_COMPUTED_STYLE_SUPPORTED) {
(function() {
    var dom = APE.dom,
              doc = this.document,
              inited,
              documentElement = doc.documentElement;
        
    dom.getOffsetCoords = getOffsetCoordsFallback;
    var round = Math.round, max = Math.max,
        parseFloat = self.parseFloat,
        GET_COMPUTED_STYLE = "getComputedStyle",
        
    // Load-time constants.            
        TABLE = dom.IS_XML_DOM ? "table" : "TABLE",
    
    // XXX Opera <= 9.2 - parent border widths are included in offsetTop.
        IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET,

    // XXX Opera <= 9.2 - body offsetTop is inherited to children's offsetTop
    // when body position is not static.
    // opera will inherit the offsetTop/offsetLeft of body for relative offsetParents.

        IS_BODY_MARGIN_INHERITED,
        IS_BODY_TOP_INHERITED,
        IS_BODY_OFFSET_EXCLUDING_MARGIN,

    // XXX Mozilla includes a table border in the TD's offsetLeft.
    // There is 1 exception:
    //   When the TR has position: relative and the TD has block level content.
    //   In that case, the TD does not include the TABLE's border in it's offsetLeft.
    // We do not account for this peculiar bug.
        IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET,
        IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH,

        IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED,

        IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING,
        IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD,
        IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD,
        IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN,

        // In Safari 2.0.4, BODY can have offsetTop when offsetParent is null.
        // but offsetParent will be HTML (root) when HTML has position.
        // IS_BODY_OFFSET_TOP_NO_OFFSETPARENT,
        
        relative = "relative",
        borderTopWidth = "borderTopWidth",
        borderLeftWidth = "borderLeftWidth",
        positionedExp = /^(?:r|a)/,
        absoluteExp = /^(?:a|f)/;
        
    // release from closure.
    doc = documentElement = null;    
    
    /**
     * @memberOf APE.dom
     * @param {HTMLElement} el you want coords of.
     * @param {HTMLElement} positionedContainer container to look up to. The container must have
     * position: (relative|absolute|fixed);
     *
     * @param {x:Number, y:Number} coords object to pass in.
     * @return {x:Number, y:Number} coords of el from container.
     *
     * <p>
     *  Passing in re-used coords can improve performance in all browsers.
     *  There is a side effect to passing in coords:
     *  For drag drop operations, reuse coords:
     * </p>
     * <pre>
     * // Update our coords:
     * dom.getOffsetCoords(el, container, this.coords);
     * </pre>
     * Where <code>this.coords = {};</code>
     */
    
    function getOffsetCoordsFallback(el, container, coords) {

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
    // Crawling up the tree.
        if(!inited) init();
        var offsetLeft = el.offsetLeft,
            offsetTop = el.offsetTop,
            defaultView = doc.defaultView,
            // Blackbery9000 cs is null sometimes. Needs reduction. 
            cs = defaultView[GET_COMPUTED_STYLE](el, '') || el.style;
        
         if(cs.position == "fixed" && dom.IS_SCROLL_SUPPORTED) {
            coords.x = offsetLeft + documentElement.scrollLeft;
            coords.y = offsetTop + documentElement.scrollTop;
            return coords;
        }
        var bcs = defaultView[GET_COMPUTED_STYLE](body,''),
            isBodyStatic = !positionedExp.test(bcs.position),
            lastOffsetParent = el,
            parent = el.parentNode,
            offsetParent = el.offsetParent;

    // Main loop -----------------------------------------------------------------------
        // Loop up, gathering scroll offsets on parentNodes.
        // when we get to a parent that's an offsetParent, update
        // the current offsetParent marker.
        for( ; parent && parent !== container; parent = parent.parentNode) {
            if(parent !== body && parent !== documentElement && dom.IS_SCROLL_SUPPORTED) {
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
                    // See IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET below.
                    if( !IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET &&
                        ! (parent.tagName === TABLE && IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET)) {
                            var pcs = defaultView[GET_COMPUTED_STYLE](parent, "");
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

        // XXX Mozilla, Safari 3, Opera: body margin is never
        // included in body offsetLeft/offsetTop.
        // This is wrong. Body's offsetTop should work like any other element.
        // In Safari 2.0.4, BODY can have offsetParent, and even
        // if it doesn't, it can still have offsetTop.
        // But Safari 2.0.4 doubles offsetTop for relatively positioned elements
        // and this script does not account for that.

        // XXX Mozilla: When body has a border, body's offsetTop === negative borderWidth;
        // Don't use body.offsetTop.
        var bodyOffsetLeft = 0,
            bodyOffsetTop = 0,
            isLastElementAbsolute,
            isLastOffsetElementPositioned,
            isContainerDocOrDocEl = container === doc || container === documentElement,
            dcs,
            lastOffsetPosition;

        // If the lastOffsetParent is document,
        // it is not positioned (and hence, not absolute).
        if(lastOffsetParent != doc) {
            cs = defaultView[GET_COMPUTED_STYLE](lastOffsetParent,'');
            if(cs) {
                lastOffsetPosition = cs.position;
                isLastElementAbsolute = absoluteExp.test(lastOffsetPosition);
                isLastOffsetElementPositioned = isLastElementAbsolute ||
                    positionedExp.test(lastOffsetPosition);
            }
        }

        // do we need to add margin?
        if(
            (lastOffsetParent === el && el.offsetParent === body && !IS_BODY_MARGIN_INHERITED
            && container !== body && !(isBodyStatic && IS_BODY_OFFSET_EXCLUDING_MARGIN))
            || (IS_BODY_MARGIN_INHERITED && lastOffsetParent === el && !isLastOffsetElementPositioned)
            || !isBodyStatic
            && isLastOffsetElementPositioned
            && IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED
            && isContainerDocOrDocEl) {
                bodyOffsetTop += parseFloat(bcs.marginTop)||0;
                bodyOffsetLeft += parseFloat(bcs.marginLeft)||0;
        }

        // Case for padding on documentElement.
        if(container === body) {
            dcs = defaultView[GET_COMPUTED_STYLE](documentElement,'');
            if(
                (!isBodyStatic &&
                    ((IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD && !isLastElementAbsolute)
                    ||
                    (IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD && isLastElementAbsolute))
                )
                || isBodyStatic && IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING
                ) {
                bodyOffsetTop -= parseFloat(dcs.paddingTop)||0;
                bodyOffsetLeft -= parseFloat(dcs.paddingLeft)||0;
            }

            if(IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN){
                if(!isLastOffsetElementPositioned
                    || isLastOffsetElementPositioned && !isBodyStatic)
                bodyOffsetTop -= parseFloat(dcs.marginTop)||0;
                bodyOffsetLeft -= parseFloat(dcs.marginLeft)||0;
            }
        }
        if(isBodyStatic) {
            // XXX Safari subtracts border width of body from element's offsetTop (opera does it, too)
            if(IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH
            // XXX: Safari will use HTML for containing block (CSS),
            // but will subtract the body's border from the body's absolutely positioned
            // child.offsetTop. Safari reports the child's offsetParent is BODY, but
            // doesn't treat it that way (Safari bug).
                || (!isLastElementAbsolute && !IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET
                    && isContainerDocOrDocEl)) {
                       bodyOffsetTop += parseFloat(bcs[borderTopWidth]);
                       bodyOffsetLeft += parseFloat(bcs[borderLeftWidth]);
            }
        }

        // body is positioned, and if it excludes margin,
        // it's probably partly using the AVK-CSSOM disaster.
        else if(IS_BODY_OFFSET_EXCLUDING_MARGIN) {
            if(isContainerDocOrDocEl) {
                if(!IS_BODY_TOP_INHERITED) {

                    // If the body is positioned, add its left and top value.
                     bodyOffsetTop += parseFloat(bcs.top)||0;
                     bodyOffsetLeft += parseFloat(bcs.left)||0;

                    // XXX: Opera normally include the parentBorder in offsetTop.
                    // We have a preventative measure in the loop above.
                    if(isLastElementAbsolute && IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET) {
                        bodyOffsetTop += parseFloat(bcs[borderTopWidth]);
                        bodyOffsetLeft += parseFloat(bcs[borderLeftWidth]);
                    }
                }

                // Padding on documentElement is not included,
                // but in this case, we're searching to documentElement, so we
                // have to add it back in.
                if(container === doc && !isBodyStatic
                    && !IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD) {
                    if(!dcs) dcs = defaultView[GET_COMPUTED_STYLE](documentElement,'');
                    bodyOffsetTop += parseFloat(dcs.paddingTop)||0;
                    bodyOffsetLeft += parseFloat(dcs.paddingLeft)||0;
                }
            }
            else if(IS_BODY_TOP_INHERITED) {
                bodyOffsetTop -= parseFloat(bcs.top);
                bodyOffsetLeft -= parseFloat(bcs.left);
            }
            if(IS_BODY_MARGIN_INHERITED && (!isLastOffsetElementPositioned || container === body)) {
                bodyOffsetTop -= parseFloat(bcs.marginTop)||0;
                bodyOffsetLeft -= parseFloat(bcs.marginLeft)||0;
            }
        }
        coords.x = round(offsetLeft + bodyOffsetLeft);
        coords.y = round(offsetTop + bodyOffsetTop);

        return coords;
    }

// For initializing load time constants.
    function init() {
        inited = true;
        var d = document, body = d.body;
        if(!body) return;
        var marginTop = "marginTop", position = "position", padding = "padding",
            stat = "static",
            border = "border", s = body.style,
            bCssText = s.cssText,
            bv = '1px solid transparent',
            z = "0",
            one = "1px",
            offsetTop = "offsetTop",
            ds = d.documentElement.style,
            dCssText = ds.cssText,
            x = d.createElement('div'),
            xs = x.style,
            table = d.createElement(TABLE);

        s[padding] = s[marginTop] = s.top = z;
        ds.position = stat;

        s[border] = bv;

        xs.margin = z;
        xs[position] = stat;

        // insertBefore - to avoid environment conditions with bottom script
        // where appendChild would fail.
        x = body.insertBefore(x, body.firstChild);
        IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET = (x[offsetTop] === 1);

        s[border] = z;

        // Table test.
        table.innerHTML = "<tbody><tr><td>x</td></tr></tbody>";
        table.style[border] = "7px solid";
        table.cellSpacing = table.cellPadding = z;

        body.insertBefore(table, body.firstChild);
        IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET = table.getElementsByTagName("td")[0].offsetLeft === 7;

        body.removeChild(table);

        // Now add margin to determine if body offsetTop is inherited.
        s[marginTop] = one;
        s[position] = relative;
        IS_BODY_MARGIN_INHERITED = (x[offsetTop] === 1);

        //IS_BODY_OFFSET_TOP_NO_OFFSETPARENT = body.offsetTop && !body.offsetParent;

        IS_BODY_OFFSET_EXCLUDING_MARGIN = body[offsetTop] === 0;
        s[marginTop] = z;
        s.top = one;
        IS_BODY_TOP_INHERITED = x[offsetTop] === 1;

        s.top = z;
        s[marginTop] = one;
        s[position] = xs[position] = relative;
        IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED = x[offsetTop] === 0;

        xs[position] = "absolute";
        s[position] = stat;
        if(x.offsetParent === body) {
            s[border] = bv;
            xs.top = "2px";
            // XXX Safari gets offsetParent wrong (says 'body' when body is static,
            // but then positions element from ICB and then subtracts body's clientWidth.
            // Safari is half wrong.
            //
            // XXX Mozilla says body is offsetParent but does NOT subtract EL's offsetLeft/Top.
            // Mozilla is completely wrong.
            IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH = x[offsetTop] === 1;
            s[border] = z;

            xs[position] = relative;
            ds[padding] = one;
            s[marginTop] = z;

            IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING = x[offsetTop] === 3;

            // Opera does not respect position: relative on BODY.
            s[position] = relative;
            IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD = x[offsetTop] === 3;

            xs[position] = "absolute";
            IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD = x[offsetTop] === 3;

            ds[padding] = z;
            ds[marginTop] = one;

            // Opera inherits HTML margin when body is relative and child is relative or absolute.
            IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN = x[offsetTop] === 3;
        }

        // xs.position = "fixed";
        // FIXED_HAS_OFFSETPARENT = x.offsetParent != null;
        body.removeChild(x);
        s.cssText = bCssText||"";
        ds.cssText = dCssText||"";
    }
})();
}