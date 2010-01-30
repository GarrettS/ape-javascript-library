APE.namespace("APE.ajax").createFactory(
    "ScriptLoader", function(ScriptLoader) {
                
        var noop = Function.prototype;
        APE.ajax.jsonp = APE.ajax.jsonp || noop;
        
        function ScriptLoaderC(id, config) {
            this.id = id;
            this.script = document.createElement("script");
            this.script.id = this.id;
            config && APE.createMixin(this, config);
        }
        
        function imgLoadHandler() {
            var sl = ScriptLoader.getById(this.id);
            // IE6, "loaded" state means script has loaded, but has 
            // not yet been evaluated.
                sl.loaded = true;
                this.onreadystatechange = noop;
                this.parentNode.removeChild(this);
                sl.onsuccess();
        }
        
        ScriptLoaderC.prototype = {
            
            // Note: Consider using appendToURI, as AsyncRequest does.
            get : function(uri) {
                var head = document.getElementsByTagName("head")[0],
                    script = this.script,
                    image = new Image();
                this.loaded = false;

                // XXX Safari 2.0.4+ workaround:
                // Safari doesn't fire onload for script, use Image instead.
                // Safari fires callback in global context.
                image.onload = script.onload = script.onreadystatechange = function(ev) {
                    // XXX Opera, "complete" is not reached, so check ev.type === "load";
                    if(ev && ev.type === "load" || script.readyState === "complete") {
                        imgLoadHandler.call(script);
                        image = script = null;
                    }
                };
                script.src = uri;
                head.insertBefore(script, head.firstChild);
                image.src = uri;
                head = null;
            },
            
            onsuccess : noop
        };
        
        return ScriptLoaderC;
});