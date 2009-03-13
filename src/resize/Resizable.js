/**
 * @author Garrett Smith
 *
 * @requires APE.MouseTracker
 */
 
APE.namespace("APE.resize");

APE.resize.Resizable = function(id) {
    this.id = (typeof id == "string" ? id : id.id);
    this.proxyId = this.id + "-proxy";
    this.create();

    APE.MouseTracker.register(this, this.proxyId);
};

APE.resize.Resizable.getById = APE.getById;
APE.resize.Resizable.getByNode = APE.getByNode;

APE.resize.Resizable.prototype = {

    create : function() {
        var el = document.getElementById(this.id),
            APE = window.APE,
            dom = APE.dom,
            position = dom.getStyle(el, "position"),
            proxy = document.createElement("div");

        proxy.id = this.proxyId;
        APE.EventPublisher.add(proxy, "onmouseover", this.mouseOver, this);
        proxy.className = "ape-resize-container";

        if(!/^(?:r|a|f)/.test(position))
            position = "relative";
        proxy.style.position = el.style.position = position;

        
        if(el.currentStyle && "hasLayout"in el.currentStyle &&
            !el.currentStyle.hasLayout) {
            el.style.zoom = 1;
        }

        el.parentNode.insertBefore(proxy, el);
        proxy.appendChild(el);
        this.pack();
    },
    
    pack : function() {
        var proxy = document.getElementById(this.proxyId),
            ps = proxy.style,
            el = document.getElementById(this.id);
        ps.width = el.offsetWidth;
        ps.height = el.offsetHeight;
    },

    getResizeType : function(e, proxyEl) {
        var resizeType = "",
            clientHeight = proxyEl.clientHeight,
            clientWidth = proxyEl.clientWidth;

        if(ex < proxyEl.clientTop) {
            resizeType = "n";
        }
        else if(ex > clientHeight) {
            resizeType = "s";
        }

        if(e.clientX > clientWidth) {
            resizeType += 'e';
        }
        else if(e.clientX < proxyEl.clientLeft) {
            resizeType += 'w';
        }
        return resizeType;
    },

    mouseDown : function(e) {
        var target = APE.dom.Event.getTarget(e),
            proxyEl = document.getElementById(this.id);
        this.getResizeType(e, proxyEl);
        console.log(e);
        if(target.id === this.proxyId) {
            return true;
        }
    },

    isInHandle : function(target) {
        return target.id === this.proxyId;
    },

    mouseOver : function(e) {
        var target = this.getEventTarget(e),
            resizeType;
        if(this.isInHandle(target)) {
            resizeType = this.getResizeType(e, document.getElementById(this.proxyId));
        console.log(resizeType);
            target.style.cursor = resizeType + "-resize";
        }
        else target.style.cursor = "";
    },

    mouseMove : function(e) {
        var proxy = document.getElementById(this.proxyId),
            ps = proxy.style,
            el = document.getElementById(this.id);

        console.log(e);
    },

    mouseUp : function(e) {
        console.log(e);
        return true;
    },

    getEventTarget : APE.dom.Event.getTarget
};