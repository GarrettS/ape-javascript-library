APE.namespace("APE.dom").Event = (function() {

    var HAS_EVENT_TARGET = "addEventListener"in this,
        TARGET = HAS_EVENT_TARGET ? "target" : "srcElement",
        FOCUS_DELEGATED = HAS_EVENT_TARGET ? "focus" : "focusin",
        BLUR_DELEGATED = HAS_EVENT_TARGET ? "blur" : "focusout",
        Event = APE.dom.Event,
        Registry = {},
        isMaybeLeak/*@cc_on=(@_jscript_version<5.7)@*/,
        useCaptureMap = {"focus":1, "blur":1}
        mixin = {
            get : get,
            getTarget : getTarget, 
            add : addCallback,
            addCallback : addCallback,
            remove : removeCallback,
            removeCallback : removeCallback,
            preventDefault : preventDefault,
            stopPropagation : stopPropagation
    };
    
    if(isMaybeLeak){
        get(window, "unload").add(cleanUp);
    }
    
    function DomEventPublisher(src, type){
        this.src = src;
        this.type = type;
        this._callStack = [];
    }
    
    DomEventPublisher.prototype = {
        add : function(callback) {
            var o = this.src;
            if (HAS_EVENT_TARGET) {
                o.addEventListener(this.type, callback, this.type in useCaptureMap);
            } else {
                callback = getBoundCallback(o, callback);
                o.attachEvent("on" + this.type, callback);
            }
            this._callStack.push(callback);
            return this;
        },
        
        remove : function(callback) {
            callback = removeFromCallStack(this._callStack, callback);
            if(callback) { // IE TypeMismatch if not a function
                if (HAS_EVENT_TARGET) {
                    this.src.removeEventListener(this.type, callback, this.type in useCaptureMap);
                } else {
                    this.src.detachEvent("on" + this.type, callback);
                }
            }
            return this;
        },
        
        toString : function(){
            return "DomEventPublisher: src: " + this.src + ", type: " + this.type;
        }
    };
    
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
        publisher = new DomEventPublisher(src, sEvent);
        publisherList[len] = publisher;
        return publisher;
    }
    
    function removeFromCallStack(callStack, callback) {
        var cb, i, len;
        for(i = 0, len = callStack.length; i < len; i++) {
            cb = callStack[i];
            if((cb.original || cb) === callback) {
                delete cb.original;
                delete cb.context;
                return callStack.splice(i, 1)[0];
            }
        }
        return null;
    }

    function getTarget(ev) {
        ev = ev || window.event;
        if(!ev) return null;
        
        var t = (ev || window.event)[TARGET];
        if(t && t.nodeName === "#text") {
            // For Safari 2.0, 2.0.4.
            t = t.parentNode;
        }
        return t;
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
        if(o == o.window) return cb; 
        var bound = function(ev) {
            cb.call(bound.context, ev);
        };
        bound.original = cb;
        bound.context = o;
        cb = o = null;
        return bound;
    }
    
    /**
     * addEventListener/attachEvent for DOM objects.
     * @param {Object} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @return {DomEventPublisher} this object.
     */
    function addCallback(o, type, cb) {
        get(o, type).add(cb);
    }

    /**
     * removeEventListener/detachEvent for DOM objects.
     * @param {EventTarget} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @param {boolean} [useCapture] for internal use for delegated focus.
     */
    function removeCallback(o, type, bound, useCapture) {
        var p = get(o, type);
        p.remove(bound);
    }
    
    /** @param {Event} */
    function preventDefault(ev) {
        ev = ev || window.event;
        if("preventDefault" in ev) {
            ev.preventDefault();
        } else if("returnValue" in ev) {
            ev.returnValue = false;
        }
    }
    
    function stopPropagation(ev) {
        if(HAS_EVENT_TARGET) {
            ev.stopPropagation();
        } else {
            (window.event || ev).cancelBubble = true;
        }
    }
    
    function cleanUp(){
        var sEvent, 
            publisherList,
            i, len,
            j, jLen,
            publisher,
            callStack,
            bound;

        for(sEvent in Registry) {
            publisherList = Registry[sEvent];
            for(i = 0, len = publisherList.length; i < len; i++) {
                publisher = publisherList[i];
                // Do not remove any window load listeners on unload;
                // callbacks fire out of order in IE.
                if(publisher.src == publisher.src.window) continue;
                callStack = publisher._callStack;
                for(j = 0, jLen = callstack.length; j < jLen; j++) {
                    bound = callstack[j];
                    publisher.remove(bound);
                }
                delete publisher._callStack;
            }
            delete Registry[sEvent];
        }
        removeCallback(window, "onunload", cleanup);
    }
    
    return mixin;
}());