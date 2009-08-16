APE.namespace("APE.dom");
(function(){
	var dom = APE.dom,
	    od = "ownerDocument",
	    doc = document,
	    docEl = doc.documentElement,
        OWNER_DOCUMENT = docEl && od in docEl ? od : "document",
    	textContent = "textContent",
    	view = doc.defaultView;
	
	dom.OWNER_DOCUMENT = OWNER_DOCUMENT;
    dom.IS_COMPUTED_STYLE = (typeof view != "undefined" && "getComputedStyle" in view);
	dom.textContent = textContent in docEl ? textContent : "innerText";
})();