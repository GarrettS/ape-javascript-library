APE.namespace("APE.ajax").createCustomFactory("AsyncRequest",function(L){L.isSupported=E;var H="XMLHttpRequest",I="ActiveXObject",J=typeof window[H]!="undefined"?H:I,F,A=H==J,C=A||typeof window[I]!="undefined"&&!!B(),G=[];function E(){return C}function B(){return A?new this[J]:K()}function K(){var P=this[J],O,M,Q;if(F){return new P(F)}M=["Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(O=0;O<M.length;O++){try{Q=new P(M[O]);F=M[O];return Q}catch(N){}}C=false}return D;function D(V){var P=0,U=Function.prototype;function T(X,W){this.id=X;this.uri=W.action||typeof W=="string"&&W||"";this.httpMethod=W.method&&W.method.toLowerCase()||"get";this.enctype=W.enctype||"application/x-www-form-urlencoded";if(C){this.req=S()}}function S(){var X,Y,W;for(Y=0;Y<4;Y++){X=G[Y];if(!X){return G[Y]=B()}else{W=X.readyState;if(W===4){X.abort()}if(W===0){return X}}}return B()}function M(Y){Y.timerId=setInterval(W,50);if(Y.timeoutMillis>0){var X=function(){Y.ontimeout();Y.req.abort();N(Y);Y.req.onreadystatechange=U};Y.timeoutID=setTimeout(X,Y.timeoutMillis)}function W(){if(Y.req.readyState===4){Q(Y)}}}function Q(W){var Y=W.req,X=Y.status,Z=X>=200&&X<300||X==304||X==1223;if(Z){N(W,true);W.onsucceed(Y)}else{N(W,false);W.onfail(Y)}W.timerId=clearInterval(W.timerId)}function N(W,X){W.oncomplete({successful:X})}function O(W,X){var Y="---------------------------DATA_"+(++P)+"\n";X=Y+X.join(Y)+Y;W.req.setRequestHeader("Content-Type",W.enctype+"; "+Y)}function R(Y,X){var W=Y?Y.indexOf("?")!==-1?"&":"?":"";return Y+W+X}T.prototype={onabort:U,oncomplete:U,onsucceed:U,onfail:U,ontimeout:U,onsend:U,timeoutMillis:0,get:function(W,X){return this.send(W,X)},post:function(W,X){return this.send(W,X)},send:function(Y,Z){if(!C){return this.onfail()}var X=this.uri;this.timeoutMillis=Z|0||4000;if(this.httpMethod=="get"&&typeof Y=="string"){X=R(X,Y)}this.req.open(this.httpMethod,X,true);M(this);if(typeof this.req.setRequestHeader!="undefined"){this.req.setRequestHeader("X-REQUESTED-WITH","XMLHttpRequest");if(this.httpMethod=="post"){if(typeof Y=="string"){this.req.setRequestHeader("Content-Type",this.enctype)}else{if(Y&&Y.join&&this.enctype=="multipart/form-data"){O(this,Y)}}}}try{this.onsend();this.req.send(Y||null)}catch(W){this.onfail(W)}return this},abort:function(){if(!C){return}this.req.abort();clearTimeout(this.timeoutID);this.onabort(this.req);N(this,false)},toString:function(){var X="AsyncRequest: \nisSupported(): "+C+"\nuri: "+this.uri+"\nmethod: "+this.httpMethod+"\n----------------------\nreq: \n",Y;if(C){for(Y in this.req){try{if(typeof this.req[Y]=="string"){X.concat(Y+": "+this.req[Y]+"\n")}}catch(W){}}}return X}};return T}});