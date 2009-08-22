APE.namespace("APE.ajax");(function(){APE.ajax.AsyncRequest=APE.createFactory(K,G);function K(N,L){this.id=N;this.httpMethod=L.method&&L.method.toLowerCase()||"get";this.uri=L.action;if(!this.uri){throw URIError("formConfig.action = undefined")}this.enctype=L.enctype;if(!this.enctype&&this.httpMethod=="post"){this.enctype=A}this.req=J();this.config={};for(var M in L){this.config[M]=L[M]}}var A="application/x-www-form-urlencoded",F="XMLHttpRequest",H="ActiveXObject",I=(F in self)?F:H,B=F==I,E=[];function J(){var M,N,L;for(N=0;N<4;N++){M=E[N];if(!M){return E[N]=D()}else{L=M.readyState;if(L===4){M.abort()}if(L===0){return M}}}return D()}function D(){return B?new self[I]:new self[I]("Microsoft.XMLHTTP")}function C(L){self.clearInterval(L)}function G(){function M(){}function O(R){R._pollId=self.setInterval(P,50);if(R.timeoutMillis>0){var Q=function(){R.ontimeout();R.req.abort();L(R)};R.timeoutID=self.setTimeout(Q,R.timeoutMillis)}function P(){if(R.req.readyState===4){N(R)}}}function N(P){C(P._pollId);var Q=P.req.status,R=Q>=200&&Q<300||Q==304||Q==1223;if(R){L(P,true);P.onsucceed(P.req)}else{L(P,false);P.onfail(P.req)}self.clearInterval(P.timeoutID)}function L(P,Q){P.oncomplete({successful:Q})}return{onabort:M,oncomplete:M,onsucceed:M,onfail:M,ontimeout:M,onsend:M,timeoutMillis:0,send:function(R,S){var Q=this.uri,T;this.timeoutMillis=S|0||4000;O(this);if(this.httpMethod=="get"&&typeof R=="string"){Q+=R}this.req.open(this.httpMethod,Q,true);if("setRequestHeader" in this.req){this.req.setRequestHeader("X-REQUESTED-WITH","XMLHttpRequest");if(this.httpMethod=="post"){if(typeof R=="string"){this.req.setRequestHeader("Content-Type",this.enctype)}else{if(R&&typeof R.unshift=="function"&&this.enctype=="multipart/form-data"){T="---------------------------DATA_"+(+new Date)+"\n";R=T+R.join(T)+T;this.req.setRequestHeader("Content-Type",this.enctype+"; "+T)}}}}try{this.onsend();this.req.send(R||null)}catch(P){this.onfail(P)}return this},abort:function(){this.req.abort();C(this._pollId);self.clearInterval(this.timeoutID);this.onabort(this.req);L(this,false)},toString:function(){var Q="AsyncRequest: \nuri: "+this.uri+"\nmethod: "+this.httpMethod+"\n----------------------\nreq: \n",R;for(R in this.req){try{if(typeof this.req[R]=="string"){Q.concat(R+": "+this.req[R]+"\n")}}catch(P){}}return Q}}}})();APE.namespace("APE.form");APE.form.Form=function(A){this.form=A};APE.form.Form.prototype={toObject:function(G){var A=this.form,I=A.elements,O,P,B,D,R,M=/^(?:rad|che)/,Q={},C,H,N,J,K,F,L=/^(?:submit|image)$/;if(!I){A=document.createElement("form").appendChild(A.cloneNode(true)).parentNode;I=A.elements}for(O=0,P=I.length;O<P;O++){B=I[O];D=B.type;R=B.name;if(!R||B.disabled||D=="reset"||D=="button"||L.test(D)||(M.test(D)&&!B.checked)||(B.tagName=="OBJECT"&&B.declare)||B.type=="select-multiple"&&!B.value){continue}K=Q[R];if(!K){Q[R]=K=[]}F=K.length;C=B.options;if(C){if(B.type=="select-multiple"){for(N=0,J=C.length;N<J;N++){H=C[N];if(H.selected){K[F]=H.value||H.text}}}else{H=C[B.selectedIndex];if(!H.disabled){K[F]=H.value||H.text}}}else{if(B.type=="file"){var E=B.files;if(E&&E[0]){K[F]=E[0]}}else{K[F]=B.value}}}if(G&&G.name){if(!Q[G.name]){K=Q[G.name]=[]}K[K.length]=G.value}return Q},getMultipartFormData:function(E){var H=this.toObject(E),A,F,B,C,D,I=[],G="\r\n\r\n";for(A in H){F=H[A];for(C=0,D=F.length;C<D;C++){B=F[C];if(!B){continue}I[I.length]='Content-Disposition: form-data; name="'+A+'";'+(B.fileName&&B.getAsBinary?' filename="'+B.fileName+'"'+G+B.getAsBinary():G+B)}}return I},getQueryString:function(G){var D=this.toObject(G),H,C,F,E,A=[],B=/%20/g;for(H in D){F=D[H];E=encodeURIComponent(H);for(C=0,len=F.length;C<len;C++){A[A.length]=E+"="+encodeURIComponent(F[C]).replace(B,"+")}}return A.join("&")},serialize:function(A){var B=this.form.method.toLowerCase();if(B=="get"){return this.form.action+"?"+this.getQueryString(A)}if(B=="post"){if(this.form.enctype=="multipart/form-data"){return this.getMultipartFormData(A)}return this.getQueryString(A)}}};