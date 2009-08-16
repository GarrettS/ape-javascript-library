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
    APE.ajax.AsyncRequest = APE.createFactory(AsyncRequest, createAsyncProto);

    function AsyncRequest(id, formConfig) {
        this.id = id;
        this.httpMethod = formConfig.method && formConfig.method.toLowerCase()||"get";
        this.uri = formConfig.action;
        if(!this.uri) throw URIError("formConfig.action = undefined");
        this.enctype = formConfig.enctype;
        if(!this.enctype && this.httpMethod == "post") {
            this.enctype = defaultEnctype;
        }

        this.req = getAvailableXHR();
        // copy config.
        this.config = {};
        for(var prop in formConfig) {
            this.config[prop] = formConfig[prop];
        }
    }

    var defaultEnctype = 'application/x-www-form-urlencoded',
        nType = 'XMLHttpRequest', aType = 'ActiveXObject',
        type = (nType in self) ? nType : aType,
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
    
    function getXHR() {
        return isNative ? new self[type] : new self[type]('Microsoft.XMLHTTP');
    }
        
    /**
     * cancels the readyState poll.
     * @private
     * setTimeout calling object's context is always self, and
     * this is needed by abort.
     *
     */
    function cancelPoll(pollId) {
        self.clearInterval( pollId );
    }

    function createAsyncProto() {
        
        function F(){}

        /** sets up poll for readyState change.
         * fires 'oncomplete', followed by either 'onsucceed' or 'onfail'.
         * onsucceed passes the request,
         * onfail passes the request.
         * @private for internal use only.
         */
        function setUpReadyStateChangeHandler(ar) {
            ar._pollId = self.setInterval( readyStateChangePoll, 50 );
            if(ar.timeoutMillis > 0) {
    
                var userTimeout = function() {
                    ar.ontimeout(/* Should we pass anything here? */);
                    ar.req.abort(); // Directly abort the request, don't fire "onabort".
                    oncomplete(ar);
                };
                ar.timeoutID = self.setTimeout( userTimeout, ar.timeoutMillis );
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
            cancelPoll( asyncRequest._pollId );
            var httpStatus = asyncRequest.req.status,
                succeeded = httpStatus >= 200 && httpStatus < 300 
                || httpStatus == 304 || httpStatus == 1223;
    
            // if the request was successful,
            if(succeeded) {
                // fire oncomplete, then onsucceed.
                oncomplete(asyncRequest, true);
                asyncRequest.onsucceed(asyncRequest.req);
            } else {
                // fire oncomplete, then onfail.
                oncomplete(asyncRequest, false);
                asyncRequest.onfail(asyncRequest.req);
            }
            // The call is complete, cancel the timeout..
            self.clearInterval(asyncRequest.timeoutID);
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
             * For an unencoded "multipart/form-data" request, if "data" is
             * an array, it is joined on a unique boundary.
             * 
             * If method is GET, and data is present, data is appended to URI 
             *  (caller must supply "?" or "&").
             *  
             * @return {ajax.AsyncRequest|Error} if an error occured when trying to send,
             * the error is returned. Otherwise, the AsyncRequest is returned.
             */
            send : function( data, timeoutMillis ) {
                var uri = this.uri, boundary;
    
                this.timeoutMillis = timeoutMillis|0 || 4000;
    
                setUpReadyStateChangeHandler(this);
                if(this.httpMethod == "get" && typeof data == "string") {
                    uri += data;
                }
                this.req.open(this.httpMethod, uri, true);
                if("setRequestHeader" in this.req) {
                    this.req.setRequestHeader('X-REQUESTED-WITH', 'XMLHttpRequest');
                    if(this.httpMethod == "post") {
                        if(typeof data == "string") {
                            this.req.setRequestHeader('Content-Type', this.enctype);
                        } else if(data && typeof data.unshift == "function" && 
                                         this.enctype == "multipart/form-data") {
                            boundary = "---------------------------DATA_"+(+new Date) + "\n";
                            data = boundary + data.join(boundary) + boundary;
                            this.req.setRequestHeader('Content-Type', this.enctype + "; " + boundary);
                        }
                    }
                }
                try {
                    this.onsend();
                    this.req.send( data||null );
                } catch(ex) { 
                    this.onfail(ex)
                }
                return this;
            },
    
            /** Aborts call. Fires "onabort", passing the request,
             * then fires "oncomplete" with {successful : false}
             */
            abort : function() {
                this.req.abort();
    
                // cancel the readyState poll.
                cancelPoll(this._pollId);
    
                // Clear the timeout timer.
                self.clearInterval(this.timeoutID);
    
                this.onabort(this.req); // others can know.
                oncomplete(this, false);
            },
    
            toString : function() {
                var s = "AsyncRequest: \n"
                    + "uri: " + this.uri
                    + "\nmethod: " + this.httpMethod
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
            }
        };
    }
})();