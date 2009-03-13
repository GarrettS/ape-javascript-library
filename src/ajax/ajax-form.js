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
     * This file has no dependencies.
     * Assign multiple callbacks using EventPublisher, if desired.
     */

    APE.ajax.AsyncRequest = AsyncRequest;
    AsyncRequest.getById = APE.getById;

    //req.setRequestHeader("Content-Type", form.enctype + "; boundary = );
    /**
     * @constructor
     */
    function AsyncRequest(id, formConfig) {
        this.id = id;
        this.httpMethod = formConfig.method && formConfig.method.toLowerCase()||"get";
        this.uri = formConfig.action;
        if(!this.uri) throw URIError("formConfig.action = undefined");
        this.enctype = formConfig.enctype;
        if(!this.enctype && this.httpMethod == "post") {
            this.enctype = 'application/x-www-form-urlencoded';
        }

        this.req = getAvailableXHR();
        // copy config.
        this.config = {};
        for(var prop in formConfig) {
            if(!(prop in this.config)) {
                this.config[prop] = formConfig[prop];
            }
        }
    };

    var nType = 'XMLHttpRequest', aType = 'ActiveXObject',
        type = (nType in window) ? nType : aType,
        isNative = nType == type,
        /** store up to 4 XHR objects. */
        xhrList = [];

    function getAvailableXHR(){
        var x, i, readyState;
        for(i = 0; i < 4; i++) {
            x = xhrList[i];
            if(!x) {
                return xhrList[i] = getXHR();
            } else {
                readyState = x.readyState;
                if(readyState == 4) {
                    x.abort();
                }
                if(readyState == 0)
                    return x;
            }
        }
        // Get a non-pooled object, as last resort.
        return getXHR();

        function getXHR() {
            return isNative ? new window[type] : new window[type]('Microsoft.XMLHTTP');
        }
    };
    /**
     * cancels the readyState poll.
     * @private
     * setTimeout calling object's context is always window, and
     * this is needed by abort.
     *
     */
    function cancelPoll(pollId) {
        window.clearInterval( pollId );
    };

    AsyncRequest.prototype = {

        /**@event fires before oncomplete() */
        onabort : function(){},

        /**@event fires before onsucceed() */
        oncomplete : function(){},

        /**@event*/
        onsucceed : function(){},

        /**@event oncomplete fires before onfail() */
        onfail : function(){},

        /**@event*/
        ontimeout : function(){},

        /**@event*/
        onsend : function(){},

        /**@type {uint}*/
        timeoutMillis : 0,

        /** Sends the call.
         * @param {string|Array} [data] post data. If an array, it is assumed that the
         * request is an unencoded, multipart/form-data. The array is joined on a boundary.
         * If method is GET, and data is present, data is appended to URI (user must supply "?" or "&").
         * @return {ajax.AsyncRequest|Error} if an error occured when trying to send,
         * the error is returned. Otherwise, the AsyncRequest is returned.
         */
        send : function( data, timeoutMillis ) {
            var uri = this.uri;

            this.timeoutMillis = timeoutMillis|0 || 4000;

            this._setUpReadyStateChangeHandler();
            if(this.httpMethod == "get" && typeof data == "string") {
                uri += data;
            }
            this.req.open(this.httpMethod, uri, true);
            if("setRequestHeader" in this.req) {
                this.req.setRequestHeader('X-REQUESTED-WITH', 'XMLHttpRequest');
                if(this.httpMethod == "post") {
                    if(typeof data == "string") {
                        this.req.setRequestHeader('Content-Type', this.enctype);
                    }
                    else if(data && typeof data.unshift == "function" && this.enctype == "multipart/form-data") {
                        var boundary = "---------------------------DATA_"+(new Date-0) + "\n";
                        data = boundary + data.join(boundary) + boundary;
                        this.req.setRequestHeader('Content-Type', this.enctype + "; " + boundary);
                    }
                }
            }
            try {
                this.onsend();
                this.req.send( data||null );
                return this; // internet explorer does not support |finally| properly.
            }
            catch(ex) {
                return this;
            }
        },

        /** Aborts call. Fires "onabort", passing the request,
         * then fires "oncomplete" with {successful : false}
         */
        abort : function() {
            this.req.abort();

            // cancel the readyState poll.
            cancelPoll(this._pollId);

            // Clear the timeout timer.
            window.clearInterval(this.timeoutID);

            this.onabort(this.req); // others can know.
            this._oncomplete(false);
        },

        _oncomplete : function(successful) {
            this.oncomplete({successful : successful});
        },

        toString : function() {
            var s = "ajax.AsyncRequest: \n"
                + "uri: " + this.uri
                + "\nhttpMethod: " + this.httpMethod
                + "\n----------------------\n"
                + "req: \n",
                prop;
            for(prop in this.req)
                try {
                    if(typeof this.req[prop] == "string") {
                        s.concat(prop + ": " + this.req[prop] + "\n");
                    }
                } catch(mozillaSecurityError) { }
            return s;
        },

        /** sets up poll for readyState change.
         * fires 'oncomplete', followed by either 'onsucceed' or 'onfail'.
         * onsucceed passes the request,
         * onfail passes the request.
         * @private for internal use only.
         */
        _setUpReadyStateChangeHandler : function() {
            var asyncRequest = this;
            this._pollId = window.setInterval( readyStateChangePoll, 50 );
            if(this.timeoutMillis > 0) {

                var userTimeout = function() {
                    asyncRequest.ontimeout(/* Should we pass anything here? */);
                    asyncRequest.req.abort(); // Directly abort the request, don't fire "onabort".
                    asyncRequest._oncomplete();
                };
                this.timeoutID = setTimeout( userTimeout, this.timeoutMillis );
            }

            /** Called repeatedly until readyState i== 4, then calls processResponse,
             * @private.
             */
            function readyStateChangePoll() {
                if( asyncRequest.req.readyState == 4 ) {
                    processResponse();
                }
            }

            /**
             * processes a response after readyState == 4.
             * @private
             */
            function processResponse() {
                cancelPoll( asyncRequest._pollId );
                var httpStatus = asyncRequest.req.status,
                    succeeded = httpStatus >= 200 && httpStatus < 300 || httpStatus == 304 || httpStatus == 1223;

                // if the request was successful,
                if(succeeded) {
                    // fire oncomplete, then onsucceed.
                    asyncRequest._oncomplete(true);
                    asyncRequest.onsucceed(asyncRequest.req);
                }
                else {
                    // fire oncomplete, then onfail.
                    asyncRequest._oncomplete(false);
                    asyncRequest.onfail(asyncRequest.req);
                }
                // The call is complete, cancel the timeout..
                window.clearInterval(asyncRequest.timeoutID);
            }
        }
    };
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