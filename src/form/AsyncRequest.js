/** ajax.AsyncRequest is an XHR Adapter that fires these events: 
 *  onsucceed, onfail, onabort, oncomplete
 * 
 * @author Garrett Smith
 *
 * Usage: 
 *   var req = APE.ajax.AsyncRequest("data.json");
 *   req.onsucceed = function( req ) { 
 *     alert( req.responseText ); 
 *   };
 *   req.send();
 *
 * This file has no dependencies.
 * Assign multiple callbacks using EventPublisher, if desired.
 */

 /**
  * TODO: 
  * queue
  *
  */

APE.namespace("APE.ajax");

//req.setRequestHeader("Content-Type", form.enctype + "; boundary = );
/** 
 * @constructor
 */
APE.ajax.AsyncRequest = function(formConfig) {
	this.httpMethod = formConfig.method && formConfig.method.toLowerCase()||"get";
	this.uri = formConfig.action;
    if(!this.uri) throw URIError("formConfig.action = undefined");
    this.enctype = formConfig.enctype;
    if(!this.enctype && this.httpMethod == "post") {
        this.enctype = 'application/x-www-form-urlencoded';
    }
	if(window.XMLHttpRequest) {
		this.req = new XMLHttpRequest();
	}
	else if(window.ActiveXObject) {
		this.req = new ActiveXObject('Microsoft.XMLHTTP');
	}
};

APE.ajax.AsyncRequest.toString = function() {
	return"[object ajax.AsyncRequest]";
};

APE.ajax.AsyncRequest.prototype = { 
	
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

	/**@type {uint}*/
	timeoutMillis : 0,
	
	/** Sends the call.
	 * @param {String|Array} [data] post data. If an array, it is assumed that the 
     * request is an unencoded, multipart/form-data. The array is joined on a boundary.
	 * @return {ajax.AsyncRequest|Error} if an error occured when trying to send,
	 * the error is returned. Otherwise, the AsyncRequest is returned.
	 */
	send : function( data, timeoutMillis ) {
		if(typeof timeoutMillis == "number") {
			this.timeoutMillis = timeoutMillis;
		}

		this._setUpReadyStateChangeHandler();
		this.req.open(this.httpMethod, this.uri, true);
		if(this.req.setRequestHeader) {
			this.req.setRequestHeader('X-REQUESTED-WITH', 'XMLHttpRequest');
			if(this.httpMethod == "post") {
                if(typeof data == "string") {
    				this.req.setRequestHeader('Content-Type', this.enctype);
                }
                else if(typeof data.unshift == "function" && this.enctype == "multipart/form-data") {
                    var boundary = "DATA"+(new Date-0),
                    	n = '\r\n';
	    			this.req.setRequestHeader('Content-Type', this.enctype + "; boundary=" + boundary);
	    			boundary = n + "--" + boundary;
                    data = boundary + n + data.join(boundary+n) + boundary+'--'+n + n;
                }
            }
		}
		try {
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
		APE.ajax.AsyncRequest._cancelPoll(this._pollId);

		// Clear the timeout timer.
		window.clearInterval(this.timeoutID);

		this.onabort(this.req); // others can know.
		this.oncomplete({successful : false});
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
				APE.ajax.AsyncRequest._cancelPoll(asyncRequest._pollId);
				asyncRequest.ontimeout(/* Should we pass anything here? */);
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
			APE.ajax.AsyncRequest._cancelPoll( asyncRequest._pollId );
			var httpStatus = asyncRequest.req.status;

			var succeeded = httpStatus >= 200 && httpStatus < 300 || httpStatus == 304 || httpStatus == 1223;

			// if the request was successful,
			if(succeeded) {
				// fire oncomplete, then onsucceed.
				asyncRequest.oncomplete({successful:true});
				asyncRequest.onsucceed(asyncRequest.req);
			}
			else {
				// fire oncomplete, then onfail.
				asyncRequest.oncomplete({successful:false});
				asyncRequest.onfail(asyncRequest.req);
			}
			// The call is complete, cancel the timeout..
			clearInterval(asyncRequest.timeoutID);
		}
	}
};

/** 
 * cancels the readyState poll.
 * @private
 * setTimeout calling object's context is always window, and 
 * this is needed by abort.
 * 
 */
APE.ajax.AsyncRequest._cancelPoll = function(pollId) {
	window.clearInterval( pollId );
};