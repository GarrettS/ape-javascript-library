/**drag-slider.js rollup: Draggable.js, Slider.js*/
APE.namespace("APE.drag" );/**
 * @author Garrett Smith
 * @fileoverview: contains: APE.drag.Draggable, APE.drag.DropTarget
 * 
 * @requires APE.EventPublisher, APE.dom
 * 
 * @example Create a Draggable:
 * 
 * <pre>
 * var Draggable = APE.drag.Draggable,
 *     el = document.getElementById(&lt;var&gt;&quot;box&quot;&lt;/var&gt;),
 *     box = Draggable.getByNode( el );
 * box.keepInContainer = true;
 * box.activeDragClassName = &quot;boxDragging&quot;;
 * 
 * var bigBx = box.addDropTarget( document.getElementById(&quot;biggerBox&quot;) );
 * bigBx.dragOverClassName = &quot;boxDragOver&quot;;
 * </pre>
 */



(function() {
    var APE = self.APE, dom = APE.dom, getStyle = dom.getStyle, drag = APE.drag, 
        Event = dom.Event, highestZIndex = 1000, 
        draggableList = {}, 
        undef, 
        noop = Function.prototype, 
        parseInt = self.parseInt, 
        grabbed, FUNCTION = "function", 
        Draggable = APE.createFactory(Drag, createDraggablePrototype), 
        DropTarget = APE.createFactory(DropTargetC, createDropTargetPrototype);

    drag.Draggable = Draggable;
    drag.DropTarget = DropTarget;

    Draggable.instanceDestructor = instanceDestructor;

    /*
     * @constructor @param {HTMLElement} el the element to drag. @param {Object}
     * [options] { - activeDragClassName - selectedClaslusName - dragCopy
     * {boolean} - dragMultiple {boolean} - useAnim {boolean}
     */
    function Drag(id, options) {
        var d = document, // not cross-frame.
        el = d.getElementById(id), c, p;
        this.id = id;
        this.el = this.origEl = el;
        this.style = el.style;
        this.isRel = getStyle(el, "position").toLowerCase() == "relative";

        // default 'container' is the containing block.
        c = (this.isRel ? el.parentNode : dom.getContainingBlock(el));
        if(c === null)
            c = d.documentElement;
        this.container = c;

        this.dropTargets = [];
        this.handle = el;
        this.onbeforeexitcontainer = beforeExitContainer;
        if(options) {
            for(p in options) {
                this[p] = options[p];
            }
            el.style.zIndex = parseInt(getStyle(el, "zIndex"), 10)
                    || highestZIndex++;
        }
    }

    /* default "onbeforeexitcontainer" handler */
    function beforeExitContainer() {
        return !this.keepInContainer;
    }

    /** @name APE.drag.instanceDestructor */
    function instanceDestructor() {
        var x, p, dObj;
        for(x in this.instances) {
            dObj = this.instances[x];
            for(p in dObj) {
                delete dObj[p];
            }
            delete this.instances[x];
        }
        draggableList = {};
    }

    function createDraggablePrototype() {

        // Static initializer code.
        var d = document, 
            EventPublisher = APE.EventPublisher, 
            addCallback = EventPublisher.add, 
            preventDefault = Event.preventDefault, 
            DOC_EL = "documentElement", 
            ds = d[DOC_EL].style, 
            PIXEL_PX = "px", 
            LSTYLE = "left", 
            TSTYLE = "top", 
            keepUserSelection = false,
            // setCapture allows dragging outside of window in IE.
            needsCapture = "setCapture" in document.documentElement,
            mousedownX = 0, 
            mousedownY = 0,

            /* The active drag object, possibly null */
            dO,
    
            /* For the active dragObj, dragOverTargets
             * is either boolean "false" or
             * an array of DropTarget that has one of: 
             * - an ondragover or ondragout handler
             * - a hoverClassName
             */
            dragOverTargets = false, hasGroupSelection = false, isProxyDrag = false,
            /* Keep CPUs to a minimum. */
            MOUSE_MOVE_THRESHOLD = 25,
    
            lastMouseMoveTime = -1, 
            EV_DRAG_START = "onmousedown", 
            EV_DRAG = "onmousemove", 
            EV_DRAG_END = "onmouseup", 
            IS_TOUCH_EVENT, docMouseDown,
            getEventCoords = Event.getCoords;

        if('ontouchstart' in d) {
            IS_TOUCH_EVENT = true;
            EV_DRAG_START = "ontouchstart";
            EV_DRAG = "ontouchmove";
            EV_DRAG_END = "ontouchend";
            addCallback(d, "ontouchcancel", dragCancel);
        }

        docMouseDown = EventPublisher.get(d, EV_DRAG_START);
        if('pixelLeft' in ds) {
            PIXEL_PX = 0;
            LSTYLE = "pixelLeft";
            TSTYLE = "pixelTop";
        }
        addCallback(d, "onkeydown", dragCancel);
        addCallback(d, EV_DRAG_END, mouseUp);
        initGuardUserSelection(d, ds);
        docMouseDown.add(mouseDown).addAfter(setUpDragOver);
        d = ds = null;
        
        /** prevent text selection while dragging. */
        function initGuardUserSelection(doc, docElStyle){
            var serSelect = "serSelect", 
                mus = "MozU" + serSelect, 
                kus = "MozU" + serSelect, 
                us = "u" + serSelect, 
                userSelectType = mus in ds ? mus : kus in ds ? kus : us in ds ? us : "", 
                ONSELECTSTART = 'onselectstart';
            if(ONSELECTSTART in d) {
                addCallback(d, ONSELECTSTART, guardUserSelection);
            } else {
                docMouseDown.addAfter(guardUserSelection);
            }
            
            function guardUserSelection(ev) {
                var allow = !dO;
                if(userSelectType) {
                    this[DOC_EL].style[userSelectType] = allow ? "" : "none";
                } else {
                    (ev || window.event || 0).returnValue = allow;
                }
            }
        }
        
        /** @param {HTMLElement} target Element that might be a handle 
         * for dObj*/
        function isInHandle(dObj, target) {
            return target === dObj.handle
                    || (dObj.useHandleTree && dom.contains(dObj.handle, target));
        }

        /** 
         * Selects the draggable, adding selectedClassName
         * @param {boolean} isSelect if false, deselects.
         */
        function select(dObj, isSelect) {
            if(isSelect) {
                if(dObj.selectedClassName)
                    dom.addClass(dObj.el, dObj.selectedClassName);
                // onselect handler would go here, if/when needed. return false
                // to prevent.

                if(dObj.dragMultiple && !(dObj.id in draggableList)) {
                    draggableList[dObj.id] = dObj;
                }
            } else {
                if(dObj.selectedClassName)
                    dom.removeClass(dObj.el, dObj.selectedClassName);
                // ondeselect handler would go here, if/when needed.
                delete draggableList[dObj.id];
            }
            dObj.isSelected = isSelect;
        }

        /* Called from dragStart. Sets initial x/y position values. */
        function setUpCoords(newDo) {
            var container = newDo.container, 
                el = newDo.el, 
                d = document, 
                docEl = d.documentElement, 
                cb = dom.getContainingBlock(el) || docEl, 
                cWidth, cHeight, 
                coords = (cb === container) ? {
                    x : 0,
                    y : 0
                } : dom.getOffsetCoords(cb, container),
                // subtract in-flow offsets.
                pixelCoords = dom.getPixelCoords(el),
                // Due to the AVK-CSSOM Mess, offsetTop/offsetLeft are broken - DO NOT USE offset*!
                // Instead, use getOffsetCoords(el, el.parentNode);
                offsetFromParent = dom.getOffsetCoords(el, el.parentNode),
                inFlowOffsetX = offsetFromParent.x - pixelCoords.x + coords.x,
                inFlowOffsetY = offsetFromParent.y - pixelCoords.y + coords.y;

            // Safari Bug: if el is inside a TD, safari adds the TD's offsetLeft
            // to the
            // el's offsetLeft, even if the TD has position: relative.

            // Impl Note: Don't use margins for absolutely positioned elements
            // for Safari.
            // Safari calculates offsetTop from parentNode border edge (not
            // padding edge).

            // Safari 1.3 can't read style values from styleSheets.
            // Safari 1.3 also adds parentNode border-width to offsetLeft.
            // Safari 3 does not. TODO: test Safari 2.

            // Safari 1.3 adds padding-left and top to inFlowOffsets, Safari 3
            // does not.
            // Safari 1 can't read styles. TODO: test Safari 2.

            if(newDo.keepInContainer) {
                if(container === d.body) {
                    cWidth = parseInt(getStyle(container, "width"), 10);
                    cHeight = parseInt(getStyle(container, "height"), 10);
                } else {
                    cWidth = container.clientWidth;
                    cHeight = container.clientHeight;
                }

                newDo.minX = 0 - inFlowOffsetX;
                newDo.maxX = cWidth - el.offsetWidth - inFlowOffsetX;
                newDo.minY = 0 - inFlowOffsetY;
                newDo.maxY = cHeight - el.offsetHeight - inFlowOffsetY;
            }
        }

        function removeGroupSelection() {
            applyGroupAction(select, [false], true);
            hasGroupSelection = false;
        }

        /**
         * When a draggable has been released (by ESC), it calls dragout from the relevant 
         * droptargets and resets any active over droptargets.
         * @param {Event} ev the event that triggered the release. This gets passed back to ondragout.
         */
        function dragObjReleased(ev) {
            animateBack(dO);
            var dt, i, j;

            if(dragOverTargets !== false) {
                for(i = 0, j = dragOverTargets.length; i < j; i++) {
                    dt = dragOverTargets[i];

                    // Did we just move off dObj dropTarget?
                    if(dt.hasDropTargetOver) {
                        if(typeof dt.ondragout == FUNCTION)
                            dt.ondragout(ev, dO);
                        if(dt.dragOverClassName)
                            dom.removeClass(dt.el, dt.dragOverClassName);
                        dt.hasDropTargetOver = false;
                    }
                }
            }
            applyGroupAction(animateBack);
        }

        /**
         * @param {Draggable} dObj
         * @param {Event} [ev] optional, as public instance method release() 
         * calls this.
         */
        function dragDone(dObj, ev) {
            if(dObj.activeDragClassName)
                dom.removeClass(dObj.el, dObj.activeDragClassName);
            removeConstraint(dObj);
            if(needsCapture) {
                dObj.el.releaseCapture();
            }
            dObj.hasBeenDragged = false;
        }

        // Sets dO = null.
        function mainDragObjectEnd(ev){
            // ondragend won't fire on "glideend".
            if(dO.dragMultiple) {
                // Add back to selection for event, 
                // but also for next mouseDown.
                draggableList[dO.id] = dO;
            } else {
                draggableList = {};
            }
            keepUserSelection = false;
            EventPublisher.remove(document, EV_DRAG, mouseMove);
            dO = null;
        }
        
        function setGroupSelection(dObj, hasMetaKey) {
            if(hasMetaKey) {
                if(dObj.id in draggableList) { // selected.
                    select(dObj, false);
                } else { // not selected.
                    select(dObj, true);
                }
            } else if(!dObj.isSelected) { // if not selected, deselect others.
                removeGroupSelection(); // (it may be empty)
                select(dObj, true);
            }
        }

        /** @param APE.drag.Draggable */
        function assignProxy(dObj) {
            var el = dObj.el, 
                copyEl = dObj.copyEl;
            if(!copyEl) {
                copyEl = dObj.copyEl = document.getElementById(dObj.proxyId);
            }
            initCopyEl(dObj, copyEl, el);
        }

        /* creates a copyEl for dragCopy */
        function assignClone(dObj) {
            if(!dObj.copyEl) {
                dObj.copyEl = dObj.el.cloneNode(true);
                dObj.copyEl.id += "Copy";
            }
            initCopyEl(dObj, dObj.copyEl, dObj.el);
        }

        function initCopyEl(dObj, copyEl, origEl) {
            var copyElStyle = copyEl.style;

            dObj.origEl = origEl;

            // In case the element was appended elsewhere.
            // TODO: fix this IE css issue.
            // XXX IE: in sortlist/proxy.html, inserting copyEl before
            // origEl
            // and then moving copyEl *exactly* overlapping origEl causes
            // the css
            // information for selectedClassName to be lost.
            // 100 draggable items appear above.
            copyElStyle.zIndex = parseInt(origEl.style.zIndex, 10) + 100;

            dObj.el = copyEl;
            dObj.style = copyElStyle;
            var display = getStyle(origEl, "display");
            copyElStyle.display = display;
            if(dObj.dragCopy) {
                origEl.parentNode.insertBefore(copyEl, origEl);
                if(dObj.isRel) {
                    subtractInflowOffsets(copyElStyle, origEl, display);
                }
            } else { // Proxy.
                positionProxyToOrigEl(dObj, copyEl, origEl);
            }
        }

        function positionProxyToOrigEl(dObj, copyEl, origEl) {
            var coords = dom.getOffsetCoords(origEl, copyEl.parentNode);
            dObj.moveToX(coords.x);
            dObj.moveToY(coords.y);
        }
        
        // This helps prevent copyEl from displacing other elements.
        function subtractInflowOffsets(copyElStyle, origEl, display) {
            if(display == "inline") {
                copyElStyle.marginRight = -origEl.offsetWidth
                        + -(parseInt(getStyle(origEl, "marginRight"), 10) || 0)
                        + "px";
            } else {
                copyElStyle.marginBottom = -origEl.offsetHeight
                        + -(parseInt(getStyle(origEl, "marginBottom"), 10) || 0)
                        + "px";
            }
        }

        function retireClone(dObj) {

            var copyEl = dObj.copyEl;
            
            // If the clone was not created (yet), exit.
            // (This does happen when no mousemove occurs).
            if(!copyEl) return;
            
            dObj.el = dObj.origEl;
            dObj.style = dObj.el.style;

            // Update position of origEl, which was left behind.
            dObj.moveToX(dObj.x);
            dObj.moveToY(dObj.y);
            copyEl.style.display = "none";
            if(dObj.dragCopy && !dObj.proxyId) { // in case caller does some appending of el, etc.
                dObj.el.parentNode.insertBefore(copyEl, dObj.el);
            }
        }

        /* called on mousemove */
        function carryGroup(distX, distY) {
            if(!hasGroupSelection || isProxyDrag) return;
            applyGroupAction(updateObjPosition, [distX, distY]);
        }

        function updateObjPosition(dObj, distX, distY) {
            if(typeof distX == "number")
                dObj.moveToX(dObj.origX + distX);
            if(typeof distY == "number")
                dObj.moveToY(dObj.origY + distY);            
        }
        
        function dragStart(dObj, ev) {
            if(dObj.isBeingDragged)
                return;
            if(dObj.dragCopy && !dObj.proxyId) {
                // dObj.el assigned to copyEl, dObj.origEl
                // stays put.
                assignClone(dObj);
            }
            if(typeof dObj.ondragstart == FUNCTION) {
                dObj.ondragstart(getDragStartEvent(dObj, ev));
            }

            if(needsCapture) {
                dObj.el.setCapture();
            }
            
            if(dObj.activeDragClassName)
                dom.addClass(dObj.el, dObj.activeDragClassName);
            // Check the coords after making the copyEl here.
            setUpCoords(dObj);
            dObj.isBeingDragged = true;
        }

        function getDragStartEvent(dObj, ev) {
            var id = dObj.id, eventDraggableList = {}, j = 1;
            eventDraggableList[id] = dObj;
            if(hasGroupSelection) {
                for(id in draggableList) {
                    eventDraggableList[id] = draggableList[id];
                    j++;
                }
            }
            return {
                domEvent : ev,
                draggableList : eventDraggableList,
                count : j
            };
        }

        function mouseDown(e) {
            if(grabbed) {
                grabbed = false;
                return;
            }

            var evOrig = e || window.event;
            // 1-finger drag for iPhone.
            if(IS_TOUCH_EVENT && dO)
                return;

            e = getPointerEvent(e, "touches");
            var target = Event.getTarget(evOrig), 
                metaKey = e.metaKey || e.ctrlKey,
                dOTarg = findDragObjectTarget(target);

            if(dOTarg) { // found. 

                if(!dOTarg.isDragEnabled) {

                    if(!metaKey) {
                        removeGroupSelection();
                    }
                    return false; // prevent focus.
                }

                // If it's got a handle, make sure user clicked the handle.
                if(!metaKey && dOTarg.hasHandleSet && !isInHandle(dOTarg, target)) {
                    removeGroupSelection();
                    dOTarg = null;
                    return;
                } else {
                    if(!metaKey && !dOTarg.isSelected) { // no metaKey, 
                        removeGroupSelection();
                    }
                    e.returnValue = false;
                }
                // In Mozilla; the intrisinc focus event will not fire when the 
                // mousedown calls preventDefault(). This is a bug in Mozilla.
                // else if(typeof e.preventDefault == "function")
                // e.preventDefault();
            } else {
                if(!metaKey) {
                    removeGroupSelection();
                    if(dO) {
                        select(dO, false);
                        dO = null;
                    }
                }
                return;
            }

            // User tried to add to selection, but can't. Just return.
            if(metaKey && dO && !dOTarg.dragMultiple) {
                keepUserSelection = true;
                return false;
            }

            if(!dOTarg.dragMultiple) {
                if(!metaKey) {
                    removeGroupSelection();

                    // User tried to add to group. Exit, but don't
                    // deselect on mouseup.
                } else {
                    keepUserSelection = true;
                    return false;
                }
            }

            setGroupSelection(dOTarg, metaKey);

            dOTarg.style.zIndex = ++highestZIndex;

            // User tried to drag a group and still had metaKey down.
            // if(metaKey) { }

            // Sets up dropTargets that have dragOverClassName | ondragover
            if(dragObjGrabbed(dOTarg, e) == false) return;

            dO = dOTarg;
            preventDefault(evOrig);

            applyGroupAction(dragObjGrabbed, [e]);
            return target.tagName !== "IMG"; // Mozilla will prevent focus
                                             // events for return false;
        }

        function findDragObjectTarget(testNode) {
            var dOTarg, 
                instances = Draggable.instances;
            for(; !dOTarg && testNode !== null;
                testNode = dom.findAncestorWithAttribute(testNode, "id")) {
                dOTarg = instances[testNode.id];
            }
            return dOTarg;
        }

        /** 
         * called before dragstart, this function checks to see if there are any droptargets 
         * that need mousemove consideration. For example, if the droptarget has a
         * dragOverClassName, or has an ondragover handler.
         */
        function setUpDragOver() {
            if(!dO) {
                return;
            }
            // subset for ondragover, to help speed up dragging
            // with multiple drop targets.
            var dropTargets = dO.dropTargets, 
                dt, i, c, len;
            if(!dropTargets) {
                return dragOverTargets = false;
            }
            dragOverTargets = [];
            for(i = c = 0, len = dropTargets.length; i < len; i++) {
                dt = dropTargets[i];
                dt.initCoords();
                if(dt.ondragover ||  dt.ondragout || dt.dragOverClassName) {
                    dragOverTargets[c++]= dt;
                }
            }
            // set to false, for quicker access on drag over.
            if(c === 0) {
                dragOverTargets = false;
            }
        }

        /** 
         * Called from grab() and from mousemove, when first started.
         */
        function dragObjGrabbed(dObj, e) {
            if(typeof dObj.onbeforedragstart == FUNCTION
                    && dObj.onbeforedragstart(getDragStartEvent(dObj, e)) == false) {
                return false;
            }

            var eventCoords = getEventCoords(e), elementPixelCoords;

            if(dObj.proxyId && !dObj.dragCopy) {
                assignProxy(dObj);
            }

            setDynamicDispatchConstraint(dObj);
            mousedownX = eventCoords.x;
            mousedownY = eventCoords.y;

            elementPixelCoords = dom.getPixelCoords(dObj.el);

            dObj.origX = dObj.grabX = elementPixelCoords.x;
            dObj.origY = dObj.grabY = elementPixelCoords.y;

            dObj.isBeingDragged = false;
            addCallback(document, EV_DRAG, mouseMove);            
        }

        // For constraint.
        function setDynamicDispatchConstraint(dObj) {
            var constraint = dObj.constraint;
            if(constraint === "y") {
                dObj.moveToX = noop;
            } else if(constraint === "x") {
                dObj.moveToY = noop;
            }
        }
        
        function removeConstraint(dObj) {
            delete dObj.moveToX;
            delete dObj.moveToY;
        }

        // TODO: remove ondragstop.
        function mouseMove(e) {

            if(!dO) {
                return;
            }
            var now = +new Date, evOrig;
            if(now - lastMouseMoveTime < MOUSE_MOVE_THRESHOLD)
                return;
            lastMouseMoveTime = now;
            evOrig = e = e || event;
            if(IS_TOUCH_EVENT) {
                // Finger drag, not resize not scroll.
                e = e.touches && e.touches[0];
                if(!e)
                    return;
                preventDefault(evOrig);
            }
            var eventCoords = getEventCoords(e), 
                ePageX = eventCoords.x, 
                ePageY = eventCoords.y, 
                distX = ePageX - mousedownX, 
                distY = ePageY - mousedownY, 
                newX = dO.origX + distX, 
                newY = dO.origY + distY, id;

            // Initiate dragging.
            if(dO.isBeingDragged === false) {
                isProxyDrag = !!dO.proxyId;
                for(id in draggableList) {
                    hasGroupSelection = true;
                    break;
                }
                // is not part of selection.
                delete draggableList[dO.id];
                dragStart(dO, e);
                if(dO.proxyId && dO.dragCopy) {
                    assignProxy(dO);
                }
                applyGroupAction(dragStart, [e])
            }

            dO.hasBeenDragged = (dO.hasBeenDragged || !!(distX || distY));
            // TODO: 2009-10-31 - can this be removed?
            if(typeof dO.onbeforedrag == FUNCTION
                    && dO.onbeforedrag(e) == false)
                return;

            var hasOnDrag = typeof dO.ondrag === FUNCTION;

            if(!keptInContainerOnDrag(dO, newX, newY, distX, distY, hasOnDrag, e)) {
             // Container boundaries irrelevant.
                dO.isAtLeft = dO.isAtRight = dO.isAtTop = dO.isAtBottom = false;
                dO.moveToX(newX);
                dO.moveToY(newY);
                carryGroup(distX, distY);
                if(hasOnDrag) {
                    dO.ondrag(e);
                }
            }
            // Handle dropTarget dragOver    
            if(dragOverTargets !== false) {
                handleDragOver(dO, e, ePageX, ePageY);
            }
            return false;
        }

        /** If the object has a container, dragging is handled here.
         * @return {Boolean} true, if object was kept in container, false otherwise.
         */
        function keptInContainerOnDrag(dO, newX, newY, distX, distY, hasOnDrag, e){
            if(dO.container) {
                var isLeft = newX < dO.minX, isRight = newX > dO.maxX, 
                    isAbove = newY < dO.minY, isBelow = newY > dO.maxY,
                    cX = dO.constraint == "x",
                    cY = dO.constraint == "y",
                    movedX = !cX, movedY = !cY, doOnDrag;

                if(isLeft || isRight || isAbove || isBelow 
                        && dO.onbeforeexitcontainer() != true) {
                    if(!cY) {
                        movedX = moveDoX(newX, distX, isLeft, isRight);
                    }
                    if(!cX) {
                        movedY = moveDoY(newY, distY, isAbove, isBelow);
                    }
                    moved = movedX || movedY;
                    console.log(movedX, movedY)
                    if(moved && dO.ondrag) {
                        dO.ondrag(e);
                    } else {
                        dO.ondragstop(e);
                    }
                    return true;
                }
            }
            return false;
        }
        
        function moveDoX(newX, distX, isLeft, isRight){
            if(dO.x === newX) {
                return false;
            }
            var stoppedX;
            if(isLeft) {
                if(!dO.isAtLeft) {
                    dO.moveToX(dO.minX);
                    // dO.minX - dO.origX = max possible negative distance
                    // to travel.
                    carryGroup(dO.minX - dO.origX, null);
                    dO.isAtRight = false;
                    dO.isAtLeft = true;
                } else {
                    stoppedX = true;
                }
            } else if(isRight) {
                if(!dO.isAtRight) {
                    dO.moveToX(dO.maxX);
                    // dO.maxX - dO.origX = max possible positive distance
                    // to travel.
                    carryGroup(dO.maxX - dO.origX, null);
                    dO.isAtRight = true;
                    dO.isAtLeft = false;
                } else {
                    stoppedX = true;
                }
            } else {
                dO.isAtLeft = dO.isAtRight = false;
                dO.moveToX(newX);
                carryGroup(distX, null);
            }
            return !stoppedX;
        }
        
        function moveDoY(newY, distY, isAbove, isBelow, hasOnDrag){
            if(dO.y === newY) {
                return false;
            }
            var stoppedY;
            if(isAbove) {
                if(!dO.isAtTop) {
                    dO.moveToY(dO.minY);
                    // dO.minY - dO.origY = max possible positive distance
                    // to travel.
                    carryGroup(null, dO.minY - dO.origY);
                    dO.isAtTop = true;
                    dO.isAtBottom = false;
                } else {
                    stoppedY = true;
                }
            } else if(isBelow) {
                if(!dO.isAtBottom) {
                    if(dO.maxY > 0)
                        dO.moveToY(dO.maxY);
                    // dO.maxY - dO.origY = max possible positive distance
                    // to travel.
                    carryGroup(null, dO.maxY - dO.origY);
                    dO.isAtTop = false;
                    dO.isAtBottom = true;
                } else {
                    stoppedY = true;
                }
            } else {
                dO.isAtTop = dO.isAtBottom = false;
                dO.moveToY(newY);
                carryGroup(null, distY);
            }
            return !stoppedY;
        }
        
        function mouseUp(e) {
            grabbed = false;
            // We need this here, but also after release(), so in 
            // mainDragObjEnd.
            EventPublisher.remove(document, EV_DRAG, mouseMove);
            if(!dO) {
                return;
            }
            var hasBeenDragged = dO.hasBeenDragged, 
                isRandomMouseMoveEvent = (dO.isBeingDragged && !hasBeenDragged);
            e = getPointerEvent(e, "changedTouches");
            if(!dO.hasBeenDragged && !isRandomMouseMoveEvent) {
                if(!keepUserSelection) {
                    retireClone(dO);
                    mainDragObjectEnd(e);
                }
                return;
            }

            // if it's been dragged onto a dropTarget, fire that event.
            if(!isProxyDrag) {
                applyGroupAction(keepObjInContainer);
            }
            
            applyGroupAction(retireClone);
            retireClone(dO);
            
            handleDrops(e);
            applyGroupAction(dragDone, [e]);
            
            draggableList[dO.id] = dO;
            dragDone(dO, e);
            dO.ondragend({
                domEvent : e,
                draggableList : draggableList
            });

            if(dO) { //ondragend handler may call release(), as in Table example.
                mainDragObjectEnd(e);
            }
        }

        function keepObjInContainer(dObj){
            var x = dObj.x,
                y = dObj.y;
            if(x < dObj.minX)
                dObj.moveToX(dObj.minX);
            else if(x > dObj.maxX)
                dObj.moveToX(dObj.maxX);
            if(y < dObj.minY)
                dObj.moveToY(dObj.minY);
            else if(y > dObj.maxY)
                dObj.moveToY(dObj.maxY);
            // ondragend does notfire for each object,
            // a related dragObjects collection is provided.
        }

        function applyGroupAction(action, args, force) {
            if(!hasGroupSelection && !force) return; 
            var id, dObj;
            args = args || [];
            args.unshift(0);
            for(id in draggableList) {
                dObj = args[0] = draggableList[id];
                action.apply(dObj, args);
            }
        }
        
        /** 
         * Key event callback handler. 
         * When ESC key is pressed, 
         * draggables are released.
         */
        function dragCancel(e) {
            if(!dO) return;
            e = e || event;
            if(e.keyCode == 27 || e.type === "touchcancel") { // esc key = 27.
                dO.release(e);
            }
        }

        function handleDragOver(dO, e, ePageX, ePageY) {
            var coords = {
                x : ePageX,
                y : ePageY
            }, i = 0, j = dragOverTargets.length, dt, isInTarget, dragEvent = {
                domEvent : e,
                dragObj : dO
            };
            for(; i < j; i++) {
                dt = dragOverTargets[i];
                isInTarget = dt.containsCoords(coords);
                // Did we just move over this dropTarget?
                if(!dt.hasDropTargetOver && isInTarget) {
                    dt.hasDropTargetOver = true;
                    if(typeof dt.ondragover == FUNCTION) {
                        dt.ondragover(dragEvent); // typeof check now needed.
                    }
                    if(dt.dragOverClassName) {
                        dom.addClass(dt.el, dt.dragOverClassName);
                    }
                } else { // Were we previously over this dropTarget?
                    if(dt.hasDropTargetOver && !isInTarget) {
                        if(typeof dt.ondragout == FUNCTION) {
                            dt.ondragout(dragEvent);
                        }
                        if(dt.dragOverClassName) {
                            dom.removeClass(dt.el, dt.dragOverClassName);
                        }
                        dt.hasDropTargetOver = false;
                    }
                }
            }
        }
        
        /** fires ondrop for each dropTarget, and each dropTarget.s
         * TODO: Make ondrop fire once, passing a draggableList in the dropEvent.
         */
        function handleDrops(ev) {
            var targets = dO.dropTargets, dropTarget, coords, 
                len = targets.length, i, dragOverClassName;
            if(len) {
                coords = getEventCoords(ev);
                for(i = 0; i < len; i++) {
                    dropTarget = targets[i];
                    if(typeof dropTarget.ondrop === FUNCTION && dropTarget.containsCoords(coords)) {
                        dropTarget.ondrop(getDropEvent(ev, dO));
                         // Assume that draggable groups share dropTargets.
                        applyGroupAction(maybeOndrop, [dropTarget, ev]);
                    }
                    dragOverClassName = dropTarget.dragOverClassName;
                    if(dragOverClassName) {
                        dom.removeClass(dropTarget.el, dragOverClassName);
                    }
                }
            }
        }

        function getDropEvent(ev, dObj) {
            return {
                domEvent : ev,
                dragObj : dObj
            };
        }
        
        function maybeOndrop(dObj, dropTarget, ev){
            if(dObj.id !== dropTarget.id) {
                dropTarget.ondrop(getDropEvent(ev, dObj));
            }
        }
        
        function getPointerEvent(e, p) {
            return e && e[p] && e[p][0] || e || event;
        }

        function glideStart(dObj) {
            var anim = APE.anim,
                a = new anim.Animation(.2);
            a.transition = anim.Transitions.accel;
            a.run = glide;
            a.dObj = dObj;
            a.onplay = dObj.onglide;
            a.onend = animOnEnd;
            a.start();
        }

        function glide(rationalValue) {
            var dObj = this.dObj, 
                dx = dObj.x - dObj.grabX, 
                dy = dObj.y - dObj.grabY;

            rationalValue = Math.pow(rationalValue, 3); // accel.
            dObj.moveToX(dObj.x - (dx * rationalValue));
            dObj.moveToY(dObj.y - (dy * rationalValue));
        }

        function animOnEnd() {
            glideEnd(this.dObj);
        }

        function glideEnd(dObj) {
            if(typeof dObj.onglideend == FUNCTION) {
                dObj.onglideend();
            }
            retireClone(dObj);
        }

        /** Starts gliding the draggable back to its original x,y coords. */
        function animateBack(dObj) {
            if(APE.anim && dObj.useAnim) {
                glideStart(dObj);
            } else {
                dObj.moveToX(dObj.grabX);
                dObj.moveToY(dObj.grabY);
                if(typeof dObj.onglide == FUNCTION) {
                    dObj.onglide();
                }
                glideEnd(dObj, {});
            }
        }

        return {

            /** set to true to make a temporary "ghost" copy dragged. */
            dragCopy : false,

            useAnim : true,

            /** set to true to allow this to be dragged as a group. */
            dragMultiple : false,

            /** className to add when selected. */
            selectedClassName : "",

            /** className to add before being dragged. */
            activeDragClassName : "",

            useHandleTree : true,

            isSelected : false,

            /** @event Is about to move. */
            onbeforedrag : undef,

            /** @event Has been grabbed. */
            onbeforedragstart : noop,

            /** @event Mouse has moved. */
            ondragstart : undef,

            /** @event Being dragged */
            ondrag : undef,

            /** @event
             *  @description Dragging stopped before it escaped its container. 
             */
            ondragstop : noop,

            /** @event Dragging completed (as a result of mouseup). */
            ondragend : noop,

            /* current x position*/
            x : 0,
            /* current y position*/
            y : 0,
            /* where drag started from */
            origX : 0,
            /* where drag started from */
            origY : 0,
            /* where draggable was grabbed from */
            grabX : 0,
            /* where draggable was grabbed from */
            grabY : 0,

            /* drag object can be dragged outside of its container */
            keepInContainer : false,

            /* drag object can be disabled by setting to this to false */
            isDragEnabled : true,

            hasHandleSet : false,

            /** Sets a handle on a draggable 
             * @param {HTMLElement} el the element to use as a handle.
             * By default, the handle is the draggable.
             * @param {boolean} [useHandleTree] if true, the draggable can use anything in the 
             * handle's subtree for dragging.
             */
            setHandle : function(el, useHandleTree) {
                this.handle = el;
                this.hasHandleSet = true;
                // Make sure caller didn't forget the secondParam and expect
                // true.
                this.useHandleTree = useHandleTree != false;
            },

            dropTargets : false,
            /** 
             * Adds a drop target.
             * @param {HTMLElement|APE.drag.DropTarget} dropTarget either an element or a DropTarget.
             * @return {DropTarget} The drop target that was added.
             */
            addDropTarget : function(dropTarget) {
                var dt = DropTarget.getByNode(dropTarget), 
                    el = dt.el, 
                    dropTargets = this.dropTargets;
                if(this.el === el)
                    return dt;
                return dropTargets[dropTargets.length] = DropTarget.getByNode(el);
            },

            /** 
             * Grabs the draggable, centering it under the cursor.
             * @param {Event} e the event to grab the element from.
             * @param {int} [xOffset] amount of horizontal adjustment to apply.
             * @param {int} [yOffset] amount of vertical adjustment to apply.
             */
            grab : function(e, xOffset, yOffset) {
                e = e || window.event;
                var target = Event.getTarget(e), grabCoords;

                preventDefault(e);

                if(dom.contains(this.el, target)) {
                    return;
                }
                
                grabCoords = dom.getPixelCoords(this.el);
                this.grabX = grabCoords.x;
                this.grabY = grabCoords.y;

                // Get the container's offset.
                var eventCoords = getEventCoords(e), handle = this.handle, 
                    offsetCoords = dom.getOffsetCoords(dom.getContainingBlock(this.el)), 
                    offsetX = eventCoords.x - offsetCoords.x, 
                    newX = offsetX - (0 | handle.offsetWidth / 2), 
                    offsetY = eventCoords.y - offsetCoords.y, 
                    newY = (offsetY - (0 | handle.offsetHeight / 2)), 
                    handleOffsetCoords = dom .getOffsetCoords(handle, this.el);

                if(this.keepInContainer) {
                    newX = Math.max(newX, 0);
                    newX = Math.min(newX, this.container.clientWidth
                            - this.el.offsetWidth);
                    newY = Math.max(newY, 0);
                    newY = Math.min(newY, this.container.clientHeight
                            - this.el.offsetHeight);
                }
                this.moveToX(newX - handleOffsetCoords.x + (xOffset || 0));
                this.moveToY(newY - handleOffsetCoords.y + (yOffset || 0));
                
                dragObjGrabbed(this, e);
                grabbed = true;
                dO = this;
            },

            /**
             * releases the draggable.
             * @param {Event} [ev] the event that triggered release
             */
            release : function(ev) {
                ev = ev || {};
                applyGroupAction(dragDone, [ev]);
                if(typeof this.onrelease == FUNCTION)
                    this.onrelease(ev);
                dragObjReleased(ev);
                mainDragObjectEnd(ev);
            },

            moveToX : function(x) {
                this.style[LSTYLE] = (this.x = x) + PIXEL_PX;
            },

            moveToY : function(y) {
                this.style[TSTYLE] = (this.y = y) + PIXEL_PX;
            },

            /** 
             * Removes a drop target.
             * @param {HTMLElement|DropTarget} element or DropTarget to remove.
             * @return {HTMLElement} the removed dropTarget element.
             */
            removeDropTarget : function(el) {
                var el = document.getElementById(el.id), dts = this.dropTargets, i, len;

                for(i = 0, len = dts.length; i < len; i++) {
                    if(dts[i].el === el) {
                        dts.splice(i, 1);
                        return el;
                    }
                }
                return null;
            },

            toString : function() {
                return "Draggable(id=" + this.id + ")";
            }
        };
    }

    /** @param {id} element id. */
    function DropTargetC(id) {
        this.el = document.getElementById(id);
        this.id = id;
    }

    function createDropTargetPrototype() {
        return {
            /* the className to add when selected. */
            dragOverClassName : "",

            initCoords : function() {
                var coords = this.coords || (this.coords = {}), 
                    el = this.el;
                dom.getOffsetCoords(el, document, coords);
                coords.w = el.clientWidth;
                coords.h = el.clientHeight;
            },

            /** returns true if x and y are both inside dropTarget
             * @param {Object} curs {x,y} coordinates of the event.
             */
            containsCoords : function(curs) {
                // check for x, then y.
            var coords = this.coords, dt_x = coords.x, dt_y = coords.y;

            return (curs.x >= dt_x && curs.x <= dt_x + coords.w) && // now check for y.
                    (curs.y >= dt_y && curs.y <= dt_y + coords.h);
        },

        /** @event Dragged over a droptarget */
        ondragover : false,

        /** @event Dragged off a droptarget */
        ondragout : undef,

        /** @event Hit a drop target. Fires for each object being dragged. */
        ondrop : undef
        };
    }
})();/** slider.js
 * requires: Draggable, EventPublisher, className-f.js (in dom.js)
 */

(function(){
    var APE = self.APE,
        drag = APE.drag,
        dom = APE.dom,
        Slider = drag.Slider = APE.createFactory(SliderC, createSliderProto),
        HORZ = 1,
        VERT = 2,
        MINVAL = "minValue",
        MAXVAL = "maxValue";
    
    Slider.direction = {
        HORZ : HORZ,
        VERT : VERT
    };

    function SliderC(id, dir, minValue, maxValue) {
        this.id = id;
        this.dir = dir;
        this.value = 0;
        this.rationalValue = 0;
    
        var handle = drag.Draggable.getById(id, dir);
        handle.keepInContainer = true;
        this.handle = handle;
        this[MINVAL] = minValue||0;
        this[MAXVAL] = maxValue;
        this.tDist = 0;
        this.init();
    }
    
    function createSliderProto() {
                
        // IE and Webkit ignore keyEvents on the element.
        APE.EventPublisher.add(document, "onkeydown", _keyDown);
        var ACTIVE_TRACKBAR = "ape-slider-track-active",
            activeSlider = null;
        
        return { 
            
            init : function() {
                var EventPublisher = APE.EventPublisher,
                    el = document.getElementById(this.id),
                    handle = this.handle,
                    container = this.trackbar = document.getElementById(this.id).parentNode;
                
                EventPublisher.add(handle, "onglideend", dragEnd, this);
                EventPublisher.add(handle, "ondragend", dragEnd, this);
                EventPublisher.add(handle, "onglideend", dragEnd, this);
                EventPublisher.add(handle, "ondrag", sliderSlid, this);
                if(!("focus" in handle)) {
                    EventPublisher.add(el, "onmousedown", sliderFocus, this);
                }
                EventPublisher.add(el, "onfocus", sliderFocus, this);
                EventPublisher.add(el, "onblur", sliderBlur, this);
                EventPublisher.add(handle, "onglide", sliderSlid, this);
                EventPublisher.add(handle, "ondragstop", sliderSlid, this);

                if(this.dir === VERT){
                    this.tDist = container.clientHeight - el.offsetHeight;
                    handle.moveToX = moveToNo;
                } else {
                    this.tDist = container.clientWidth - el.offsetWidth;
                    handle.moveToY = moveToNo;
                }
        
                // Default: use pixels for min/max.
                if(this[MAXVAL] === undefined) 
                    this[MAXVAL] = this.tDist;
                EventPublisher.add(container, "onmousedown", trackbarMouseDown, container);
            },
        
            ticks : 15,
                
        	rationalValue : 0,
        
        	slideToX : function(x) {
            	this.handle.moveToX(x);
            	if(typeof slider.onslide === "function")
                	slider.onslide();                
            },
            
            /** setValue moves the slider to x or y coordinate based on value 
             */
        	setValue : function(v) {
                // keep in range, throw no error.
             	v = Math.max(this[MINVAL], v);
            	v = Math.min(this[MAXVAL], v);
        
            	var h = this.handle,
                    d = this[MAXVAL] - this[MINVAL],
                    rationalValue = (v - this[MINVAL]) / d;
        
                // Somehow testKey* functions in IE result 
                // in a Draggable with no properties. 
                if(!h || !h.id) return;
            	if(this.dir === VERT) {            
                 	h.moveToY(this.tDist  * (1 - rationalValue));
                } else {
                 	h.moveToX(this.tDist * rationalValue );
                }
            	this.rationalValue = rationalValue;
            	this.value = v;
            },
            
        	slideToY : function(y) {
            	this.handle.moveToY(y);
            	this.onslide();
            },
            
        	setRationalValue : function(fRat, bOnslide) {
            	fRat = Math.max(0, fRat);
            	fRat = Math.min(1, fRat);
            	this.rationalValue = fRat;
            	this.setValue(this[MINVAL] + (fRat * (this[MAXVAL] - this[MINVAL])));
            	if(bOnslide)
                	sliderSlid.call(this, {});
            },
            
            toString : function(){ 
                return"Slider: " + this.handle.toString();
            }
        };

        function moveToNo(){} 
        
        function trackbarMouseDown(e) {
            var target = dom.Event.getTarget(e),
                slider;
            if(target !== this) return true;
            slider = Slider.instances[this.getElementsByTagName("*")[0].id];
            e = e||self.event;
            if(e.preventDefault)
                e.preventDefault();
    
            dom.addClass(this, ACTIVE_TRACKBAR);
            slider.handle.grab(e);
            sliderSlid.call(slider, e);
            return false;
        }
            
        function dragEnd(e) {
            dom.removeClass(this.trackbar, ACTIVE_TRACKBAR);
            sliderSlid.call(this, e);
            if(typeof this.onslideend === "function")
                this.onslideend(e);
         }
         
        function sliderFocus(e) {
            activeSlider = this;
            dom.addClass(this.trackbar, ACTIVE_TRACKBAR);
        }
        
        function sliderBlur(e) {
            if(activeSlider === this)
                activeSlider = null;
            dom.removeClass(this.trackbar, ACTIVE_TRACKBAR);
        }
                
        function sliderSlid(e) { 
            this.value = 0;
            var el = document.getElementById(this.id),
                rationalValue = 0;
    
            if(this.dir === HORZ) {
                if(el.offsetLeft > 0) {
                    rationalValue = el.offsetLeft / this.tDist;
                } else {
                    rationalValue = 0;
                }
            } else {
                if(el.offsetTop > 0) {
                    var distFromBottom = this.tDist - el.offsetTop;
                    rationalValue = distFromBottom / this.tDist;
                } else {
                    rationalValue = 1;
                }
            }
            this.rationalValue = rationalValue;
            this.value = rationalValue * (this[MAXVAL] - this[MINVAL]);
            if(this.onslide) this.onslide(e||{}); 
        }
    
        var lastKeyTime;
        function _keyDown(e) {
            e = e||self.event;
            if(e.stopPropagation) {
                // Safari 3 doesn't actually stop propagation; ignores cancelBubble = true.
                // Doesn't support originalTarget, either.
                e.stopPropagation();
            }
            e.cancelBubble = true; // just in case some actually fires a keyEvent on a handle.
    
            // IE, Opera, Webkit all need this:
            // If stopPropagation and cancelBubble fail, check the timeStamp.
            // If the timeStamp is recurrant, exit.
            // Opera 9.2: timeStamp is always 0. always. IE does not support event.timeStamp.
            var timeStamp = +new Date, 
                slider = activeSlider;
            if(!slider) return;

            if(timeStamp - lastKeyTime < 5) return; // recurrant.
            lastKeyTime = timeStamp; // record.
            var keyCode = e.keyCode,
                tickval,
                lArr = keyCode === 37,
                rArr = keyCode === 39,
                uArr = keyCode === 38,
                dArr = keyCode === 40;
            if( !(lArr || rArr || uArr || dArr) ) return true;
    
            if(slider.id in Slider.instances) {
                tickval = slider[MAXVAL]/slider.ticks;
                if(lArr || dArr) {
                    tickval = -tickval;
                }
                slider.setValue(slider.value + tickval);
                if(slider.onslide)
                    slider.onslide(e);
                return false;
            }
        }
    }     
})();