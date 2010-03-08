APE.namespace("APE.dom").mixin(function(){

    var docEl = document.documentElement,
        hasNamedItem = "getNamedItem" in docEl.attributes,
        PARENT_NODE = "parentNode",
        caseTransform = /^H/.test(docEl.tagName) ? 'toUpperCase' : 'toLowerCase';

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
        var docEl = document.documentElement,
            COMPARE_POSITION = "compareDocumentPosition",
            f = (COMPARE_POSITION in docEl) ? 
                function(el, b) {
                    return el && b && ((el[COMPARE_POSITION](b) & 16) !== 0);
                } : ('contains'in docEl) ? 
                function(el, b) {
                    return el && el !== b && el.contains(b);
                } : function(el, b) {
                    if(!el || !b || el === b) return false;
                    while(el && el !== b && (b = b[PARENT_NODE]) !== null);
                    return el === b;
            };
        docEl = null;
        return (contains = APE.dom.contains = f)(el, b); 
    }

    function isOrContains(el, b) {
        return el === b || APE.dom.contains(el, b);
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
        for(var att, map, parent = el[PARENT_NODE];parent !== null;){
            map = parent.attributes;
            if(!map || !hasNamedItem) {
                return null;
            }
            att = map.getNamedItem(attName);
            if(att && att.specified) {
                if(att.value === value || (value === undefined)) {
                    return parent;
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
            if(n.nodeType === 1) 
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
            if(c.nodeType !== 1) continue;
            ret[j++] = c;
        }
        ret.length = j;
        return ret;
    }
}());