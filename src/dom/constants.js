// Cross-frame feature test function that returns an object, 
// constants for currently executing document added to APE.dom.
APE.namespace("APE.dom").getConstants = function(doc) {
    doc = doc || document;
    var od = "ownerDocument",
        docEl = doc.documentElement,
        UNDEFINED = "undefined",
        view = doc.defaultView,
        compatMode = doc.compatMode,
        testStyle,
        testNode = doc.createElement("div"),
        IS_STANDARDS_MODE = compatMode ? compatMode != "BackCompat" :
            ((testStyle = testNode.style).width = "1", !testStyle.width);
        
    return{
        TEXT_CONTENT : typeof docEl.textContent === "string" ? "textContent" : "innerText",
        IS_BODY_ACTING_ROOT : docEl.clientWidth === 0,
        // typeof, not in for BlackBerry9000.
        OWNER_DOCUMENT : docEl && typeof docEl[od] !== UNDEFINED ? od : "document",
        IS_CURRENT_STYLE_SUPPORTED : typeof docEl.currentStyle != UNDEFINED,
        
        IS_COMPUTED_STYLE_SUPPORTED : !!view && view.getComputedStyle != UNDEFINED,

        // TODO: remove deprecated.
        IS_COMPUTED_STYLE : view && view.getComputedStyle != UNDEFINED,

        // IE, Safari, and Opera support clientTop. FF 2 doesn't
        IS_CLIENT_TOP_SUPPORTED : typeof docEl.clientTop != UNDEFINED,
        
        // XML dom is not supported.
        IS_XML_DOM : docEl.tagName === "html",
        IS_QUIRKS_MODE : !IS_STANDARDS_MODE,
        IS_SCROLL_SUPPORTED : typeof testNode.scrollLeft == "number"
    };
};
APE.dom.mixin(APE.dom.getConstants(document));