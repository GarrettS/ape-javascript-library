APE.namespace("APE.ajax").mixin({
    appendToURI : function(baseUri, queryParams) {
        var ch = baseUri ? baseUri.indexOf("?") !== -1 ? "&" : "?" : "";
        return (baseUri || "") + ch + queryParams;
    },
    jsonp : Function.prototype
});APE.namespace("APE.ajax").createFactory(
    "ScriptLoader", function(ScriptLoader) {
        
        var noop = Function.prototype,
            appendToURI = APE.ajax.appendToURI,
            scriptOnloadSupported = null;
        
        
        /** @constructor.
         * config properties:
         * onsuccess : Function - success handler callback
         * uri : string - optional base uri. 
         */
        function ScriptLoaderC(id, config) {
            this.id = id;
            this.script = document.createElement("script");
            this.script.id = this.id;
            config && APE.createMixin(this, config);
        }
        
        function loadHandler(script) {
            var sl = ScriptLoader.getById(script.id);
            if(sl.loaded) return;
            sl.loaded = true;
            script.onload = script.onreadystatechange = noop;
            script.parentNode.removeChild(script);
            sl.onsuccess();
        }
        
        function scriptLoadHandler(ev) {
            // IE6, "loaded" state means script has loaded, but has 
            // not yet been evaluated, Opera never reaches complete.
            if(ev && ev.type === "load" || this.readyState === "complete") {
                scriptOnloadSupported = true;
                loadHandler(this);
                loadImageForScript = noop;
            }
        }
        
        // XXX Safari 2.0.4+ workaround:
        // Safari doesn't fire onload for script, use Image instead.
        // Safari fires callback in global context.
        function loadImageForScript(uri, script) {
            var image = new Image(),
                uniqueParam = "ScriptLoader="
                    + script.id + ((+new Date + "").slice(-4));
            image.onload = function() {
                loadHandler(script);
                script = null;
            };
            
            // onload won't fire if cached.
            image.src = appendToURI(uri, uniqueParam);
            image = null;
        }
        
        ScriptLoaderC.prototype = {
            
            get : function(uri) {
                var head = document.getElementsByTagName("head")[0],
                    script = this.script;
                this.loaded = false;
                if(scriptOnloadSupported !== false){
                    script.onload = script.onreadystatechange = scriptLoadHandler;
                }
                script.src = appendToURI(this.uri, uri);
                head.appendChild(script);
                
                // XXX Safari 2 this must come second, or a crash occurs.
                loadImageForScript(uri, script);                
            },
            
            onsuccess : noop
        };
        return ScriptLoaderC;
});