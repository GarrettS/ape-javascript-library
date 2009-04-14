APE.namespace("APE.dom");
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
})();