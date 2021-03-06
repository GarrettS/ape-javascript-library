APE.namespace("APE.dom").mixin(function(){

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
}());