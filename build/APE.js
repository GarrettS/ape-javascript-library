/**
 * @fileoverview
 * <code>APE</code> provides core features, including namespacing and object creational aspects.
 *
 * <h3>APE JavaScript Library</h3>
 * <p>
 * Released under FreeBSD license.
 * </p>
 */
(function(){    
    var INSTANCES = "instances",
        PROTOTYPE = "prototype",
        OP = Object[PROTOTYPE], 
        opHap = OP.hasOwnProperty,
        jscriptSkips = ['toString', 'valueOf'];
    
    function F(){}
    
    function createMixin(r, s){
        return mixin.call(r, s);
    }
    
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
            // hasOwnProperty on window (or Host obj). Use internal hasOwnProp.
            // Opera does not support the global object or [[Put]] properly (see below)
            if(!hasOwnProp(pkg, name)) {
                pkg[name] = new Package(pkg, name);
            }
            pkg = pkg[name];
        }
        return pkg;
    }

    /**
     * Shallow copy of properties; does not look up prototype chain.
     * Copies all properties in s to r, using hasOwnProp.
     * @param {Object} s the supplier of properties.
     * Accounts for JScript DontEnum bug for valueOf and toString.
     * @return {Object} r the receiver.
     */
    function mixin(s) {
        if(!s) return;
        var prop,
            i = 0,
            skipped;
        for(prop in s) {
            if(hasOwnProp(s, prop)) {
                this[prop] = s[prop];
            }
        }
        // JScript DontEnum bug.
        for( ; i < jscriptSkips.length; i++) {
            skipped = jscriptSkips[i];
            if(hasOwnProp(s, skipped))
                this[skipped] = s[skipped];
        }
        return this;
    }
    
    /**
     * @memberOf APE
     * @description Prototype inheritance.
     * @param {Object} subclass
     * @param {Object} superclass
     * @param {Object} [mix] If present, <var>mixin</var>'s own properties are copied to receiver
     * using APE.mixin(subclass.prototoype, superclass.prototype).
     */
    function createSubclass(subclass, superclass, mix) {
        F[PROTOTYPE] = superclass[PROTOTYPE];
        var subp = subclass[PROTOTYPE] = new F;
        if(typeof mix == "object")
            createMixin(subp, mix);
        subp.constructor = subclass;
        return subclass;
    }
    
    function Package(base, name) {
        var baseName = base.qualifiedName ? base.qualifiedName + "." : "";
        this.qualifiedName = baseName + name;
    }
    
    Package[PROTOTYPE] = {
        toString : function(){
            return"["+this.qualifiedName+"]";
        },
        
        /** Creates a Factory method and adds it to the Package.
        *  @param {String} name the name of the factory to be created.
        *  @param {Function} getConstructor function that returns constructor
        */
        defineFactory : function(name, getConstructor){
            checkRedundancy(this, name);
            return this[name] = new Factory(name, getConstructor);
        },
        
        /** Creates a Factory method and adds it to the Package.
        *  @param {String} name the name of the factory to be created.
        *  @param {Function} staticInitializer function runs
        *  static initializer code and returns a getConstructor function.
        */
        defineCustomFactory : function(name, staticInitializer) {
            checkRedundancy(this, name);
            return this[name] = new Factory(name, staticInitializer, true);
        },
        
        mixin : mixin
    };
    
    function checkRedundancy(base, name) {
        if(hasOwnProp(base, name)) {
            throw Error(name + " is already defined on " + base);
        }
    }
    
    function Factory(name, getConstructor, hasStaticInitializer){ 
        var i = 0, ctor;
        this.name = name;
        this.getById = this.getByNode = getOrCreate;
        if(hasStaticInitializer) {
            getConstructor = getConstructor(this);
        }
        function getOrCreate(id, config) {
            if(typeof id.id === "string") {
                id = id.id || (id.id = name + i++);
            }
            var instances = this[INSTANCES];
            if(!instances) { // First time.
                instances = this[INSTANCES] = {};
            // Get the constructor.
                ctor = getConstructor(this);
            }
            return instances[id] || (instances[id] = new ctor(id, config));
        }
    }
    
    Factory[PROTOTYPE].toString = function(){ 
        return"Factory "+this.name;
    };

    /** Crutches for Safari 2, which does not have native impl.
     * @param {Object} o a Native ECMAScript Object object. 
     * This fails in Safari 2 in one case:
     * function X(){ this.t = 1; }
     * X.prototype.t = 1;
     * hasOwnProp(new X, "t"); // False in Safari 2.
     */
    function hasOwnProp(o, p) { 
        if(p in o) {
            if(opHap) {
                return opHap.call(o, p);
            }
            var xp = o.__proto__;
            if(xp) {
                return!(p in xp) || xp[p] !== o[p];
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
    
    namespace("APE").mixin({
        /** APE is a global Package with these special methods: */
        namespace : namespace,
        createSubclass : createSubclass,
        createFactory : function(name, getConstructor) {
            return new Factory(name, getConstructor);
        },
        createMixin : createMixin
    });
})();