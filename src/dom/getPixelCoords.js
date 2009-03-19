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
        var f = (dom.IS_COMPUTED_STYLE ? function(el) {
            var cs = el.ownerDocument.defaultView.getComputedStyle(el, "");
            return {
                x : parseInt(cs.left)||0,
                y : parseInt(cs.top)||0
            };
        } : function(el){
            var style = el.style;
            return {
                // pixelLeft will return 0 when the element does not have 
                // left: in the style attribute.
                x : style.pixelLeft || parseInt(dom.getStyle(el,"left"))||0,
                y : style.pixelTop || parseInt(dom.getStyle(el,"top"))||0
            };
        });
        this.getPixelCoords = f;
        return f(el);
    }
})();