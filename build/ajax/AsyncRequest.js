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
         *   req.c = function( req ) {
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
                    ar.timeoutID = setTimeout( userTimeout, ar.timeoutMillis );
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
        
                asyncRequest.timerId = clearInterval(asyncRequest.timerId);

                // if the request was successful,
                if(succeeded) {
                    // fire oncomplete, then onsucceed.
                    oncomplete(asyncRequest, true);
                    
                    asyncRequest.onsucceed(req);
                } else {
                    // fire oncomplete, then onfail.
                    oncomplete(asyncRequest, false);
                    asyncRequest.onfail(req);
                }
            }
        
            function oncomplete(ar, successful) {
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
                    this.req.abort();
        
                    // Clear the timeout timer.
                    clearTimeout(this.timeoutID);
                    this.onabort(this.req); // others can know.
                    oncomplete(this, false);
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
);