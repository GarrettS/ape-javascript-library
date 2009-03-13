/**
 * @fileoverview
 * ColorRGB, ColorHSV
 *
 * For color conversion and parsing of color strings to colors. 
 *
 * @author Garrett Smith
 */
APE.namespace("APE.color");

/** ColorRGB
 * @constructor
 * @param {uint} r 0-255
 * @param {uint} g 0-255
 * @param {uint} b 0-255
 */
APE.color.ColorRGB = function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
};

/** Returns a ColorRGB based on a number.
 * @param {uint} number from 0 - 0xFFFFFF
 * @static
 */
APE.color.ColorRGB.fromNumber = function(n) {
    return new APE.color.ColorRGB((0xFF0000 & n) >> 16, (0xFF00 & n) >> 8, 0xFF & n);
};

/** @return {ColorRGB} based on a hex string: 
 * #FFFFFF or #FFF
 * @static
 */
APE.color.ColorRGB.fromHexString = function(hex) {
    if(!this.hexPattern.test(hex)) 
        throw Error("ColorRGB.fromHexString(hex) invalid input: " + hex);
    var n = parseInt(hex.substring(1), 16),
        r, g, b,
        ColorRGB = APE.color.ColorRGB;

    if(hex.length == 4) {
        r =  n & 0xF00, g = n & 0x0F0, b = n & 0x00F;
        return new ColorRGB( 
             (r >> 4) + (r >> 8), 
              g +       (g >> 4), 
             (b << 4) + b
        );
    }
    return ColorRGB.fromNumber(n);
};

/** 
 * @type {RegExp} matches 3 or 6 digit color hex 
 * @static
 */
APE.color.ColorRGB.hexPattern = /(?:#)[0-9a-f]{3,6}/i;
/** 
 * @type {RegExp} matches an rgb(i, i, i) String with optional percent signs. 
 * @static
 */
APE.color.ColorRGB.rgbPattern = /rgb\(([\d]{1,3})\,\s?([\d]{1,3})\,\s?([\d]{1,3})\)/;

/**
 * @static
 * @return {ColorRGB} color based on the input. 
 * If the input is invalid, it creates an invalid Color. 
 * use isValid to verify.
 */
APE.color.ColorRGB.fromString = function(inp) {
    var ColorRGB = APE.color.ColorRGB;
    return (ColorRGB.hexPattern.test(inp) ? ColorRGB.fromHexString(inp) : ColorRGB.fromRgbString(inp));
};

/** 
 * @param {String} rgbString 
 * @return {ColorRGB} object representing rgbString is returned (possibly invalid);
 * @static
 */ 
APE.color.ColorRGB.fromRgbString = function(rgbString) {

    var ColorRGB = APE.color.ColorRGB,
        rgb = rgbString.match(ColorRGB.rgbPattern);  
    if(rgb != null) {        
        return new ColorRGB(rgb[1], rgb[2], rgb[3]);
    }
    return new ColorRGB();
};

/** Takes a midpoint color between two colors. Useful for animation. 
 * @param {ColorRGB} startColor the color to transition from.
 * @param {ColorRGB} endColor the color to transition to.
 * @param {ufloat} rationalValue ratio [0..1] of endColor:startColor color for result.
 * @param {ColorRGB} [mixedColor] - a color can be passed in for reuse (this is useful for
 * animation, to avoid creation of many objects).
 *
 * @return APE.color.ColorRGB new color that is a blend of
 *
 * rationalValue/1 new color and 1-rationalValue startColor. 
 */
APE.color.ColorRGB.blend = function(startColor, endColor, rationalValue, mixedColor) {
    var inverse = (rationalValue > 1 ? 0 :  1 - rationalValue),

        r = startColor.r * inverse + endColor.r * rationalValue,
        g = startColor.g * inverse + endColor.g * rationalValue,
        b = startColor.b * inverse + endColor.b * rationalValue;

    // Math.abs.floor: (x ^ (x >> 31)) - (x >> 31);
    // converts result to int (floor). 
    r = (r ^ (r >> 31)) - (r >> 31);
    g = (g ^ (g >> 31)) - (g >> 31);
    b = (b ^ (b >> 31)) - (b >> 31);

    if(mixedColor && 'r'in mixedColor) {
        mixedColor.r = r;
        mixedColor.g = g;
        mixedColor.b = b;
        return mixedColor;
    }
    return new this(r, g, b);
};

APE.color.ColorRGB.prototype = {

    r : 0xff, g : 0xff,  b : 0xff,
    
    /** 
      * @return {ColorHSV} color object.
      */
    toHSV : function() {
        
        var max = Math.max(this.r, this.g, this.b),
            min = Math.min(this.r, this.g, this.b),
        
            s = 0,
            h = 0;
        
        if(max > min) {
            switch(max) {
                case this.r :
                    h = (this.g - this.b) / (max-min);
                    break;
                case this.g :
                    h = 2 + ((this.b - this.r) / (max-min));
                    break;
                case this.b :
                    h = 4 + ((this.r - this.g) / (max-min));
                    break;
            }
            s = (max - min) / max;
        }
        h *= 60;
        if(h < 0) 
            h += 360;
        
        return new APE.color.ColorHSV(h, s, max/255);
    },
    
    /** @return {String} helpful debugging info. */
    toString : function() {
        return "rgb(" + this.r
                + ", " + this.g 
                + ", " + this.b + ")";
    },
    
/** 
 * @return {String} six digit hex string like #336699
 */ 
    toHexString : function() {
        return "#" + toHexByte(this.r) + toHexByte(this.g) + toHexByte(this.b);
        
        function toHexByte(bite) {
            var hex = bite.toString(16);
            return (hex.length == 2 ? hex : "0" + hex);
        }
    },
    
/** 
 * @return {boolean} true if this r,g,b equal other's r,g,b.
 */ 
    equals : function(c) {
        return (this.r == c.r) && (this.b == c.b) && (this.g == c.g);
    },
    
    /** @return {boolean} if r,g,b are all numbers 0-255. 
     * invalid colors can be used for initialization and caching.
     */
    isValid : function() {
        return validComponent(this.r) && validComponent(this.g) && validComponent(this.b);
        function validComponent(c) {
            return isFinite(c) && c >= 0 && c <= 255;
        }
    },

/** 
 * @return {Number} numerical representation of the Color; like hex value, but in decimal.
 */ 
    valueOf : function() {
        return (this.r << 16) + (this.g << 8) + this.b;
    }
};

/** 
 * @constructor
 * @param {uint} h hue: 0-360
 * @param {uint} s hue: 0-1
 * @param {uint} v hue: 0-1
 */
APE.color.ColorHSV = function(h, s, v) {
    this.h = h;
    this.s = s;
    this.v = v;
};

/** 
 * @return {ColorRGB} a fully saturated, bright-as-possible color for the hue;
 * @static
 */
APE.color.ColorHSV.rgbForHue = function(hue) {
    if(hue === 360) hue = 0;
    return new APE.color.ColorHSV(hue, 1, 1).toRGB();
};

APE.color.ColorHSV.prototype = {
    
    h : 360, s: 1.0, v : 1.0,
    
/** 
 * @return {ColorRGB} Converts to other colorspace. 
 * this.toRGB().toHSV() should return an equivalent color
 */ 
    toRGB : function() {
        var H = this.h/360, 
            S = this.s, 
            V = this.v;
        
        var R, G, B;
        
        if ( S == 0 ) {    //HSV values = From 0 to 1
            R = G = B = V;
        }
        else {
            H *= 6;

            // Math.floor: Right shift by 0, faster than Math.floor.
            var i = H >> 0,
                var1 = V * ( 1 - S ),
                var2 = V * ( 1 - S * ( H - i ) ),
                var3 = V * ( 1 - S * ( 1 - ( H - i ) ) );
        
            switch(i) {
                case 0 : 
                    R = V; G = var3 ; B = var1;
                    break;
                case 1 :
                    R = var2; G = V; B = var1;
                    break;
                case 2 :
                    R = var1 ; G = V; B = var3;
                    break;
                case 3 :
                    R = var1 ; G = var2 ; B = V;
                    break;
                case 4 :
                    R = var3 ; G = var1 ; B = V;
                    break;
                default : 
                    R = V; G = var1 ; B = var2;
            }
        }
        return new APE.color.ColorRGB( R*255 >> 0, G*255 >> 0, B*255 >> 0);
    },
    
    /** @return {String} helpful debugging info. */
    toString : function() {
        return "[ " + this.h.toFixed(0)
                + ", " + this.s.toFixed(2) 
                + ", " + this.v.toFixed(2) + " ]";
    }
};