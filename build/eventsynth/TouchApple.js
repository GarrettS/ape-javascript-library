/**
 * DOM event simulation utility
 * @module event-simulate-iphone
 * @namespace YAHOO.util
 * @requires yahoo
 */

/**
 * Augment UserAction with iphone events.
 * @namespace YAHOO.util
 * @class UserAction
 * @see http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariJSRef/GestureEvent/GestureEvent.html
 */
if(typeof document.createTouchList !== "undefined") {
	APE.namespace("APE.eventsynth").TouchApple = function() {
        return {
            /* @param {Node} target an HTMLElement or Document.
             * @param {Object} options see 
             * http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariJSRef/DocumentAdditions/DocumentAdditions.html 
             */
            touchstart : function(target, options) {
                return fireTouchEvent("touchstart", target, options);
            },
            touchmove : function(target, options) {
                return fireTouchEvent("touchmove", target, options);
            },
            touchend : function(target, options) {
                return fireTouchEvent("touchend", target, options);
            },
            touchcancel : function(target, options) {
                return fireTouchEvent("touchcancel", target, options);
            }
        };
        
        // Private static methods.
        function createTouchList(touchObjectDataArray) {
            var i, 
                len = touchObjectDataArray.length,
                doc,
                target,
                touch,
                touches = [],
                touchList;
            if(!len) {
                if("target" in touchObjectDataArray) {
                    target = touchObjectDataArray.target;
                    touchObjectDataArray = [touchObjectDataArray];
                    len = 1;
                } else {
                    throw TypeError("createTouchList called with incompatible argument.");
                }
            }
            for(i = 0; i < len; i++) {
                touchObjectData = touchObjectDataArray[i];
                target = touchObjectData.target;
                doc = target.ownerDocument || target.document || target;
                touch = doc.createTouch(
                        doc.defaultView,
                        target,
                        touchObjectData.identifier||0,
                        touchObjectData.pageX||0,
                        touchObjectData.pageY||0,
                        touchObjectData.screenX||0,
                        touchObjectData.screenY||0);
                touches.push(touch);
            }

            // Invoke document.createTouchList [[Call]] indirectly ("Host" object).
            var fnApply = simulateTouchEvent.apply;
            touchList = fnApply.apply(doc.createTouchList, [doc, touches]);
            return touchList;
        }
    
        function fireTouchEvent(type, target, options){
            var c = new TouchEventData(target, options),
                doc = target.ownerDocument || target.document || target;
            //setup default values.

            if (!doc || !doc.createTouch) {
                throw TypeError("simulateTouchEvent(): Invalid target.");
            }

            return simulateTouchEvent(doc,
                    target, type, c.bubbles, c.cancelable, c.view,
                    c.detail,  // Not sure what this does in "touch" event.
                    c.screenX, c.screenY, c.pageX, c.pageY,
                    c.ctrlKey, c.altKey, c.shiftKey, c.metaKey,
                    c.touches, c.targetTouches, c.changedTouches, c.scale, c.rotation);
        }
        
        function simulateTouchEvent(doc, target, type, bubbles, cancelable, view,
                detail, screenX, screenY, pageX, pageY, ctrlKey, altKey,
                shiftKey, metaKey, touches, targetTouches, changedTouches,
                                                            scale, rotation) {
            var canceled = false, touchEvent;

            // check event type
            type = "" + type.toLowerCase();

            touchEvent = doc.createEvent("TouchEvent");
            if (typeof touchEvent.initTouchEvent == "function") {
                touchEvent.initTouchEvent(type, bubbles, cancelable, view,
                        detail, screenX, screenY, pageX, pageY, ctrlKey,
                        altKey, shiftKey, metaKey, touches, targetTouches,
                        changedTouches, scale, rotation);
                // fire the event
                canceled = target.dispatchEvent(touchEvent);
            }
            return canceled;
        }
        
        function TouchEventData(target, options) {
            options = options || {};
            var doc = target.ownerDocument || target.document || target;
            return {
	            target : target,
	            bubbles : ("bubbles" in options) ? !!options.bubbles : true,
	            cancelable : ("cancelable" in options) ? !!options.cancelable : true,
	            view : options.view||doc.defaultView,
	            detail : +options.detail||1,  // Not sure what this does in "touch" event.
	            screenX : +options.screenX||0,
	            screenY : +options.screenY||0,
	            pageX : +options.pageX||0,
	            pageY : +options.pageY||0,
	            ctrlKey : ("ctrlKey" in options) ? !!options.ctrlKey : false,
	            altKey : ("altKey" in options) ? !!options.altKey : false,
	            shiftKey : ("shiftKey" in options) ? !!options.shiftKey : false,
	            metaKey : ("metaKey" in options) ? !!options.metaKey : false,
	            scale : +options.scale||1,
	            rotation : +options.rotation||0,
	            touches : createTouchList(options.touches||options),
	            targetTouches : createTouchList(options.targetTouches||options),
	            changedTouches : createTouchList(options.changedTouches||options)
            };
        }
    };
}