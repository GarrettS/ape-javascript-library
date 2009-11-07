APE.namespace("APE.widget");
/**
 * @fileoverview Placeholder widget works like Apple Webkit |placeholder| attribute.
 * adds class "defaultState"
 * @requires APE.EventPublisher, APE.dom (classname-f.js)
 */
(function(){
    var APE = self.APE,
        widget = APE.widget,
        Placeholder = APE.createFactory(PlaceholderC),
        dom = APE.dom,
        IS_NATIVE, 
        PLACEHOLDER = "placeholder";
        
    IS_NATIVE = Placeholder.IS_NATIVE = 
        PLACEHOLDER in document.createElement("input");
    
    widget.Placeholder = Placeholder;
    
    function PlaceholderC(id) {
        this.id = id;
        if(!IS_NATIVE) {
            this.initEvents();
        }
    }
    
    // Private instance data.
    var inpValue = {}, 
        events = {};
    
    PlaceholderC.prototype = {
        initEvents : function() {
            var inp = document.getElementById(this.id), 
            // Gecko does not handle "ondrop"; must use "addEventListener"
            // registration.
                addCallback = APE.dom.Event.addCallback;

            inpValue[inp.id] = inp.value;
            if(isEmpty(inp)) {
                showPlaceholderText(inp);
            }
            events[inp.id] = { 
                "focus" : addCallback(inp, "focus", inpFocused),
                "blur" : addCallback(inp, "blur", inpBlurred),
                "drop" : addCallback(inp, "drop", inpPotentialChange)// drop some text.
            }; 
        },
        
        detachEvents : function() {
            var removeCallback = APE.dom.Event.removeCallback,
                inp = document.getElementById(this.id),
                inpEvents;
            if(inp){
                inpEvents = events[inp.id];
                if(inpEvents) {
                    removeCallback(inp, "focus", inpEvents.focus);
                    removeCallback(inp, "blur", inpEvents.blur);
                    removeCallback(inp, "drop", inpEvents.drop);  
                    delete events[inp.id];
                    delete inpValue[inp.id];
                }
            }
        }
    };

    // Save the real value.
    function inpChanged(){
        inpValue[this.id] = this.value;
    }

    /* sets placeholderText and manages state in inpValue */
    function showPlaceholderText(inp) {
        inpValue[inp.id] = inp.value;
        inp.value = inp.getAttribute(PLACEHOLDER);
        dom.addClass(inp, PLACEHOLDER);
    }
    
    function inpBlurred() {
        if(isEmpty(this)){
            showPlaceholderText(this);
        } else {
            inpValue[this.id] = this.value;
        }
    }

    function inpFocused() {
        dom.removeClass(this, PLACEHOLDER);
        if(!inpValue[this.id]) {
            this.value = "";
        }
    }

    function inpPotentialChange(ev) {
        if(!isEmpty(this)) {
            dom.removeClass(this, PLACEHOLDER);
        }
    }
    
    function isEmpty(inp) {
        return inp.value === "";
    }
})();