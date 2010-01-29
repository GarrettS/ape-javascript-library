APE.namespace("APE.ajax").createCustomFactory(
    "ScriptLoader", function(ScriptLoader) {
      
     return getConstructor;
     
     function getConstructor(ScriptLoader){
             
        function ScriptLoaderC(id, config) {
            this.id = id;
            this.script = document.createElement("script");
            this.script.id = this.id;
            config && APE.createMixin(this, config);
        }
        
        function scriptLoadHandler(ev) {
            var sl = ScriptLoader.getById(this.id);
            if(ev && ev.type == "load" || this.readyState > 3) {
                sl.loaded = true;
                sl.onsuccess();
            }
        }
        
        ScriptLoaderC.prototype = {
            get : function(uri) {
                var head = document.getElementsByTagName("head")[0];
                this.script.src = uri;
                this.loaded = false;
                this.script.onload = this.script.onreadystatechange = scriptLoadHandler;
                head.insertBefore(this.script, head.firstChild);
                head.removeChild(this.script);
            },
            
            onsuccess : Function.prototype
        };
        
        return ScriptLoaderC;
     }
});