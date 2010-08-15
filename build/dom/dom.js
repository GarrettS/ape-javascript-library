// Cross-frame feature test function that returns an object, 
// constants for currently executing document added to APE.dom.
APE.namespace("APE.dom").getConstants = function(doc) {
    doc = doc || document;
    var od = "ownerDocument",
        docEl = doc.documentElement,
        UNDEFINED = "undefined",
        view = doc.defaultView,
        compatMode = doc.compatMode,
        testStyle,
        IS_STANDARDS_MODE = compatMode ? compatMode != "BackCompat" :
            ((testStyle = doc.createElement("p").style).width = "1", !testStyle.width);
        
    return{
        TEXT_CONTENT : typeof docEl.textContent === "string" ? "textContent" : "innerText",
        IS_BODY_ACTING_ROOT : docEl.clientWidth === 0,
        // typeof, not in for BlackBerry9000.
        OWNER_DOCUMENT : docEl && typeof docEl[od] !== UNDEFINED ? od : "document",
        IS_CURRENT_STYLE_SUPPORTED : typeof docEl.currentStyle != UNDEFINED,
        
        IS_COMPUTED_STYLE_SUPPORTED : !!view && view.getComputedStyle != UNDEFINED,

        // TODO: remove deprecated.
        IS_COMPUTED_STYLE : view && view.getComputedStyle != UNDEFINED,

        // IE, Safari, and Opera support clientTop. FF 2 doesn't
        IS_CLIENT_TOP_SUPPORTED : typeof docEl.clientTop != UNDEFINED,
        
        // Not supported.
        IS_XML_DOM : docEl.tagName === "html",
        IS_QUIRKS_MODE : !IS_STANDARDS_MODE
    };
};
APE.dom.mixin(APE.dom.getConstants(document));APE.namespace("APE.dom").key = {
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    
    ARROW_KEY_EXP : /^(?:37|38|39|40)$/,
    ENTER : 13,
    TAB : 9,
    ESC : 27
};/**
 * @author Garret Smith
 */
APE.namespace("APE.dom");
(function() {

    var DOCUMENT_ELEMENT = "documentElement", 
        dom = APE.dom;

    // Public exports.
    dom.mixin({
        getScrollOffsets : getScrollOffsets,
        getViewportDimensions : getViewportDimensions
    });

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
              var node = win.document[dom.IS_BODY_ACTING_ROOT ? "body" : DOCUMENT_ELEMENT];
              return{ left : node.scrollLeft, top : node.scrollTop };
            };
        }
        r = (dom.getScrollOffsets = f)(win);
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
            wName, hName, r;

    // Safari 2 uses document.clientWidth (default).
        if(typeof d.clientWidth == "number"){
            baseName = "window";
        }

    // Opera < 9.5, or IE in quirks mode.
        else if(dom.IS_BODY_ACTING_ROOT) {
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

        r = (dom.getViewportDimensions = getViewportDimensions)(win);
        win = d = null;
        return r;
    }
})();/**
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
/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */
(function() {
    var dom = APE.dom,
              doc = this.document,
              inited,
              documentElement = doc.documentElement;
        
    if(dom.IS_COMPUTED_STYLE_SUPPORTED && !documentElement.getBoundingClientRect) {
        dom.getOffsetCoords = getOffsetCoordsFallback;
        var round = Math.round, max = Math.max,
            parseFloat = self.parseFloat,
            GET_COMPUTED_STYLE = "getComputedStyle",
            DEFAULT_VIEW = "defaultView",
            IS_SCROLL = typeof document.createElement("p").scrollLeft == "number",
            
        // Load-time constants.
            IS_BODY_ACTING_ROOT = documentElement && documentElement.clientWidth === 0,
            
            TABLE = /^h/.test(documentElement.tagName) ? "table" : "TABLE",
        
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
    }
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
            defaultView = doc[DEFAULT_VIEW],
            // Blackbery9000 cs is null sometimes. Needs reduction. 
            cs = defaultView[GET_COMPUTED_STYLE](el, '') || el.style;
        
         if(cs.position == "fixed" && IS_SCROLL) {
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
            if(parent !== body && parent !== documentElement && IS_SCROLL) {
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
/**
 * @fileoverview dom ClassName Functions.
 * @namespace APE.dom
 * @author Garrett Smith
 * <p>
 * ClassName functions are added to APE.dom.
 * </p>
 */

APE.namespace("APE.dom").mixin(function() {
    var Exps = {},
        dom = APE.dom,
        normalizeString,
        hasClass, 
        addClass,
        removeClass,
        toggleClass,
        supportsClassList = document.documentElement.classList != undefined; 

    // Needed also for getElementsByClassName.
    function getTokenizedExp(token, flag){
        var p = token + "$" + flag;
        return Exps[p] || (Exps[p] = RegExp("(?:^|\\s)"+token+"(?:$|\\s)", flag));
    }

    if(!supportsClassList) {
        hasClass = function(el, klass) {
            return getTokenizedExp(klass, "").test(el.className);
        };
        
        addClass = function(el, klass) {
            if(!el.className) el.className = klass;
            else if(!getTokenizedExp(klass).test(el.className)) {
                el.className += " " + klass;
            }  
        };
        
        removeClass = function(el, klass) { 
            var cn = el.className;
            if(cn) {
                el.className = cn === klass ? "" :
                    normalizeString(cn.replace(getTokenizedExp(klass, "g")," "));
            }
        };

        toggleClass = function(el, klass) {
            (hasClass(el, klass) ? removeClass : addClass)(el, klass);
        };

        normalizeString = function(s) { 
            return s.replace(/^\s+|\s+$/g,"").replace(/\s\s+/g, " "); 
        };
    } else {

        /** @param {String} s string to search
         * @param {String} token white-space delimited token the delimiter of the token.
         * This is generally used with element className:
         * @example if(dom.hasToken(el.className, "menu")) // element has class "menu".
         */
        hasClass = function(el, klass) {
            return el.classList.contains(klass);
        };
    
        addClass = function(el, klass) {
            return el.classList.add(klass);
        };

        removeClass = function(el, klass) {
            return el.classList.remove(klass);
        };

        toggleClass = function(el, klass) {
            el.classList.toggle(klass);
        };
    }
    
    /** @param {HTMLElement} el
     * @param {String} tagName tagName to be searched. Use "*" for any tag.
     * @param {String} klass className token(s) to be added.
     * @return {Array|NodeList} Elements with the specified tagName and className.
     * Searches will generally be faster with a smaller HTMLCollection
     * and shorter tree.
     */
    function getElementsByClassName(el, tagName, klass) {
        if(!klass) return [];
        tagName = tagName||"*";
        if(el.getElementsByClassName && (tagName === "*")) {
            return el.getElementsByClassName(klass);
        }
        var exp = getTokenizedExp(klass,""),
            collection = el.getElementsByTagName(tagName),
            ret = [],
            len = ret.length = collection.length,
            counter = 0,
            i;
        
        for(i = 0; i < len; i++){
            if(exp.test(collection[i].className))
                ret[counter++] = collection[i];
        }
        ret.length = counter; // trim array.
        return ret;
    }

   /** Finds an ancestor with specified className
    * @param {Element|Document} [container] where to stop traversing up (optional).
    */
    function findAncestorWithClass(el, klass, container) {
        if(el == null || el === container)
            return null;
        for(var parent = el.parentNode;parent && parent != container && parent.className;){
            if(hasClass(parent, klass)) {
                return parent;
            }
            parent = parent.parentNode;
        }
        return null;
    }
    
    return{
        hasClass : hasClass,
        addClass : addClass,
        removeClass : removeClass,
        toggleClass : toggleClass,
        getElementsByClassName : getElementsByClassName,
        findAncestorWithClass : findAncestorWithClass
    };
}());APE.namespace("APE.dom").mixin(function(){

    var docEl = document.documentElement,
        PARENT_NODE = "parentNode",
        dom = APE.dom,
        caseTransform = dom.IS_XML_DOM ? 'toLowerCase' : 'toUpperCase';

    docEl = null;

    return{
        contains : contains,
        isOrContains : isOrContains,
        findAncestorWithAttribute : findAncestorWithAttribute,
        findAncestorWithTagName : findAncestorWithTagName,
        findNextSiblingElement : findNextSiblingElement,
        findPreviousSiblingElement : findPreviousSiblingElement,
        getChildElements : getChildElements
    };
    
    /** 
     * @memberOf APE.dom
     * @param {HTMLElement} el the potential container.
     * @param {HTMLElement} b the potential containee
     * @param {boolean} [includeEl] if true, and el === b, return true, 
     * otherwise, work like IE's contains (see below). 
     * @return {boolean} true if a contains b and when includeEl
     * Internet Explorer's native contains() will return true for:
     * code body.contains(body); 
     * In Safari <= 3, body.contains(body) returns false.
     */
    function contains(el, b) {
        if(!el) return false;
        var COMPARE_POSITION = "compareDocumentPosition",
            _contains = (COMPARE_POSITION in el) ? 
                function(el, b) {
                    try {
                        return !!(el && b) && ((el[COMPARE_POSITION](b) & 16) !== 0);
                    } catch(mozillaChromeObjectSecurityError_code9) {
                        // Gecko chrome tooltip object triggers a security error.
                        // Sometimes this object is null, others it is an actual
                        // Chrome object, leaked into the dom.
                        // See dom.contains, in traversal-f.js for more info.
                        return false;
                    }
                } : ('contains'in el) ? 
                function(el, b) {
                    return !!el && el !== b && el.contains(b);
                } : function(el, b) {
                    if(!el || !b || el === b) return false;
                    while(el && el !== b && (b = b[PARENT_NODE]) !== null);
                    return el === b;
            };
        return (contains = dom.contains = _contains)(el, b); 
    }

    function isOrContains(el, b) {
        return el === b || dom.contains(el, b);
    }
    
    /** 
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to start from.
     * @param {String} attName the name of the attribute.
     * @param {String} [value] the value of the attribute. If omitted, then only the 
     * presence of attribute is checked and the value is anything.
     * @return {HTMLElement} closest ancestor with <code>attName</code> matching value.
     * Returns null if not found.
     */
    function findAncestorWithAttribute(el, attName, value) {
        for(var att, undef, map, parent = el[PARENT_NODE]; parent !== null;) {
            map = parent.attributes;
            if(!map) {
                return null;
            }
            att = map[attName];
            if(att && att.specified) {
                if(att.value === value || value === undef) {
                    return parent;
                }
            } else if(parent.getAttribute) {
                att = parent.getAttribute(attName, 2);
                if(att === value || value === undef && att !== null) {
                    return parent
                }
            }
            parent = parent[PARENT_NODE];
        }
        return null;
    }

    /** 
     * @param {HTMLElement} el base element to search from
     * @param {string} tag tagName to search for.
     * @param {HTMLElement} [limit] ancestor node to stop traversing before
     * Note: limit node is not included .
     */
    function findAncestorWithTagName(el, tag, limit) {
        tag = tag[caseTransform]();
        limit = limit || null;
        for(var parent = el[PARENT_NODE];parent && parent !== limit; ){
            if( parent.tagName === tag )
                return parent;
            parent = parent[PARENT_NODE];
        }
        return null;
    }

    /** Filter out text nodes and, in IE, comment nodes. */
    function findNextSiblingElement(el) {
        return horizontalTraverse(el, "nextSibling");
    }

    function findPreviousSiblingElement(el) {
        return horizontalTraverse(el, "previousSibling");
    }
    
    function horizontalTraverse(el, sibName) {
        for(var n = el[sibName]; n !== null; n = n[sibName]) {
            if(n.nodeType === 1 && n.tagName !== "!") 
                return n;
        }
        return null;
    }
    
    function getChildElements(el) {
        var i, j, ret = [],
            cn = el.childNodes, len = cn.length, c;
        ret.length = len;
        // IE throws error when calling 
        // Array.prototype.slice.call(el.children).
        // IE also includes comment nodes.
        for(i = j = 0; i < len; i++) {
            c = cn[i];
            if(c.nodeType !== 1 || c.tagName === "!") continue;
            ret[j++] = c;
        }
        ret.length = j;
        return ret;
    }
}());APE.namespace("APE.dom").Event = function(){

    var HAS_EVENT_TARGET = "addEventListener" in this, 
        TARGET = HAS_EVENT_TARGET ? "target" : "srcElement", 
        Event = {
            get : get,
            getTarget : getTarget,
            getRelatedTarget : getRelatedTarget,
            add : addCallback,
            addCallback : addCallback,
            remove : removeCallback,
            removeCallback : removeCallback,
            purgeEvents : purgeEvents,
            preventDefault : preventDefault,
            stopPropagation : stopPropagation,
            toString : function() {
                return"APE.dom.Event";
            }
    };

    /** Gets a DomEventPublisher */
    function get(src, sEvent) {
        // Function rewriting, keeping DomEventPublisher in scope.
        // Event.get is reassigned here and invoked below and the value of
        // that is returned is returned to first caller of this function.
        Event.get = get;

        var FOCUS_DELEGATED = HAS_EVENT_TARGET ? "focus" : "focusin", BLUR_DELEGATED = HAS_EVENT_TARGET ? "blur"
                : "focusout", Registry = {}, isMaybeLeak/* @cc_on=(@_jscript_version<5.7)@ */, useCaptureMap = {
            "focus" : FOCUS_DELEGATED,
            "blur" : BLUR_DELEGATED
        }, cleanUp;

        // Keep this in [[Scope]] of get method, but rewrite get.
        function DomEventPublisher(src, type) {
            if (!src.addEventListener && !src.attachEvent) {
                throw TypeError(src + " is not a compatible object.");
            }
            this.src = src;
            this.type = type;
            this._callStack = [];
        }

        DomEventPublisher.prototype = {
            add : function(callback) {
                DomEventPublisher.prototype.add = add;
                this.add(callback);
                function add(callback) {
                    var o = this.src, captureAdapterType = useCaptureMap[this.type], 
                        type = captureAdapterType || this.type;
                    if (HAS_EVENT_TARGET) {
                        o.addEventListener(type, callback,
                                        !!captureAdapterType);
                    } else {
                        callback = getBoundCallback(o, callback);

                        o.attachEvent("on" + type, callback);
                    }
                    this._callStack.push(callback);
                }
                /**
                 * A closure is used to wrap a call to the callback
                 * in context of o.
                 * @param {Object} o the desired would-be EventTarget
                 * @param {Function} cb the callback.
                 */
                function getBoundCallback(o, cb) {
                    // no binding for window, because: 
                    // 1) context is already global and
                    // 2) removing onunload handlers is skipped (see cleanUp);
                    if (o === window)
                        return cb;
                    function bound(ev) {
                        bound.original.call(bound.context, ev || window.event);
                    }
                    bound.original = cb;
                    bound.context = o;
                    cb = o = null;
                    return bound;
                }
            },

            remove : function(callback) {
                DomEventPublisher.prototype.remove = remove;
                this.remove(callback);
                function remove(callback) {
                    callback = removeFromCallStack(this._callStack, callback);
                    if (callback) { // IE TypeMismatch if not a function
                        if (HAS_EVENT_TARGET) {
                            this.src.removeEventListener(this.type, callback,
                                    this.type in useCaptureMap);
                        } else {
                            this.src.detachEvent("on" + this.type, callback);
                        }
                    }
                }
                function removeFromCallStack(callStack, callback) {
                    var cb, i, len;
                    for (i = 0, len = callStack.length; i < len; i++) {
                        cb = callStack[i];
                        if ((cb.original || cb) === callback) {
                            delete cb.original;
                            delete cb.context;
                            return callStack.splice(i, 1)[0];
                        }
                    }
                    return null;
                }
            },
        
            purge : function() {
                var callStack = this._callStack, cb, i;
                for (i = callStack.length; i-- > 0; callStack.length = i) {
                    cb = callStack[i];
                    this.remove(cb.original || cb);
                }
            },
        
            toString : function() {
                return "DomEventPublisher: src: " + this.src + ", type: " + this.type;
            }
        };

        function get(src, sEvent) {
            var publisherList = Registry[sEvent] || (Registry[sEvent] = []), i, len, publisher;

            for (i = 0, len = publisherList.length; i < len; i++) {
                publisher = publisherList[i];
                if (publisher.src === src) {
                    return publisher;
                }
            }

            // not found.
            publisher = new DomEventPublisher(src, sEvent);
            publisherList[len] = publisher;
            return publisher;
        }

        if (isMaybeLeak) {
            get(window, "unload")
                    .add(
                            cleanUp = function() {
                                var sEvent, publisherList, i, publisher;

                                for (sEvent in Registry) {
                                    publisherList = Registry[sEvent];
                                    for (i = publisherList.length; i-- > 0; publisherList.length = i) {
                                        publisher = publisherList[i];
                                        // Do not remove any window load
                                        // listeners on unload;
                                        // callbacks fire out of order in IE.
                                        if (publisher.src != publisher.src.window) {
                                            publisher.purge();
                                        }
                                    }
                                    delete Registry[sEvent];
                                }
                                removeCallback(window, "unload", cleanUp);
                            });
        }
        return get(src, sEvent);
    }

    function getTarget(ev) {
        return (Event.getTarget = HAS_EVENT_TARGET ? function(ev) {
            return ev && getEventElementProperty(ev, TARGET);
        } : function(ev) {
            ev = window.event;
            return ev && ev.srcElement;
        })(ev);
    }

    function getRelatedTarget(ev) {
        if (!HAS_EVENT_TARGET) {
            var relatedTargetMap = {
                "mouseover" : "fromElement",
                "mouseenter" : "fromElement",
                "mouseout" : "toElement",
                "mouseleave" : "toElement"
            };
            return (Event.getRelatedTarget = function(ev) {
                ev = ev || window.event;
                if (ev) {
                    var name = relatedTargetMap[ev.type], val = getEventElementProperty(
                            ev, name);
                    return val;
                }
            })(ev);
        }
        if (ev) {
            // If relatedTarget is null (sometimes in Mozilla),
            // it is on a "titleTip" window, and probably the one 
            // triggered by the "target".
            // https://developer.mozilla.org/en/DOM/event.relatedTarget
            // 
            // Gecko chrome tooltip objects trigger security errors when 
            // accessing any properties (toString, constructor, nodeName, etc).
            // Sometimes the tooltip results in null relatedTarget, other times 
            // it is a browser chrome object. When it is null, we return the target.
            var relatedTarget = ev.relatedTarget;
            // console.log() won't fire if it is a chrome object, 
            // but we will see a stack trace.
            // if(!relatedTarget) console.log("using target")
            try { 
                relatedTarget.nodeName;
            } catch(mozillaChromeObjectSecurityError_code9) {
            //  console.trace();
            }
            return relatedTarget;
        }
    }

    /** @param {Event} A w3c DOM Event or an IE "window.event". 
     * @param {propertyName} property name to get from the Event.
     */
    function getEventElementProperty(ev, propertyName) {

        var node = ev[propertyName];
        if (node && node.nodeName === "#text") {
            // For Safari 2.0, 2.0.4.
            node = node.parentNode;
        }
        return node;
    }

    /**
     * addEventListener/attachEvent for DOM objects.
     * @param {Object} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @return {DomEventPublisher} this object.
     */
    function addCallback(o, type, cb) {
        Event.get(o, type).add(cb);
    }

    /** Removes all events supplied */
    function purgeEvents(obj, eventList) {
        if (typeof eventList == "string") {
            Event.get(obj, eventList).purge();
        } else {
            for ( var i = 0, len = eventList.length; i < len; i++) {
                Event.get(obj, eventList[i]).purge();
            }
        }
    }

    /**
     * removeEventListener/detachEvent for DOM objects.
     * @param {EventTarget} o host object, Element, Document, Window.
     * @param (string} type event type (no "on" prefix here).
     * @param {Function} cb function to remove.
     * @param {boolean} [useCapture] for internal use for delegated focus.
     */
    function removeCallback(o, type, cb, useCapture) {
        Event.get(o, type).remove(cb);
    }

    /** @param {Event} */
    function preventDefault(ev) {
        ev = ev || window.event;
        if ("preventDefault" in ev) {
            ev.preventDefault();
        } else if ("returnValue" in ev) {
            ev.returnValue = false;
        }
    }

    function stopPropagation(ev) {
        if (HAS_EVENT_TARGET) {
            ev.stopPropagation();
        } else {
            (window.event || ev).cancelBubble = true;
        }
    }
    return Event;
}();/** @requires viewport-f.js (for scrollOffsets in IE). */
APE.dom.Event.getCoords = function(ev) {
    var dom = APE.dom, getCoords, result;
    if ("pageX" in ev) {
        getCoords = function(ev) {
            return{
                x : ev.pageX,
                y : ev.pageY
            };
        };
    } else {
        getCoords = function(ev) {
            var scrollOffsets = dom.getScrollOffsets(); 
            ev = ev || window.event;
            return{
                x : ev.clientX + scrollOffsets.left,
                y : ev.clientY + scrollOffsets.top
            };
        };
    }
    result = (dom.Event.getCoords = getCoords)(ev);
    ev = null;
    return result;
};/** @fileoverview
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
})();/**
 * @requires APE.dom.style-f.js
 */
APE.dom.getPixelCoords = function (el){
    var ret, dom = APE.dom,
        parseInt = self.parseInt,
        f = (dom.IS_COMPUTED_STYLE_SUPPORTED ? function(el) {
        var cs = el[dom.OWNER_DOCUMENT].defaultView.getComputedStyle(el, "");
        return{
            x : parseInt(cs.left, 10)||0,
            y : parseInt(cs.top, 10)||0
        };
    } : function(el){
        var style = el.style;
        return{
            // pixelLeft, in IE returns 0 when the element does not have 
            // left: in the style attribute, so if that fails, try to read 
            // the style using dom.getStyle.
            x : style.pixelLeft || parseInt(dom.getStyle(el,"left"), 10)||0,
            y : style.pixelTop || parseInt(dom.getStyle(el,"top"), 10)||0
        };
    });
    ret = (dom.getPixelCoords = f)(el);
    el = null;
    return ret;
};