/**
 * PageJS to hide/show the appropriate panel.
 */

APE.namespace("APE.widget");

/**
 * @constructor
 * @param id
 */
APE.widget.Panel = function(id){
    this.id = id;
};
APE.widget.Panel.activeId = "";

APE.widget.Panel.prototype = {
    show : function() {
        APE.widget.Panel.activeId = this.id;
        document.getElementById(this.id).style.display = "block";
        var actuatorId = this.id.replace(/Panel$/, "Actuator"),
            actuator = document.getElementById(actuatorId);
        if(actuator) {
            APE.dom.addClass(actuator, "actuatorActive");
        }
    },
    hide : function() {
        document.getElementById(this.id).style.display = "none";
        APE.widget.Panel.activeId = "";
        var actuatorId = this.id.replace(/Panel$/, "Actuator"),
            actuator = document.getElementById(actuatorId);
        if(typeof this.onhide == "function") {
            this.onhide();
        }
        if(actuator) {
            APE.dom.removeClass(actuator, "actuatorActive");
        }
    }
};

APE.widget.Panel.getById = APE.getById;

(function(){
    var dom = APE.dom,
        body = document.body;
    dom.Event.addCallback(body, "click", documentClickHandler);
    dom.Event.addCallback(body, "mousedown", hideActivePanel);
    body = null;
    
    var panelIds = {};

    /**
     * If a user clicked in the leftnav, see if the target is
     * a panelActuator.
     * @param e
     */
    function documentClickHandler(e) {
        var target = dom.Event.getTarget(e),
            id = target.id,
            d = document,
            panelEl,
            Panel = APE.widget.Panel,
            actuatorExp = /Actuator$/;

        if(!id || !actuatorExp.test(id)) return;

        // look for a panelEl, with id baseId + "Panel"
        id = id.replace(actuatorExp, "Panel");
        e = e||event;
        if(e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

        hideActivePanel();
        panelEl = d.getElementById(id);

        // Save the panelEl and initialize it.
        
        if(!(id in panelIds)){
            panelIds[id] = id;

            // A Panel stops the event bubble when clicked.
            dom.Event.addCallback(panelEl, "mousedown", stopPropagation);
        }
        Panel.getById(id).show();
    }

    function hideActivePanel() {
        var Panel = APE.widget.Panel;
        if(!Panel.activeId) return;
        Panel.getById(Panel.activeId).hide();
    }

    /**
     * panelEl click events stop propagating so as not to trigger
     * document mousedown handler.
     * @param {MouseEvent} e
     */
    function stopPropagation(e) {
        e = e||window.event;
        if(e.stopPropagation) e.stopPropagation();
        e.cancelBubble = true;

        var dom = APE.dom, target = dom.Event.getTarget(e);
        if(dom.hasToken(target.className, "panelClose")) {
            APE.widget.Panel.getById(this.id).hide();
        }
    }
})();