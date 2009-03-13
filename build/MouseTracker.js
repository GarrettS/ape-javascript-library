APE.MouseTracker = {

    subscribers : { },

    activeObject : null,

    register : function(subscriber, id) {
        id = id || subscriber.id;

        if(!this.subscribers.hasOwnProperty(id)) 
            this.subscribers[id] = [ ];
        if(!this.inited)
            this.init();
        var stack = this.subscribers[id],
            i = 0, len = stack.length;
        while(i < len) {
            if(subscriber = stack[i++]) return false;
        }
        stack[i] = subscriber;
        return true;
    },

    unregister : function(subscriber, id) {
        id = id || subscriber.id;
        var x = this.subscribers[id],
            i = 0,
            len;
        if(x) {
            len = x.length;
            while(i++ < len) {
                if(x[i] === subscriber)
                    x.splice(i, 1);
            }
        }
        return x;
    },

    init : function() {
        
        var d = document,
            docEl = d.documentElement,
            ds = docEl.style;
        APE.EventPublisher.add(d, "onmousedown", this.mouseDown, this);
        APE.EventPublisher.add(d, "onkeypress", this.keyPressed, this);
        APE.EventPublisher.add(d, "onmousemove", this.mouseMove, this);
        APE.EventPublisher.add(d, "onmouseup", this.mouseUp, this);

        // prevent text selection while dragging.
        if('onselectstart' in d) {
            APE.EventPublisher.get(d, "onselectstart").addBefore(this.hasActiveObject, this);
        }
        else {
            APE.EventPublisher.get(d, "onmousedown").addAfter(this.preventUserSelection, this);
            APE.EventPublisher.get(d, "onmouseup").addAfter(this.preventUserSelection, this);
        }
        this.inited = true;

        this.userSelectType = "MozUserSelect"in ds ? "MozUserSelect" : 
            "KhtmlUserSelect"in ds ? "KhtmlUserSelect" : "userSelect"in ds ? "userSelect" : "";
    },

    hasActiveObject : function() {
        return this.activeObject != null;
    },

    preventUserSelection : function() {
        document.documentElement.style[this.userSelectType] = (this.activeObject ? "none" : "");
    },

    mouseDown : function(e) { 
    // TODO: This is too complicated. Focus/selection. DragMultiple. draggableList. 
    // Need a way to encapsulate those complexities.
        if(!e) 
            e = event;
            
        var APE = window.APE,
            dom = APE.dom,
            target = dom.Event.getTarget(e),
            activeObject = null,
            instances = APE.MouseTracker.subscribers,
            i = 0, len;

        for(var testNode = target;activeObject == null && testNode != null;
                            testNode = dom.findAncestorWithAttribute(testNode, "id")) {
            if(testNode !== null) {
                activeObject = instances[testNode.id];
            }
        }
        
        if(activeObject) { // found. 

            this.mousedownX = ('pageX'in e ? e.pageX : e.clientX + scrollOffsets.left);
            this.mousedownY = ('pageY'in e ? e.pageY : e.clientY + scrollOffsets.top);
            for(var len = activeObject.length; i < len; i++) {
                if(activeObject[i].mouseDown(e))
                    this.activeObject = activeObject[i];
            }
        }
    },

    getEventCoords : APE.dom.Event.getCoords,

    mouseMove : function(e) {

        var activeObject = this.activeObject;
        
        if(!e)
            e = event;
        
        if(activeObject == null) return;
 
        var eventCoords = this.getEventCoords(e),
            ePageX = eventCoords.x, ePageY = eventCoords.y,
            distX = ePageX - this.mousedownX,
            distY = ePageY - this.mousedownY;

        activeObject.newX = activeObject.origX + distX;
        activeObject.newY = activeObject.origY + distY;
        activeObject.mouseMove(e);
    },

    mouseUp : function(e) {

        if(this.activeObject == null) {
            return;
        }
    // IE will fire this event twice when mouse was held.

        if(!e)
            e = event;
        
        var activeObject = this.activeObject;
        if(activeObject.mouseUp(e))
            this.activeObject = null;
    },

    keyPressed : function(){}
};