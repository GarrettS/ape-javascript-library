APE.namespace("APE.ajax");

(function() {
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
    var APE = window.APE,
        AsyncRequest = APE.createFactory(AsyncRequestC, createAsyncProto);
    AsyncRequest.isSupported = isSupported;
    APE.ajax.AsyncRequest = AsyncRequest;
    
    function AsyncRequestC(id, formConfig) {
        this.id = id;
        this.uri = formConfig.action || typeof formConfig == "string" && formConfig;
        if(!this.uri) throw URIError("formConfig.action = undefined");
        this.httpMethod = formConfig.method && formConfig.method.toLowerCase()||"get";
        this.enctype = formConfig.enctype || "application/x-www-form-urlencoded";
        if(supported) {
            this.req = getAvailableXHR();
        }
    }

    var nType = 'XMLHttpRequest', aType = 'ActiveXObject',
        progId,
        type = typeof window[nType] != "undefined" ? nType : aType,
        uid = 0,
        isNative = nType == type,
        supported = isNative || typeof window[aType] != "undefined" && !!getXHR(),
        /** store up to 4 XHR objects. */
        xhrList = [];
    
    function isSupported(){
        return supported;
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
    
    function createAsyncProto() {
        
        var F = Function.prototype;

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
            asyncRequest.timerId = clearInterval(asyncRequest.timerId);
        }
    
        function oncomplete(ar, successful) {
            ar.oncomplete({successful : successful});
        }

        return {
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
            send : function( data, timeoutMillis ) {
                if(!supported) {
                    return this.onfail();
                }
                var uri = this.uri, boundary;
    
                this.timeoutMillis = timeoutMillis|0 || 4000;
    
                if(this.httpMethod == "get" && typeof data == "string") {
                    uri += data;
                }
                this.req.open(this.httpMethod, uri, true);
                setUpReadyStateChangeHandler(this);
                if("setRequestHeader" in this.req) {
                    this.req.setRequestHeader('X-REQUESTED-WITH', 'XMLHttpRequest');
                    if(this.httpMethod == "post") {
                        if(typeof data == "string") {
                            this.req.setRequestHeader('Content-Type', this.enctype);
                        } else if(data && typeof data.unshift == "function" && 
                                         this.enctype == "multipart/form-data") {
                            boundary = "---------------------------DATA_"+(++uid) + "\n";
                            data = boundary + data.join(boundary) + boundary;
                            this.req.setRequestHeader('Content-Type', this.enctype + "; " + boundary);
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
    }
})();APE.namespace("APE.form");

APE.form.Form = function(form) {
    this.form = form;
};

APE.form.Form.prototype = {

    /**
     * Serializes the form according to HTML 4.01
     * http://www.w3.org/TR/html401/interact/forms.html#successful-controls
     *
     * @param {HTMLInputElement} submit an input that needs to be included in 
     * the successful controls.
     * @return {Object} An object who's property names are element names and 
     * values are arrays.
     */
    toObject : function(submit) {
        var form = this.form,
           elements = form.elements, i, len, 
           element, type, name, ontype = /^(?:rad|che)/,
           json = {},
           options,
           option,
           j, jlen,
           p, plen,
            // Although no browsers actually include "image" 
            // in elements collection.
           submitTypeExp = /^(?:submit|image)$/;

        if(!elements) {
            form = document.createElement('form').
                appendChild(form.cloneNode(true)).parentNode;
            elements = form.elements;
        }

        for(i = 0, len = elements.length; i < len; i++) {
            element = elements[i];
            type = element.type;
            name = element.name;
          
            
            if(!name || element.disabled || type == "reset" 
              || type == "button" || submitTypeExp.test(type) // only on event.
              || (ontype.test(type) && !element.checked)
              || (element.tagName == "OBJECT" && element.declare) 
              || element.type == "select-multiple" && !element.value) continue;
          
            p = json[name];

            if(!p) json[name] = p = [];
            plen = p.length;

            options = element.options;
            if(options) {
                if(element.type == "select-multiple") {
                for(j = 0, jlen = options.length; j < jlen; j++) {
                    option = options[j];
                    if(option.selected) {
                      p[plen] = option.value || option.text;
                    }
                }
            }
            else {
                option = options[element.selectedIndex];
                if(!option.disabled)
                    p[plen] = option.value || option.text;
            }
        }

          // https://bugzilla.mozilla.org/show_bug.cgi?id=371432
          // http://www.w3.org/TR/file-upload/
          //
          // Just take the first file.
        else if(element.type == "file") { 
            var files = element.files; 
            if(files && files[0]) {
              p[plen] = files[0];
            }
        }
        else {
            p[plen] = element.value;
          }
        }
        if(submit && submit.name) {
            if(!json[submit.name]) p = json[submit.name] = [];
            p[p.length] = submit.value;
        }
        return json;
    },

    /**
    * @return {Array} array of strings for successful data.
    */
    getMultipartFormData : function(e) {
    // Doesn't encode data.
    // http://groups.google.com/group/comp.lang.javascript/browse_thread/thread/eada69993b5ae08a/5943a32b5ecca6e6?lnk=gst&q=encodeURIComponent+post+xhr#5943a32b5ecca6e6
    // http://www.devx.com/Java/Article/17679/1954
    var json = this.toObject(e), prop, value, file, i, len, result = [],
        nn = '\r\n\r\n';
    for(prop in json) {
        value = json[prop];
        for(i = 0, len = value.length; i < len; i++) {
            file = value[i];
            if(!file) continue;
            result[result.length] = "Content-Disposition: form-data; " +
              'name="'+prop +'";'
              + (file.fileName && file.getAsBinary ? ' filename="'+file.fileName +'"'
                + nn + file.getAsBinary() : nn + file);
            }
        }
        return result;
    },

    /** 
     * @return {String} the query string, including the "?".
     */
    getQueryString : function(e) {
        var json = this.toObject(e), prop, i, value, encodedProp, result = [], ws = /%20/g;
        for(prop in json) {
            value = json[prop];
            encodedProp = encodeURIComponent(prop);
            for(i = 0, len = value.length; i < len; i++) {
                result[result.length] = encodedProp +
                  "=" + encodeURIComponent(value[i]).replace(ws,'+');
            }
        }
        return result.join("&");
    },

    serialize : function(e) {
        var method = this.form.method.toLowerCase();
        if(method == "get") {
            return this.form.action + "?" + this.getQueryString(e);  
        }
        if(method == "post") {
            if(this.form.enctype == "multipart/form-data")
                return this.getMultipartFormData(e);
            return this.getQueryString(e);
        }
    }
};