/**
 * DOM event simulation utility
 * @module event-simulate-iphone
 * @namespace YAHOO.util
 * @requires yahoo
 */

/**
 * Augment UserAction with iphone events.
 * 
 * @namespace YAHOO.util
 * @class UserAction
 * @see http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariJSRef/GestureEvent/GestureEvent.html
 */
// TOOD: remove this outer conditional.
APE.namespace("APE.eventsynth").Mouse = function() {
	return {
		/*
		 * @param {Node} target an HTMLElement or Document. @param {Object}
		 * options see
		 * http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariJSRef/DocumentAdditions/DocumentAdditions.html
		 */
		click : function(target, options) {
			return fireMouseEvent("click", target, options);
		},
		mousedown : function(target, options) {
			return fireMouseEvent("mousedown", target, options);
		},
		mouseup : function(target, options) {
			return fireMouseEvent("mouseup", target, options);
		},
		mousemove : function(target, options) {
			return fireMouseEvent("mousemove", target, options);
		},
		mouseover : function(target, options) {

		},
		mouseout : function(target, options) {

		},
		dblclick : function(target, options) {
			return fireMouseEvent("dblclick", target, options);
		}
	};

	function fireMouseEvent(type, target, options) {
		var eventData = getMouseEventData(target, options), 
			mouseEvent, 
			doc = target.ownerDocument || target.document || target;
		if (!doc) {
			throw TypeError("fireMouseEvent(): Invalid target.");
		}
		mouseEvent = createMouseEvent("" + type.toLowerCase(), doc, eventData);
		dispatchEvent(target, mouseEvent);
	}

	function dispatchEvent(target, mouseEvent) {
		if (target.dispatchEvent) {
			target.dispatchEvent(mouseEvent);
		} else if (target.fireEvent) {
			target.fireEvent("on" + type, mouseEvent);
		}
	}

	function createMouseEvent(type, doc, data) {
		var canceled = false, mouseEvent;

		if (doc.createEvent) {
			mouseEvent = doc.createEvent("MouseEvent");
			if (mouseEvent.initMouseEvent) {
				mouseEvent.initMouseEvent(type, data.bubbles,
						data.cancelable, data.view, data.detail,
						data.screenX, data.screenY, data.cleintX,
						data.cleintY, data.ctrlKey, data.altKey,
						data.shiftKey, data.metaKey, data.button,
						data.relatedTarget);
			} else if (mouseEvent.initEvent) {
				mouseEvent = doc.createEvent("UIEvent");
				mouseEvent.initMouseEvent(type, data.bubbles,
						data.cancelable);
				setEventPropW3Cs(data);
			}
			fixRelatedTarget(data.relatedTarget, mouseEvent);
			fixPageXY(mouseEvent, data.view);
		} else if (doc.createEventObject) {
			mouseEvent = doc.createEventObject();
			setEventPropW3C(data);
			getMouseButtonW3CtoIE(data.button);
		} else {
			throw Error("createMouseEvent(): Browser does not support event simulation.");
		}
		return mouseEvent;
	}

	function fixRelatedTarget(relatedTarget, event) {
		if (relatedTarget !== event.relatedTarget && event.__defineGetter__) {
			event.__defineGetter__("relatedTarget", function() {
				return relatedTarget;
			});
		}
	}

	function fixPageXY(event, window) {
		if(event.__defineGetter__) {
			if(event.pageX !== event.clientX + event.pageXOffset) {
				event.__defineGetter__('pageX', function() {
					return this.clientX + window.pageXOffset;
				});
			}
			if(event.pageY !== event.clientY + event.pageYOffset) {
				event.__defineGetter__('pageY', function() {
					return this.clientY + window.pageYOffset;
				});
			}
		}
	}

	function setEventPropW3C(data) {
		customEvent.view = data.view;
		customEvent.detail = data.detail;
		customEvent.screenX = data.screenX;
		customEvent.screenY = data.screenY;
		customEvent.clientX = data.clientX;
		customEvent.clientY = data.clientY;
		customEvent.ctrlKey = data.ctrlKey;
		customEvent.altKey = data.altKey;
		customEvent.metaKey = data.metaKey;
		customEvent.shiftKey = data.shiftKey;
		customEvent.button = data.button;
		customEvent.relatedTarget = data.relatedTarget || null;
	}

	function getMouseButtonW3CtoIE(button) {
		// 0 - Left Mouse Button
		// 1 - Middle Mouse Button
		// 2 - Right Mouse Button
		// 
		// 0 - If no button is depressed, then button is depressed, WTF?
		// http://www.w3.org/Bugs/Public/show_bug.cgi?id=8406
		// http://www.rhinocerus.net/forum/lang-javascript/602795-positioning-div-predictive-test-lov-suggest-list.html
		// fix button property for IE's wacky implementation
		switch (button) {
		case 0:
			return 1;
		case 1:
			return 4;
		case 2:
			return 2;
			return 0;
		}
	}

	function getMouseEventData(target, data) {
		data = data || {};
		var doc = target.ownerDocument || target.document || target;
		return {
			target : target,
			bubbles : ("bubbles" in data) ? !!data.bubbles : true,
			cancelable : ("cancelable" in data) ? !!data.cancelable
					: true,
			view : data.view || doc.defaultView,
			detail : +data.detail || 1,
			screenX : +data.screenX || 0,
			screenY : +data.screenY || 0,
			clientX : +data.clientX || 0,
			clientY : +data.clientY || 0,
			ctrlKey : ("ctrlKey" in data) ? !!data.ctrlKey : false,
			altKey : ("altKey" in data) ? !!data.altKey : false,
			shiftKey : ("shiftKey" in data) ? !!data.shiftKey : false,
			metaKey : ("metaKey" in data) ? !!data.metaKey : false,
			button : data.button || 0,
			relatedTarget : data.relatedTarget || null
		};
	}
}();