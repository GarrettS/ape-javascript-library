APE.namespace("APE.dom");
(function(){
	var dom = APE.dom,
	    od = "ownerDocument",
	    doc = document,
	    docEl = doc.documentElement,
	    // typeof, not in for BlackBerry9000.
        OWNER_DOCUMENT = docEl && typeof docEl[od] !== "undefined" ? od : "document",
    	view = doc.defaultView;
	
	dom.OWNER_DOCUMENT = OWNER_DOCUMENT;
    dom.IS_COMPUTED_STYLE = (typeof view != "undefined" && "getComputedStyle" in view);
})();