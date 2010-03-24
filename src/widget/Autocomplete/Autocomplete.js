APE.namespace("APE.widget").defineCustomFactory("Autocomplete", function(Autocomplete) {
    var APE = window.APE,
        dom = APE.dom,
        key = dom.key,
        anim = APE.anim,
        Event = dom.Event,
        DelegateFactory = APE.widget.DelegateFactory,
        SELECTED_CLASS = "ape-autocomplete-item-selected",
        HOVER_CLASS = "ape-autocomplete-item-hover",
        CAN_SCROLL_INTO_VIEW,
        requiredFields = getRequiredFields(),
        optionalFields = {
            jsonpParamName : "{string} - param name - required for jsonp REST-based APIs.",
            onhighlight : "{Function} Event Fires when an item is hilighted.",
            onchange : "{Function} Event Fires when an item has been selected (click or Enter).",
            onrender : "{Function} Event fires when list is populated with data.",
            requestInputPattern : "{Function} text to match on input before sending a request."
        },
        noop = Function.prototype;

    DelegateFactory.create(Autocomplete, Event, "focus", DelegateFactory.descendantMatcher);
    
    Autocomplete.textMatcher = noop;
    Autocomplete.showUsage = showUsage;
    Autocomplete.getRequiredFields = getRequiredFields;
    
    Autocomplete.toString = function(){
        return"Autocomplete Widget Factory: for help, call Autocomplete.showUsage()";
    };
    
    function getRequiredFields() {
        return{
            dataSource : "{string} URI, e.g. 'myService.jsp'", 
            paramName : "{string} query param for input value", 
            getListData : "{Function} function must return array from the response object." +
                    " default: Autocomplete.prototype.getListData(rawObject)",
            itemRenderer : "{Function} renders each item in the list default: " +
                    "Autocomplete.prototype.itemRenderer(itemData)",
            getInputValueFromHighlightedItem : "{Function} " +
                    "default: Autocomplete.prototype.getInputValueFromHighlightedItem()",
            loader : "{Object} APE.ajax.AsyncRequest (default) or APE.ajax.ScriptLoader",
            matcher : "{Function} [optional] Do something to each LI based on input value."
                + "default: noop. Try: Autocomplete.textMatcher(listItemElement, value)"
        };
    }
    
    function showUsage() {
        var buf = [], prop;
        for(prop in requiredFields) {
            buf[buf.length] = prop + " : " + requiredFields[prop];
        } 
        buf[buf.length] = "\nOptional:";
        for(prop in optionalFields) { 
            buf[buf.length] = prop + " : " + optionalFields[prop];
        }
        
        return"Usage:\n\n" +
            "var config = {\n  "
            + buf.join("\n  ")
            + "\n};\n"
            + "Autocomplete.addDelegateFor('myWidget-input', config);\n\n";
    }
    
    /** @member APE.widget.Autocomplete 
     * matches value string in listItemElement case-insensitively.
     */
    function textMatcher(listItemElement, value) {
        var textNode = listItemElement.firstChild,
            start = textNode.data.toLowerCase().indexOf(value.toLowerCase()),
            length = value.length - start;
        // Safety check.
        if(start !== -1 && length > 0) {
            surroundText(listItemElement.firstChild, "b", start, length);  
        }
    }
    
    function surroundText(textNode, tag, start, length) {
        // Is there a simpler way to do this?
        (surroundText = document.createRange ? function(textNode, tag, start, length) {
            // Standard DOM way:
            range = document.createRange();
            range.setStart(textNode, start);
            range.setEnd(textNode, length);
            range.surroundContents(document.createElement(tag));
            } : function(textNode, tag, start, length) {
                // IE doesn't support w3c DOM Range.
                var frag = document.createDocumentFragment(),
                    data = textNode.data,
                    newPar = document.createElement(tag),
                    textPar = textNode.parentNode,
                    endTextNode = document.createTextNode(data.substring(start+length)),
                    surroundedText = data.substring(start, start + length);
                newPar[dom.TEXT_CONTENT] = surroundedText;
                frag.appendChild(newPar);
                frag.appendChild(endTextNode);
                textPar.replaceChild(frag, textNode);
            })(textNode, tag, start, length);
    }
    
    /** If the config is incorrect, an object is returned */
    function validateConfig(config) {
        var prop = "config";
        if(!config || (prop = getMissingString(config))) {
            return Autocomplete.toString() + 
                prop && "\n(missing: " + prop + ")";
        }
        function getMissingString(config) {
            for(var prop in requiredFields) {
                if(!(prop in config)) return prop;
            }
        }
    }

    return getConstructor;
    
    function getConstructor(Autocomplete) {
        
        function AutocompleteC(id, config) {
            var prop, err, input;
            err = validateConfig(config);
            if(err) { 
                throw new Error("Autocomplete Constructor: " + id + ", " + err);
            }
            this.id = id;
            for(prop in config) {
                this[prop] = config[prop];
            }
            init(this);
        }

        AutocompleteC.prototype = {
            getValueForServer: function() {
                return this.value ? this.value.replace(/^ +| +$/g,"") : "";
            },
            
            data : "",
            
            requestInputPattern : /\S/,
            
            /** Set innerHTML on <li> */
            itemRenderer : function(itemData) {
                return itemData;
            },
            
            onchange : noop,
            onhighlight : noop,
            onrender : noop,
            onrequest : noop,
            
            /** @return {Array} items from object returned from server */
            getListData : function(rawObject) {
                return rawObject;
            },
            
            /** when an item is selected, the inputs value is updated. 
             * @return {String} value to update the input with. */
            getInputValueFromHighlightedItem : function() {
                return this.data[this.getSelectedIndex()];
            },
            
            getSelectedIndex : function() {
                if(!this.selectedItem) return-1;
                var lis = this.selectedItem.parentNode.childNodes, i, len;
                for(i = 0, len = lis.length; i < len; i++) {
                    if(lis[i] === this.selectedItem) {
                        return i;
                    }
                }
                return -1;
            },
            
            getSelectedDataItem : function() {
                return this.data[this.getSelectedIndex()];
            }
        };
        
        return AutocompleteC;
        
        function init(autocomplete) {
            var el = document.getElementById(autocomplete.id + "-input");
            Event.addCallback(el, "keyup", keyUpHandler);
            Event.addCallback(el, "keydown", keyDownHandler);
            Event.addCallback(el, "blur", inputBlurHandler);
            autocomplete.selectedItem = null;
            autocomplete.value = el.value || null;
        }
        
        function keyUpHandler(ev) {
            if(key.ARROW_KEY_EXP.test(ev.keyCode) || ev.keyCode === key.ENTER) {
                return keyAnim && keyAnim.stop();
            }
            var id = this.id.replace(/-input$/, ""),
                ac = Autocomplete.getById(id);
            
            this.defaultValue = this.value;
            if(!ac.requestInputPattern.test(this.value)) {
                hideList(ac);
                setValue(ac);
            } else {
                // if it is a new value. 
                if(!hasListForInputDefaultValue(ac, this.defaultValue)) {
                    hideList(ac);
                    setUpRequest(ac);
                }
            }
        }
        
        function keyDownHandler(ev) {
            var keyCode = ev.keyCode,
                ac = Autocomplete.getById(this.id.replace("-input", ""));

            if(!hasListForInputDefaultValue(ac, this.defaultValue)) return;
    
            if(!keyAnim || !keyAnim.playing) {
                if(keyCode === key.UP) {
                    return selectPrevItemFromList(ac);
                } else if(keyCode === key.DOWN){
                    return selectNextItemFromList(ac);
                }
            }
            if(keyCode === key.ESC && isListShown(ac)) {
                itemSelected(ac);
                this.value = this.defaultValue;
            } else if(keyCode === key.ENTER && isListShown(ac)) {
                itemSelected(ac);
                Event.preventDefault(ev);
            }
        }
        
        function inputBlurHandler() {
            var id = this.id.substring(0, this.id.indexOf("-"));
            hideList(Autocomplete.getById(id)); 
        }
        
        function itemSelected(ac) {
            hideList(ac);
            if(ac.onchange() !== false) {
                setValue(ac);
            }
        }
        
        function setValue(ac) {
            var el = document.getElementById(ac.id + "-input");
            ac.value = el.value;
        }
        
        function isListShown(ac) {
            var list = document.getElementById(ac.id + "-list");
            return list.style.display !== "none";
        }
        
        function hideList(ac) {
            var list = document.getElementById(ac.id + "-list");
            if(list){
                list.style.display = "none";
            }
        }
        
        // TODO: rename to isListCurrent ?
        function hasListForInputDefaultValue(ac, inputDefaultValue){
            return inputDefaultValue === ac.listValue && 
                ac.data.length > 0
                && document.getElementById(ac.id + "-list") !== null;
        }
        
        function selectPrevItemFromList(ac) {
            var selectedItem = ac.selectedItem;
            
            if(!selectedItem) {
                selectedItem = document.getElementById(ac.id + "-list").lastChild;
            } else {
                selectedItem = selectedItem.previousSibling;
            }
            
            if(selectedItem) {
                selectItem(ac, selectedItem);
                startAnim(ac, "prev");
            }
        }
    
        function selectNextItemFromList(ac) {
            var selectedItem = ac.selectedItem;
    
    //        console.log(selectedItem && selectedItem.textContent);
            if(!selectedItem) {
                selectedItem = document.getElementById(ac.id + "-list").firstChild;
            } else {
                selectedItem = selectedItem.nextSibling;
            }
            if(selectedItem) {
                selectItem(ac, selectedItem);
                startAnim(ac, "next");
            }
        }
    
        var keyAnim, keyAnimDir;
        function startAnim(ac, dir) {
            initKeyAnim();
            keyAnimDir = dir;
            if(keyAnim){
                keyAnim.run = function(i) {
                    if(keyAnimDir === "next") {
                        selectNextItemFromList(ac);
                    } else if(keyAnimDir === "prev") {
                        selectPrevItemFromList(ac);
                    }
                };
                if(!keyAnim.playing) {
                    keyAnim.startAfter(400);
                }
            }
        }
    
        function initKeyAnim() {
            if(!keyAnim && anim) {
                keyAnim = new anim.Animation(3000);
            }
        }
        
        function selectItem(ac, item) {
            if(isListShown(ac)) {
                unHiliteSelectedItem(ac);
                ac.selectedItem = item;
                if(CAN_SCROLL_INTO_VIEW) {
                    item.scrollIntoView(false);
                }
                if(ac.onhighlight() !== false) {
                    var input = document.getElementById(ac.id + "-input");
                    input.value = ac.getInputValueFromHighlightedItem();
                }
            } else {
                showList(ac);
            }
            hiliteSelectedItem(ac);
        }
        
        function unHiliteSelectedItem(ac) {
            if(ac.selectedItem) {
                dom.removeClass(ac.selectedItem, SELECTED_CLASS);
            }
        }
        
        function hiliteSelectedItem(ac) {
            dom.addClass(ac.selectedItem, SELECTED_CLASS);
        }
        
        function setUpRequest(ac) {

            var transport = getTransport(ac),
                input = document.getElementById(ac.id + "-input"),
                queryData;
            ac.value = input.value;
            queryData = ac.paramName + "=" + ac.getValueForServer() + getJsonp(ac);
            
            if(transport.post) { // AsyncRequest need to evaluate response.
                transport.onsucceed = transportSuccessHandler;
                ac.callback = callback;
            } else {
                ac.callback = wrappedCallback;
            }
            // Abort any pending request, we have new data now.
            transport.abort();
            transport.get(queryData);
            ac.onrequest();
        }
        
        function callback(data) {
            return data;
        }
        
        function wrappedCallback(responseObject) {
            this.responseObject = responseObject;
            this.data = this.getListData(responseObject);
        }
        
        function getJsonp(ac) {
            return ac.jsonpParamName ? "&" + ac.jsonpParamName + "=" + getJsonpCallback(ac) : "";
        }
    
        function getJsonpCallback(ac) {
            return encodeURIComponent("APE.widget.Autocomplete.instances."+ac.id+".callback");
        }
        
        function getTransport(ac) {
            return (ac.loader || APE.ajax.AsyncRequest).getById(ac.id, ac.dataSource);
        }
        
        //http://suggestqueries.google.com/complete/search?qu=taco&jsonp=f
        function transportSuccessHandler() {
            var ac = Autocomplete.getById(this.id),
                input = document.getElementById(ac.id + "-input"),
                rawObject = getCallbackData(ac, this.req.responseText);
            
            ac.data = ac.getListData(rawObject);
            ac.responseObject = rawObject;
            ac.selectedItem = null;
            ac.listValue = input.defaultValue = ac.value;
    
            if(ac.data && ac.data.length > 0) {
                populateList(ac, getList(ac));
                ac.onrender();
                showList(ac);
                applyMatcherToList(ac);
            }
        }
        
        function getCallbackData(ac, responseText) {
            if(responseText) {
                // Grouping operator here used to avoid ASI errors.
                var wrapped = new Function("return("+responseText+");");
                return wrapped();
            } 
            return"";
        }
    
        function showList(ac) {
            var list = getList(ac),
                selectedItem = ac.selectedItem;
            list.style.display = "block";
            if(selectedItem && CAN_SCROLL_INTO_VIEW) {
                selectedItem.scrollIntoView(false);
            }
        }
    
        function applyMatcherToList(ac) {
            if(ac.matcher) {
                var i, list = document.getElementById(ac.id + "-list"),
                    items = list.getElementsByTagName("li"),
                    errList = [];
                for(i = 0; i < items.length; i++) {
                    tryMatchItem(ac, items[i], errList);
                }
            }
        }
        
        // Throw all errors from decorator in a setTimeout.
        function tryMatchItem(ac, item, errList) {
            try{
                ac.matcher(item, ac.value, item[dom.TEXT_CONTENT]);
            } catch(ex) {
                len = errList[errList.length] = ex.message;
            }
            if(errList.length) {
                setTimeout(function() {
                    throw errList;
                },1);
            }
        }
        
        function getList(ac) {
            var id = ac.id,
                listId = ac.id + "-list",
                list = document.getElementById(listId);
            if(!list) {
                list = document.createElement("ul");
                list.id = listId;
                list.className = "ape-autocomplete-list";
            }
            return list;
        }
        
        function populateList(ac, list) {
            var items = ac.data,
                len = items.length,
                html = [],
                i;
            html.length = len;
            list.id = ac.id + "-list";
            for(i = 0; i < len; i++) {
                html[i] = "<li>" + ac.itemRenderer(items[i]) + "<\/li>";
            }
            list.innerHTML = html.join("");
            document.getElementById(ac.id).appendChild(list);
            CAN_SCROLL_INTO_VIEW = !!list.childNodes[0].scrollIntoView;
            Event.addCallback(list, "mousedown", listMousedownHandler);
            Event.addCallback(list, "mouseover", listMouseOverHandler);
            return list;
        }
        
        function listMousedownHandler(ev) { 
            var ac, li = getLiFromTarget(ev, this);
            if(li) { 
                ac = Autocomplete.getById(this.id.replace(/-list$/,""));
                selectItem(ac, li);
                setTimeout(function(){
                    itemSelected(ac);
                    document.getElementById(ac.id + "-input").focus();
                }, 140);
                li = null;
            }
        }
        
        function listMouseOverHandler(ev) {
            var li = getLiFromTarget(ev, this);
            if(li) {
                li.onmouseout = listItemMouseoutHandler;
                dom.addClass(li, HOVER_CLASS);
            }
        }
        
        function listItemMouseoutHandler(ev) {
            var relatedTarget = Event.getRelatedTarget(ev);
            if(!dom.contains(this, relatedTarget)) {
                dom.removeClass(this, HOVER_CLASS);
            }
        }

        function getLiFromTarget(ev, list) {
            var li = Event.getTarget(ev);
            if(li.tagName !== "LI") {
                li = dom.findAncestorWithTagName(li, "LI", list);
            }
            return li;
        }
    }
});