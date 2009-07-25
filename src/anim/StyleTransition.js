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
APE.anim.StyleTransition = function(id, styleObject, duration, transition) {
    APE.anim.Animation.call(this, duration); // invoke super constructor.
    if (id.id)
        id = id.id;
    this.id = id;
    this.adapters = [];
    this.style = document.getElementById(id).style;
    if (transition)
        this.transition = transition;
    this.init(styleObject);
};

APE.extend(APE.anim.StyleTransition, APE.anim.Animation, {

    inited : false,
    /**
     * @method run
     * @memberOf APE.anim.StyleTransition
     * @description overrides (implements) <code>run()</code> in Animation.
     *              Runs the animation, getting the correct value from each
     *              ITransitionAdapter. This run() method gets called by
     *              Animation.
     */
    run : function run(rationalValue) {
        var i = 0, adapters = this.adapters, len = adapters.length, adapter;
        while (i < len) {
            adapter = adapters[i++];
            this.style[adapter.prop] = adapter.blendTo(rationalValue);
        }
    },

    /** @private */
    init : function(styleObject) {
        if (this.inited)
            return;

        var el = document.getElementById(this.id), adapters = [], adapter, APE = window.APE, 
        prop, units, fromValue, toValue, dom = APE.dom, 
        TransitionAdapterFactory = APE.anim.TransitionAdapterFactory, 
        ThresholdTransitionAdapter = TransitionAdapterFactory.ThresholdTransitionAdapter, 
        ImmediateThresholdTransitionAdapter = TransitionAdapterFactory.ImmediateThresholdTransitionAdapter;

        // Loop through style object to find values.
        for (prop in styleObject) {
            toValue = styleObject[prop];
            if (!toValue)
                continue; // CSSStyleRule.

            if (prop == "opacity" && !("opacity" in this.style)
                    && ("filter" in this.style)) {
                prop = "alpha";
                this.style.zoom = "1";
                fromValue = dom.getFilterOpacity(el);
            } else {
                units = dom.getStyleUnit(toValue);
                fromValue = dom.findInheritedStyle(el, prop, units);
            }
            // Get a ITransitionAdapter from the factory.
            adapter = TransitionAdapterFactory.fromValues(prop, fromValue,
                    toValue);
            adapters.push(adapter);
        }

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
                + APE.anim.Animation.prototype.toString.call(this)
                + "\nAdapters:\n  " + this.adapters.join("\n  ");
    }

});

/**
 * Factory for APE.anim.TransitionAdapterFactory Interface.
 * 
 * @return {ITransitionAdapter} ITransitionAdapter for a specific type of style
 *         setting during run. The {ITransitionAdapter} implements
 *         blendTo(rationaValue).
 * @class
 * @private Used internally.
 */
APE.anim.TransitionAdapterFactory = {
    // "1px", "1.1px", "-.1px" => ["-.1px", "-.1", "px"]
    lengthExp : /(^-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)/i,
    colorExp : /color/i,
    positiveLengthExp : /(?:width|height|padding|fontSize)$/ig,
    filterExp : /alpha/,
    opacityExp : /^opacity/,
    intExp : /^\d+$/,
    noVisibilityExp : /^(?:hidden|collapse)/,

    fromValues : function(prop, fromValue, toValue) {

        if (this.positiveLengthExp.test(prop)) {
            return new this.PositiveLengthTransitionAdapter(prop, fromValue,
                    toValue);
        }
        if (this.colorExp.test(prop))
            return new this.ColorTransitionAdapter(prop, fromValue, toValue);
        if (this.lengthExp.test(fromValue)) {
            return new this.LengthTransitionAdapter(prop, fromValue, toValue);
        }
        if (this.filterExp.test(prop))
            return new this.FilterTransitionAdapter(prop, fromValue, toValue);
        if (this.opacityExp.test(prop))
            return new this.OpacityTransitionAdapter(prop, fromValue, toValue);
        if (prop == "fontWeight" && this.intExp.test(fromValue)
                && this.intExp.test(toValue)) {
            return new this.FontWeightTransitionAdapter(prop, fromValue,
                    toValue);
        }
        if (prop == "visibility" && this.noVisibilityExp.test(fromValue)
                || prop == "display" && fromValue == "none")
            return new this.ImmediateThresholdTransitionAdapter(prop,
                    fromValue, toValue);
        // Return an object that sets toValue on completion.
        return new this.ThresholdTransitionAdapter(prop, fromValue, toValue);
    }
};

(function() {

    var APE = window.APE, ColorRGB = APE.color && APE.color.ColorRGB,

    Adapters = {
        /** @augments APE.anim.TransitionAdapterFactory */
        PositiveLengthTransitionAdapter : PositiveLengthTransitionAdapter,
        ColorTransitionAdapter : ColorTransitionAdapter,
        LengthTransitionAdapter : LengthTransitionAdapter,
        FilterTransitionAdapter : FilterTransitionAdapter,
        OpacityTransitionAdapter : OpacityTransitionAdapter,
        FontWeightTransitionAdapter : FontWeightTransitionAdapter,
        ThresholdTransitionAdapter : ThresholdTransitionAdapter,
        ImmediateThresholdTransitionAdapter : ImmediateThresholdTransitionAdapter
    };

    APE.mixin(APE.anim.TransitionAdapterFactory, Adapters);

    function TransitionAdapter(prop, fromValue, toValue, units) {
        this.prop = prop;
        this.fromValue = fromValue;
        this.toValue = toValue;
        if (units)
            this.units = units;
    }
    TransitionAdapter.prototype.toString = function() {
        var units = (this.units || '');
        return APE.getFunctionName(this.constructor) + ": " + this.prop + ", "
                + this.fromValue.toString() + units + " \u2014 "
                + this.toValue.toString() + units;
    };

    function ColorTransitionAdapter(prop, fromValue, toValue) {
        if (!ColorRGB)
            ColorRGB = APE.color.ColorRGB;
        var f = ColorRGB.fromString(fromValue), t = toValue = ColorRGB
                .fromString(toValue);

        TransitionAdapter.call(this, prop, f, t);

        // This is where we mix fromValue and toValue,
        // to avoid the creation of new ColorRGB for each frame.
        this.currentValue = new ColorRGB();
    }

    APE.extend(ColorTransitionAdapter, TransitionAdapter, {

                /**
                 * Adapter/Strategy interface.
                 * 
                 * @return {String} rgb string of the blended values.
                 */
                blendTo : function(rationalValue) {
                    var c = ColorRGB.blend(this.fromValue, this.toValue,
                            rationalValue, this.currentValue);
                    return c.toString();
                }
            });

    function LengthTransitionAdapter(prop, fromValue, toValue) {
        var lengthExp = APE.anim.TransitionAdapterFactory.lengthExp, fromValues = lengthExp
                .exec(fromValue), toValues = lengthExp.exec(toValue);

        TransitionAdapter.call(this, prop, parseFloat(fromValues[0]),
                parseFloat(toValues[0]), fromValues[2]);
    }

    APE.extend(LengthTransitionAdapter, TransitionAdapter);

    LengthTransitionAdapter.prototype.blendTo = function(rationalValue) {
        var inverse = 1 - rationalValue;
        return ((this.fromValue * inverse) + (this.toValue * rationalValue))
                + this.units;
    };

    function PositiveLengthTransitionAdapter() {
        LengthTransitionAdapter.apply(this, arguments);
    }

    /**
     * @ignore extends LengthTransitionAdapter
     */
    APE.extend(PositiveLengthTransitionAdapter, LengthTransitionAdapter);

    PositiveLengthTransitionAdapter.prototype.blendTo = function(rationalValue) {
        var inverse = 1 - rationalValue, v = Math.max(
                (this.fromValue * inverse) + (this.toValue * rationalValue), 0)
                + this.units;
        return v;
    };

    var zeroToPxExp = /0(\s|\))/g;

    /** @ignore */
    function OpacityTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, parseFloat(fromValue),
                parseFloat(toValue));
    }

    APE.extend(OpacityTransitionAdapter, TransitionAdapter);
    OpacityTransitionAdapter.prototype.blendTo = function(rationalValue) {
        var inverse = 1 - rationalValue, v = Math.max(
                (this.fromValue * inverse) + (this.toValue * rationalValue), 0);
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
    APE.extend(FilterTransitionAdapter, TransitionAdapter);
    FilterTransitionAdapter.prototype.blendTo = function(rationalValue) {
        var inverse = 1 - rationalValue, v = Math.abs(
                (this.fromValue * inverse) + (this.toValue * rationalValue), 0);
        return "alpha(opacity=" + Math.abs(v * 100) + ")";
    };

    /** Useful for z-index, font-weight */
    function FontWeightTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, parseInt(fromValue),
                parseInt(toValue));
    }

    APE.extend(FontWeightTransitionAdapter, TransitionAdapter);
    FontWeightTransitionAdapter.prototype.blendTo = function(rationalValue) {
        var inverse = 1 - rationalValue, v = (((this.fromValue * inverse) + (this.toValue * rationalValue))
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

    APE.extend(ThresholdTransitionAdapter, TransitionAdapter);
    ThresholdTransitionAdapter.prototype.blendTo = function(rationalValue) {
        if (rationalValue == 1)
            return this.toValue;
        return this.fromValue;
    };

    function ImmediateThresholdTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, fromValue, toValue);
    }

    APE.extend(ImmediateThresholdTransitionAdapter, TransitionAdapter);
    ImmediateThresholdTransitionAdapter.prototype.blendTo = function(
            rationalValue) {
        if (rationalValue == 0) {
            return this.fromValue;
        }
        return this.toValue;
    };
})();