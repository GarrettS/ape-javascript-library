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
(function(){

    function F(){}
    
    var getIdI = 0,
        PROTOTYPE = "prototype",
        OP = Object[PROTOTYPE], 
        HAS_OWN_PROPERTY = "hasOwnProperty",
        INSTANCES = "instances",
        OP = Object.prototype,
        oHap = OP[HAS_OWN_PROPERTY],
        hasOwnProperty = oHap;

    if(typeof APE !== "undefined") throw Error("APE is already defined.");
    self.APE = {
    
        namespace : namespace,
        /**
         * @memberOf APE
         * @description Prototype inheritance.
         * @param {Object} subclass
         * @param {Object} superclass
         * @param {Object} mixin If present, <var>mixin</var>'s own properties are copied to receiver
         * using APE.mixin(subclass.prototoype, superclass.prototype).
         */
        extend : function(subclass, superclass, mixin) {
            var subp;
            F[PROTOTYPE] = superclass[PROTOTYPE];
            subclass[PROTOTYPE] = subp = new F;
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
                if(s[HAS_OWN_PROPERTY](prop))
                    r[prop] = s[prop];
            }
            // JScript DontEnum bug.
            for( ; i < jscriptSkips.length; i++) {
                skipped = jscriptSkips[i];
                if(s[HAS_OWN_PROPERTY](skipped))
                    r[skipped] = s[skipped];
            }
            return r;
        },
    
        createFactory : createFactory,
    
        getById : getById,    
        /** Throws the error in a setTimeout 1ms.
         *  Deferred errors are useful for Event Notification systems,
         * Animation, and testing.
         * @param {Error} error that occurred.
         */
        deferError : function(error) {
            setTimeout(function(){throw error;},1);
        },
        
        toString : function() { return "[APE JavaScript Library]"; }
    };

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
    
    function getOrCreate(id, ctor, args) {
        // Public instances property, for purge or cleanup.
        if(!this[HAS_OWN_PROPERTY](INSTANCES)) this[INSTANCES] = {};
        return this[INSTANCES][id] || (this[INSTANCES][id] = newApply(ctor, args));
    }
    
    /** 
     * APE.getById
     * @deprecated - use APE.createFactory instead.
     * 
     * Creational method meant for being cross-cut.
     * @param {HTMLElement} el An element that has an id.
     * @requires {Object} an object to bind to.
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
        var name = Function[PROTOTYPE].toString.call(fun).match(/\s([a-z]+)\(/i);
        return name && name[1]||"";
    }

    /**
     * @param {Function} constructor constructor to be invoked.
     * @param {Array} s arguments to pass to the constructor.
     * Instantiates a constructor and uses apply().
     * @memberOf APE
     */
    function newApply(constructor, args) {
        F[PROTOTYPE] = constructor[PROTOTYPE];// Copy prototype.
        F[PROTOTYPE].constructor = constructor;
        var i = new F;
        constructor.apply(i, args); // Apply the original constructor.
        return i;
    }

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
            pkg = self,
            qName = pkg.qualifiedName,
            i = 0,
            len = packages.length,
            name;
        for (; i < len; i++) {
            name = packages[i];

            // Internet Explorer does not support
            // hasOwnProperty window (or Host obj), so call Object.prototype.hasOwnProperty.
            // Opera does not support the global object or [[Put]] properly (see below)
            if(!hasOwnProperty.call(pkg, name)) {
                pkg[name] = new Package((qName||"APE")+"."+name);
            }
            pkg = pkg[name];
        }
        return pkg;
    }

    Package[PROTOTYPE].toString = function(){
        return"["+this.qualifiedName+"]";
    };

    /* constructor Package
     */
    function Package(qualifiedName) {
        this.qualifiedName = qualifiedName;
    }
    
            
    if(hasOwnProperty && !hasOwnProperty.call(self, "Object")) {
        /**
         * @overrides Object.prototype.hasOwnProperty
         * @method
         * This is a conditional patch that affects some versions of Opera.
         * It is perfectly safe to do this and does not affect enumeration.
         */
        hasOwnProperty = OP[HAS_OWN_PROPERTY] = function(p) {
            if(this === self) return (p in this) && (OP[p] !== this[p]);
            return oHap.call(this, p);
        };
    }
})();