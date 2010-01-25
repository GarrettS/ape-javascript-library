/** 
 * @fileoverview 
 * EventPublisher
 *
 * Released under Academic Free Licence 3.0.
 * @author Garrett Smith
 * @class 
 * <code>APE.EventPublisher</code> can be used for native browser events or custom events.
 *
 * <p> For native browser events, use <code>APE.EventPublisher</code>
 * steals the event handler off native elements and creates a callStack. 
 * that fires in its place.
 * </p>
 * <p>
 * There are two ways to create custom events.
 * </p>
 * <ol>
 * <li>Create a function on the object that fires the "event", then call that function 
 * when the event fires (this happens automatically with native events).
 * </li>
 * <li>
 * Instantiate an <code>EventPublisher</code> using the constructor, then call <code>fire</code>
 * when the callbacks should be run.
 * </li>
 * </ol>
 * <p>
 * An <code>EventPublisher</code> itself publishes <code>beforeFire</code> and <code>afterFire</code>.
 * This makes it possible to add AOP before advice to the callStack.
 * </p><p>
 * adding before-before advice is possible, but will impair performance.
 * Instead, add multiple beforeAdvice with: 
 * <code>publisher.addBefore(fp, thisArg).add(fp2, thisArg);</code>
 * </p><p>
 * There are no <code>beforeEach</code> and <code>afterEach</code> methods; to create advice 
 * for each callback would require modification 
 * to the registry (see comments below). I have not yet found a real need for this.
 * </p>
 */
/**
 * @constructor
 * @description creates an <code>EventPublisher</code> with methods <code>add()</code>,
 * <code>fire</code>, et c.
 */
(function(){
var APE = self.APE,
   /** Map of [APE.EventPublisher], keyed by type. */
    Registry = {},
    isMaybeLeak/*@cc_on=(@_jscript_version<5.7)@*/;

APE.EventPublisher = EventPublisher;
APE.createMixin(EventPublisher, {
    get : get,
    add : add,
    remove : remove,
    fire : fire,
    cleanUp : cleanUp
});

function EventPublisher(src, type) {
    this.src = src;
    this._callStack = [];
    this.type = type;
}

EventPublisher.prototype = {

/**  
 *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this.
 */
    add : function(fp, thisArg) {
        this._callStack.push([fp, thisArg||this.src]);
        return this;
    },
/**  Adds beforeAdvice to the callStack. This fires before the callstack. 
 *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
 *  function's returnValue proceed false stops the callstack and returns false to the original call.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this.
 */
    addBefore : function(f, thisArg) {
        return add(this, "beforeFire", f, thisArg||this.src); 
    },
    
/**  Adds afterAdvice to the callStack. This fires after the callstack. 
 *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
 *  function's returnValue of false returns false to the original call.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this.
 */
    addAfter : function(f, thisArg) {
        return add(this, "afterFire", f, thisArg||this.src); 
    },

    /** 
     * @param {String} "beforeFire", "afterFire" conveneince.
     * @return {EventPublisher} this;
     */
    getEvent : function(type) {
        return get(this, type);
    },

/**  Removes fp from callstack.
 *  @param {Function} fp the callback function to remove.
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {EventPublisher} this.
 */
    remove : function(fp, thisArg) {
        var cs = this._callStack, i, call;
        thisArg = thisArg || this.src;
        for(i = 0; i < cs.length; i++) {
            call = cs[i];
            if(call[0] === fp && call[1] === thisArg) {
                return cs.splice(i, 1);
            }
        }
        return null;
    },

/**  Removes fp from callstack's beforeFire.
 *  @param {Function} fp the callback function to remove.
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {EventPublisher} this.
 */
    removeBefore : function(fp, thisArg) {
        return get(this, "beforeFire").remove(fp, thisArg||this.src);
    },


/**  Removes fp from callstack's afterFire.
 *  @param {Function} fp the callback function to .
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {EventPublisher} this.
 */
    removeAfter : function(fp, thisArg) {
        return get(this, "afterFire").remove(fp, thisArg||this.src);
    },

/** Fires the event. */
    fire : function(payload) {
        return fire(this)(payload);
    },

/** helpful debugging info */
    toString : function() {
        return  "APE.EventPublisher: {src=" + this.src + ", type=" + this.type +
             ", length="+this._callStack.length+"}";
    }
};

/**
 * @static
 * @memberOf {APE.EventPublisher}
 * called onunload, automatically onunload. 
 * This is only called for if jscript version <= 5.6 is detected
 * supported. IE has memory leak problems; other browsers have fast forward/back,
 * but that won't work if there's an onunload handler.
 */
function cleanUp() {
    var type, publisherList, publisher, i, len;
    for(type in Registry) {
        publisherList = Registry[type];
        for(i = 0, len = publisherList.length; i < len; i++) {
            publisher = publisherList[i];
            publisher.src[publisher.type] = null;
        }
    }
    Registry = {};
}

/** 
 *  @static
 *  @param {Object} src the object which calls the function
 *  @param {String} sEvent the function that gets called.
 *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
 *  @param {Object} thisArg the context that the function executes in.
 */
function add(src, sEvent, fp, thisArg) {
    return get(src, sEvent).add(fp, thisArg);
}

function remove(src, sEvent, fp, thisArg) {
    return get(src, sEvent).add(fp, thisArg);
}

/** 
 * @static
 * @private
 * @memberOf {APE.EventPublisher}
 * @return {boolean} false if any one of callStack's methods return false.
 */
function fire(publisher) {    
    // return function w/identifier doesn't work in Safari 2.
    return fireEvent; 
    function fireEvent(e) {
        var preventDefault = false,
            i,
            cs = publisher._callStack, csi;

        // beforeFire can affect return value.
        if(typeof publisher.beforeFire == "function") {
            try {
                if(publisher.beforeFire(e) == false)
                    preventDefault = true;
            } catch(ex){deferError(ex);}
        }

        for(i = 0; i < cs.length; i++) {
            csi = cs[i]; 
            // If an error occurs, continue the event fire,
            // but still throw the error.
            try {
                // TODO: beforeEach to prevent or advise each call.
                if(csi[0].call(csi[1], e) == false)
                    preventDefault = true; // continue main callstack and return false afterwards.
                // TODO: afterEach
            }
            catch(ex) {
                deferError(ex);
            }
        }
        // afterFire can prevent default.
        if(typeof publisher.afterFire == "function") {
            if(publisher.afterFire(e) == false)
                preventDefault = true;
        }
        return !preventDefault;
    }
}
 /** Throws the error in a setTimeout 1ms.
  *  Deferred errors are useful for Event Notification systems,
  *  Animation, and testing.
  *  @param {Error} error that occurred.
  */
 function deferError(error) {
     self.setTimeout(function(){throw error;},1);
 }

/** 
 * @static
 * @param {Object} src the object which calls the function
 * @param {String} sEvent the function that gets called.
 * @memberOf {APE.EventPublisher}
 * Looks for an APE.EventPublisher in the Registry.
 * If none found, creates and adds one to the Registry.
 */
function get(src, sEvent) {

    var publisherList = Registry[sEvent] || (Registry[sEvent] = []),
        i, len,
        publisher;
    
    for(i = 0, len = publisherList.length; i < len; i++) {
        publisher = publisherList[i];
        if(publisher.src === src) {
            return publisher;
        }
    }
    
    // not found.
    publisher = new EventPublisher(src, sEvent);
    // Steal. 
    if(src[sEvent]) {
        publisher.add(src[sEvent], src);
    }
    src[sEvent] = fire(publisher);
    publisherList[len] = publisher;
    return publisher;
}

if(isMaybeLeak)
    get( window, "onunload" ).addAfter( cleanUp, EventPublisher );
})();