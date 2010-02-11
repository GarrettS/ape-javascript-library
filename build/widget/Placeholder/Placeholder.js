/**
 * @fileoverview Placeholder widget works like Apple Webkit |placeholder| attribute.
 * adds class "defaultState"
 * @requires APE.EventPublisher, APE.dom (classname-f.js)
 */

APE.namespace("APE.widget").defineCustomFactory("Placeholder",
    function(Placeholder){
    var IS_NATIVE, 
        PLACEHOLDER = "placeholder";
        
    IS_NATIVE = Placeholder.IS_NATIVE = 
        PLACEHOLDER in document.createElement("input");
    
    return createPlaceholder;
    
    function createPlaceholder() {
        
        function PlaceholderC(id) {
            this.id = id;
            if(!IS_NATIVE) {
                this.initEvents();
            }
        }
    
        var APE = self.APE,
            dom = APE.dom,
            // Private instance data.
            inpValue = {};
        
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
                addCallback(inp, "focus", inpFocused);
                addCallback(inp, "blur", inpBlurred);
                addCallback(inp, "drop", inpPotentialChange);// drop some text.
            },
            
            detachEvents : function() {
                var removeCallback = APE.dom.Event.removeCallback,
                    inp = document.getElementById(this.id),
                    inpEvents;
                if(inp){
                    removeCallback(inp, "focus", inpFocused);
                    removeCallback(inp, "blur", inpBlurred);
                    removeCallback(inp, "drop", inpPotentialChange);  
                }
            }
        };
    
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
        return PlaceholderC;
    }
});