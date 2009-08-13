APE.namespace("APE.dom");
/**
 * @requires APE.dom.style-f.js
 */
(function(){
	var dom = APE.dom;
/** @function 
 * @return {Object} {x: Number, y:Number} */
    dom.getPixelCoords = getPixelCoords;
	function getPixelCoords(el){
        var ret,
            f = (dom.IS_COMPUTED_STYLE ? function(el) {
            var cs = el.ownerDocument.defaultView.getComputedStyle(el, "");
            return {
                x : parseInt(cs.left, 10)||0,
                y : parseInt(cs.top, 10)||0
            };
        } : function(el){
            var style = el.style;
            return {
                // pixelLeft, in IE returns 0 when the element does not have 
                // left: in the style attribute, so if that fails, 
                // try to read the style.
                x : style.pixelLeft || parseInt(dom.getStyle(el,"left"), 10)||0,
                y : style.pixelTop || parseInt(dom.getStyle(el,"top"), 10)||0
            };
        });
        ret = (this.getPixelCoords = f)(el);
        el = null;
        return ret;

    }
})();