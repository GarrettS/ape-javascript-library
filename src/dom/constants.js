APE.namespace("APE.dom").mixin(function(){
	var od = "ownerDocument",
	    doc = document,
	    docEl = doc.documentElement,
    	view = doc.defaultView;
    return{
        TEXT_CONTENT : typeof docEl.textContent === "string" ? "textContent" : "innerText",
        // typeof, not in for BlackBerry9000.
    	OWNER_DOCUMENT : docEl && typeof docEl[od] !== "undefined" ? od : "document",
        IS_COMPUTED_STYLE : (typeof view != "undefined" && "getComputedStyle" in view)
    };
}());