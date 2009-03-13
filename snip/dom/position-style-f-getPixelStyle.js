function _getComputedStyle(el, p) {
    var value = "", gcs = window.getComputedStyle;
    if(typeof gcs == "function") {
        var cs = gcs(el, "");
        value = cs[p];
    }
    else if(el.currentStyle) {
        value = el.currentStyle[p];
        var matches = nonPixelExp.exec(value);
        if(matches) {
            value = convertNonPixelToPixel( el, matches );
        }
    }
    return value;
}

var pixelPropExp = /^(height|width|top|left)$/;

var pxExp = /\dpx$/,  
    nonPixelExp = /(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm|%\s*)/,
    unitExp = /(-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)\s*/;

/**
 * @requires nonPixelExp
 * @param {HTMLElement} el
 * @param {Array} String[] of matches from nonPixelExp.
 */
function convertNonPixelToPixel(el, matches) {
    if(el.runtimeStyle) {

        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels.

        var val = matches[0]; // grab the -1.2em or whatever.
        if(parseFloat(val) == 0) return "0px";
        
        var s = el.style,
            sLeft = s.left,
            rs = el.runtimeStyle,
            rsLeft = rs.left;

        rs.left = el.currentStyle.left;
        s.left = val || 0;

        // The element does not need to have position: to get values.
        // IE's math is a little off with converting em to px; IE rounds to 
        // the nearest pixel.
        val = (s.pixelLeft) + "px";

        // put it back.
        s.left = sLeft;
        rs.left = rsLeft;
    }
    return val;
}