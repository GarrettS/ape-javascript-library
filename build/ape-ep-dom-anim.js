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
        if(typeof s !== "object") return this;
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
})();/** 
 * EventPublisher
 *
 * Released under Academic Free Licence 3.0.
 * @author Garrett Smith
 *
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
(function(){
var APE = self.APE,
   /** Map of [APE.EventPublisher], keyed by type. */
    Registry = {},
    isMaybeLeak/*@cc_on=(@_jscript_version<5.7)@*/;


/**
 * @constructor
 * @description creates an <code>EventPublisher</code> with methods <code>add()</code>,
 * <code>fire</code>, etc.
 * @memberof APE
 */
function EventPublisher(src, type) {
    this.src = src;
    this._callStack = [];
    this.type = type;
}

APE.EventPublisher = APE.createMixin(EventPublisher, {
    
    addCallback : add,
    removeCallback : remove,
    
    get : get,
    add : add,
    remove : remove,
    fire : fire,
    cleanUp : cleanUp,
    prototype : {

    /**  
     *  @param {Function} fp the callback function that gets called when src[sEvent] is called.
     *  @param {Object} thisArg the context that the function executes in.
     *  @return {EventPublisher} this.
     */
        addCallback : function(fp, thisArg) {
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
        removeCallback : function(fp, thisArg) {
            var cs = this._callStack, i, call;
            thisArg = thisArg || this.src;
            for(i = 0; i < cs.length; i++) {
                call = cs[i];
                if(call[0] === fp && call[1] === thisArg) {
                    cs.splice(i, 1);
                }
            }
            return this;
        },

    /**  Removes fp from callstack's beforeFire.
     *  @param {Function} fp the callback function to remove.
     *  @param {Object} [thisArg] the context that the function executes in.
     *  @return {EventPublisher} this.
     */
        removeBefore : function(fp, thisArg) {
            return get(this, "beforeFire").removeCallback(fp, thisArg||this.src);
        },


    /**  Removes fp from callstack's afterFire.
     *  @param {Function} fp the callback function to .
     *  @param {Object} [thisArg] the context that the function executes in.
     *  @return {EventPublisher} this.
     */
        removeAfter : function(fp, thisArg) {
            return get(this, "afterFire").removeCallback(fp, thisArg||this.src);
        },

    /** Fires the event. */
        fire : function(payload) {
            return fire(this)(payload);
        },

    /** helpful debugging info */
        toString : function() {
            return"EventPublisher src=" + this.src + ", type=" + this.type +
                 ", length="+this._callStack.length+"}";
        }
    }
});

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
    return get(src, sEvent).addCallback(fp, thisArg);
}

function remove(src, sEvent, fp, thisArg) {
    return get(src, sEvent).removeCallback(fp, thisArg);
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
            cs = publisher._callStack.slice(), csi;

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
        publisher.addCallback(src[sEvent], src);
    }
    src[sEvent] = fire(publisher);
    publisherList[len] = publisher;
    return publisher;
}

if(isMaybeLeak)
    get( window, "onunload" ).addAfter( cleanUp, EventPublisher );
})();// Cross-frame feature test function that returns an object, 
// constants for currently executing document added to APE.dom.
APE.namespace("APE.dom").getConstants = function(doc) {
    doc = doc || document;
    var od = "ownerDocument",
        docEl = doc.documentElement,
        UNDEFINED = "undefined",
        view = doc.defaultView,
        compatMode = doc.compatMode,
        testStyle,
        testNode = doc.createElement("div"),
        IS_STANDARDS_MODE = compatMode ? compatMode != "BackCompat" :
            ((testStyle = testNode.style).width = "1", !testStyle.width);
        
    return{
        TEXT_CONTENT : typeof docEl.textContent === "string" ? "textContent" : "innerText",
        IS_BODY_ACTING_ROOT : docEl.clientWidth === 0,
        // typeof, not in for BlackBerry9000.
        OWNER_DOCUMENT : docEl && typeof docEl[od] !== UNDEFINED ? od : "document",
        IS_CURRENT_STYLE_SUPPORTED : typeof docEl.currentStyle != UNDEFINED,
        
        IS_COMPUTED_STYLE_SUPPORTED : !!view && view.getComputedStyle != UNDEFINED,

        // TODO: remove deprecated.
        IS_COMPUTED_STYLE : view && view.getComputedStyle != UNDEFINED,

        // IE, Safari, and Opera support clientTop. FF 2 doesn't
        IS_CLIENT_TOP_SUPPORTED : typeof docEl.clientTop != UNDEFINED,
        
        // XML dom is not supported.
        IS_XML_DOM : docEl.tagName === "html",
        IS_QUIRKS_MODE : !IS_STANDARDS_MODE,
        IS_SCROLL_SUPPORTED : typeof testNode.scrollLeft == "number"
    };
};
APE.dom.mixin(APE.dom.getConstants(document));APE.namespace("APE.dom").key = {
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    
    ARROW_KEY_EXP : /^(?:37|38|39|40)$/,
    ENTER : 13,
    TAB : 9,
    ESC : 27
};/**
 * @author Garret Smith
 */
APE.namespace("APE.dom");
(function() {

    var DOCUMENT_ELEMENT = "documentElement", 
        dom = APE.dom;

    // Public exports.
    dom.mixin({
        getScrollOffsets : getScrollOffsets,
        getViewportDimensions : getViewportDimensions
    });

    /** @memberOf APE.dom
     * @name getScrollOffsets
     * @function
     * @return an object with <code>width</code> and <code>height</code>.
     * This will exhibit a bug in Mozilla, which is often 5-7 pixels off.
     */
     function getScrollOffsets(win) {
        win = win || window;
        var f, r;
        if("pageXOffset"in win)
            f = function(win) {
                win = win||window;
                return{ left:win.pageXOffset, top: win.pageYOffset};
            };
        else {
            f = function(win) {
              win = win || window;
              var node = win.document[dom.IS_BODY_ACTING_ROOT ? "body" : DOCUMENT_ELEMENT];
              return{ left : node.scrollLeft, top : node.scrollTop };
            };
        }
        r = (dom.getScrollOffsets = f)(win);
        win = null;
        return r;
    }

    /** @memberOf APE.dom
     * @name getViewportDimensions
     * @function
     * @return an object with <code>width</code> and <code>height</code>.
     */
    function getViewportDimensions(win) {
        win = win || window;
        var baseName = "document",
            nodeName = baseName, 
            d = win[baseName], 
            propPrefix = "client",
            wName, hName, r;

    // Safari 2 uses document.clientWidth (default).
        if(typeof d.clientWidth == "number"){
            baseName = "window";
        }

    // Opera < 9.5, or IE in quirks mode.
        else if(dom.IS_BODY_ACTING_ROOT) {
            baseName = DOCUMENT_ELEMENT;
            nodeName = "body";

    // Modern Webkit, Firefox, IE.
    // Might be undefined. 0 in older mozilla.
        } else if(d[DOCUMENT_ELEMENT].clientHeight > 0){
            nodeName = DOCUMENT_ELEMENT;
        }
        wName = propPrefix + "Width";
        hName = propPrefix + "Height";
        function getViewportDimensions(win){
            var node = (win || window)[baseName][nodeName];
            return{width: node[wName], height: node[hName]};
        }

        r = (dom.getViewportDimensions = getViewportDimensions)(win);
        win = d = null;
        return r;
    }
})();/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */
APE.namespace("APE.dom").getOffsetCoords = function(el, container, coords) {
    
    var dom = APE.dom,
        max = Math.max;
    
    function getOffsetCoords(el, container, coords) {

        var doc = el[dom.OWNER_DOCUMENT],
            documentElement = doc.documentElement,
            body = doc.body;

        if(!container)
            container = doc;

        if(!coords)
            coords = {x:0, y:0};

        coords.x = coords.y = 0;
        if(el === container) {
            return coords;
        }

        // In BackCompat mode, body's border goes to the window. BODY is ICB.
        var rootBorderEl = dom.IS_BODY_ACTING_ROOT ? body : documentElement,
            box = el.getBoundingClientRect(),
            x = box.left + max( documentElement.scrollLeft, body.scrollLeft ),
            y = box.top + max( documentElement.scrollTop, body.scrollTop ),
            bodyCurrentStyle,
            borderTop = rootBorderEl.clientTop,
            borderLeft = rootBorderEl.clientLeft;

        if(dom.IS_CLIENT_TOP_SUPPORTED) {
            x -= borderLeft;
            y -= borderTop;
        }
        if(container !== doc) {
            box = getOffsetCoords(container, null);
            x -= box.x;
            y -= box.y;
            if(dom.IS_CLIENT_TOP_SUPPORTED) {
                if(dom.IS_BODY_ACTING_ROOT && container === body) {
                    x -= borderLeft;
                    y -= borderTop;
                } else if(container !== doc 
                    && container !== documentElement && container !== body) {
                    x -= container.clientLeft;
                    y -= container.clientTop;
                }
            }
        }
        if(dom.IS_BODY_ACTING_ROOT && dom.IS_CURRENT_STYLE_SUPPORTED
            && container != doc && container !== body) {
            bodyCurrentStyle = body.currentStyle;
            x += parseFloat(bodyCurrentStyle.marginLeft)||0 +
                parseFloat(bodyCurrentStyle.left)||0;
            y += parseFloat(bodyCurrentStyle.marginTop)||0 +
                 parseFloat(bodyCurrentStyle.top)||0;
        }
        coords.x = x;
        coords.y = y;

        return coords;
    }
    return(dom.getOffsetCoords = getOffsetCoords)(el, container, coords);
};/**
 * @fileoverview
 * @static
 * @author Garrett Smith
 * APE.dom package functions for calculating element position properties.
 */
/** @name APE.dom */
if(!document.documentElement.getBoundingClientRect && APE.dom.IS_COMPUTED_STYLE_SUPPORTED) {
(function() {
    var dom = APE.dom,
              doc = this.document,
              inited,
              documentElement = doc.documentElement;
        
    dom.getOffsetCoords = getOffsetCoordsFallback;
    var round = Math.round, max = Math.max,
        parseFloat = self.parseFloat,
        GET_COMPUTED_STYLE = "getComputedStyle",
        
    // Load-time constants.            
        TABLE = dom.IS_XML_DOM ? "table" : "TABLE",
    
    // XXX Opera <= 9.2 - parent border widths are included in offsetTop.
        IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET,

    // XXX Opera <= 9.2 - body offsetTop is inherited to children's offsetTop
    // when body position is not static.
    // opera will inherit the offsetTop/offsetLeft of body for relative offsetParents.

        IS_BODY_MARGIN_INHERITED,
        IS_BODY_TOP_INHERITED,
        IS_BODY_OFFSET_EXCLUDING_MARGIN,

    // XXX Mozilla includes a table border in the TD's offsetLeft.
    // There is 1 exception:
    //   When the TR has position: relative and the TD has block level content.
    //   In that case, the TD does not include the TABLE's border in it's offsetLeft.
    // We do not account for this peculiar bug.
        IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET,
        IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH,

        IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED,

        IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING,
        IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD,
        IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD,
        IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN,

        // In Safari 2.0.4, BODY can have offsetTop when offsetParent is null.
        // but offsetParent will be HTML (root) when HTML has position.
        // IS_BODY_OFFSET_TOP_NO_OFFSETPARENT,
        
        relative = "relative",
        borderTopWidth = "borderTopWidth",
        borderLeftWidth = "borderLeftWidth",
        positionedExp = /^(?:r|a)/,
        absoluteExp = /^(?:a|f)/;
        
    // release from closure.
    doc = documentElement = null;    
    
    /**
     * @memberOf APE.dom
     * @param {HTMLElement} el you want coords of.
     * @param {HTMLElement} positionedContainer container to look up to. The container must have
     * position: (relative|absolute|fixed);
     *
     * @param {x:Number, y:Number} coords object to pass in.
     * @return {x:Number, y:Number} coords of el from container.
     *
     * <p>
     *  Passing in re-used coords can improve performance in all browsers.
     *  There is a side effect to passing in coords:
     *  For drag drop operations, reuse coords:
     * </p>
     * <pre>
     * // Update our coords:
     * dom.getOffsetCoords(el, container, this.coords);
     * </pre>
     * Where <code>this.coords = {};</code>
     */
    
    function getOffsetCoordsFallback(el, container, coords) {

        var doc = el[dom.OWNER_DOCUMENT],
            documentElement = doc.documentElement,
            body = doc.body;

        if(!container)
            container = doc;

        if(!coords)
            coords = {x:0, y:0};

        coords.x = coords.y = 0;
        if(el === container) {
            return coords;
        }
    // Crawling up the tree.
        if(!inited) init();
        var offsetLeft = el.offsetLeft,
            offsetTop = el.offsetTop,
            defaultView = doc.defaultView,
            // Blackbery9000 cs is null sometimes. Needs reduction. 
            cs = defaultView[GET_COMPUTED_STYLE](el, '') || el.style;
        
         if(cs.position == "fixed" && dom.IS_SCROLL_SUPPORTED) {
            coords.x = offsetLeft + documentElement.scrollLeft;
            coords.y = offsetTop + documentElement.scrollTop;
            return coords;
        }
        var bcs = defaultView[GET_COMPUTED_STYLE](body,''),
            isBodyStatic = !positionedExp.test(bcs.position),
            lastOffsetParent = el,
            parent = el.parentNode,
            offsetParent = el.offsetParent;

    // Main loop -----------------------------------------------------------------------
        // Loop up, gathering scroll offsets on parentNodes.
        // when we get to a parent that's an offsetParent, update
        // the current offsetParent marker.
        for( ; parent && parent !== container; parent = parent.parentNode) {
            if(parent !== body && parent !== documentElement && dom.IS_SCROLL_SUPPORTED) {
                offsetLeft -= parent.scrollLeft;
                offsetTop -= parent.scrollTop;
            }
            if(parent === offsetParent) {
                // If we get to BODY and have static position, skip it.
                if(parent === body && isBodyStatic);
                else {

                    // XXX Mozilla; Exclude static body; if static, it's offsetTop will be wrong.
                    // Include parent border widths. This matches behavior of clientRect approach.
                    // XXX Opera <= 9.2 includes parent border widths.
                    // See IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET below.
                    if( !IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET &&
                        ! (parent.tagName === TABLE && IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET)) {
                            var pcs = defaultView[GET_COMPUTED_STYLE](parent, "");
                            // Mozilla doesn't support clientTop. Add borderWidth to the sum.
                            offsetLeft += parseFloat(pcs[borderLeftWidth])||0;
                            offsetTop += parseFloat(pcs[borderTopWidth])||0;
                    }
                    if(parent !== body) {
                        offsetLeft += offsetParent.offsetLeft;
                        offsetTop += offsetParent.offsetTop;
                        lastOffsetParent = offsetParent;
                        offsetParent = parent.offsetParent; // next marker to check for offsetParent.
                    }
                }
            }
        }

        //--------Post - loop, body adjustments----------------------------------------------
        // Complications due to CSSOM Views - the browsers try to implement a contradictory
        // spec: http://www.w3.org/TR/cssom-view/#offset-attributes

        // XXX Mozilla, Safari 3, Opera: body margin is never
        // included in body offsetLeft/offsetTop.
        // This is wrong. Body's offsetTop should work like any other element.
        // In Safari 2.0.4, BODY can have offsetParent, and even
        // if it doesn't, it can still have offsetTop.
        // But Safari 2.0.4 doubles offsetTop for relatively positioned elements
        // and this script does not account for that.

        // XXX Mozilla: When body has a border, body's offsetTop === negative borderWidth;
        // Don't use body.offsetTop.
        var bodyOffsetLeft = 0,
            bodyOffsetTop = 0,
            isLastElementAbsolute,
            isLastOffsetElementPositioned,
            isContainerDocOrDocEl = container === doc || container === documentElement,
            dcs,
            lastOffsetPosition;

        // If the lastOffsetParent is document,
        // it is not positioned (and hence, not absolute).
        if(lastOffsetParent != doc) {
            cs = defaultView[GET_COMPUTED_STYLE](lastOffsetParent,'');
            if(cs) {
                lastOffsetPosition = cs.position;
                isLastElementAbsolute = absoluteExp.test(lastOffsetPosition);
                isLastOffsetElementPositioned = isLastElementAbsolute ||
                    positionedExp.test(lastOffsetPosition);
            }
        }

        // do we need to add margin?
        if(
            (lastOffsetParent === el && el.offsetParent === body && !IS_BODY_MARGIN_INHERITED
            && container !== body && !(isBodyStatic && IS_BODY_OFFSET_EXCLUDING_MARGIN))
            || (IS_BODY_MARGIN_INHERITED && lastOffsetParent === el && !isLastOffsetElementPositioned)
            || !isBodyStatic
            && isLastOffsetElementPositioned
            && IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED
            && isContainerDocOrDocEl) {
                bodyOffsetTop += parseFloat(bcs.marginTop)||0;
                bodyOffsetLeft += parseFloat(bcs.marginLeft)||0;
        }

        // Case for padding on documentElement.
        if(container === body) {
            dcs = defaultView[GET_COMPUTED_STYLE](documentElement,'');
            if(
                (!isBodyStatic &&
                    ((IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD && !isLastElementAbsolute)
                    ||
                    (IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD && isLastElementAbsolute))
                )
                || isBodyStatic && IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING
                ) {
                bodyOffsetTop -= parseFloat(dcs.paddingTop)||0;
                bodyOffsetLeft -= parseFloat(dcs.paddingLeft)||0;
            }

            if(IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN){
                if(!isLastOffsetElementPositioned
                    || isLastOffsetElementPositioned && !isBodyStatic)
                bodyOffsetTop -= parseFloat(dcs.marginTop)||0;
                bodyOffsetLeft -= parseFloat(dcs.marginLeft)||0;
            }
        }
        if(isBodyStatic) {
            // XXX Safari subtracts border width of body from element's offsetTop (opera does it, too)
            if(IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH
            // XXX: Safari will use HTML for containing block (CSS),
            // but will subtract the body's border from the body's absolutely positioned
            // child.offsetTop. Safari reports the child's offsetParent is BODY, but
            // doesn't treat it that way (Safari bug).
                || (!isLastElementAbsolute && !IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET
                    && isContainerDocOrDocEl)) {
                       bodyOffsetTop += parseFloat(bcs[borderTopWidth]);
                       bodyOffsetLeft += parseFloat(bcs[borderLeftWidth]);
            }
        }

        // body is positioned, and if it excludes margin,
        // it's probably partly using the AVK-CSSOM disaster.
        else if(IS_BODY_OFFSET_EXCLUDING_MARGIN) {
            if(isContainerDocOrDocEl) {
                if(!IS_BODY_TOP_INHERITED) {

                    // If the body is positioned, add its left and top value.
                     bodyOffsetTop += parseFloat(bcs.top)||0;
                     bodyOffsetLeft += parseFloat(bcs.left)||0;

                    // XXX: Opera normally include the parentBorder in offsetTop.
                    // We have a preventative measure in the loop above.
                    if(isLastElementAbsolute && IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET) {
                        bodyOffsetTop += parseFloat(bcs[borderTopWidth]);
                        bodyOffsetLeft += parseFloat(bcs[borderLeftWidth]);
                    }
                }

                // Padding on documentElement is not included,
                // but in this case, we're searching to documentElement, so we
                // have to add it back in.
                if(container === doc && !isBodyStatic
                    && !IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD) {
                    if(!dcs) dcs = defaultView[GET_COMPUTED_STYLE](documentElement,'');
                    bodyOffsetTop += parseFloat(dcs.paddingTop)||0;
                    bodyOffsetLeft += parseFloat(dcs.paddingLeft)||0;
                }
            }
            else if(IS_BODY_TOP_INHERITED) {
                bodyOffsetTop -= parseFloat(bcs.top);
                bodyOffsetLeft -= parseFloat(bcs.left);
            }
            if(IS_BODY_MARGIN_INHERITED && (!isLastOffsetElementPositioned || container === body)) {
                bodyOffsetTop -= parseFloat(bcs.marginTop)||0;
                bodyOffsetLeft -= parseFloat(bcs.marginLeft)||0;
            }
        }
        coords.x = round(offsetLeft + bodyOffsetLeft);
        coords.y = round(offsetTop + bodyOffsetTop);

        return coords;
    }

// For initializing load time constants.
    function init() {
        inited = true;
        var d = document, body = d.body;
        if(!body) return;
        var marginTop = "marginTop", position = "position", padding = "padding",
            stat = "static",
            border = "border", s = body.style,
            bCssText = s.cssText,
            bv = '1px solid transparent',
            z = "0",
            one = "1px",
            offsetTop = "offsetTop",
            ds = d.documentElement.style,
            dCssText = ds.cssText,
            x = d.createElement('div'),
            xs = x.style,
            table = d.createElement(TABLE);

        s[padding] = s[marginTop] = s.top = z;
        ds.position = stat;

        s[border] = bv;

        xs.margin = z;
        xs[position] = stat;

        // insertBefore - to avoid environment conditions with bottom script
        // where appendChild would fail.
        x = body.insertBefore(x, body.firstChild);
        IS_PARENT_BODY_BORDER_INCLUDED_IN_OFFSET = (x[offsetTop] === 1);

        s[border] = z;

        // Table test.
        table.innerHTML = "<tbody><tr><td>x</td></tr></tbody>";
        table.style[border] = "7px solid";
        table.cellSpacing = table.cellPadding = z;

        body.insertBefore(table, body.firstChild);
        IS_TABLE_BORDER_INCLUDED_IN_TD_OFFSET = table.getElementsByTagName("td")[0].offsetLeft === 7;

        body.removeChild(table);

        // Now add margin to determine if body offsetTop is inherited.
        s[marginTop] = one;
        s[position] = relative;
        IS_BODY_MARGIN_INHERITED = (x[offsetTop] === 1);

        //IS_BODY_OFFSET_TOP_NO_OFFSETPARENT = body.offsetTop && !body.offsetParent;

        IS_BODY_OFFSET_EXCLUDING_MARGIN = body[offsetTop] === 0;
        s[marginTop] = z;
        s.top = one;
        IS_BODY_TOP_INHERITED = x[offsetTop] === 1;

        s.top = z;
        s[marginTop] = one;
        s[position] = xs[position] = relative;
        IS_BODY_OFFSET_IGNORED_WHEN_BODY_RELATIVE_AND_LAST_CHILD_POSITIONED = x[offsetTop] === 0;

        xs[position] = "absolute";
        s[position] = stat;
        if(x.offsetParent === body) {
            s[border] = bv;
            xs.top = "2px";
            // XXX Safari gets offsetParent wrong (says 'body' when body is static,
            // but then positions element from ICB and then subtracts body's clientWidth.
            // Safari is half wrong.
            //
            // XXX Mozilla says body is offsetParent but does NOT subtract EL's offsetLeft/Top.
            // Mozilla is completely wrong.
            IS_STATIC_BODY_OFFSET_PARENT_BUT_ABSOLUTE_CHILD_SUBTRACTS_BODY_BORDER_WIDTH = x[offsetTop] === 1;
            s[border] = z;

            xs[position] = relative;
            ds[padding] = one;
            s[marginTop] = z;

            IS_CONTAINER_BODY_STATIC_INCLUDING_HTML_PADDING = x[offsetTop] === 3;

            // Opera does not respect position: relative on BODY.
            s[position] = relative;
            IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_REL_CHILD = x[offsetTop] === 3;

            xs[position] = "absolute";
            IS_CONTAINER_BODY_RELATIVE_INCLUDING_HTML_PADDING_ABS_CHILD = x[offsetTop] === 3;

            ds[padding] = z;
            ds[marginTop] = one;

            // Opera inherits HTML margin when body is relative and child is relative or absolute.
            IS_CONTAINER_BODY_INCLUDING_HTML_MARGIN = x[offsetTop] === 3;
        }

        // xs.position = "fixed";
        // FIXED_HAS_OFFSETPARENT = x.offsetParent != null;
        body.removeChild(x);
        s.cssText = bCssText||"";
        ds.cssText = dCssText||"";
    }
})();
}/**
 * @fileoverview dom ClassName Functions.
 * @namespace APE.dom
 * @author Garrett Smith
 * <p>
 * ClassName functions are added to APE.dom.
 * </p>
 */

APE.namespace("APE.dom").mixin(function() {
    var Exps = {},
        dom = APE.dom,
        normalizeString,
        hasClass, 
        addClass,
        removeClass,
        toggleClass,
        supportsClassList = document.documentElement.classList != undefined; 

    // Needed also for getElementsByClassName.
    function getTokenizedExp(token, flag){
        var p = token + "$" + flag;
        return Exps[p] || (Exps[p] = RegExp("(?:^|\\s)"+token+"(?:$|\\s)", flag));
    }

    if(!supportsClassList) {
        hasClass = function(el, klass) {
            return getTokenizedExp(klass, "").test(el.className);
        };
        
        addClass = function(el, klass) {
            if(!el.className) el.className = klass;
            else if(!getTokenizedExp(klass).test(el.className)) {
                el.className += " " + klass;
            }  
        };
        
        removeClass = function(el, klass) { 
            var cn = el.className;
            if(cn) {
                el.className = cn === klass ? "" :
                    normalizeString(cn.replace(getTokenizedExp(klass, "g")," "));
            }
        };

        toggleClass = function(el, klass) {
            (hasClass(el, klass) ? removeClass : addClass)(el, klass);
        };

        normalizeString = function(s) { 
            return s.replace(/^\s+|\s+$/g,"").replace(/\s\s+/g, " "); 
        };
    } else {

        /** @param {String} s string to search
         * @param {String} token white-space delimited token the delimiter of the token.
         * This is generally used with element className:
         * @example if(dom.hasToken(el.className, "menu")) // element has class "menu".
         */
        hasClass = function(el, klass) {
            return el.classList.contains(klass);
        };
    
        addClass = function(el, klass) {
            return el.classList.add(klass);
        };

        removeClass = function(el, klass) {
            return el.classList.remove(klass);
        };

        toggleClass = function(el, klass) {
            el.classList.toggle(klass);
        };
    }
    
    /** @param {HTMLElement} el
     * @param {String} tagName tagName to be searched. Use "*" for any tag.
     * @param {String} klass className token(s) to be added.
     * @return {Array|NodeList} Elements with the specified tagName and className.
     * Searches will generally be faster with a smaller HTMLCollection
     * and shorter tree.
     */
    function getElementsByClassName(el, tagName, klass) {
        if(!klass) return [];
        tagName = tagName||"*";
        if(el.getElementsByClassName && (tagName === "*")) {
            return el.getElementsByClassName(klass);
        }
        var exp = getTokenizedExp(klass,""),
            collection = el.getElementsByTagName(tagName),
            ret = [],
            len = ret.length = collection.length,
            counter = 0,
            i;
        
        for(i = 0; i < len; i++){
            if(exp.test(collection[i].className))
                ret[counter++] = collection[i];
        }
        ret.length = counter; // trim array.
        return ret;
    }

   /** Finds an ancestor with specified className
    * @param {Element|Document} [container] where to stop traversing up (optional).
    */
    function findAncestorWithClass(el, klass, container) {
        if(el == null || el === container)
            return null;
        for(var parent = el.parentNode;parent && parent != container && parent.className;){
            if(hasClass(parent, klass)) {
                return parent;
            }
            parent = parent.parentNode;
        }
        return null;
    }
    
    return{
        hasClass : hasClass,
        addClass : addClass,
        removeClass : removeClass,
        toggleClass : toggleClass,
        getElementsByClassName : getElementsByClassName,
        findAncestorWithClass : findAncestorWithClass
    };
}());APE.namespace("APE.dom").mixin(function(){

    var docEl = document.documentElement,
        PARENT_NODE = "parentNode",
        dom = APE.dom,
        caseTransform = dom.IS_XML_DOM ? 'toLowerCase' : 'toUpperCase';

    docEl = null;

    return{
        contains : contains,
        isOrContains : isOrContains,
        findAncestorWithAttribute : findAncestorWithAttribute,
        findAncestorWithTagName : findAncestorWithTagName,
        findNextSiblingElement : findNextSiblingElement,
        findPreviousSiblingElement : findPreviousSiblingElement,
        getChildElements : getChildElements
    };
    
    /** 
     * @memberOf APE.dom
     * @param {HTMLElement} el the potential container.
     * @param {HTMLElement} b the potential containee
     * @param {boolean} [includeEl] if true, and el === b, return true, 
     * otherwise, work like IE's contains (see below). 
     * @return {boolean} true if a contains b and when includeEl
     * Internet Explorer's native contains() will return true for:
     * code body.contains(body); 
     * In Safari <= 3, body.contains(body) returns false.
     */
    function contains(el, b) {
        if(!el) return false;
        var COMPARE_POSITION = "compareDocumentPosition",
            _contains = (COMPARE_POSITION in el) ? 
                function(el, b) {
                    try {
                        return !!(el && b) && ((el[COMPARE_POSITION](b) & 16) !== 0);
                    } catch(mozillaChromeObjectSecurityError_code9) {
                        // Gecko chrome tooltip object triggers a security error.
                        // Sometimes this object is null, others it is an actual
                        // Chrome object, leaked into the dom.
                        // See dom.contains, in traversal-f.js for more info.
                        return false;
                    }
                } : ('contains'in el) ? 
                function(el, b) {
                    return !!el && el !== b && el.contains(b);
                } : function(el, b) {
                    if(!el || !b || el === b) return false;
                    while(el && el !== b && (b = b[PARENT_NODE]) !== null);
                    return el === b;
            };
        return (contains = dom.contains = _contains)(el, b); 
    }

    function isOrContains(el, b) {
        return el === b || dom.contains(el, b);
    }
    
    /** 
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to start from.
     * @param {String} attName the name of the attribute.
     * @param {String} [value] the value of the attribute. If omitted, then only the 
     * presence of attribute is checked and the value is anything.
     * @return {HTMLElement} closest ancestor with <code>attName</code> matching value.
     * Returns null if not found.
     */
    function findAncestorWithAttribute(el, attName, value) {
        for(var att, undef, map, parent = el[PARENT_NODE]; parent !== null;) {
            map = parent.attributes;
            if(!map) {
                return null;
            }
            att = map[attName];
            if(att && att.specified) {
                if(att.value === value || value === undef) {
                    return parent;
                }
            } else if(parent.getAttribute) {
                att = parent.getAttribute(attName, 2);
                if(att === value || value === undef && att !== null) {
                    return parent
                }
            }
            parent = parent[PARENT_NODE];
        }
        return null;
    }

    /** 
     * @param {HTMLElement} el base element to search from
     * @param {string} tag tagName to search for.
     * @param {HTMLElement} [limit] ancestor node to stop traversing before
     * Note: limit node is not included .
     */
    function findAncestorWithTagName(el, tag, limit) {
        tag = tag[caseTransform]();
        limit = limit || null;
        for(var parent = el[PARENT_NODE];parent && parent !== limit; ){
            if( parent.tagName === tag )
                return parent;
            parent = parent[PARENT_NODE];
        }
        return null;
    }

    /** Filter out text nodes and, in IE, comment nodes. */
    function findNextSiblingElement(el) {
        return horizontalTraverse(el, "nextSibling");
    }

    function findPreviousSiblingElement(el) {
        return horizontalTraverse(el, "previousSibling");
    }
    
    function horizontalTraverse(el, sibName) {
        for(var n = el[sibName]; n !== null; n = n[sibName]) {
            if(n.nodeType === 1 && n.tagName !== "!") 
                return n;
        }
        return null;
    }
    
    function getChildElements(el) {
        var i, j, ret = [],
            cn = el.childNodes, len = cn.length, c;
        ret.length = len;
        // IE throws error when calling 
        // Array.prototype.slice.call(el.children).
        // IE also includes comment nodes.
        for(i = j = 0; i < len; i++) {
            c = cn[i];
            if(c.nodeType !== 1 || c.tagName === "!") continue;
            ret[j++] = c;
        }
        ret.length = j;
        return ret;
    }
}());APE.namespace("APE.dom").Event = function(){

    var HAS_EVENT_TARGET = "addEventListener" in this, 
        TARGET = HAS_EVENT_TARGET ? "target" : "srcElement", 
        Event = {
            get : get,
            getTarget : getTarget,
            getRelatedTarget : getRelatedTarget,
            add : addCallback,
            addCallback : addCallback,
            remove : removeCallback,
            removeCallback : removeCallback,
            purgeEvents : purgeEvents,
            preventDefault : preventDefault,
            stopPropagation : stopPropagation,
            toString : function() {
                return"APE.dom.Event";
            }
    };

    /** Gets a DomEventPublisher */
    function get(src, sEvent) {
        // Function rewriting, keeping DomEventPublisher in scope.
        // Event.get is reassigned here and invoked below and the value of
        // that is returned is returned to first caller of this function.
        Event.get = get;

        var FOCUS_DELEGATED = HAS_EVENT_TARGET ? "focus" : "focusin", BLUR_DELEGATED = HAS_EVENT_TARGET ? "blur"
                : "focusout", Registry = {}, isMaybeLeak/* @cc_on=(@_jscript_version<5.7)@ */, useCaptureMap = {
            "focus" : FOCUS_DELEGATED,
            "blur" : BLUR_DELEGATED
        }, cleanUp;

        // Keep this in [[Scope]] of get method, but rewrite get.
        function DomEventPublisher(src, type) {
            if (!src.addEventListener && !src.attachEvent) {
                throw TypeError(src + " is not a compatible object.");
            }
            this.src = src;
            this.type = type;
            this._callStack = [];
        }

        DomEventPublisher.prototype = {
            add : function(callback) {
                DomEventPublisher.prototype.add = add;
                this.add(callback);
                function add(callback) {
                    var o = this.src, captureAdapterType = useCaptureMap[this.type], 
                        type = captureAdapterType || this.type;
                    if (HAS_EVENT_TARGET) {
                        o.addEventListener(type, callback,
                                        !!captureAdapterType);
                    } else {
                        callback = getBoundCallback(o, callback);

                        o.attachEvent("on" + type, callback);
                    }
                    this._callStack.push(callback);
                }
                /**
                 * A closure is used to wrap a call to the callback
                 * in context of o.
                 * @param {Object} o the desired would-be EventTarget
                 * @param {Function} cb the callback.
                 */
                function getBoundCallback(o, cb) {
                    // no binding for window, because: 
                    // 1) context is already global and
                    // 2) removing onunload handlers is skipped (see cleanUp);
                    if (o === window)
                        return cb;
                    function bound(ev) {
                        bound.original.call(bound.context, ev || window.event);
                    }
                    bound.original = cb;
                    bound.context = o;
                    cb = o = null;
                    return bound;
                }
            },

            remove : function(callback) {
                DomEventPublisher.prototype.remove = remove;
                this.remove(callback);
                function remove(callback) {
                    callback = removeFromCallStack(this._callStack, callback);
                    if (callback) { // IE TypeMismatch if not a function
                        if (HAS_EVENT_TARGET) {
                            this.src.removeEventListener(this.type, callback,
                                    this.type in useCaptureMap);
                        } else {
                            this.src.detachEvent("on" + this.type, callback);
                        }
                    }
                }
                function removeFromCallStack(callStack, callback) {
                    var cb, i, len;
                    for (i = 0, len = callStack.length; i < len; i++) {
                        cb = callStack[i];
                        if ((cb.original || cb) === callback) {
                            delete cb.original;
                            delete cb.context;
                            return callStack.splice(i, 1)[0];
                        }
                    }
                    return null;
                }
            },
        
            purge : function() {
                var callStack = this._callStack, cb, i;
                for (i = callStack.length; i-- > 0; callStack.length = i) {
                    cb = callStack[i];
                    this.remove(cb.original || cb);
                }
            },
        
            toString : function() {
                return "DomEventPublisher: src: " + this.src + ", type: " + this.type;
            }
        };

        function get(src, sEvent) {
            var publisherList = Registry[sEvent] || (Registry[sEvent] = []), i, len, publisher;

            for (i = 0, len = publisherList.length; i < len; i++) {
                publisher = publisherList[i];
                if (publisher.src === src) {
                    return publisher;
                }
            }

            // not found.
            publisher = new DomEventPublisher(src, sEvent);
            publisherList[len] = publisher;
            return publisher;
        }

        if (isMaybeLeak) {
            get(window, "unload")
                    .add(
                            cleanUp = function() {
                                var sEvent, publisherList, i, publisher;

                                for (sEvent in Registry) {
                                    publisherList = Registry[sEvent];
                                    for (i = publisherList.length; i-- > 0; publisherList.length = i) {
                                        publisher = publisherList[i];
                                        // Do not remove any window load
                                        // listeners on unload;
                                        // callbacks fire out of order in IE.
                                        if (publisher.src != publisher.src.window) {
                                            publisher.purge();
                                        }
                                    }
                                    delete Registry[sEvent];
                                }
                                removeCallback(window, "unload", cleanUp);
                            });
        }
        return get(src, sEvent);
    }

    function getTarget(ev) {
        return (Event.getTarget = HAS_EVENT_TARGET ? function(ev) {
            return ev && getEventElementProperty(ev, TARGET);
        } : function(ev) {
            ev = window.event;
            return ev && ev.srcElement;
        })(ev);
    }

    function getRelatedTarget(ev) {
        if (!HAS_EVENT_TARGET) {
            var relatedTargetMap = {
                "mouseover" : "fromElement",
                "mouseenter" : "fromElement",
                "mouseout" : "toElement",
                "mouseleave" : "toElement"
            };
            return (Event.getRelatedTarget = function(ev) {
                ev = ev || window.event;
                if (ev) {
                    var name = relatedTargetMap[ev.type], val = getEventElementProperty(
                            ev, name);
                    return val;
                }
            })(ev);
        }
        if (ev) {
            // If relatedTarget is null (sometimes in Mozilla),
            // it is on a "titleTip" window, and probably the one 
            // triggered by the "target".
            // https://developer.mozilla.org/en/DOM/event.relatedTarget
            // 
            // Gecko chrome tooltip objects trigger security errors when 
            // accessing any properties (toString, constructor, nodeName, etc).
            // Sometimes the tooltip results in null relatedTarget, other times 
            // it is a browser chrome object. When it is null, we return the target.
            var relatedTarget = ev.relatedTarget;
            // console.log() won't fire if it is a chrome object, 
            // but we will see a stack trace.
            // if(!relatedTarget) console.log("using target")
            try { 
                relatedTarget.nodeName;
            } catch(mozillaChromeObjectSecurityError_code9) {
            //  console.trace();
            }
            return relatedTarget;
        }
    }

    /** @param {Event} A w3c DOM Event or an IE "window.event". 
     * @param {propertyName} property name to get from the Event.
     */
    function getEventElementProperty(ev, propertyName) {

        var node = ev[propertyName];
        if (node && node.nodeName === "#text") {
            // For Safari 2.0, 2.0.4.
            node = node.parentNode;
        }
        return node;
    }

    /**
     * addEventListener/attachEvent for DOM objects.
     * @param {Object} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @return {DomEventPublisher} this object.
     */
    function addCallback(o, type, cb) {
        Event.get(o, type).add(cb);
    }

    /** Removes all events supplied */
    function purgeEvents(obj, eventList) {
        if (typeof eventList == "string") {
            Event.get(obj, eventList).purge();
        } else {
            for ( var i = 0, len = eventList.length; i < len; i++) {
                Event.get(obj, eventList[i]).purge();
            }
        }
    }

    /**
     * removeEventListener/detachEvent for DOM objects.
     * @param {EventTarget} o host object, Element, Document, Window.
     * @param (string} type event type (no "on" prefix here).
     * @param {Function} cb function to remove.
     * @param {boolean} [useCapture] for internal use for delegated focus.
     */
    function removeCallback(o, type, cb, useCapture) {
        Event.get(o, type).remove(cb);
    }

    /** @param {Event} */
    function preventDefault(ev) {
        ev = ev || window.event;
        if ("preventDefault" in ev) {
            ev.preventDefault();
        } else if ("returnValue" in ev) {
            ev.returnValue = false;
        }
    }

    function stopPropagation(ev) {
        if (HAS_EVENT_TARGET) {
            ev.stopPropagation();
        } else {
            (window.event || ev).cancelBubble = true;
        }
    }
    return Event;
}();/** @requires viewport-f.js (for scrollOffsets in IE). */
APE.dom.Event.getCoords = function(ev) {
    var dom = APE.dom, getCoords, result;
    if ("pageX" in ev) {
        getCoords = function(ev) {
            return{
                x : ev.pageX,
                y : ev.pageY
            };
        };
    } else {
        getCoords = function(ev) {
            var scrollOffsets = dom.getScrollOffsets(); 
            ev = ev || window.event;
            return{
                x : ev.clientX + scrollOffsets.left,
                y : ev.clientY + scrollOffsets.top
            };
        };
    }
    result = (dom.Event.getCoords = getCoords)(ev);
    ev = null;
    return result;
};/** @fileoverview
 * Getting computed styles, opacity functions.
 *
 * @author Garrett Smith
 * @requires dom constants - constants.js
 */
/**@name APE.dom 
 * @namespace*/
APE.namespace("APE.dom");
(function(){

    var dom = APE.dom,
        IS_COMPUTED_STYLE = dom.IS_COMPUTED_STYLE_SUPPORTED,
        CURRENT_STYLE = "currentStyle",
        OPACITY = "opacity",
        STYLE = "style",
        PX = "px",
        FILTER = "filter",
        alphaString = "alpha("+OPACITY+"=",
        multiLengthPropExp = /^(?:margin|(border)(Width|Color|Style)|padding)$/,
        alphaOpExp = /\Wopacity\s*=\s*([\d]+)/i,
        autoPercentExp = /^auto|\d%$/,
        floatProp = "cssFloat",
        props = ["Top", "Right", "Bottom", "Left"];
    if(!(floatProp in document.documentElement[STYLE])) {
        floatProp = "styleFloat";
    }
    
    /** 
     * Special method for a browser that supports el.filters and not style.opacity.
     * @memberOf APE.dom
     * @param {currentStyle} cs an IE currentStyle to find opacity on.
     * @return {ufloat} [0-1] amount of opacity.
     * calling this method on a browser that does not support filters
     * results in 1 being returned.  Use dom.getStyle or dom.getCascadedStyle instead
     */
    function getFilterOpacity(cs) {
        var o, f = cs[FILTER];
        if(!alphaOpExp.test(f)) return 1;
        o = alphaOpExp.exec(f);
        return o[1]/100;
    }
    
    /** 
     * Cross-browser adapter method for style.filters vs style.opacity.
     * @memberOf APE.dom
     * @param {HTMLElement} el the element to set opacity on.
     * @param {ufloat} i [0-1] the amount of opacity.
     * @return {ufloat} [0-1] amount of opacity.
     */
    function setOpacity(el, i) {
        var s = el[STYLE], cs;
        if(OPACITY in s) {
            s[OPACITY] = i;
        } else if(FILTER in s) {
            s[FILTER] = alphaString + (i * 100) + ")";
            cs = el[CURRENT_STYLE];
            if(cs && !cs.hasLayout) {
                s.zoom = 1;
            }
        }
    }

    /** 
     * @memberOf APE.dom
     * @name getStyle
     * 
     * @function
     * @description returns the computed style of property <code>p</code> of <code>el</code>.
     * Returns different results in IE, so user beware! If your 
     * styleSheet has units like "em" or "in", this method does 
     * not attempt to convert those to px.
     *
     * Use "cssFloat" for getting an element's float and special 
     * "filters" treatment for "opacity".
     * 
     * @param {HTMLElement} el the element to set opacity on.
     * @param {String} p the property to retrieve.
     * @return {String} the computed style value or the empty string if no value was found.
     */
    function getStyle(el, p) {
        var value = "", cs, matches, splitVal, i, len, 
        doc = el[dom.OWNER_DOCUMENT];
        
        if(/float/.test(p)) {
            p = floatProp;
        }
        if(IS_COMPUTED_STYLE) {
            cs = doc.defaultView.getComputedStyle(el, "");

            if(!(p in cs))return"";
            value = cs[p];
            if(value === "") {
                // would try to get a rect, but Webkit doesn't support that.
                value = tryGetShorthandValues(cs, p).join(" ");
            } 
            // Special case Safari 2.
            if(p == "zIndex" && value == "normal") return "0";
            if(autoPercentExp.test(value)) {
                value = getCurrentStyleValueFromAutoOrPercent(el, p);
            } 
        } else {
            cs = el[CURRENT_STYLE];
            if(p === OPACITY) {
                value = getFilterOpacity(cs);
            } else {
                value = cs[p];
                if(autoPercentExp.test(value)) {
                    value = getCurrentStyleValueFromAutoOrPercent(el, p);
                } else if(!(p in cs)) {
                    return"";
                }
            }
            matches = nonPixelExp.exec(value);
            if(matches) {
                splitVal = value.split(" ");
                splitVal[0] = convertNonPixelToPixel( el, matches[0]);
                for(i = 1, len = splitVal.length; i < len; i++) {
                    matches = nonPixelExp.exec(splitVal[i]);
                    splitVal[i] = convertNonPixelToPixel( el, matches[0]);
                }
                value = splitVal.join(" ");
            }
        }
        return value;
    }
    
    function getCurrentStyleValueFromAutoOrPercent(el, p) {
        var s = el[STYLE], v, pp, borderWidth, 
            clientTop, clientLeft, paddingWidth;
        if(/^(?:width|height|top|left)$/.test(p) && typeof s.pixelWidth != "undefined") {
            pp = "pixel" + (p.charAt(0).toUpperCase()) + p.substring(1);
            v = s[pp];
        }
        if(v) {
            return v + PX;
        }
        if(p === "width") {
            clientLeft = el.clientLeft||0;
            borderWidth = parseFloat(getStyle(el, "borderRightWidth"))||clientLeft;
            paddingWidth = parseFloat(getStyle(el, "paddingLeft"))||0
                + parseFloat(getStyle(el, "paddingRight"))||0;

            return el.offsetWidth - clientLeft - borderWidth - paddingWidth + PX;
        } else if(p === "height") {
            clientTop = el.clientTop||0;
            borderWidth = parseFloat(getStyle(el, "borderBottomWidth"))||clientTop;
            paddingWidth = parseFloat(getStyle(el, "paddingTop"))||0
                + parseFloat(getStyle(el, "paddingBottom"))||0;
            return el.offsetHeight - clientTop - borderWidth + PX;
        } else if(p === "margin" && el[CURRENT_STYLE].position != "absolute") {
            v = parseFloat(getStyle(el.parentNode, 'width')) - el.offsetWidth;
            if(v === 0) return"0px";
            v = "0px " + v;
            return v + " " + v;
        }
        // Could be zIndex.
        return "0";
        // Can't get borderWidth because we only have clientTop and clientLeft.
    }

    // TODO: Consider removing this; "don't do that."
    /** 
     * Tries to get a shorthand value for margin|padding|borderWidth. 
     * @return  {[string]} Either 4 values or, if all four values are equal,
     * then one collapsed value (in an array).
     */
    function tryGetShorthandValues(cs, p) {
        var multiMatch = multiLengthPropExp.exec(p),
            prefix, suffix, 
            prevValue, nextValue, 
            values,
            allEqual = true, 
            propertyList,
            i = 1;
        
        if(multiMatch && multiMatch[0]) {
            propertyList = props;
            prefix = multiMatch[1]||multiMatch[0];
            suffix = multiMatch[2] || ""; // ["borderWidth", "border", "Width"]
        } else return [""];

        prevValue = cs[prefix + propertyList[0] + suffix ];
        values = [prevValue];

        while(i < 4) {
            nextValue = cs[prefix + propertyList[i] + suffix];
            allEqual = allEqual && nextValue == prevValue;
            prevValue = nextValue;
            values[i++] = nextValue;
        }
        if(allEqual)
            return [prevValue];
        return values;
    }

    var nonPixelExp = /(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;
    /**
     * @param {HTMLElement} el
     * @param {String} val 
     */
    function convertNonPixelToPixel(el, val) {
        
        if(el.runtimeStyle) {

            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels.

            if(parseFloat(val) === 0) {
                return"0px";
            }
            var s = el[STYLE],
                sLeft = s.left,
                rs = el.runtimeStyle,
                rsLeft = rs.left;
            rs.left = el[CURRENT_STYLE].left;
            s.left = (val || 0);

            // The element does not need to have position: to get values.
            // IE's math is a little off with converting em to px; IE rounds to 
            // the nearest pixel.
            val = s.pixelLeft + PX;

            // put it back.
            s.left = sLeft;
            rs.left = rsLeft;
            return val;
        }
    }
    dom.getStyle = getStyle;
    dom.setOpacity = setOpacity;
})();/**
 * @requires APE.dom.style-f.js
 */
APE.dom.getPixelCoords = function(el) {
    var ret, dom = APE.dom, 
        getStyle = dom.getStyle,
        parseInt = self.parseInt,
        f = (dom.IS_COMPUTED_STYLE_SUPPORTED ? function(el) {
        var cs = el[dom.OWNER_DOCUMENT].defaultView.getComputedStyle(el, "");
        return{
            x : parseInt(cs.left, 10)||0,
            y : parseInt(cs.top, 10)||0
        };
    } : function(el, getStyle){
        var style = el.style;
        return{
            // pixelLeft, in IE returns 0 when the element does not have 
            // left: in the style attribute, so if that fails, try to read 
            // the style using dom.getStyle.
            x : style.pixelLeft || parseInt(getStyle(el,"left"), 10)||0,
            y : style.pixelTop || parseInt(getStyle(el,"top"), 10)||0
        };
    });
    ret = (dom.getPixelCoords = f)(el, getStyle);
    el = null;
    return ret;
};/**  @fileoverview anim package: Animation, Transitions, and Manager (private)
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
         * @description If an error occurred, `onerror` throws the error. this can
         *              be overridden (shadowed) by adding an onerror() to the
         *              Animation instance.
         * 
         * @example
         * 
         * <pre>
         * APE.EventRegistry.add(myAnim, &quot;onerror&quot;, myErrorHandler);
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
        onerror : function(ex) {
	        setTimeout(function(){ throw ex; }, 1);
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
                clearTimeout(anim.startAfterTimer);
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

        /** Aborts the anim where it is, does not call onend(). If error was passed in, it is rethrown.*/
        abort : function(ex) {
            Manager.unregister(this);
			clearTimeout(this.startAfterTimer);
            delete this.startAfterTimer;
			if(ex) this.onerror(ex);
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
                stop();
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
            clearInterval(intervalId);
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
        this.startCssText = document.getElementById(id).style.cssText;
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
    
        reset : function() {
            // `this.style` is set to null in _end.'
            // If the transition already ended, we must call gEBI.
            (this.style || document.getElementById(this.id).style).cssText = this.startCssText;
            ap.reset.call(this);
        },
        
        /** @private */
        init : function(styleObject) {
            var el = document.getElementById(this.id), adapters = [], adapter, 
                prop, toValue, 
                style = el[STYLE],
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
            this.endCssText = setEndStyle(el, styleObject);
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
            style.cssText = this.startCssText;
    
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
        var prop, toValue, style = el[STYLE], cssText;
        for(prop in styleObject) {
            toValue = styleObject[prop];
            if(prop === OPACITY) {
                dom.setOpacity(el, toValue);
            } else {
                style[prop] = toValue;
            }
        }
        cssText = el.style.cssText;
        // Override visibility and display so we can 
        // calculate real values.
        style.visibility = "visible";
        style.display = "block";
        return cssText;              
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