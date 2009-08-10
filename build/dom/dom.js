/**dom.js rollup: constants.js, viewport-f.js, position-f.js, classname-f.js,  traversal-f.js, Event.js, Event-coords.js, style-f.js, gebi-f.js */
APE.namespace("APE.dom" );
(function(){
	var dom = APE.dom,
	docEl = document.documentElement,  
	textContent = "textContent",
	view = document.defaultView;
	
    dom.IS_COMPUTED_STYLE = (typeof view != "undefined" && "getComputedStyle" in view);
	dom.textContent = textContent in docEl ? textContent : "innerText";
})();/**
 * @author Garret Smith
 */


(function() {

    // Public exports.
    APE.mixin(APE.dom, {
        getScrollOffsets : getScrollOffsets,
        getViewportDimensions : getViewportDimensions
    });


    var documentElement = "documentElement", 
        docEl = document[documentElement],
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
        var f, d = win.document, node = d[documentElement];
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
        } else if(d[documentElement].clientHeight > 0){
            node = d[documentElement];

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
            var r = d[documentElement].clientHeight > 2400;
            d.body.removeChild(div);
            return r;
        }
    }
})();/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */

(function() {
    APE.mixin(
        APE.dom,
            /** @scope APE.dom */ {
            getOffsetCoords : getOffsetCoords,
            isAboveElement : isAboveElement,
            isBelowElement : isBelowElement,
            isInsideElement: isInsideElement
    });

    var doc = this.document,
        inited,
        documentElement = doc.documentElement,
        round = Math.round, max = Math.max,

    // Load-time constants.
        IS_BODY_ACTING_ROOT = documentElement && documentElement.clientWidth === 0,

    // IE, Safari, and Opera support clientTop. FF 2 doesn't
        IS_CLIENT_TOP_SUPPORTED = 'clientTop'in documentElement,

        TABLE = /^h/.test(documentElement.tagName) ? "table" : "TABLE",

        IS_CURRENT_STYLE_SUPPORTED = 'currentStyle'in documentElement,

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

        IS_COMPUTED_STYLE_SUPPORTED = doc.defaultView
            && typeof doc.defaultView.getComputedStyle != "undefined",
        getBoundingClientRect = "getBoundingClientRect",
        relative = "relative",
        borderTopWidth = "borderTopWidth",
        borderLeftWidth = "borderLeftWidth",
        positionedExp = /^(?:r|a)/,
        absoluteExp = /^(?:a|f)/;

    /**
     * @memberOf APE.dom
     * @param {HTMLElement} el you want coords of.
     * @param {HTMLElement} positionedContainer container to look up to. The container must have
     * position: (relative|absolute|fixed);
     *
     * @param {x:Number, y:Number} coords object to pass in.
     * @return {x:Number, y:Number} coords of el from container.
     *
     * Passing in a container will improve performance in browsers that don't support
     * getBoundingClientRect, but those that do will have a recursive call. Test accordingly.
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

        var doc = el.ownerDocument,
            documentElement = doc.documentElement,
            body = doc.body;

        if(!container)
            container = doc;

        if(!coords)
            coords = {x:0, y:0};

        if(el === container) {
            coords.x = coords.y = 0;
            return coords;
        }
        if(getBoundingClientRect in el) {

            // In BackCompat mode, body's border goes to the window. BODY is ICB.
            var rootBorderEl = IS_BODY_ACTING_ROOT ? body : documentElement,
                box = el[getBoundingClientRect](),
                x = box.left + max( documentElement.scrollLeft, body.scrollLeft ),
                y = box.top + max( documentElement.scrollTop, body.scrollTop ),
                bodyCurrentStyle,
                borderTop = rootBorderEl.clientTop,
                borderLeft = rootBorderEl.clientLeft;

            if(IS_CLIENT_TOP_SUPPORTED) {
                x -= borderLeft;
                y -= borderTop;
            }
            if(container !== doc) {
                box = getOffsetCoords(container, null);
                x -= box.x;
                y -= box.y;
                if(IS_BODY_ACTING_ROOT && container === body && IS_CLIENT_TOP_SUPPORTED) {
                    x -= borderLeft;
                    y -= borderTop;
                }
            }

            if(IS_BODY_ACTING_ROOT && IS_CURRENT_STYLE_SUPPORTED
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

    // Crawling up the tree.
        else if(IS_COMPUTED_STYLE_SUPPORTED) {
            if(!inited) init();

            var offsetLeft = el.offsetLeft,
                offsetTop = el.offsetTop,
                defaultView = doc.defaultView,
                cs = defaultView.getComputedStyle(el, '');
            if(cs.position == "fixed") {
                coords.x = offsetLeft + documentElement.scrollLeft;
                coords.y = offsetTop + documentElement.scrollTop;
                return coords;
            }
            var bcs = defaultView.getComputedStyle(body,''),
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
                        // See IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET below.
                        if( !IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET &&
                            ! (parent.tagName === TABLE && IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET)) {
                                var pcs = defaultView.getComputedStyle(parent, "");
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
                lastOffsetPosition = defaultView.getComputedStyle(lastOffsetParent,'').position;
                isLastElementAbsolute = absoluteExp.test(lastOffsetPosition);
                isLastOffsetElementPositioned = isLastElementAbsolute ||
                    positionedExp.test(lastOffsetPosition);
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
                dcs = defaultView.getComputedStyle(documentElement,'');
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
                        if(!dcs) dcs = defaultView.getComputedStyle(documentElement,'');
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
    }

// For initializing load time constants.
    function init() {
		inited = true;
        var body = doc.body;
        if(!body) return;
        var marginTop = "marginTop", position = "position", padding = "padding",
            stat = "static",
            border = "border", s = body.style,
            bCssText = s.cssText,
            bv = '1px solid transparent',
            z = "0",
            one = "1px",
            offsetTop = "offsetTop",
            ds = documentElement.style,
            dCssText = ds.cssText,
            x = doc.createElement('div'),
            xs = x.style,
            table = doc.createElement(TABLE);

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

  // TODO: add an optional commonAncestor parameter to the below.
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

    // release from closure.
    isInsideElement = isAboveElement = isBelowElement = null;
})();
/**
 * @fileoverview dom ClassName Functions.
 * @namespace APE.dom
 * @author Garrett Smith
 * <p>
 * ClassName functions are added to APE.dom.
 * </p>
 */


(function() {
    APE.mixin(APE.dom,
        {
        hasToken : hasToken,
        removeClass : removeClass,
        addClass : addClass,
        getElementsByClassName : getElementsByClassName,
        findAncestorWithClass : findAncestorWithClass
    });

    var className = "className";
    /** @param {String} s string to search
     * @param {String} token white-space delimited token the delimiter of the token.
     * This is generally used with element className:
     * @example if(dom.hasToken(el.className, "menu")) // element has class "menu".
     */
    function hasToken (s, token) {
        return getTokenizedExp(token,"").test(s);
    }

    /** @param {HTMLElement} el
     * @param {String} klass className token(s) to be removed.
     * @description removes all occurances of <code>klass</code> from element's className.
     */
    function removeClass(el, klass) {
        var cn = el[className];
        if(!cn) return;
        if(cn === klass) {
            el[className] = "";
            return;
        }

        el[className] = normalizeString(cn.replace(getTokenizedExp(klass, "g")," "));
    }
    /** @param {HTMLElement} el
     * @param {String} klass className token(s) to be added.
     * @description adds <code>klass</code> to the element's class attribute, if it does not
     * exist.
     */
    function addClass(el, klass) {
        if(!el[className]) el[className] = klass;
        if(!getTokenizedExp(klass).test(el[className])) el[className] += " " + klass;
    }

    var Exps = { };
    function getTokenizedExp(token, flag){
        var p = token + "$" + flag;
        return (Exps[p] || (Exps[p] = RegExp("(?:^|\\s)"+token+"(?:$|\\s)", flag)));
    }
    
    /** @param {HTMLElement} el
     * @param {String} tagName tagName to be searched. Use "*" for any tag.
     * @param {String} klass className token(s) to be added.
     * @return {Array|NodeList} Elements with the specified tagName and className.
     * Searches will generally be faster with a smaller HTMLCollection
     * and shorter tree.
     */
    function getElementsByClassName(el, tagName, klass){
        if(!klass) return [];
        tagName = tagName||"*";
        if(el.getElementsByClassName && (tagName === "*")) {
            // Native performance boost.
            return el.getElementsByClassName(klass);
        }
        var exp = getTokenizedExp(klass,""),
            collection = el.getElementsByTagName(tagName),
            len = collection.length,
            counter = 0,
            i,
            ret = Array(len);
        for(i = 0; i < len; i++){
            if(exp.test(collection[i][className]))
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
        var exp = getTokenizedExp(klass,""), parent;
        for(parent = el.parentNode;parent != container;){
            if( exp.test(parent[className]) )
                return parent;
            parent = parent.parentNode;
        }
        return null;
    }

var STRING_TRIM_EXP = /^\s+|\s+$/g,
    WS_MULT_EXP = /\s\s+/g;
function normalizeString(s) { return s.replace(STRING_TRIM_EXP,'').replace(WS_MULT_EXP, " "); }
})();
(function(){

    var docEl = document.documentElement,
        nodeType = "nodeType",
        tagName = "tagName",
        parentNode = "parentNode",
        compareDocumentPosition = "compareDocumentPosition",
        caseTransform = /^H/.test(docEl[tagName]) ? 'toUpperCase' : 'toLowerCase',
        tagExp = /^[A-Z]/;
        
    APE.mixin(
        APE.dom, {
        contains : getContains(),
        findAncestorWithAttribute : findAncestorWithAttribute,
        findAncestorWithTagName : findAncestorWithTagName,
        findNextSiblingElement : findNextSiblingElement,
        findPreviousSiblingElement : findPreviousSiblingElement,
        getChildElements : getChildElements
    });

    /** 
     * @memberOf APE.dom
     * @return {boolean} true if a contains b.
     * Internet Explorer's native contains() is different. It will return true for:
     * code body.contains(body); 
     * Whereas APE.dom.contains will return false.
     */

    function getContains(){
        if(compareDocumentPosition in docEl)
            return function(el, b) {
                return (el[compareDocumentPosition](b) & 16) !== 0;
        };
        else if('contains'in docEl)
            return function(el, b) {
                return el !== b && el.contains(b);
        };
        return function(el, b) {
            if(el === b) return false;
            while(el != b && (b = b[parentNode]) !== null);
            return el === b;
        };
    }

    //docEl = null;

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
        for(var map, parent = el[parentNode];parent !== null;){
            map = parent.attributes;
            if(!map) return null;
            var att = map[attName];
            if(att && att.specified)
                if(att.value === value || (value === undefined))
                    return parent;            
            parent = parent[parentNode];
        }
        return null;
    }

    function findAncestorWithTagName(el, tag) {
        tag = tag[caseTransform]();
        for(var parent = el[parentNode];parent !== null; ){
            if( parent[tagName] === tag )
                return parent;
            parent = parent[parentNode];
        }
        return null;
    }

    /** Filter out text nodes and, in IE, comment nodes. */
    function findNextSiblingElement(el) {
        for(var ns = el.nextSibling; ns !== null; ns = ns.nextSibling)
            if(ns[nodeType] === 1) 
                return ns;
        return null;
    }

    function findPreviousSiblingElement(el) {
        for(var ps = el.previousSibling; ps !== null; ps = ps.previousSibling) {
            if(ps[nodeType] === 1) 
                return ps;
        }
        return null;
    }
   
    function getChildElements(el) {
        var i = 0, ret = [], len, tag,
            cn = el.children || el.childNodes, c;
        
        // IE throws error when calling 
        // Array.prototype.slice.call(el.children).
        // IE also includes comment nodes.
        for(len = cn.length; i < len; i++) {
            c = cn[i];
            if(c[nodeType] !== 1) continue;
            ret[ret.length] = c;
        }
        return ret;
    }
})();/**
 * @requires APE.dom.Viewport
 */
/** @namespace APE.dom */


(function() {

    var hasEventTarget = "addEventListener"in this,
        eventTarget = hasEventTarget ? "target" : "srcElement";

    APE.mixin(
        APE.dom.Event = {}, {
            eventTarget : eventTarget,
            getTarget : getTarget, 
            addCallback : addCallback,
            removeCallback : removeCallback,
            preventDefault : preventDefault
    });
    
    function getTarget(e) {
        return (e || window.event)[eventTarget];
    }

    /**
     * If EventTarget is supported, cb (input param) is returned.
     * Otherwise, a closure is used to wrap a call to the callback
     * in context of o.
     * @param {Object} o the desired would-be EventTarget
     * @param {Function} cb the callback.
     */
    function getBoundCallback(o, cb) {
        return hasEventTarget ? cb : function(ev) {
            cb.call(o, ev);
        };
    }

    /**
     * addEventListener/attachEvent for DOM objects.
     * @param {Object} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @return {Function} cb If EventTarget is not supported,
     * a bound callback is created and returned. Otherwise,
     * cb (input param) is returned.
     */
    function addCallback(o, type, cb) {
        if (hasEventTarget) {
            o.addEventListener(type, cb, false);
        } else {
            var bound = getBoundCallback(o, cb);
            o.attachEvent("on" + type, bound);
        }
        return bound||cb;
    }

    /**
     * removeEventListener/detachEvent for DOM objects.
     * @param {EventTarget} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @return {Function} bound If EventTarget is not supported,
     * a bound callback is created and returned. Otherwise,
     * cb (input param) is returned.
     */
    function removeCallback(o, type, bound) {
        if (hasEventTarget) {
            o.removeEventListener(type, bound, false);
        } else {
            o.detachEvent("on" + type, bound);
        }
        return bound;
    }

    /**
     * @param {Event}
     */
    function preventDefault(ev) {
        ev = ev || window.event;
        if("preventDefault" in ev) {
            ev.preventDefault();
        } else if("returnValue" in ev) {
            ev.returnValue = false;
        }
    }
})();/**
 * @requires viewport-f.js (for scrollOffsets in IE).
 */
APE.namespace("APE.dom.Event");
(function() {
    var dom = APE.dom, 
        Event = dom.Event;
    Event.getCoords = getCoords;
    function getCoords(e) {
        var f;
        if ("pageX" in e) {
            f = function(e) {
                return {
                    x : e.pageX,
                    y : e.pageY
                };
            };
        } else {
            f = function(e) {
                var scrollOffsets = dom.getScrollOffsets(); 
                e = e || window.event;
                return {
                    x : e.clientX + scrollOffsets.left,
                    y : e.clientY + scrollOffsets.top
                }
            };
        }
        return (Event.getCoords = f)(e);
    }
})();/** @fileoverview
 * Getting computed styles, opacity functions.
 *
 * @author Garrett Smith
 */

/**@name APE.dom 
 * @namespace*/

(function(){

    var multiLengthPropExp = /^(?:margin|(border)(Width|Color|Style)|padding)$/,
        borderRadiusExp = /^[a-zA-Z]*[bB]orderRadius$/,
        dom = APE.dom;
    
    APE.mixin(dom, /** @scope APE.dom */{
        /** @function */ getStyle : getStyle,
        setOpacity : setOpacity,
        getFilterOpacity : getFilterOpacity,
        
        // TODO: Remove these from public interface. 
        // Capture (border)(Width) because we need to put "Top" in the middle.
        multiLengthPropExp : multiLengthPropExp,
        borderRadiusExp : borderRadiusExp,
        tryGetShorthandValues : tryGetShorthandValues,
        getCurrentStyleValueFromAuto : getCurrentStyleValueFromAuto,
        convertNonPixelToPixel : convertNonPixelToPixel
    });

    var getCS = "getComputedStyle",
        IS_COMPUTED_STYLE = dom.IS_COMPUTED_STYLE,
        currentStyle = "currentStyle",
        opacity = "opacity",
        style = "style";
    
    /** 
     * Special method for a browser that supports el.filters and not style.opacity.
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to find opacity on.
     * @return {ufloat} [0-1] amount of opacity.
     * calling this method on a browser that does not support filters
     * results in 1 being returned.  Use dom.getStyle or dom.getCascadedStyle instead
     */
    function getFilterOpacity(el) {
        var filter, filters = el.filters;
        if(!filters)return"";
        try {
            // Try the more common alphaType first.
            // First time is a guess.
            filter = filters.item(alphaTypes[0]);
        } catch(alpha) {
            try {
                // Try the other alpha type.
                filter = filters.item(alphaTypes[1]);
                alphaTypes.reverse();
            } catch(ex){}
        }
        return filter && filter[opacity]/100 || 1;
    }
    var alphaTypes = ["alpha", "DXImageTransform.Microsoft.Alpha"],
        alphaString = "alpha("+opacity+"=";
    
    /** 
     * Cross-browser adapter method for style.filters vs style.opacity.
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to set opacity on.
     * @param {ufloat} i [0-1] the amount of opacity.
     * @return {ufloat} [0-1] amount of opacity.
     */
    function setOpacity(el, i) {
        var s = el[style], cs, hasLayout = "hasLayout";
        if(opacity in s) {
            s[opacity] = i;
        } else if("filter"in s) {
            cs = el[currentStyle];
            s.filter = alphaString + (i * 100) + ")";
            if(cs && (hasLayout in cs) && !cs[hasLayout]) {
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
    function getStyle(el, p) {
        var value = "", cs, matches, splitVal, i, len, doc = el.ownerDocument, 
            defaultView = doc.defaultView;
        if(/float/.test(p)) {
            p = floatProp;
        }
        if(IS_COMPUTED_STYLE) {
            cs = defaultView[getCS](el, "");
            if(borderRadiusExp.test(p)) {
                p = borderRadiusProp;
            }

            if(!(p in cs)) return "";
            value = cs[p];
            if(value === "") {
                // would try to get a rect, but Webkit doesn't support that.
                value = (tryGetShorthandValues(cs, p)).join(" ");
            }
        } else {
            cs = el[currentStyle];
            if(p === opacity) {
                value = getFilterOpacity(el);
            }
            else {
                value = cs[p];

                if(value == "auto") {
                    value = getCurrentStyleValueFromAuto(el, p);
                } else if(!(p in cs)) {
                    return "";
                }
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

    var sty = document.documentElement[style],
        floatProp = 'cssFloat'in sty ? 'cssFloat': 'styleFloat',
        
        orderRadius = "orderRadius",
        bor = "b"+orderRadius,
        mor = "MozB"+orderRadius,
        wor = "WebkitB"+orderRadius,
        borderRadiusProp = bor in sty ? bor : mor in sty ? mor : wor,
        props = ["Top", "Right", "Bottom", "Left"],
        cornerProps = ["Topright", "Bottomright", "Bottomleft", "Topleft"];
        sty = orderRadius = null;
    
    function getCurrentStyleValueFromAuto(el, p) {
        
        var s = el[style], v, borderWidth, doc = el.ownerDocument;
        if("pixelWidth"in s && pixelDimensionExp.test(p)) {
            var pp = "pixel" + (p.charAt(0).toUpperCase()) + p.substring(1);
            v = s[pp];
            if(v === 0) {
                if(p == "width") {
                    borderWidth = parseFloat(getStyle(el, "borderRightWidth"))||0;
                    paddingWidth = parseFloat(getStyle(el, "paddingLeft"))||0
                        + parseFloat(getStyle(el, "paddingRight"))||0;

                    return el.offsetWidth - el.clientLeft - borderWidth - paddingWidth + px;
                } 
                else if(p == "height") {
                    borderWidth = parseFloat(getStyle(el, "borderBottomWidth"))||0;
                    paddingWidth = parseFloat(getStyle(el, "paddingTop"))||0
                        + parseFloat(getStyle(el, "paddingBottom"))||0;
                    return el.offsetHeight - el.clientTop - borderWidth + px;
                }
            }
            return s[pp] + px;
        }
        if(p == "margin" && el[currentStyle].position != "absolute" && 
          doc.compatMode !== "BackCompat") {
            v = parseFloat(getStyle(el.parentNode, 'width')) - el.offsetWidth;
            if(v == 0) return "0px";
            v = "0px " + v;
            return v + " " + v;
        }
        
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

    var nonPixelExp = /(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/,
        pixelDimensionExp = /width|height|top|left/,
        px = "px"; 

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
            if(parseFloat(val) === 0) {
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
})();/**
 * XXX: IE Fix for getElementById returning elements by name.
 */
(function(){
    var d = document, x = d.body, c,
        g = 'getElementById',
        orig = document[g];

    if(!x) return setTimeout(arguments.callee,50);

    try {
        c = d.createElement("<A NAME=0>");
        x.insertBefore(c, x.firstChild);
        if(d[g]('0')){
            x.removeChild(c);
            d[g] = getElementById;
        }
    } catch(x){}
    function getElementById(id) {
        var el = Function.prototype.call.call(orig, this, id), els, i;

        if(el.id == id) return el;
        els = this.getElementsByName(id);

        for(i = 0; i < els.length; i++)
            if(els[i].id === id) return els[i];
        return null;
    };
})();
