APE.namespace("APE.ajax").createCustomFactory("AsyncRequest",function(L){L.isSupported=E;var H="XMLHttpRequest",I="ActiveXObject",J=typeof window[H]!="undefined"?H:I,F,A=H==J,C=A||typeof window[I]!="undefined"&&!!B(),G=[];function E(){return C}function B(){return A?new this[J]:K()}function K(){var P=this[J],O,M,Q;if(F){return new P(F)}M=["Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(O=0;O<M.length;O++){try{Q=new P(M[O]);F=M[O];return Q}catch(N){}}C=false}return D;function D(V){var O=window.APE,Q=0,U=Function.prototype;function T(X,W){this.id=X;this.uri=W.action||typeof W=="string"&&W;if(!this.uri){throw URIError("formConfig.action = undefined")}this.httpMethod=W.method&&W.method.toLowerCase()||"get";this.enctype=W.enctype||"application/x-www-form-urlencoded";if(C){this.req=S()}}function S(){var X,Y,W;for(Y=0;Y<4;Y++){X=G[Y];if(!X){return G[Y]=B()}else{W=X.readyState;if(W===4){X.abort()}if(W===0){return X}}}return B()}function M(Y){Y.timerId=setInterval(W,50);if(Y.timeoutMillis>0){var X=function(){Y.ontimeout();Y.req.abort();N(Y);Y.req.onreadystatechange=U};Y.timeoutID=setTimeout(X,Y.timeoutMillis)}function W(){if(Y.req.readyState===4){R(Y)}}}function R(W){var Y=W.req,X=Y.status,Z=X>=200&&X<300||X==304||X==1223;if(Z){N(W,true);W.onsucceed(Y)}else{N(W,false);W.onfail(Y)}W.timerId=clearInterval(W.timerId)}function N(W,X){W.oncomplete({successful:X})}function P(W,X){var Y="---------------------------DATA_"+(++Q)+"\n";X=Y+X.join(Y)+Y;W.req.setRequestHeader("Content-Type",W.enctype+"; "+Y)}T.prototype={onabort:U,oncomplete:U,onsucceed:U,onfail:U,ontimeout:U,onsend:U,timeoutMillis:0,send:function(Y,Z){if(!C){return this.onfail()}var X=this.uri;this.timeoutMillis=Z|0||4000;if(this.httpMethod=="get"&&typeof Y=="string"){X+=Y}this.req.open(this.httpMethod,X,true);M(this);if(typeof this.req.setRequestHeader!="undefined"){this.req.setRequestHeader("X-REQUESTED-WITH","XMLHttpRequest");if(this.httpMethod=="post"){if(typeof Y=="string"){this.req.setRequestHeader("Content-Type",this.enctype)}else{if(Y&&Y.join&&this.enctype=="multipart/form-data"){P(this,Y)}}}}try{this.onsend();this.req.send(Y||null)}catch(W){this.onfail(W)}return this},abort:function(){if(!C){return}this.req.abort();clearTimeout(this.timeoutID);this.onabort(this.req);N(this,false)},toString:function(){var X="AsyncRequest: \nisSupported(): "+C+"\nuri: "+this.uri+"\nmethod: "+this.httpMethod+"\n----------------------\nreq: \n",Y;if(C){for(Y in this.req){try{if(typeof this.req[Y]=="string"){X.concat(Y+": "+this.req[Y]+"\n")}}catch(W){}}}return X}};return T}});APE.namespace("APE.form");APE.form.Form=function(A){this.form=A};APE.form.Form.prototype={toObject:function(G){var A=this.form,I=A.elements,O,P,B,D,R,M=/^(?:rad|che)/,Q={},C,H,N,J,K,F,L=/^(?:submit|image)$/;if(!I){A=document.createElement("form").appendChild(A.cloneNode(true)).parentNode;I=A.elements}for(O=0,P=I.length;O<P;O++){B=I[O];D=B.type;R=B.name;if(!R||B.disabled||D=="reset"||D=="button"||L.test(D)||(M.test(D)&&!B.checked)||(B.tagName=="OBJECT"&&B.declare)||B.type=="select-multiple"&&!B.value){continue}K=Q[R];if(!K){Q[R]=K=[]}F=K.length;C=B.options;if(C){if(B.type=="select-multiple"){for(N=0,J=C.length;N<J;N++){H=C[N];if(H.selected){K[F]=H.value||H.text}}}else{H=C[B.selectedIndex];if(!H.disabled){K[F]=H.value||H.text}}}else{if(B.type=="file"){var E=B.files;if(E&&E[0]){K[F]=E[0]}}else{K[F]=B.value}}}if(G&&G.name){if(!Q[G.name]){K=Q[G.name]=[]}K[K.length]=G.value}return Q},getMultipartFormData:function(E){var H=this.toObject(E),A,F,B,C,D,I=[],G="\r\n\r\n";for(A in H){F=H[A];for(C=0,D=F.length;C<D;C++){B=F[C];if(!B){continue}I[I.length]='Content-Disposition: form-data; name="'+A+'";'+(B.fileName&&B.getAsBinary?' filename="'+B.fileName+'"'+G+B.getAsBinary():G+B)}}return I},getQueryString:function(G){var D=this.toObject(G),H,C,F,E,A=[],B=/%20/g;for(H in D){F=D[H];E=encodeURIComponent(H);for(C=0,len=F.length;C<len;C++){A[A.length]=E+"="+encodeURIComponent(F[C]).replace(B,"+")}}return A.join("&")},serialize:function(A){var B=this.form.method.toLowerCase();if(B=="get"){return this.form.action+"?"+this.getQueryString(A)}if(B=="post"){if(this.form.enctype=="multipart/form-data"){return this.getMultipartFormData(A)}return this.getQueryString(A)}}};