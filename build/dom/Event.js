/**
 * @requires APE.dom.Viewport
 */
/** @namespace APE.dom */
APE.namespace("APE.dom.Event").mixin(function() {

    var HAS_EVENT_TARGET = "addEventListener"in this,
        TARGET = HAS_EVENT_TARGET ? "target" : "srcElement",
        FOCUS_DELEGATED = HAS_EVENT_TARGET ? "focus" : "focusin",
        BLUR_DELEGATED = HAS_EVENT_TARGET ? "blur" : "focusout";

    return{
            getTarget : getTarget, 
            addCallback : addCallback,
            removeCallback : removeCallback,
            addDelegatedFocus : addDelegatedFocus,
            addDelegatedBlur : addDelegatedBlur,
            removeDelegatedFocus : removeDelegatedFocus,
            removeDelegatedBlur : removeDelegatedBlur,
            preventDefault : preventDefault,
            stopPropagation : stopPropagation
    };
    
    function getTarget(ev) {
        ev = ev || window.event;
        if(!ev) return null;
        
        // Sometimes window.event is null here,
        // as during the Calendar test "onfocusout" 
        // event handler.
        var t = (ev || window.event)[TARGET];
        if(t == null) return null;
        if(t.nodeName === "#text") {
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
        return function(ev) {
            cb.call(o, ev);
        };
    }

    /**
     * addEventListener/attachEvent for DOM objects.
     * @param {Object} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @param {boolean} [useCapture] for internal use for delegated focus.
     * @return {Function} cb If EventTarget is not supported,
     * a bound callback is created and returned. Otherwise,
     * cb (input param) is returned.
     */
    function addCallback(o, type, cb, useCapture) {
        if (HAS_EVENT_TARGET) {
            o.addEventListener(type, cb, !!useCapture);
        } else {
            var bound = getBoundCallback(o, cb);
            o.attachEvent("on" + type, bound);
        }
        return bound||cb;
    }

    /**
     * removeEventListener/detachEvent for DOM objects.
     * @param {EventTarget} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @param {boolean} [useCapture] for internal use for delegated focus.
     * @return {Function} bound If EventTarget is not supported,
     * a bound callback is created and returned. Otherwise,
     * cb (input param) is returned.
     */
    function removeCallback(o, type, bound, useCapture) {
        if (HAS_EVENT_TARGET) {
            o.removeEventListener(type, bound, !!useCapture);
        } else {
            o.detachEvent("on" + type, bound);
        }
        return bound;
    }
    
    function addDelegatedFocus(o, cb){
        return addCallback(o, FOCUS_DELEGATED, cb, true);
    }
     
    function addDelegatedBlur(o, cb){
        return addCallback(o, BLUR_DELEGATED, cb, true);
    }    
    
    function removeDelegatedFocus(o, bound){
        removeCallback(o, FOCUS_DELEGATED, bound, true);
    }
     
    function removeDelegatedBlur(o, bound){
        removeCallback(o, BLUR_DELEGATED, bound, true);
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
}());