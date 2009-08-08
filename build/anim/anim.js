/** 
 * @fileoverview
 * anim package
 * Animation, Manager
 *
 * @author Garrett Smith
 * <p>
 * Sigmoid functions based upon work by Emmanuel Pietriga.
 * wobble and spring come from, or are loosely based on Scriptaculous.
 *</p>
 * <p>
 * Animation is a Template that passes a position to its <code>run( pos )</code> method. (you implement run).
 * </p> 
 * <p>
 * <code>anim.Transitions</code> contains effects for speed/timing, such as acceleration and easing.
 * </p> 
 * @example
 * <pre> 
 * b = new APE.anim.Animation( "blah" );
 * b.run = function(position) { // <-- you implement run.
 * 
 * };
 * b.start(); // <-- then call start.
 * </pre> <p>
 * </p>
 */

/** 
 * @class 
 * @namespace APE.anim
 */



/**  
 * @constructor Animation
 * @param {ufloat} [duration] Number of seconds to run the animation (default is 1).
 */
(function(){
    APE.anim.Animation = Animation;

    function Animation( duration ) {
        if(typeof duration == "number")
            this.duration = duration * 1000; // default 1 sec.
        this.timeLimit = this.duration; // for SeekTo()
    }
    
    function noop(p){return p;}
    
    Animation.prototype = {
        
        paused : false,
    
        /** @type {Number} duration of how long the animation will run (milliseconds). */
        duration : 1000,
    
        /** @type {Number} duration of how long the animation will run.
         * @internal
         * Used internally for seekTo().
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
         * @example <pre>
         * var a = new APE.anim.Animation();
         * a.transition = APE.anim.Transitions.loop;
         * </pre>
         */
        transition : noop,
    
        position : 0,
    
        /** @event 
         * @description fires when the Animation starts, when seekTo is called. */
        onstart : noop,
    
        /** @event 
         * @description fires when stop() is called or the Animation successfully completes. */
        onend : noop,
        
        /** @event {Function} onplay fires right before run() is called */
    
        /** 
         * @event
         * @description If an error occurred, onabort throws the error.
         * this can be overridden (shadowed) by adding 
         * an onabort() to the Animation instance.
         * 
         * @example <pre>
         * APE.EventRegistry.add( myAnim, "onabort", myErrorHandler );
         * function myErrorHandler(ex) { alert(ex.message); }
         * </pre>
         * @param {Error} ex the error that occured.
         * @throws {Error} the error that occured.
         */
        onabort : function(ex) {
            throw ex;
        },
    
        /** Run must be implemented by user.
         * @param position {Number} 0-1
         * 
         * Implementation generally looks something like:<pre>
         * anim.run = function( position ) {
         *   document.body.style.borderWidth = ( 12 * position ) + "px"
         * };</pre>
         */
        run : noop,
    
        /** 
         * Call this method to start the anim.
         */
        start : function() {
            if(this.paused) return;
            this.playing = true;
            this.timeLimit = this.duration;
            this.endOffset = this.transition(this.endValue);
            this._start();
        },
    
        /**
         *  timeLimit is not calculated here.
         * unregisters Animation, calls onstart(), registers Animation.
         * @fires onstart
         * @private
         */
        _start : function() {
            // Unregister the animation before setting startTime.
            Manager.unregister(this);
            this._startTime = new Date-0;
            this.onstart();
            Manager.register(this);
            this.started = true;
        },
    
        /** 
         * Seeks to a certain position along the duration timeline.
         * 
         * If seeking backwards, the transitions is played on a mirrored timeline.
         * This is done to make the animation "turn around", rather than "rewind".
         *
         * @param {float} pos Normally [0-1], but can be less than 0 or greater than 1. 
         * @param {boolean} [transitionBackwards] If true, plays an inverse of the transition when 
         * the animation is reversed (only applies when <code>pos &lt; this.rationalValue</code>.
         */
        seekTo : function(pos, transitionBackwards) {
            pos = parseFloat(pos);
            if(!isFinite(pos)) return;
            if(pos === this.rationalValue) return;
    
            // The new distance is the difference between the 
            // pos and the currentPosition (position).
            this.startOffset = this.position;
            this.startValue = this.rationalValue;
    
            this.endValue = pos;
    
            var distance = Math.abs(pos - this.startValue);
    
            // The new timeLimit is a percentage of the the full duration.
            this.timeLimit = this.duration * distance;
            
            this.isReversed = (pos < this.rationalValue);
            this._transitionBackwards = this.isReversed && transitionBackwards;
            if(this._transitionBackwards) {
                this.endOffset = 1-this.transition(1-pos);
            }
            else {
                this.endOffset = this.transition(pos);
            }
            this._start();
        },
    
        toggleDirection : function( ) {
            if(!this.started) {
                this.start();
                return;
            }
            if(this.isReversed)
                this.seekTo(1);
            else {
                this.seekTo(0, this.position == 1);
            }
        },
    
        /** 
         * resets the animation to position 0.
         */
        reset : function() {
            this.position = 0;
            this.timeLimit = this.duration;
        },
        
        /** 
         * pauses the animation.
         */
        pause : function() {
            this.paused = true;
            this.elapsedTime = new Date-this._startTime;
            Manager.unregister(this);
        },
        
        /** 
         * unpauses the animation.
         */
        resume : function() {
            this.paused = false;
    
            // Pick up from last time frame.
            this._startTime = new Date - this.elapsedTime;
            Manager.register(this);
        },
        
        toString : function() {
            return"Animation {duration millis: " + this.duration + 
                ", position:" + this.position+"}";
        },
    
        /** Ends the anim.
         * @param {boolean} ended, if true, calls onend().
         * Note, this is not a pause() method.
         */
        stop : function(ended) {
            this._end(ended);
        },
    
        /** Cancels the anim where it is; does not call onend()
         */
        abort : function(ex) {
            Manager.unregister(this);
            this.onabort(ex||{});
        },
        
        _end : function(complete) {
            Manager.unregister(this);
            if(complete !== false) {
                this.onend();
            }
        }
    };

    /** 
     * @class 
     * @protected - for internal use.
     * Manager is a Template that calls _playFrame() on each registered Animation.
     * This object is for internal use, tightly coupled to Animation.
     */
    var Manager = new function() {
        
        this.register = register;
        this.unregister = unregister;
        
        var FRAME_PAUSE = 17,
            activeAnimations = [],
            intervalId;
            
       /** 
        * Registers the animation once.
        * @param {Animation} anim the animation to register.
        */
        function register(anim) {
            if(activeAnimations.length === 0)
                start.call(this);
            for(var i = 0; i < activeAnimations.length; i++) {
                if(activeAnimations[i] === anim) {
                    return;
                }
            }
            activeAnimations.push(anim);
        }
        
       /** 
        * Registers the animation in the thread pool once.
        * @param {Animation} anim the animation to register.
        */
        function unregister(anim) {
            for(var i = 0; i < activeAnimations.length; i++) {
                if(activeAnimations[i] === anim) {
                    activeAnimations.splice(i, 1);
                }
            }
            if(activeAnimations.length === 0) {
                activeAnimations = [];
                stop.call(this);
            }
        }
    
        /** 
         * starts run();
         * @private
         */
        function start() {
            intervalId = window.setInterval(run, FRAME_PAUSE);
         }
    
        /** 
         * Plays the frame for each animation.
         * @private - starts run().
         */
        function run() {
            var i = 0, animation;
    
            // Check activeAnimations.length each iteration. 
            for(; i < activeAnimations.length; i++) {
             // If an error occurs, continue the other animations,
             // abort only the one that raised the error.
                try {
                   animation = activeAnimations[i];
                    _playFrame(animation);
                } catch(ex) {
                // If an error occurs, abort the anim.
                    if(animation) {
                        animation.abort(ex);
                    }
                }
            }
        }
    
        /** 
         * Called automatically when there are no more activeAnimations to run.
         */
        function stop() {
            window.clearInterval(intervalId);
        }
    };
    
    /** 
     * Called by the anim.Manager
     * @private
     * @param {APE.anim.Animation} anim.
     * Calculates rationalValue and calls "run" on anim.
     */
    function _playFrame(anim) {

        var elapsed = new Date - anim._startTime;

        if(elapsed >= anim.timeLimit) {
            anim.run(anim.position = anim.endOffset);
            anim.rationalValue = anim.endValue;
            anim._end();
            return;
        }
        var rationalDistanceTraveled = (elapsed / anim.duration);

        if(anim.isReversed) {
            anim.rationalValue = anim.startValue - rationalDistanceTraveled;
            if(anim._transitionBackwards)
                anim.position = 1 - anim.transition(1-anim.rationalValue);
            else
                anim.position = anim.transition(anim.rationalValue);
        }
        else {
            anim.rationalValue = anim.startValue + rationalDistanceTraveled;
            anim.position = anim.transition(anim.rationalValue);
        }

        if(typeof anim.onplay == "function")
            anim.onplay( anim.position );
        anim.run( anim.position );
    }
})();

/** 
 * @class 
 * Easing functions.
 */
APE.anim.Transitions = {

    none : function(pos) { return pos; },

    accel: function (pos) {
        return pos*pos*pos;
    },

    decel : function(pos) {
        pos = 1-pos;
        return 1-(pos*pos*pos);
    },
    
    /**
     * For better performance, use (1-position) instead.
     */
    reverse: function(pos) {
        return 1-pos;
    },

    /**
     * Sigmoid functions based upon work by Emmanuel Pietriga.
     * http://www.docjar.net/html/api/com/xerox/VTM/engine/AnimManager.java.html
     * Copyright (c) Xerox Corporation, XRCE/Contextual Computing, 2002.
     */
    sigmoid : function(pos, steepness) {
        var atan = Math.atan;
        steepness = steepness || 1;
        return (atan(steepness*(2*pos-1))/atan(steepness)+1)/(2);
    },

    sigmoid2 : function(pos) {
        var atan = Math.atan;
        return (atan(2*(2*pos-1))/atan(2)+1)/(2);
    },

    sigmoid3 : function(pos) {
        var atan = Math.atan;
        return (atan(3*(2*pos-1))/atan(3)+1)/(2);
    },

    sigmoid4 : function(pos) {
        var atan = Math.atan;
        return (atan(4*(2*pos-1))/atan(4)+1)/(2);
    },

    tan : function(pos) {
        var tan = Math.tan;
        return (tan(1*(2*pos-1))/tan(1)+1)/(2);
    },

    reverseWarp : function(pos) {
        var tan = Math.tan;
        return (tan(2*(2*pos-1))/tan(2)+1)/(2);
    },

    /** Adapted from paper by Corey McCaffree:
     * http://dspace.mit.edu/bitstream/1721.1/36904/1/80770344.pdf
     */
    easeInEaseOut : function(pos) {
        var PI = Math.PI;
        return (Math.atan(pos * PI / 1 - PI/2) + 1) / 2.0038848218538874;
    },
    
    /**
     * wobble, loop, and spring come from, or are based on Scriptaculous.
     */
    wobble: function(pos) {
        return (-Math.cos(3*pos*Math.PI)/2) + .5;
    },

    /** Plays the APE.anim forwards and backwards 
     *  in the same duration.
     */
    loop: function(pos) {
        return (-Math.cos(2*pos*Math.PI)/2) + .5;
    },

    spring : function(pos) { 
        return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6)); 
    },
    
    /**
     * Based on Easing Equations v2.0 
     * (c) 2003 Robert Penner, all rights reserved. 
     * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html
     * Adapted for Scriptaculous by Ken Snyder (kendsnyder ~at~ gmail ~dot~ com) June 2006 
     */
    swingTo : function(pos) { 
        var s = 1.70158; 
        return (pos-=1)*pos*((s+1)*pos + s) + 1;
    },

    swingToFrom : function(pos) {
        var s = 1.70158; 
        if ((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)); 
        return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2); 
    },

    toString : function() {
        return"APE anim Transitions";
    }
};/**
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

    var APE = window.APE, anim = APE.anim, dom = APE.dom,
        _start = anim.Animation.prototype.start,
        _end = anim.Animation.prototype.start;
    
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
    APE.anim.StyleTransition = StyleTransition;
    
    function StyleTransition(id, styleObject, duration, transition) {
        anim.Animation.call(this, duration); // invoke super constructor.
        if (id.id)
            id = id.id;
        this.id = id;
        this.adapters = [];
        
        if (transition) {
            this.transition = transition;
        }
        this.init(styleObject);
    }
    
    APE.extend(anim.StyleTransition, anim.Animation, {
    
        start : function() {
            // Use id as weak ref, set "style" in start and end.
            this.style = document.getElementById(this.id).style;
            _start.call(this);
        },

        end : function() {
            this.style = null;
            _end.call(this);
        },
        
        /**
         * @method run
         * @memberOf APE.anim.StyleTransition
         * @description overrides (implements) <code>run()</code> in Animation.
         *              Runs the animation, getting the correct value from each
         *              ITransitionAdapter. This run() method gets called by
         *              Animation.
         */
        run : function run(rationalValue) {
            var i = 0, adapters = this.adapters, len = adapters.length, 
                style = this.style, adapter;
            while (i < len) {
                adapter = adapters[i++];
                this.style[adapter.prop] = adapter.blendTo(rationalValue);
            }
        },
    
        /** @private */
        init : function(styleObject) {
            var el = document.getElementById(this.id), adapters = [], adapter, 
            APE = window.APE,  
            prop, fromValue, toValue, 
            TransitionAdapterFactory = APE.anim.TransitionAdapterFactory, 
            ThresholdTransitionAdapter = TransitionAdapterFactory.ThresholdTransitionAdapter, 
            ImmediateThresholdTransitionAdapter = TransitionAdapterFactory.ImmediateThresholdTransitionAdapter;
    
            var style = el.style,
                cssText = style.cssText,
                fromValues = {};
            // Loop through style object to find values.
            for (prop in styleObject) {
                toValue = styleObject[prop];
                if (!toValue)
                    continue; // CSSStyleRule.                
                if (prop == "opacity" && !("opacity" in el.style)
                        && ("filter" in el.style)) {
                    prop = "alpha";
                    el.style.zoom = "1";
                    fromValue = dom.getFilterOpacity(el);
                } else {
                    fromValue = dom.getStyle(el, prop); 
                }
                fromValues[prop] = fromValue;
            }
            for(prop in styleObject) {
                style[prop] = styleObject[prop];
            }
            
            // Override visibility and display so we can 
            // calculate real values.
            style.visibility = "visible";
            style.display = "block";

            for(prop in styleObject) {
                toValue = styleObject[prop];
                if(lengthExp.test(toValue)){
                    toValue = dom.getStyle(el, prop);
                }
                // Get a ITransitionAdapter from the factory.
                adapter = TransitionAdapterFactory.fromValues(prop, fromValues[prop],
                        toValue, el);
                adapters.push(adapter);
            }
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
                    + anim.Animation.prototype.toString.call(this)
                    + "\nAdapters:\n  " + this.adapters.join("\n  ");
        }
    });

    var // "1px", "1.1px", "-.1px" => ["-.1px", "-.1", "px"]
        lengthExp = /(^-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)/i,
        colorExp = /color/i,
        positiveLengthExp = /(?:width|height|padding|fontSize)$/ig,
        filterExp = /alpha/,
        opacityExp = /^opacity/,
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
    anim.TransitionAdapterFactory = {
    
        fromValues : function(prop, fromValue, toValue) {
    
            var adapter;
            if (positiveLengthExp.test(prop)) {
                adapter = this.PositiveLengthTransitionAdapter;
            } else if (colorExp.test(prop)) {
                adapter = this.ColorTransitionAdapter;
            } else if (lengthExp.test(fromValue)) {
                adapter = this.LengthTransitionAdapter;
            } else if (filterExp.test(prop)) {
                adapter = this.FilterTransitionAdapter;
            } else if (opacityExp.test(prop)) {
                adapter = this.OpacityTransitionAdapter;
            } else if (prop == "fontWeight" && intExp.test(fromValue) 
                    && intExp.test(toValue)) {
                adapter = this.FontWeightTransitionAdapter;
            } else if (prop === "visibility" && noVisibilityExp.test(fromValue) 
                    || prop == "display" && fromValue == "none") {
                adapter = this.ImmediateThresholdTransitionAdapter;
            } else {
            // Return an object that sets toValue on completion.
            adapter = this.ThresholdTransitionAdapter;
            } 
            return new adapter(prop, fromValue, toValue);
        }
    };

    var ColorRGB = APE.color && APE.color.ColorRGB,

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

    APE.mixin(anim.TransitionAdapterFactory, Adapters);

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
        if (!ColorRGB) { // If script was included in wrong order.s
            ColorRGB = APE.color.ColorRGB;
        }
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
        TransitionAdapter.call(this, prop, parseFloat(fromValue),
                parseFloat(toValue), "px");
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
        if (rationalValue === 1)
            return this.toValue;
        return this.fromValue;
    };

    function ImmediateThresholdTransitionAdapter(prop, fromValue, toValue) {
        TransitionAdapter.call(this, prop, fromValue, toValue);
    }

    APE.extend(ImmediateThresholdTransitionAdapter, TransitionAdapter);
    ImmediateThresholdTransitionAdapter.prototype.blendTo = function(
            rationalValue) {
        if (rationalValue === 0) {
            return this.fromValue;
        }
       return this.toValue;
    };
})();