APE.namespace("APE.dom");
(function(){
    var dom = APE.dom;
    dom.setIeTopLeft = setIeTopLeft;

    // For some browsers (IE and Safari), the currentStyle/computedStyle 
    // for top/left will be "auto" when bottom and right values are set.
    function setIeTopLeft(el) { 
        // For IE, set top/left values when declared values are auto
        // and right/bottom values are given.
        var s = el.style, cs, emptyAutoExp = /^(?:auto)?$/;;
        
        if(dom.IS_COMPUTED_STYLE_SUPPORTED) {
            cs = el.ownerDocument.defaultView.getComputedStyle(el,"");
        } else {
            cs = el.currentStyle || s;
        }
        
        var curL = cs.left, 
            curR = cs.right, 
            curT = cs.top,
            curB = cs.bottom,
            cb = dom.getContainingBlock(el);        
        // Calculate left when right is given pixel value and left is "auto".
        if(emptyAutoExp.test(curL)) {
            curR = parseInt(curR, 10);
            if(isFinite(curR))
                s.left = cb.clientWidth - el.offsetWidth - curR + "px";
            else s.left = "0";
        }
        
        // Calculate top when bottom is given pixel value and top is "auto".
        if(emptyAutoExp.test(curT)) {
            curB = parseInt(curB, 10);
            if(isFinite(curB)) {
                s.top = cb.clientHeight - el.offsetHeight - curB + "px";
            }
            else s.top = "0";
        }
    }        
})();