APE.namespace("APE.ajax");(function(){APE.ajax.AsyncRequest=APE.createFactory(N,I);function N(Q,O){this.id=Q;this.httpMethod=O.method&&O.method.toLowerCase()||"get";this.uri=O.action;if(!this.uri){throw URIError("formConfig.action = undefined")}this.enctype=O.enctype;if(!this.enctype&&this.httpMethod=="post"){this.enctype=A}this.req=M();this.config={};for(var P in O){this.config[P]=O[P]}}var A="application/x-www-form-urlencoded",G="XMLHttpRequest",J="ActiveXObject",E,K=(G in self)?G:J,H=0,B=G==K,D=B||J in self,F=[];function M(){var P,Q,O;for(Q=0;Q<4;Q++){P=F[Q];if(!P){return F[Q]=C()}else{O=P.readyState;if(O===4){P.abort()}if(O===0){return P}}}return C()}function C(){if(!D){return}return B?new self[K]:L()}function L(){var R=self[K],Q,O,S;if(E){return new R(E)}O=["Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(Q=0;Q<O.length;Q++){try{S=new R(O[Q]);E=O[Q];return S}catch(P){}}D=false}function I(){var P=Function.prototype;function R(U){U.timerId=setInterval(S,50);if(U.timeoutMillis>0){var T=function(){U.ontimeout();U.req.abort();O(U);U.req.onreadystatechange=P};U.timeoutID=setTimeout(T,U.timeoutMillis)}function S(){if(U.req.readyState===4){Q(U)}}}function Q(S){var U=S.req,T=U.status,V=T>=200&&T<300||T==304||T==1223;if(V){O(S,true);S.onsucceed(U)}else{O(S,false);S.onfail(U)}S.timerId=clearInterval(S.timerId)}function O(S,T){S.oncomplete({successful:T})}return{onabort:P,oncomplete:P,onsucceed:P,onfail:P,ontimeout:P,onsend:P,timeoutMillis:0,send:function(U,V){var T=this.uri,W;this.timeoutMillis=V|0||4000;if(this.httpMethod=="get"&&typeof U=="string"){T+=U}this.req.open(this.httpMethod,T,true);R(this);if("setRequestHeader" in this.req){this.req.setRequestHeader("X-REQUESTED-WITH","XMLHttpRequest");if(this.httpMethod=="post"){if(typeof U=="string"){this.req.setRequestHeader("Content-Type",this.enctype)}else{if(U&&typeof U.unshift=="function"&&this.enctype=="multipart/form-data"){W="---------------------------DATA_"+(++H)+"\n";U=W+U.join(W)+W;this.req.setRequestHeader("Content-Type",this.enctype+"; "+W)}}}}try{this.onsend();this.req.send(U||null)}catch(S){this.onfail(S)}return this},abort:function(){this.req.abort();clearTimeout(this.timeoutID);this.onabort(this.req);O(this,false)},toString:function(){var T="AsyncRequest: \nuri: "+this.uri+"\nmethod: "+this.httpMethod+"\n----------------------\nreq: \n",U;for(U in this.req){try{if(typeof this.req[U]=="string"){T.concat(U+": "+this.req[U]+"\n")}}catch(S){}}return T}}}})();APE.namespace("APE.form");APE.form.Form=function(A){this.form=A};APE.form.Form.prototype={toObject:function(G){var A=this.form,I=A.elements,O,P,B,D,R,M=/^(?:rad|che)/,Q={},C,H,N,J,K,F,L=/^(?:submit|image)$/;if(!I){A=document.createElement("form").appendChild(A.cloneNode(true)).parentNode;I=A.elements}for(O=0,P=I.length;O<P;O++){B=I[O];D=B.type;R=B.name;if(!R||B.disabled||D=="reset"||D=="button"||L.test(D)||(M.test(D)&&!B.checked)||(B.tagName=="OBJECT"&&B.declare)||B.type=="select-multiple"&&!B.value){continue}K=Q[R];if(!K){Q[R]=K=[]}F=K.length;C=B.options;if(C){if(B.type=="select-multiple"){for(N=0,J=C.length;N<J;N++){H=C[N];if(H.selected){K[F]=H.value||H.text}}}else{H=C[B.selectedIndex];if(!H.disabled){K[F]=H.value||H.text}}}else{if(B.type=="file"){var E=B.files;if(E&&E[0]){K[F]=E[0]}}else{K[F]=B.value}}}if(G&&G.name){if(!Q[G.name]){K=Q[G.name]=[]}K[K.length]=G.value}return Q},getMultipartFormData:function(E){var H=this.toObject(E),A,F,B,C,D,I=[],G="\r\n\r\n";for(A in H){F=H[A];for(C=0,D=F.length;C<D;C++){B=F[C];if(!B){continue}I[I.length]='Content-Disposition: form-data; name="'+A+'";'+(B.fileName&&B.getAsBinary?' filename="'+B.fileName+'"'+G+B.getAsBinary():G+B)}}return I},getQueryString:function(G){var D=this.toObject(G),H,C,F,E,A=[],B=/%20/g;for(H in D){F=D[H];E=encodeURIComponent(H);for(C=0,len=F.length;C<len;C++){A[A.length]=E+"="+encodeURIComponent(F[C]).replace(B,"+")}}return A.join("&")},serialize:function(A){var B=this.form.method.toLowerCase();if(B=="get"){return this.form.action+"?"+this.getQueryString(A)}if(B=="post"){if(this.form.enctype=="multipart/form-data"){return this.getMultipartFormData(A)}return this.getQueryString(A)}}};