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

APE.namespace("APE.anim");

/**  
 * @constructor Animation
 * @param {ufloat} [duration] Number of seconds to run the animation (default is 1).
 */
(function(){
    APE.anim.Animation = Animation,
    RVALUE = "rationalValue";

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
            if(pos === this[RVALUE]) return;
    
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
            anim[RVALUE] = anim.endValue;
            anim._end();
            return;
        }
        var rationalDistanceTraveled = (elapsed / anim.duration);

        if(anim.isReversed) {
            anim[RVALUE] = anim.startValue - rationalDistanceTraveled;
            if(anim._transitionBackwards)
                anim.position = 1 - anim.transition(1-anim[RVALUE]);
            else
                anim.position = anim.transition(anim[RVALUE]);
        }
        else {
            anim[RVALUE] = anim.startValue + rationalDistanceTraveled;
            anim.position = anim.transition(anim[RVALUE]);
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
};