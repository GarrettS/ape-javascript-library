APE.namespace("APE.ajax").mixin({
    appendToURI : function(baseUri, queryParams) {
        var ch = baseUri ? baseUri.indexOf("?") !== -1 ? "&" : "?" : "";
        return (baseUri || "") + ch + queryParams;
    },
    jsonp : function(data) { return data; }
});APE.namespace("APE.ajax").defineCustomFactory(
    "AsyncRequest", 
    
    function(AsyncRequest) {
        AsyncRequest.isSupported = isSupported;
        var nType = 'XMLHttpRequest', aType = 'ActiveXObject',
            type = typeof window[nType] != "undefined" ? nType : aType,
            progId,
            isNative = nType == type,
            supported = isNative || typeof window[aType] != "undefined" && !!getXHR();

        function isSupported(){
            return supported;
        }
        
        /**
         * @return an XMLHttpRequest, either native or ActiveX, or 
         * undefined, if not supported.
         */
        function getXHR() {
            return isNative ? new this[type] : tryGetXhrFromProgId();
        }
        
        function tryGetXhrFromProgId(){        
            var ctor = this[type],
                i, progIdList, xhr;
            
            if(progId) return new ctor(progId);
    
            // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
            // try for 3.0 version as Msxml2.XMLHTTP, 
            // fallback to "legacy" Microsoft.XMLHTTP.
            progIdList = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
            for(i = 0; i < progIdList.length; i++) {
                try {
                    xhr = new ctor(progIdList[i]);
                    progId = progIdList[i];
                    return xhr;
                } catch(ex){}
            }
            supported = false;
        }
        
        return getConstructor;
        
        function getConstructor(AsyncRequest){
        /**
         *  Usage:
         *   var req = APE.ajax.AsyncRequest.getById("", "data.json");
         *   req.onsucceed = function( req ) {
         *     alert( req.responseText );
         *   };
         *   req.send();
         *
         * @param {Object|string} formConfig object must have `action`, and 
         * may have `method`, and `enctype`.
         * Assign multiple callbacks using EventPublisher, if desired.
         */
            var uid = 0,
                appendToURI = APE.ajax.appendToURI,
                /** store up to 4 XHR objects. */
                xhrList = [],
                F = Function.prototype;
            
            /** @constructor */
            function AsyncRequestC(id, formConfig) {
                this.id = id;
                this.uri = formConfig.action || typeof formConfig == "string" && formConfig || "";
                this.httpMethod = formConfig.method && formConfig.method.toLowerCase()||"get";
                this.enctype = formConfig.enctype || "application/x-www-form-urlencoded";
                if(supported) {
                    this.req = getAvailableXHR();
                }
            }
            
            function getAvailableXHR(){
                var x, i, readyState;
                for(i = 0; i < 4; i++) {
                    x = xhrList[i];
                    if(!x) {
                        return xhrList[i] = getXHR();
                    } else {
                        readyState = x.readyState;
                        if(readyState === 4) {
                            x.abort();
                        }
                        if(readyState === 0)
                            return x;
                    }
                }
                // Get a non-pooled object, as last resort.
                return getXHR();
            }
            
            /** sets up poll for readyState change.
             * fires 'oncomplete', followed by either 'onsucceed' or 'onfail'.
             * onsucceed passes the request,
             * onfail passes the request.
             * @private for internal use only.
             */
            function setUpReadyStateChangeHandler(ar) {
                ar.timerId = setInterval(readyStateChangePoll, 50);
                if(ar.timeoutMillis > 0) {
                    var userTimeout = function() {
                        ar.ontimeout(/* Should we pass anything here? */);
                        ar.req.abort(); // Directly abort the request, don't fire "onabort".
                        oncomplete(ar);
                        ar.req.onreadystatechange = F;
                    };
                    ar.timeoutId = setTimeout( userTimeout, ar.timeoutMillis );
                }
                /** Called repeatedly until readyState i== 4, then calls processResponse. */
                function readyStateChangePoll() {
                    if( ar.req.readyState === 4 ) {
                        processResponse(ar);
                    }
                }
            }
            
            /** processes a response after readyState == 4. */
            function processResponse(asyncRequest) {
                var req = asyncRequest.req,
                    httpStatus = req.status,
                    succeeded = httpStatus >= 200 && httpStatus < 300 
                    || httpStatus == 304 || httpStatus == 1223;
        
                // if the request was successful,
                // fire oncomplete, then onsucceed/onfail.
                oncomplete(asyncRequest, succeeded);
                asyncRequest[succeeded ? "onsucceed" : "onfail"](req);
            }
            
            function oncomplete(ar, successful) {
                clearInterval(ar.timerId);
                if(ar.timeoutId) {
                    ar.timeoutId = clearTimeout(ar.timeoutId);
                }
                ar.oncomplete({successful : successful});
            }
        
           /** For an unencoded "multipart/form-data" request.
            * @param {Array} `data` joined on a unique boundary. */
            function addMultipartFormData(ar, data){
                var boundary = "---------------------------DATA_"+(++uid) + "\n";
                data = boundary + data.join(boundary) + boundary;
                ar.req.setRequestHeader('Content-Type', ar.enctype + "; " + boundary);
            }
            
            AsyncRequestC.prototype = {
                /**@event fires before oncomplete() */
                onabort : F,
        
                /**@event fires before onsucceed() */
                oncomplete : F,
        
                /**@event*/
                onsucceed : F,
        
                /**@event oncomplete fires before onfail() */
                onfail : F,
        
                /**@event*/
                ontimeout : F,
        
                /**@event*/
                onsend : F,
        
                /**@type {uint}*/
                timeoutMillis : 0,
        
                get : function(queryParams, timeoutMillis) {
                    return this.send(queryParams, timeoutMillis);
                },
                
                post : function(data, timeoutMillis) {
                    return this.send(data, timeoutMillis);
                },
                
                /** Sends the call.
                 * @param {string|Array} [data] post data. 
                 * For an unencoded "multipart/form-data" request, if `data` is
                 * an array, it is joined on a unique boundary.
                 * 
                 * If method is GET, and data is present, data is appended to URI 
                 *  (caller must supply "?" or "&").
                 *  
                 * @return {ajax.AsyncRequest|Error} if an error occured when trying to send,
                 * the error is returned. Otherwise, the AsyncRequest is returned.
                 */
                send : function(data, timeoutMillis) {
                    if(!supported) {
                        return this.onfail();
                    }
                    var uri = this.uri;

                    this.timeoutMillis = timeoutMillis|0 || 4000;
        
                    if(this.httpMethod == "get" && typeof data == "string") {
                        uri = appendToURI(uri, data);
                    }

                    this.req.open(this.httpMethod, uri, true);
                    setUpReadyStateChangeHandler(this);
                    if(typeof this.req.setRequestHeader != "undefined") {
                        this.req.setRequestHeader('X-REQUESTED-WITH', 'XMLHttpRequest');
                        if(this.httpMethod == "post") {
                            if(typeof data == "string") {
                                this.req.setRequestHeader('Content-Type', this.enctype);
                            } else if(data && data.join && this.enctype == "multipart/form-data") {
                               addMultipartFormData(this, data);
                            }
                        }
                    }
                    try {
                        this.onsend();
                        this.req.send( data||null );
                    } catch(ex) { 
                        this.onfail(ex);
                    }
                    return this;
                },
        
                /** Aborts call. Fires "onabort", passing the request,
                 * then fires "oncomplete" with {successful : false}
                 */
                abort : function() {
                    if(!supported) return;
                    if(this.timeoutId) {
                        this.timeoutId = clearTimeout(this.timeoutId);
                    }

                    // Stop success from firing.
                    clearInterval(this.timerId);

                    // If the request is cached, then IE will 
                    // set readystate to 4 immediately after calling send. 
                    // Do not fire onabort unless the req was actually aborted 
                    // (this happens once per send).
                    // Calling req.abort sets readyState to 0, 
                    // so the next call won't fire it.
                    if(this.req.readyState !== 0) {
                        this.req.abort();
                        this.onabort(this.req); 
                        oncomplete(this, false);
                    }
                },
                
                toString : function() {
                    var s = "AsyncRequest: \n"
                        + "isSupported(): " + supported
                        + "\nuri: " + this.uri
                        + "\nmethod: " + this.httpMethod
                        + "\n----------------------\n"
                        + "req: \n",
                        prop;
                    if(supported) {
                        for(prop in this.req)
                            try {
                                if(typeof this.req[prop] == "string") {
                                    s.concat(prop + ": " + this.req[prop] + "\n");
                                }
                            } catch(mozillaSecurityError) { }
                    }
                    return s;
                }
            };
            return AsyncRequestC;
        }
    }
);APE.namespace("APE.ajax").defineFactory(
    "ScriptLoader", function(ScriptLoader) {
        
        var noop = Function.prototype,
            appendToURI = APE.ajax.appendToURI,
            scriptOnloadSupported;
        
        /** @constructor.
         * config properties:
         * onsuccess : Function - success handler callback
         * uri : string - optional base uri. 
         */
        function ScriptLoaderC(id, config) {
            this.script = document.createElement("script");
            this.id = this.script.id = id;
            APE.createMixin(this, config);
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
                // Avoid unlikely race condition: 
                // if script onload fires first, when 
                // scriptOnloadSupported === undefined,
                // the let scriptLoadHandler handle it; 
                // don't call loadHandler twice. 
                if(!scriptOnloadSupported) {
                    loadHandler(script);
                    script = null;
                }
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