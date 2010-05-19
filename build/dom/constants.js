APE.namespace("APE.dom").mixin(function(){
	var od = "ownerDocument",
	    doc = document,
	    docEl = doc.documentElement,
    	view = doc.defaultView;
    return{
        TEXT_CONTENT : typeof docEl.textContent === "string" ? "textContent" : "innerText",
        IS_BODY_ACTING_ROOT : docEl.clientWidth === 0,
        // typeof, not in for BlackBerry9000.
    	OWNER_DOCUMENT : docEl && typeof docEl[od] !== "undefined" ? od : "document",
        IS_CURRENT_STYLE_SUPPORTED : typeof docEl.currentStyle != "undefined",
        
        IS_COMPUTED_STYLE_SUPPORTED : view && view.getComputedStyle != "undefined",

        // TODO: remove deprecated.
        IS_COMPUTED_STYLE : view && view.getComputedStyle != "undefined",

        // IE, Safari, and Opera support clientTop. FF 2 doesn't
        IS_CLIENT_TOP_SUPPORTED : typeof docEl.clientTop != "undefined"
    };
}());