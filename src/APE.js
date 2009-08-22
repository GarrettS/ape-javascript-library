/**
 * @fileoverview
 * <code>APE</code> provides core features, including namespacing and object creational aspects.
 *
 * <h3>APE JavaScript Library</h3>
 * <p>
 * Released under Academic Free Licence 3.0.
 * </p>
 */
(function(){
    if(typeof APE !== "undefined") throw Error("APE is already defined.");
    self.APE = {
        namespace : namespace,
        mixin : mixin,
        extend : extend,
        createFactory : createFactory,
        getById : getById,
        deferError : deferError,
        toString : function() { return "[APE JavaScript Library]"; }
    };

    function F(){}
    
    var getIdI = 0,
        INSTANCES = "instances",
        PROTOTYPE = "prototype",
        OP = Object[PROTOTYPE], 
        opHap = OP.hasOwnProperty,
        functionToString = Function[PROTOTYPE].toString,
        jscriptSkips = ['toString', 'valueOf'];

    
    /**
     * does <em>not</em> automatically add APE to the front of the chain, as YUI does.
     * @param {String} s the namespace. "foo.bar" would create a namespace foo.bar, but only
     * if that namespace did not exist.
     * @return {Package} the namespace.
     */
    function namespace(s) {
        var packages = s.split("."),
            pkg = self,
            i = 0,
            len = packages.length,
            name;
        for (; i < len; i++) {
            name = packages[i];

            // Internet Explorer does not support
            // hasOwnProperty window (or Host obj), so call Object.prototype.hasOwnProperty.
            // Opera does not support the global object or [[Put]] properly (see below)
            if(!hasOwnProperty(pkg, name)) {
                pkg[name] = new Package((pkg.qualifiedName||"APE")+"."+name);
            }
            pkg = pkg[name];
        }
        return pkg;
    }

    /**
     * Shallow copy of properties; does not look up prototype chain.
     * Copies all properties in s to r, using hasOwnProperty.
     * @param {Object} r the receiver of properties.
     * @param {Object} s the supplier of properties.
     * Accounts for JScript DontEnum bug for valueOf and toString.
     * @return {Object} r the receiver.
     */
    function mixin(r, s) {
        var prop,
            i = 0,
            skipped;
        for(prop in s) {
            if(hasOwnProperty(s, prop)) {
                r[prop] = s[prop];
            }
        }
        // JScript DontEnum bug.
        for( ; i < jscriptSkips.length; i++) {
            skipped = jscriptSkips[i];
            if(hasOwnProperty(s, skipped))
                r[skipped] = s[skipped];
        }
        return r;
    }
    
    /**
     * @memberOf APE
     * @description Prototype inheritance.
     * @param {Object} subclass
     * @param {Object} superclass
     * @param {Object} mixin If present, <var>mixin</var>'s own properties are copied to receiver
     * using APE.mixin(subclass.prototoype, superclass.prototype).
     */
    function extend(subclass, superclass, mixin) {
        F[PROTOTYPE] = superclass[PROTOTYPE];
        var subp = subclass[PROTOTYPE] = new F;
        if(typeof mixin == "object")
            APE.mixin(subp, mixin);
        subp.constructor = subclass;
        return subclass;
    }

    /** Throws the error in a setTimeout 1ms.
     *  Deferred errors are useful for Event Notification systems,
     * Animation, and testing.
     * @param {Error} error that occurred.
     */
    function deferError(error) {
        self.setTimeout(function(){throw error;},1);
    }

    /** Creates a Factory method out of a function.
     * @param {Function} constructor
     * @param {Function} createPrototype function to lazily create the prototype.
     * @memberOf APE
     */
    function createFactory(ctor, createPrototype) {
        return { 
            getById : getById, 
            getByNode : getById
        };
        
        function getById(idEl) {
            var id = (typeof idEl === "string") ? idEl : getId(idEl);
            if(!(INSTANCES in this)) {
                if(typeof createPrototype === "function") {
                    ctor[PROTOTYPE] = createPrototype();
                }
            }
            return getOrCreate.call(this, id, ctor, arguments);
        }
    }
    
   // Not exported----------------------------------
    function getOrCreate(id, ctor, args) {
        // Public instances property, for purge or cleanup.
        if(!hasOwnProperty(this, INSTANCES)) this[INSTANCES] = {};
        return this[INSTANCES][id] || (this[INSTANCES][id] = newApply(ctor, args));
    }
    
    /** 
     * APE.getById
     * @deprecated - use APE.createFactory instead.
     * 
     * Creational method meant for being cross-cut.
     * @param {HTMLElement} el An element that has an id.
     * @return <pre>new this(id [,args...])</pre>
     */
    function getById(id){
        return getOrCreate.call(this, id, this, arguments);
    }
    
    function getId(el) {
        var id = el.id,
            fName;
        if(!id) {
            fName = getFunctionName(this) || "APE";
            id = el.id = fName+"_" + (getIdI++);
        }
        return id;
    }
    
    function getFunctionName(fun) {
        if(typeof fun.name === "string") return fun.name;
        var name = functionToString.call(fun).match(/\s([a-z]+)\(/i);
        return name && name[1]||"";
    }

    /**
     * @param {Function} constructor constructor to be invoked.
     * @param {Array} s arguments to pass to the constructor.
     * Instantiates a constructor and uses apply().
     * @memberOf APE
     */
    function newApply(ctor, args) {
        var i, 
            fp = F[PROTOTYPE] = ctor[PROTOTYPE];// Copy prototype.
        fp.constructor = ctor;
        i = new F;
        ctor.apply(i, args); // Apply the original constructor.
        return i;
    }

    Package[PROTOTYPE].toString = function(){
        return"["+this.qualifiedName+"]";
    };

    function Package(qualifiedName) {
        this.qualifiedName = qualifiedName;
    }
    
    /** Crutches for Safari 2, which does not have native impl.
     * @param {Object} o a Native ECMAScript Object object. 
     * This fails in Safari 2 in one case:
     * function X(){ this.t = 1; }
     * X.prototype.t = 1;
     * hasOwnProperty(new X, "t"); // False in Safari 2.
     */   
    function hasOwnProperty(o, p) { 
        if(p in o) {
            if(opHap) {
                return opHap.call(o, p);
            }
            var xp = o.__proto__;
            if(xp) {
                return !(p in xp) || xp[p] !== o[p];
            }
            return OP[p] !== o[p];
        }  
        return false;
    }

    if(opHap && !opHap.call(self, "Object")) {
        var oldOpHap = opHap;
        /**
         * @overrides Object.prototype.hasOwnProperty
         * This is a conditional patch that affects some versions of Opera.
         * It is perfectly safe to do this and does not affect enumeration.
         */
        opHap = OP.hasOwnProperty = function(p) {
            return (this === self) ? (p in this && this[p] !== OP[p]) : oldOpHap.call(this, p);
        };
    }
})();