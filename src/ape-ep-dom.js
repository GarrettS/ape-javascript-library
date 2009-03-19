/**
 * @fileoverview
 * <code>APE</code> provides core features, including namespacing and object creational aspects.
 *
 * <h3>APE JavaScript Library</h3>
 * <p>
 * Released under Academic Free Licence 3.0.
 * </p>
 *
 * @author Garrett Smith
 */

/** @name APE
 * @namespace */
if(APE !== undefined) throw Error("APE is already defined.");
var APE = {

    /**
     * @memberOf APE
     * @description Prototype inheritance.
     * @param {Object} subclass
     * @param {Object} superclass
     * @param {Object} mixin If present, <var>mixin</var>'s own properties are copied to receiver
     * using APE.mixin(subclass.prototoype, superclass.prototype).
     */
    extend : function(subclass, superclass, mixin) {
        if(arguments.length === 0) return;
        var f = arguments.callee, subp;
        f.prototype = superclass.prototype;
        subclass.prototype = subp = new f;
        if(typeof mixin == "object")
            APE.mixin(subp, mixin);
        subp.constructor = subclass;
        return subclass;
    },

    /**
     * Shallow copy of properties; does not look up prototype chain.
     * Copies all properties in s to r, using hasOwnProperty.
     * @param {Object} r the receiver of properties.
     * @param {Object} s the supplier of properties.
     * Accounts for JScript DontEnum bug for valueOf and toString.
     * @return {Object} r the receiver.
     */
    mixin : function(r, s) {
        var jscriptSkips = ['toString', 'valueOf'],
            prop,
            i = 0,
            skipped;
        for(prop in s) {
            if(s.hasOwnProperty(prop))
                r[prop] = s[prop];
        }
        // JScript DontEnum bug.
        for( ; i < jscriptSkips.length; i++) {
            skipped = jscriptSkips[i];
            if(s.hasOwnProperty(skipped))
                r[skipped] = s[skipped];
        }
        return r;
    },

    toString : function() { return "[APE JavaScript Library]"; },

    /** Creational method meant for being cross-cut.
     * Uses APE.newApply to create
     * @param {HTMLElement} el An element. If el does not have
     * an ID, then an ID will be automatically generated, based on the
     * constructor's (this) identifier, or, If this is anonymous, "APE".
     * @requires {Object} an object to be attached to as a property.
     * @aspect
     * @scope {Function} that accepts an HTMLElement for
     * its first argument.
     * APE.getByNode is intended to be bouund to a constructor function.
     * @return <code>{new this(el [,args...])}</code>
     */
    getByNode : function(el) {
        var id = el.id,
            fName;
        if(!id) {
            if(!APE.getByNode._i) APE.getByNode._i = 0;
            fName = APE.getFunctionName(this);
            if(!fName) fName = "APE";
            id = el.id = fName+"_" + (APE.getByNode._i++);
        }
        if(!this.hasOwnProperty("instances")) this.instances = {};
        return this.instances[id] || (this.instances[id] = APE.newApply(this, arguments));
    },

    /** Tries to get a name of a function object, returns "" if anonymous.
     */
    getFunctionName : function(fun) {
        if(typeof fun.name == "string") return fun.name;
        var name = Function.prototype.toString.call(fun).match(/\s([a-z]+)\(/i);
        return name && name[1]||"";
    },

    /** Creational method meant for being cross-cut.
     * @param {HTMLElement} el An element that has an id.
     * @requires {Object} an object to bind to.
     * @aspect
     * @description <code>getById</code> must be assigned to a function constructor
     * that accepts an HTMLElement's <code>id</code> for
     * its first argument.
     * @example <pre>
     * function Slider(el, config){ }
     * Slider.getById = APE.getById;
     * </pre>
     * This allows for implementations to use a factory method with the constructor.
     * <pre>
     * Slider.getById( "weight", 1 );
     * </pre>
     * Subsequent calls to:
     * <pre>
     * Slider.getById( "weight" );
     * </pre>
     * will return the same Slider instance.
     * An <code>instances</code> property is added to the constructor object
     * that <code>getById</code> is assigned to.
     * @return <pre>new this(id [,args...])</pre>
     */
    getById : function(id) {
        if(!this.hasOwnProperty("instances")) this.instances = {};
        return this.instances[id] || (this.instances[id] = APE.newApply(this, arguments));
    },

    /** Creates a Factory method out of a function.
     * @param {Function} constructor
     * @param {Object} prototype
     * @memberOf APE
     */
    createFactory : function(constructor, prot) {
        var baseObject = {}, 
            instances = baseObject.instances = {}; // Export, for purge or cleanup.
        if(prot) {
            constructor.prototype = prot;
        }
        baseObject.getById = getById;
        return baseObject;
        function getById(id) {
            return instances[id] || (instances[id] = APE.newApply(constructor, arguments));
        }
    },

    newApply : (function() {
        function F(){}
        return newApply;
        /**
         * @param {Function} constructor constructor to be invoked.
         * @param {Array} args arguments to pass to the constructor.
         * Instantiates a constructor and uses apply().
         * @memberOf APE
         */
        function newApply(constructor, args) {
            var i;
            F.prototype = constructor.prototype;// Copy prototype.
            F.prototype.constructor = constructor;
            i = new F;
            constructor.apply(i, args); // Apply the original constructor.
            return i;
        }
    })(),

    /** Throws the error in a setTimeout 1ms.
     *  Deferred errors are useful for Event Notification systems,
     * Animation, and testing.
     * @param {Error} error that occurred.
     */
    deferError : function(error) {
        setTimeout(function(){throw error;},1);
    }
};

(function(){

    APE.namespace = namespace;

    /**
     * @memberOf APE
     * @description creates a namespace split on "."
     * does <em>not</em> automatically add APE to the front of the chain, as YUI does.
     * @param {String} s the namespace. "foo.bar" would create a namespace foo.bar, but only
     * if that namespace did not exist.
     * @return {Package} the namespace.
     */
    function namespace(s) {
        var packages = s.split("."),
            pkg = window,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            qName = pkg.qualifiedName,
            i = 0,
            len = packages.length,
            name;
        for (; i < len; i++) {
            name = packages[i];

            // Internet Explorer does not support
            // hasOwnProperty on things like window, so call Object.prototype.hasOwnProperty.
            // Opera does not support the global object or [[Put]] properly (see below)
            if(!hasOwnProperty.call(pkg, name)) {
                pkg[name] = new Package((qName||"APE")+"."+name);
            }
            pkg = pkg[name];
        }

        return pkg;
    }

    Package.prototype.toString = function(){
        return"["+this.qualifiedName+"]";
    };

    /* constructor Package
     */
    function Package(qualifiedName) {
        this.qualifiedName = qualifiedName;
    }
})();

(function(){
/**@class
 * A safe patch to the Object object. This patch addresses a bug that only affects Opera.
 * <strong>It does <em>not</em> affect any for-in loops in any browser</strong> (see tests).
 */
var O = Object.prototype, hasOwnProperty = O.hasOwnProperty;
if(typeof window != "undefined" && hasOwnProperty && !hasOwnProperty.call(window, "Object")) {
/**
 * @overrides Object.prototype.hasOwnProperty
 * @method
 * This is a conditional patch that affects some versions of Opera.
 * It is perfectly safe to do this and does not affect enumeration.
 */
    Object.prototype.hasOwnProperty = function(p) {
        if(this === window) return (p in this) && (O[p] !== this[p]);
        return hasOwnProperty.call(this, p);
    };
}
})();/** 
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
APE.EventPublisher = function(src, type) {
    this.src = src;
    // Really could use a List of bound methods here. 
    this._callStack = [];
    this.type = type;
};

APE.EventPublisher.prototype = {

/**  
 *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this;
 */
    add : function(fp, thisArg) {
        this._callStack.push([fp, thisArg||this.src]);
        return this;
    },
/**  Adds beforeAdvice to the callStack. This fires before the callstack. 
 *  @param {Function:boolean} fp the callback function that gets called when src[sEvent] is called.
 *  function's returnValue proceed false stops the callstack and returns false to the original call.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this;
 */
    addBefore : function(f, thisArg) {
        return APE.EventPublisher.add(this, "beforeFire", f, thisArg); 
    },
    
/**  Adds afterAdvice to the callStack. This fires after the callstack. 
 *  @param {Function:boolean} fp the callback function that gets called when src[sEvent] is called.
 *  function's returnValue of false returns false to the original call.
 *  @param {Object} thisArg the context that the function executes in.
 *  @return {EventPublisher} this;
 */
    addAfter : function(f, thisArg) {
        return APE.EventPublisher.add(this, "afterFire", f, thisArg); 
    },

    /** 
     * @param {String} "beforeFire", "afterFire" conveneince.
     * @return {EventPublisher} this;
     */
    getEvent : function(type) {
        return APE.EventPublisher.get(this, type);
    },

/**  Removes fp from callstack.
 *  @param {Function:boolean} fp the callback function to remove.
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {Function} the function that was passed in, or null if not found;
 */
    remove : function(fp, thisArg) {
        var cs = this._callStack, i = 0, len, call;
        if(!thisArg) thisArg = this.src;
        for(len = cs.length; i < len; i++) {
            call = cs[i];
            if(call[0] === fp && call[1] === thisArg) {
                return cs.splice(i, 1);
            }
        }
        return null;
    },

/**  Removes fp from callstack's beforeFire.
 *  @param {Function:boolean} fp the callback function to remove.
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {Function} the function that was passed in, or null if not found (uses remove());
 */
    removeBefore : function(fp, thisArg) {
        return this.getEvent("beforeFire").remove(fp, thisArg);
    },


/**  Removes fp from callstack's afterFire.
 *  @param {Function:boolean} fp the callback function to remove.
 *  @param {Object} [thisArg] the context that the function executes in.
 *  @return {Function} the function that was passed in, or null if not found (uses remove());
 */
    removeAfter : function(fp, thisArg) {
        return this.getEvent("afterFire").remove(fp, thisArg);
    },

/** Fires the event. */
    fire : function(payload) {
        return APE.EventPublisher.fire(this)(payload);
    },

/** helpful debugging info */
    toString : function() {
        return  "APE.EventPublisher: {src=" + this.src + ", type=" + this.type +
             ", length="+this._callStack.length+"}";
    }
};

/** 
 *  @static
 *  @param {Object} src the object which calls the function
 *  @param {String} sEvent the function that gets called.
 *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
 *  @param {Object} thisArg the context that the function executes in.
 */
APE.EventPublisher.add = function(src, sEvent, fp, thisArg) {
    return APE.EventPublisher.get(src, sEvent).add(fp, thisArg);
};

/** 
 * @static
 * @private
 * @memberOf {APE.EventPublisher}
 * @return {boolean} false if any one of callStack's methods return false.
 */
APE.EventPublisher.fire = function(publisher) {
    // This closure sucks. We should have partial/bind in ES.
    // If we did, this could more reasonably be a prototype method.
    
    // return function w/identifier doesn't work in Safari 2.
    return fireEvent; 
    function fireEvent(e) {
        var preventDefault = false,
            i = 0, len,
            cs = publisher._callStack, csi;

        // beforeFire can affect return value.
        if(typeof publisher.beforeFire == "function") {
            try {
                if(publisher.beforeFire(e) == false)
                    preventDefault = true;
            } catch(ex){APE.deferError(ex);}
        }

        for(len = cs.length; i < len; i++) {
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
                APE.deferError(ex);
            }
        }
        // afterFire can prevent default.
        if(typeof publisher.afterFire == "function") {
            if(publisher.afterFire(e) == false)
                preventDefault = true;
        }
        return !preventDefault;
    }
};

/** 
 * @static
 * @param {Object} src the object which calls the function
 * @param {String} sEvent the function that gets called.
 * @memberOf {APE.EventPublisher}
 * Looks for an APE.EventPublisher in the Registry.
 * If none found, creates and adds one to the Registry.
 */
APE.EventPublisher.get = function(src, sEvent) {

    var publisherList = this.Registry.hasOwnProperty(sEvent) && this.Registry[sEvent] || 
        (this.Registry[sEvent] = []),
        i = 0, len = publisherList.length,
        publisher;
    
    for(; i < len; i++)
        if(publisherList[i].src === src)
            return publisherList[i];
    
    // not found.
    publisher = new APE.EventPublisher(src, sEvent);
    // Steal. 
    if(src[sEvent])
        publisher.add(src[sEvent], src);
    src[sEvent] = this.fire(publisher);
    publisherList[publisherList.length] = publisher;
    return publisher;
};

/** 
 * Map of [APE.EventPublisher], keyed by type.
 * @private
 * @static
 * @memberOf {APE.EventPublisher}
 */
APE.EventPublisher.Registry = {};

/**
 * @static
 * @memberOf {APE.EventPublisher}
 * called onunload, automatically onunload. 
 * This is only called for if window.CollectGarbage is 
 * supported. IE has memory leak problems; other browsers have fast forward/back,
 * but that won't work if there's an onunload handler.
 */
APE.EventPublisher.cleanUp = function() {
    var type, publisherList, publisher, i, len;
    for(type in this.Registry) {
        publisherList = this.Registry[type];
        for(i = 0, len = publisherList.length; i < len; i++) {
            publisher = publisherList[i];
            publisher.src[publisher.type] = null;
        }
    }
};
if(window.CollectGarbage)
    APE.EventPublisher.get( window, "onunload" ).addAfter( APE.EventPublisher.cleanUp, APE.EventPublisher );