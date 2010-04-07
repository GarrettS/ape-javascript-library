/**
 * @fileoverview dom ClassName Functions.
 * @namespace APE.dom
 * @author Garrett Smith
 * <p>
 * ClassName functions are added to APE.dom.
 * </p>
 */

APE.namespace("APE.dom").mixin(function() {
    var CLASSNAME = "className",
        Exps,
        undef,
        dom = APE.dom,
        getTokenizedExp,
        normalizeString,
        supportsClassList = document.documentElement.classList != undef; 

    if(!supportsClassList) {
        Exps = {};
        getTokenizedExp = function(token, flag){
            var p = token + "$" + flag;
            return Exps[p] || (Exps[p] = RegExp("(?:^|\\s)"+token+"(?:$|\\s)", flag));
        };
        normalizeString = function(s) { 
            return s.replace(/^\s+|\s+$/g,"").replace(/\s\s+/g, " "); 
        };
    }
    
    return{
        hasClass : hasClass,
        removeClass : removeClass,
        addClass : addClass,
        toggleClass : toggleClass,
        getElementsByClassName : getElementsByClassName,
        findAncestorWithClass : findAncestorWithClass
    };

    /** @param {String} s string to search
     * @param {String} token white-space delimited token the delimiter of the token.
     * This is generally used with element className:
     * @example if(dom.hasToken(el.className, "menu")) // element has class "menu".
     */
    function hasClass(el, klass) {
        return (dom.hasClass = supportsClassList ? function(el, klass) {
            return el.classList.contains(klass);
            } : function(el, klass) {
            return getTokenizedExp(klass, "").test(el.className);
        })(el, klass);
    }

    function toggleClass(el, klass) {
        (hasClass(el, klass) ? removeClass : addClass)(el, klass);
    }
    
    /** @param {HTMLElement} el
     * @param {String} klass className token(s) to be removed.
     * @description removes all occurances of <code>klass</code> from element's className.
     */
    function removeClass(el, klass) {
        (dom.removeClass = supportsClassList ? 
                function(el, klass) {
            el.classList.remove(klass);
        } : function(el, klass) { 
            var cn = el[CLASSNAME];
            if(!cn) return;
            el[CLASSNAME] = cn === klass ? "" :
                normalizeString(cn.replace(getTokenizedExp(klass, "g")," "));
        })(el, klass);
     }
    /** @param {HTMLElement} el
     * @param {String} klass className token(s) to be added.
     * @description adds <code>klass</code> to the element's class attribute, if it does not
     * exist.
     */
    function addClass(el, klass) {
        (dom.addClass = supportsClassList ? function(el, klass) {
                return el.classList.add(klass);
            } : function(el, klass) {
                if(!el[CLASSNAME]) el[CLASSNAME] = klass;
                else if(!getTokenizedExp(klass).test(el[CLASSNAME])) {
                    el[CLASSNAME] += " " + klass;
                }
         })(el, klass);
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
            ret = [],
            len = ret.length = collection.length,
            counter = 0,
            i;
        
        for(i = 0; i < len; i++){
            if(exp.test(collection[i][CLASSNAME]))
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
}());