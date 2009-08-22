/**
 * @fileoverview
 * @class StyleTransition
 * @namespace APE.anim
 *            <p>
 *            For morphing an objects styles across a css-time-continuum.
 *            </p>
 * @author Garrett Smith
 * 
 * @requires APE.anim.Animation
 * @requires APE.color
 * @requires APE.dom.style-f
 */

(function(){

    var APE = window.APE, 
        anim = APE.anim, 
        Animation = anim.Animation,
        ap = Animation.prototype,
        dom = APE.dom,
        useFilter,
        FVALUE = "fromValue",
        OPACITY = "opacity",
        TVALUE = "toValue",
        PX = "px",
        PROTO = "prototype",
        BLEND_TO = "blendTo",
        TO_STRING = "toString",
        EXTEND = "extend",
        STYLE = "style";
    
    /**
     * @param {String}
     *            id of the element
     * @param {Object}
     *            styleObject in the form of {color: "#030", fontSize : "12px"}
     * @param {ufloat}
     *            [duration] optional number of seconds.
     * @param {Function}
     *            [transition] optional funtion that takes a float [0-1] and returns
     *            a float [0-1]
     * @extends APE.anim.Animation
     * @constructor
     */
    anim.StyleTransition = StyleTransition;
    
    function StyleTransition(id, styleObject, duration, transition) {
        Animation.call(this, duration); // invoke super constructor.
        if (id.id)
            id = id.id;
        this.id = id;        
        if (transition) {
            this.transition = transition;
        }
        this.init(styleObject);
    }
    
    APE[EXTEND](StyleTransition, Animation, {
    
        _start : function() {
            // Use id as weak ref, set "style" in start and end.
            this[STYLE] = document.getElementById(this.id)[STYLE];
            ap._start.call(this);
        },

        _end : function() {
            this[STYLE] = null;
            ap._end.call(this);
        },
        
        /**
         * @method run
         * @memberOf APE.anim.StyleTransition
         * @description overrides (implements) <code>run()</code> in Animation.
         *              Runs the animation, getting the correct value from each
         *              ITransitionAdapter. This run() method gets called by
         *              Animation.
         */
        run : function(rationalValue) {
            var i = 0, adapters = this.adapters, len = adapters.length, 
                style = this[STYLE], adapter;
            while (i < len) {
                adapter = adapters[i++];
                style[adapter.prop] = adapter[BLEND_TO](rationalValue);
            }
        },
    
        /** @private */
        init : function(styleObject) {
            var el = document.getElementById(this.id), adapters = [], adapter, 
                prop, toValue, 
                style = el[STYLE],
                cssText = style.cssText,
                fromValues = {};
    
            if(useFilter === undefined) {
                useFilter = !(OPACITY in style) && ("filter" in style);
            }
            // Loop through style object to find values.
            for (prop in styleObject) {
                if (!styleObject[prop]) continue; // CSSStyleRule. 
                if (prop === OPACITY && useFilter && !el.currentStyle.hasLayout) {
                    style.zoom = "1";
                }
                fromValues[prop] = dom.getStyle(el, prop);
            }
            
            // Set end style.
            setEndStyle(el, styleObject);

            // Read end style, create adapter (from, to).
            for(prop in styleObject) {
                toValue = styleObject[prop];
                if(lengthExp.test(toValue)){
                    toValue = dom.getStyle(el, prop);
                }
                // Get a ITransitionAdapter from the factory.
                adapter = TransitionAdapterFactory.fromValues(prop, fromValues[prop], toValue);
                adapters.push(adapter);
            }
            
            // Set the styles back.
            style.cssText = cssText;
    
            // IE will not properly render visibility when
            // 1) visibility is initially hidden
            // 2) alpha filter is applied
            // 3) and visibility is then set to visible.
            // after that, the element doesn't appear visible.
            // Workaround: first transition is visibility.
            adapters.sort(function(a, b) {
                        return (a instanceof ImmediateThresholdTransitionAdapter
                                ? -1
                                : 1);
                    });
    
            this.adapters = adapters;
        },
    
        /**
         * @memberOf APE.anim.StyleTransition Helpful debugging info.
         */
        toString : function() {
            return "StyleTransitionAdapter : id=#" + this.id + "\n"
                    + ap[TO_STRING].call(this)
                    + "\nAdapters:\n  " + this.adapters.join("\n  ");
        }
    });

    function setEndStyle(el, styleObject) {
        var prop, toValue, style = el[STYLE];
        for(prop in styleObject) {
            toValue = styleObject[prop];
            if(prop === OPACITY){
                dom.setOpacity(el, toValue);
            } else {
                style[prop] = toValue;
            }
        }
        // Override visibility and display so we can 
        // calculate real values.
        style.visibility = "visible";
        style.display = "block";                
    }

    var // "1px", "1.1px", "-.1px" => ["-.1px", "-.1", "px"]
        lengthExp = /(^-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)/i,
        colorExp = /color/i,
        positiveLengthExp = /(?:width|height|padding|fontSize)$/ig,
        filterExp = /alpha/,
        intExp = /^\d+$/,
        noVisibilityExp = /^(?:hidden|collapse)/;


    /**
     * Factory for APE.anim.TransitionAdapterFactory Interface.
     * 
     * @return {ITransitionAdapter} ITransitionAdapter for a specific type of style
     *         setting during run. The {ITransitionAdapter} implements
     *         blendTo(rationaValue).
     * @class
     * @private Used internally.
     */
    var TransitionAdapterFactory = {
    
        fromValues : function(prop, fromValue, toValue) {
    
            var adapter;
            if (positiveLengthExp.test(prop)) {
                adapter = PositiveLengthTransitionAdapter;
            } else if (colorExp.test(prop)) {
                adapter = ColorTransitionAdapter;
            } else if (lengthExp.test(fromValue)) {
                adapter = LengthTransitionAdapter;
            } else if (prop === OPACITY) {
                adapter = useFilter ? FilterTransitionAdapter : OpacityTransitionAdapter;
            } else if (prop == "fontWeight" && intExp.test(fromValue) 
                    && intExp.test(toValue)) {
                adapter = FontWeightTransitionAdapter;
            } else if (prop === "visibility" && noVisibilityExp.test(fromValue) 
                    || prop == "display" && fromValue == "none") {
                adapter = ImmediateThresholdTransitionAdapter;
            } else {
            // Return an object that sets toValue on completion.
            adapter = ThresholdTransitionAdapter;
            } 
            return new adapter(prop, fromValue, toValue);
        }
    };

    var ColorRGB = APE.color && APE.color.ColorRGB;

    function TransitionAdapter(prop, fromValue, toValue) {
        this.prop = prop;
        this[FVALUE] = fromValue;
        this[TVALUE] = toValue;
    }
    
    TransitionAdapter[PROTO][TO_STRING] = function() {
        return "Transition: " + this.prop + ", "
                + this[FVALUE][TO_STRING]() + " \u2014 "
                + this[TVALUE][TO_STRING]();
    };

    function ColorTransitionAdapter(prop, fromValue, toValue) {
        if (!ColorRGB) { // If script was included in wrong order.
            ColorRGB = APE.color.ColorRGB;
        }
        var f = ColorRGB.fromString(fromValue), 
            t = toValue = ColorRGB.fromString(toValue);

        TransitionAdapter.call(this, prop, f, t);

        // This is where we mix fromValue and toValue,
        // to avoid the creation of new ColorRGB for each frame.
        this.currentValue = new ColorRGB();
    }

    APE[EXTEND](ColorTransitionAdapter, TransitionAdapter);
    /**
     * Adapter/Strategy interface.
     * 
     * @return {String} rgb string of the blended values.
     */
    ColorTransitionAdapter[PROTO][BLEND_TO] = function(rationalValue) {
        var c = ColorRGB.blend(this[FVALUE], this[TVALUE],
                rationalValue, this.currentValue);
        return c[TO_STRING]();
    }

    function LengthTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, parseFloat(fromValue),
                parseFloat(toValue));
    }

    APE[EXTEND](LengthTransitionAdapter, TransitionAdapter);

    LengthTransitionAdapter[PROTO][BLEND_TO] = function(rationalValue) {
        var inverse = 1 - rationalValue;
        return ((this[FVALUE] * inverse) + (this[TVALUE] * rationalValue)) + PX;
    };

    function PositiveLengthTransitionAdapter() {
        LengthTransitionAdapter.apply(this, arguments);
    }

    /**
     * @ignore extends LengthTransitionAdapter
     */
    APE[EXTEND](PositiveLengthTransitionAdapter, LengthTransitionAdapter);

    PositiveLengthTransitionAdapter[PROTO][BLEND_TO] = function(rationalValue) {
        var inverse = 1 - rationalValue, 
            v = Math.max((this[FVALUE] * inverse) + (this[TVALUE] * rationalValue), 0) + PX;
        return v;
    };

    /** @ignore */
    function OpacityTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, parseFloat(fromValue),
                parseFloat(toValue));
    }

    APE[EXTEND](OpacityTransitionAdapter, TransitionAdapter);
    OpacityTransitionAdapter[PROTO][BLEND_TO] = function(rationalValue) {
        var inverse = 1 - rationalValue, v = Math.max(
                (this[FVALUE] * inverse) + (this[TVALUE] * rationalValue), 0);
        return v;
    };

    /** @ignore */
    function FilterTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, "filter", fromValue, toValue);
    }

    /**
     * @ignore constructor FilterTransitionAdapter performs adapter service
     *         using IE filters crap.
     */
    APE[EXTEND](FilterTransitionAdapter, TransitionAdapter);
    FilterTransitionAdapter[PROTO][BLEND_TO] = function(rationalValue) {
        var inverse = 1 - rationalValue, v = Math.abs(
                (this[FVALUE] * inverse) + (this[TVALUE] * rationalValue), 0);
        return "alpha(opacity=" + Math.abs(v * 100) + ")";
    };
    /** Useful for z-index, font-weight */
    function FontWeightTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, parseInt(fromValue),
                parseInt(toValue));
    }

    APE[EXTEND](FontWeightTransitionAdapter, TransitionAdapter);
    FontWeightTransitionAdapter[PROTO][BLEND_TO] = function(rationalValue) {
        var inverse = 1 - rationalValue, v = (((this[FVALUE] * inverse) + (this[TVALUE] * rationalValue))
                / 100 << 0)
                * 100;
        if (v < 100)
            return 100;
        if (v > 900)
            return 900;
        return v;
    };

    /**
     * @ignore constructor ThresholdTransitionAdapter This is sort of a Null
     *         Object. It does implement blendTo, setting the toValue at the
     *         very end.
     */
    function ThresholdTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, fromValue, toValue);
    }

    APE[EXTEND](ThresholdTransitionAdapter, TransitionAdapter);
    ThresholdTransitionAdapter[PROTO][BLEND_TO] = function(rationalValue) {
        if (rationalValue === 1)
            return this[TVALUE];
        return this[FVALUE];
    };

    function ImmediateThresholdTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, fromValue, toValue);
    }

    APE[EXTEND](ImmediateThresholdTransitionAdapter, TransitionAdapter);
    ImmediateThresholdTransitionAdapter[PROTO][BLEND_TO] = function(rationalValue) {
        if (rationalValue === 0) {
            return this[FVALUE];
        }
       return this[TVALUE];
    };
})();