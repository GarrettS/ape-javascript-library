/**
 * @requires APE.dom.style-f.js
 */
APE.dom.getPixelCoords = function (el){
    var ret, dom = APE.dom,
        parseInt = self.parseInt,
        f = (dom.IS_COMPUTED_STYLE_SUPPORTED ? function(el) {
        var cs = el[dom.OWNER_DOCUMENT].defaultView.getComputedStyle(el, "");
        return{
            x : parseInt(cs.left, 10)||0,
            y : parseInt(cs.top, 10)||0
        };
    } : function(el){
        var style = el.style;
        return{
            // pixelLeft, in IE returns 0 when the element does not have 
            // left: in the style attribute, so if that fails, try to read 
            // the style using dom.getStyle.
            x : style.pixelLeft || parseInt(dom.getStyle(el,"left"), 10)||0,
            y : style.pixelTop || parseInt(dom.getStyle(el,"top"), 10)||0
        };
    });
    ret = (dom.getPixelCoords = f)(el);
    el = null;
    return ret;
};