/**
 * @requires APE.dom.Viewport
 */
/** @namespace APE.dom */
APE.namespace("APE.dom");

(function() {

    var hasEventTarget = "addEventListener"in this,
        eventTarget = hasEventTarget ? "target" : "srcElement";

    APE.mixin(
        APE.dom.Event = {}, {
            eventTarget : eventTarget,
            getTarget : getTarget, 
            addCallback : addCallback,
            removeCallback : removeCallback,
            preventDefault : preventDefault
    });
    
    function getTarget(e) {
        return (e || event)[eventTarget];
    }

    /**
     * If EventTarget is supported, cb (input param) is returned.
     * Otherwise, a closure is used to wrap a call to the callback
     * in context of o.
     * @param {Object} o the desired would-be EventTarget
     * @param {Function} cb the callback.
     */
    function getBoundCallback(o, cb) {
        return hasEventTarget ? cb : function(ev) {
            cb.call(o, ev);
        };
    }

    /**
     * addEventListener/attachEvent for DOM objects.
     * @param {Object} o host object, Element, Document, Window.
     * @param (string} type
     * @param {Function} cb
     * @return {Function} cb If EventTarget is not supported,
     * a bound callback is created and returned. Otherwise,
     * cb (input param) is returned.
     */
    function addCallback(o, type, cb) {
        if (hasEventTarget) {
            o.addEventListener(type, cb, false);
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
     * @return {Function} bound If EventTarget is not supported,
     * a bound callback is created and returned. Otherwise,
     * cb (input param) is returned.
     */
    function removeCallback(o, type, bound) {
        if (hasEventTarget) {
            o.removeEventListener(type, bound, false);
        } else {
            o.detachEvent("on" + type, bound);
        }
        return bound;
    }

    /**
     * @param {Event}
     */
    function preventDefault(ev) {
        ev = ev || event;
        if(typeof ev.preventDefault == "function") {
            ev.preventDefault();
        } else if('returnValue' in ev) {
            ev.returnValue = false;
        }
    }
})();