APE.namespace("APE.dom").DomEvent = function(){

    var HAS_EVENT_TARGET = "addEventListener" in this, 
        TARGET = HAS_EVENT_TARGET ? "target" : "srcElement", 
        DomEvent = {
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
                return"APE.dom.DomEvent";
            }
    };

    /** Gets a DomEventPublisher */
    function get(src, sEvent) {
        // Function rewriting, keeping DomEventPublisher in scope.
        // DomEvent.get is reassigned here and invoked below and the value of
        // that is returned is returned to first caller of this function.
        DomEvent.get = get;

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
						// ev = getAdaptedEvent(ev);
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
        return (DomEvent.getTarget = HAS_EVENT_TARGET ? function(ev) {
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
            return (DomEvent.getRelatedTarget = function(ev) {
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
        DomEvent.get(o, type).add(cb);
    }

    /** Removes all events supplied */
    function purgeEvents(obj, eventList) {
        if (typeof eventList == "string") {
            DomEvent.get(obj, eventList).purge();
        } else {
            for ( var i = 0, len = eventList.length; i < len; i++) {
                DomEvent.get(obj, eventList[i]).purge();
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
        DomEvent.get(o, type).remove(cb);
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
}();