/**drag-slider.js rollup: Draggable.js, Slider.js*/
APE.namespace("APE.drag" );
/**
 * @author Garrett Smith 
 * @fileoverview:
 * contains: APE.drag.Draggable, APE.drag.DropTarget
 *
 * @requires APE.EventPublisher, APE.dom
 * 
 * classNames:
 * <ul>
 *   <li>activeDragClassName</li>
 *   <li>selectedClaslusName</li>
 *   <li>dragOverClassName (for dropTarget)</li>
 * </ul>
 *
 * APE.drag.Draggable Features:
 * <ul>
 *   <li>dragCopy</li>
 *   <li>dragMultiple</li>
 *   <li>setHandle(handle, useTree)</li>
 * </ul>
 *
 * @example Create a Draggable:
 *<pre>
 * var Draggable = APE.drag.Draggable,
 *     el = document.getElementById(<var>"box"</var>),
 *     box = Draggable.getByNode( el );
 * box.keepInContainer = true;
 * box.activeDragClassName = "boxDragging";
 * 
 * var bigBx = box.addDropTarget( document.getElementById("biggerBox") );
 * bigBx.dragOverClassName = "boxDragOver";
 * </pre>
 */



(function(){
    var APE = self.APE,
        dom = APE.dom,
        drag = APE.drag,
        EventPublisher = APE.EventPublisher,
        Event = dom.Event,
        highestZIndex = 1000,
        draggableList = { },
        undef,
        grabbed,
        FUNCTION = "function",
        Draggable = APE.createFactory(Drag, createDraggablePrototype),
        DropTarget = APE.createFactory(DropTargetC, createDropTargetPrototype);
    
    drag.Draggable = Draggable;
    drag.DropTarget = DropTarget;
    
    Draggable.instanceDestructor = instanceDestructor;
    
    /* @param {HTMLElement} el the element to drag. */
    function Drag(id) {
        var d = document, 
            el = d.getElementById(id);
        this.id = id;
        this.el = this.origEl = el;
        this.style = el.style;
        this.isRel = dom.getStyle(el, "position").toLowerCase() == "relative";
    
        // default 'container' is the containing block.
        var c = (this.isRel ? el.parentNode : dom.getContainingBlock(el));
        if(c === null) c = d.documentElement;        
        this.container = c; 

        this.dropTargets = [];
        this.handle = el;
        this.onbeforeexitcontainer = beforeExitContainer;
        el.style.zIndex = parseInt(dom.getStyle(el, "zIndex"), 10) || highestZIndex++;
    }
    
    /* default "onbeforeexitcontainer" handler */
    function beforeExitContainer() { return !this.keepInContainer; }
    
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
        dO = null;
    }
    
    function createDraggablePrototype(){
        
        // Static initializer code.
        var d = self.document,
            DOC_EL = "documentElement",
            ds = d[DOC_EL].style,
            serSelect = "serSelect", 
            mus = "MozU"+serSelect,
            kus = "MozU"+serSelect,
            us = "u"+serSelect,
            userSelectType = mus in ds ? mus : kus in ds ? kus : us in ds ? us : "",
            PIXEL_PX = "px",
            LSTYLE = "left",
            TSTYLE = "top",
            keepUserSelection = false,
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
            dragOverTargets = false,
            
            /* Keep CPUs to a minimum. */
            MOUSE_MOVE_THRESHOLD = 25,

            lastMouseMoveTime = -1,
            docMouseDown = EventPublisher.get(d, "onmousedown");
            getEventCoords = Event.getCoords;

        // prevent text selection while dragging.
        if('onselectstart' in d) {
            EventPublisher.add(d, "onselectstart", guardUserSelection);
        } else {
            docMouseDown.addAfter(guardUserSelection);
        }
        if('pixelLeft'in ds){
            PIXEL_PX = 0;
            LSTYLE = "pixelLeft";
            TSTYLE = "pixelTop";
        }
        docMouseDown.add(mouseDown).addAfter(setUpDragOver);
        EventPublisher.add(d, "onkeydown", keyDown);
        EventPublisher.add(d, "onmousemove", mouseMove);
        EventPublisher.add(d, "onmouseup", mouseUp);
        d = ds = null;
        
        function guardUserSelection(ev) {
            var allow = !dO;
            if(userSelectType) {
                this[DOC_EL].style[userSelectType] = allow ? "" : "none";
            } else if(!ev) {
                self.event.returnValue = allow;
            }
        }
        
        /** @param {HTMLElement} target Element that is checked.*/
        function isInHandle(dObj, target) {
            return target === dObj.handle || 
            (dObj.useHandleTree && dom.contains( dObj.handle, target ));
        }

        /** 
         * Selects the draggable, adding selectedClassName
         * @param {boolean} isSelect if false, deselects.
         */
        function select(dObj, isSelect) {
            if(isSelect) {
                if(dObj.selectedClassName)
                    dom.addClass(dObj.el, dObj.selectedClassName);
                // onselect handler would go here, if/when needed. return false to prevent.
                
                if(dObj.dragMultiple && ! (dObj.id in draggableList)) {
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
        function setUpCoords(e, newDo) {
            var container = newDo.container,
                el = newDo.el,
                d = document,
                docEl = d.documentElement,
                cb = dom.getContainingBlock(el)||docEl,
                cWidth, cHeight,
                coords = (cb === container) ? {x:0, y:0} : dom.getOffsetCoords(cb, container),
              // subtract in-flow offsets.
                pixelCoords = dom.getPixelCoords(el),
              // Due to the AVK-CSSOM Mess, offsetTop/offsetLeft are broken - DO NOT USE offset*!
              // Instead, use getOffsetCoords(el, el.parentNode);
                offsetFromParent = dom.getOffsetCoords(el, el.parentNode),
                inFlowOffsetX = offsetFromParent.x - pixelCoords.x + coords.x,
                inFlowOffsetY = offsetFromParent.y - pixelCoords.y + coords.y;
        
                // Safari Bug: if el is inside a TD, safari adds the TD's offsetLeft to the 
                // el's offsetLeft, even if the TD has position: relative.
         
                // Impl Note: Don't use margins for absolutely positioned elements for Safari.
                // Safari calculates offsetTop from parentNode border edge (not padding edge).
         
                // Safari 1.3 can't read style values from styleSheets.
                // Safari 1.3 also adds parentNode border-width to offsetLeft. 
                // Safari 3 does not. TODO: test Safari 2.

                // Safari 1.3 adds padding-left and top to inFlowOffsets, Safari 3 does not.
                // Safari 1 can't read styles. TODO: test Safari 2.
             
            if(newDo.keepInContainer) {
                if(container === d.body) {
                    cWidth = parseInt(dom.getStyle(container, "width"), 10);
                    cHeight = parseInt(dom.getStyle(container, "height"), 10);
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
            for(var id in draggableList) {
                select(draggableList[id], false);
            }
        }
        
        /** 
         * returns true if there are any selected items.
         */
        function hasGroupSelection() {
            for(var id in draggableList)
                return true;
            return false;
        }
       
        /**
         * When a draggable has been released (by ESC), it calls dragout from the relevant 
         * droptargets and resets any active over droptargets.
         * @param {Event} e the event that triggered the release. This gets passed back to ondragout.
         * @param {Draggable} the draggable object that was released.
         */
         function dragObjReleased(e, dObj) {
            animateBack(dObj);

            var removeClass = dom.removeClass,
                dt, i, j, id;

            if(dragOverTargets !== false) {
                for(i = 0, j = dragOverTargets.length; i < j; i++) {
                    dt = dragOverTargets[i];

                    // Did we just move off dObj dropTarget?
                    if(dt.hasDropTargetOver) {
                        if(typeof dt.ondragout == FUNCTION)
                            dt.ondragout(e, dObj);
                        if(dt.dragOverClassName)
                            removeClass(dt.el, dt.dragOverClassName);
                        dt.hasDropTargetOver = false;
                    }
                }
            }
            for(id in draggableList) {
                animateBack(draggableList[id]);
            }
            dO = null;
        }
        
        function dragDone(dObj, e) {
            if(dObj.activeDragClassName)
                dom.removeClass(dObj.el, dObj.activeDragClassName);
            if(typeof dObj.ondragend == FUNCTION && dObj.hasBeenDragged) {
                dObj.ondragend(e);
            }
            if(dObj.copyEl) { // in case user does some appending of el, et c.
                dObj.el.parentNode.insertBefore(dObj.copyEl, dObj.el);
            }
            dObj.hasBeenDragged = false;
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
        
        /* creates a copyEl for dragCopy */
        function assignClone(dObj) {

            var addClass = "addClass",
                copyEl,
                el = dObj.el,
                origEl = el,
                copyElStyle;

            if(!dObj.copyEl) {
                dObj.origEl = el;
                dObj.copyEl = el.cloneNode(true);
                dObj.copyEl.id += "Copy";
            }
            copyEl = dObj.copyEl;
            copyElStyle = copyEl.style;
            
            copyElStyle.display = "";

            if(copyEl.parentNode !== el.parentNode)
            // In case the element was appened elsewhere, by external script
                el.parentNode.insertBefore(copyEl, el);

            // 100 draggable items appear above.
            copyElStyle.zIndex = parseInt(origEl.style.zIndex, 10) + 100;
            if(dObj.origClassName)
                dom[addClass](el, dObj.origClassName);
            
            dObj.el = copyEl;
            dObj.style = copyElStyle;

            // This helps prevent copyEl from displacing other elements.
            if(dObj.isRel) {
                copyElStyle.marginBottom = -origEl.offsetHeight + 
                    -(parseInt(dom.getStyle(origEl, "marginBottom"), 10)||0) + "px";
                copyElStyle.marginright = -origEl.offsetWidth + 
                    -(parseInt(dom.getStyle(origEl, "marginRight"), 10)||0) + "px";
            }
        }
        
        function retireClone(dObj) {
    
            if(dObj.copyEl.style.display == "none") return;
        
            dObj.el = dObj.origEl;
            dObj.style = dObj.origEl.style;
            
            // Update position of origEl, which was left behind.
            dObj.moveToX(dObj.x);
            dObj.moveToY(dObj.y);
            dObj.copyEl.style.display = "none";
            if(dObj.origClassName)
                dom.removeClass(dObj.el, dObj.origClassName);
        }

        /** 
        * called on mousemove 
         */
        function carryGroup(distX, distY) {
            var o, id;
            for(id in draggableList) {
                o = draggableList[id];
                if(typeof distX == "number")
                    o.moveToX( o.origX + distX );
                if(typeof distY == "number")
                    o.moveToY( o.origY + distY );
            }
        }

        function dragStart(dObj, e) {
            if(dObj.isBeingDragged) return;
    
            if(dObj.dragCopy) {
                assignClone(dObj);  // dObj.el assigned to copyEl, dObj.origEl stays put.
            }
            if(typeof dObj.ondragstart == FUNCTION)
                dObj.ondragstart(e);
    
            if(dObj.activeDragClassName) 
                dom.addClass(dObj.el, dObj.activeDragClassName);
            // Check the coords after making the copyEl here.
            setUpCoords(e, dObj);
            dObj.isBeingDragged = true; 
        }

        function mouseDown(e) {
            if(grabbed) {
                grabbed = false;
                return;
            }
            
            e = e || self.event;
                
            var target = Event.getTarget(e),
                instances = Draggable.instances,
                dOTarg,
                testNode = target,
                metaKey = e.metaKey || e.ctrlKey;
            
            while(!dOTarg && testNode !== null) {
                dOTarg = instances[testNode.id];
                testNode = dom.findAncestorWithAttribute(testNode, "id");
            }
            if(dOTarg) { // found. 
            
                if(!dOTarg.isDragEnabled) {
                    
                    if(!metaKey) {
                        removeGroupSelection();
                    }
                    return false; // prevent focus.
                }
                
                // If it's got a handle, make sure user clicked the handle.
                if(!metaKey && dOTarg.hasHandleSet && !isInHandle(dOTarg, target) ) {
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
                //else if(typeof e.preventDefault == "function") e.preventDefault();
            } else {
                if(!metaKey) {
                    removeGroupSelection();
                    if(dO){
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
            if(metaKey) { }
            
            // Sets up dropTargets that have dragOverClassName | ondragover 
            dO = dOTarg;
            dragObjGrabbed(e, dOTarg);
           
            for(var id in draggableList) {
                dragObjGrabbed(e, draggableList[id]);
            }
            return target.tagName !== "IMG"; // Mozilla will prevent focus events for return false;
        }
        
        /** 
         * called before dragstart, this function checks to see if there are any droptargets 
         * that need mousemove consideration. For example, if the droptarget has a
         * dragOverClassName, or has an ondragover handler.
         */
        function setUpDragOver() {
            if(!dO) return;
            // subset for ondragover, to help speed up dragging 
            // with multiple drop targets.
            dragOverTargets = [];

            var dropTargets = dO.dropTargets,
                dt, i = 0, len = dropTargets.length;
           
            for(; i < len; i++) {
                dt = dropTargets[i];
                dt.initCoords();
                if(typeof dt.ondragover == FUNCTION || 
                    typeof dt.ondragout == FUNCTION || dt.dragOverClassName) 
                    dragOverTargets.push(dt);
            }
            // set to false, for quicker access on drag over.
            if(dragOverTargets.length === 0) {
                dragOverTargets = false;
            }
        }
       
        /** 
         * Called from grab() and from mousemove, when first started.
         */
        function dragObjGrabbed(e, dObj) {
            if(typeof dObj.onbeforedragstart == FUNCTION 
                && dObj.onbeforedragstart(e) == false) return true;

            var eventCoords = getEventCoords(e),
                elementPixelCoords;
            
            mousedownX = eventCoords.x;
            mousedownY = eventCoords.y;
            
            elementPixelCoords = dom.getPixelCoords(dObj.el);

            dObj.origX = dObj.grabX = elementPixelCoords.x;
            dObj.origY = dObj.grabY = elementPixelCoords.y;

            dObj.isBeingDragged = false;
        }

        /**
         * mousemove callback handler.
         */
        function mouseMove(e) {
                
            if(!dO) return;
            
            var now = +new Date;
            if(now - lastMouseMoveTime < MOUSE_MOVE_THRESHOLD) return;
            lastMouseMoveTime = now;
            e = e || self.event;
            var eventCoords = getEventCoords(e),
                ePageX = eventCoords.x, ePageY = eventCoords.y,
                distX = ePageX - mousedownX,
                distY = ePageY - mousedownY,
                isDragStopped = false,
                newX = dO.origX + distX,
                newY = dO.origY + distY,
                id;
            
            // Initiate dragging.
            if(dO.isBeingDragged === false) {
                dragStart(dO, e);
                
                for(id in draggableList) {
                    dragStart(draggableList[id], e);
             
                }
            }
    
            dO.hasBeenDragged = (dO.hasBeenDragged || (distX || distY));
            
            var isLeft = newX < dO.minX,
                isRight = newX > dO.maxX,
                isAbove = newY < dO.minY,
                isBelow = newY > dO.maxY,
                isOutsideContainer = dO.container != null,
                hasOnDrag = (typeof dO.ondrag == FUNCTION),
                isBeforeExitContainerFunction = typeof dO.onbeforeexitcontainer == FUNCTION,
                planesStopped = 0;
            
            if(typeof dO.onbeforedrag == FUNCTION && dO.onbeforedrag(e) == false) return;                
            
            isOutsideContainer &= ( isLeft || isRight || isAbove || isBelow );
            if(isOutsideContainer && (isBeforeExitContainerFunction || 
                                    dO.onbeforeexitcontainer() == false)) {
                if(isLeft) {
                    if(!dO.isAtLeft) {
                        dO.moveToX( dO.minX );
                        // dO.minX - dO.origX = max possible negative distance to travel.
                        carryGroup(dO.minX - dO.origX, null);
                        if(hasOnDrag)
                            dO.ondrag(e);
                        dO.isAtRight = false;
                        dO.isAtLeft = true;
                        planesStopped += 1;
                    }
                } else if(isRight) {
                    if(!dO.isAtRight) {
                        dO.moveToX( dO.maxX );
                        // dO.maxX - dO.origX = max possible positive distance to travel.
                        carryGroup(dO.maxX - dO.origX, null);
                        if(hasOnDrag)
                            dO.ondrag(e);
                        dO.isAtRight = true;
                        dO.isAtLeft = false;
                        planesStopped += 1;
                    }
                } else {
                    dO.isAtLeft = dO.isAtRight = false;
                    dO.moveToX( newX );
                    carryGroup(distX, null);
                }
                if(isAbove) {
                    if(!dO.isAtTop) {
                        dO.moveToY( dO.minY );
                        // dO.minY - dO.origY = max possible positive distance to travel.
                        carryGroup(null, dO.minY - dO.origY);
                        if(hasOnDrag)
                            dO.ondrag(e);
                        dO.isAtTop = true;
                        dO.isAtBottom = false;
                        planesStopped += 1;
                    }
                } else if(isBelow) {
                    if(!dO.isAtBottom) {
                        if( dO.maxY > 0 )
                            dO.moveToY( dO.maxY );
                        // dO.maxY - dO.origY = max possible positive distance to travel.
                        carryGroup(null, dO.maxY - dO.origY);
                        if(hasOnDrag)
                            dO.ondrag(e);
                        dO.isAtTop = false;
                        dO.isAtBottom = true;
                        planesStopped += 1;
                    }
                } else {
                    dO.isAtTop = dO.isAtBottom = false;
                    dO.moveToY( newY );
                    carryGroup(null, distY);
                }
                
                isDragStopped = planesStopped == 2;
                
                if(isDragStopped && typeof dO.ondragstop == FUNCTION) {
                    dO.ondragstop(e);
                } else {
                    if(hasOnDrag)
                        dO.ondrag(e);
                }
            } else {            // In container.
                dO.isAtLeft = dO.isAtRight =
                    dO.isAtTop = dO.isAtBottom = false;
                dO.moveToX( newX );
                dO.moveToY( newY );
                carryGroup(distX, distY);
                if(hasOnDrag)
                    dO.ondrag(e);
            }
           
            // Handle dropTarget dragOver    
            if(dragOverTargets !== false)  {
                var coords = { x:ePageX, y:ePageY },
                    i = 0, 
                    j = dragOverTargets.length,
                    dt,
                    isInTarget,
                    dragEvent = {domEvent:e, dragObj:dO};
               for(; i < j; i++) {
                    dt = dragOverTargets[i];
                    isInTarget = dt.containsCoords(coords);
                    // Did we just move over this dropTarget?
    
                    if(!dt.hasDropTargetOver && isInTarget) {
                        dt.hasDropTargetOver = true;
    
                       if(typeof dt.ondragover == FUNCTION)
                            dt.ondragover(dragEvent); // typeof check now needed.
                        if(dt.dragOverClassName)
                            dom.addClass(dt.el, dt.dragOverClassName);
                    } else { // Were we previously over this dropTarget?
                        if(dt.hasDropTargetOver && !isInTarget) { 
                            if(typeof dt.ondragout == FUNCTION)
                                dt.ondragout(dragEvent);
                            if(dt.dragOverClassName)
                                dom.removeClass(dt.el, dt.dragOverClassName);
                            dt.hasDropTargetOver = false;
                        }
                    }
                }
            }
            return false;
        }
        
        function mouseUp(e) {
            grabbed = false;
            var isRandomMouseMoveEvent = (dO && dO.isBeingDragged && !dO.hasBeenDragged);
            if(!dO || !dO.hasBeenDragged && !isRandomMouseMoveEvent) {
                if(!keepUserSelection){
                    dO = null;
                }
                return;
            }
            keepUserSelection = false;
            e = e || self.event;
            
            var id, item;
            if(dO.copyEl) 
                retireClone(dO);
            for(id in draggableList) {
                item = draggableList[id];
                if(item.copyEl) 
                    retireClone(item);
            }
            
            // if it's been dragged onto a dropTarget, fire that event.
            var targets = dO.dropTargets,
                len = targets.length, o, x, y;
            if(len > 0) {
                var coords = getEventCoords(e),
                    dropTarget, i = 0;
                for(; i < len; i++) {
                    dropTarget = targets[i];
    
                    if(dropTarget.containsCoords(coords)) {        
                        if(typeof dropTarget.ondrop == FUNCTION) {
                            dropTarget.ondrop({domEvent:e, dragObj:dO, dropTarget:dropTarget});
                        }
                        for(id in draggableList)  { // Assume that draggable groups share dropTargets.
                            if(id === dropTarget.id) continue;
                            if(typeof dropTarget.ondrop == FUNCTION) {
                                o = draggableList[id];
                                dropTarget.ondrop({domEvent:e, dragObj:o, dropTarget:dropTarget}); 
                            }
                        }
                        if(dropTarget.dragOverClassName)
                            dom.removeClass(dropTarget.el, dropTarget.dragOverClassName);
                        break;
                    }
                }
            }
            for(id in draggableList) {
                o = draggableList[id], 
                    x = o.x, y = o.y;
                if(x < o.minX)
                    o.moveToX(o.minX);
                else if(x > o.maxX)
                    o.moveToX(o.maxX);
                if(y < o.minY)
                    o.moveToY(o.minY);
                else if(y > o.maxY)
                    o.moveToY(o.maxY);
                if(o.hasBeenDragged)
                    dragDone(o, e);
            }
            dragDone(dO, e);
            dO = null;
        }

        /** 
         * Key event callback handler. 
         * When ESC key is pressed, 
         * draggables are released.
         */
        function keyDown(e) {
            e=e||self.event;
            if(e.keyCode == 27) { // esc key.
                if(dO) {
                    dO.release(e);
                }
            }
        }    

        function glideStart(dObj, x, y) {
             if(dObj.animTimer) return;

             dObj.startX = x||0;
             dObj.startY = y||0;
     
             var dx = dObj.startX - dObj.grabX,
                 dy = dObj.startY - dObj.grabY;
     
             // Calculate Hypoteneuse.
             dObj.glideDist = Math.ceil(Math.sqrt((dx * dx) + (dy * dy)));
     
             if(dObj.glideDist === 0) return;
             dObj.rx = Math.abs(dx)/dObj.glideDist;
             dObj.ry = Math.abs(dy)/dObj.glideDist;
             if(dObj.x > dObj.grabX)
                 dObj.rx = -dObj.rx;
             if(dObj.y > dObj.grabY)
                 dObj.ry = -dObj.ry;
             
             dObj.startTime = +new Date;
             dObj.animTimer = self.setInterval(
                  function(){
                      glide(dObj, typeof dObj.onglide == FUNCTION);
                  }, 10);
         }
     
        function glide(dObj, hasOnglide) {
            var t = new Date - dObj.startTime,
            // 2px per 10ms slight acceleration 10px/s
                d = Math.ceil(2 * t + .5 * .01 * t*t);
            if(d >= dObj.glideDist) {
               
                dObj.animTimer = self.clearInterval(dObj.animTimer);
                dObj.moveToX( dObj.grabX );
                dObj.moveToY( dObj.grabY );
                if(dObj.copyEl) {
                    dObj.el = dObj.origEl;
                    dObj.style = dObj.origEl.style;
                    dObj.copyEl.style.display = "none";
                }
                if(typeof dObj.onglideend == FUNCTION) 
                    dObj.onglideend();
                dragDone(dObj, {});
            } else {
                if(hasOnglide) { // useful for Slider.
                    dObj.onglide();
                }
                dObj.moveToX(dObj.startX + d * dObj.rx);
                dObj.moveToY(dObj.startY + d * dObj.ry);
            }
        }
        
        function glideEnd(dObj) {
            if(typeof dObj.onglideend == FUNCTION) 
                dObj.onglideend();
            dragDone(dObj, {});
        }
        
        /** Starts gliding the draggable back to its original x,y coords. 
         * @param {Number} [x] x coordinate to start gliding from.
         * @param {Number} [y] y coordinate to start gliding from.
         */
        function animateBack(dObj, x, y) {
           glideStart(dObj, dObj.x||x, dObj.y||x);
        }

        return {
            /** @type {boolean} 
             * @description set to true to make a temporary "ghost" copy dragged.
             */
            dragCopy : false,
        
            /** @type {boolean} 
             * @description set to true to allow this to be dragged as a group.
             */
            dragMultiple : false,
         
            isSelected : false,
        
            /** @event Is about to move. */
            onbeforedrag : undef,
        
            /** @event Has been grabbed. */
            onbeforedragstart : undef,
           
            /** @event Mouse has moved. */
            ondragstart : undef,
             
           /** @event Being dragged */
            ondrag : undef,
         
           /** @event
            *  @description Dragging stopped before it escaped its container. 
            */
            ondragstop : undef,
         
            /** @event Dragging completed (as a result of mouseup). */
            ondragend : undef,
         
        
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
            
            /* className to add when selected. */
            selectedClassName : "",
            
            /* className to add before being dragged. */
            activeDragClassName : "",

            useHandleTree : true,
        
            hasHandleSet : false,
        
            /** Sets a handle on a draggable 
             * @param {HTMLElement} el the element to use as a handle.
             * By default, the handle is the draggable.
             * @param {boolean} [setHandleTree] if true, the draggable can use anything in the 
             * handle's subtree for dragging.
             */
            setHandle : function(el, setHandleTree){
                this.handle = el;
                this.hasHandleSet = true;
                // Make sure caller didn't forget the secondParam and expect true.
                this.useHandleTree = setHandleTree != false;
            },
            
            /** 
             * Adds a drop target.
             * @param {HTMLElement|APE.drag.DropTarget} dropTarget either an element or a DropTarget.
             * @return {DropTarget} The drop target that was added.
             */
            addDropTarget : function(dropTarget) {
                var dt = DropTarget.getByNode(dropTarget),
                    el = dt.el,
                    dropTargets = this.dropTargets;
                if(this.el === el) return dt;
                return dropTargets[dropTargets.length] = DropTarget.getByNode(el);
            },
            
            /** 
             * Grabs the draggable, centering it under the cursor.
             * @param {Event} e the event to grab the element from.
             * @param {int} [xOffset] amount of horizontal adjustment to apply.
             * @param {int} [xOffset] amount of vertical adjustment to apply.
             */
            grab : function(e, xOffset, yOffset) {
                if(!e) e = self.event;
                
                var target = Event.getTarget(e);
                
                if(e.preventDefault) e.preventDefault();
                e.returnValue = false;
                
                if(dom.contains(this.el, target)) return;
                    
                var grabCoords = dom.getPixelCoords(this.el);        
                this.grabX = grabCoords.x;
                this.grabY = grabCoords.y;
                
                // Get the container's offset.
                var eventCoords = getEventCoords(e),
                    offsetCoords = dom.getOffsetCoords(dom.getContainingBlock(this.el)),
                    offsetX = eventCoords.x - offsetCoords.x,
                    newX = offsetX - (0|this.handle.offsetWidth/2);
                    offsetY = eventCoords.y - offsetCoords.y,
                    newY = (offsetY - (0|this.handle.offsetHeight/2)),
                    handleOffsetCoords = dom.getOffsetCoords(this.handle, this.el);
                
                if(this.keepInContainer) {
                    newX = Math.max(newX, 0);
                    newX = Math.min(newX, this.container.clientWidth - this.el.offsetWidth);
                    newY = Math.max(newY, 0);
                    newY = Math.min(newY, this.container.clientHeight - this.el.offsetHeight);
                }
                this.moveToX(newX- handleOffsetCoords.x + (xOffset||0));
                this.moveToY(newY - handleOffsetCoords.y + (yOffset||0));
                    
                dragObjGrabbed(e, this); 
                grabbed = true;
                dO = this;
            },
            
            /**
             * releases the draggable, as if the mouse had been released.
             * @param {Event} [e] the event that triggered release
             */
            release : function(e) {
                dragObjReleased(e, this);
                if(typeof this.onrelease == FUNCTION) 
                    this.onrelease(e);
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
            removeDropTarget : function(el){
                var el = document.getElementById(el.id),
                    dts = this.dropTargets, i, len; 
                
                for(i = 0, len = dts.length; i < len; i++) {
                    if(dts[i].el === el) {
                        dts.splice(i, 1);
                        return el;
                    }
                }
                return null;
            },
                    
            toString : function() { return "Draggable(id=" +this.id +")"; }
        };
    }
    
    /** @param {id} element id. */
    function DropTargetC(id) {
        this.el = document.getElementById(id);
        this.id = id;
    }

    function createDropTargetPrototype(){
        return {        
            /* the className to add when selected. */
            dragOverClassName : "",
        
            initCoords : function() {
                if(!this.coords) this.coords = {};
                dom.getOffsetCoords(this.el, document, this.coords);
                this.coords.w = this.el.clientWidth;
                this.coords.h = this.el.clientHeight;
            },
        
            /** checks to see if the coordinates 
             *  x and y are both inside dropTarget
             * @param {Object} curs {x,y} coordinates of the event.
             */
            containsCoords : function(curs) {
                 // check for x, then y.
                var dt_x = this.coords.x, dt_y = this.coords.y;
                
                return (curs.x >= dt_x && curs.x <= dt_x + this.coords.w)
                    && // now check for y.
                    (curs.y >= dt_y && curs.y <= dt_y + this.coords.h);
            },
        
            /** @event Dragged over a droptarget */
            ondragover : false,
            
            /** @event Dragged off a droptarget */
            ondragout : undef,
        
            /** @event Hit a drop target. Fires for each object being dragged. */
            ondrop : undef
        };
    }
})();/** slider.js * (c) 2007 Garrett Smith * http:// dhtmlkitchen.com * * requires: Draggable, EventPublisher */(function(){    var APE = self.APE,        drag = APE.drag,        dom = APE.dom,        Slider = drag.Slider = APE.createFactory(SliderC, createSliderProto),        HORZ = 1,        VERT = 2,        MINVAL = "minValue",        MAXVAL = "maxValue";        Slider.direction = {        HORZ : HORZ,        VERT : VERT    };    function SliderC(id, dir, minValue, maxValue) {        this.id = id;        this.dir = dir;        this.value = 0;        this.rationalValue = 0;            var handle = drag.Draggable.getById(id, dir);        handle.keepInContainer = true;        this.handle = handle;        this[MINVAL] = minValue||0;        this[MAXVAL] = maxValue;        this.tDist = 0;        this.init();    }        function createSliderProto() {                        // IE and Webkit ignore keyEvents on the element.        APE.EventPublisher.add(document, "onkeydown", _keyDown);        var ACTIVE_TRACKBAR = "ape-slider-track-active",            activeSlider = null;                return {                         init : function() {                var EventPublisher = APE.EventPublisher,                    el = document.getElementById(this.id),                    handle = this.handle,                    container = this.trackbar = document.getElementById(this.id).parentNode;                                EventPublisher.add(handle, "onglideend", dragEnd, this);                EventPublisher.add(handle, "ondragend", dragEnd, this);                EventPublisher.add(handle, "onglideend", dragEnd, this);                EventPublisher.add(handle, "ondrag", sliderSlid, this);                EventPublisher.add(el, "onfocus", sliderFocus, this);                EventPublisher.add(el, "onblur", sliderBlur, this);                EventPublisher.add(handle, "onglide", sliderSlid, this);                EventPublisher.add(handle, "ondragstop", sliderSlid, this);                if(this.dir === VERT){                    this.tDist = container.clientHeight - el.offsetHeight;                    handle.moveToX = moveToNo;                } else {                    this.tDist = container.clientWidth - el.offsetWidth;                    handle.moveToY = moveToNo;                }                        // Default: use pixels for min/max.                if(this[MAXVAL] === undefined)                     this[MAXVAL] = this.tDist;                EventPublisher.add(container, "onmousedown", trackbarMouseDown, container);            },                    ticks : 15,                        	rationalValue : 0,                	slideToX : function(x) {            	this.handle.moveToX(x);            	if(typeof slider.onslide === "function")                	slider.onslide();                            },                        /** setValue moves the slider to x or y coordinate based on value              */        	setValue : function(v) {                // keep in range, throw no error.             	v = Math.max(this[MINVAL], v);            	v = Math.min(this[MAXVAL], v);                    	var h = this.handle,                    d = this[MAXVAL] - this[MINVAL],                    rationalValue = (v - this[MINVAL]) / d;                        // Somehow testKey* functions in IE result                 // in a Draggable with no properties.                 if(!h || !h.id) return;            	if(this.dir === VERT) {                             	h.moveToY(this.tDist  * (1 - rationalValue));                } else {                 	h.moveToX(this.tDist * rationalValue );                }            	this.rationalValue = rationalValue;            	this.value = v;            },                    	slideToY : function(y) {            	this.handle.moveToY(y);            	this.onslide();            },                    	setRationalValue : function(fRat, bOnslide) {            	fRat = Math.max(0, fRat);            	fRat = Math.min(1, fRat);            	this.rationalValue = fRat;            	this.setValue(this[MINVAL] + (fRat * (this[MAXVAL] - this[MINVAL])));            	if(bOnslide)                	sliderSlid.call(this, {});            },                        toString : function(){                 return"Slider: " + this.handle.toString();            }        };        function moveToNo(){}                 function trackbarMouseDown(e) {            var target = dom.Event.getTarget(e),                slider;            if(target !== this) return true;            slider = Slider.instances[this.getElementsByTagName("*")[0].id];            e = e||self.event;            if(e.preventDefault)                e.preventDefault();                dom.addClass(this, ACTIVE_TRACKBAR);            slider.handle.grab(e);            sliderSlid.call(slider, e);            return false;        }                    function dragEnd(e) {            dom.removeClass(this.trackbar, ACTIVE_TRACKBAR);            sliderSlid.call(this, e);            if(typeof this.onslideend === "function")                this.onslideend(e);         }                 function sliderFocus(e) {            activeSlider = this;            dom.addClass(this.trackbar, ACTIVE_TRACKBAR);        }                function sliderBlur(e) {            if(activeSlider === this)                activeSlider = null;            dom.removeClass(this.trackbar, ACTIVE_TRACKBAR);        }                        function sliderSlid(e) {             this.value = 0;            var el = document.getElementById(this.id),                rationalValue = 0;                if(this.dir === HORZ) {                if(el.offsetLeft > 0) {                    rationalValue = el.offsetLeft / this.tDist;                } else {                    rationalValue = 0;                }            } else {                if(el.offsetTop > 0) {                    var distFromBottom = this.tDist - el.offsetTop;                    rationalValue = distFromBottom / this.tDist;                } else {                    rationalValue = 1;                }            }            this.rationalValue = rationalValue;            this.value = rationalValue * (this[MAXVAL] - this[MINVAL]);            if(this.onslide) this.onslide(e||{});         }            var lastKeyTime;        function _keyDown(e) {            e = e||self.event;            if(e.stopPropagation) {                // Safari 3 doesn't actually stop propagation; ignores cancelBubble = true.                // Doesn't support originalTarget, either.                e.stopPropagation();            }            e.cancelBubble = true; // just in case some actually fires a keyEvent on a handle.                // IE, Opera, Webkit all need this:            // If stopPropagation and cancelBubble fail, check the timeStamp.            // If the timeStamp is recurrant, exit.            // Opera 9.2: timeStamp is always 0. always. IE does not support event.timeStamp.            var timeStamp = +new Date,                 slider = activeSlider;            if(!slider) return;            if(timeStamp - lastKeyTime < 5) return; // recurrant.            lastKeyTime = timeStamp; // record.            var keyCode = e.keyCode,                tickval,                lArr = keyCode === 37,                rArr = keyCode === 39,                uArr = keyCode === 38,                dArr = keyCode === 40;                if( !(lArr || rArr || uArr || dArr) ) return true;                if(slider.id in Slider.instances) {                tickval = slider[MAXVAL]/slider.ticks;                if(lArr || dArr) {                    tickval = -tickval;                }                slider.setValue(slider.value + tickval);                if(slider.onslide)                    slider.onslide(e);                return false;            }        }    }     })();