APE.namespace("APE.dom");
(function(){
	var dom = APE.dom,  
        POS = "position";
	dom.getContainingBlock = getContainingBlock;
	
	/** 
	 * Finds the containing block of el, as per CSS 2.1 sec 10.1
	 * @memberOf APE.dom 
	 * @param {HTMLElement} el
	 * @return {HTMLElement} el's containing block.
	 */
	function getContainingBlock(el) {
	    var elPosition = dom.getStyle(el, POS), 
	        docEl = el.ownerDocument.documentElement,
	        parent = el.parentNode;
	    if(/^(?:r|s)/.test(elPosition) || !elPosition) return parent;
	    if(elPosition === "fixed") return null;
	    while(parent && parent != docEl) {
	        if(getContainingBlock(parent, POS) != "static") {
	            return parent;
	        }
	        parent = parent.parentNode;
	    }
	    return docEl;
	}
})();