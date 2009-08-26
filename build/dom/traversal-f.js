APE.namespace("APE.dom");
(function(){

    var docEl = document.documentElement,
        hasNamedItem = "getNamedItem" in docEl.attributes,
        NODE_TYPE = "nodeType",
        COMPARE_POSITION = "compareDocumentPosition",
        PARENT_NODE = "parentNode",
        caseTransform = /^H/.test(docEl.tagName) ? 'toUpperCase' : 'toLowerCase';

    APE.mixin(
        APE.dom, {
        contains : getContains(),
        findAncestorWithAttribute : findAncestorWithAttribute,
        findAncestorWithTagName : findAncestorWithTagName,
        findNextSiblingElement : findNextSiblingElement,
        findPreviousSiblingElement : findPreviousSiblingElement,
        getChildElements : getChildElements
    });
    docEl = null;
    
    /** 
     * @memberOf APE.dom
     * @return {boolean} true if a contains b.
     * Internet Explorer's native contains() is different. It will return true for:
     * code body.contains(body); 
     * Whereas APE.dom.contains will return false.
     */

    function getContains(){
        if(COMPARE_POSITION in docEl)
            return function(el, b) {
                return (el[COMPARE_POSITION](b) & 16) !== 0;
        };
        else if('contains'in docEl)
            return function(el, b) {
                return el !== b && el.contains(b);
        };
        return function(el, b) {
            if(el === b) return false;
            while(el !== b && (b = b[PARENT_NODE]) !== null);
            return el === b;
        };
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
            if(!map || !hasNamedItem) return null;
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

    function findAncestorWithTagName(el, tag) {
        tag = tag[caseTransform]();
        for(var parent = el[PARENT_NODE];parent !== null; ){
            if( parent.tagName === tag )
                return parent;
            parent = parent[PARENT_NODE];
        }
        return null;
    }

    /** Filter out text nodes and, in IE, comment nodes. */
    function findNextSiblingElement(el) {
        for(var ns = el.nextSibling; ns !== null; ns = ns.nextSibling)
            if(ns[NODE_TYPE] === 1) 
                return ns;
        return null;
    }

    function findPreviousSiblingElement(el) {
        for(var ps = el.previousSibling; ps !== null; ps = ps.previousSibling) {
            if(ps[NODE_TYPE] === 1) 
                return ps;
        }
        return null;
    }
   
    function getChildElements(el) {
        var i = 0, j, ret = [], len,
            cn = el.childNodes, c;
        
        // IE throws error when calling 
        // Array.prototype.slice.call(el.children).
        // IE also includes comment nodes.
        for(len = cn.length, j = 0; i < len; i++) {
            c = cn[i];
            if(c[NODE_TYPE] !== 1) continue;
            ret[j++] = c;
        }
        return ret;
    }
})();