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
}());