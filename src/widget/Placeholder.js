/**
 * @fileoverview Placeholder widget works like Apple Webkit |placeholder| attribute.
 * adds class "defaultState"
 * @requires APE.dom.Event
 */
(function(){
    APE.namespace("APE.widget");
    APE.widget.Placeholder = Placeholder;
    Placeholder.getById = APE.getById;

    function Placeholder(id) {
        this.id = id;
        this.labelId = id + "Label";
        var label = document.getElementById(this.labelId);
        this.placeholderText = label && label.firstChild.data || "";
        this.init();
    }

    Placeholder.prototype = {
        init : function() {
            var inp = document.getElementById(this.id),
                addCallback = APE.dom.Event.addCallback;

            addCallback(inp, "focus", inpFocused);
            addCallback(inp, "blur", inpBlurred);
            addCallback(inp, "keydown", inpKeyDown);
            addCallback(inp, "keyup", inpPotentialChange);
            addCallback(inp, "mouseup", inpPotentialChange); // Potential paste or dragdrop.
        },

        /**
         * @fires onreset(true)
         */
        reset : function() {
            var inp = document.getElementById(this.id);

            if(!inp) return;
            inp.value = inp.defaultValue = this.placeholderText;
            APE.dom.addClass(inp.form, 'defaultState');
            this.onreset(true);
        },

        isEmpty : function() {
            var inp = document.getElementById(this.id),
                trimExp = /^\s+|\s+$/g,
                value = inp.value.replace(trimExp, ""),
                labelTxt = this.placeholderText;
            return value === "" || (!!labelTxt && value === labelTxt.replace(trimExp, ""));
        },

        /**
         * @event
         * @param {boolean} usePlaceholderText - if true, input.value is set to label.textContent.
         * Otherwise, input.value is set to input.defaultValue
         */
        onreset : function(usePlaceholderText) { }
    };

    function inpBlurred() {
        var dom = APE.dom,
            ph = Placeholder.getById(this.id);

        dom.removeClass(this, 'focus');
        if(ph.isEmpty()){
            dom.addClass(this.form, "defaultState");
            this.value = ph.placeholderText;
        } else {
            dom.removeClass(this.form, 'defaultState');
        }
    }

    /** IE6,7 not support :focus */
    function inpFocused() {
        var ph = Placeholder.getById(this.id);
        APE.dom.addClass(this, "focus");
        if(this.value === ph.placeholderText){
            this.value = "";
        }
    }

    /**
     * @fires onreset (false)
     */
    function inpKeyDown(ev) {
        ev = ev || event;
        // If ESC key pressed, blur input and reset form.
        if(ev.keyCode === 27) {
            this.value = this.defaultValue;
            try {
                this.blur();
            } catch(xxx_mozilla_permission_denied_to_get_property_XULElement_selectedIndex) {}
            Placeholder.getById(this.id).onreset(false);
        }
    }

    function inpPotentialChange() {
        var dom = APE.dom,
            ph = Placeholder.getById(this.id);

        if(ph.isEmpty()) {
            dom.addClass(this.form, 'defaultState');
        } else  {
            dom.removeClass(this.form, 'defaultState');
        }
    }
})();
