APE.namespace("APE.dom").Event = (function() {

    var HAS_EVENT_TARGET = "addEventListener"in this,
        TARGET = HAS_EVENT_TARGET ? "target" : "srcElement",
        FOCUS_DELEGATED = HAS_EVENT_TARGET ? "focus" : "focusin",
        BLUR_DELEGATED = HAS_EVENT_TARGET ? "blur" : "focusout",
        Registry = {},
        isMaybeLeak/*@cc_on=(@_jscript_version<5.7)@*/,
        useCaptureMap = {"focus":FOCUS_DELEGATED, "blur":BLUR_DELEGATED},
        Event = {
            get : get,
            getTarget : getTarget, 
            add : addCallback,
            addCallback : addCallback,
            remove : removeCallback,
            removeCallback : removeCallback,
            preventDefault : preventDefault,
            stopPropagation : stopPropagation,
            toString : function() {
                return"APE.dom.Event";
            }
    };
    
    /** Gets a DomEventPublisher */
    function get(src, sEvent) {
        // Function rewriting, keeping DomEventPublisher in scope.
        // function _get is reassinged, invoked below. 
        get = Event.get = _get;
        
        // Keep this in [[Scope]] of get method, but rewrite get.
        function DomEventPublisher(src, type) {
            if(!src.addEventListener && !src.attachEvent) {
                throw TypeError(src+ " is not a compatible object.");
            }
            this.src = src;
            this.type = type;
            this._callStack = [];
        }
        
        DomEventPublisher.prototype = {
            add : function(callback) {
                this.add = add;
                return this.add(callback);
                function add(callback) {
                    var o = this.src,
                        captureAdapterType = useCaptureMap[this.type],
                        type = captureAdapterType||this.type;
                    if (HAS_EVENT_TARGET) {
                        o.addEventListener(type, callback, !!captureAdapterType);
                    } else {
                        callback = getBoundCallback(o, callback);
        
                        o.attachEvent("on" + type, callback);
                    }
                    this._callStack.push(callback);
                    return this;   
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
                   if(o === window) return cb;
                   function bound(ev) {
                       bound.original.call(bound.context, ev);
                   }
                   bound.original = cb;
                   bound.context = o;
                   cb = o = null;
                   return bound;
               }
            },
            
            remove : function(callback) {
                this.remove = remove;
                this.remove(callback);
                function remove(callback) {
                    callback = removeFromCallStack(this._callStack, callback);
                    if(callback) { // IE TypeMismatch if not a function
                        if (HAS_EVENT_TARGET) {
                            this.src.removeEventListener(this.type, callback, this.type in useCaptureMap);
                        } else {
                            this.src.detachEvent("on" + this.type, callback);
                        }
                    }
                    return this;
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
            },
            
            toString : function(){
                return "DomEventPublisher: src: " + this.src + ", type: " + this.type;
            }
        };
        
        function _get(src, sEvent) {
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
            
            if(isMaybeLeak){
                get(window, "unload").add(cleanUp);
                isMaybeLeak = false;
            }
            
            return publisher;
        }
        return get(src, sEvent);
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
    
    function cleanUp() {
        var sEvent, 
            publisherList,
            i,
            publisher;

        for(sEvent in Registry) {
            publisherList = Registry[sEvent];
            for(i = publisherList.length; i-- ;publisherList.length = i) {
                publisher = publisherList[i];
                // Do not remove any window load listeners on unload;
                // callbacks fire out of order in IE.
                if(publisher.src != publisher.src.window) {
                    unbindCallstack(publisher);
                }
            }
            delete Registry[sEvent];
        }
        removeCallback(window, "onunload", cleanUp);
        
        function unbindCallstack(publisher) {
            var callStack = publisher._callStack, i, len, bound;
            for(i = 0, len = callStack.length; i < len; i++) {
                bound = callStack[i];
                publisher.remove(bound);
            }
            delete publisher._callStack;
        }
    }
    return Event;
})();