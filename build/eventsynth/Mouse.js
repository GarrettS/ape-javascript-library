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
            return fireMouseEvent("mouseover", target, options);
            // if target does not contain options.relatedTarget, fire mouseenter
        },
        mouseout : function(target, options) {
            return fireMouseEvent("mouseout", target, options);
            // if target does not contain options.relatedTarget, fire mouseenter
        },
        dblclick : function(target, options) {
            return fireMouseEvent("dblclick", target, options);
        }
    };

    function fireMouseEvent(type, target, options) {
        var eventData = getMouseEventData(target, type, options), mouseEvent, doc = target.ownerDocument
                || target.document || target;
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
            target.fireEvent("on" + mouseEvent.type, mouseEvent);
        }
    }

    function createMouseEvent(type, doc, data) {
        var mouseEvent;

        if (doc.createEvent) {
            mouseEvent = doc.createEvent("MouseEvent");
            if (mouseEvent.initMouseEvent) {
                mouseEvent.initMouseEvent(type, data.bubbles, data.cancelable,
                        data.view, data.detail, data.screenX, data.screenY,
                        data.clientX, data.clientY, data.ctrlKey, data.altKey,
                        data.shiftKey, data.metaKey, data.button,
                        data.relatedTarget);
            } else if (mouseEvent.initEvent) {
                mouseEvent = doc.createEvent("UIEvent");
                mouseEvent.initMouseEvent(type, data.bubbles, data.cancelable);
                setEventPropW3C(mouseEvent, data);
            }
            fixRelatedTarget(mouseEvent, data.relatedTarget);
            fixPageXY(mouseEvent, data.view);
        } else if (doc.createEventObject) {
            mouseEvent = doc.createEventObject();
            setEventPropsIE(mouseEvent, data);
        } else {
            throw Error("createMouseEvent(): Browser does not support event simulation.");
        }
        return mouseEvent;
    }

    function fixRelatedTarget(mouseEvent, relatedTarget) {
        if (relatedTarget !== mouseEvent.relatedTarget
                && mouseEvent.__defineGetter__) {
            mouseEvent.__defineGetter__("relatedTarget", function() {
                return relatedTarget;
            });
        }
    }

    function fixPageXY(event, window) {
        if (typeof event.pageX !== "number") {
            return;
        }
        var offsets = getScrollOffsets(window),
            pageXExpected = event.clientX + offsets.x, 
            pageYExpected = event.clientY + offsets.y,
            pageXWrong = event.pageX !== pageXExpected,
            pageYWrong = event.pageY !== pageYExpected;
        
        if (pageXWrong || pageYWrong) {
            if (event.__defineGetter__) {
                if (pageXWrong) {
                    event.__defineGetter__('pageX', function() {
                        return pageXExpected;
                    });
                }
                if (pageYWrong) {
                    event.__defineGetter__('pageY', function() {
                        return pageYExpected;
                    });
                }
            } else if (Object.defineProperty) {
                if (pageXWrong) {
                    Object.defineProperty(event, "pageX", {
                        value : pageXExpected,
                        writable : false,
                        enumerable : true,
                        configurable : true
                    });
                }
                if (pageYWrong) {
                    Object.defineProperty(event, "pageY", {
                        value : pageYExpected,
                        writable : false,
                        enumerable : true,
                        configurable : true
                    });
                }
            }
        }
    }

    function getScrollOffsets(window) {
        return typeof pageXOffset == "number" ? {
            x : pageXOffset,
            y : pageYOffset
        } : {
            x : window.document.documentElement.scrollLeft,
            y : window.document.documentElement.scrollTop
        };
    }
    
    function setRelatedTargetIE(mouseEvent, data) {
        var fromElement, toElement;
        if(/^mouse(?:out|leave)/.test(mouseEvent.type)) {
            toElement = data.relatedTarget;
            fromElement = data.target;
        } else if(/^mouse(?:ov|ent)er/.test(mouseEvent.type)) {
            toElement = data.target;
            fromElement = data.relatedTarget;
        }
        if(Object.defineProperty) {
            if(typeof toElement != "undefined") {
                Object.defineProperty(mouseEvent, "toElement", { 
                    get : function() {
                        return toElement;
                    }
                  });
            }
            if(typeof fromElement != "undefined") {
                Object.defineProperty(mouseEvent, "fromElement", { 
                    get : function() {
                        return fromElement;
                    }
                  });
            }
        } else {
            // Can't set toElement in IE.
        }
    }

    function setEventPropW3C(mouseEvent, data) {
        mouseEvent.view = data.view;
        mouseEvent.detail = data.detail;
        mouseEvent.screenX = data.screenX;
        mouseEvent.screenY = data.screenY;
        mouseEvent.clientX = data.clientX;
        mouseEvent.clientY = data.clientY;
        mouseEvent.ctrlKey = data.ctrlKey;
        mouseEvent.altKey = data.altKey;
        mouseEvent.metaKey = data.metaKey;
        mouseEvent.shiftKey = data.shiftKey;
        // For IE, this is overridden with getMouseButtonW3CtoIE.
        mouseEvent.button = data.button;
        // XXX IE, toElement can't be set. Set relatedTarget helps
        // Callbacks that check `if(ev.relatedTarget)`.
        try {
            mouseEvent.relatedTarget = data.relatedTarget || null;
        } catch (ex) {
        }
    }

    function setEventPropsIE(mouseEvent, data) {
        setEventPropW3C(mouseEvent, data);
        mouseEvent.button = getMouseButtonW3CtoIE(data.button);
        mouseEvent.type = data.type;
        mouseEvent.cancelBubble = !data.bubbles;
        setRelatedTargetIE(mouseEvent, data);
    }

    function getMouseButtonW3CtoIE(button) {
        // 0 - Left Mouse Button
        // 1 - Middle Mouse Button
        // 2 - Right Mouse Button
        // 
        // 0 - If no button is depressed, then left button is depressed, WTF?
        // http://www.w3.org/Bugs/Public/show_bug.cgi?id=8406
        // http://www.rhinocerus.net/forum/lang-javascript/602795-positioning-div-predictive-test-lov-suggest-list.html
        switch (button) {
        case 0:
            return 1;
        case 1:
            return 4;
        case 2:
            return 2;
        }
        return 0;
    }

    function getMouseEventData(target, type, data) {
        data = data || {};
        var doc = target.ownerDocument || target.document || target;
        return {
            target : target,
            type : type,
            bubbles : ("bubbles" in data) ? !!data.bubbles : true,
            cancelable : ("cancelable" in data) ? !!data.cancelable : true,
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