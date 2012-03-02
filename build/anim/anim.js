/**  @fileoverview anim package: Animation, Transitions, and Manager (private)
 * 
 * <p>
 *   Sigmoid functions based upon work by Emmanuel Pietriga. wobble and
 *   spring come from, or are loosely based on Scriptaculous.
 * </p>
 * <p>
 *   Animation is a Template that passes a position to its
 *   <code>run( pos )</code> method. (you implement run).
 * </p>
 * <p>
 *   <code>anim.Transitions</code> contains effects for speed/timing,
 *   such as acceleration and easing.
 * </p>
 * @example
 * 
 * <pre>
 * b = new APE.anim.Animation(&quot;blah&quot;);
 * b.run = function(position) { // &lt;-- you implement run.
 * 
 * };
 * b.start(); // &lt;-- then call start.
 * </pre>
 */

APE.namespace("APE.anim");

(function() {
    APE.anim.Animation = Animation;
    
    var RVALUE = "rationalValue";

    /**
     * @param {ufloat} [duration] Number of seconds 
     * to run the animation (default is 1).
     */
    function Animation(duration) {
        if (typeof duration == "number")
            this.duration = duration * 1000; // default 1 sec.
        this.timeLimit = this.duration; // for SeekTo()
    }
    
    function noop(p) { return p; }

    Animation.prototype = {

        paused : false,

        /**
         * @type {Number} duration of how long the animation will run
         *       (milliseconds).
         */
        duration : 1000,

        /**
         * @type {Number} duration of how long the animation will run.
         * @internal Used internally for seekTo().
         */
        timeLimit : 1000,

        isReversed : false,

        startOffset : 0,
        endOffset : 1,

        startValue : 0,
        endValue : 1,

        rationalValue : 0,

        /**
         * @type function
         * @return {Number} position value, typically betweeen [0-1].
         *         @example
         * 
         * <pre>
         * var a = new APE.anim.Animation();
         * a.transition = APE.anim.Transitions.loop;
         * </pre>
         */
        transition : noop,

        position : 0,

        /**
         * @event
         * @description fires when the Animation starts, when seekTo is called.
         */
        onstart : noop,

        /**
         * @event
         * @description fires when stop() is called or the Animation
         *              successfully completes.
         */
        onend : noop,

        /** @event {Function} onplay fires right before run() is called */

        /**
         * @event
         * @description If an error occurred, onabort throws the error. this can
         *              be overridden (shadowed) by adding an onabort() to the
         *              Animation instance.
         * 
         * @example
         * 
         * <pre>
         * APE.EventRegistry.add(myAnim, &quot;onabort&quot;, myErrorHandler);
         * function myErrorHandler(ex) {
         *     alert(ex.message);
         * }
         * </pre>
         * 
         * @param {Error}
         *            ex the error that occured.
         * @throws {Error}
         *             throws ex in a setTimeout.
         */
        onabort : function(ex) {
            throw ex;
        },

        /**
         * Run must be implemented by user.
         * 
         * @param position
         *            {Number} 0-1
         * 
         * Implementation generally looks something like:
         * 
         * <pre>
         * anim.run = function(position) {
         *     document.body.style.borderWidth = (12 * position) + &quot;px&quot;
         * };
         * </pre>
         */
        run : noop,

        /**
         * Call this method to start the anim.
         */
        start : function() {
            if (this.paused)
                return;
            this.timeLimit = this.duration;
            this.endOffset = this.transition(this.endValue);
            this._start();
        },

        startAfter : function(delay){
            var anim = this;
            function startAfter(){
                anim.start();
                // Handle subsequent calls to startAfter.
                clearTimeout(this.startAfterTimer);
                delete anim.startAfterTimer;
            }
            anim.startAfterTimer = setTimeout(startAfter, delay);
        },
        
        /**
         * timeLimit is not calculated here. unregisters Animation, calls
         * onstart(), registers Animation.
         * 
         * @fires onstart
         */
        _start : function() {
            // Unregister the animation before setting startTime.
            Manager.unregister(this);
            this._startTime = +new Date;
            this.onstart();
            Manager.register(this);
            this.started = true;
            this.playing = true;
            clearTimeout(this.startAfterTimer);
            delete this.startAfterTimer;
        },

        /**
         * Seeks to a certain position along the duration timeline.
         * 
         * If seeking backwards, the transitions is played on a mirrored
         * timeline. This is done to make the animation "turn around", rather
         * than "rewind".
         * 
         * @param {float}
         *            pos Normally [0-1], but can be less than 0 or greater than
         *            1.
         * @param {boolean}
         *            [transitionBackwards] If true, plays an inverse of the
         *            transition when the animation is reversed (only applies
         *            when <code>pos &lt; this.rationalValue</code>.
         */
        seekTo : function(pos, transitionBackwards) {
            pos = parseFloat(pos);
            if (!isFinite(pos))
                return;
            if (pos === this[RVALUE])
                return;

            // The new distance is the difference between the
            // pos and the currentPosition (position).
            this.startOffset = this.position;
            this.startValue = this[RVALUE];

            this.endValue = pos;

            var distance = Math.abs(pos - this.startValue);

            // The new timeLimit is a percentage of the the full duration.
            this.timeLimit = this.duration * distance;

            this.isReversed = (pos < this[RVALUE]);
            this._transitionBackwards = this.isReversed && transitionBackwards;
            if (this._transitionBackwards) {
                this.endOffset = 1 - this.transition(1 - pos);
            } else {
                this.endOffset = this.transition(pos);
            }
            this._start();
        },

        toggleDirection : function() {
            if (!this.started) {
                this.start();
                return;
            }
            if (this.isReversed)
                this.seekTo(1);
            else {
                this.seekTo(0, this.position == 1);
            }
        },

        /**
         *  s the animation to position 0.
         */
        reset : function() {
            this.position = 0;
            this.timeLimit = this.duration;
            this.started = false;
        },

        /**
         * pauses the animation.
         */
        pause : function() {
            if(this.paused || !this.playing) return;
            this.paused = true;
            this.elapsedTime = new Date - this._startTime;
            Manager.unregister(this);
        },

        /**
         * unpauses the animation.
         */
        resume : function() {
            if(!this.paused) return;
            this.paused = false;

            // Pick up from last time frame.
            this._startTime = new Date - this.elapsedTime;
            Manager.register(this);
        },

        toString : function() {
            return "Animation {duration millis: " + this.duration
                    + ", position:" + this.position + "}";
        },

        /**
         * Ends the anim.
         */
        stop : function() {
            clearTimeout(this.startAfterTimer);
            delete this.startAfterTimer;
            this._end();
        },

        /** Cancels the anim where it is; does not call onend() */
        abort : function(ex) {
            Manager.unregister(this);
            this.onabort(ex || {});
        },

        _end : function() {
            this.playing = false;
            Manager.unregister(this);
            if (this.started) {
                this.onend();
            }
        }
    };

    /**
     * @class
     * @protected - for internal use. Manager is a Template that calls
     *            _playFrame() on each registered Animation. This object is for
     *            internal use, tightly coupled to Animation.
     */
    var Manager = new function() {

        this.register = register;
        this.unregister = unregister;

        var FRAME_PAUSE = 17, 
            activeAnimations = [], 
            intervalId;

        /**
         * Registers the animation once.
         * 
         * @param {Animation} anim the animation to register.
         */
        function register(anim) {
            if (activeAnimations.length === 0)
                start.call(this);
            for (var i = 0; i < activeAnimations.length; i++) {
                if (activeAnimations[i] === anim) {
                    return;
                }
            }
            activeAnimations.push(anim);
        }

        /**
         * Registers the animation in the thread pool once.
         * 
         * @param {Animation}
         *            anim the animation to register.
         */
        function unregister(anim) {
            for (var i = 0; i < activeAnimations.length; i++) {
                if (activeAnimations[i] === anim) {
                    activeAnimations.splice(i, 1);
                }
            }
            if (activeAnimations.length === 0) {
                activeAnimations = [];
                stop.call(this);
            }
        }

        /** starts run();  */
        function start() {
            intervalId = setInterval(run, FRAME_PAUSE);
        }

        /* Plays the frame for each animation. */
        function run() {
            var i = 0, animation;

            // Check activeAnimations.length each iteration.
            for (; i < activeAnimations.length; i++) {
                // If an error occurs, continue the other animations,
                // abort only the one that raised the error.
                try {
                    animation = activeAnimations[i];
                    _playFrame(animation);
                } catch (ex) {
                    // If an error occurs, abort the anim.
                    if (animation) {
                        animation.abort(ex);
                    }
                }
            }
        }

        /**
         * Called automatically when there are no more activeAnimations to run.
         */
        function stop() {
            self.clearInterval(intervalId);
        }

        /**
         * Called by the anim.Manager
         * @param {APE.anim.Animation}
         *            anim. Calculates rationalValue and calls "run" on anim.
         */
        function _playFrame(anim) {
    
            var elapsed = new Date - anim._startTime;
    
            if (elapsed >= anim.timeLimit) {
                anim.run(anim.position = anim.endOffset);
                anim[RVALUE] = anim.endValue;
                anim._end();
                return;
            }
            var rationalDistanceTraveled = elapsed / anim.duration,
                transition = anim.transition;
    
            if (anim.isReversed) {
                anim[RVALUE] = anim.startValue - rationalDistanceTraveled;
                if (anim._transitionBackwards)
                    anim.position = 1 - transition(1 - anim[RVALUE]);
                else
                    anim.position = transition(anim[RVALUE]);
            } else {
                anim[RVALUE] = anim.startValue + rationalDistanceTraveled;
                anim.position = transition(anim[RVALUE]);
            }
    
            if (typeof anim.onplay == "function")
                anim.onplay(anim.position);
            anim.run(anim.position);
        }
    };

    var PI = Math.PI,
        atan = Math.atan,
        cos = Math.cos;

    APE.anim.Transitions = {

        none : noop,

        accel : function(pos) {
            return pos * pos * pos;
        },

        decel : function(pos) {
            pos = 1 - pos;
            return 1 - (pos * pos * pos);
        },

        /** For better performance, use (1-position) instead. */
        reverse : function(pos) {
            return 1 - pos;
        },

        getSigmoid : function(steepness) {
            steepness = steepness || 1;
            return sigmoid;
            function sigmoid(pos) {
                return (atan(steepness * (2 * pos - 1)) / atan(steepness) + 1)
                        / (2);
            }
        },

        /**
         * Adapted from paper by Corey McCaffree:
         * http://dspace.mit.edu/bitstream/1721.1/36904/1/80770344.pdf
         */
        easeInEaseOut : function(pos) {
            return (atan(pos * PI / 1 - PI / 2) + 1) / 2.0038848218538874;
        },

        /**
         * wobble, loop, and spring come from, or are based on Scriptaculous.
         */
        wobble : function(pos) {
            return (-cos(3 * pos * PI) / 2) + .5;
        },

        /**
         * Plays the APE.anim forwards and backwards in the same duration.
         */
        loop : function(pos) {
            return (-cos(2 * pos * PI) / 2) + .5;
        },

        spring : function(pos) {
            return 1 - (cos(pos * 4.5 * PI) * Math.exp(-pos * 6));
        },

        /**
         * Based on Easing Equations v2.0 (c) 2003 Robert Penner, all rights
         * reserved. This work is subject to the terms in
         * http://www.robertpenner.com/easing_terms_of_use.html Adapted for
         * Scriptaculous by Ken Snyder (kendsnyder ~at~ gmail ~dot~ com) June
         * 2006
         */
        swingTo : function(pos) {
            var s = 1.70158;
            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
        },

        swingToFrom : function(pos) {
            var s = 1.70158;
            if ((pos /= 0.5) < 1) {
                return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
            }
            return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
        }
    };
})();/**
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
        EXTEND = "createSubclass",
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
                return (a instanceof ImmediateThresholdTransitionAdapter) ? -1 : 1;
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
            t = ColorRGB.fromString(toValue);

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
        TransitionAdapter.call(this, prop, parseInt(fromValue ,10),
                parseInt(toValue ,10));
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